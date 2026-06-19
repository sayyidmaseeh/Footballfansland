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
  const memoryTiles = {};

  if (!isSupabaseLive) {
    return new Response(JSON.stringify({ success: true, source: "memory", tiles: memoryTiles }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from("tiles").select("*");
    if (error) throw error;

    const tilesMap: Record<string, any> = {};
    (data || []).forEach((row: any) => {
      tilesMap[row.id] = {
        id: row.id,
        team: row.team || "None",
        photo: row.photo || undefined,
        claimedBy: row.claimed_by || undefined,
        customText: row.custom_text || undefined,
        textBackgroundStyle: row.text_background_style || "none",
        imageBorderStyle: row.image_border_style || "none",
        hyperlink: row.hyperlink || undefined,
        mergedWith: row.merged_with || undefined,
        isMergedChild: !!row.is_merged_child,
        mergedParentId: row.merged_parent_id || undefined,
        chats: row.chats || []
      };
    });

    return new Response(JSON.stringify({ success: true, source: "supabase", tiles: tilesMap }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: true, source: "memory", error: err.message, tiles: memoryTiles }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
