const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

export const supabaseClient = {
  // Simple fetch wrapper for GoTrue API (Authentication)
  async signInWithPassword(email: string, password: string) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || data.message || "Ошибка входа");
    }

    // Save session in localStorage
    localStorage.setItem("sds_supabase_session", JSON.stringify(data));
    return { data, error: null };
  },

  // Get current auth token
  getToken() {
    const sessionStr = localStorage.getItem("sds_supabase_session");
    if (!sessionStr) return null;
    try {
      const session = JSON.parse(sessionStr);
      return session.access_token;
    } catch {
      return null;
    }
  },

  // Logout
  signOut() {
    localStorage.removeItem("sds_supabase_session");
    localStorage.removeItem("sds_admin_logged_in");
  },

  // Dynamic Custom Analytics Visit Logger
  async logVisit(path: string, locale: string) {
    try {
      let sessionId = sessionStorage.getItem("sds_session_id");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("sds_session_id", sessionId);
      }

      const row = {
        session_id: sessionId,
        path,
        locale,
        referrer: document.referrer || "Direct",
        user_agent: navigator.userAgent.substring(0, 150),
      };

      await fetch(`${SUPABASE_URL}/rest/v1/sds_analytics`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(row),
      });
    } catch (e) {
      console.warn("Could not push analytics log to Supabase:", e);
    }
  },

  // Database operations (PostgREST API)
  async fetchTable(tableName: string) {
    const token = this.getToken() || SUPABASE_KEY;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*`, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || `Failed to fetch table ${tableName}`);
    }

    return await response.json();
  },

  async upsertTable(tableName: string, rows: any[]) {
    const token = this.getToken() || SUPABASE_KEY;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify(rows),
        signal: controller.signal
      });

      clearTimeout(id);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(err.message || `Failed to upsert table ${tableName}`);
      }

      return true;
    } catch (e: any) {
      clearTimeout(id);
      if (e.name === 'AbortError') {
        throw new Error("Превышено время ожидания ответа от сервера (таймаут 10 сек). Возможно, таблица заблокирована в Supabase.");
      }
      throw e;
    }
  },

  async insertTable(tableName: string, rows: any[]) {
    const token = this.getToken() || SUPABASE_KEY;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows),
        signal: controller.signal
      });

      clearTimeout(id);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(err.message || `Failed to insert into table ${tableName}`);
      }

      return true;
    } catch (e: any) {
      clearTimeout(id);
      if (e.name === 'AbortError') {
        throw new Error("Превышено время ожидания ответа от сервера (таймаут 10 сек). Возможно, таблица заблокирована в Supabase.");
      }
      throw e;
    }
  },


  async clearAnalytics() {
    const token = this.getToken() || SUPABASE_KEY;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/sds_analytics?id=gt.0`, {
      method: "DELETE",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Failed to clear analytics logs");
    }

    return true;
  },

  async uploadFile(bucketName: string, path: string, file: File) {
    const token = this.getToken() || SUPABASE_KEY;
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${path}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${token}`,
      },
      body: file
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      if (err.message && (err.message.includes("already exists") || err.error === "Duplicate")) {
        // Try PUT to overwrite
        const overwriteResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${path}`, {
          method: "PUT",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${token}`,
          },
          body: file
        });
        if (!overwriteResponse.ok) {
          const overwriteErr = await overwriteResponse.json().catch(() => ({ message: overwriteResponse.statusText }));
          throw new Error(overwriteErr.message || `Failed to upload file to ${bucketName}/${path}`);
        }
        return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${path}`;
      }
      throw new Error(err.message || `Failed to upload file to ${bucketName}/${path}`);
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${path}`;
  }
};
