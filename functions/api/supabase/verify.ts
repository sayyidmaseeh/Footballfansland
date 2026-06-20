import { createClient } from "@supabase/supabase-js";

export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Check CORS / preflight
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
  if (!isSupabaseLive) {
    return new Response(JSON.stringify({
      configured: false,
      missingTables: ["users", "tiles", "blocked_user_emails", "activity_logs"],
      missingBuckets: ["tile-photos"],
      suspended: false,
      suspensionReason: "none"
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const missingTables: string[] = [];
  const checked = ["users", "tiles", "blocked_user_emails", "activity_logs"];

  for (const t of checked) {
    try {
      const { error } = await supabase.from(t).select("count", { count: "exact", head: true }).limit(1);
      if (error && (error.message?.includes("does not exist") || error.code === "PGRST116" || error.message?.includes("relation"))) {
        missingTables.push(t);
      }
    } catch {
      missingTables.push(t);
    }
  }

  const missingBuckets: string[] = []; // Storage is managed completely by Cloudflare R2

  return new Response(JSON.stringify({
    configured: true,
    missingTables,
    missingBuckets,
    suspended: false,
    suspensionReason: "none"
  }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
