import { createClient } from "@supabase/supabase-js";

export async function onRequest(context: any) {
  const { request, env } = context;

  // 1. CORS Preflight Support for client execution triggers
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Admin-Secret",
      }
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // 2. Administrative authentication check
  const headerSecret = request.headers.get("X-Admin-Secret");
  const configuredSecret = env.ADMIN_CLEANUP_SECRET;

  if (!configuredSecret) {
    return new Response(JSON.stringify({
      success: false,
      error: "Authorization configured incorrectly. Please set ADMIN_CLEANUP_SECRET in your Cloudflare environment variables."
    }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  if (headerSecret !== configuredSecret) {
    return new Response(JSON.stringify({
      success: false,
      error: "Unauthorized: Invalid administrative secret token provided in X-Admin-Secret header."
    }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  // 3. Resolve active Supabase credentials
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || "";
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({
      success: false,
      error: "Supabase service configuration is incomplete. Ensure SUPABASE_SERVICE_ROLE_KEY is set in your Pages console configs."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Query only tiles where photo matches the corrupted base64 data URI pattern
    const { data: tiles, error: fetchError } = await supabase
      .from("tiles")
      .select("id, photo")
      .like("photo", "data:%");

    if (fetchError) {
      throw fetchError;
    }

    if (!tiles || tiles.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        clearedCount: 0,
        clearedTileIds: [],
        note: "No corrupted base64 payload strings found. The tiles database is completely healthy and compliant with Cloudflare R2 CDN targets."
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const clearedTileIds: string[] = [];

    // 5. Sequentially reset matching broken row cell references to null
    const updatePromises = tiles.map(async (tile: any) => {
      const { error: updateError } = await supabase
        .from("tiles")
        .update({ photo: null })
        .eq("id", tile.id);

      if (!updateError) {
        clearedTileIds.push(tile.id);
        console.log(`[Admin Data Cleanup] Cleared corrupted base64 photo for tile ID: ${tile.id}`);
      } else {
        console.error(`[Admin Data Cleanup] Failed to clear tile ID ${tile.id}: ${updateError.message}`);
      }
    });

    await Promise.all(updatePromises);

    return new Response(JSON.stringify({
      success: true,
      clearedCount: clearedTileIds.length,
      clearedTileIds: clearedTileIds,
      note: "Affected users will need to re-upload their tile photo manually, as the discard of the non-hosted base64 data stream was required to stabilize client grid performance.",
      disclaimer: "Data cleanup executed successfully. No other claim details, text blocks, or team attributes were modified."
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || "Database transaction aborted"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
