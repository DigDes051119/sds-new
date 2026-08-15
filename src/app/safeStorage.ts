/**
 * Safe wrapper around localStorage and sessionStorage to handle QuotaExceededError,
 * disabled cookies/storage in Safari private mode, or unexpected browser security restrictions.
 */

const memoryStore: Record<string, string> = {};

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
      return memoryStore[key] ?? null;
    } catch (e) {
      return memoryStore[key] ?? null;
    }
  },

  setItem(key: string, value: string): boolean {
    memoryStore[key] = value;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`[safeStorage] localStorage.setItem failed for "${key}", using memory store fallback:`, e);
      // Clean only non-critical temporary session/analytics items if quota is exceeded
      try {
        localStorage.removeItem("last_chunk_reload");
        localStorage.removeItem("sds_session_id");
        localStorage.setItem(key, value);
        return true;
      } catch {
        return true; // Retained in memoryStore
      }
    }
  },

  removeItem(key: string): void {
    delete memoryStore[key];
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  }
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn(`[safeStorage] sessionStorage.getItem failed for "${key}":`, e);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`[safeStorage] sessionStorage.setItem failed for "${key}":`, e);
      return false;
    }
  },

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn(`[safeStorage] sessionStorage.removeItem failed for "${key}":`, e);
    }
  }
};
