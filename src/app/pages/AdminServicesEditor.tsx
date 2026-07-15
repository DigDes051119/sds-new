import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cmsService } from "../cmsService";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { Save, Check, Globe, Loader2, Briefcase, Plus, Trash2 } from "lucide-react";

export function AdminServicesEditor() {
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);

  // Check current admin permissions
  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isReadOnly = currentAdmin.permissions?.services === false;

  const handleServiceFieldChange = (index: number, key: string, value: string) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.services) updated.ru.services = {};
    if (!updated.ru.services.items) updated.ru.services.items = [];

    const items = [...updated.ru.services.items];
    items[index] = { ...items[index], [key]: value };
    updated.ru.services.items = items;
    setTranslations(updated);
  };

  const handleHomeServiceFieldChange = (index: number, fieldIdx: number, value: string) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.home) updated.ru.home = {};
    if (!updated.ru.home.services) updated.ru.home.services = [];

    const homeServices = [...updated.ru.home.services];
    const item = [...(homeServices[index] || [])];
    item[fieldIdx] = value;
    homeServices[index] = item;
    updated.ru.home.services = homeServices;
    setTranslations(updated);
  };

  const handleStepChange = (serviceIndex: number, stepIndex: number, value: string) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru || !updated.ru.services || !updated.ru.services.items) return;

    const items = [...updated.ru.services.items];
    const steps = [...(items[serviceIndex].steps || [])];
    steps[stepIndex] = value;
    items[serviceIndex].steps = steps;
    updated.ru.services.items = items;
    setTranslations(updated);
  };

  const handleAddStep = (serviceIndex: number) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru || !updated.ru.services || !updated.ru.services.items) return;

    const items = [...updated.ru.services.items];
    const steps = [...(items[serviceIndex].steps || []), ""];
    items[serviceIndex].steps = steps;
    updated.ru.services.items = items;
    setTranslations(updated);
  };

  const handleDeleteStep = (serviceIndex: number, stepIndex: number) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru || !updated.ru.services || !updated.ru.services.items) return;

    const items = [...updated.ru.services.items];
    const steps = [...(items[serviceIndex].steps || [])];
    steps.splice(stepIndex, 1);
    items[serviceIndex].steps = steps;
    updated.ru.services.items = items;
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
        if (updated.ru.services) {
          if (!updated[lang].services) updated[lang].services = {};
          updated[lang].services.title = await translateText(updated.ru.services.title || "Services", lang);
          updated[lang].services.stepsTitle = await translateText(updated.ru.services.stepsTitle || "Work stages", lang);

          if (updated.ru.services.items) {
            const translatedItems = [];
            for (const item of updated.ru.services.items) {
              const translatedSteps = [];
              if (item.steps) {
                for (const step of item.steps) {
                  translatedSteps.push(await translateText(step || "", lang));
                }
              }
              translatedItems.push({
                id: item.id,
                title: await translateText(item.title || "", lang),
                desc: await translateText(item.desc || "", lang),
                steps: translatedSteps
              });
            }
            updated[lang].services.items = translatedItems;
          }
        }

        // Translate and sync homepage services
        if (updated.ru.home && updated.ru.home.services) {
          if (!updated[lang].home) updated[lang].home = {};
          const translatedHomeServices = [];
          for (const item of updated.ru.home.services) {
            translatedHomeServices.push([
              item[0], // id
              await translateText(item[1] || "", lang), // title
              await translateText(item[2] || "", lang), // description
              item[3] || "" // image URL
            ]);
          }
          updated[lang].home.services = translatedHomeServices;
        }
      }

      setTranslations(updated);
      await cmsService.updateTranslations(updated);

      // Log action
      await logAdminAction(
        "Управление услугами",
        "Сохранение услуг",
        `Обновлен список услуг (${updated.ru.services?.items?.length || 0} шт.), этапы работы и блоки услуг на главной (${updated.ru.home?.services?.length || 0} шт.)`
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
  const servicesList = currentData.services?.items || [];
  const homeServicesList = currentData.home?.services || [];

  return (
    <div className="space-y-8 max-w-[1720px] mx-auto font-['Inter',sans-serif]">
      {/* Save bar & Language info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center gap-2 text-white/50 text-xs font-semibold pl-2">
          <Globe className="w-4 h-4 text-[#0066FF]" />
          Редактирование на русском (RU). Перевод на английский (EN) и кыргызский (KG) выполняется автоматически.
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
          Доступ ограничен. У вас нет прав на редактирование услуг.
        </div>
      )}

      {/* Homepage Services Editor */}
      <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-8">
        <h3 className="text-lg font-bold tracking-tight mb-2 flex items-center gap-2 text-[#0066FF]">
          <Briefcase className="w-5 h-5" />
          Услуги на Главной странице (RU)
        </h3>
        <p className="text-xs text-white/40 mb-6">
          Эти 4 блока услуг отображаются в виде раскрывающихся карт на главной странице сайта. Ссылка на картинку может быть как внешней (Unsplash/др.), так и из хранилища Supabase Storage.
        </p>

        {homeServicesList.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl">
            Список услуг на главной странице пуст.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {homeServicesList.map((service: any, idx: number) => {
              const serviceId = service[0] || "";
              const serviceTitle = service[1] || "";
              const serviceDesc = service[2] || "";
              const serviceImg = service[3] || "";

              return (
                <div key={serviceId || idx} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-light text-[#0000FF]">{serviceId}</span>
                    <input
                      type="text"
                      value={serviceTitle}
                      onChange={(e) => handleHomeServiceFieldChange(idx, 1, e.target.value)}
                      disabled={isReadOnly}
                      className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-base font-semibold"
                      placeholder="Название услуги"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Описание услуги</label>
                    <textarea
                      value={serviceDesc}
                      onChange={(e) => handleHomeServiceFieldChange(idx, 2, e.target.value)}
                      disabled={isReadOnly}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none h-16 text-sm"
                      placeholder="Краткое описание на главной странице"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Ссылка на изображение</label>
                    <input
                      type="text"
                      value={serviceImg}
                      onChange={(e) => handleHomeServiceFieldChange(idx, 3, e.target.value)}
                      disabled={isReadOnly}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-white focus:border-[#0066FF] outline-none text-xs"
                      placeholder="Вставьте ссылку на картинку"
                    />
                    {serviceImg && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-white/5 relative">
                        <img src={serviceImg} alt={serviceTitle} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Services List Editor */}
      <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-8">
        <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2 text-[#0066FF]">
          <Briefcase className="w-5 h-5" />
          Управление услугами (RU)
        </h3>

        {servicesList.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm border border-dashed border-white/10 rounded-3xl">
            Список услуг пуст в исходных переводах.
          </div>
        ) : (
          <div className="space-y-8">
            {servicesList.map((service: any, sIdx: number) => (
              <div key={service.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-light text-[#0000FF]">{service.id}</span>
                  <input
                    type="text"
                    value={service.title || ""}
                    onChange={(e) => handleServiceFieldChange(sIdx, "title", e.target.value)}
                    disabled={isReadOnly}
                    className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-base font-semibold"
                    placeholder="Название услуги"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Описание услуги</label>
                  <textarea
                    value={service.desc || ""}
                    onChange={(e) => handleServiceFieldChange(sIdx, "desc", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none h-20 text-sm"
                    placeholder="Краткое описание того, что включает в себя услуга"
                  />
                </div>

                {/* Steps/Stages list */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Этапы работы</label>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleAddStep(sIdx)}
                        className="text-xs text-[#0066FF] hover:underline flex items-center gap-1"
                      >
                        + Добавить этап
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {(service.steps || []).map((step: string, stIdx: number) => (
                      <div key={stIdx} className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-white/30 font-mono">0{stIdx + 1}</span>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => handleStepChange(sIdx, stIdx, e.target.value)}
                          disabled={isReadOnly}
                          className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-white focus:border-[#0066FF] outline-none text-sm"
                          placeholder="Название этапа (например, Исследование рынка)"
                        />
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleDeleteStep(sIdx, stIdx)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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
