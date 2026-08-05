import { useState, useEffect } from "react";
import { cmsService } from "../cmsService";
import { Plus, Trash2, Edit2, Check, Save, X, Image, Loader2, Camera, ChevronUp, ChevronDown, ArrowLeftRight } from "lucide-react";
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

interface CatalogConfig {
  type: "products" | "concepts" | "architects" | "gamedev";
  titleRu: string;
  titleEn: string;
  titleKg: string;
  logSection: string;
  itemTypeLabelRu: string; 
  itemTypeLabelRuGenitive: string; 
  defaultTitleRu: string;
  defaultTitleEn: string;
  defaultTitleKg: string;
}

const CONFIGS: Record<string, CatalogConfig> = {
  products: {
    type: "products",
    titleRu: "Продукты",
    titleEn: "Products",
    titleKg: "Продукциялар",
    logSection: "Управление продуктами",
    itemTypeLabelRu: "продукт",
    itemTypeLabelRuGenitive: "продукта",
    defaultTitleRu: "Продукты студии",
    defaultTitleEn: "Studio Products",
    defaultTitleKg: "Студиянын продукциялары",
  },
  concepts: {
    type: "concepts",
    titleRu: "Concepts & Vision",
    titleEn: "Concepts & Vision",
    titleKg: "Концепциялар жана көрүнүш",
    logSection: "Управление концептами",
    itemTypeLabelRu: "концепт",
    itemTypeLabelRuGenitive: "концепта",
    defaultTitleRu: "Концепты и видение",
    defaultTitleEn: "Concepts & Vision",
    defaultTitleKg: "Концепциялар жана көрүнүш",
  },
  architects: {
    type: "architects",
    titleRu: "Архитектурные проекты",
    titleEn: "Architect Projects",
    titleKg: "Архитектуралык долбоорлор",
    logSection: "Управление архитектурными проектами",
    itemTypeLabelRu: "проект",
    itemTypeLabelRuGenitive: "проекта",
    defaultTitleRu: "Архитектурные проекты",
    defaultTitleEn: "Architect Projects",
    defaultTitleKg: "Архитектуралык долбоорлор",
  },
  gamedev: {
    type: "gamedev",
    titleRu: "GameDev",
    titleEn: "GameDev",
    titleKg: "GameDev",
    logSection: "Управление GameDev проектами",
    itemTypeLabelRu: "GameDev проект",
    itemTypeLabelRuGenitive: "GameDev проекта",
    defaultTitleRu: "GameDev",
    defaultTitleEn: "GameDev",
    defaultTitleKg: "GameDev",
  },
};

export function AdminCatalogEditor({ type }: { type: "products" | "concepts" | "architects" | "gamedev" }) {
  const cfg = CONFIGS[type];
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingBlocks, setUploadingBlocks] = useState<Record<string, boolean>>({});
  const [previewActiveTab, setPreviewActiveTab] = useState<"gallery" | "video">("gallery");

  const [draggedPhoto, setDraggedPhoto] = useState<{ blockIdx: number; imgIdx: number } | null>(null);
  const [draggedOverZone, setDraggedOverZone] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const [draggedProductIndex, setDraggedProductIndex] = useState<number | null>(null);
  const [draggedOverTargetCategory, setDraggedOverTargetCategory] = useState<string | null>(null);

  const handleProductDragStart = (e: React.DragEvent, index: number, item: any) => {
    if (isReadOnly) return;
    setDraggedProductIndex(index);
    const dragPayload = JSON.stringify({ itemId: item.id, sourceType: type, itemName: item.name });
    e.dataTransfer.setData("application/json", dragPayload);
    e.dataTransfer.setData("text/plain", dragPayload);
    (window as any).__draggedAdminCatalogItem = { itemId: item.id, sourceType: type, itemName: item.name };
  };

  const handleProductDragEnd = () => {
    setDraggedProductIndex(null);
    setDraggedOverTargetCategory(null);
    delete (window as any).__draggedAdminCatalogItem;
  };

  const handleMoveToCategory = async (itemId: string, sourceType: string, targetType: string) => {
    if (isReadOnly || sourceType === targetType) return;
    try {
      const res = await cmsService.moveCatalogItem(itemId, sourceType, targetType);
      if (res.success) {
        const sourceTitle = CONFIGS[sourceType]?.titleRu || sourceType;
        const targetTitle = CONFIGS[targetType]?.titleRu || targetType;
        await logAdminAction(
          "Управление каталогом",
          "Перемещение",
          `Проект "${res.itemName}" (${itemId}) перемещен из "${sourceTitle}" в "${targetTitle}"`
        );
        setSuccessMessage(`Проект "${res.itemName}" успешно перемещен из раздела "${sourceTitle}" в "${targetTitle}"!`);
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      alert("Ошибка при перемещении элемента: " + (err.message || err));
    } finally {
      setDraggedProductIndex(null);
      setDraggedOverTargetCategory(null);
      delete (window as any).__draggedAdminCatalogItem;
    }
  };

  const handleProductDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedProductIndex === null || draggedProductIndex === targetIndex) return;

    try {
      const newTranslations = JSON.parse(JSON.stringify(translations));
      const langs = ["ru", "en", "kg", "zh", "ar", "de"] as const;
      langs.forEach(lang => {
        if (!newTranslations[lang] || !newTranslations[lang][type]) return;
        const items = newTranslations[lang][type].items;
        if (items && items[draggedProductIndex]) {
          const [movedItem] = items.splice(draggedProductIndex, 1);
          items.splice(targetIndex, 0, movedItem);
        }
      });

      await cmsService.updateTranslations(newTranslations);
      setTranslations(newTranslations);

      await logAdminAction(
        cfg.logSection,
        "Сортировка",
        `Изменен порядок элементов`
      );
    } catch (err: any) {
      alert("Ошибка при сохранении порядка: " + err.message);
    } finally {
      setDraggedProductIndex(null);
      setDraggedOverTargetCategory(null);
      delete (window as any).__draggedAdminCatalogItem;
    }
  };

  useEffect(() => {
    cmsService.initSupabaseSync();
    return cmsService.subscribe(() => {
      setTranslations(cmsService.getTranslations());
      setProductDetails(cmsService.getProductDetails());
    });
  }, [type]);

  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isReadOnly = currentAdmin.permissions?.projects === false; 

  const generateSlugFromName = () => {
    if (formNameRu) {
      setFormId(slugify(formNameRu));
    }
  };

  const handleNameRuChange = (val: string) => {
    setFormNameRu(val);
    if (isAdding && (!formId || formId === slugify(formNameRu))) {
      setFormId(slugify(val));
    }
  };

  const handleUploadPhoto = async (target: "img" | { blockIdx: number; imgIdx: number }, file: File) => {
    if (isReadOnly) return;
    if (!formId) {
      alert("Пожалуйста, сначала укажите ID или название элемента, чтобы файлы загружались в правильную папку.");
      return;
    }
    const isHero = target === "img";
    const key = isHero ? "img" : `${target.blockIdx}-${target.imgIdx}`;
    try {
      if (isHero) setUploadingImg(true);
      else setUploadingBlocks(prev => ({ ...prev, [key]: true }));

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${isHero ? "hero" : `block-${target.blockIdx}-${target.imgIdx}`}-${Date.now()}.${fileExt}`;
      const path = `${type}/${formId}/${fileName}`;

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

  // Collage Drag and Drop Handlers
  const handlePhotoDragStart = (e: React.DragEvent, blockIdx: number, imgIdx: number) => {
    if (isReadOnly) return;
    setDraggedPhoto({ blockIdx, imgIdx });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${blockIdx},${imgIdx}`);
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

  const [formId, setFormId] = useState("");
  const [formCategoryKey, setFormCategoryKey] = useState("industrial");
  const [formImg, setFormImg] = useState("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600");

  const [formNameRu, setFormNameRu] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formNameKg, setFormNameKg] = useState("");
  const [formCategoryRu, setFormCategoryRu] = useState("");
  const [formCategoryEn, setFormCategoryEn] = useState("");
  const [formCategoryKg, setFormCategoryKg] = useState("");

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
  const [formStudioRu, setFormStudioRu] = useState("");
  const [formDesignerRu, setFormDesignerRu] = useState("");
  const [formLocationRu, setFormLocationRu] = useState("");
  const [formProjectTypeRu, setFormProjectTypeRu] = useState("");
  const [formProductClass, setFormProductClass] = useState("-");
  const [formChallengeRu, setFormChallengeRu] = useState("");
  const [formChallengeEn, setFormChallengeEn] = useState("");
  const [formChallengeKg, setFormChallengeKg] = useState("");

  const [formCollageBlocks, setFormCollageBlocks] = useState<string[][]>([]);
  const [formCollageTheme, setFormCollageTheme] = useState("light");

  const [formResult1Ru, setFormResult1Ru] = useState("");
  const [formResult1En, setFormResult1En] = useState("");
  const [formResult1Kg, setFormResult1Kg] = useState("");
  const [formResult2Ru, setFormResult2Ru] = useState("");
  const [formResult2En, setFormResult2En] = useState("");
  const [formResult2Kg, setFormResult2Kg] = useState("");

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

  const resetForm = () => {
    setFormId("");
    setFormCategoryKey("industrial");
    setFormImg("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600");
    setFormNameRu("");
    setFormNameEn("");
    setFormNameKg("");
    setFormCategoryRu("Индустриальный дизайн");
    setFormCategoryEn("Industrial Design");
    setFormCategoryKg("Өнөр жай дизайны");
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
    setFormStudioRu("");
    setFormDesignerRu("");
    setFormLocationRu("");
    setFormProjectTypeRu("");
    setFormProductClass("-");
    setFormChallengeRu("");
    setFormChallengeEn("");
    setFormChallengeKg("");
    setFormCollageBlocks([
      [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600"
      ]
    ]);
    setFormResult1Ru("");
    setFormResult1En("");
    setFormResult1Kg("");
    setFormResult2Ru("");
    setFormResult2En("");
    setFormResult2Kg("");
    setFormCollageTheme("light");
  };

  const startAdding = () => {
    if (isReadOnly) return;
    resetForm();
    setIsAdding(true);
    setEditingId(null);
  };

  const startEditing = (id: string) => {
    if (isReadOnly) return;
    setEditingId(id);
    setIsAdding(false);

    const itemsRu = translations.ru[type]?.items || [];
    const itemsEn = translations.en[type]?.items || [];
    const itemsKg = translations.kg[type]?.items || [];

    const projRu = itemsRu.find((p: any) => p.id === id) || {};
    const projEn = itemsEn.find((p: any) => p.id === id) || {};
    const projKg = itemsKg.find((p: any) => p.id === id) || {};

    const detailRu = productDetails.ru[id] || {};
    const detailEn = productDetails.en[id] || {};
    const detailKg = productDetails.kg[id] || {};

    setFormId(id);
    setFormCategoryKey(projRu.categoryKey || "industrial");
    setFormImg(projRu.img || "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600");

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

    setFormStudioRu(detailRu.studio || "");
    setFormDesignerRu(detailRu.designer || "");
    setFormLocationRu(detailRu.location || "");
    setFormProjectTypeRu(detailRu.projectType || "");
    setFormProductClass(detailRu.class || "-");

    setFormChallengeRu(detailRu.challenge || "");
    setFormChallengeEn(detailEn.challenge || "");
    setFormChallengeKg(detailKg.challenge || "");

    const initialBlocks = detailRu.collageBlocks && detailRu.collageBlocks.length > 0
      ? JSON.parse(JSON.stringify(detailRu.collageBlocks))
      : (detailRu.processImages && detailRu.processImages.length > 0 ? [JSON.parse(JSON.stringify(detailRu.processImages))] : [[]]);
    setFormCollageBlocks(initialBlocks);
    setFormCollageTheme(detailRu.collageTheme || "light");

    setFormResult1Ru(detailRu.results?.[0] || "");
    setFormResult1En(detailEn.results?.[0] || "");
    setFormResult1Kg(detailKg.results?.[0] || "");

    setFormResult2Ru(detailRu.results?.[1] || "");
    setFormResult2En(detailEn.results?.[1] || "");
    setFormResult2Kg(detailKg.results?.[1] || "");
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      setTranslating(true);

      // Auto translate RU fields to ALL 6 languages (en, kg, zh, ar, de)
      const targetLangs = ["ru", "en", "kg", "zh", "ar", "de"] as const;
      const names: Record<string, string> = {};
      const catNames: Record<string, string> = {};
      const descs: Record<string, string> = {};
      const clients: Record<string, string> = {};
      const services: Record<string, string> = {};
      const studios: Record<string, string> = {};
      const designers: Record<string, string> = {};
      const locations: Record<string, string> = {};
      const projectTypes: Record<string, string> = {};
      const challenges: Record<string, string> = {};
      const results1: Record<string, string> = {};
      const results2: Record<string, string> = {};

      for (const lang of targetLangs) {
        names[lang] = lang === "ru" ? formNameRu : (await translateText(formNameRu, lang, "ru"));
        catNames[lang] = lang === "ru" ? formCategoryRu : (await translateText(formCategoryRu, lang, "ru"));
        descs[lang] = lang === "ru" ? formDescRu : (await translateText(formDescRu, lang, "ru"));
        clients[lang] = lang === "ru" ? formClientRu : (await translateText(formClientRu, lang, "ru"));
        services[lang] = lang === "ru" ? formServiceRu : (await translateText(formServiceRu, lang, "ru"));
        studios[lang] = lang === "ru" ? formStudioRu : (await translateText(formStudioRu, lang, "ru"));
        designers[lang] = lang === "ru" ? formDesignerRu : (await translateText(formDesignerRu, lang, "ru"));
        locations[lang] = lang === "ru" ? formLocationRu : (await translateText(formLocationRu, lang, "ru"));
        projectTypes[lang] = lang === "ru" ? formProjectTypeRu : (await translateText(formProjectTypeRu, lang, "ru"));
        challenges[lang] = lang === "ru" ? formChallengeRu : (await translateText(formChallengeRu, lang, "ru"));
        results1[lang] = lang === "ru" ? formResult1Ru : (await translateText(formResult1Ru, lang, "ru"));
        results2[lang] = lang === "ru" ? formResult2Ru : (await translateText(formResult2Ru, lang, "ru"));
      }

      const newTranslations = JSON.parse(JSON.stringify(translations));
      const newDetails = JSON.parse(JSON.stringify(productDetails));

      const cleanBlocks = formCollageBlocks.map(block => block.filter(Boolean)).filter(block => block.length > 0);
      const flattenedImages = cleanBlocks.flat();

      const isIdTaken = (translations.ru[type]?.items || []).some((p: any) => p.id === formId && p.id !== editingId);
      if (isIdTaken) {
        alert(`Элемент с ID "${formId}" уже существует. Пожалуйста, выберите другой ID.`);
        return;
      }

      targetLangs.forEach(lang => {
        if (!newTranslations[lang]) newTranslations[lang] = {};
        if (!newTranslations[lang][type]) {
          newTranslations[lang][type] = { title: lang === "ru" ? cfg.defaultTitleRu : lang === "en" ? cfg.defaultTitleEn : cfg.defaultTitleKg, items: [] };
        }

        const listEntry = { id: formId, name: names[lang], category: catNames[lang], categoryKey: formCategoryKey, img: formImg };
        const detailEntry = {
          name: names[lang],
          desc: descs[lang],
          client: clients[lang],
          year: formYear,
          service: services[lang],
          studio: studios[lang],
          designer: designers[lang],
          location: locations[lang],
          projectType: projectTypes[lang],
          class: formProductClass,
          challenge: challenges[lang],
          processImages: flattenedImages,
          collageBlocks: cleanBlocks,
          collageTheme: formCollageTheme,
          results: [results1[lang], results2[lang]].filter(Boolean)
        };

        const items = newTranslations[lang][type].items;
        const index = items.findIndex((p: any) => p.id === (editingId || formId));
        if (index !== -1) {
          items[index] = listEntry;
        } else {
          items.push(listEntry);
        }

        if (!newDetails[lang]) newDetails[lang] = {};
        if (editingId && editingId !== formId) {
          delete newDetails[lang][editingId];
        }
        newDetails[lang][formId] = detailEntry;
      });

      targetLangs.forEach((lang) => {
        if (!newTranslations[lang].productDetail) {
          newTranslations[lang].productDetail = {};
        }
        newTranslations[lang].productDetail.products = newDetails[lang] || {};
      });

      await cmsService.updateTranslations(newTranslations);

      await logAdminAction(
        cfg.logSection,
        editingId ? "Редактирование" : "Создание",
        editingId ? `Изменен: ${formId} (${formNameRu})` : `Создан: ${formId} (${formNameRu})`
      );

      setTranslations(newTranslations);
      setProductDetails(newDetails);

      setSuccessMessage(editingId ? "Успешно обновлено!" : "Успешно создано!");
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
    if (confirm("Вы действительно хотите удалить элемент?")) {
      try {
        const newTranslations = JSON.parse(JSON.stringify(translations));
        const newDetails = JSON.parse(JSON.stringify(productDetails));

        targetLangs.forEach((lang) => {
          if (newTranslations[lang]?.[type]?.items) {
            newTranslations[lang][type].items = newTranslations[lang][type].items.filter((p: any) => p.id !== id);
          }
          if (newDetails[lang]) {
            delete newDetails[lang][id];
          }
          if (!newTranslations[lang].productDetail) {
            newTranslations[lang].productDetail = {};
          }
          newTranslations[lang].productDetail.products = newDetails[lang] || {};
        });

        await cmsService.updateTranslations(newTranslations);

        await logAdminAction(
          cfg.logSection,
          "Удаление",
          `Удален ID: ${id}`
        );

        setTranslations(newTranslations);
        setProductDetails(newDetails);

        setSuccessMessage("Элемент успешно удален!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        alert("Ошибка при удалении: " + (err.message || err));
      }
    }
  };

  const rawItems = translations.ru[type]?.items || [];
  const itemsList = rawItems.map((item: any) => {
    const detail = productDetails.ru[item.id] || {};
    return {
      ...item,
      desc: detail.desc || "",
      year: detail.year || "2026",
    };
  });

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {isReadOnly && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-xl">
          Доступ ограничен. У вас нет прав на редактирование.
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl">
          {successMessage}
        </div>
      )}

      {!editingId && !isAdding && (
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">{cfg.titleRu}</h2>
              <p className="text-xs text-white/50 mt-1">
                Зажмите карточку для изменения порядка или перетащите её на один из разделов ниже / в меню слева.
              </p>
            </div>
            {!isReadOnly && (
              <button
                onClick={startAdding}
                className="px-4 py-2.5 bg-[#0000FF] hover:bg-[#0000FF]/80 text-white font-bold rounded-xl text-xs transition duration-200 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Добавить {cfg.itemTypeLabelRu}
              </button>
            )}
          </div>

          {/* Target Drop Zone Bar for Cross-Category Drag & Drop */}
          {!isReadOnly && (
            <div className="p-4 rounded-2xl bg-[#0D0E13] border border-[#222430] flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-white/70 flex items-center gap-1.5 mr-1">
                <ArrowLeftRight className="w-4 h-4 text-[#0000FF]" />
                Перемещение между разделами:
              </span>
              
              {[
                { typeKey: "products", label: "Продукты" },
                { typeKey: "concepts", label: "Концепты (Concepts & Vision)" },
                { typeKey: "architects", label: "Архитектура" },
                { typeKey: "gamedev", label: "GameDev" },
              ]
                .filter(target => target.typeKey !== type)
                .map(target => {
                  const isHovered = draggedOverTargetCategory === target.typeKey;
                  return (
                    <div
                      key={target.typeKey}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        setDraggedOverTargetCategory(target.typeKey);
                      }}
                      onDragLeave={() => setDraggedOverTargetCategory(null)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setDraggedOverTargetCategory(null);
                        const globalItem = (window as any).__draggedAdminCatalogItem;
                        let parsed = globalItem;
                        if (!parsed) {
                          try {
                            const raw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
                            if (raw) parsed = JSON.parse(raw);
                          } catch {}
                        }
                        if (parsed && parsed.itemId) {
                          await handleMoveToCategory(parsed.itemId, parsed.sourceType || type, target.typeKey);
                        }
                      }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border border-dashed flex items-center gap-2 cursor-pointer ${
                        isHovered
                          ? "bg-[#0000FF] text-white border-white scale-105 shadow-xl shadow-[#0000FF]/50 animate-pulse"
                          : "bg-white/5 text-white/80 border-white/20 hover:border-[#0000FF] hover:text-[#0000FF] hover:bg-white/10"
                      }`}
                      title={`Зажмите карточку проекта ниже и перетащите сюда, чтобы переместить в раздел "${target.label}"`}
                    >
                      <span>{isHovered ? `🎯 Переместить в "${target.label}"` : `🎯 Перетащить в "${target.label}"`}</span>
                    </div>
                  );
                })}
            </div>
          )}

          <div className="rounded-2xl overflow-hidden bg-[#fafaf6] text-black border border-black/5 shadow-2xl font-['Inter',sans-serif] text-xs p-8 pb-16 ">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-4 border-t border-black/[0.04]">
              {itemsList.map((item: any) => {
                const realIdx = itemsList.findIndex((p: any) => p.id === item.id);
                return (
                  <div
                    key={item.id}
                    draggable={!isReadOnly}
                    onDragStart={(e) => handleProductDragStart(e, realIdx, item)}
                    onDragEnd={handleProductDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleProductDrop(e, realIdx)}
                    className="flex flex-col group/card p-3 rounded-2xl hover:bg-black/[0.02] border border-transparent hover:border-black/[0.04] transition duration-200 relative cursor-grab active:cursor-grabbing"
                    title="Зажмите и перетащите для сортировки или переноса в другой раздел"
                  >
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#eeeee9] mb-3 border border-black/5 relative">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />

                      {!isReadOnly && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100 transition duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(item.id);
                            }}
                            className="p-2 bg-white hover:bg-[#eeeee9] text-black rounded-lg shadow-md transition cursor-pointer flex items-center gap-1 text-[9px] font-bold uppercase"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Изменить
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 className="text-[18px] font-bold tracking-tight text-black mt-1 leading-tight">{item.name}</h3>
                    <p className="text-[13px] text-black/60 line-clamp-2 mt-1 leading-relaxed font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {(editingId || isAdding) && (
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <motion.form
             onSubmit={handleSave}
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-8"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
              <h3 className="text-xl font-bold tracking-tight text-white/90">
                {editingId ? `Редактирование ${cfg.itemTypeLabelRuGenitive}: ${editingId}` : `Новый ${cfg.itemTypeLabelRu}`}
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
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Название (RU)</label>
                  <input
                    type="text"
                    value={formNameRu}
                    onChange={(e) => handleNameRuChange(e.target.value)}
                    placeholder="Chyraq"
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
                    placeholder="Индустриальный дизайн"
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
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">ID (URL латиница)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="chyraq"
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

            {/* Card 3: Обложка (Hero Image) */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
                  3. Обложка (Главное фото)
                </h4>
                <div className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadPhoto("img", file);
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    disabled={isReadOnly || uploadingImg}
                  />
                  <button
                    type="button"
                    disabled={uploadingImg}
                    className="px-3.5 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/90 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition"
                  >
                    {uploadingImg ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5" />
                    )}
                    Загрузить фото
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-xs text-white focus:border-[#0066FF] outline-none"
                  placeholder="Вставьте ссылку на картинку или загрузите новую"
                />
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/40 border border-white/5 relative">
                  <img src={formImg} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Card 4: Детальное описание и характеристики */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066FF] border-b border-white/[0.04] pb-2">
                4. Детальное описание и Характеристики (RU)
              </h4>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Клиент</label>
                    <input
                      type="text"
                      value={formClientRu}
                      onChange={(e) => setFormClientRu(e.target.value)}
                      placeholder="Chyraq Labs"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Услуга</label>
                    <input
                      type="text"
                      value={formServiceRu}
                      onChange={(e) => setFormServiceRu(e.target.value)}
                      placeholder="Industrial Design"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Студия</label>
                    <input
                      type="text"
                      value={formStudioRu}
                      onChange={(e) => setFormStudioRu(e.target.value)}
                      placeholder="Steel Drake Studio"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Дизайнер</label>
                    <input
                      type="text"
                      value={formDesignerRu}
                      onChange={(e) => setFormDesignerRu(e.target.value)}
                      placeholder="Иван Иванов"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Локация</label>
                    <input
                      type="text"
                      value={formLocationRu}
                      onChange={(e) => setFormLocationRu(e.target.value)}
                      placeholder="Бишкек, Кыргызстан"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Тип проекта</label>
                    <input
                      type="text"
                      value={formProjectTypeRu}
                      onChange={(e) => setFormProjectTypeRu(e.target.value)}
                      placeholder="Коммерческий"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Класс</label>
                    <input
                      type="text"
                      value={formProductClass}
                      onChange={(e) => setFormProductClass(e.target.value)}
                      placeholder="-"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Задача и Вызов</label>
                  <textarea
                    value={formChallengeRu}
                    onChange={(e) => setFormChallengeRu(e.target.value)}
                    placeholder="Разработать премиальный настольный светильник..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-28 text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50">Описание реализации</label>
                  <textarea
                    value={formDescRu}
                    onChange={(e) => setFormDescRu(e.target.value)}
                    placeholder="Инновационный минималистичный настольный светильник..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-32 text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 5: Результаты */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066FF] border-b border-white/[0.04] pb-2">
                5. Результаты (RU)
              </h4>
              <p className="text-xs text-white/40">
                Введите до двух ключевых метрик или достижений. (Например: "Победитель Interior Design Show 2026").
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formResult1Ru}
                  onChange={(e) => setFormResult1Ru(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                  placeholder="Результат 1 (например: 1 место на выставке)"
                />
                <input
                  type="text"
                  value={formResult2Ru}
                  onChange={(e) => setFormResult2Ru(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                  placeholder="Результат 2 (например: более 10 000 продаж)"
                />
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
                  `Создать ${cfg.itemTypeLabelRu}`
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

          {/* Right Column: Live Mockup Preview & Collage Builder */}
          <div className="sticky top-6 space-y-4 max-h-[85vh] overflow-y-auto border border-white/[0.08] rounded-3xl p-6 bg-[#161622] shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/50 font-sans">Предпросмотр в реальном времени</h4>
            </div>

            <div className="rounded-3xl overflow-hidden bg-[#fafaf6] text-black border border-black/5 shadow-2xl font-['Inter',sans-serif] text-xs pb-16">
              <div
                onClick={() => document.getElementById("file-input-img")?.click()}
                className="relative aspect-[1.7] w-full bg-black cursor-pointer group overflow-hidden flex flex-col justify-end p-6 md:p-8 text-white "
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
                  <img src={formImg} alt="Hero mockup" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20"><Camera className="w-8 h-8" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <h1 className="text-xl md:text-3xl font-bold tracking-tighter leading-none mb-1">{formNameRu || "Название"}</h1>
                  <div className="flex gap-4 text-[7px] uppercase tracking-widest opacity-80 pt-1 border-t border-white/10 mt-1 max-w-sm font-mono">
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

              {/* Challenge description preview */}
              <div className="max-w-[1380px] mx-auto px-6 py-12 border-b border-black/[0.06] bg-[#fafaf6]">
                <div className="grid grid-cols-[1fr_1.8fr] gap-6 items-start">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-md font-bold tracking-tight text-black">Задача и Вызов</h2>
                    <div className="h-[1.5px] w-8 bg-[#0000FF]" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] font-medium leading-relaxed text-black/85">{formChallengeRu || "Описание задачи и вызова..."}</p>
                    <p className="text-[10px] text-black/60 leading-normal font-light">{formDescRu || "Краткое описание..."}</p>
                  </div>
                </div>
              </div>

              {/* Mock Gallery / Video Toggle */}
              <div className="flex justify-center border-b border-black/[0.06] pb-4 bg-[#fafaf6] pt-4">
                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={() => setPreviewActiveTab("gallery")}
                    className={`text-[12px] font-mono font-bold uppercase tracking-[0.06em] transition-all cursor-pointer relative pb-1.5 ${
                      previewActiveTab === "gallery"
                        ? "text-[#0000FF] border-b-[1.5px] border-[#0000FF]"
                        : "text-black/55 hover:text-black"
                    }`}
                  >
                    Галерея
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewActiveTab("video")}
                    className={`text-[12px] font-mono font-bold uppercase tracking-[0.06em] transition-all cursor-pointer relative pb-1.5 ${
                      previewActiveTab === "video"
                        ? "text-[#0000FF] border-b-[1.5px] border-[#0000FF]"
                        : "text-black/55 hover:text-black"
                    }`}
                  >
                    Видео
                  </button>
                </div>
              </div>

              {/* Collage Blocks Builder - Fully Interactive */}
              <div className="px-6 py-10 bg-[#fafaf6] space-y-10 ">
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

                  const visibleItems = block.filter(item => {
                    const isVid = item?.startsWith("video:") || item?.endsWith(".webm");
                    return previewActiveTab === "video" ? isVid : !isVid;
                  });
                  const hasAddSlot = block.filter(Boolean).length < 5;
                  const totalGridElements = visibleItems.length + (hasAddSlot ? 1 : 0);
                  if (totalGridElements === 0 && !hasAddSlot) return null;

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
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[11px] text-black/50 font-bold uppercase flex items-center gap-1.5">
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
                        >
                          <Trash2 className="w-3 h-3" /> Удалить блок
                        </button>
                      </div>

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
                      >
                        <div className={`grid gap-3 ${getGridColsClass(totalGridElements)}`}>
                          {block.map((imgUrl, imgIdx) => {
                            const isVideo = imgUrl?.startsWith("video:") || imgUrl?.endsWith(".webm");
                            const matchesTab = previewActiveTab === "video" ? isVideo : !isVideo;
                            if (!matchesTab) return null;

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
                                className={`relative rounded-[1.2rem] overflow-hidden bg-black/10 cursor-grab border transition-all duration-200 shadow-[0_5px_15px_rgba(0,0,0,0.02)] group/photo  ${draggedOverZone === `photo-${blockIdx}-${imgIdx}`
                                  ? "border-[#0000FF] scale-105 shadow-[0_8px_25px_rgba(0,0,255,0.25)] opacity-85"
                                  : "border-black/5"
                                  }`}
                              >
                                <div className={`w-full ${getImageAspectClass(totalGridElements)}`}>
                                  {imgUrl ? (
                                    <img src={imgUrl.startsWith("video:") ? imgUrl.slice(6) : imgUrl} alt="Mockup Process" className="w-full h-full object-cover pointer-events-none" />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-black/30 bg-black/5">
                                      <Camera className="w-3.5 h-3.5" />
                                      <span className="text-[5px] uppercase font-bold">Выбрать фото</span>
                                    </div>
                                  )}
                                </div>

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

                          {hasAddSlot && previewActiveTab === "gallery" && (
                            <div
                              onClick={() => {
                                document.getElementById(`add-photo-input-${blockIdx}`)?.click();
                              }}
                              className={`rounded-[1.2rem] border border-dashed border-black/15 hover:border-[#0000FF]/50 hover:bg-[#0000FF]/5 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${getImageAspectClass(totalGridElements)}`}
                            >
                              <input
                                id={`add-photo-input-${blockIdx}`}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (!files || files.length === 0) return;
                                  const key = `${blockIdx}-add`;
                                  try {
                                    setUploadingBlocks(prev => ({ ...prev, [key]: true }));
                                    const uploadedUrls: string[] = [];
                                    
                                    for (let i = 0; i < files.length; i++) {
                                      const file = files[i];
                                      const fileExt = file.name.split('.').pop();
                                      const nextIdx = block.length + i;
                                      const path = `${type}/${formId}/block-${blockIdx}-${nextIdx}-${Date.now()}.${fileExt}`;
                                      const publicUrl = await supabaseClient.uploadFile("assets", path, file);
                                      uploadedUrls.push(publicUrl);
                                    }

                                    setFormCollageBlocks(prev => {
                                      return prev.map((b, bIdx) => {
                                        if (bIdx === blockIdx) return [...b, ...uploadedUrls];
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

                          {hasAddSlot && previewActiveTab === "video" && (
                            <div
                              onClick={() => {
                                if (!isReadOnly) document.getElementById(`add-video-input-${blockIdx}`)?.click();
                              }}
                              className={`rounded-[1.2rem] border border-dashed border-[#0000FF]/30 hover:border-[#0000FF]/60 hover:bg-[#0000FF]/5 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${getImageAspectClass(totalGridElements)}`}
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
                                    const path = `${type}/${formId}/block-video-${blockIdx}-${nextIdx}-${Date.now()}.${fileExt}`;
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
                        >
                          <Plus className="w-3.5 h-3.5" /> Вставить блок сюда
                        </button>
                      )}
                    </div>
                  );
                })}

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
                >
                  <Plus className="w-3.5 h-3.5" /> Добавить блок в конец
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminProductsEditor() {
  return <AdminCatalogEditor type="products" />;
}

export function AdminConceptsEditor() {
  return <AdminCatalogEditor type="concepts" />;
}

export function AdminArchitectsEditor() {
  return <AdminCatalogEditor type="architects" />;
}

export function AdminGameDevEditor() {
  return <AdminCatalogEditor type="gamedev" />;
}
