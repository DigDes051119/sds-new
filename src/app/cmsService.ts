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

  getTranslations() {
    const stored = localStorage.getItem("sds_translations");
    let data: any;
    if (!stored) {
      data = JSON.parse(JSON.stringify(defaultTranslations));
    } else {
      try {
        data = JSON.parse(stored);
      } catch {
        data = JSON.parse(JSON.stringify(defaultTranslations));
      }
    }

    // Auto-migration/sync: If the translations fetched from Supabase/localStorage have
    // an empty team or the old 4-member mock team, replace it with the real 10-member team list.
    const langs = ["ru", "en", "kg"] as const;
    let modified = false;
    for (const lang of langs) {
      if (!data[lang]) data[lang] = {};
      if (!data[lang].nav) data[lang].nav = {};
      if (!data[lang].nav.products) {
        data[lang].nav.products = defaultTranslations[lang].nav.products;
        modified = true;
      }
      if (!data[lang].products) {
        data[lang].products = JSON.parse(JSON.stringify(defaultTranslations[lang].products));
        modified = true;
      }
      if (!data[lang].productDetail) {
        data[lang].productDetail = JSON.parse(JSON.stringify(defaultTranslations[lang].productDetail));
        modified = true;
      }

      if (!data[lang].home) data[lang].home = {};

      if (data[lang].home.heroDescription === undefined) {
        data[lang].home.heroDescription = defaultTranslations[lang].home.heroDescription;
        modified = true;
      }
      if (data[lang].home.heroTag === undefined) {
        data[lang].home.heroTag = defaultTranslations[lang].home.heroTag;
        modified = true;
      }
      if (data[lang].home.statsYears === undefined) {
        data[lang].home.statsYears = defaultTranslations[lang].home.statsYears;
        modified = true;
      }
      if (data[lang].home.statsLabel === undefined) {
        data[lang].home.statsLabel = defaultTranslations[lang].home.statsLabel;
        modified = true;
      }
      if (data[lang].home.principleLabel !== "Who you\ngonna call?") {
        data[lang].home.principleLabel = "Who you\ngonna call?";
        modified = true;
      }

      if (!data[lang].home.brands || !Array.isArray(data[lang].home.brands) || data[lang].home.brands.length === 0) {
        data[lang].home.brands = JSON.parse(JSON.stringify(defaultTranslations[lang].home.brands));
        modified = true;
      }

      if (!data[lang].about) data[lang].about = {};

      if (data[lang].about.mapSub === undefined) {
        data[lang].about.mapSub = defaultTranslations[lang].about.mapSub;
        modified = true;
      }
      if (data[lang].about.mapCities === undefined) {
        data[lang].about.mapCities = defaultTranslations[lang].about.mapCities;
        modified = true;
      }
      if (data[lang].about.valuesSub === undefined) {
        data[lang].about.valuesSub = defaultTranslations[lang].about.valuesSub;
        modified = true;
      }
      if (data[lang].about.teamIntro === undefined) {
        data[lang].about.teamIntro = defaultTranslations[lang].about.teamIntro;
        modified = true;
      }
      if (data[lang].about.whoWeAre === undefined) {
        data[lang].about.whoWeAre = defaultTranslations[lang].about.whoWeAre;
        modified = true;
      }
      if (data[lang].about.ourStoryTitle === undefined) {
        data[lang].about.ourStoryTitle = defaultTranslations[lang].about.ourStoryTitle;
        modified = true;
      }
      if (!data[lang].about.timeline || !Array.isArray(data[lang].about.timeline) || data[lang].about.timeline.length === 0) {
        data[lang].about.timeline = JSON.parse(JSON.stringify(defaultTranslations[lang].about.timeline));
        modified = true;
      } else {
        // Auto-migrate old Unsplash image URLs to the new local paths
        data[lang].about.timeline.forEach((step: any, sIdx: number) => {
          if (step.img && (step.img.includes("unsplash.com") || step.img.includes("images.unsplash.com"))) {
            step.img = `/about/story_${sIdx + 1}.png`;
            modified = true;
          }
        });
      }
      
      if (!data[lang].about.valuesList || !Array.isArray(data[lang].about.valuesList) || data[lang].about.valuesList.length === 0) {
        data[lang].about.valuesList = JSON.parse(JSON.stringify(defaultTranslations[lang].about.valuesList));
        modified = true;
      }
      
      // Sync awards list changes
      if (!data[lang].about.awardsList || !Array.isArray(data[lang].about.awardsList) || data[lang].about.awardsList.length === 0) {
        data[lang].about.awardsList = JSON.parse(JSON.stringify(defaultTranslations[lang].about.awardsList));
        modified = true;
      }

      const team = data[lang].about.team;
      const realTeam = defaultTranslations[lang]?.about?.team;

      if (!team || !Array.isArray(team) || team.length === 0 || (team.length <= 4 && team[0] && !team[0].img)) {
        data[lang].about.team = JSON.parse(JSON.stringify(realTeam));
        modified = true;
      }

      if (data[lang].contacts && data[lang].contacts.markerLabel === "Steel Drake Studio") {
        data[lang].contacts.markerLabel = "Steel Drake Studio Team";
        modified = true;
      }
    }

    if (modified) {
      localStorage.setItem("sds_translations", JSON.stringify(data));
      // Save to Supabase to synchronize database as well
      supabaseClient.upsertTable("sds_translations", [{ id: 1, data }]).catch((e) => {
        console.error("Failed to push migrated translations to Supabase:", e);
      });
    }

    return data;
  },

  // Update translations locally & remotely
  async updateTranslations(newTranslations: any) {
    localStorage.setItem("sds_translations", JSON.stringify(newTranslations));
    this.notify();

    // Push to Supabase if possible
    try {
      const currentAdminStr = localStorage.getItem("sds_current_admin");
      if (currentAdminStr) {
        const currentAdmin = JSON.parse(currentAdminStr);
        const requesterPassword = sessionStorage.getItem("sds_current_admin_password") || "";
        await supabaseClient.updateTranslationsSecure(currentAdmin.username, requesterPassword, newTranslations);
      }
    } catch (e) {
      console.error("Failed to push translations to Supabase:", e);
      throw e;
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
      const currentAdminStr = localStorage.getItem("sds_current_admin");
      if (currentAdminStr) {
        const currentAdmin = JSON.parse(currentAdminStr);
        const requesterPassword = sessionStorage.getItem("sds_current_admin_password") || "";
        await supabaseClient.updateProjectDetailsSecure(currentAdmin.username, requesterPassword, newDetails);
      }
    } catch (e) {
      console.error("Failed to push project details to Supabase:", e);
      throw e;
    }
  },

  // Get product details
  getProductDetails() {
    const translations = this.getTranslations();
    const res: any = { ru: {}, en: {}, kg: {} };
    ["ru", "en", "kg"].forEach((lang) => {
      res[lang] = translations[lang]?.productDetail?.products || {};
    });
    return res;
  },

  // Update product details locally & remotely
  async updateProductDetails(newDetails: any) {
    const translations = this.getTranslations();
    ["ru", "en", "kg"].forEach((lang) => {
      if (!translations[lang]) translations[lang] = {};
      if (!translations[lang].productDetail) translations[lang].productDetail = {};
      translations[lang].productDetail.products = newDetails[lang] || {};
    });
    await this.updateTranslations(translations);
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
