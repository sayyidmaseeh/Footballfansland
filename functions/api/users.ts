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
  const memoryUsers = [
    { username: 'SuperAdmin 👑', email: 'admin@footballmap.com', favoriteClub: 'None', isAdmin: true, freeSlots: 10, emailVerified: true },
    { username: 'King_Study', email: 'kingforstudy@gmail.com', favoriteClub: 'Argentina', isAdmin: true, freeSlots: 5, emailVerified: true }
  ];

  if (!isSupabaseLive) {
    return new Response(JSON.stringify({ success: true, source: "memory", users: memoryUsers }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;

    const mapped = (data || []).map((u: any) => ({
      username: u.username,
      email: u.email,
      favoriteClub: u.favorite_club || "None",
      isAdmin: !!u.is_admin,
      picture: u.picture || "",
      freeSlots: u.free_slots,
      emailVerified: true
    }));

    return new Response(JSON.stringify({ success: true, source: "supabase", users: mapped }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: true, source: "memory", error: err.message, users: memoryUsers }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
