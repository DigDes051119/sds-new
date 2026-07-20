import { useState, useEffect } from "react";
import { cmsService } from "../cmsService";
import { Plus, Trash2, Edit2, Check, Save, X, Image, Loader2, Camera, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { supabaseClient } from "../supabaseClient";
import { getEmbedUrl, getAspectClass } from "../videoHelper";
import { convertToWebM } from "../videoConverter";


const slugify = (text: string) => {
  const ruToEn: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya'
  };
  return text
    .toLowerCase()
    .split('')
    .map(char => ruToEn[char] !== undefined ? ruToEn[char] : char)
    .join('')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export function AdminProjectsEditor() {
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingBlocks, setUploadingBlocks] = useState<Record<string, boolean>>({});
  const [conversionProgress, setConversionProgress] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);

  const handleProjectDragStart = (e: React.DragEvent, index: number) => {
    if (isReadOnly) return;
    setDraggedProjectIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleProjectDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedProjectIndex === null || draggedProjectIndex === targetIndex) return;

    try {
      const newTranslations = JSON.parse(JSON.stringify(translations));

      const langs = ["ru", "en", "kg"] as const;
      langs.forEach(lang => {
        const items = newTranslations[lang].projects.items;
        const [movedItem] = items.splice(draggedProjectIndex, 1);
        items.splice(targetIndex, 0, movedItem);
      });

      await cmsService.updateTranslations(newTranslations);
      setTranslations(newTranslations);

      await logAdminAction(
        "Управление проектами",
        "Сортировка проектов",
        `Изменен порядок проектов`
      );
    } catch (err: any) {
      alert("Ошибка при сохранении порядка: " + err.message);
    } finally {
      setDraggedProjectIndex(null);
    }
  };

  const handleMoveProject = async (index: number, direction: "up" | "down") => {
    if (isReadOnly) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const items = translations.ru.projects.items;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    try {
      const newTranslations = JSON.parse(JSON.stringify(translations));
      const langs = ["ru", "en", "kg"] as const;
      langs.forEach(lang => {
        const arr = newTranslations[lang].projects.items;
        const temp = arr[index];
        arr[index] = arr[targetIndex];
        arr[targetIndex] = temp;
      });
      await cmsService.updateTranslations(newTranslations);
      setTranslations(newTranslations);
      await logAdminAction(
        "Управление проектами",
        "Сортировка проектов",
        `Изменен порядок: проект сдвинут ${direction === "up" ? "вверх" : "вниз"}`
      );
    } catch (err: any) {
      alert("Ошибка при сохранении порядка: " + err.message);
    }
  };

  useEffect(() => {
    return cmsService.subscribe(() => {
      setTranslations(cmsService.getTranslations());
      setProjectDetails(cmsService.getProjectDetails());
    });
  }, []);

  // Restore Synq project automatically if missing (runs securely under admin session)
  useEffect(() => {
    const runSynqRestore = async () => {
      try {
        console.log("[Synq Restore] Restoring Synq with hardcoded verified project assets...");

        const heroImg = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-block-1-2-1784455081963.webp";
        const collageBlocks = [
          [
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-block-1-0-1784455068772.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-block-1-1-1784455075044.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-block-1-2-1784455081963.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-block-1-3-1784455088223.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-block-1-4-1784455100473.webp"
          ]
        ];

        // Fetch fresh translations and details from Supabase to prevent race conditions
        const remoteTranslationsRows = await supabaseClient.fetchTable("sds_translations");
        const remoteDetailsRows = await supabaseClient.fetchTable("sds_project_details");

        if (!remoteTranslationsRows?.[0] || !remoteDetailsRows?.[0]) {
          throw new Error("Empty tables returned from Supabase");
        }

        const newTranslations = JSON.parse(JSON.stringify(remoteTranslationsRows[0].data));
        const newDetails = JSON.parse(JSON.stringify(remoteDetailsRows[0].data));

        const listEntryRu = { id: "synq", name: "Synq", category: "Промышленный дизайн", categoryKey: "industrial", img: heroImg, createdAt: "2026-07-19T09:58:20.473Z" };
        const listEntryEn = { id: "synq", name: "Synq", category: "Industrial Design", categoryKey: "industrial", img: heroImg, createdAt: "2026-07-19T09:58:20.473Z" };
        const listEntryKg = { id: "synq", name: "Synq", category: "Промышленный дизайн", categoryKey: "industrial", img: heroImg, createdAt: "2026-07-19T09:58:20.473Z" };

        // Clean existing synq entries to prevent duplicates and clean up mixed state
        ["ru", "en", "kg"].forEach(lang => {
          newTranslations[lang].projects.items = newTranslations[lang].projects.items.filter((p: any) => p.id !== "synq");
        });

        newTranslations.ru.projects.items.unshift(listEntryRu);
        newTranslations.en.projects.items.unshift(listEntryEn);
        newTranslations.kg.projects.items.unshift(listEntryKg);

        const detailEntryRu = {
          name: "Synq",
          desc: "Synq — это бренд, сочетающий инновационный дизайн с современной индустриальной эстетикой, обеспечивающий бескомпромиссный физический и цифровой опыт.",
          client: "Synq Inc.",
          year: "2026",
          service: "Промышленный дизайн / Брендинг",
          challenge: "Разработать целостную визуальную идентичность бренда и физические макеты, отражающие основные принципы точности и связности Synq.",
          processImages: collageBlocks.flat(),
          collageBlocks: collageBlocks,
          collageTheme: "light",
          results: ["Создана единая визуальная система дизайна", "Разработаны высокоточные интерактивные физические макеты"],
          websiteUrl: ""
        };

        const detailEntryEn = {
          name: "Synq",
          desc: "Synq is a brand that combines innovative design with modern industrial aesthetic, delivering uncompromising physical and digital experiences.",
          client: "Synq Inc.",
          year: "2026",
          service: "Industrial Design / Branding",
          challenge: "To design a cohesive brand identity and physical mockup assets that reflect Synq's core principles of precision and connectivity.",
          processImages: collageBlocks.flat(),
          collageBlocks: collageBlocks,
          collageTheme: "light",
          results: ["Established a unified visual design system", "Created high-fidelity interactive physical mockups"],
          websiteUrl: ""
        };

        const detailEntryKg = {
          name: "Synq",
          desc: "Synq — инновациялык дизайнды заманбап индустриалдык эстетика менен айкалыштырган, физикалык жана санариптик тажрыйбаны камсыз кылган бренд.",
          client: "Synq Inc.",
          year: "2026",
          service: "Промышленный дизайн / Брендинг",
          challenge: "Synq-тун тактык жана байланыш негизги принциптерин чагылдырган бирдиктүү бренддин визуалдык иденттүүлүгүн жана физикалык макеттерин иштеп чыгуу.",
          processImages: collageBlocks.flat(),
          collageBlocks: collageBlocks,
          collageTheme: "light",
          results: ["Бирдиктүү визуалдык дизайн системасы түзүлдү", "Жогорку тактыктагы интерактивдүү физикалык макеттер иштелип чыкты"],
          websiteUrl: ""
        };

        newDetails.ru["synq"] = detailEntryRu;
        newDetails.en["synq"] = detailEntryEn;
        newDetails.kg["synq"] = detailEntryKg;

        // Save securely using CMS Service secure update
        await cmsService.updateTranslations(newTranslations);
        await cmsService.updateProjectDetails(newDetails);

        console.log("[Synq Restore] Synq successfully restored securely using admin session!");
      } catch (err) {
        console.error("[Synq Restore] Error during secure auto-restore:", err);
      }
    };

    const timer = setTimeout(runSynqRestore, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check current admin permissions
  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isReadOnly = currentAdmin.permissions?.projects === false;

  const generateSlugFromName = () => {
    if (formNameRu) {
      setFormId(slugify(formNameRu));
    }
  };

  const handleNameRuChange = (val: string) => {
    setFormNameRu(val);
    // Auto generate ID if we are creating a new project and ID is empty or matches previous slugified name
    if (isAdding && (!formId || formId === slugify(formNameRu))) {
      setFormId(slugify(val));
    }
  };

  const handleUploadPhoto = async (target: "img" | { blockIdx: number; imgIdx: number }, file: File) => {
    if (isReadOnly) return;
    if (!formId) {
      alert("Пожалуйста, сначала укажите ID или название проекта, чтобы файлы загружались в правильную папку.");
      return;
    }
    const isHero = target === "img";
    const key = isHero ? "img" : `${target.blockIdx}-${target.imgIdx}`;
    try {
      if (isHero) setUploadingImg(true);
      else setUploadingBlocks(prev => ({ ...prev, [key]: true }));

      const fileExt = file.name.split('.').pop();
      const fileName = `project-${isHero ? "hero" : `block-${target.blockIdx}-${target.imgIdx}`}-${Date.now()}.${fileExt}`;
      const path = `projects/${formId}/${fileName}`;

      const publicUrl = await supabaseClient.uploadFile("assets", path, file);

      if (isHero) {
        setFormImg(publicUrl);
      } else {
        setFormCollageBlocks(prev => {
          return prev.map((block, bIdx) => {
            if (bIdx === target.blockIdx) {
              return block.map((img, iIdx) => iIdx === target.imgIdx ? publicUrl : img);
            }
            return block;
          });
        });
      }
    } catch (e: any) {
      alert("Ошибка при загрузке фотографии: " + e.message);
    } finally {
      if (isHero) setUploadingImg(false);
      else setUploadingBlocks(prev => ({ ...prev, [key]: false }));
    }
  };

  // Form states for creating/editing a project
  const [draggedPhoto, setDraggedPhoto] = useState<{ blockIdx: number; imgIdx: number } | null>(null);
  const [draggedOverZone, setDraggedOverZone] = useState<string | null>(null);
  const [formId, setFormId] = useState("");
  const [formCategoryKey, setFormCategoryKey] = useState("branding");
  const [formImg, setFormImg] = useState("https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600");

  // Multilingual fields for projects list
  const [formNameRu, setFormNameRu] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formNameKg, setFormNameKg] = useState("");
  const [formCategoryRu, setFormCategoryRu] = useState("");
  const [formCategoryEn, setFormCategoryEn] = useState("");
  const [formCategoryKg, setFormCategoryKg] = useState("");

  // Multilingual fields for project details
  const [formDescRu, setFormDescRu] = useState("");
  const [formDescEn, setFormDescEn] = useState("");
  const [formDescKg, setFormDescKg] = useState("");
  const [formClientRu, setFormClientRu] = useState("");
  const [formClientEn, setFormClientEn] = useState("");
  const [formClientKg, setFormClientKg] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formServiceRu, setFormServiceRu] = useState("");
  const [formServiceEn, setFormServiceEn] = useState("");
  const [formServiceKg, setFormServiceKg] = useState("");
  const [formChallengeRu, setFormChallengeRu] = useState("");
  const [formChallengeEn, setFormChallengeEn] = useState("");
  const [formChallengeKg, setFormChallengeKg] = useState("");

  // Collage Blocks (array of arrays of image URLs)
  const [formCollageBlocks, setFormCollageBlocks] = useState<string[][]>([]);
  const [formCollageTheme, setFormCollageTheme] = useState("light");

  // Results (list of stats)
  const [formResult1Ru, setFormResult1Ru] = useState("");
  const [formResult1En, setFormResult1En] = useState("");
  const [formResult1Kg, setFormResult1Kg] = useState("");
  const [formResult2Ru, setFormResult2Ru] = useState("");
  const [formResult2En, setFormResult2En] = useState("");
  const [formResult2Kg, setFormResult2Kg] = useState("");
  const [formWebsiteUrl, setFormWebsiteUrl] = useState("");

  const categories = [
    { key: "branding", label: "Branding" },
    { key: "industrial", label: "Industrial Design" },
    { key: "marketing", label: "Marketing" },
    { key: "concept", label: "Concept Design" },
    { key: "graphic", label: "Graphic Design" },
    { key: "automotive", label: "Automotive Design" },
    { key: "architectural", label: "Architectural Design" },
    { key: "product", label: "Product Design" },
    { key: "motion", label: "Motion Design" },
    { key: "music", label: "Music & Sound" },
    { key: "web", label: "Web Developing / Design" },
    { key: "uiux", label: "UI UX Design" }
  ];

  const categoryNames: Record<string, { ru: string; en: string; kg: string }> = {
    branding: { ru: "Брендинг", en: "Branding", kg: "Брендинг" },
    industrial: { ru: "Промышленный дизайн", en: "Industrial Design", kg: "Промышленный дизайн" },
    marketing: { ru: "Маркетинг", en: "Marketing", kg: "Маркетинг" },
    concept: { ru: "Концепт-дизайн", en: "Concept Design", kg: "Концепт-дизайн" },
    graphic: { ru: "Графический дизайн", en: "Graphic Design", kg: "Графический дизайн" },
    automotive: { ru: "Автомобильный дизайн", en: "Automotive Design", kg: "Автомобильный дизайн" },
    architectural: { ru: "Архитектурный дизайн", en: "Architectural Design", kg: "Архитектурный дизайн" },
    product: { ru: "Дизайн продуктов", en: "Product Design", kg: "Дизайн продуктов" },
    motion: { ru: "Моушн-дизайн", en: "Motion Design", kg: "Моушн-дизайн" },
    music: { ru: "Музыка и звук", en: "Music & Sound", kg: "Музыка и звук" },
    web: { ru: "Веб-разработка / Дизайн", en: "Web Developing / Design", kg: "Веб-разработка / Дизайн" },
    uiux: { ru: "UI UX Дизайн", en: "UI UX Design", kg: "UI UX Дизайн" }
  };

  const resetForm = (catKey?: string) => {
    setFormId("");

    const activeKey = catKey && catKey !== "all" ? catKey : "branding";
    setFormCategoryKey(activeKey);

    const names = categoryNames[activeKey] || { ru: "Брендинг", en: "Branding", kg: "Брендинг" };
    setFormCategoryRu(names.ru);
    setFormCategoryEn(names.en);
    setFormCategoryKg(names.kg);

    setFormImg("https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600");
    setFormNameRu("");
    setFormNameEn("");
    setFormNameKg("");
    setFormDescRu("");
    setFormDescEn("");
    setFormDescKg("");
    setFormClientRu("");
    setFormClientEn("");
    setFormClientKg("");
    setFormYear(new Date().getFullYear().toString());
    setFormServiceRu("");
    setFormServiceEn("");
    setFormServiceKg("");
    setFormChallengeRu("");
    setFormChallengeEn("");
    setFormChallengeKg("");
    setFormCollageBlocks([
      [
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600"
      ]
    ]);
    setFormResult1Ru("");
    setFormResult1En("");
    setFormResult1Kg("");
    setFormResult2Ru("");
    setFormResult2En("");
    setFormResult2Kg("");
    setFormCollageTheme("light");
    setFormWebsiteUrl("");
  };

  const startAdding = () => {
    if (isReadOnly) return;
    resetForm(selectedCategory);
    setIsAdding(true);
    setEditingId(null);
  };

  const startEditing = (id: string) => {
    if (isReadOnly) return;
    setEditingId(id);
    setIsAdding(false);

    // Get basic list project entry
    const projRu = translations.ru.projects.items.find((p: any) => p.id === id) || {};
    const projEn = translations.en.projects.items.find((p: any) => p.id === id) || {};
    const projKg = translations.kg.projects.items.find((p: any) => p.id === id) || {};

    // Get detailed project entries
    const detailRu = projectDetails.ru[id] || {};
    const detailEn = projectDetails.en[id] || {};
    const detailKg = projectDetails.kg[id] || {};

    setFormId(id);
    setFormCategoryKey(projRu.categoryKey || "branding");
    setFormImg(projRu.img || "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600");

    setFormNameRu(projRu.name || detailRu.name || "");
    setFormNameEn(projEn.name || detailEn.name || "");
    setFormNameKg(projKg.name || detailKg.name || "");

    setFormCategoryRu(projRu.category || "");
    setFormCategoryEn(projEn.category || "");
    setFormCategoryKg(projKg.category || "");

    setFormDescRu(detailRu.desc || "");
    setFormDescEn(detailEn.desc || "");
    setFormDescKg(detailKg.desc || "");

    setFormClientRu(detailRu.client || "");
    setFormClientEn(detailEn.client || "");
    setFormClientKg(detailKg.client || "");
    setFormYear(detailRu.year || "");

    setFormServiceRu(detailRu.service || "");
    setFormServiceEn(detailEn.service || "");
    setFormServiceKg(detailKg.service || "");

    setFormChallengeRu(detailRu.challenge || "");
    setFormChallengeEn(detailEn.challenge || "");
    setFormChallengeKg(detailKg.challenge || "");

    const initialBlocks = detailRu.collageBlocks && detailRu.collageBlocks.length > 0
      ? JSON.parse(JSON.stringify(detailRu.collageBlocks))
      : (detailRu.processImages && detailRu.processImages.length > 0 ? [JSON.parse(JSON.stringify(detailRu.processImages))] : [[]]);
    setFormCollageBlocks(initialBlocks);
    setFormCollageTheme(detailRu.collageTheme || (id === "ala-too" || id === "chyraq" || id === "auto-concept-x" ? "dark" : "light"));

    setFormResult1Ru(detailRu.results?.[0] || "");
    setFormResult1En(detailEn.results?.[0] || "");
    setFormResult1Kg(detailKg.results?.[0] || "");

    setFormResult2Ru(detailRu.results?.[1] || "");
    setFormResult2En(detailEn.results?.[1] || "");
    setFormResult2Kg(detailKg.results?.[1] || "");
    setFormWebsiteUrl(detailRu.websiteUrl || "");
  };

  const handlePhotoDragStart = (e: React.DragEvent, blockIdx: number, imgIdx: number) => {
    if (isReadOnly) return;
    setDraggedPhoto({ blockIdx, imgIdx });
    e.dataTransfer.setData("text/plain", JSON.stringify({ blockIdx, imgIdx }));
  };

  const handlePhotoDragEnd = () => {
    setDraggedPhoto(null);
    setDraggedOverZone(null);
  };

  const handlePhotoDropOnPhoto = (e: React.DragEvent, targetBlockIdx: number, targetImgIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverZone(null);
    if (!draggedPhoto) return;

    const { blockIdx: srcBlockIdx, imgIdx: srcImgIdx } = draggedPhoto;
    const imgUrl = formCollageBlocks[srcBlockIdx][srcImgIdx];
    if (!imgUrl) return;

    setFormCollageBlocks(prev => {
      let next = JSON.parse(JSON.stringify(prev));

      // Remove from source
      next[srcBlockIdx].splice(srcImgIdx, 1);

      // Insert into target block at target index
      if (next[targetBlockIdx].length < 5 || srcBlockIdx === targetBlockIdx) {
        next[targetBlockIdx].splice(targetImgIdx, 0, imgUrl);
      } else {
        alert("В блоке не может быть больше 5 фотографий!");
        return prev;
      }

      // Clean up empty blocks
      return next.map((block: any) => block.length === 0 ? [] : block);
    });
  };

  const handlePhotoDropOnBlock = (e: React.DragEvent, targetBlockIdx: number) => {
    e.preventDefault();
    setDraggedOverZone(null);
    if (!draggedPhoto) return;

    const { blockIdx: srcBlockIdx, imgIdx: srcImgIdx } = draggedPhoto;
    if (srcBlockIdx === targetBlockIdx) return; // Already in this block

    const imgUrl = formCollageBlocks[srcBlockIdx][srcImgIdx];
    if (!imgUrl) return;

    setFormCollageBlocks(prev => {
      let next = JSON.parse(JSON.stringify(prev));

      if (next[targetBlockIdx].length >= 5) {
        alert("В блоке не может быть больше 5 фотографий!");
        return prev;
      }

      // Remove from source
      next[srcBlockIdx].splice(srcImgIdx, 1);
      // Append to target
      next[targetBlockIdx].push(imgUrl);

      // Clean up empty blocks
      return next.map((block: any) => block.length === 0 ? [] : block);
    });
  };

  const handlePhotoDropOnButton = (e: React.DragEvent, action: "start" | "end" | { insertAfter: number }) => {
    e.preventDefault();
    setDraggedOverZone(null);
    if (!draggedPhoto) return;

    const { blockIdx: srcBlockIdx, imgIdx: srcImgIdx } = draggedPhoto;
    const imgUrl = formCollageBlocks[srcBlockIdx][srcImgIdx];
    if (!imgUrl) return;

    setFormCollageBlocks(prev => {
      let next = JSON.parse(JSON.stringify(prev));

      // Remove from source
      next[srcBlockIdx].splice(srcImgIdx, 1);

      // Insert new block
      if (action === "start") {
        next.unshift([imgUrl]);
      } else if (action === "end") {
        next.push([imgUrl]);
      } else {
        next.splice(action.insertAfter + 1, 0, [imgUrl]);
      }

      // Clean up empty blocks
      return next.map((block: any) => block.length === 0 ? [] : block);
    });
  };

  const moveBlockUp = (index: number) => {
    if (index <= 0) return;
    setFormCollageBlocks(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
  };

  const moveBlockDown = (index: number) => {
    setFormCollageBlocks(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
  };

  const movePhotoLeft = (blockIdx: number, imgIdx: number) => {
    if (imgIdx <= 0) return;
    setFormCollageBlocks(prev => {
      return prev.map((block, bIdx) => {
        if (bIdx === blockIdx) {
          const nextBlock = [...block];
          const temp = nextBlock[imgIdx];
          nextBlock[imgIdx] = nextBlock[imgIdx - 1];
          nextBlock[imgIdx - 1] = temp;
          return nextBlock;
        }
        return block;
      });
    });
  };

  const movePhotoRight = (blockIdx: number, imgIdx: number) => {
    setFormCollageBlocks(prev => {
      return prev.map((block, bIdx) => {
        if (bIdx === blockIdx) {
          if (imgIdx >= block.length - 1) return block;
          const nextBlock = [...block];
          const temp = nextBlock[imgIdx];
          nextBlock[imgIdx] = nextBlock[imgIdx + 1];
          nextBlock[imgIdx + 1] = temp;
          return nextBlock;
        }
        return block;
      });
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      setTranslating(true);

      // Auto translate RU fields to EN and KG
      const nameEn = await translateText(formNameRu, "en");
      const nameKg = await translateText(formNameRu, "kg");

      const categoryEn = await translateText(formCategoryRu, "en");
      const categoryKg = await translateText(formCategoryRu, "kg");

      const descEn = await translateText(formDescRu, "en");
      const descKg = await translateText(formDescRu, "kg");

      const clientEn = await translateText(formClientRu, "en");
      const clientKg = await translateText(formClientRu, "kg");

      const serviceEn = await translateText(formServiceRu, "en");
      const serviceKg = await translateText(formServiceRu, "kg");

      const challengeEn = await translateText(formChallengeRu, "en");
      const challengeKg = await translateText(formChallengeRu, "kg");

      const result1En = await translateText(formResult1Ru, "en");
      const result1Kg = await translateText(formResult1Ru, "kg");

      const result2En = await translateText(formResult2Ru, "en");
      const result2Kg = await translateText(formResult2Ru, "kg");

      // Fetch fresh translations and details from Supabase to prevent race conditions
      const remoteTranslationsRows = await supabaseClient.fetchTable("sds_translations");
      const remoteDetailsRows = await supabaseClient.fetchTable("sds_project_details");

      if (!remoteTranslationsRows?.[0] || !remoteDetailsRows?.[0]) {
        throw new Error("Не удалось получить актуальные данные с сервера.");
      }

      const newTranslations = JSON.parse(JSON.stringify(remoteTranslationsRows[0].data));
      const newDetails = JSON.parse(JSON.stringify(remoteDetailsRows[0].data));

      // Formulate the project list entries
      const existingCreatedAt = editingId
        ? (newTranslations.ru.projects.items.find((p: any) => p.id === editingId)?.createdAt || null)
        : new Date().toISOString();

      const listEntryRu = { id: formId, name: formNameRu, category: formCategoryRu, categoryKey: formCategoryKey, img: formImg, createdAt: existingCreatedAt };
      const listEntryEn = { id: formId, name: nameEn, category: categoryEn, categoryKey: formCategoryKey, img: formImg, createdAt: existingCreatedAt };
      const listEntryKg = { id: formId, name: nameKg, category: categoryKg, categoryKey: formCategoryKey, img: formImg, createdAt: existingCreatedAt };

      // Formulate project details entries
      const cleanBlocks = formCollageBlocks.map(block => block.filter(Boolean)).filter(block => block.length > 0);
      const flattenedImages = cleanBlocks.flat();

      const detailEntryRu = {
        name: formNameRu,
        desc: formDescRu,
        client: formClientRu,
        year: formYear,
        service: formServiceRu,
        challenge: formChallengeRu,
        processImages: flattenedImages,
        collageBlocks: cleanBlocks,
        collageTheme: formCollageTheme,
        results: [formResult1Ru, formResult2Ru].filter(Boolean),
        websiteUrl: formWebsiteUrl
      };

      const detailEntryEn = {
        name: nameEn,
        desc: descEn,
        client: clientEn,
        year: formYear,
        service: serviceEn,
        challenge: challengeEn,
        processImages: flattenedImages,
        collageBlocks: cleanBlocks,
        collageTheme: formCollageTheme,
        results: [result1En, result2En].filter(Boolean),
        websiteUrl: formWebsiteUrl
      };

      const detailEntryKg = {
        name: nameKg,
        desc: descKg,
        client: clientKg,
        year: formYear,
        service: serviceKg,
        challenge: challengeKg,
        processImages: flattenedImages,
        collageBlocks: cleanBlocks,
        collageTheme: formCollageTheme,
        results: [result1Kg, result2Kg].filter(Boolean),
        websiteUrl: formWebsiteUrl
      };

      // Check if new ID already exists
      const isIdTaken = newTranslations.ru.projects.items.some((p: any) => p.id === formId && p.id !== editingId);
      if (isIdTaken) {
        alert(`Проект с ID "${formId}" уже существует. Пожалуйста, выберите другой ID.`);
        return;
      }

      if (editingId) {
        // Modify existing entries in translations
        ["ru", "en", "kg"].forEach((lang) => {
          const items = newTranslations[lang].projects.items;
          const index = items.findIndex((p: any) => p.id === editingId);
          if (index !== -1) {
            items[index] = lang === "ru" ? listEntryRu : lang === "en" ? listEntryEn : listEntryKg;
          }

          // Also update the id in home.projects if it exists there
          if (newTranslations[lang]?.home?.projects) {
            const hProjIdx = newTranslations[lang].home.projects.findIndex((p: any) => p.id === editingId);
            if (hProjIdx !== -1) {
              newTranslations[lang].home.projects[hProjIdx].id = formId;
              newTranslations[lang].home.projects[hProjIdx].name = lang === "ru" ? formNameRu : (lang === "en" ? nameEn : nameKg);
              newTranslations[lang].home.projects[hProjIdx].category = lang === "ru" ? formCategoryRu : (lang === "en" ? categoryEn : categoryKg);
              newTranslations[lang].home.projects[hProjIdx].categoryKey = formCategoryKey;
              newTranslations[lang].home.projects[hProjIdx].img = formImg;
            }
          }
        });

        // Modify existing entries in details
        if (editingId !== formId) {
          delete newDetails.ru[editingId];
          delete newDetails.en[editingId];
          delete newDetails.kg[editingId];
        }
        newDetails.ru[formId] = detailEntryRu;
        newDetails.en[formId] = detailEntryEn;
        newDetails.kg[formId] = detailEntryKg;
      } else {
        // Add new entries to translations — insert at the top (index 0)
        newTranslations.ru.projects.items.unshift(listEntryRu);
        newTranslations.en.projects.items.unshift(listEntryEn);
        newTranslations.kg.projects.items.unshift(listEntryKg);

        // Add to details
        newDetails.ru[formId] = detailEntryRu;
        newDetails.en[formId] = detailEntryEn;
        newDetails.kg[formId] = detailEntryKg;
      }

      // Save and publish
      await cmsService.updateTranslations(newTranslations);
      await cmsService.updateProjectDetails(newDetails);

      // Log action
      await logAdminAction(
        "Управление проектами",
        editingId ? "Редактирование проекта" : "Создание проекта",
        editingId ? `Изменен проект: ${formId} (${formNameRu})` : `Создан новый проект: ${formId} (${formNameRu})`
      );

      setTranslations(newTranslations);
      setProjectDetails(newDetails);

      setSuccessMessage(editingId ? "Проект успешно обновлен!" : "Проект успешно создан!");
      setEditingId(null);
      setIsAdding(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert("Ошибка сохранения: " + (err.message || err));
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isReadOnly) return;
    if (confirm("Вы действительно хотите удалить проект?")) {
      try {
        // Fetch fresh translations and details from Supabase to prevent race conditions
        const remoteTranslationsRows = await supabaseClient.fetchTable("sds_translations");
        const remoteDetailsRows = await supabaseClient.fetchTable("sds_project_details");

        if (!remoteTranslationsRows?.[0] || !remoteDetailsRows?.[0]) {
          throw new Error("Не удалось получить актуальные данные с сервера.");
        }

        const newTranslations = JSON.parse(JSON.stringify(remoteTranslationsRows[0].data));
        const newDetails = JSON.parse(JSON.stringify(remoteDetailsRows[0].data));

        // Remove from projects list and featured projects list
        ["ru", "en", "kg"].forEach((lang) => {
          if (newTranslations[lang]?.projects?.items) {
            newTranslations[lang].projects.items = newTranslations[lang].projects.items.filter((p: any) => p.id !== id);
          }
          if (newTranslations[lang]?.home?.projects) {
            newTranslations[lang].home.projects = newTranslations[lang].home.projects.filter((p: any) => p.id !== id);
          }
        });

        delete newDetails.ru[id];
        delete newDetails.en[id];
        delete newDetails.kg[id];

        // Save changes to database
        await cmsService.updateTranslations(newTranslations);
        await cmsService.updateProjectDetails(newDetails);

        // Log action
        await logAdminAction(
          "Управление проектами",
          "Удаление проекта",
          `Удален проект с ID: ${id}`
        );

        setTranslations(newTranslations);
        setProjectDetails(newDetails);

        setSuccessMessage("Проект успешно удален!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        alert("Ошибка при удалении проекта: " + (err.message || err));
      }
    }
  };

  const rawProjects = translations.ru.projects.items;
  const projectsList = rawProjects.map((project: any) => {
    const detail = projectDetails.ru[project.id] || {};
    return {
      ...project,
      desc: detail.desc || "",
      year: detail.year || "2026",
    };
  });

  const filteredProjects = selectedCategory === "all"
    ? projectsList
    : projectsList.filter((p: any) => p.categoryKey === selectedCategory);

  const adminCategories = [
    { key: "all", label: "Все" },
    ...categories.map(c => ({ key: c.key, label: c.label }))
  ];

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {isReadOnly && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-xl">
          Доступ ограничен. У вас нет прав на редактирование проектов.
        </div>
      )}

      {/* Only the miniature page view */}
      {!editingId && !isAdding && (
        <div className="w-full space-y-6">
          {/* Scale/Mockup container with page content */}
          <div className="rounded-2xl overflow-hidden bg-[#fafaf6] text-black border border-black/5 shadow-2xl font-['Inter',sans-serif] text-xs p-8 pb-16 select-none">

            {/* Category Pills replica */}
            <div className="flex overflow-x-auto scrollbar-none flex-nowrap gap-1.5 pb-4 border-b border-black/[0.04] mb-6">
              {adminCategories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`rounded-full px-4.5 py-2 text-[13px] font-semibold transition duration-200 cursor-pointer ${isActive
                      ? "bg-[#0000FF] text-white"
                      : "text-black/60 bg-black/[0.04] hover:bg-black/[0.08]"
                      }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Projects Grid Replica with drag & drop */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {filteredProjects.map((project: any) => {
                const realIdx = projectsList.findIndex((p: any) => p.id === project.id);
                return (
                  <div
                    key={project.id}
                    draggable={!isReadOnly}
                    onDragStart={(e) => handleProjectDragStart(e, realIdx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleProjectDrop(e, realIdx)}
                    className="flex flex-col group/card p-3 rounded-2xl hover:bg-black/[0.02] border border-transparent hover:border-black/[0.04] transition duration-200 relative cursor-grab active:cursor-grabbing"
                    title="Зажмите и перетащите для изменения порядка"
                  >
                    {/* Hover action overlay on card image */}
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#eeeee9] mb-3 border border-black/5 relative">
                      <img src={project.img} alt={project.name} className="w-full h-full object-cover" />

                      {!isReadOnly && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100 transition duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(project.id);
                            }}
                            className="p-2 bg-white hover:bg-[#eeeee9] text-black rounded-lg shadow-md transition cursor-pointer flex items-center gap-1 text-[9px] font-bold uppercase"
                          >
                            <Edit2 className="w-3 h-3" />
                            Изменить
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project.id);
                            }}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveProject(realIdx, "up");
                              }}
                              disabled={realIdx === 0}
                              className="p-1.5 bg-white/90 hover:bg-white disabled:opacity-30 text-black rounded-md shadow-md transition cursor-pointer"
                              title="Переместить выше"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveProject(realIdx, "down");
                              }}
                              disabled={realIdx === projectsList.length - 1}
                              className="p-1.5 bg-white/90 hover:bg-white disabled:opacity-30 text-black rounded-md shadow-md transition cursor-pointer"
                              title="Переместить ниже"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[12px] text-[#0000FF] font-semibold uppercase tracking-wider">{project.category}</span>
                    <h3 className="text-[18px] font-bold tracking-tight text-black mt-1 leading-tight">{project.name}</h3>
                    <p className="text-[13px] text-black/60 line-clamp-2 mt-1 leading-relaxed font-light">{project.desc}</p>
                  </div>
                );
              })}

              {/* Add Project Card Button inside the grid */}
              {!isReadOnly && (
                <div
                  onClick={startAdding}
                  className="flex flex-col group/add p-3 rounded-2xl hover:bg-black/[0.01] transition duration-200 cursor-pointer"
                >
                  <div className="w-full aspect-[16/10] rounded-xl border-2 border-dashed border-black/15 hover:border-[#0000FF]/40 hover:bg-[#0000FF]/5 flex flex-col items-center justify-center gap-2 transition duration-200 mb-3 bg-black/[0.01]">
                    <Plus className="w-8 h-8 text-black/30 group-hover/add:text-[#0000FF]/60 transition" />
                  </div>
                  <span className="text-[12px] text-[#0000FF] font-semibold uppercase tracking-wider">Новый кейс</span>
                  <h3 className="text-[18px] font-bold tracking-tight text-black mt-1 leading-tight">Добавить проект</h3>
                  <p className="text-[13px] text-black/40 line-clamp-2 mt-1 leading-relaxed font-light">Нажмите для создания нового проекта</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Form & Preview Layout */}
      {(editingId || isAdding) && (
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">

          {/* Left Column: Form */}
          <motion.form
            onSubmit={handleSave}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-8"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
              <h3 className="text-xl font-bold tracking-tight text-white/90">
                {editingId ? `Редактирование проекта: ${editingId}` : "Новый проект"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setIsAdding(false);
                }}
                className="p-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/60 hover:text-white rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card 1: Основные параметры */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066FF] border-b border-white/[0.04] pb-2">
                1. Основные параметры
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Название проекта (RU)</label>
                  <input
                    type="text"
                    value={formNameRu}
                    onChange={(e) => handleNameRuChange(e.target.value)}
                    placeholder="Sandyq"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Категория (RU)</label>
                  <input
                    type="text"
                    value={formCategoryRu}
                    onChange={(e) => setFormCategoryRu(e.target.value)}
                    placeholder="Брендинг"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Категория (Ключ фильтра)</label>
                  <select
                    value={formCategoryKey}
                    onChange={(e) => setFormCategoryKey(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                  >
                    {categories.map((c) => (
                      <option key={c.key} value={c.key} className="bg-[#080810] text-white">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Год</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 2: URL и Внешний вид */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066FF] border-b border-white/[0.04] pb-2">
                2. URL и Внешний вид
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">ID Проекта (URL латиница)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="sandyq"
                      className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateSlugFromName}
                      className="px-4 bg-[#0000FF]/15 hover:bg-[#0000FF]/30 text-[#0066FF] border border-[#0000FF]/25 font-bold rounded-xl text-xs transition duration-200 active:scale-95 cursor-pointer"
                      title="Сгенерировать ID из названия"
                    >
                      Авто
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Тема коллажей</label>
                  <select
                    value={formCollageTheme}
                    onChange={(e) => setFormCollageTheme(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                  >
                    <option value="light" className="bg-[#080810] text-white">Светлая</option>
                    <option value="dark" className="bg-[#080810] text-white">Темная</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 3: Метаданные кейса */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066FF] border-b border-white/[0.04] pb-2">
                3. Метаданные кейса
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Клиент (RU / EN / KG)</label>
                  <input
                    type="text"
                    value={formClientRu}
                    onChange={(e) => {
                      setFormClientRu(e.target.value);
                      setFormClientEn(e.target.value);
                      setFormClientKg(e.target.value);
                    }}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Услуги (RU / EN / KG)</label>
                  <input
                    type="text"
                    value={formServiceRu}
                    onChange={(e) => {
                      setFormServiceRu(e.target.value);
                      setFormServiceEn(e.target.value);
                      setFormServiceKg(e.target.value);
                    }}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Ссылка на сайт компании (Кнопка в шапке)</label>
                  <input
                    type="text"
                    value={formWebsiteUrl}
                    onChange={(e) => setFormWebsiteUrl(e.target.value)}
                    placeholder="https://royalconstruction.kg"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Детальное описание и результаты */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066FF] border-b border-white/[0.04] pb-2">
                4. Детальное описание кейса
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Краткое описание проекта (RU)</label>
                  <textarea
                    value={formDescRu}
                    onChange={(e) => setFormDescRu(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-20 text-sm leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Сложность / Вызов проекта (RU)</label>
                  <textarea
                    value={formChallengeRu}
                    onChange={(e) => setFormChallengeRu(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-24 text-sm leading-relaxed"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Результат / Показатель 1 (RU)</label>
                  <input
                    type="text"
                    value={formResult1Ru}
                    onChange={(e) => setFormResult1Ru(e.target.value)}
                    placeholder="Выход на международный рынок"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Результат / Показатель 2 (RU)</label>
                  <input
                    type="text"
                    value={formResult2Ru}
                    onChange={(e) => setFormResult2Ru(e.target.value)}
                    placeholder="Увеличение вовлеченности аудитории на 40%"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="submit"
                disabled={translating}
                className="px-6 py-4 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold rounded-xl text-sm transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {translating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Перевод и сохранение...
                  </>
                ) : editingId ? (
                  "Сохранить изменения"
                ) : (
                  "Создать проект"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setIsAdding(false);
                }}
                className="px-6 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] font-bold rounded-xl text-sm transition duration-300"
              >
                Отмена
              </button>
            </div>
          </motion.form>

          {/* Right Column: Live Interactive Mockup Preview */}
          <div className="sticky top-6 space-y-4 max-h-[85vh] overflow-y-auto border border-white/[0.08] rounded-3xl p-6 bg-[#161622] shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">Интерактивный макет (Зажмите для сортировки / Клик для замены)</h4>
              <span className="text-[10px] bg-[#0000FF]/15 text-[#0066FF] border border-[#0000FF]/25 font-bold uppercase px-2 py-0.5 rounded">В реальном времени</span>
            </div>

            {/* Scale/Mockup container with project detail theme */}
            <div className="rounded-3xl overflow-hidden bg-[#fafaf6] text-black border border-black/5 shadow-2xl font-['Inter',sans-serif] text-xs pb-16">

              {/* Mock Hero Section */}
              <div
                onClick={() => document.getElementById("file-input-img")?.click()}
                className="relative aspect-[1.7] w-full bg-black cursor-pointer group overflow-hidden flex flex-col justify-end p-6 md:p-8 text-white select-none"
                title="Нажмите, чтобы сменить главное превью"
              >
                <input
                  id="file-input-img"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadPhoto("img", file);
                  }}
                  className="hidden"
                  disabled={uploadingImg}
                />
                {formImg ? (
                  <img src={formImg} alt="Hero mockup" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-102 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20"><Camera className="w-8 h-8" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Camera Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-1 bg-black/60 px-3 py-2 rounded-xl border border-white/10">
                    <Camera className="w-4 h-4 text-white animate-pulse" />
                    <span className="text-[8px] font-bold uppercase text-white/80">Сменить превью</span>
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="text-[8px] opacity-60 font-semibold uppercase tracking-wider flex items-center gap-1">
                    ← Все проекты
                  </span>
                  <h1 className="text-xl md:text-3xl font-bold tracking-tighter leading-none mb-1">{formNameRu || "Название проекта"}</h1>

                  <div className="flex gap-4 text-[7px] uppercase tracking-widest opacity-80 pt-1 border-t border-white/10 mt-1 max-w-sm">
                    <div>
                      <p className="opacity-50">Клиент</p>
                      <p className="font-semibold truncate max-w-[80px]">{formClientRu || "..."}</p>
                    </div>
                    <div>
                      <p className="opacity-50">Год</p>
                      <p className="font-semibold">{formYear || "..."}</p>
                    </div>
                    <div>
                      <p className="opacity-50">Услуга</p>
                      <p className="font-semibold truncate max-w-[90px]">{formServiceRu || "..."}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Challenge Section (Splitted Editorial layout matching site) */}
              <div className="max-w-[1380px] mx-auto px-6 py-12 border-b border-black/[0.06] bg-[#fafaf6]">
                <div className="grid grid-cols-[1fr_1.8fr] gap-6 items-start">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-md font-bold tracking-tight text-black">Задача и Вызов</h2>
                    <div className="h-[1.5px] w-8 bg-[#0000FF]" />
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] font-medium leading-relaxed text-black/85">{formChallengeRu || "Описание задачи и вызова..."}</p>
                    <p className="text-[10px] text-black/60 leading-normal font-light">{formDescRu || "Краткое описание проекта..."}</p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/[0.06]">
                      <div>
                        <h4 className="text-[8px] font-semibold uppercase tracking-wider text-black/40 mb-1">01 / Scope</h4>
                        <p className="text-[9px] text-black/70">{formServiceRu || "..."}</p>
                      </div>
                      <div>
                        <h4 className="text-[8px] font-semibold uppercase tracking-wider text-black/40 mb-1">02 / Focus</h4>
                        <p className="text-[9px] text-black/70">Удовлетворение потребностей рынка и новый пользовательский опыт.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Collage Gallery Section (Vertically Stacked with layout-drag support) */}
              <div className="px-6 py-10 bg-[#fafaf6] space-y-10 select-none">
                {/* Кнопка добавления блока в начало, если блоков много */}
                {formCollageBlocks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setFormCollageBlocks(prev => [[], ...prev])}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => { e.preventDefault(); setDraggedOverZone("start"); }}
                    onDragLeave={() => setDraggedOverZone(null)}
                    onDrop={(e) => handlePhotoDropOnButton(e, "start")}
                    className={`w-full py-3 border border-dashed font-bold rounded-[1.8rem] text-[9px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider mb-2 ${draggedOverZone === "start"
                      ? "border-[#0000FF] bg-[#0000FF]/15 text-[#0000FF] scale-[1.01] shadow-lg"
                      : "bg-[#0000FF]/5 hover:bg-[#0000FF]/10 border-[#0000FF]/20 hover:border-[#0000FF]/40 text-[#0000FF]"
                      }`}
                  >
                    <Plus className="w-3.5 h-3.5" /> Добавить блок в начало
                  </button>
                )}

                {formCollageBlocks.map((block, blockIdx) => {
                  if (!block) return null;
                  
                  const isVideoBlock = block[0]?.startsWith("video:");

                  if (isVideoBlock && false) {
                    const parts = block[0].split(":");
                    const aspect = parts[parts.length - 1] || "16-9";
                    const videoUrl = parts.slice(1, parts.length - 1).join(":");

                    const updateVideoBlock = (newUrl: string, newAspect: string) => {
                      setFormCollageBlocks(prev => prev.map((b, idx) => {
                        if (idx === blockIdx) {
                          return [`video:${newUrl}:${newAspect}`];
                        }
                        return b;
                      }));
                    };

                    const embedUrl = getEmbedUrl(videoUrl);
                    const aspectClass = getAspectClass(aspect);

                    return (
                      <div key={blockIdx} className="space-y-3 bg-[#fafaf6] p-4 rounded-3xl border border-black/[0.04] w-full">
                        {/* Block Header with Controls */}
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[11px] text-black/50 font-bold uppercase select-none flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#0000FF]" />
                            Видео-блок {blockIdx + 1} (Зажмите блок ниже для сортировки ↑↓)
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Удалить этот видео-блок?")) {
                                setFormCollageBlocks(prev => prev.filter((_, idx) => idx !== blockIdx));
                              }
                            }}
                            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition duration-150 cursor-pointer text-[10px] uppercase flex items-center gap-1.5 border border-red-200/50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Удалить блок
                          </button>
                        </div>

                        {/* Draggable Block Canvas */}
                        <motion.div
                          layout
                          drag="y"
                          dragConstraints={{ top: 0, bottom: 0 }}
                          dragElastic={0.4}
                          onDragEnd={(e, info) => {
                            if (info.offset.y > 45) {
                              moveBlockDown(blockIdx);
                            } else if (info.offset.y < -45) {
                              moveBlockUp(blockIdx);
                            }
                          }}
                          whileHover={{ scale: 1.002 }}
                          whileTap={{ scale: 1.01, zIndex: 10, boxShadow: "0 15px 30px rgba(0,0,0,0.06)", cursor: "grabbing" }}
                          className="w-full p-5 border border-dashed rounded-[1.8rem] border-black/5 hover:border-[#0000FF]/15 bg-white space-y-4"
                          title="Зажмите и тащите вверх/вниз для сортировки видео-блока"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="md:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block mb-1">Ссылка на видео (YouTube / Instagram)</label>
                              <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => updateVideoBlock(e.target.value, aspect)}
                                placeholder="Например: https://www.youtube.com/watch?v=... или https://www.instagram.com/reel/..."
                                className="w-full bg-black/[0.03] border border-black/10 rounded-xl p-3 text-black focus:border-[#0000FF] outline-none text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block mb-1">Формат видео (Aspect Ratio)</label>
                              <select
                                value={aspect}
                                onChange={(e) => updateVideoBlock(videoUrl, e.target.value)}
                                className="w-full bg-black/[0.03] border border-black/10 rounded-xl p-3 text-black focus:border-[#0000FF] outline-none text-xs"
                              >
                                <option value="16-9">Горизонтальный (16:9)</option>
                                <option value="9-16">Вертикальный (9:16)</option>
                                <option value="1-1">Квадратный (1:1)</option>
                              </select>
                            </div>
                          </div>

                          {videoUrl && (
                            <div className="pt-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block mb-2">Предварительный просмотр видео:</label>
                              <div className={`${aspectClass} rounded-2xl overflow-hidden bg-black border border-black/10`}>
                                <iframe
                                  src={embedUrl}
                                  className="w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  title={`Preview Video Block ${blockIdx + 1}`}
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>

                        {formCollageBlocks.length > 1 && blockIdx < formCollageBlocks.length - 1 && (
                          <button
                            type="button"
                            onClick={() => setFormCollageBlocks(prev => {
                              const next = [...prev];
                              next.splice(blockIdx + 1, 0, []);
                              return next;
                            })}
                            className="w-full py-3 border border-dashed font-bold rounded-[1.8rem] text-[9px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider my-2 bg-[#0000FF]/5 hover:bg-[#0000FF]/10 border-[#0000FF]/20 hover:border-[#0000FF]/40 text-[#0000FF]"
                          >
                            <Plus className="w-3.5 h-3.5" /> Вставить блок сюда
                          </button>
                        )}
                      </div>
                    );
                  }

                  const validElements = block.filter(Boolean);
                  const hasAddSlot = validElements.length < 5;
                  const totalGridElements = validElements.length + (hasAddSlot ? 2 : 0);
                  if (totalGridElements === 0) return null;

                  const getGridColsClass = (c: number) => {
                    if (c <= 1) return "grid-cols-1";
                    if (c === 2) return "grid-cols-2";
                    if (c === 3) return "grid-cols-3";
                    if (c === 4) return "grid-cols-2 lg:grid-cols-4";
                    return "grid-cols-2 lg:grid-cols-5";
                  };

                  const getImageAspectClass = (c: number) => {
                    if (c <= 1) return "aspect-[1.5] sm:aspect-[1.7]";
                    if (c === 2) return "aspect-[1.4] sm:aspect-[1.5]";
                    if (c === 3) return "aspect-[1.2] sm:aspect-[1.3]";
                    return "aspect-square";
                  };

                  return (
                    <div key={blockIdx} className="space-y-3 bg-[#fafaf6] p-4 rounded-3xl border border-black/[0.04] w-full">
                      {/* Block Header with Controls */}
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] text-black/50 font-bold uppercase select-none flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#0000FF]" />
                          Блок {blockIdx + 1} (Зажмите блок ниже для сортировки ↑↓)
                        </span>
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Удалить этот блок коллажа?")) {
                              setFormCollageBlocks(prev => prev.filter((_, idx) => idx !== blockIdx));
                            }
                          }}
                          className="relative z-30 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition duration-150 cursor-pointer text-[10px] uppercase flex items-center gap-1.5 border border-red-200/50"
                          title="Удалить блок"
                        >
                          <Trash2 className="w-3 h-3" />
                          Удалить блок
                        </button>
                      </div>

                      {/* Draggable Block Canvas */}
                      <motion.div
                        layout
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.4}
                        onDragEnd={(e, info) => {
                          if (info.offset.y > 45) {
                            moveBlockDown(blockIdx);
                          } else if (info.offset.y < -45) {
                            moveBlockUp(blockIdx);
                          }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => { e.preventDefault(); if (draggedPhoto && draggedPhoto.blockIdx !== blockIdx) setDraggedOverZone(`block-${blockIdx}`); }}
                        onDragLeave={() => setDraggedOverZone(null)}
                        onDrop={(e) => handlePhotoDropOnBlock(e, blockIdx)}
                        whileHover={{ scale: 1.002 }}
                        whileTap={{ scale: 1.01, zIndex: 10, boxShadow: "0 15px 30px rgba(0,0,0,0.06)", cursor: "grabbing" }}
                        className={`w-full p-2.5 border border-dashed rounded-[1.8rem] transition-all duration-200 cursor-grab relative group/block ${draggedOverZone === `block-${blockIdx}`
                          ? "border-[#0000FF] bg-[#0000FF]/5 scale-[1.01]"
                          : "border-black/5 hover:border-[#0000FF]/15"
                          }`}
                        title="Зажмите и тащите вверх/вниз для сортировки блоков • Сюда можно перетащить фото"
                      >
                        <div className={`grid gap-3 ${getGridColsClass(totalGridElements)}`}>
                          {block.map((imgUrl, imgIdx) => {
                            const isVideo = imgUrl?.startsWith("video:");
                            const videoUrl = isVideo ? imgUrl.slice(6) : "";

                            if (isVideo) {
                              return (
                                <motion.div
                                  key={`video-${blockIdx}-${imgIdx}`}
                                  layout
                                  draggable={!isReadOnly}
                                  onDragStart={(e) => handlePhotoDragStart(e, blockIdx, imgIdx)}
                                  onDragEnd={handlePhotoDragEnd}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDragEnter={(e) => { e.preventDefault(); setDraggedOverZone(`photo-${blockIdx}-${imgIdx}`); }}
                                  onDragLeave={() => setDraggedOverZone(null)}
                                  onDrop={(e) => handlePhotoDropOnPhoto(e, blockIdx, imgIdx)}
                                  onClick={() => {
                                    if (!isReadOnly) document.getElementById(`replace-video-input-${blockIdx}-${imgIdx}`)?.click();
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  className={`relative rounded-[1.2rem] overflow-hidden bg-black cursor-pointer border transition-all duration-200 shadow-[0_5px_15px_rgba(0,0,0,0.02)] group/photo select-none ${draggedOverZone === `photo-${blockIdx}-${imgIdx}`
                                    ? "border-[#0000FF] scale-105 shadow-[0_8px_25px_rgba(0,0,255,0.25)] opacity-85"
                                    : "border-black/5"
                                    } ${getImageAspectClass(totalGridElements)} flex flex-col items-center justify-center`}
                                  title="Кликните для выбора/замены видеофайла • Зажмите для переноса"
                                >
                                  <input
                                    id={`replace-video-input-${blockIdx}-${imgIdx}`}
                                    type="file"
                                    accept="video/mp4,video/quicktime,video/webm"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const key = `${blockIdx}-${imgIdx}`;
                                      try {
                                        setUploadingBlocks(prev => ({ ...prev, [key]: true }));
                                        setIsConverting(true);
                                        setConversionProgress(0);

                                        const convertedFile = await convertToWebM(file, (progress) => {
                                          setConversionProgress(progress);
                                        });

                                        setIsConverting(false);
                                        setConversionProgress(null);

                                        const path = `projects/project-block-video-${blockIdx}-${imgIdx}-${Date.now()}.webm`;
                                        const publicUrl = await supabaseClient.uploadFile("assets", path, convertedFile);

                                        setFormCollageBlocks(prev => prev.map((b, bIdx) => {
                                          if (bIdx === blockIdx) {
                                            return b.map((item, iIdx) => iIdx === imgIdx ? `video:${publicUrl}` : item);
                                          }
                                          return b;
                                        }));
                                      } catch (err: any) {
                                        alert("Ошибка при замене видео: " + err.message);
                                      } finally {
                                        setIsConverting(false);
                                        setConversionProgress(null);
                                        setUploadingBlocks(prev => ({ ...prev, [key]: false }));
                                      }
                                    }}
                                  />
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 text-white p-2 text-center">
                                    {uploadingBlocks[`${blockIdx}-${imgIdx}`] ? (
                                      <Loader2 className="w-5 h-5 text-white animate-spin mb-1" />
                                    ) : (
                                      <span className="text-[14px] mb-1">🎬</span>
                                    )}
                                    <span className="text-[8px] font-bold uppercase text-white/50 tracking-wider">Видеофайл</span>
                                    <span className="text-[6px] opacity-75 truncate max-w-full mt-1 px-1.5">{videoUrl.split("/").pop()}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormCollageBlocks(prev => {
                                        return prev.map((b, bIdx) => {
                                          if (bIdx === blockIdx) {
                                            return b.filter((_, idx) => idx !== imgIdx);
                                          }
                                          return b;
                                        });
                                      });
                                    }}
                                    className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md z-20 cursor-pointer"
                                    title="Удалить видео"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </motion.div>
                              );
                            }

                            return (
                              <motion.div
                                key={imgUrl || `empty-${blockIdx}-${imgIdx}`}
                                layout
                                draggable={!isReadOnly}
                                onDragStart={(e) => handlePhotoDragStart(e, blockIdx, imgIdx)}
                                onDragEnd={handlePhotoDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => { e.preventDefault(); setDraggedOverZone(`photo-${blockIdx}-${imgIdx}`); }}
                                onDragLeave={() => setDraggedOverZone(null)}
                                onDrop={(e) => handlePhotoDropOnPhoto(e, blockIdx, imgIdx)}
                                onClick={() => {
                                  document.getElementById(`file-input-${blockIdx}-${imgIdx}`)?.click();
                                }}
                                whileHover={{ scale: 1.02 }}
                                className={`relative rounded-[1.2rem] overflow-hidden bg-black/10 cursor-grab border transition-all duration-200 shadow-[0_5px_15px_rgba(0,0,0,0.02)] group/photo select-none ${draggedOverZone === `photo-${blockIdx}-${imgIdx}`
                                  ? "border-[#0000FF] scale-105 shadow-[0_8px_25px_rgba(0,0,255,0.25)] opacity-85"
                                  : "border-black/5"
                                  }`}
                                title="Зажмите для переноса в другой блок / на кнопки • Кликните для выбора файла"
                              >
                              <div className={`w-full ${getImageAspectClass(totalGridElements)}`}>
                                {imgUrl ? (
                                  <img src={imgUrl} alt="Mockup Process" className="w-full h-full object-cover pointer-events-none" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-black/30 bg-black/5">
                                    <Camera className="w-3.5 h-3.5" />
                                    <span className="text-[5px] uppercase font-bold">Выбрать фото</span>
                                  </div>
                                )}
                              </div>

                              {/* Photo controls overlay */}
                              {imgUrl && (
                                <>
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="flex items-center gap-1 bg-black/60 px-1.5 py-1 rounded border border-white/10">
                                      <Camera className="w-2.5 h-2.5 text-white" />
                                      <span className="text-[5px] font-bold uppercase text-white/80">Клик для замены</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormCollageBlocks(prev => {
                                        return prev.map((b, bIdx) => {
                                          if (bIdx === blockIdx) {
                                            return b.filter((_, idx) => idx !== imgIdx);
                                          }
                                          return b;
                                        });
                                      });
                                    }}
                                    className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover/photo:opacity-100 transition-opacity z-20 cursor-pointer"
                                    title="Удалить фото"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </>
                              )}

                              <input
                                id={`file-input-${blockIdx}-${imgIdx}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUploadPhoto({ blockIdx, imgIdx }, file);
                                  }
                                }}
                              />
                            </motion.div>
                          );
                          })}

                          {/* Add Photo slot directly inside the block grid */}
                          {hasAddSlot && (
                            <div
                              onClick={() => {
                                document.getElementById(`add-photo-input-${blockIdx}`)?.click();
                              }}
                              className={`rounded-[1.2rem] border border-dashed border-black/15 hover:border-[#0000FF]/50 hover:bg-[#0000FF]/5 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${getImageAspectClass(totalGridElements)}`}
                              title="Добавить фото в этот block"
                            >
                              <input
                                id={`add-photo-input-${blockIdx}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const key = `${blockIdx}-add`;
                                  try {
                                    setUploadingBlocks(prev => ({ ...prev, [key]: true }));
                                    const fileExt = file.name.split('.').pop();
                                    const nextIdx = block.length;
                                    const path = `projects/project-block-${blockIdx}-${nextIdx}-${Date.now()}.${fileExt}`;
                                    const publicUrl = await supabaseClient.uploadFile("assets", path, file);

                                    setFormCollageBlocks(prev => {
                                      return prev.map((b, bIdx) => {
                                        if (bIdx === blockIdx) return [...b, publicUrl];
                                        return b;
                                      });
                                    });
                                  } catch (err: any) {
                                    alert("Ошибка при загрузке: " + err.message);
                                  } finally {
                                    setUploadingBlocks(prev => ({ ...prev, [key]: false }));
                                  }
                                }}
                              />
                              {uploadingBlocks[`${blockIdx}-add`] ? (
                                <Loader2 className="w-3.5 h-3.5 text-[#0000FF] animate-spin" />
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5 text-[#0000FF]" />
                                  <span className="text-[6px] uppercase font-bold text-[#0000FF]/80">Добавить фото</span>
                                </>
                              )}
                            </div>
                          )}

                           {/* Add Video slot directly inside the block grid */}
                           {hasAddSlot && (
                             <div
                               onClick={() => {
                                 if (!isReadOnly) document.getElementById(`add-video-input-${blockIdx}`)?.click();
                               }}
                               className={`rounded-[1.2rem] border border-dashed border-[#0000FF]/30 hover:border-[#0000FF]/60 hover:bg-[#0000FF]/5 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${getImageAspectClass(totalGridElements)}`}
                               title="Загрузить видеофайл (MP4/MOV/WebM) в этот блок"
                             >
                               <input
                                 id={`add-video-input-${blockIdx}`}
                                 type="file"
                                 accept="video/mp4,video/quicktime,video/webm"
                                 className="hidden"
                                 onChange={async (e) => {
                                   const file = e.target.files?.[0];
                                   if (!file) return;
                                   const key = `${blockIdx}-add-video`;
                                   try {
                                     setUploadingBlocks(prev => ({ ...prev, [key]: true }));
                                     const fileExt = file.name.split('.').pop();
                                     const nextIdx = block.length;
                                     const path = `projects/project-block-video-${blockIdx}-${nextIdx}-${Date.now()}.${fileExt}`;
                                     setIsConverting(true);
                                     setConversionProgress(0);
                                     const convertedFile = await convertToWebM(file, (p) => setConversionProgress(p));
                                     setIsConverting(false);
                                     setConversionProgress(null);
                                     const publicUrl = await supabaseClient.uploadFile("assets", path.replace("." + fileExt, ".webm"), convertedFile);

                                     setFormCollageBlocks(prev => {
                                       return prev.map((b, bIdx) => {
                                         if (bIdx === blockIdx) return [...b, `video:${publicUrl}`];
                                         return b;
                                       });
                                     });
                                   } catch (err: any) {
                                     alert("Ошибка при загрузке: " + err.message);
                                   } finally {
                                     setUploadingBlocks(prev => ({ ...prev, [key]: false }));
                                   }
                                 }}
                               />
                               {uploadingBlocks[`${blockIdx}-add-video`] ? (
                                 <Loader2 className="w-3.5 h-3.5 text-[#0000FF] animate-spin" />
                               ) : (
                                 <>
                                   <Plus className="w-3.5 h-3.5 text-[#0000FF]" />
                                   <span className="text-[6px] uppercase font-bold text-[#0000FF]/85">Добавить видео</span>
                                 </>
                               )}
                             </div>
                           )}
                        </div>
                      </motion.div>

                      {formCollageBlocks.length > 1 && blockIdx < formCollageBlocks.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setFormCollageBlocks(prev => {
                            const next = [...prev];
                            next.splice(blockIdx + 1, 0, []);
                            return next;
                          })}
                          onDragOver={(e) => e.preventDefault()}
                          onDragEnter={(e) => { e.preventDefault(); setDraggedOverZone(`insert-${blockIdx}`); }}
                          onDragLeave={() => setDraggedOverZone(null)}
                          onDrop={(e) => handlePhotoDropOnButton(e, { insertAfter: blockIdx })}
                          className={`w-full py-3 border border-dashed font-bold rounded-[1.8rem] text-[9px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider my-2 ${draggedOverZone === `insert-${blockIdx}`
                            ? "border-[#0000FF] bg-[#0000FF]/15 text-[#0000FF] scale-[1.01] shadow-lg"
                            : "bg-[#0000FF]/5 hover:bg-[#0000FF]/10 border-[#0000FF]/20 hover:border-[#0000FF]/40 text-[#0000FF]"
                            }`}
                          title="Вставить блок между этими блоками • Сюда можно перетащить фото"
                        >
                          <Plus className="w-3.5 h-3.5" /> Вставить блок сюда
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Add Block Slot inside Mockup */}
                <button
                  type="button"
                  onClick={() => setFormCollageBlocks(prev => [...prev, []])}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => { e.preventDefault(); setDraggedOverZone("end"); }}
                  onDragLeave={() => setDraggedOverZone(null)}
                  onDrop={(e) => handlePhotoDropOnButton(e, "end")}
                  className={`w-full py-3.5 border border-dashed font-bold rounded-[1.8rem] text-[9px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider ${draggedOverZone === "end"
                    ? "border-[#0000FF] bg-[#0000FF]/15 text-[#0000FF] scale-[1.01] shadow-lg"
                    : "bg-[#0000FF]/5 hover:bg-[#0000FF]/10 border-[#0000FF]/20 hover:border-[#0000FF]/40 text-[#0000FF]"
                    }`}
                  title="Добавить блок коллажа • Сюда можно перетащить фото"
                >
                  <Plus className="w-3.5 h-3.5" /> Добавить блок коллажа
                </button>
              </div>

              {/* Mock Results Showcase */}
              <div className="px-6 py-12 bg-[#fafaf6]">
                <div className="w-full">

                  {/* Results Panel */}
                  <div className="bg-white border border-black/[0.04] rounded-[1.8rem] p-6 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.01)] w-full">
                    <div>
                      <h2 className="text-sm font-bold tracking-tight mb-6">Результаты</h2>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="border-t border-black/[0.06] pt-3">
                          <span className="text-2xl font-bold text-[#0000FF] block tracking-tight">
                            {formResult1Ru ? formResult1Ru.match(/(\d+%\s*(?:увеличение|снижение)?|\d+\s*х|\d+\s*\+|\b\d+\b)/i)?.[0] || "✓" : "✓"}
                          </span>
                          <span className="text-[9px] text-black/55 block leading-tight mt-1 truncate">{formResult1Ru || "Показатель 1"}</span>
                        </div>
                        <div className="border-t border-black/[0.06] pt-3">
                          <span className="text-2xl font-bold text-[#0000FF] block tracking-tight">
                            {formResult2Ru ? formResult2Ru.match(/(\d+%\s*(?:увеличение|снижение)?|\d+\s*х|\d+\s*\+|\b\d+\b)/i)?.[0] || "✓" : "✓"}
                          </span>
                          <span className="text-[9px] text-black/55 block leading-tight mt-1 truncate">{formResult2Ru || "Показатель 2"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-black/[0.06] flex items-center gap-2 text-black/70">
                      <div className="w-5 h-5 rounded-full bg-[#0000FF]/10 flex items-center justify-center text-[#0000FF]">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] font-medium tracking-tight">
                        Проект полностью завершен и передан клиенту
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Success banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-emerald-500 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-emerald-400"
          >
            <Check className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video conversion progress overlay */}
      <AnimatePresence>
        {isConverting && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="bg-[#161622] border border-white/[0.08] rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-[#0000FF] border-t-transparent animate-spin" 
                  style={{ animationDuration: "1.5s" }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                  {conversionProgress ?? 0}%
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white font-semibold">Конвертация видео...</h4>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Оптимизируем видеофайл в формат WebM для быстрой и плавной загрузки на сайте. Не закрывайте вкладку.
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
