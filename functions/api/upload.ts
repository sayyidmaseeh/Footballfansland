export async function onRequest(context: any) {
  const { request, env } = context;

  // 1. Cross-Origin Resource Sharing (CORS) preflight support
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // 2. Parse JSON Request Body containing base64 data
    const body = await request.json();
    const { file, filename, folder = "general" } = body;

    if (!file || !filename) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required file base64 data or filename parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // 3. Resolve bound Cloudflare R2 Object Storage Bucket
    const r2 = env.R2 || env.R2_BUCKET || env.BUCKET;
    if (!r2) {
      // High traffic resilience fallback: If the user hasn't bound R2 in the Cloudflare dashboard yet,
      // return the base64 string directly so users can still preview in-app drawings offline/dynamically.
      console.warn("[Cloudflare R2 API] Warning: R2 bucket was not bound. Falling back to data URI.");
      return new Response(
        JSON.stringify({
          success: true,
          url: file, // Returns base64 as fallback
          filename: `sandbox-${filename}`,
          warning: "R2 bucket is not bound. Storage is falling back to temporary inline caching.",
        }),
        {
          status: 200, // Serve gracefully with warning
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // 4. Decode base64 into a raw binary buffer for storage
    const parts = file.split(",");
    const metadataStr = parts[0];
    const base64Str = parts[1];

    if (!base64Str) {
      throw new Error("Invalid base64 payload format received.");
    }

    const binaryString = atob(base64Str);
    const mimeType = metadataStr.split(":")[1]?.split(";")[0] || "image/jpeg";
    
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 5. Structure object destination key namespace
    const objectKey = `${folder}/${filename}`;

    // 6. Push binary array buffer to R2 block storage with aggressive CDN-caching tags
    await r2.put(objectKey, bytes.buffer, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: "public, max-age=31536000, immutable", // Let Cloudflare CDN cache forever
      },
    });

    // 7. Determine public CDN routing scheme
    const cdnBase = env.R2_PUBLIC_URL || env.VITE_R2_PUBLIC_URL || "https://footballfanland.com/cdn";
    const publicUrl = `${cdnBase}/${objectKey}`;

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        filename: objectKey,
        size: bytes.length,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "R2 binary sequence failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
