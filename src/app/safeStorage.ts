/**
 * Safe wrapper around localStorage and sessionStorage to handle QuotaExceededError,
 * disabled cookies/storage in Safari private mode, or unexpected browser security restrictions.
 */

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[safeStorage] localStorage.getItem failed for "${key}":`, e);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`[safeStorage] localStorage.setItem failed for "${key}":`, e);
      // Attempt quota recovery: clear potential heavy caches if key is not the one we are setting
      try {
        if (key !== "sds_project_details") localStorage.removeItem("sds_project_details");
        if (key !== "sds_translations") localStorage.removeItem("sds_translations");
        if (key !== "sds_archive_items") localStorage.removeItem("sds_archive_items");
        localStorage.setItem(key, value);
        return true;
      } catch {
        // If recovery still fails, fail gracefully without throwing QuotaExceededError
        return false;
      }
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[safeStorage] localStorage.removeItem failed for "${key}":`, e);
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
