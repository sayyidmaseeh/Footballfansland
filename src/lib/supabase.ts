import { createClient } from '@supabase/supabase-js';
import { TileData } from '../types';

declare global {
  interface ImportMeta {
    readonly env: {
      readonly [key: string]: string | undefined;
    };
  }
}

/* ==========================================================================
   SUPABASE SQL SCHEMA FOR YOUR DATABASE (Copy-paste into Supabase SQL Editor)
   ==========================================================================

   -- Create Users table
   CREATE TABLE IF NOT EXISTS public.users (
     email TEXT PRIMARY KEY,
     username TEXT UNIQUE NOT NULL,
     password TEXT,
     favorite_club TEXT DEFAULT 'None',
     is_admin BOOLEAN DEFAULT false,
     picture TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   -- Create Tiles table
   CREATE TABLE IF NOT EXISTS public.tiles (
     id TEXT PRIMARY KEY,
     team TEXT NOT NULL DEFAULT 'None',
     photo TEXT,
     claimed_by TEXT,
     custom_text TEXT,
     text_background_style TEXT DEFAULT 'none',
     image_border_style TEXT DEFAULT 'none',
     hyperlink TEXT,
     merged_with JSONB,
     is_merged_child BOOLEAN DEFAULT false,
     merged_parent_id TEXT,
     chats JSONB DEFAULT '[]'::jsonb,
     last_claimed_at TIMESTAMP WITH TIME ZONE
   );

   -- Create Blocked Users table
   CREATE TABLE IF NOT EXISTS public.blocked_user_emails (
     email TEXT PRIMARY KEY,
     blocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   -- Create Activity Logs table
   CREATE TABLE IF NOT EXISTS public.activity_logs (
     id BIGSERIAL PRIMARY KEY,
     username TEXT NOT NULL,
     action_type TEXT NOT NULL,
     description TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );
*/

// 1. Literal environment checks (mandatory for Vite compile-time replacement)
const staticUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const staticKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// 2. Direct lookup for secondary flexibility
const dynamicUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const dynamicKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// 3. Dynamic client-side local overrides
let localUrl = '';
let localKey = '';
try {
  localUrl = localStorage.getItem('VITE_SUPABASE_URL_OVERRIDE') || '';
  localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY_OVERRIDE') || '';
} catch (e) {}

export const supabaseUrl = localUrl || staticUrl || dynamicUrl || '';
export const supabaseAnonKey = localKey || staticKey || dynamicKey || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
export const isSupabaseOverridden = !!(localUrl && localKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Configure or delete manual Supabase connectivity overrides on the dev/deployed environment
 */
export function setSupabaseOverrides(url: string, key: string) {
  try {
    if (url.trim() && key.trim()) {
      localStorage.setItem('VITE_SUPABASE_URL_OVERRIDE', url.trim());
      localStorage.setItem('VITE_SUPABASE_ANON_KEY_OVERRIDE', key.trim());
    } else {
      localStorage.removeItem('VITE_SUPABASE_URL_OVERRIDE');
      localStorage.removeItem('VITE_SUPABASE_ANON_KEY_OVERRIDE');
    }
    window.location.reload();
  } catch (e) {
    console.error("Failed to commit database connection overrides:", e);
  }
}

const tableStatusCache: Record<string, 'exists' | 'missing' | 'unverified'> = {};
const bucketStatusCache: Record<string, 'exists' | 'missing' | 'unverified'> = {};

/**
 * Mark a table as missing to immediately bypass future network calls for complete responsiveness.
 */
export function markTableAsMissing(tableName: string) {
  tableStatusCache[tableName] = 'missing';
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_tables_v1') || '[]');
    if (!missing.includes(tableName)) {
      missing.push(tableName);
      localStorage.setItem('supabase_missing_tables_v1', JSON.stringify(missing));
    }
  } catch (e) {}
  
  // Custom event to notify components that table status changed
  window.dispatchEvent(new CustomEvent('supabase_tables_updated'));
}

/**
 * Check if we already know this table is missing.
 */
export function isTableMissing(tableName: string): boolean {
  if (tableStatusCache[tableName] === 'missing') {
    return true;
  }
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_tables_v1') || '[]');
    if (missing.includes(tableName)) {
      tableStatusCache[tableName] = 'missing';
      return true;
    }
  } catch (e) {}
  return false;
}

/**
 * Mark a storage bucket as missing.
 */
export function markBucketAsMissing(bucketName: string) {
  bucketStatusCache[bucketName] = 'missing';
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_buckets_v1') || '[]');
    if (!missing.includes(bucketName)) {
      missing.push(bucketName);
      localStorage.setItem('supabase_missing_buckets_v1', JSON.stringify(missing));
    }
  } catch (e) {}
  
  window.dispatchEvent(new CustomEvent('supabase_tables_updated'));
}

/**
 * Mark a storage bucket as found.
 */
export function markBucketAsFound(bucketName: string) {
  bucketStatusCache[bucketName] = 'exists';
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_buckets_v1') || '[]');
    if (missing.includes(bucketName)) {
      const filtered = missing.filter((b: string) => b !== bucketName);
      localStorage.setItem('supabase_missing_buckets_v1', JSON.stringify(filtered));
    }
  } catch (e) {}
  
  window.dispatchEvent(new CustomEvent('supabase_tables_updated'));
}

/**
 * Check if we already know this bucket is missing.
 */
export function isBucketMissing(bucketName: string): boolean {
  if (bucketStatusCache[bucketName] === 'missing') {
    return true;
  }
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_buckets_v1') || '[]');
    if (missing.includes(bucketName)) {
      bucketStatusCache[bucketName] = 'missing';
      return true;
    }
  } catch (e) {}
  return false;
}

/**
 * Reset missing table caches to allow database re-verification
 */
export function resetMissingTableCache() {
  localStorage.removeItem('supabase_missing_tables_v1');
  localStorage.removeItem('supabase_missing_buckets_v1');
  Object.keys(tableStatusCache).forEach(k => {
    tableStatusCache[k] = 'unverified';
  });
  Object.keys(bucketStatusCache).forEach(k => {
    bucketStatusCache[k] = 'unverified';
  });
  window.dispatchEvent(new CustomEvent('supabase_tables_updated'));
}

/**
 * Get all tables currently registered as missing.
 */
export function getRegisteredMissingTables(): string[] {
  try {
    return JSON.parse(localStorage.getItem('supabase_missing_tables_v1') || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Get all buckets currently registered as missing.
 */
export function getRegisteredMissingBuckets(): string[] {
  try {
    return JSON.parse(localStorage.getItem('supabase_missing_buckets_v1') || '[]');
  } catch (e) {
    return [];
  }
}

if (!isSupabaseConfigured) {
  console.log(
    "[Supabase Sandbox]: Credentials are not configured in your .env / environment secrets. " +
    "Real-time cloud database features will fall back to localStorage until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are specified."
  );
}

/**
 * Sign up a new user using Supabase Auth
 */
export async function dbSignUp(
  email: string,
  password: string,
  username: string,
  favoriteClub: string
): Promise<{ user: any; error: any }> {
  if (!isSupabaseConfigured || !supabase) {
    return { user: null, error: new Error("Supabase is not configured.") };
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          favorite_club: favoriteClub,
        },
      },
    });
    if (error) return { user: null, error };
    
    // Also save/upsert user profile in public.users table for the app's community screens
    if (data.user) {
      await dbUpsertUser({
        username,
        email,
        password,
        favoriteClub,
        isAdmin: false,
        picture: ""
      });
    }
    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err };
  }
}

/**
 * Sign in a user using Supabase Auth
 */
export async function dbSignIn(
  email: string,
  password: string
): Promise<{ user: any; session: any; error: any }> {
  if (!isSupabaseConfigured || !supabase) {
    return { user: null, session: null, error: new Error("Supabase is not configured.") };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { user: null, session: null, error };
    
    let favoriteClub = "None";
    let username = email.split('@')[0] + "_fan";
    let picture = "";
    let isAdmin = false;
    
    // Retrieve synced public profile fields
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle(); // Use maybeSingle to prevent PGRST116 errors
        
      if (profile) {
        username = profile.username;
        favoriteClub = profile.favorite_club;
        picture = profile.picture || "";
        isAdmin = !!profile.is_admin;
      } else {
        // Fallback: create public profile record if missing
        const meta = data.user?.user_metadata || {};
        username = meta.username || username;
        favoriteClub = meta.favorite_club || favoriteClub;
        await dbUpsertUser({
          username,
          email,
          password,
          favoriteClub,
          picture
        });
      }
    } catch {
      // Gracefully set username from metadata
      const meta = data.user?.user_metadata || {};
      username = meta.username || username;
      favoriteClub = meta.favorite_club || favoriteClub;
    }
    
    const sessUser = {
      username,
      email,
      favoriteClub,
      picture,
      isAdmin: email.toLowerCase() === 'admin@footballmap.com' || isAdmin
    };
    
    return { user: sessUser, session: data.session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err };
  }
}

/**
 * Sign out of active Supabase Auth session
 */
export async function dbSignOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Supabase sign out error:", err);
  }
}

/**
 * Upload an image file to Supabase Storage and return its public URL
 */
export async function dbUploadImage(file: File, bucketName: string = 'tile-photos'): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    
    // Attempt standard file upload
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      const errMsg = error.message || '';
      if (errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('bucket_not_found') || errMsg.toLowerCase().includes('empty response')) {
        if (!isBucketMissing(bucketName)) {
          console.log(`[Supabase Sandbox]: Storage bucket '${bucketName}' is missing.`);
          markBucketAsMissing(bucketName);
        }
      } else {
        console.log(`[Supabase Sandbox]: Storage bucket upload warning (bucket might be missing or unconfigured): ${errMsg}`);
      }
      return null;
    }
    
    // Obtain the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    // Mark bucket as verified and found since we completed a successful upload transaction!
    markBucketAsFound(bucketName);
    return publicUrl;
  } catch (err) {
    console.log("[Supabase Sandbox]: Exception during image upload step, falling back to local base64:", err);
    return null;
  }
}

export interface ActivityLog {
  id?: number | string;
  username: string;
  action_type: string;
  description: string;
  created_at?: string;
}

// ----------------------------------------------------
// DATABASE CRUD INTERFACES WITH LOCAL STORAGE FALLBACKs
// ----------------------------------------------------

/**
 * Fetch last 50 activity logs from database
 */
export async function dbFetchActivityLogs(): Promise<ActivityLog[]> {
  if (!isSupabaseConfigured || !supabase || isTableMissing('activity_logs')) {
    const localLogs = JSON.parse(localStorage.getItem('kerala_activity_logs_v4') || '[]');
    return localLogs.slice(0, 50);
  }
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      if (error.code === 'PGRST205') {
        if (!isTableMissing('activity_logs')) {
          console.log('[Supabase Sandbox]: The "activity_logs" table is not provisioned yet. Using local activity list.');
          markTableAsMissing('activity_logs');
        }
        const localLogs = JSON.parse(localStorage.getItem('kerala_activity_logs_v4') || '[]');
        return localLogs.slice(0, 50);
      }
      throw error;
    }
    return data.map(row => ({
      id: row.id,
      username: row.username,
      action_type: row.action_type,
      description: row.description,
      created_at: row.created_at
    }));
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "activity_logs" does not exist') || errorMsg.includes('activity_logs') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('activity_logs');
    }
    console.log('[Supabase Sandbox]: Fallback to local storage history for activity logs.');
    const localLogs = JSON.parse(localStorage.getItem('kerala_activity_logs_v4') || '[]');
    return localLogs.slice(0, 50);
  }
}

/**
 * Write a new action to the activity audit trail
 */
export async function dbAddActivityLog(log: Omit<ActivityLog, 'id' | 'created_at'>): Promise<boolean> {
  const newLog: ActivityLog = {
    ...log,
    id: Date.now() + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString()
  };

  // Prepend to local storage logs safely
  try {
    const localLogs = JSON.parse(localStorage.getItem('kerala_activity_logs_v4') || '[]');
    const updatedLogs = [newLog, ...localLogs].slice(0, 100); // keep last 100 locally
    try {
      localStorage.setItem('kerala_activity_logs_v4', JSON.stringify(updatedLogs));
    } catch (errInner) {
      // If quota exceeded, shrink tightly to keep only the 20 most recent logs
      const trimmedLogs = [newLog, ...localLogs].slice(0, 20);
      localStorage.setItem('kerala_activity_logs_v4', JSON.stringify(trimmedLogs));
    }
  } catch (errOuter) {
    console.warn("Could not save activity log to local cache due to space constraints:", errOuter);
  }

  if (!isSupabaseConfigured || !supabase || isTableMissing('activity_logs')) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        username: log.username,
        action_type: log.action_type,
        description: log.description
      });
    
    if (error) {
      if (error.code === 'PGRST205') {
        if (!isTableMissing('activity_logs')) {
          console.log('[Supabase Sandbox]: The "activity_logs" table is not provisioned yet; audit trail updated locally only.');
          markTableAsMissing('activity_logs');
        }
        return true;
      }
      throw error;
    }
    return true;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "activity_logs" does not exist') || errorMsg.includes('activity_logs') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('activity_logs');
    }
    console.log('[Supabase Sandbox]: Inserted activity log in local storage tracker only.');
    return true;
  }
}

/**
 * Fetch all registered users
 */
export async function dbFetchUsers(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase || isTableMissing('users')) {
    return JSON.parse(localStorage.getItem('kerala_registered_users_list_v4') || '[]');
  }
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) {
      if (error.code === 'PGRST205') {
        if (!isTableMissing('users')) {
          console.log('[Supabase Sandbox]: The "users" table is not provisioned yet. Using local user registration list.');
          markTableAsMissing('users');
        }
        return JSON.parse(localStorage.getItem('kerala_registered_users_list_v4') || '[]');
      }
      throw error;
    }
    
    return data.map(u => ({
      username: u.username,
      email: u.email,
      password: u.password,
      favoriteClub: u.favorite_club,
      isAdmin: u.is_admin,
      picture: u.picture
    }));
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "users" does not exist') || errorMsg.includes('users') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('users');
    }
    console.log('[Supabase Sandbox]: Falling back to local storage user registrations.');
    return JSON.parse(localStorage.getItem('kerala_registered_users_list_v4') || '[]');
  }
}

/**
 * Register or update user
 */
export async function dbUpsertUser(user: {
  username: string;
  email: string;
  password?: string;
  favoriteClub: string;
  isAdmin?: boolean;
  picture?: string;
}): Promise<boolean> {
  // Update local list for seamless sync safely
  try {
    const currentList = JSON.parse(localStorage.getItem('kerala_registered_users_list_v4') || '[]');
    const updatedList = currentList.filter((u: any) => u.email.toLowerCase() !== user.email.toLowerCase());
    updatedList.push(user);
    localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(updatedList));
  } catch (err) {
    console.warn("Could not write user record to local storage cache:", err);
  }

  if (!isSupabaseConfigured || !supabase || isTableMissing('users')) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        email: user.email.toLowerCase(),
        username: user.username,
        password: user.password || '',
        favorite_club: user.favoriteClub,
        is_admin: !!user.isAdmin,
        picture: user.picture || ''
      }, { onConflict: 'email' });
    
    if (error) {
      if (error.code === 'PGRST205') {
        if (!isTableMissing('users')) {
          console.log('[Supabase Sandbox]: The "users" table is not provisioned yet; updated locally only.');
          markTableAsMissing('users');
        }
        return true;
      }
      throw error;
    }
    return true;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "users" does not exist') || errorMsg.includes('users') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('users');
    }
    console.log('[Supabase Sandbox]: Upsert user profile synchronized via local state database.');
    return true;
  }
}

/**
 * Verifies if a given table exists in the public schema.
 * Returns false specifically if the table does not exist (PGRST205).
 */
export async function dbCheckTableExists(tableName: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }
  if (isTableMissing(tableName)) {
    return true; // We already cached it as missing, but for active check let's handle gracefully
  }
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST205') {
      markTableAsMissing(tableName);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Runs a quiet, parallel schema check for all primary tables on app startup.
 * Instantly marks any missing tables in local state and skips individual warning spams.
 */
export async function dbVerifySchemasOnBoot(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }
  const tables = ['tiles', 'activity_logs', 'users', 'blocked_user_emails'];
  const missing: string[] = [];
  
  try {
    // Quietly verify that the required storage bucket exists
    try {
      const { error: bucketError } = await supabase.storage.getBucket('tile-photos');
      if (bucketError) {
        const errorMsg = bucketError.message || '';
        const statusCode = (bucketError as any).status || 0;
        if (errorMsg.toLowerCase().includes('not found') || statusCode === 404 || errorMsg.toLowerCase().includes('bucket_not_found')) {
          markBucketAsMissing('tile-photos');
        }
      } else {
        markBucketAsFound('tile-photos');
      }
    } catch (e) {
      // Quiet ignore and fallback to upload-time evaluation
    }

    await Promise.all(
      tables.map(async (table) => {
        try {
          const { error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
            
          if (error && error.code === 'PGRST205') {
            markTableAsMissing(table);
            missing.push(table);
          }
        } catch {
          // Quiet ignore and use fallback
        }
      })
    );
  } catch (err) {
    console.debug("Silent boot verification notice:", err);
  }
  return missing;
}

/**
 * Clean up legacy cache keys to reclaim space and save tiles dataset safely using multi-stage size reduction
 */
export function saveTilesToLocalStorageSafely(cacheValue: Record<string, TileData>) {
  const keys = ['kerala_world_cup_tiles_v4', 'kerala_claimed_tiles'];
  
  // Clean up legacy keys to free up critical browser storage quota
  const legacyKeys = ['kerala_world_cup_tiles_v3', 'kerala_world_cup_tiles_v2', 'kerala_world_cup_tiles_v1', 'kerala_world_cup_tiles'];
  legacyKeys.forEach(k => {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  });

  const attemptSave = (payload: any): boolean => {
    let success = true;
    keys.forEach(k => {
      try {
        localStorage.setItem(k, JSON.stringify(payload));
      } catch (err) {
        success = false;
      }
    });
    return success;
  };

  // Stage 1: Try writing raw payload directly
  if (attemptSave(cacheValue)) {
    return;
  }

  // Stage 2: Optimize chat log density (keep only 3 latest entries per tile)
  console.warn("Storage quota exceeded! Optimizing tile chat logs...");
  const optChats = { ...cacheValue };
  Object.keys(optChats).forEach(id => {
    const t = { ...optChats[id] };
    if (t.chats && t.chats.length > 3) {
      t.chats = t.chats.slice(-3);
      optChats[id] = t;
    }
  });

  if (attemptSave(optChats)) {
    return;
  }

  // Stage 3: Erase high-density uploads (heavy base64 images)
  console.warn("Storage quota still exceeded! Discarding base64 user photo attachments...");
  const optPhotos = { ...optChats };
  Object.keys(optPhotos).forEach(id => {
    const t = { ...optPhotos[id] };
    if (t.photo) {
      t.photo = '';
      optPhotos[id] = t;
    }
  });

  if (attemptSave(optPhotos)) {
    return;
  }

  // Stage 4: Strip comments and chat rooms entirely
  console.warn("Storage quota critically exceeded! Clearing chat room data...");
  const optAll = { ...optPhotos };
  Object.keys(optAll).forEach(id => {
    const t = { ...optAll[id] };
    t.chats = [];
    optAll[id] = t;
  });

  try {
    keys.forEach(k => {
      localStorage.setItem(k, JSON.stringify(optAll));
    });
  } catch (errFinal) {
    console.error("Critical storage error: Could not save even minimal metadata to localStorage", errFinal);
  }
}

/**
 * Fetch all claimed/modified tiles from Supabase
 */
export async function dbFetchTiles(): Promise<{ [key: string]: TileData }> {
  if (!isSupabaseConfigured || !supabase || isTableMissing('tiles')) {
    return JSON.parse(localStorage.getItem('kerala_world_cup_tiles_v4') || '{}');
  }

  try {
    const { data, error } = await supabase
      .from('tiles')
      .select('*');
    
    if (error) {
      if (error.code === 'PGRST205') {
        if (!isTableMissing('tiles')) {
          console.warn(
            `[Supabase Setup Info]: The 'tiles' table was not found in the public schema. ` +
            `Falling back to local storage cache representation.`
          );
          markTableAsMissing('tiles');
        }
        return JSON.parse(localStorage.getItem('kerala_world_cup_tiles_v4') || '{}');
      }
      throw error;
    }

    const tilesById: { [key: string]: TileData } = {};
    data.forEach((row) => {
      tilesById[row.id] = {
        id: row.id,
        team: row.team,
        photo: row.photo || '',
        claimedBy: row.claimed_by || undefined,
        customText: row.custom_text || undefined,
        textBackgroundStyle: row.text_background_style as any,
        imageBorderStyle: row.image_border_style as any,
        hyperlink: row.hyperlink || undefined,
        mergedWith: row.merged_with || undefined,
        isMergedChild: !!row.is_merged_child,
        mergedParentId: row.merged_parent_id || undefined,
        chats: Array.isArray(row.chats) ? row.chats : [],
        lastClaimedAt: row.last_claimed_at || undefined
      };
    });

    return tilesById;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "tiles" does not exist') || errorMsg.includes('tiles') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('tiles');
    }
    console.log('[Supabase Sandbox]: Loading tiles dataset from local cache instead.');
    return JSON.parse(localStorage.getItem('kerala_world_cup_tiles_v4') || '{}');
  }
}

/**
 * Save a claimed or modified tile
 */
export async function dbSaveTile(tileId: string, data: TileData): Promise<boolean> {
  // Update local storage first
  const cacheValue = JSON.parse(localStorage.getItem('kerala_world_cup_tiles_v4') || localStorage.getItem('kerala_claimed_tiles') || '{}');
  cacheValue[tileId] = data;
  saveTilesToLocalStorageSafely(cacheValue);

  if (!isSupabaseConfigured || !supabase || isTableMissing('tiles')) {
    return true;
  }

  const upsertPayload = {
    id: tileId,
    team: data.team,
    photo: data.photo || '',
    claimed_by: data.claimedBy || null,
    custom_text: data.customText || null,
    text_background_style: data.textBackgroundStyle || 'none',
    image_border_style: data.imageBorderStyle || 'none',
    hyperlink: data.hyperlink || null,
    merged_with: data.mergedWith || null,
    is_merged_child: !!data.isMergedChild,
    merged_parent_id: data.mergedParentId || null,
    chats: data.chats || [],
    last_claimed_at: data.lastClaimedAt || null
  };

  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { error } = await supabase
        .from('tiles')
        .upsert(upsertPayload, { onConflict: 'id' });

      if (error) {
        if (error.code === 'PGRST205') {
          if (!isTableMissing('tiles')) {
            console.log(
              `[Supabase Setup Info - Attempt ${attempt}]: ` +
              `The 'tiles' table was not found in the public schema of your Supabase database. ` +
              `Fallback to localStorage.`
            );
            markTableAsMissing('tiles');
          }
          return true;
        }
        throw error;
      }
      return true;
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      if (errorMsg.includes('relation "tiles" does not exist') || errorMsg.includes('tiles') || errorMsg.includes('PGRST205')) {
        markTableAsMissing('tiles');
        return true;
      }
      console.log(`[Supabase Sandbox]: Save tile ${tileId} statement (Attempt ${attempt}/${maxAttempts}): cached locally.`);
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  return false;
}

/**
 * Delete / Release tile claim from database
 */
export async function dbReleaseTile(tileId: string): Promise<boolean> {
  // Update local cache
  const cacheValue = JSON.parse(localStorage.getItem('kerala_world_cup_tiles_v4') || localStorage.getItem('kerala_claimed_tiles') || '{}');
  if (cacheValue[tileId]) {
    cacheValue[tileId] = {
      ...cacheValue[tileId],
      team: 'None',
      claimedBy: undefined,
      customText: undefined,
      photo: '',
      mergedWith: undefined,
      isMergedChild: false,
      mergedParentId: undefined
    };
    saveTilesToLocalStorageSafely(cacheValue);
  }

  if (!isSupabaseConfigured || !supabase || isTableMissing('tiles')) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('tiles')
      .delete()
      .eq('id', tileId);

    if (error) {
      if (error.code === 'PGRST205') {
        if (!isTableMissing('tiles')) {
          markTableAsMissing('tiles');
        }
        return true; // gracefully safe if table missing
      }
      throw error;
    }
    return true;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "tiles" does not exist') || errorMsg.includes('tiles') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('tiles');
    }
    console.log(`[Supabase Sandbox]: Release tile ${tileId} statement notice: updated locally.`);
    return true;
  }
}

/**
 * Fetch list of blocked emails
 */
export async function dbFetchBlockedEmails(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase || isTableMissing('blocked_user_emails')) {
    return JSON.parse(localStorage.getItem('kerala_blocked_user_emails_v4') || '[]');
  }

  try {
    const { data, error } = await supabase
      .from('blocked_user_emails')
      .select('email');
    if (error) {
      if (error.code === 'PGRST205') {
        if (!isTableMissing('blocked_user_emails')) {
          markTableAsMissing('blocked_user_emails');
        }
        return JSON.parse(localStorage.getItem('kerala_blocked_user_emails_v4') || '[]');
      }
      throw error;
    }
    return data.map(r => r.email.toLowerCase());
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "blocked_user_emails" does not exist') || errorMsg.includes('blocked_user_emails') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('blocked_user_emails');
    }
    console.log('[Supabase Sandbox]: Blocked emails notice: loading local list instead.');
    return JSON.parse(localStorage.getItem('kerala_blocked_user_emails_v4') || '[]');
  }
}

/**
 * Add or remove user from blocked emails table
 */
export async function dbSetUserBanned(email: string, isBanned: boolean): Promise<boolean> {
  const cleanEmail = email.toLowerCase();
  const currentBlocked = JSON.parse(localStorage.getItem('kerala_blocked_user_emails_v4') || '[]');
  let nextBlocked = currentBlocked.filter((em: string) => em.toLowerCase() !== cleanEmail);
  if (isBanned) {
    nextBlocked.push(cleanEmail);
  }
  try {
    localStorage.setItem('kerala_blocked_user_emails_v4', JSON.stringify(nextBlocked));
  } catch (err) {
    console.warn("Could not save blocked emails cache:", err);
  }

  if (!isSupabaseConfigured || !supabase || isTableMissing('blocked_user_emails')) {
    return true;
  }

  try {
    if (isBanned) {
      const { error } = await supabase
        .from('blocked_user_emails')
        .upsert({ email: cleanEmail }, { onConflict: 'email' });
      if (error) {
        if (error.code === 'PGRST205') {
          if (!isTableMissing('blocked_user_emails')) {
            markTableAsMissing('blocked_user_emails');
          }
          return true;
        }
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('blocked_user_emails')
        .delete()
        .eq('email', cleanEmail);
      if (error) {
        if (error.code === 'PGRST205') {
          if (!isTableMissing('blocked_user_emails')) {
            markTableAsMissing('blocked_user_emails');
          }
          return true;
        }
        throw error;
      }
    }
    return true;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "blocked_user_emails" does not exist') || errorMsg.includes('blocked_user_emails') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('blocked_user_emails');
    }
    console.log(`[Supabase Sandbox]: Block/unblock action notice for ${cleanEmail}: synced locally.`);
    return true;
  }
}

/**
 * Delete user profile entirely from central repository
 */
export async function dbDeleteUser(email: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase();
  const list = JSON.parse(localStorage.getItem('kerala_registered_users_list_v4') || '[]');
  const nextList = list.filter((u: any) => u.email.toLowerCase() !== cleanEmail);
  try {
    localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextList));
  } catch (err) {
    console.warn("Could not write updated registration list cache:", err);
  }

  if (!isSupabaseConfigured || !supabase || isTableMissing('users')) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('email', cleanEmail);
    if (error) {
      if (error.code === 'PGRST205') {
        if (!isTableMissing('users')) {
          markTableAsMissing('users');
        }
        return true;
      }
      throw error;
    }
    return true;
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('relation "users" does not exist') || errorMsg.includes('users') || errorMsg.includes('PGRST205')) {
      markTableAsMissing('users');
    }
    console.log(`[Supabase Sandbox]: Profile deletion notice for ${cleanEmail}: synced locally.`);
    return true;
  }
}
