const REPO_TTL = 60 * 60 * 1000; // 1 hour
const AI_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > entry.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, isAI = false): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: isAI ? AI_TTL : REPO_TTL,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full — silently fail
  }
}

export function clearCache(owner: string, repo: string): void {
  if (typeof window === 'undefined') return;
  const prefix = `codedna_repo_${owner}_${repo}`;
  const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
  keys.forEach(k => localStorage.removeItem(k));
}

export function cacheKey(owner: string, repo: string, feature: string): string {
  return `codedna_repo_${owner}_${repo}_${feature}`;
}

export function progressKey(owner: string, repo: string): string {
  return `codedna_progress_${owner}_${repo}`;
}
