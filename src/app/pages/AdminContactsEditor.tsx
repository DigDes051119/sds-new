import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cmsService } from "../cmsService";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { Save, Check, Globe, Loader2, MapPin } from "lucide-react";

export function AdminContactsEditor() {
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);

  const handleFieldChange = (key: string, value: string) => {
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.contacts) updated.ru.contacts = {};
    updated.ru.contacts[key] = value;
    setTranslations(updated);
  };

  const saveChanges = async () => {
    try {
      setTranslating(true);
      const updated = { ...translations };
      const targetLangs = ["en", "kg"] as const;
      
      for (const lang of targetLangs) {
        if (!updated[lang]) updated[lang] = {};
        if (updated.ru.contacts) {
          if (!updated[lang].contacts) updated[lang].contacts = {};
          
          updated[lang].contacts.title = await translateText(updated.ru.contacts.title || "", lang);
          updated[lang].contacts.officeAddress = await translateText(updated.ru.contacts.officeAddress || "", lang);
          updated[lang].contacts.leader = await translateText(updated.ru.contacts.leader || "", lang);
          updated[lang].contacts.legal = await translateText(updated.ru.contacts.legal || "", lang);
        }
      }
      
      setTranslations(updated);
      await cmsService.updateTranslations(updated);

      // Log action
      await logAdminAction(
        "Контакты",
        "Сохранение контактов",
        `Обновлен адрес: "${updated.ru.contacts?.officeAddress || ""}", руководство: "${updated.ru.contacts?.leader || ""}"`
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Ошибка при сохранении и переводе: " + err.message);
    } finally {
      setTranslating(false);
    }
  };

  const currentData = translations.ru || {};

  return (
    <div className="space-y-8 max-w-5xl font-['Inter',sans-serif]">
      {/* Save bar & Language info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center gap-2 text-white/50 text-xs font-semibold pl-2">
          <Globe className="w-4 h-4 text-[#0066FF]" />
          Редактирование на русском (RU). Перевод на английский (EN) и кыргызский (KG) выполняется автоматически.
        </div>

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
      </div>

      <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-6">
        <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2 text-[#0066FF]">
          <MapPin className="w-5 h-5" />
          Контактные Данные (RU)
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">Главный заголовок контактов</label>
          <input
            type="text"
            value={currentData.contacts?.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">Адрес офиса</label>
          <textarea
            value={currentData.contacts?.officeAddress || ""}
            onChange={(e) => handleFieldChange("officeAddress", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-24 text-base leading-relaxed transition-all"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50">Руководство (Текст)</label>
            <input
              type="text"
              value={currentData.contacts?.leader || ""}
              onChange={(e) => handleFieldChange("leader", e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50">Юридическая информация</label>
            <input
              type="text"
              value={currentData.contacts?.legal || ""}
              onChange={(e) => handleFieldChange("legal", e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
            />
          </div>
        </div>
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
