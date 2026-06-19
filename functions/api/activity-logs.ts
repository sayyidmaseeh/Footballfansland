import { createClient } from "@supabase/supabase-js";

export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || "";
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || "";

  const isSupabaseLive = !!(supabaseUrl && supabaseKey);
  const memoryActivityLogs = [
    { id: 1, username: 'System', action_type: 'Boot', description: 'Application initialized successfully in Full-Stack Sandbox.', created_at: new Date().toISOString() }
  ];

  if (!isSupabaseLive) {
    return new Response(JSON.stringify({ success: true, source: "memory", logs: memoryActivityLogs }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const mapped = (data || []).map((item: any) => ({
      id: item.id,
      username: item.username,
      action_type: item.action_type || item.action,
      description: item.description,
      created_at: item.created_at
    }));

    return new Response(JSON.stringify({ success: true, source: "supabase", logs: mapped }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: true, source: "memory", error: err.message, logs: memoryActivityLogs }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
