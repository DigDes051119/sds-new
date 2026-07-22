import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cmsService } from "../cmsService";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { supabaseClient } from "../supabaseClient";
import { type ArchiveItem } from "../archiveData";
import { 
  Save, Check, Globe, Loader2, Plus, Trash2, Upload, FileImage, 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Images, Sparkles, Layers, Image as ImageIcon
} from "lucide-react";

export function AdminArchiveEditor() {
  const [archiveData, setArchiveData] = useState(() => cmsService.getArchiveItems());
  const [activeLang, setActiveLang] = useState<"ru" | "en" | "kg">("ru");
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploadingState, setUploadingState] = useState<{ itemIdx: number } | null>(null);

  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isReadOnly = currentAdmin.permissions?.about === false;

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const currentItems: ArchiveItem[] = archiveData[activeLang] || [];

  // Update item field for current language
  const handleItemFieldChange = (index: number, key: keyof ArchiveItem, value: any) => {
    if (isReadOnly) return;
    const updated = { ...archiveData };
    const items = [...(updated[activeLang] || [])];
    items[index] = { ...items[index], [key]: value };
    updated[activeLang] = items;
    setArchiveData(updated);
  };

  // Reorder cards
  const handleMoveCard = (index: number, direction: "up" | "down") => {
    if (isReadOnly) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentItems.length) return;

    const updated = { ...archiveData };
    // Move for all languages to keep order synchronized
    (["ru", "en", "kg"] as const).forEach((lang) => {
      const list = [...(updated[lang] || [])];
      if (list[index] && list[targetIndex]) {
        const temp = list[index];
        list[index] = list[targetIndex];
        list[targetIndex] = temp;
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
      highlights: ["Ключевое достижение или особенность 1"]
    };

    const newItemEn: ArchiveItem = {
      ...newItemRu,
      title: "New Archive Project",
      shortDesc: "Short description for the project card...",
      fullDesc: "Full detailed project description for the modal window...",
      highlights: ["Key highlight or feature 1"]
    };

    const newItemKg: ArchiveItem = {
      ...newItemRu,
      title: "Жаңы архив долбоору",
      shortDesc: "Долбоордун карточкасы үчүн кыскача сүрөттөмө...",
      fullDesc: "Модалдык терезе үчүн долбоордун толук сүрөттөмөсү...",
      highlights: ["Негизги жетишкендик же өзгөчөлүк 1"]
    };

    const updated = {
      ru: [newItemRu, ...(archiveData.ru || [])],
      en: [newItemEn, ...(archiveData.en || [])],
      kg: [newItemKg, ...(archiveData.kg || [])],
    };

    setArchiveData(updated);
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
    const list = [...(updated[activeLang] || [])];
    if (list[cardIdx]) {
      const highlights = [...(list[cardIdx].highlights || [])];
      highlights[hlIdx] = value;
      list[cardIdx] = { ...list[cardIdx], highlights };
      updated[activeLang] = list;
      setArchiveData(updated);
    }
  };

  const handleAddHighlight = (cardIdx: number) => {
    if (isReadOnly) return;
    const updated = { ...archiveData };
    const list = [...(updated[activeLang] || [])];
    if (list[cardIdx]) {
      const highlights = [...(list[cardIdx].highlights || []), "Новая ключевая особенность"];
      list[cardIdx] = { ...list[cardIdx], highlights };
      updated[activeLang] = list;
      setArchiveData(updated);
    }
  };

  const handleDeleteHighlight = (cardIdx: number, hlIdx: number) => {
    if (isReadOnly) return;
    const updated = { ...archiveData };
    const list = [...(updated[activeLang] || [])];
    if (list[cardIdx]) {
      const highlights = [...(list[cardIdx].highlights || [])];
      highlights.splice(hlIdx, 1);
      list[cardIdx] = { ...list[cardIdx], highlights };
      updated[activeLang] = list;
      setArchiveData(updated);
    }
  };

  const handleMoveHighlight = (cardIdx: number, hlIdx: number, direction: "up" | "down") => {
    if (isReadOnly) return;
    const targetIdx = direction === "up" ? hlIdx - 1 : hlIdx + 1;
    const updated = { ...archiveData };
    const list = [...(updated[activeLang] || [])];
    if (list[cardIdx]) {
      const highlights = [...(list[cardIdx].highlights || [])];
      if (targetIdx >= 0 && targetIdx < highlights.length) {
        const temp = highlights[hlIdx];
        highlights[hlIdx] = highlights[targetIdx];
        highlights[targetIdx] = temp;
        list[cardIdx] = { ...list[cardIdx], highlights };
        updated[activeLang] = list;
        setArchiveData(updated);
      }
    }
  };

  // Save & Auto-translate
  const saveChanges = async () => {
    if (isReadOnly) return;
    try {
      setTranslating(true);
      const updated = { ...archiveData };

      // If editing on RU, auto-translate texts to EN and KG if desired
      if (activeLang === "ru") {
        const ruItems = updated.ru || [];
        const targetLangs = ["en", "kg"] as const;

        for (const lang of targetLangs) {
          const existingList = updated[lang] || [];
          const translatedList: ArchiveItem[] = [];

          for (let i = 0; i < ruItems.length; i++) {
            const ru = ruItems[i];
            const existing = existingList.find(item => item.id === ru.id) || existingList[i];

            // Auto translate text fields if missing or updating
            const translatedTitle = existing?.title && existing.title !== ru.title 
              ? existing.title 
              : await translateText(ru.title || "", lang);

            const translatedShortDesc = existing?.shortDesc && existing.shortDesc !== ru.shortDesc 
              ? existing.shortDesc 
              : await translateText(ru.shortDesc || "", lang);

            const translatedFullDesc = existing?.fullDesc && existing.fullDesc !== ru.fullDesc 
              ? existing.fullDesc 
              : await translateText(ru.fullDesc || "", lang);

            const translatedCategory = existing?.category && existing.category !== ru.category 
              ? existing.category 
              : await translateText(ru.category || "", lang);

            const translatedHighlights: string[] = [];
            if (ru.highlights && ru.highlights.length > 0) {
              for (let hIdx = 0; hIdx < ru.highlights.length; hIdx++) {
                const ruH = ru.highlights[hIdx];
                const exH = existing?.highlights?.[hIdx];
                if (exH && exH !== ruH) {
                  translatedHighlights.push(exH);
                } else {
                  translatedHighlights.push(await translateText(ruH, lang));
                }
              }
            }

            translatedList.push({
              ...ru,
              title: translatedTitle,
              category: translatedCategory,
              shortDesc: translatedShortDesc,
              fullDesc: translatedFullDesc,
              highlights: translatedHighlights,
              images: ru.images || []
            });
          }

          updated[lang] = translatedList;
        }
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

  return (
    <div className="space-y-8 max-w-[1720px] mx-auto font-['Inter',sans-serif]">
      {/* Save bar & Language Switcher */}
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

        {!isReadOnly && (
          <button
            onClick={saveChanges}
            disabled={translating}
            className="px-6 py-3 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {translating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : success ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {translating ? "Перевод и сохранение..." : success ? "Сохранено!" : "Сохранить изменения"}
          </button>
        )}
      </div>

      {isReadOnly && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-xl">
          Доступ ограничен. У вас нет прав на редактирование архива.
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-[#0066FF]">
              <Sparkles className="w-5 h-5" />
              Карточки архива ({activeLang.toUpperCase()})
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Управляйте порядком, текстами, галереей изображений и ключевыми особенностями карточек.
            </p>
          </div>

          {!isReadOnly && (
            <button
              onClick={handleAddCard}
              className="px-5 py-2.5 bg-[#0000FF]/15 hover:bg-[#0000FF]/25 border border-[#0000FF]/40 rounded-xl text-xs font-bold transition flex items-center gap-2 text-[#0066FF]"
            >
              <Plus className="w-4 h-4" />
              Добавить новую карточку
            </button>
          )}
        </div>

        {/* Cards List */}
        {currentItems.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm border border-dashed border-white/10 rounded-3xl">
            Список карточек пуст. Нажмите «Добавить новую карточку» выше.
          </div>
        ) : (
          <div className="space-y-6">
            {currentItems.map((item, cardIdx) => (
              <div 
                key={item.id || cardIdx}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 lg:p-8 space-y-6 relative group"
              >
                {/* Header Row: Index & Quick Controls */}
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0066FF] bg-[#0066FF]/10 border border-[#0066FF]/20 px-2.5 py-1 rounded-lg">
                      [{String(cardIdx + 1).padStart(2, '0')}]
                    </span>
                    <span className="text-sm font-bold text-white uppercase">{item.title || "Без названия"}</span>
                    <span className="text-xs text-white/40 font-mono">({item.year})</span>
                  </div>

                  {!isReadOnly && (
                    <div className="flex items-center gap-2">
                      {/* Reorder Up / Down */}
                      <button
                        onClick={() => handleMoveCard(cardIdx, "up")}
                        disabled={cardIdx === 0}
                        className="p-2 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 rounded-lg text-white transition cursor-pointer"
                        title="Переместить выше"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveCard(cardIdx, "down")}
                        disabled={cardIdx === currentItems.length - 1}
                        className="p-2 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 rounded-lg text-white transition cursor-pointer"
                        title="Переместить ниже"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteCard(cardIdx)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-lg transition cursor-pointer ml-2"
                        title="Удалить карточку"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Metadata Column */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Год</label>
                        <input
                          type="text"
                          value={item.year || ""}
                          onChange={(e) => handleItemFieldChange(cardIdx, "year", e.target.value)}
                          disabled={isReadOnly}
                          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm font-mono"
                          placeholder="2014"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Клиент</label>
                        <input
                          type="text"
                          value={item.client || ""}
                          onChange={(e) => handleItemFieldChange(cardIdx, "client", e.target.value)}
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
                        value={item.title || ""}
                        onChange={(e) => handleItemFieldChange(cardIdx, "title", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm font-bold"
                        placeholder="iPhone 8 Viral Concept"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Категория ({activeLang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={item.category || ""}
                        onChange={(e) => handleItemFieldChange(cardIdx, "category", e.target.value)}
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
                        value={item.shortDesc || ""}
                        onChange={(e) => handleItemFieldChange(cardIdx, "shortDesc", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm resize-none"
                        placeholder="Краткий анонс для плитки в сетке..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Полное описание в модальном окне ({activeLang.toUpperCase()})</label>
                      <textarea
                        rows={4}
                        value={item.fullDesc || ""}
                        onChange={(e) => handleItemFieldChange(cardIdx, "fullDesc", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm resize-none leading-relaxed"
                        placeholder="Развернутый текст с подробностями проекта..."
                      />
                    </div>
                  </div>
                </div>

                {/* Images Manager */}
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#0066FF]" />
                      Галерея изображений ({item.images?.length || 0} шт.)
                    </label>

                    {!isReadOnly && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[cardIdx]?.click()}
                          disabled={uploadingState?.itemIdx === cardIdx}
                          className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {uploadingState?.itemIdx === cardIdx ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066FF]" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-[#0066FF]" />
                          )}
                          Загрузить фото
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddImageUrl(cardIdx)}
                          className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#0066FF]" />
                          Добавить URL
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={(el) => { fileInputRefs.current[cardIdx] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(cardIdx, file);
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Image Thumbnails Strip */}
                  {(!item.images || item.images.length === 0) ? (
                    <div className="text-xs text-white/30 italic p-4 border border-dashed border-white/5 rounded-xl text-center">
                      Нет изображений в этой карточке.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {item.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative group/img aspect-[4/3] rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                          <img src={imgUrl} alt={`View ${imgIdx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-black/70 text-[10px] font-mono px-1.5 py-0.5 rounded text-white/70">
                            #{imgIdx + 1}
                          </div>

                          {!isReadOnly && (
                            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center gap-1 p-1">
                              <button
                                onClick={() => handleMoveImage(cardIdx, imgIdx, "left")}
                                disabled={imgIdx === 0}
                                className="p-1 bg-white/10 hover:bg-white/25 disabled:opacity-20 rounded text-white cursor-pointer"
                                title="Сдвинуть влево"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveImage(cardIdx, imgIdx, "right")}
                                disabled={imgIdx === item.images.length - 1}
                                className="p-1 bg-white/10 hover:bg-white/25 disabled:opacity-20 rounded text-white cursor-pointer"
                                title="Сдвинуть вправо"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteImage(cardIdx, imgIdx)}
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

                {/* Highlights List Manager ([KEY HIGHLIGHTS]) */}
                <div className="border-t border-white/[0.06] pt-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0066FF]" />
                      Ключевые особенности / Достижения ([KEY HIGHLIGHTS]) ({activeLang.toUpperCase()})
                    </label>
                    {!isReadOnly && (
                      <button
                        onClick={() => handleAddHighlight(cardIdx)}
                        className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#0066FF]" />
                        Добавить пункт
                      </button>
                    )}
                  </div>

                  {(!item.highlights || item.highlights.length === 0) ? (
                    <div className="text-xs text-white/30 italic p-3 border border-dashed border-white/5 rounded-xl text-center">
                      Список особенностей пуст. Нажмите «Добавить пункт».
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {item.highlights.map((hlText, hlIdx) => (
                        <div key={hlIdx} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] p-2 rounded-xl">
                          <span className="text-xs font-mono text-[#0066FF] font-bold px-2">
                            0{hlIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={hlText}
                            onChange={(e) => handleHighlightChange(cardIdx, hlIdx, e.target.value)}
                            disabled={isReadOnly}
                            className="flex-1 bg-transparent border-none outline-none text-xs text-white p-1"
                            placeholder="Описание особенности..."
                          />
                          {!isReadOnly && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveHighlight(cardIdx, hlIdx, "up")}
                                disabled={hlIdx === 0}
                                className="p-1 text-white/40 hover:text-white disabled:opacity-20 transition"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveHighlight(cardIdx, hlIdx, "down")}
                                disabled={hlIdx === item.highlights.length - 1}
                                className="p-1 text-white/40 hover:text-white disabled:opacity-20 transition"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteHighlight(cardIdx, hlIdx)}
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

              </div>
            ))}
          </div>
        )}
      </div>

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
