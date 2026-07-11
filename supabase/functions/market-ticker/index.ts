import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// NIFTY 50 constituents (NSE symbols). Ranked by daily change % to pick
// the top gainers and losers for the public ticker.
const NIFTY_50 = [
  "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK",
  "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV", "BEL", "BHARTIARTL",
  "CIPLA", "COALINDIA", "DRREDDY", "EICHERMOT", "ETERNAL",
  "GRASIM", "HCLTECH", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO",
  "HINDALCO", "HINDUNILVR", "ICICIBANK", "INDUSINDBK", "INFY",
  "ITC", "JIOFIN", "JSWSTEEL", "KOTAKBANK", "LT",
  "M&M", "MARUTI", "NESTLEIND", "NTPC", "ONGC",
  "POWERGRID", "RELIANCE", "SBILIFE", "SBIN", "SHRIRAMFIN",
  "SUNPHARMA", "TATACONSUM", "TATAMOTORS", "TATASTEEL", "TCS",
  "TECHM", "TITAN", "TRENT", "ULTRACEMCO", "WIPRO",
];

// Current date string in IST — the cache refreshes once per IST calendar day.
function istDateString(d: Date): string {
  return new Date(d.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0];
}

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
    const prev = meta?.chartPreviousClose ?? meta?.previousClose;
    if (!price || !prev) return null;
    return {
      symbol,
      price,
      changePct: Number((((price - prev) / prev) * 100).toFixed(2)),
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

    const { data: cache } = await supabaseAdmin
      .from("ticker_cache")
      .select("data, updated_at")
      .eq("id", 1)
      .maybeSingle();

    const today = istDateString(new Date());
    if (cache?.data && istDateString(new Date(cache.updated_at)) === today) {
      return jsonResponse(cache.data);
    }

    const quotes = (
      await Promise.all(NIFTY_50.map((sym) => fetchYahooQuote(sym)))
    ).filter(Boolean) as { symbol: string; price: number; changePct: number }[];

    // Yahoo hiccups happen; only replace the cache with a healthy sample.
    if (quotes.length < 20) {
      if (cache?.data) return jsonResponse(cache.data);
      return jsonResponse({ error: "Market data unavailable" }, 503);
    }

    quotes.sort((a, b) => b.changePct - a.changePct);
    const data = {
      gainers: quotes.slice(0, 5),
      losers: quotes.slice(-5).reverse(),
      as_of: today,
    };

    await supabaseAdmin
      .from("ticker_cache")
      .upsert({ id: 1, data, updated_at: new Date().toISOString() });

    return jsonResponse(data);
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
