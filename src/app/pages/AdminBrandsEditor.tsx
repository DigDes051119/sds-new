import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cmsService } from "../cmsService";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { supabaseClient } from "../supabaseClient";
import { Save, Check, Globe, Loader2, Star, Plus, Trash2, Upload, FileImage } from "lucide-react";

export function AdminBrandsEditor() {
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  // Check current admin permissions
  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isReadOnly = currentAdmin.permissions?.about === false;

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleBrandFieldChange = (index: number, key: string, value: string) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.home) updated.ru.home = {};
    if (!updated.ru.home.brands) updated.ru.home.brands = [];

    const brands = [...updated.ru.home.brands];
    brands[index] = { ...brands[index], [key]: value };
    updated.ru.home.brands = brands;
    setTranslations(updated);
  };

  const handleLogoUpload = async (index: number, file: File) => {
    if (isReadOnly) return;
    if (file.type !== "image/png") {
      alert("Пожалуйста, выберите файл в формате PNG.");
      return;
    }

    try {
      setUploadingIdx(index);
      const fileExt = file.name.split(".").pop();
      const path = `brands/brand_${Date.now()}_${index}.${fileExt}`;
      const publicUrl = await supabaseClient.uploadFile("assets", path, file);

      const updated = { ...translations };
      if (!updated.ru) updated.ru = {};
      if (!updated.ru.home) updated.ru.home = {};
      if (!updated.ru.home.brands) updated.ru.home.brands = [];

      const brands = [...updated.ru.home.brands];
      brands[index] = { ...brands[index], logoUrl: publicUrl };
      updated.ru.home.brands = brands;
      setTranslations(updated);
    } catch (err: any) {
      alert("Ошибка при загрузке: " + err.message);
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleAddBrand = () => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.home) updated.ru.home = {};
    if (!updated.ru.home.brands) updated.ru.home.brands = [];

    updated.ru.home.brands = [
      ...updated.ru.home.brands,
      {
        logoUrl: "",
        tag: "Новый бренд"
      }
    ];
    setTranslations(updated);
  };

  const handleDeleteBrand = (index: number) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru || !updated.ru.home || !updated.ru.home.brands) return;

    const brands = [...updated.ru.home.brands];
    brands.splice(index, 1);
    updated.ru.home.brands = brands;
    setTranslations(updated);
  };

  const saveChanges = async () => {
    if (isReadOnly) return;
    try {
      setTranslating(true);
      const updated = { ...translations };
      const targetLangs = ["en", "kg"] as const;

      for (const lang of targetLangs) {
        if (!updated[lang]) updated[lang] = {};
        if (!updated[lang].home) updated[lang].home = {};

        const ruBrands = updated.ru.home?.brands || [];
        const translatedBrands = [];

        for (const brand of ruBrands) {
          translatedBrands.push({
            logoUrl: brand.logoUrl || "",
            tag: await translateText(brand.tag || "", lang)
          });
        }
        updated[lang].home.brands = translatedBrands;
      }

      setTranslations(updated);
      await cmsService.updateTranslations(updated);

      // Log action
      await logAdminAction(
        "Управление брендами",
        "Сохранение списка брендов",
        `Обновлен список брендов (${updated.ru.home?.brands?.length || 0} шт.)`
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Ошибка при сохранении: " + err.message);
    } finally {
      setTranslating(false);
    }
  };

  const currentData = translations.ru || {};
  const brandsList = currentData.home?.brands || [];

  return (
    <div className="space-y-8 max-w-[1720px] mx-auto font-['Inter',sans-serif]">
      {/* Save bar & Language info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center gap-2 text-white/50 text-xs font-semibold pl-2">
          <Globe className="w-4 h-4 text-[#0066FF]" />
          Редактирование на русском (RU). Перевод описания на английский (EN) и кыргызский (KG) выполняется автоматически.
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
          Доступ ограничен. У вас нет прав на редактирование брендов.
        </div>
      )}

      {/* Brands List Editor */}
      <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-[#0066FF]">
              <Star className="w-5 h-5" />
              Бренды в бесконечной ленте на Главной (RU)
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Загрузите логотипы в формате PNG (желательно монохромные/белые на прозрачном фоне) и введите мини-описания.
            </p>
          </div>
          {!isReadOnly && (
            <button
              onClick={handleAddBrand}
              className="px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#0066FF]" />
              Добавить бренд
            </button>
          )}
        </div>

        {brandsList.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm border border-dashed border-white/10 rounded-3xl">
            Список брендов пуст. Нажмите «Добавить бренд» выше, чтобы начать.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandsList.map((brand: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4 relative group"
              >
                {!isReadOnly && (
                  <button
                    onClick={() => handleDeleteBrand(idx)}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-lg transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Удалить бренд"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Logo Image Upload and Preview */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Логотип (PNG)</label>
                  
                  {brand.logoUrl ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-white/5 relative flex items-center justify-center p-4">
                      <img src={brand.logoUrl} alt={brand.tag} className="max-h-16 max-w-full object-contain" />
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          disabled={uploadingIdx === idx}
                          className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex flex-col items-center justify-center text-xs font-bold text-white gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-5 h-5 text-[#0066FF]" />
                          Сменить PNG логотип
                        </button>
                      )}
                    </div>
                  ) : (
                    <div 
                      onClick={() => !isReadOnly && fileInputRefs.current[idx]?.click()}
                      className={`aspect-video w-full rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 p-6 transition text-center ${
                        isReadOnly 
                          ? "border-white/5 text-white/20" 
                          : "border-white/10 hover:border-[#0066FF] hover:bg-white/[0.01] cursor-pointer text-white/40 hover:text-white"
                      }`}
                    >
                      <FileImage className="w-8 h-8 opacity-50" />
                      <span className="text-xs font-semibold">Нажмите для загрузки PNG</span>
                      <span className="text-[9px] opacity-60">Только файлы .png</span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={(el) => { fileInputRefs.current[idx] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(idx, file);
                    }}
                    accept="image/png"
                    className="hidden"
                    disabled={isReadOnly || uploadingIdx === idx}
                  />

                  {uploadingIdx === idx && (
                    <div className="flex items-center gap-2 text-xs text-[#0066FF] font-medium mt-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Загрузка логотипа на сервер...
                    </div>
                  )}
                </div>

                {/* Mini Description (RU) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Мини описание (RU)</label>
                  <input
                    type="text"
                    value={brand.tag || ""}
                    onChange={(e) => handleBrandFieldChange(idx, "tag", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                    placeholder="Например: Промышленный дизайн"
                  />
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
            Изменения успешно сохранены!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
