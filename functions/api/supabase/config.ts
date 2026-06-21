import { createClient } from "@supabase/supabase-js";

export async function onRequest(context: any) {
  const { request, env } = context;

  // Handle CORS preflight
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
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "";
  const isSupabaseLive = !!(supabaseUrl && supabaseAnonKey);

  const briefUrl = supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : null;

  return new Response(JSON.stringify({
    configured: isSupabaseLive,
    url: briefUrl,
    supabaseUrl: supabaseUrl,
    supabaseAnonKey: supabaseAnonKey,
    mode: isSupabaseLive ? "Live Production Database" : "Local Functions Memory Emulation",
    suspended: false,
    suspensionReason: "none",
    lastError: null
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
