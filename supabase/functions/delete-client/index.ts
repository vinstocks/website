import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) return jsonResponse({ error: "Unauthorized" }, 401);

    const { data: callerProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();
    if (callerProfile?.role !== "admin") {
      return jsonResponse({ error: "Admin only" }, 403);
    }

    const { client_id } = await req.json();
    if (!client_id) return jsonResponse({ error: "client_id is required" }, 400);

    // Never delete admin accounts through this endpoint.
    const { data: target } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", client_id)
      .single();
    if (!target) return jsonResponse({ error: "Client not found" }, 404);
    if (target.role === "admin") {
      return jsonResponse({ error: "Cannot delete an admin account" }, 403);
    }

    // Deleting the auth user cascades: profiles → portfolio_stocks →
    // holdings, plus tranches, recommendation_log, sales, alerts.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(client_id);
    if (error) return jsonResponse({ error: error.message }, 400);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
