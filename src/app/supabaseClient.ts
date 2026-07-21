const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const STORAGE_CDN_URL = "https://cdn.steeldrakestudio.com";
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
    // Resize and convert to WebP in browser before uploading for optimal page performance
    if (file.type.startsWith("image/")) {
      try {
        const MAX_WIDTH = 2560; // max width for covers and gallery images (2K)
        const needsConversion = file.type !== "image/webp";

        file = await new Promise<File>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let w = img.naturalWidth;
              let h = img.naturalHeight;

              // Resize if exceeds max width
              if (w > MAX_WIDTH) {
                h = Math.round(h * (MAX_WIDTH / w));
                w = MAX_WIDTH;
              }

              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
              }
              // Clear canvas for transparency
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, w, h);

              const outType = needsConversion ? "image/webp" : file.type;
              const outQuality = 0.82;

              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    reject(new Error("Failed to process image"));
                    return;
                  }
                  const outName = needsConversion
                    ? file.name.replace(/\.[^/.]+$/, "") + ".webp"
                    : file.name;
                  const outFile = new File([blob], outName, { type: outType });
                  resolve(outFile);
                },
                outType,
                outQuality
              );
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = event.target?.result as string;
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });

        // Update path extension to .webp if converted
        if (needsConversion) {
          path = path.replace(/\.[^/.]+$/, "") + ".webp";
        }
      } catch (webpError) {
        console.warn("Image processing failed, uploading original:", webpError);
      }
    }

    const token = this.getToken() || SUPABASE_KEY;
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${path}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${token}`,
        "Content-Type": file.type,
        "Cache-Control": "public, max-age=31536000, immutable"
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
            "Content-Type": file.type,
            "Cache-Control": "public, max-age=31536000, immutable"
          },
          body: file
        });
        if (!overwriteResponse.ok) {
          const overwriteErr = await overwriteResponse.json().catch(() => ({ message: overwriteResponse.statusText }));
          throw new Error(overwriteErr.message || `Failed to upload file to ${bucketName}/${path}`);
        }
        return `${STORAGE_CDN_URL}/storage/v1/object/public/${bucketName}/${path}`;
      }
      throw new Error(err.message || `Failed to upload file to ${bucketName}/${path}`);
    }

    return `${STORAGE_CDN_URL}/storage/v1/object/public/${bucketName}/${path}`;
  },

  async verifyAdmin(username: string, password: string) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/verify_admin_credentials`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_username: username, p_password: password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Неверный логин или пароль");
    }

    const data = await response.json();
    return data[0] || null;
  },

  async getAdminsList(requesterUsername: string, requesterPassword: string) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_admins_list`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_username: requesterUsername,
        p_requester_password: requesterPassword
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка получения списка администраторов");
    }

    return await response.json();
  },

  async upsertAdminUser(requesterUsername: string, requesterPassword: string, adminUser: any) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/upsert_admin_user`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_username: requesterUsername,
        p_requester_password: requesterPassword,
        p_id: adminUser.id || 0,
        p_username: adminUser.username,
        p_password: adminUser.password,
        p_first_name: adminUser.first_name,
        p_last_name: adminUser.last_name,
        p_role: adminUser.role,
        p_permissions: adminUser.permissions
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка сохранения администратора");
    }

    return true;
  },

  async deleteAdminUser(requesterUsername: string, requesterPassword: string, userId: number) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/delete_admin_user`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_username: requesterUsername,
        p_requester_password: requesterPassword,
        p_user_id: userId
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка удаления администратора");
    }

    return true;
  },

  async updateTranslationsSecure(requesterUsername: string, requesterPassword: string, data: any) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/update_translations_secure`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_username: requesterUsername,
        p_requester_password: requesterPassword,
        p_data: data
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка обновления переводов");
    }

    return true;
  },

  async updateProjectDetailsSecure(requesterUsername: string, requesterPassword: string, data: any) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/update_project_details_secure`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_username: requesterUsername,
        p_requester_password: requesterPassword,
        p_data: data
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка обновления деталей проекта");
    }

    return true;
  },

  async getAdminLogsSecure(requesterUsername: string, requesterPassword: string) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_admin_logs`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_username: requesterUsername,
        p_requester_password: requesterPassword
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка получения логов");
    }

    return await response.json();
  },

  async getAnalyticsDataSecure(requesterUsername: string, requesterPassword: string) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_analytics_data`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_username: requesterUsername,
        p_requester_password: requesterPassword
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка получения аналитики");
    }

    return await response.json();
  },

  async clearAnalyticsSecure(requesterUsername: string, requesterPassword: string) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/clear_analytics_data`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_username: requesterUsername,
        p_requester_password: requesterPassword
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка очистки аналитики");
    }

    return true;
  },

  // Fetch all leads from sds_leads table
  async fetchLeads() {
    const token = this.getToken() || SUPABASE_KEY;
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/sds_leads?select=*&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка загрузки заявок");
    }

    return await response.json();
  },

  // Update a lead's archived status (PATCH by id)
  async updateLead(id: number, patch: Record<string, any>) {
    const token = this.getToken() || SUPABASE_KEY;
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/sds_leads?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify(patch),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка обновления заявки");
    }

    return true;
  },

  // Delete a lead permanently
  async deleteLead(id: number) {
    const token = this.getToken() || SUPABASE_KEY;
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/sds_leads?id=eq.${id}`,
      {
        method: "DELETE",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || "Ошибка удаления заявки");
    }

    return true;
  }
};

/**
 * Transform Supabase Storage object URLs to use the render/image endpoint
 * for on-the-fly 2K (2560px width) resizing.
 * Non-Supabase URLs (local imports, Unsplash, data URIs) pass through unchanged.
 */
export function transformTo2K(url: string): string {
  return url;
}
