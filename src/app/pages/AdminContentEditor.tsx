import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cmsService } from "../cmsService";
import { Save, Check, Globe } from "lucide-react";

export function AdminContentEditor() {
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [selectedLang, setSelectedLang] = useState<"ru" | "en" | "kg">("ru");
  const [activeSection, setActiveSection] = useState<"home" | "about" | "contacts">("home");
  const [success, setSuccess] = useState(false);

  const handleFieldChange = (section: string, key: string, value: string) => {
    const updated = { ...translations };
    if (!updated[selectedLang]) updated[selectedLang] = {};
    if (!updated[selectedLang][section]) updated[selectedLang][section] = {};
    updated[selectedLang][section][key] = value;
    setTranslations(updated);
  };

  const handleNestedFieldChange = (section: string, parentKey: string, key: string, value: string) => {
    const updated = { ...translations };
    if (!updated[selectedLang]) updated[selectedLang] = {};
    if (!updated[selectedLang][section]) updated[selectedLang][section] = {};
    if (!updated[selectedLang][section][parentKey]) updated[selectedLang][section][parentKey] = {};
    updated[selectedLang][section][parentKey][key] = value;
    setTranslations(updated);
  };

  const saveChanges = () => {
    cmsService.updateTranslations(translations);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const currentData = translations[selectedLang] || {};

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Save bar & Language chooser */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
        {/* Languages */}
        <div className="flex gap-2 bg-black/30 p-1.5 rounded-xl border border-white/[0.04]">
          {(["ru", "en", "kg"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLang(lang)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                selectedLang === lang
                  ? "bg-[#0000FF] text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={saveChanges}
          className="px-6 py-3 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
        >
          {success ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          {success ? "Сохранено!" : "Сохранить изменения"}
        </button>
      </div>

      {/* Pages switcher */}
      <div className="flex gap-4 border-b border-white/[0.06] pb-1">
        {(["home", "about", "contacts"] as const).map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => setActiveSection(sec)}
            className={`px-6 py-3 text-sm font-bold tracking-tight border-b-2 transition-all duration-300 ${
              activeSection === sec
                ? "border-[#0000FF] text-white"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            {sec === "home" ? "Главная страница" : sec === "about" ? "О нас" : "Контакты"}
          </button>
        ))}
      </div>

      {/* Form Area */}
      <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-6">
        {activeSection === "home" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2 text-[#0066FF]">
              <Globe className="w-5 h-5" />
              Тексты Главного экрана и статистики ({selectedLang.toUpperCase()})
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Философская цитата (Hero Tag)</label>
              <textarea
                value={currentData.home?.heroTag || ""}
                onChange={(e) => handleFieldChange("home", "heroTag", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-24 text-base leading-relaxed transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Описание Hero</label>
              <textarea
                value={currentData.home?.heroDescription || ""}
                onChange={(e) => handleFieldChange("home", "heroDescription", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-28 text-base leading-relaxed transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Лейбл Кнопки</label>
                <input
                  type="text"
                  value={currentData.home?.viewProjects || ""}
                  onChange={(e) => handleFieldChange("home", "viewProjects", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Текст Статистики</label>
                <input
                  type="text"
                  value={currentData.home?.statsLabel || ""}
                  onChange={(e) => handleFieldChange("home", "statsLabel", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                />
              </div>
            </div>

            <div className="h-px bg-white/[0.06] my-6" />

            <h3 className="text-lg font-bold tracking-tight mb-4 text-[#0066FF]">Специальный Проект</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Название Нового Проекта</label>
                <input
                  type="text"
                  value={currentData.home?.newProject?.title || ""}
                  onChange={(e) => handleNestedFieldChange("home", "newProject", "title", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Описание Нового Проекта</label>
                <input
                  type="text"
                  value={currentData.home?.newProject?.description || ""}
                  onChange={(e) => handleNestedFieldChange("home", "newProject", "description", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === "about" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2 text-[#0066FF]">
              <Globe className="w-5 h-5" />
              Манифест и Описание студии ({selectedLang.toUpperCase()})
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Заголовок манифеста</label>
              <input
                type="text"
                value={currentData.about?.manifestoHeading || ""}
                onChange={(e) => handleFieldChange("about", "manifestoHeading", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Текст манифеста</label>
              <textarea
                value={currentData.about?.manifestoText || ""}
                onChange={(e) => handleFieldChange("about", "manifestoText", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-36 text-base leading-relaxed transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Наша Философия</label>
              <textarea
                value={currentData.about?.philosophyText || ""}
                onChange={(e) => handleFieldChange("about", "philosophyText", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-36 text-base leading-relaxed transition-all"
              />
            </div>
          </div>
        )}

        {activeSection === "contacts" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2 text-[#0066FF]">
              <Globe className="w-5 h-5" />
              Контактные Данные ({selectedLang.toUpperCase()})
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Главный заголовок контактов</label>
              <input
                type="text"
                value={currentData.contacts?.title || ""}
                onChange={(e) => handleFieldChange("contacts", "title", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Адрес офиса</label>
              <textarea
                value={currentData.contacts?.officeAddress || ""}
                onChange={(e) => handleFieldChange("contacts", "officeAddress", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-24 text-base leading-relaxed transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Руководство (Текст)</label>
                <input
                  type="text"
                  value={currentData.contacts?.leader || ""}
                  onChange={(e) => handleFieldChange("contacts", "leader", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Юридическая информация</label>
                <input
                  type="text"
                  value={currentData.contacts?.legal || ""}
                  onChange={(e) => handleFieldChange("contacts", "legal", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating success banner */}
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
