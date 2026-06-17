import { translations as defaultTranslations } from "./i18n";
import { projectDetailsTranslations as defaultProjectDetails } from "./projectDetailsData";
import { supabaseClient } from "./supabaseClient";

// Simple pub/sub for changes
type Listener = () => void;
const listeners = new Set<Listener>();

export const cmsService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  notify() {
    listeners.forEach((l) => l());
  },

  // Initialize and load dynamic data from Supabase asynchronously
  async initSupabaseSync() {
    try {
      // 1. Try syncing translations
      const translationRows = await supabaseClient.fetchTable("sds_translations");
      if (translationRows && translationRows.length > 0) {
        // Assume single row containing the translations JSON
        const remoteTranslations = translationRows[0].data;
        if (remoteTranslations) {
          localStorage.setItem("sds_translations", JSON.stringify(remoteTranslations));
        }
      }
    } catch (e) {
      console.warn("Supabase translations sync fallback to local storage:", e);
    }

    try {
      // 2. Try syncing project details
      const projectDetailsRows = await supabaseClient.fetchTable("sds_project_details");
      if (projectDetailsRows && projectDetailsRows.length > 0) {
        const remoteDetails = projectDetailsRows[0].data;
        if (remoteDetails) {
          localStorage.setItem("sds_project_details", JSON.stringify(remoteDetails));
        }
      }
    } catch (e) {
      console.warn("Supabase project details sync fallback to local storage:", e);
    }

    this.notify();
  },

  // Get current translations (loads from localStorage or default)
  getTranslations() {
    const stored = localStorage.getItem("sds_translations");
    if (!stored) {
      localStorage.setItem("sds_translations", JSON.stringify(defaultTranslations));
      return defaultTranslations;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return defaultTranslations;
    }
  },

  // Update translations locally & remotely
  async updateTranslations(newTranslations: any) {
    localStorage.setItem("sds_translations", JSON.stringify(newTranslations));
    this.notify();

    // Push to Supabase if possible
    try {
      await supabaseClient.upsertTable("sds_translations", [
        { id: 1, data: newTranslations }
      ]);
    } catch (e) {
      console.error("Failed to push translations to Supabase:", e);
    }
  },

  // Get project details
  getProjectDetails() {
    const stored = localStorage.getItem("sds_project_details");
    if (!stored) {
      localStorage.setItem("sds_project_details", JSON.stringify(defaultProjectDetails));
      return defaultProjectDetails;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return defaultProjectDetails;
    }
  },

  // Update project details locally & remotely
  async updateProjectDetails(newDetails: any) {
    localStorage.setItem("sds_project_details", JSON.stringify(newDetails));
    this.notify();

    try {
      await supabaseClient.upsertTable("sds_project_details", [
        { id: 1, data: newDetails }
      ]);
    } catch (e) {
      console.error("Failed to push project details to Supabase:", e);
    }
  },

  // Reset all to defaults
  async resetToDefaults() {
    localStorage.removeItem("sds_translations");
    localStorage.removeItem("sds_project_details");
    localStorage.removeItem("sds_projects_list");
    this.notify();

    try {
      // Clear remotely by pushing defaults
      await supabaseClient.upsertTable("sds_translations", [{ id: 1, data: defaultTranslations }]);
      await supabaseClient.upsertTable("sds_project_details", [{ id: 1, data: defaultProjectDetails }]);
    } catch (e) {
      console.error("Failed to reset Supabase tables:", e);
    }
  }
};
