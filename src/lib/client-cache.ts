/**
 * Client-side in-memory & session storage cache
 * Enables 0ms instantaneous UI page transitions (Stale-While-Revalidate)
 */

const clientMemoryStore = new Map<string, any>();

export function getClientCached<T>(key: string, defaultVal: T): T {
  if (clientMemoryStore.has(key)) {
    return clientMemoryStore.get(key) as T;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(`cp_cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        clientMemoryStore.set(key, parsed);
        return parsed as T;
      }
    } catch {}
  }
  return defaultVal;
}

export function setClientCached<T>(key: string, data: T): void {
  clientMemoryStore.set(key, data);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(`cp_cache_${key}`, JSON.stringify(data));
    } catch {}
  }
}

export function invalidateClientCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    clientMemoryStore.clear();
    return;
  }
  for (const k of clientMemoryStore.keys()) {
    if (k.startsWith(keyPrefix)) {
      clientMemoryStore.delete(k);
    }
  }
  if (typeof window !== 'undefined') {
    try {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(`cp_cache_${keyPrefix}`)) {
          sessionStorage.removeItem(k);
        }
      }
    } catch {}
  }
}
