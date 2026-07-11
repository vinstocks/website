import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CACHE_MINUTES = 5;

// NSE stocks on Yahoo Finance use the .NS suffix. The v8 chart endpoint
// works without cookies/crumbs, unlike the v7 quote endpoint.
async function fetchYahooQuote(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}.NS?interval=1d&range=1d`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    if (!price) return null;
    const prev = meta.chartPreviousClose ?? meta.previousClose ?? 0;
    return {
      price,
      prev,
      changePct: prev ? ((price - prev) / prev) * 100 : 0,
    };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Missing auth header" }, 401);

    const callerClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await callerClient.auth.getUser();
    if (!user) return jsonResponse({ error: "Unauthorized" }, 401);

    const { client_id } = await req.json();
    if (!client_id) return jsonResponse({ error: "client_id is required" }, 400);

    // Callers may refresh their own prices; admins may refresh anyone's.
    if (client_id !== user.id) {
      const { data: prof } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (prof?.role !== "admin") return jsonResponse({ error: "Forbidden" }, 403);
    }

    const { data: stocks } = await supabaseAdmin
      .from("portfolio_stocks")
      .select("id, price_updated_at, master_stocks(symbol)")
      .eq("client_id", client_id);

    if (!stocks || stocks.length === 0) {
      return jsonResponse({ updated: 0, fetched: 0 });
    }

    const cutoff = Date.now() - CACHE_MINUTES * 60 * 1000;
    const stale = stocks.filter(
      (s: any) => !s.price_updated_at || new Date(s.price_updated_at).getTime() < cutoff
    );

    if (stale.length === 0) {
      return jsonResponse({ updated: 0, fetched: 0, cached: true });
    }

    const symbols = [...new Set(stale.map((s: any) => s.master_stocks.symbol))] as string[];
    const quotes: Record<string, { price: number; prev: number; changePct: number }> = {};
    await Promise.all(
      symbols.map(async (sym) => {
        const q = await fetchYahooQuote(sym);
        if (q) quotes[sym] = q;
      })
    );

    const now = new Date().toISOString();
    let updated = 0;
    for (const s of stale as any[]) {
      const q = quotes[s.master_stocks.symbol];
      if (!q) continue;
      const { error } = await supabaseAdmin
        .from("portfolio_stocks")
        .update({
          current_price: q.price,
          previous_price: q.prev,
          daily_change_pct: Number(q.changePct.toFixed(2)),
          price_updated_at: now,
        })
        .eq("id", s.id);
      if (!error) updated++;
    }

    return jsonResponse({ updated, fetched: symbols.length });
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
