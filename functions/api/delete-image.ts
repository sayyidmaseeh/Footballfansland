export async function onRequest(context: any) {
  const { request, env } = context;

  // CORS support
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST" && request.method !== "DELETE") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { url, filename } = body;

    if (!url && !filename) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required 'url' or 'filename' parameter." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Extract object key from either absolute URL or direct filename
    let objectKey = filename || "";
    if (url && !objectKey) {
      try {
        const parsedUrl = new URL(url);
        // Path might be prefix/folder/filename.ext -> strip leading slash
        const pathname = decodedPathname(parsedUrl.pathname);
        objectKey = pathname.startsWith("/") ? pathname.substring(1) : pathname;
        // If there's a CDN subpath mapped e.g. /cdn/folder/file -> strip the `/cdn/` prefix if present
        if (objectKey.startsWith("cdn/")) {
          objectKey = objectKey.substring(4);
        }
      } catch (err) {
        // Fallback to simple parse if URL instance fails
        const parts = url.split("/");
        // Get the last two parts e.g. folder/filename.ext
        if (parts.length >= 2) {
          objectKey = `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
        }
      }
    }

    if (!objectKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Unable to parse a valid object key from the input parameters." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const r2 = env.R2 || env.R2_BUCKET || env.BUCKET;
    if (!r2) {
      // Local development or un-bound R2 warnings
      console.warn("[Cloudflare R2 API] Warning: R2 bucket was not bound for deletion request.");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Simulated deletion success (No R2 bucket bound in serverless environment).",
          deletedKey: objectKey,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Delete the object from R2
    await r2.delete(objectKey);
    console.log(`[R2 Storage Manager] Successfully deleted key: ${objectKey}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Object deleted successfully from R2 container.",
        deletedKey: objectKey,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "R2 deletion execution failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

function decodedPathname(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}
