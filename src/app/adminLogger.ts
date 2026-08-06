import { supabaseClient } from "./supabaseClient";
import { safeLocalStorage } from "./safeStorage";

export const logAdminAction = async (section: string, action: string, details: string) => {
  try {
    const currentAdminStr = safeLocalStorage.getItem("sds_current_admin");
    if (!currentAdminStr) return;
    
    const currentAdmin = JSON.parse(currentAdminStr);
    if (!currentAdmin || !currentAdmin.username) return;
    
    const logEntry = {
      admin_username: currentAdmin.username,
      admin_name: `${currentAdmin.first_name || ""} ${currentAdmin.last_name || ""}`.trim(),
      section,
      action,
      details
    };
    
    await supabaseClient.insertTable("sds_admin_logs", [logEntry]);
  } catch (e) {
    console.warn("Failed to log admin action:", e);
  }
};
