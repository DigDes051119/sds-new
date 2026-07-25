import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cmsService } from "../cmsService";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { supabaseClient } from "../supabaseClient";
import { type ArchiveItem } from "../archiveData";
import { 
  Save, Check, Globe, Loader2, Plus, Trash2, Upload, FileImage, 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Images, Sparkles, Layers, Image as ImageIcon,
  ChevronsUp, ChevronsDown, GripVertical, Search, Edit2, X, ChevronUp, ChevronDown
} from "lucide-react";

export function AdminArchiveEditor() {
  const [archiveData, setArchiveData] = useState(() => cmsService.getArchiveItems());
  const [activeLang, setActiveLang] = useState<"ru" | "en" | "kg">("ru");
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [savingCardIdx, setSavingCardIdx] = useState<number | null>(null);
  const [savedCardIdx, setSavedCardIdx] = useState<number | null>(null);
  const [uploadingState, setUploadingState] = useState<{ itemIdx: number; progress?: string } | null>(null);
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCardIdx, setEditingCardIdx] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    return cmsService.subscribe(() => {
      setArchiveData(cmsService.getArchiveItems());
    });
  }, []);

  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isReadOnly = currentAdmin.permissions?.about === false;

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const allItems: ArchiveItem[] = archiveData[activeLang] || [];
  const currentItems = allItems.filter(item => 
    !searchQuery || 
    (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.year || "").includes(searchQuery) ||
    (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Drag and Drop card reordering
  const handleCardDragStart = (e: React.DragEvent, index: number) => {
    if (isReadOnly) return;
    setDraggedCardIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleCardDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    try {
      const updated = { ...archiveData };
      (["ru", "en", "kg"] as const).forEach((lang) => {
        const list = [...(updated[lang] || [])];
        if (list[sourceIndex]) {
          const [movedItem] = list.splice(sourceIndex, 1);
          list.splice(targetIndex, 0, movedItem);
          updated[lang] = list;
        }
      });

      setArchiveData(updated);
      await cmsService.updateArchiveItems(updated);
      await logAdminAction(
        "Управление галереей (Origins)",
        "Сортировка карточек",
        `Перемещена карточка с позиции ${sourceIndex + 1} на позицию ${targetIndex + 1}`
      );
    } catch (err: any) {
      alert("Ошибка при сохранении порядка: " + err.message);
    } finally {
      setDraggedCardIndex(null);
    }
  };

  // Multiple Images Upload preserving selection order
  const handleMultipleImagesUpload = async (cardIdx: number, files: FileList | File[]) => {
    if (isReadOnly) return;
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    try {
      setUploadingState({ itemIdx: cardIdx, progress: `0/${fileArray.length}` });
      const uploadedUrls: string[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadingState({ itemIdx: cardIdx, progress: `${i + 1}/${fileArray.length}` });

        const fileExt = file.name.split(".").pop();
        const path = `archive/item_${Date.now()}_${cardIdx}_${i}.${fileExt}`;
        const publicUrl = await supabaseClient.uploadFile("assets", path, file);
        uploadedUrls.push(publicUrl);
      }

      const updated = { ...archiveData };
      (["ru", "en", "kg"] as const).forEach((lang) => {
        const list = [...(updated[lang] || [])];
        if (list[cardIdx]) {
          const images = [...(list[cardIdx].images || []), ...uploadedUrls];
          list[cardIdx] = { ...list[cardIdx], images };
          updated[lang] = list;
        }
      });

      setArchiveData(updated);
      await cmsService.updateArchiveItems(updated);
    } catch (err: any) {
      alert("Ошибка при загрузке фотографий: " + err.message);
    } finally {
      setUploadingState(null);
    }
  };

  // Update item field for current language
  const handleItemFieldChange = (index: number, key: keyof ArchiveItem, value: any) => {
    if (isReadOnly) return;
    const updated = { ...archiveData };
    const items = [...(updated[activeLang] || [])];
    items[index] = { ...items[index], [key]: value };
    updated[activeLang] = items;
    setArchiveData(updated);
  };

  // Reorder cards (up, down, top, bottom)
  const handleMoveCard = (index: number, action: "up" | "down" | "top" | "bottom") => {
    if (isReadOnly) return;
    const listLen = currentItems.length;
    if (listLen <= 1) return;

    let targetIndex = index;
    if (action === "up") targetIndex = index - 1;
    else if (action === "down") targetIndex = index + 1;
    else if (action === "top") targetIndex = 0;
    else if (action === "bottom") targetIndex = listLen - 1;

    if (targetIndex < 0 || targetIndex >= listLen || targetIndex === index) return;

    const updated = { ...archiveData };
    // Move for all languages to keep order synchronized
    (["ru", "en", "kg"] as const).forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[index]) {
        const [movedItem] = list.splice(index, 1);
        list.splice(targetIndex, 0, movedItem);
        updated[lang] = list;
      }
    });

    setArchiveData(updated);
  };

  // Add new card
  const handleAddCard = () => {
    if (isReadOnly) return;
    const newId = `archive-${Date.now()}`;
    const newYear = new Date().getFullYear().toString();

    const newItemRu: ArchiveItem = {
      id: newId,
      year: newYear,
      title: "Новый проект архива",
      category: "Concept Design / R&D",
      client: "Steel Drake R&D",
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 0,
      commentsCount: 0,
      shortDesc: "Краткое описание проекта для карточки...",
      fullDesc: "Полное подробное описание проекта для модального окна...",
      quote: "Некоторые из работ, которые были сделаны с 2005 по 2020 год — проекты, по которым некоторые из наших клиентов нас знают и помнят со дня основания.",
      highlights: ["Ключевое достижение или особенность 1"]
    };

    const newItemEn: ArchiveItem = { ...newItemRu };
    const newItemKg: ArchiveItem = { ...newItemRu };

    const updated = {
      ru: [newItemRu, ...(archiveData.ru || [])],
      en: [newItemEn, ...(archiveData.en || [])],
      kg: [newItemKg, ...(archiveData.kg || [])],
    };

    setArchiveData(updated);
    setEditingCardIdx(0);
  };

  // Delete card
  const handleDeleteCard = (index: number) => {
    if (isReadOnly) return;
    if (!confirm("Вы уверены, что хотите удалить эту карточку из архива на всех языках?")) return;

    const updated = { ...archiveData };
    (["ru", "en", "kg"] as const).forEach((lang) => {
      const list = [...(updated[lang] || [])];
      list.splice(index, 1);
      updated[lang] = list;
    });

    setArchiveData(updated);
  };

  // Image Upload for card
  const handleImageUpload = async (cardIdx: number, file: File) => {
    if (isReadOnly) return;
    try {
      setUploadingState({ itemIdx: cardIdx });
      const fileExt = file.name.split(".").pop();
      const path = `archive/item_${Date.now()}_${cardIdx}.${fileExt}`;
      const publicUrl = await supabaseClient.uploadFile("assets", path, file);

      const updated = { ...archiveData };
      (["ru", "en", "kg"] as const).forEach((lang) => {
        const list = [...(updated[lang] || [])];
        if (list[cardIdx]) {
          const images = [...(list[cardIdx].images || []), publicUrl];
          list[cardIdx] = { ...list[cardIdx], images };
          updated[lang] = list;
        }
      });

      setArchiveData(updated);
    } catch (err: any) {
      alert("Ошибка при загрузке картинки: " + err.message);
    } finally {
      setUploadingState(null);
    }
  };

  // Add Image via URL
  const handleAddImageUrl = (cardIdx: number) => {
    if (isReadOnly) return;
    const url = prompt("Введите URL изображения (https://...):");
    if (!url || !url.trim()) return;

    const updated = { ...archiveData };
    (["ru", "en", "kg"] as const).forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[cardIdx]) {
        const images = [...(list[cardIdx].images || []), url.trim()];
        list[cardIdx] = { ...list[cardIdx], images };
        updated[lang] = list;
      }
    });

    setArchiveData(updated);
  };

  // Reorder images within card
  const handleMoveImage = (cardIdx: number, imgIdx: number, direction: "left" | "right") => {
    if (isReadOnly) return;
    const targetIdx = direction === "left" ? imgIdx - 1 : imgIdx + 1;

    const updated = { ...archiveData };
    (["ru", "en", "kg"] as const).forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[cardIdx] && list[cardIdx].images) {
        const imgs = [...list[cardIdx].images];
        if (targetIdx >= 0 && targetIdx < imgs.length) {
          const temp = imgs[imgIdx];
          imgs[imgIdx] = imgs[targetIdx];
          imgs[targetIdx] = temp;
          list[cardIdx] = { ...list[cardIdx], images: imgs };
          updated[lang] = list;
        }
      }
    });

    setArchiveData(updated);
  };

  // Delete image from card
  const handleDeleteImage = (cardIdx: number, imgIdx: number) => {
    if (isReadOnly) return;
    const updated = { ...archiveData };
    (["ru", "en", "kg"] as const).forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[cardIdx] && list[cardIdx].images) {
        const imgs = [...list[cardIdx].images];
        imgs.splice(imgIdx, 1);
        list[cardIdx] = { ...list[cardIdx], images: imgs };
        updated[lang] = list;
      }
    });

    setArchiveData(updated);
  };

  // Highlights management
  const handleHighlightChange = (cardIdx: number, hlIdx: number, value: string) => {
    if (isReadOnly) return;
    const updated = { ...archiveData };
    const langsToUpdate = activeLang === "ru" ? (["ru", "en", "kg"] as const) : ([activeLang] as const);

    langsToUpdate.forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[cardIdx]) {
        const highlights = [...(list[cardIdx].highlights || [])];
        highlights[hlIdx] = value;
        list[cardIdx] = { ...list[cardIdx], highlights };
        updated[lang] = list;
      }
    });

    setArchiveData(updated);
  };

  const handleAddHighlight = (cardIdx: number) => {
    if (isReadOnly) return;
    const updated = { ...archiveData };
    const langsToUpdate = activeLang === "ru" ? (["ru", "en", "kg"] as const) : ([activeLang] as const);

    langsToUpdate.forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[cardIdx]) {
        const highlights = [...(list[cardIdx].highlights || []), "Новая ключевая особенность"];
        list[cardIdx] = { ...list[cardIdx], highlights };
        updated[lang] = list;
      }
    });

    setArchiveData(updated);
  };

  const handleDeleteHighlight = (cardIdx: number, hlIdx: number) => {
    if (isReadOnly) return;
    const updated = { ...archiveData };
    const langsToUpdate = activeLang === "ru" ? (["ru", "en", "kg"] as const) : ([activeLang] as const);

    langsToUpdate.forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[cardIdx]) {
        const highlights = [...(list[cardIdx].highlights || [])];
        highlights.splice(hlIdx, 1);
        list[cardIdx] = { ...list[cardIdx], highlights };
        updated[lang] = list;
      }
    });

    setArchiveData(updated);
  };

  const handleMoveHighlight = (cardIdx: number, hlIdx: number, direction: "up" | "down") => {
    if (isReadOnly) return;
    const targetIdx = direction === "up" ? hlIdx - 1 : hlIdx + 1;
    const updated = { ...archiveData };
    const langsToUpdate = activeLang === "ru" ? (["ru", "en", "kg"] as const) : ([activeLang] as const);

    langsToUpdate.forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[cardIdx]) {
        const highlights = [...(list[cardIdx].highlights || [])];
        if (targetIdx >= 0 && targetIdx < highlights.length) {
          const temp = highlights[hlIdx];
          highlights[hlIdx] = highlights[targetIdx];
          highlights[targetIdx] = temp;
          list[cardIdx] = { ...list[cardIdx], highlights };
          updated[lang] = list;
        }
      }
    });

    setArchiveData(updated);
  };

  // Save & Auto-translate a SINGLE card from activeLang to target languages
  const saveSingleCard = async (index: number) => {
    if (isReadOnly) return;
    try {
      setSavingCardIdx(index);
      const updated = { ...archiveData };
      const sourceCard = (updated[activeLang] || [])[index];
      if (!sourceCard) return;

      const targetLangs = (["ru", "en", "kg"] as const).filter((l) => l !== activeLang);

      for (const lang of targetLangs) {
        const existingList = [...(updated[lang] || [])];

        const [translatedTitle, translatedCategory, translatedShortDesc, translatedFullDesc, translatedQuote, translatedHighlights] = await Promise.all([
          translateText(sourceCard.title || "", lang, activeLang),
          translateText(sourceCard.category || "", lang, activeLang),
          translateText(sourceCard.shortDesc || "", lang, activeLang),
          translateText(sourceCard.fullDesc || "", lang, activeLang),
          sourceCard.quote ? translateText(sourceCard.quote, lang, activeLang) : Promise.resolve(""),
          Promise.all((sourceCard.highlights || []).map((h) => translateText(h || "", lang, activeLang)))
        ]);

        const updatedCard: ArchiveItem = {
          ...sourceCard,
          title: translatedTitle,
          category: translatedCategory,
          shortDesc: translatedShortDesc,
          fullDesc: translatedFullDesc,
          quote: translatedQuote,
          highlights: translatedHighlights,
          images: sourceCard.images || []
        };

        if (existingList[index]) {
          existingList[index] = updatedCard;
        } else {
          existingList.splice(index, 0, updatedCard);
        }

        updated[lang] = existingList;
      }

      setArchiveData(updated);
      await cmsService.updateArchiveItems(updated);

      await logAdminAction(
        "Управление архивом (Origins)",
        "Сохранение отдельной карточки",
        `Сохранена карточка #${index + 1} "${sourceCard.title || ''}"`
      );

      setSavedCardIdx(index);
      setTimeout(() => setSavedCardIdx(null), 3000);
    } catch (err: any) {
      alert("Ошибка при сохранении карточки: " + err.message);
    } finally {
      setSavingCardIdx(null);
    }
  };

  // Fast parallel Save & Auto-translate ALL cards
  const saveChanges = async () => {
    if (isReadOnly) return;
    try {
      setTranslating(true);
      const updated = { ...archiveData };
      const ruItems = updated.ru || [];
      const targetLangs = ["en", "kg"] as const;

      for (const lang of targetLangs) {
        const existingList = updated[lang] || [];
        
        const translatedList = await Promise.all(
          ruItems.map(async (ru, i) => {
            const existing = existingList.find((item) => item.id === ru.id) || existingList[i];

            // If existing item already has translations, reuse them to save time
            const isRuUnchanged = existing && 
              existing.title && 
              existing.title !== "New Archive Project" &&
              existing.title !== "Жаңы архив долбоору" &&
              existing.shortDesc;

            // Only translate if missing or if it's a new card
            const [translatedTitle, translatedCategory, translatedShortDesc, translatedFullDesc, translatedQuote, translatedHighlights] = await Promise.all([
              isRuUnchanged && existing.title ? existing.title : translateText(ru.title || "", lang),
              isRuUnchanged && existing.category ? existing.category : translateText(ru.category || "", lang),
              isRuUnchanged && existing.shortDesc ? existing.shortDesc : translateText(ru.shortDesc || "", lang),
              isRuUnchanged && existing.fullDesc ? existing.fullDesc : translateText(ru.fullDesc || "", lang),
              isRuUnchanged && existing.quote ? existing.quote : (ru.quote ? translateText(ru.quote, lang) : Promise.resolve("")),
              Promise.all(
                (ru.highlights || []).map((h, hIdx) => {
                  if (isRuUnchanged && existing?.highlights?.[hIdx]) {
                    return existing.highlights[hIdx];
                  }
                  return translateText(h || "", lang);
                })
              )
            ]);

            return {
              ...ru,
              title: translatedTitle,
              category: translatedCategory,
              shortDesc: translatedShortDesc,
              fullDesc: translatedFullDesc,
              quote: translatedQuote,
              highlights: translatedHighlights,
              images: ru.images || []
            };
          })
        );

        updated[lang] = translatedList;
      }

      setArchiveData(updated);
      await cmsService.updateArchiveItems(updated);

      await logAdminAction(
        "Управление архивом (Origins)",
        "Сохранение карточек архива",
        `Обновлен архив истоков (${updated.ru?.length || 0} карточек)`
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Ошибка при сохранении: " + err.message);
    } finally {
      setTranslating(false);
    }
  };

  // Extract unique categories for filter pills
  const archiveCategories = Array.from(
    new Set(allItems.map((item) => item.category).filter(Boolean))
  );
  const categoryFilters = ["all", ...archiveCategories];

  const filteredArchiveItems = currentItems.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-8 max-w-[1720px] mx-auto font-['Inter',sans-serif]">
      {/* Top Header Bar & Language Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-white/50 text-xs font-semibold pl-2">
            <Images className="w-4 h-4 text-[#0066FF]" />
            Управление галереей (Origins)
          </div>

          {/* Language Tabs */}
          <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            {(["ru", "en", "kg"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  activeLang === lang 
                    ? "bg-[#0000FF] text-white shadow-lg" 
                    : "text-white/40 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию или году..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-[#0066FF] outline-none transition"
          />
        </div>
      </div>

      {isReadOnly && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-xl">
          Доступ ограничен. У вас нет прав на редактирование архива.
        </div>
      )}

      {/* STATE 1: GRID VIEW (Identical to AdminProjectsEditor) */}
      {editingCardIdx === null && (
        <div className="w-full space-y-6">
          <div className="rounded-2xl overflow-hidden bg-[#fafaf6] text-black border border-black/5 shadow-2xl font-['Inter',sans-serif] text-xs p-8 pb-16 select-none">
            {/* Action buttons header */}
            {!isReadOnly && (
              <div className="flex justify-end items-center pb-4 border-b border-black/[0.06] mb-6 gap-2">
                <button
                  onClick={handleAddCard}
                  className="px-4 py-2 bg-[#0000FF] hover:bg-[#0000FF]/90 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Добавить карточку
                </button>
              </div>
            )}

            {/* Grid of Archive Cards */}
            {filteredArchiveItems.length === 0 ? (
              <div className="text-center py-16 text-black/40 text-sm border-2 border-dashed border-black/10 rounded-2xl">
                Ничего не найдено. Нажмите «Добавить карточку» выше.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
                {filteredArchiveItems.map((item) => {
                  const realIdx = allItems.findIndex((i) => i.id === item.id);
                  const heroImg = item.images?.[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000";

                  return (
                    <div
                      key={item.id || realIdx}
                      draggable={!isReadOnly}
                      onDragStart={(e) => handleCardDragStart(e, realIdx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleCardDrop(e, realIdx)}
                      className={`flex flex-col group/card p-3.5 rounded-2xl transition duration-200 relative border cursor-grab active:cursor-grabbing ${
                        draggedCardIndex === realIdx
                          ? "bg-[#0000FF]/5 border-[#0000FF] shadow-xl"
                          : "hover:bg-black/[0.02] border-transparent hover:border-black/[0.04]"
                      }`}
                      title="Зажмите и перетащите мышкой для изменения порядка"
                    >
                      {/* Image Preview & Hover Actions */}
                      <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#eeeee9] mb-3 border border-black/5 relative">
                        <img src={heroImg} alt={item.title} className="w-full h-full object-cover" />

                        {/* Image count badge */}
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                          <ImageIcon className="w-3 h-3 text-[#0066FF]" />
                          {item.images?.length || 0} фото
                        </div>

                        {/* Drag Handle Indicator */}
                        <div className="absolute top-2 right-2 bg-black/60 text-white/80 p-1.5 rounded-md opacity-0 group-hover/card:opacity-100 transition">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Hover Action Overlay */}
                        {!isReadOnly && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100 transition duration-200">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCardIdx(realIdx);
                              }}
                              className="p-2.5 bg-white hover:bg-[#eeeee9] text-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#0000FF]" />
                              Изменить
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCard(realIdx);
                              }}
                              className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition cursor-pointer"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveCard(realIdx, "up");
                                }}
                                disabled={realIdx === 0}
                                className="p-1.5 bg-white/90 hover:bg-white disabled:opacity-30 text-black rounded-md shadow-md transition cursor-pointer"
                                title="Вверх"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveCard(realIdx, "down");
                                }}
                                disabled={realIdx === allItems.length - 1}
                                className="p-1.5 bg-white/90 hover:bg-white disabled:opacity-30 text-black rounded-md shadow-md transition cursor-pointer"
                                title="Вниз"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Meta & Titles */}
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-[#0000FF] font-bold uppercase tracking-wider">
                          {item.category || "Concept Design"}
                        </span>
                        <span className="text-[12px] font-mono text-black/50 font-semibold">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-[18px] font-bold tracking-tight text-black mt-1 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-black/60 line-clamp-2 mt-1 leading-relaxed font-light">
                        {item.shortDesc || item.fullDesc}
                      </p>
                    </div>
                  );
                })}

                {/* Add Card item at end of grid */}
                {!isReadOnly && (
                  <div
                    onClick={handleAddCard}
                    className="flex flex-col group/add p-3.5 rounded-2xl hover:bg-black/[0.01] transition duration-200 cursor-pointer"
                  >
                    <div className="w-full aspect-[16/10] rounded-xl border-2 border-dashed border-black/15 hover:border-[#0000FF]/40 hover:bg-[#0000FF]/5 flex flex-col items-center justify-center gap-2 transition duration-200 mb-3 bg-black/[0.01]">
                      <Plus className="w-8 h-8 text-black/30 group-hover/add:text-[#0000FF]/60 transition" />
                    </div>
                    <span className="text-[12px] text-[#0000FF] font-semibold uppercase tracking-wider">Новая работа</span>
                    <h3 className="text-[18px] font-bold tracking-tight text-black mt-1 leading-tight">Добавить карточку</h3>
                    <p className="text-[13px] text-black/40 line-clamp-2 mt-1 leading-relaxed font-light">Нажмите для создания нового проекта в галерее</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STATE 2: FOCUSED CARD EDITOR (When a card is being edited) */}
      {editingCardIdx !== null && currentItems[editingCardIdx] && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-8"
        >
          {/* Header row with Back button */}
          <div className="flex justify-between items-center pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingCardIdx(null)}
                className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/80 rounded-xl transition text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                ← Назад к сетке галереи
              </button>
              <span className="text-white/30">|</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Редактирование: {currentItems[editingCardIdx].title || "Карточка"}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => saveSingleCard(editingCardIdx)}
                disabled={savingCardIdx === editingCardIdx}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  savedCardIdx === editingCardIdx
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-[#0000FF] hover:bg-[#0000FF]/85 text-white shadow-lg shadow-[#0000FF]/25"
                }`}
              >
                {savingCardIdx === editingCardIdx ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Перевод и сохранение...</span>
                  </>
                ) : savedCardIdx === editingCardIdx ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Сохранено!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Сохранить карточку</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditingCardIdx(null)}
                className="p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/60 hover:text-white rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Card Editing Form */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 lg:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Metadata Column */}
              <div className="md:col-span-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Год</label>
                    <input
                      type="text"
                      value={currentItems[editingCardIdx].year || ""}
                      onChange={(e) => handleItemFieldChange(editingCardIdx, "year", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm font-mono"
                      placeholder="2014"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Клиент</label>
                    <input
                      type="text"
                      value={currentItems[editingCardIdx].client || ""}
                      onChange={(e) => handleItemFieldChange(editingCardIdx, "client", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                      placeholder="Steel Drake R&D"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Заголовок проекта ({activeLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={currentItems[editingCardIdx].title || ""}
                    onChange={(e) => handleItemFieldChange(editingCardIdx, "title", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm font-bold"
                    placeholder="iPhone 8 Viral Concept"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Категория ({activeLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={currentItems[editingCardIdx].category || ""}
                    onChange={(e) => handleItemFieldChange(editingCardIdx, "category", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                    placeholder="Concept Design / R&D"
                  />
                </div>
              </div>

              {/* Right Descriptions Column */}
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Краткое описание на карточке ({activeLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={currentItems[editingCardIdx].shortDesc || ""}
                    onChange={(e) => handleItemFieldChange(editingCardIdx, "shortDesc", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm resize-none"
                    placeholder="Краткий анонс для плитки в сетке..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Полное описание в модальном окне ({activeLang.toUpperCase()})</label>
                  <textarea
                    rows={4}
                    value={currentItems[editingCardIdx].fullDesc || ""}
                    onChange={(e) => handleItemFieldChange(editingCardIdx, "fullDesc", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm resize-none leading-relaxed"
                    placeholder="Развернутый текст с подробностями проекта..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Цитата / Эпиграф в модальном окне ({activeLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={currentItems[editingCardIdx].quote || ""}
                    onChange={(e) => handleItemFieldChange(editingCardIdx, "quote", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm italic resize-none"
                    placeholder="Some of the works created between 2005 and 2020 — signature projects..."
                  />
                </div>
              </div>
            </div>

            {/* Images Manager */}
            <div className="border-t border-white/[0.06] pt-6 space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#0066FF]" />
                  Галерея изображений ({currentItems[editingCardIdx].images?.length || 0} шт.)
                </label>

                {!isReadOnly && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[editingCardIdx]?.click()}
                      disabled={uploadingState?.itemIdx === editingCardIdx}
                      className="px-4 py-2 bg-[#0000FF]/15 hover:bg-[#0000FF]/25 border border-[#0000FF]/40 rounded-xl text-xs font-bold text-[#0066FF] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {uploadingState?.itemIdx === editingCardIdx ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#0066FF]" />
                          <span>Загрузка {uploadingState.progress}...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[#0066FF]" />
                          <span>Загрузить фото (несколько)</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl(editingCardIdx)}
                      className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#0066FF]" />
                      Добавить URL
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  ref={(el) => { fileInputRefs.current[editingCardIdx] = el; }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleMultipleImagesUpload(editingCardIdx, e.target.files);
                    }
                  }}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Image Thumbnails Strip */}
              {(!currentItems[editingCardIdx].images || currentItems[editingCardIdx].images.length === 0) ? (
                <div className="text-xs text-white/30 italic p-6 border border-dashed border-white/10 rounded-2xl text-center">
                  Нет изображений в этой карточке. Нажмите «Загрузить фото (несколько)».
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {currentItems[editingCardIdx].images.map((imgUrl, imgIdx) => (
                    <div key={imgIdx} className="relative group/img aspect-[4/3] rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                      <img src={imgUrl} alt={`View ${imgIdx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-black/70 text-[10px] font-mono px-1.5 py-0.5 rounded text-white/70">
                        #{imgIdx + 1}
                      </div>

                      {!isReadOnly && (
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center gap-1 p-1">
                          <button
                            type="button"
                            onClick={() => handleMoveImage(editingCardIdx, imgIdx, "left")}
                            disabled={imgIdx === 0}
                            className="p-1 bg-white/10 hover:bg-white/25 disabled:opacity-20 rounded text-white cursor-pointer"
                            title="Сдвинуть влево"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImage(editingCardIdx, imgIdx, "right")}
                            disabled={imgIdx === currentItems[editingCardIdx].images.length - 1}
                            className="p-1 bg-white/10 hover:bg-white/25 disabled:opacity-20 rounded text-white cursor-pointer"
                            title="Сдвинуть вправо"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(editingCardIdx, imgIdx)}
                            className="p-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded cursor-pointer ml-1"
                            title="Удалить фото"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key Highlights Manager */}
            <div className="border-t border-white/[0.06] pt-6 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0066FF]" />
                  Ключевые особенности / Достижения ({activeLang.toUpperCase()})
                </label>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleAddHighlight(editingCardIdx)}
                    className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#0066FF]" />
                    Добавить пункт
                  </button>
                )}
              </div>

              {(!currentItems[editingCardIdx].highlights || currentItems[editingCardIdx].highlights.length === 0) ? (
                <div className="text-xs text-white/30 italic p-3 border border-dashed border-white/5 rounded-xl text-center">
                  Список особенностей пуст. Нажмите «Добавить пункт».
                </div>
              ) : (
                <div className="space-y-2">
                  {currentItems[editingCardIdx].highlights.map((hlText, hlIdx) => (
                    <div key={hlIdx} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] p-2 rounded-xl">
                      <span className="text-xs font-mono text-[#0066FF] font-bold px-2">
                        0{hlIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={hlText}
                        onChange={(e) => handleHighlightChange(editingCardIdx, hlIdx, e.target.value)}
                        disabled={isReadOnly}
                        className="flex-1 bg-transparent border-none outline-none text-xs text-white p-1"
                        placeholder="Описание особенности..."
                      />
                      {!isReadOnly && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveHighlight(editingCardIdx, hlIdx, "up")}
                            disabled={hlIdx === 0}
                            className="p-1 text-white/40 hover:text-white disabled:opacity-20 transition"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveHighlight(editingCardIdx, hlIdx, "down")}
                            disabled={hlIdx === currentItems[editingCardIdx].highlights.length - 1}
                            className="p-1 text-white/40 hover:text-white disabled:opacity-20 transition"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHighlight(editingCardIdx, hlIdx)}
                            className="p-1 text-red-400/60 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Footer Bar */}
            {!isReadOnly && (
              <div className="border-t border-white/[0.06] pt-6 flex flex-wrap justify-between items-center gap-4">
                <button
                  type="button"
                  onClick={() => setEditingCardIdx(null)}
                  className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/80 rounded-xl transition text-xs font-bold cursor-pointer"
                >
                  ← Назад к сетке галереи
                </button>

                <button
                  type="button"
                  onClick={() => saveSingleCard(editingCardIdx)}
                  disabled={savingCardIdx === editingCardIdx}
                  className={`px-6 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    savedCardIdx === editingCardIdx
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-[#0000FF] hover:bg-[#0000FF]/85 text-white shadow-xl shadow-[#0000FF]/25"
                  }`}
                >
                  {savingCardIdx === editingCardIdx ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Перевод и сохранение...</span>
                    </>
                  ) : savedCardIdx === editingCardIdx ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Карточка успешно сохранена!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Сохранить эту карточку</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-emerald-500 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-emerald-400"
          >
            <Check className="w-5 h-5" />
            Карточки архива успешно сохранены!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
