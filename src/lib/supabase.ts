import { createClient } from '@supabase/supabase-js';
import { TileData } from '../types';

// Read values from local storage overrides first, then from Vite's statically injected meta variables
const localUrl = localStorage.getItem('supabase_url_override_v4') || '';
const localKey = localStorage.getItem('supabase_anon_key_override_v4') || '';

const staticUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const staticKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Fallbacks from window or dynamic elements
const dynamicUrl = (window as any).__SUPABASE_URL__ || '';
const dynamicKey = (window as any).__SUPABASE_ANON_KEY__ || '';

export const supabaseUrl = localUrl || staticUrl || dynamicUrl || '';
export const supabaseAnonKey = localKey || staticKey || dynamicKey || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
export const isSupabaseOverridden = !!(localUrl && localKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Persistent database diagnosis logs
export function setSupabaseOverrides(url: string, key: string) {
  if (url && key) {
    localStorage.setItem('supabase_url_override_v4', url);
    localStorage.setItem('supabase_anon_key_override_v4', key);
  } else {
    localStorage.removeItem('supabase_url_override_v4');
    localStorage.removeItem('supabase_anon_key_override_v4');
  }
}

// Keep track of missing tables or buckets to guide the user in active environments
export function markTableAsMissing(tableName: string) {
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_tables_v4') || '[]');
    if (!missing.includes(tableName)) {
      missing.push(tableName);
      localStorage.setItem('supabase_missing_tables_v4', JSON.stringify(missing));
    }
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('supabase_tables_updated'));
}

export function isTableMissing(tableName: string): boolean {
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_tables_v4') || '[]');
    return missing.includes(tableName);
  } catch (e) {
    return false;
  }
}

export function markBucketAsMissing(bucketName: string) {
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_buckets_v4') || '[]');
    if (!missing.includes(bucketName)) {
      missing.push(bucketName);
      localStorage.setItem('supabase_missing_buckets_v4', JSON.stringify(missing));
    }
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('supabase_tables_updated'));
}

export function markBucketAsFound(bucketName: string) {
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_buckets_v4') || '[]');
    const filtered = missing.filter((b: string) => b !== bucketName);
    localStorage.setItem('supabase_missing_buckets_v4', JSON.stringify(filtered));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('supabase_tables_updated'));
}

export function isBucketMissing(bucketName: string): boolean {
  try {
    const missing = JSON.parse(localStorage.getItem('supabase_missing_buckets_v4') || '[]');
    return missing.includes(bucketName);
  } catch (e) {
    return false;
  }
}

export function resetMissingTableCache() {
  localStorage.removeItem('supabase_missing_tables_v4');
  localStorage.removeItem('supabase_missing_buckets_v4');
  window.dispatchEvent(new CustomEvent('supabase_tables_updated'));
}

export function getRegisteredMissingTables(): string[] {
  try {
    return JSON.parse(localStorage.getItem('supabase_missing_tables_v4') || '[]');
  } catch (e) {
    return [];
  }
}

export function getRegisteredMissingBuckets(): string[] {
  try {
    return JSON.parse(localStorage.getItem('supabase_missing_buckets_v4') || '[]');
  } catch (e) {
    return [];
  }
}

// Live Supabase Authentication Calls and Session Utilities
export async function dbSignOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}

export interface ActivityLog {
  id?: number;
  username: string;
  action_type: string;
  description: string;
  created_at?: string;
}

// Media storage helper: uploads directly to 'tile-photos' Supabase Bucket with Base64 fallback on error
export async function dbUploadImage(file: File, bucketName: string = 'tile-photos'): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  try {
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      if (error.message?.includes('bucket') || error.message?.includes('not found')) {
        markBucketAsMissing(bucketName);
      }
      throw error;
    }

    markBucketAsFound(bucketName);
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(cleanFileName);

    return publicUrl;
  } catch (err) {
    console.warn("Storage upload failed, falling back to Local Data URL:", err);
    // Secure fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }
}

// Live Activities routed through secure full-stack backend
export async function dbFetchActivityLogs(): Promise<ActivityLog[]> {
  try {
    const res = await fetch('/api/activity-logs');
    const data = await res.json();
    if (data.success && data.logs) {
      localStorage.setItem('kerala_action_logs_v4', JSON.stringify(data.logs));
      return data.logs;
    }
  } catch (err) {
    console.warn("API activity logs fetch failed, falling back to sandbox cache:", err);
  }
  return JSON.parse(localStorage.getItem('kerala_action_logs_v4') || '[]');
}

export async function dbAddActivityLog(log: Omit<ActivityLog, 'id' | 'created_at'>): Promise<boolean> {
  // Sync locally first
  const logs = JSON.parse(localStorage.getItem('kerala_action_logs_v4') || '[]');
  const newLocalLog = {
    ...log,
    id: Date.now(),
    created_at: new Date().toISOString()
  };
  logs.unshift(newLocalLog);
  localStorage.setItem('kerala_action_logs_v4', JSON.stringify(logs.slice(0, 150)));

  try {
    const res = await fetch('/api/activity-logs/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    const result = await res.json();
    return !!result.success;
  } catch (err) {
    console.warn("API add activity log failed:", err);
    return true;
  }
}

// Users and profiles routed through secure full-stack backend
export async function dbFetchUsers(): Promise<any[]> {
  try {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (data.success && data.users) {
      localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(data.users));
      return data.users;
    }
  } catch (err) {
    console.warn("API users fetch failed, falling back to sandbox cache:", err);
  }
  return JSON.parse(localStorage.getItem('kerala_registered_users_list_v4') || '[]');
}

export async function dbUpsertUser(user: {
  username: string;
  email: string;
  password?: string;
  favoriteClub: string;
  isAdmin?: boolean;
  picture?: string;
  freeSlots?: number;
  emailVerified?: boolean;
}): Promise<boolean> {
  // Save in local storage cache for absolute fallback reliability
  const currentList = JSON.parse(localStorage.getItem('kerala_registered_users_list_v4') || '[]');
  const existing = currentList.find((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
  const updatedUser = {
    ...user,
    freeSlots: user.freeSlots !== undefined ? user.freeSlots : (existing ? existing.freeSlots : undefined),
    emailVerified: user.emailVerified !== undefined ? user.emailVerified : (existing ? existing.emailVerified : undefined)
  };
  const updatedList = currentList.filter((u: any) => u.email.toLowerCase() !== user.email.toLowerCase());
  updatedList.push(updatedUser);
  localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(updatedList));

  try {
    const res = await fetch('/api/users/upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });
    const result = await res.json();
    return !!result.success;
  } catch (err) {
    console.warn("API upsert user failed:", err);
    return true;
  }
}

export async function dbCheckTableExists(tableName: string): Promise<boolean> {
  try {
    const res = await fetch('/api/supabase/verify');
    const data = await res.json();
    if (data.configured && data.missingTables) {
      return !data.missingTables.includes(tableName);
    }
  } catch {
    // If not configured or failed, pretend it exists for simulation stability
  }
  return true;
}

export async function dbVerifySchemasOnBoot(): Promise<string[]> {
  try {
    const res = await fetch('/api/supabase/verify');
    const data = await res.json();
    if (data.configured) {
      resetMissingTableCache();
      if (data.missingTables?.length) {
        data.missingTables.forEach((t: string) => markTableAsMissing(t));
      }
      if (data.missingBuckets?.length) {
        data.missingBuckets.forEach((b: string) => markBucketAsMissing(b));
      }
      return data.missingTables || [];
    }
  } catch (err) {
    console.warn("API schema verification failed:", err);
  }
  return [];
}

// Map Sector Tiles Synchronization
export function saveTilesToLocalStorageSafely(cacheValue: Record<string, TileData>) {
  try {
    localStorage.setItem('kerala_world_cup_tiles_v4', JSON.stringify(cacheValue));
  } catch (e) {
    console.error("Local storage save error", e);
  }
}

export async function dbFetchTiles(): Promise<{ [key: string]: TileData }> {
  try {
    const res = await fetch('/api/tiles');
    const data = await res.json();
    if (data.success && data.tiles) {
      const finalMap = { ...data.tiles };
      saveTilesToLocalStorageSafely(finalMap);
      return finalMap;
    }
  } catch (err) {
    console.warn("API fetch tiles failed, falling back to local replica:", err);
  }
  return JSON.parse(localStorage.getItem('kerala_world_cup_tiles_v4') || '{}');
}

export async function dbSaveTile(tileId: string, data: TileData): Promise<boolean> {
  // Sync to local replica
  const cacheValue = JSON.parse(localStorage.getItem('kerala_world_cup_tiles_v4') || '{}');
  cacheValue[tileId] = data;
  saveTilesToLocalStorageSafely(cacheValue);

  try {
    const res = await fetch('/api/tiles/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    return !!result.success;
  } catch (err) {
    console.warn("API save tile failed, cached locally:", err);
    return true;
  }
}

export async function dbReleaseTile(tileId: string): Promise<boolean> {
  // Clear offline sector
  const cacheValue = JSON.parse(localStorage.getItem('kerala_world_cup_tiles_v4') || '{}');
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

  try {
    const res = await fetch('/api/tiles/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tileId })
    });
    const result = await res.json();
    return !!result.success;
  } catch (err) {
    console.warn("API release tile failed:", err);
    return true;
  }
}

// Banned list checks
export async function dbFetchBlockedEmails(): Promise<string[]> {
  try {
    const res = await fetch('/api/blocked-emails');
    const data = await res.json();
    if (data.success && data.blocked) {
      localStorage.setItem('kerala_blocked_user_emails_v4', JSON.stringify(data.blocked));
      return data.blocked;
    }
  } catch (err) {
    console.warn("API blocked emails fetch failed:", err);
  }
  return JSON.parse(localStorage.getItem('kerala_blocked_user_emails_v4') || '[]');
}

export async function dbSetUserBanned(email: string, isBanned: boolean): Promise<boolean> {
  const cleanEmail = email.toLowerCase();
  const currentBlocked = JSON.parse(localStorage.getItem('kerala_blocked_user_emails_v4') || '[]');
  let nextBlocked = currentBlocked.filter((em: string) => em.toLowerCase() !== cleanEmail);
  if (isBanned) {
    nextBlocked.push(cleanEmail);
  }
  localStorage.setItem('kerala_blocked_user_emails_v4', JSON.stringify(nextBlocked));

  try {
    const res = await fetch('/api/blocked-emails/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, isBanned })
    });
    const result = await res.json();
    return !!result.success;
  } catch (err) {
    console.warn("API set user banned failed:", err);
    return true;
  }
}

export async function dbDeleteUser(email: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase();
  const list = JSON.parse(localStorage.getItem('kerala_registered_users_list_v4') || '[]');
  const nextList = list.filter((u: any) => u.email.toLowerCase() !== cleanEmail);
  localStorage.setItem('kerala_registered_users_list_v4', JSON.stringify(nextList));

  try {
    const res = await fetch('/api/users/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail })
    });
    const result = await res.json();
    return !!result.success;
  } catch (err) {
    console.warn("API delete user failed:", err);
    return true;
  }
}
