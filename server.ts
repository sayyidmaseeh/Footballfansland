import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body requests with safe ceiling for Base64 image transfers
app.use(express.json({ limit: "15mb" }));

// Resolve keys securely on the server
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

const isSupabaseLive = !!(supabaseUrl && supabaseKey);
const supabase = isSupabaseLive ? createClient(supabaseUrl, supabaseKey) : null;

console.log(`[Supabase Link] Live DB configuration detected: ${isSupabaseLive}`);

// Supabase dynamic state machine variables
let supabaseSuspended = false;
let supabaseSuspensionReason: "none" | "auth_failed" | "network_failed" | "schema_failed" = "none";
let lastDbError = "";

function inspectErrorAndSuspend(err: any): void {
  if (!err) return;
  const msg = err.message || "";
  lastDbError = msg;

  if (msg.includes("fetch failed") || msg.includes("Failed to fetch") || msg.includes("ENOTFOUND")) {
    supabaseSuspended = true;
    supabaseSuspensionReason = "network_failed";
    console.log(`[Supabase Status] Network fallback initialized (${msg})`);
  } else if (msg.includes("Invalid API key") || msg.includes("ApiKey") || msg.includes("invalid-api-key") || msg.includes("JWT")) {
    supabaseSuspended = true;
    supabaseSuspensionReason = "auth_failed";
    console.log(`[Supabase Status] Credentials fallback initialized (${msg})`);
  } else if (msg.includes("Could not find the table") || msg.includes("relation") || msg.includes("does not exist")) {
    supabaseSuspended = true;
    supabaseSuspensionReason = "schema_failed";
    console.log(`[Supabase Status] Schema fallback initialized (${msg})`);
  }
}

// Server Memory Sandbox Fallbacks (to endure clean sandbox runtime restarts elegantly)
let memoryTiles: Record<string, any> = {};
let memoryUsers: any[] = [
  { username: 'SuperAdmin 👑', email: 'admin@footballmap.com', favoriteClub: 'None', isAdmin: true, freeSlots: 10, emailVerified: true },
  { username: 'King_Study', email: 'kingforstudy@gmail.com', favoriteClub: 'Argentina', isAdmin: true, freeSlots: 5, emailVerified: true }
];
let memoryActivityLogs: any[] = [
  { id: 1, username: 'System', action_type: 'Boot', description: 'Application initialized successfully in Full-Stack Sandbox.', created_at: new Date().toISOString() }
];
const memoryBlockedEmails: string[] = [];

// Helper to secure check if a table is accessible in Supabase
async function verifyTable(tableName: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from(tableName).select("count", { count: "exact", head: true }).limit(1);
    if (error) {
      inspectErrorAndSuspend(error);
      if (error.message?.includes("does not exist") || error.code === "PGRST116" || error.message?.includes("relation")) {
        return false;
      }
      return false;
    }
    return true;
  } catch (err: any) {
    inspectErrorAndSuspend(err);
    return false;
  }
}

// -------------------------------------------------------------
// Live APIs
// -------------------------------------------------------------

// Config detection
app.get("/api/supabase/config", (req, res) => {
  res.json({
    configured: isSupabaseLive,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : null,
    mode: isSupabaseLive && !supabaseSuspended ? "Live Production Database" : "Local Server Memory Emulation",
    suspended: supabaseSuspended,
    suspensionReason: supabaseSuspensionReason,
    lastError: lastDbError
  });
});

// Verification check
app.get("/api/supabase/verify", async (req, res) => {
  if (!supabase || supabaseSuspended) {
    return res.json({ 
      configured: false, 
      missingTables: ["users", "tiles", "blocked_user_emails", "activity_logs"], 
      missingBuckets: ["tile-photos"],
      suspended: supabaseSuspended,
      suspensionReason: supabaseSuspensionReason
    });
  }
  const missingTables: string[] = [];
  const checked = ["users", "tiles", "blocked_user_emails", "activity_logs"];

  for (const t of checked) {
    const active = await verifyTable(t);
    if (!active) {
      missingTables.push(t);
    }
  }

  const missingBuckets: string[] = [];
  try {
    const { error } = await supabase.storage.getBucket("tile-photos");
    if (error) {
      inspectErrorAndSuspend(error);
      missingBuckets.push("tile-photos");
    }
  } catch (err) {
    inspectErrorAndSuspend(err);
    missingBuckets.push("tile-photos");
  }

  res.json({
    configured: !supabaseSuspended,
    missingTables,
    missingBuckets,
    suspended: supabaseSuspended,
    suspensionReason: supabaseSuspensionReason
  });
});

// GET Tiles
app.get("/api/tiles", async (req, res) => {
  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory", tiles: memoryTiles });
  }

  try {
    const { data, error } = await supabase.from("tiles").select("*");
    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }

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

    res.json({ success: true, source: "supabase", tiles: tilesMap });
  } catch (err: any) {
    console.log("[Supabase Status] Handled tiles fetch fallback:", err.message);
    res.json({ success: true, source: "memory", error: err.message, tiles: memoryTiles });
  }
});

// POST Save Tile
app.post("/api/tiles/save", async (req, res) => {
  const { id, team, photo, claimedBy, customText, textBackgroundStyle, imageBorderStyle, hyperlink, mergedWith, isMergedChild, mergedParentId, chats } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, error: "Missing tile Identifier" });
  }

  // Update memory clone instantly
  const tilePayload = {
    id,
    team: team || "None",
    photo,
    claimedBy,
    customText,
    textBackgroundStyle: textBackgroundStyle || "none",
    imageBorderStyle: imageBorderStyle || "none",
    hyperlink,
    mergedWith,
    isMergedChild: !!isMergedChild,
    mergedParentId,
    chats: chats || []
  };
  memoryTiles[id] = tilePayload;

  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory" });
  }

  try {
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

    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }
    res.json({ success: true, source: "supabase" });
  } catch (err: any) {
    console.log("[Supabase Status] Handled tile save fallback:", err.message);
    res.json({ success: false, error: err.message, source: "memory" });
  }
});

// POST Release Tile
app.post("/api/tiles/release", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: "Missing tile identifier" });
  }

  if (memoryTiles[id]) {
    memoryTiles[id] = {
      ...memoryTiles[id],
      team: "None",
      claimedBy: undefined,
      customText: undefined,
      photo: "",
      mergedWith: undefined,
      isMergedChild: false,
      mergedParentId: undefined
    };
  }

  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory" });
  }

  try {
    const { error } = await supabase.from("tiles").update({
      team: "None",
      photo: null,
      claimed_by: null,
      custom_text: null,
      text_background_style: "none",
      image_border_style: "none",
      hyperlink: null,
      merged_with: null,
      is_merged_child: false,
      merged_parent_id: null
    }).eq("id", id);

    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }
    res.json({ success: true, source: "supabase" });
  } catch (err: any) {
    console.log("[Supabase Status] Handled tile release fallback:", err.message);
    res.json({ success: false, error: err.message, source: "memory" });
  }
});

// GET Users
app.get("/api/users", async (req, res) => {
  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory", users: memoryUsers });
  }

  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }

    const mapped = (data || []).map((u: any) => ({
      username: u.username,
      email: u.email,
      favoriteClub: u.favorite_club || "None",
      isAdmin: !!u.is_admin,
      picture: u.picture || "",
      freeSlots: u.free_slots,
      emailVerified: true
    }));

    res.json({ success: true, source: "supabase", users: mapped });
  } catch (err: any) {
    console.log("[Supabase Status] Handled users load fallback:", err.message);
    res.json({ success: true, source: "memory", error: err.message, users: memoryUsers });
  }
});

// POST Upsert User
app.post("/api/users/upsert", async (req, res) => {
  const { username, email, favoriteClub, isAdmin, picture, freeSlots } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Missing user email key" });
  }

  // Update memory
  const idx = memoryUsers.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  const existing = idx >= 0 ? memoryUsers[idx] : null;

  const newUser = {
    username: username || (existing ? existing.username : "Fan"),
    email: email.toLowerCase(),
    favoriteClub: favoriteClub || (existing ? existing.favoriteClub : "Argentina"),
    isAdmin: isAdmin !== undefined ? !!isAdmin : (existing ? existing.isAdmin : false),
    picture: picture || (existing ? existing.picture : ""),
    freeSlots: freeSlots !== undefined ? freeSlots : (existing ? existing.freeSlots : 3),
    emailVerified: true
  };

  if (idx >= 0) {
    memoryUsers[idx] = newUser;
  } else {
    memoryUsers.push(newUser);
  }

  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory" });
  }

  try {
    const { error } = await supabase.from("users").upsert({
      email: email.toLowerCase(),
      username: newUser.username,
      favorite_club: newUser.favoriteClub,
      is_admin: newUser.isAdmin,
      picture: newUser.picture,
      free_slots: newUser.freeSlots
    }, {
      onConflict: "email"
    });

    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }
    res.json({ success: true, source: "supabase" });
  } catch (err: any) {
    console.log("[Supabase Status] Handled profile save fallback:", err.message);
    res.json({ success: false, error: err.message, source: "memory" });
  }
});

// POST Delete User
app.post("/api/users/delete", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Missing email key" });
  }

  memoryUsers = memoryUsers.filter((u) => u.email.toLowerCase() !== email.toLowerCase());

  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory" });
  }

  try {
    const { error } = await supabase.from("users").delete().eq("email", email.toLowerCase());
    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }
    res.json({ success: true, source: "supabase" });
  } catch (err: any) {
    console.log("[Supabase Status] Handled user deletion fallback:", err.message);
    res.json({ success: false, error: err.message, source: "memory" });
  }
});

// GET Activity Logs
app.get("/api/activity-logs", async (req, res) => {
  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory", logs: memoryActivityLogs });
  }

  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }

    const mapped = (data || []).map((item: any) => ({
      id: item.id,
      username: item.username,
      action_type: item.action_type || item.action,
      description: item.description,
      created_at: item.created_at
    }));

    res.json({ success: true, source: "supabase", logs: mapped });
  } catch (err: any) {
    console.log("[Supabase Status] Handled activity logs fetch fallback:", err.message);
    res.json({ success: true, source: "memory", error: err.message, logs: memoryActivityLogs });
  }
});

// POST Add Activity Log
app.post("/api/activity-logs/add", async (req, res) => {
  const { username, action_type, description } = req.body;

  const newLog = {
    id: Date.now(),
    username: username || "Guest",
    action_type: action_type || "Info",
    description: description || "",
    created_at: new Date().toISOString()
  };

  memoryActivityLogs.unshift(newLog);
  if (memoryActivityLogs.length > 200) {
    memoryActivityLogs = memoryActivityLogs.slice(0, 200);
  }

  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory" });
  }

  try {
    const { error } = await supabase.from("activity_logs").insert({
      username: newLog.username,
      action_type: newLog.action_type,
      description: newLog.description
    });

    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }
    res.json({ success: true, source: "supabase" });
  } catch (err: any) {
    console.log("[Supabase Status] Handled action log addition fallback:", err.message);
    res.json({ success: false, error: err.message, source: "memory" });
  }
});

// GET Blocked Emails
app.get("/api/blocked-emails", async (req, res) => {
  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory", blocked: memoryBlockedEmails });
  }

  try {
    const { data, error } = await supabase.from("blocked_user_emails").select("email");
    if (error) {
      inspectErrorAndSuspend(error);
      throw error;
    }

    const list = (data || []).map((x: any) => x.email.toLowerCase());
    res.json({ success: true, source: "supabase", blocked: list });
  } catch (err: any) {
    console.log("[Supabase Status] Handled blocked list fetch fallback:", err.message);
    res.json({ success: true, source: "memory", error: err.message, blocked: memoryBlockedEmails });
  }
});

// POST Block/Unblock Email
app.post("/api/blocked-emails/set", async (req, res) => {
  const { email, isBanned } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Missing email key" });
  }

  const cleanEmail = email.toLowerCase();
  const idx = memoryBlockedEmails.indexOf(cleanEmail);

  if (isBanned && idx === -1) {
    memoryBlockedEmails.push(cleanEmail);
  } else if (!isBanned && idx >= 0) {
    memoryBlockedEmails.splice(idx, 1);
  }

  if (!supabase || supabaseSuspended) {
    return res.json({ success: true, source: "memory" });
  }

  try {
    if (isBanned) {
      const { error } = await supabase.from("blocked_user_emails").upsert({ email: cleanEmail });
      if (error) {
        inspectErrorAndSuspend(error);
        throw error;
      }
    } else {
      const { error } = await supabase.from("blocked_user_emails").delete().eq("email", cleanEmail);
      if (error) {
        inspectErrorAndSuspend(error);
        throw error;
      }
    }
    res.json({ success: true, source: "supabase" });
  } catch (err: any) {
    console.log("[Supabase Status] Handled blocked email modification fallback:", err.message);
    res.json({ success: false, error: err.message, source: "memory" });
  }
});


// -------------------------------------------------------------
// Dev & Production serving
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to port 3000 on host 0.0.0.0
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack Server] Server running on http://localhost:${PORT}`);
  });
}

startServer();
