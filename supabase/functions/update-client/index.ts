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

    const {
      client_id,
      full_name,
      email,
      phone,
      plan,
      has_stars,
      allocated_amount,
      stars_allocated_amount,
      plan_start_date,
      password,
    } = await req.json();

    if (!client_id) return jsonResponse({ error: "client_id is required" }, 400);

    // Email and password live in auth.users — keep them in sync via the admin API.
    const authUpdates: Record<string, unknown> = {};
    if (email) authUpdates.email = email;
    if (password) authUpdates.password = password;
    if (Object.keys(authUpdates).length > 0) {
      authUpdates.email_confirm = true;
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        client_id,
        authUpdates
      );
      if (authError) return jsonResponse({ error: authError.message }, 400);
    }

    const profileUpdates: Record<string, unknown> = {};
    if (full_name !== undefined) profileUpdates.full_name = full_name;
    if (email !== undefined) profileUpdates.email = email;
    if (phone !== undefined) profileUpdates.phone = phone;
    if (plan !== undefined) profileUpdates.plan = plan;
    if (has_stars !== undefined) profileUpdates.has_stars = has_stars;
    if (allocated_amount !== undefined) profileUpdates.allocated_amount = allocated_amount;
    if (stars_allocated_amount !== undefined) profileUpdates.stars_allocated_amount = stars_allocated_amount;
    if (plan_start_date !== undefined) profileUpdates.plan_start_date = plan_start_date;

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update(profileUpdates)
        .eq("id", client_id);
      if (profileError) return jsonResponse({ error: profileError.message }, 400);
    }

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ error: (err as Error).message }, 500);
  }
});
