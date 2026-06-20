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

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "Invalid JSON request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const { id, team, photo, claimedBy, customText, textBackgroundStyle, imageBorderStyle, hyperlink, mergedWith, isMergedChild, mergedParentId, chats } = body;

  if (photo && typeof photo === "string" && photo.trim().startsWith("data:")) {
    return new Response(JSON.stringify({ success: false, error: "Invalid photo value: must be a hosted URL, not raw image data." }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ success: false, error: "Missing tile Identifier" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || "";
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || "";

  const isSupabaseLive = !!(supabaseUrl && supabaseKey);
  if (!isSupabaseLive) {
    return new Response(JSON.stringify({ success: true, source: "memory" }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("tiles").upsert({
      id,
      team: team || "None",
      photo: photo || null,
      claimed_by: claimedBy || null,
      custom_text: customText || null,
      text_background_style: textBackgroundStyle || "none",
      image_border_style: imageBorderStyle || "none",
      hyperlink: hyperlink || null,
      merged_with: mergedWith || null,
      is_merged_child: !!isMergedChild,
      merged_parent_id: mergedParentId || null,
      chats: chats || [],
      last_claimed_at: new Date().toISOString()
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, source: "supabase" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message, source: "memory" }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
