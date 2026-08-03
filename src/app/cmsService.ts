import { translations as defaultTranslations } from "./i18n";
import { projectDetailsTranslations as defaultProjectDetails } from "./projectDetailsData";
import { archiveItems as defaultArchiveItems, type ArchiveItem } from "./archiveData";
import { supabaseClient } from "./supabaseClient";

// Simple pub/sub for changes
type Listener = () => void;
const listeners = new Set<Listener>();

let lastRemoteTranslationsStr: string | null = null;
let lastRemoteProjectDetailsStr: string | null = null;

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
          lastRemoteTranslationsStr = JSON.stringify(remoteTranslations);
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
          lastRemoteProjectDetailsStr = JSON.stringify(remoteDetails);
          localStorage.setItem("sds_project_details", JSON.stringify(remoteDetails));
        }
      }
    } catch (e) {
      console.warn("Supabase project details sync fallback to local storage:", e);
    }

    try {
      // 3. Try syncing archive items
      const archiveRows = await supabaseClient.fetchTable("sds_archive_items").catch(() => null);
      if (archiveRows && archiveRows.length > 0 && archiveRows[0]?.data) {
        localStorage.setItem("sds_archive_items", JSON.stringify(archiveRows[0].data));
      } else {
        // Fallback: load archive from translations if available
        const storedTrans = localStorage.getItem("sds_translations");
        if (storedTrans) {
          try {
            const trans = JSON.parse(storedTrans);
            if (trans?.ru?.archive && Array.isArray(trans.ru.archive) && trans.ru.archive.length > 0) {
              const archiveData = {
                ru: trans.ru.archive,
                en: trans.en?.archive || trans.ru.archive,
                kg: trans.kg?.archive || trans.ru.archive,
              };
              localStorage.setItem("sds_archive_items", JSON.stringify(archiveData));
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (e) {
      console.warn("Supabase archive items sync fallback to local storage:", e);
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
    const langs = ["ru", "en", "kg", "zh", "ar", "de"] as const;
    let modified = false;

    // Ensure base language objects exist
    for (const lang of langs) {
      if (!data[lang]) {
        data[lang] = JSON.parse(JSON.stringify(defaultTranslations[lang as keyof typeof defaultTranslations] || defaultTranslations.en));
        modified = true;
      }
    }

    // Ensure catalog arrays have fallbacks so items never vanish on zh, ar, de
    const fallbackLang = "en";
    for (const lang of langs) {
      if (!data[lang].projects || !Array.isArray(data[lang].projects.items) || data[lang].projects.items.length === 0) {
        data[lang].projects = JSON.parse(JSON.stringify(data[fallbackLang]?.projects || data.ru?.projects || { title: "Projects", items: [] }));
        modified = true;
      }
      if (!data[lang].products || !Array.isArray(data[lang].products.items) || data[lang].products.items.length === 0) {
        data[lang].products = JSON.parse(JSON.stringify(data[fallbackLang]?.products || data.ru?.products || { title: "Products", items: [] }));
        modified = true;
      }
      if (!data[lang].concepts || !Array.isArray(data[lang].concepts.items) || data[lang].concepts.items.length === 0) {
        data[lang].concepts = JSON.parse(JSON.stringify(data[fallbackLang]?.concepts || data.ru?.concepts || { title: "Concepts & Vision", items: [] }));
        modified = true;
      }
      if (!data[lang].architects || !Array.isArray(data[lang].architects.items) || data[lang].architects.items.length === 0) {
        data[lang].architects = JSON.parse(JSON.stringify(data[fallbackLang]?.architects || data.ru?.architects || { title: "Architect Projects", items: [] }));
        modified = true;
      }
      if (!data[lang].gamedev || !Array.isArray(data[lang].gamedev.items) || data[lang].gamedev.items.length === 0) {
        data[lang].gamedev = JSON.parse(JSON.stringify(data[fallbackLang]?.gamedev || data.ru?.gamedev || { title: "GameDev", items: [] }));
        modified = true;
      }
      if (!data[lang].webUiUx || !Array.isArray(data[lang].webUiUx.items) || data[lang].webUiUx.items.length === 0) {
        data[lang].webUiUx = JSON.parse(JSON.stringify(data[fallbackLang]?.webUiUx || data.ru?.webUiUx || { title: "WEB / UI UX", items: [] }));
        modified = true;
      }

      if (!data[lang].nav) data[lang].nav = {};
      if (!data[lang].nav.products) {
        data[lang].nav.products = defaultTranslations[lang as keyof typeof defaultTranslations]?.nav?.products || defaultTranslations.en.nav.products;
        modified = true;
      }
      if (!data[lang].productDetail) {
        data[lang].productDetail = JSON.parse(JSON.stringify(defaultTranslations[lang as keyof typeof defaultTranslations]?.productDetail || defaultTranslations.en.productDetail));
        modified = true;
      }

      if (!data[lang].home) data[lang].home = {};

      if (data[lang].home.heroDescription === undefined) {
        data[lang].home.heroDescription = defaultTranslations[lang as keyof typeof defaultTranslations]?.home?.heroDescription || defaultTranslations.en.home.heroDescription;
        modified = true;
      }
      if (data[lang].home.heroTag === undefined) {
        data[lang].home.heroTag = defaultTranslations[lang as keyof typeof defaultTranslations]?.home?.heroTag || defaultTranslations.en.home.heroTag;
        modified = true;
      }
      if (data[lang].home.statsYears === undefined) {
        data[lang].home.statsYears = defaultTranslations[lang as keyof typeof defaultTranslations]?.home?.statsYears || defaultTranslations.en.home.statsYears;
        modified = true;
      }
      if (data[lang].home.statsLabel === undefined) {
        data[lang].home.statsLabel = defaultTranslations[lang as keyof typeof defaultTranslations]?.home?.statsLabel || defaultTranslations.en.home.statsLabel;
        modified = true;
      }
      if (data[lang].home.principleLabel !== "Who you\ngonna call?") {
        data[lang].home.principleLabel = "Who you\ngonna call?";
        modified = true;
      }

      if (!data[lang].home.brands || !Array.isArray(data[lang].home.brands) || data[lang].home.brands.length === 0) {
        data[lang].home.brands = JSON.parse(JSON.stringify(defaultTranslations[lang as keyof typeof defaultTranslations]?.home?.brands || defaultTranslations.en.home.brands));
        modified = true;
      }

      if (!data[lang].about) data[lang].about = {};

      if (data[lang].about.mapSub === undefined) {
        data[lang].about.mapSub = defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.mapSub || defaultTranslations.en.about.mapSub;
        modified = true;
      }
      if (data[lang].about.mapCities === undefined) {
        data[lang].about.mapCities = defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.mapCities || defaultTranslations.en.about.mapCities;
        modified = true;
      }
      if (data[lang].about.valuesSub === undefined) {
        data[lang].about.valuesSub = defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.valuesSub || defaultTranslations.en.about.valuesSub;
        modified = true;
      }
      if (data[lang].about.teamIntro === undefined) {
        data[lang].about.teamIntro = defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.teamIntro || defaultTranslations.en.about.teamIntro;
        modified = true;
      }
      if (data[lang].about.whoWeAre === undefined) {
        data[lang].about.whoWeAre = defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.whoWeAre || defaultTranslations.en.about.whoWeAre;
        modified = true;
      }
      if (data[lang].about.ourStoryTitle === undefined) {
        data[lang].about.ourStoryTitle = defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.ourStoryTitle || defaultTranslations.en.about.ourStoryTitle;
        modified = true;
      }
      if (!data[lang].about.timeline || !Array.isArray(data[lang].about.timeline) || data[lang].about.timeline.length === 0) {
        data[lang].about.timeline = JSON.parse(JSON.stringify(defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.timeline || defaultTranslations.en.about.timeline));
        modified = true;
      } else {
        data[lang].about.timeline.forEach((step: any, sIdx: number) => {
          if (step.img && (step.img.includes("unsplash.com") || step.img.includes("images.unsplash.com"))) {
            step.img = `/about/story_${sIdx + 1}.png`;
            modified = true;
          }
        });
      }
      
      if (!data[lang].about.valuesList || !Array.isArray(data[lang].about.valuesList) || data[lang].about.valuesList.length === 0) {
        data[lang].about.valuesList = JSON.parse(JSON.stringify(defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.valuesList || defaultTranslations.en.about.valuesList));
        modified = true;
      }
      
      if (!data[lang].about.awardsList || !Array.isArray(data[lang].about.awardsList) || data[lang].about.awardsList.length === 0) {
        data[lang].about.awardsList = JSON.parse(JSON.stringify(defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.awardsList || defaultTranslations.en.about.awardsList));
        modified = true;
      }

      const team = data[lang].about.team;
      const realTeam = defaultTranslations[lang as keyof typeof defaultTranslations]?.about?.team || defaultTranslations.en.about.team;

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
      supabaseClient.upsertTable("sds_translations", [{ id: 1, data }]).catch((e) => {
        console.error("Failed to push migrated translations to Supabase:", e);
      });
    }

    return data;
  },

  // Update translations locally & remotely
  async updateTranslations(newTranslations: any, forceOverride = false) {
    localStorage.setItem("sds_translations", JSON.stringify(newTranslations));
    this.notify();

    try {
      const currentAdminStr = localStorage.getItem("sds_current_admin");
      if (currentAdminStr) {
        const currentAdmin = JSON.parse(currentAdminStr);
        const requesterPassword = sessionStorage.getItem("sds_current_admin_password") || "";
        await supabaseClient.updateTranslationsSecure(currentAdmin.username, requesterPassword, newTranslations);
        lastRemoteTranslationsStr = JSON.stringify(newTranslations);
      }
    } catch (e) {
      console.error("Failed to push translations to Supabase:", e);
      throw e;
    }
    return true;
  },

  // Get project details
  getProjectDetails() {
    const stored = localStorage.getItem("sds_project_details");
    let data: any;
    if (!stored) {
      data = JSON.parse(JSON.stringify(defaultProjectDetails));
    } else {
      try {
        data = JSON.parse(stored);
      } catch {
        data = JSON.parse(JSON.stringify(defaultProjectDetails));
      }
    }

    let modified = false;
    ["ru", "en", "kg", "zh", "ar", "de"].forEach((lang) => {
      if (!data[lang]) {
        data[lang] = JSON.parse(JSON.stringify(data.en || data.ru || {}));
        modified = true;
      }
      ["one-ordo", "one-ordo-resort"].forEach((key) => {
        const item = data[lang][key];
        const defaultItem = (defaultProjectDetails as any)[lang]?.[key] || (defaultProjectDetails as any).ru?.[key];
        if (!item || item.service === "WEBDESIGN" || item.service === "webdesign" || (item.desc && item.desc.includes("Website for")) || !item.collageBlocks || item.collageBlocks.length < 5) {
          if (defaultItem) {
            data[lang][key] = JSON.parse(JSON.stringify(defaultItem));
            modified = true;
          }
        }
      });
    });

    if (modified) {
      localStorage.setItem("sds_project_details", JSON.stringify(data));
      supabaseClient.upsertTable("sds_project_details", [{ id: 1, data }]).catch(() => {});
    }

    return data;
  },

  // Update project details locally & remotely
  async updateProjectDetails(newDetails: any, forceOverride = false) {
    localStorage.setItem("sds_project_details", JSON.stringify(newDetails));
    this.notify();

    try {
      const currentAdminStr = localStorage.getItem("sds_current_admin");
      if (currentAdminStr) {
        const currentAdmin = JSON.parse(currentAdminStr);
        const requesterPassword = sessionStorage.getItem("sds_current_admin_password") || "";
        await supabaseClient.updateProjectDetailsSecure(currentAdmin.username, requesterPassword, newDetails);
        lastRemoteProjectDetailsStr = JSON.stringify(newDetails);
      }
    } catch (e) {
      console.error("Failed to push project details to Supabase:", e);
      throw e;
    }
    return true;
  },

  // Get product details
  getProductDetails() {
    const translations = this.getTranslations();
    const res: any = {};
    ["ru", "en", "kg", "zh", "ar", "de"].forEach((lang) => {
      res[lang] = translations[lang]?.productDetail?.products || translations.en?.productDetail?.products || translations.ru?.productDetail?.products || {};
    });
    return res;
  },

  // Update product details locally & remotely
  async updateProductDetails(newDetails: any) {
    const translations = this.getTranslations();
    ["ru", "en", "kg", "zh", "ar", "de"].forEach((lang) => {
      if (!translations[lang]) translations[lang] = {};
      if (!translations[lang].productDetail) translations[lang].productDetail = {};
      translations[lang].productDetail.products = newDetails[lang] || {};
    });
    await this.updateTranslations(translations);
  },

  // Get archive (Origins) items
  getArchiveItems(): Record<string, ArchiveItem[]> {
    let data: any = null;

    const translations = this.getTranslations();
    if (translations?.ru?.archive && Array.isArray(translations.ru.archive) && translations.ru.archive.length > 0) {
      data = {};
      ["ru", "en", "kg", "zh", "ar", "de"].forEach((lang) => {
        data[lang] = translations[lang]?.archive || translations.en?.archive || translations.ru.archive;
      });
    } else {
      const stored = localStorage.getItem("sds_archive_items");
      if (stored) {
        try {
          data = JSON.parse(stored);
        } catch {
          data = null;
        }
      }
    }

    if (!data) {
      data = JSON.parse(JSON.stringify(defaultArchiveItems));
    }

    ["ru", "en", "kg", "zh", "ar", "de"].forEach((lang) => {
      if (!data[lang] || !Array.isArray(data[lang])) {
        data[lang] = JSON.parse(JSON.stringify(data.en || data.ru || []));
      }
    });
    return data;
  },

  // Update archive (Origins) items locally & remotely
  async updateArchiveItems(newArchiveData: Record<"ru" | "en" | "kg", ArchiveItem[]>) {
    let success = true;
    // 1. Always save inside sds_translations remotely to guarantee persistence in Supabase
    try {
      const translations = this.getTranslations();
      ["ru", "en", "kg"].forEach((lang) => {
        if (!translations[lang]) translations[lang] = {};
        translations[lang].archive = newArchiveData[lang as keyof typeof newArchiveData];
      });
      success = await this.updateTranslations(translations) ?? true;
    } catch (transErr) {
      console.warn("Failed to sync archive into translations:", transErr);
    }
    
    if (success === false) {
      return; // aborted by user due to collision
    }

    localStorage.setItem("sds_archive_items", JSON.stringify(newArchiveData));
    this.notify();

    // 2. Also attempt saving to sds_archive_items if table exists
    try {
      await supabaseClient.upsertTable("sds_archive_items", [{ id: 1, data: newArchiveData }]);
    } catch (e) {
      console.warn("sds_archive_items table fallback active.");
    }
  },

  // Reset all to defaults
  async resetToDefaults() {
    localStorage.removeItem("sds_translations");
    localStorage.removeItem("sds_project_details");
    localStorage.removeItem("sds_projects_list");
    localStorage.removeItem("sds_archive_items");
    this.notify();

    try {
      // Clear remotely by pushing defaults
      await supabaseClient.upsertTable("sds_translations", [{ id: 1, data: defaultTranslations }]);
      await supabaseClient.upsertTable("sds_project_details", [{ id: 1, data: defaultProjectDetails }]);
      await supabaseClient.upsertTable("sds_archive_items", [{ id: 1, data: defaultArchiveItems }]);
    } catch (e) {
      console.error("Failed to reset Supabase tables:", e);
    }
  }
};
