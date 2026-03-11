import { Pool as NeonPool } from "@neondatabase/serverless";
import pg from "pg";

const DATABASE_URL = import.meta.env.DATABASE_URL;
const IS_NEON = DATABASE_URL?.includes("neon.tech");

// Creating the pool outside the request flow keeps connections alive
export const db = IS_NEON 
    ? new NeonPool({ connectionString: DATABASE_URL }) 
    : new pg.Pool({ connectionString: DATABASE_URL });

/**
 * Checks if the database is connected and the required modules are initialized.
 * Used by middleware for redirection.
 */
export async function checkRequiredModulesInitialized(): Promise<{ ok: boolean; error?: 'db_down' | 'not_initialized' }> {
    try {
        // 1. Check DB connection
        await db.query('SELECT 1');
        
        // 2. Check for required tables from each core module
        // users -> roles
        // my-account -> user_preferences
        // dashboard -> dashboard_widgets
        const { rows } = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('roles', 'user_preferences', 'dashboard_widgets')
        `);
        
        if (rows.length < 3) {
            return { ok: false, error: 'not_initialized' };
        }
        
        return { ok: true };
    } catch (err) {
        return { ok: false, error: 'db_down' };
    }
}

export const CACHE_TTL = 300000; // 5 minutes

interface CacheEntry {
    value: any;
    expiry: number;
}

const cache = new Map<string, CacheEntry>();

export async function getCachedQuery<T>(
    key: string, 
    ttl: number, 
    queryFn: () => Promise<T>
): Promise<T> {
    const now = Date.now();
    const cached = cache.get(key);
    
    if (cached && cached.expiry > now) {
        return cached.value as T;
    }
    
    const result = await queryFn();
    cache.set(key, { value: result, expiry: now + ttl });
    return result;
}

export function clearCache(key: string): void {
    cache.delete(key);
}

export function clearCacheByPrefix(prefix: string): void {
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) {
            cache.delete(key);
        }
    }
}

export function clearAllCache(): void {
    cache.clear();
}
