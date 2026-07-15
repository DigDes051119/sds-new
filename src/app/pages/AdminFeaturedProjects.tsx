import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cmsService } from "../cmsService";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { Save, Check, Globe, Trash2, Loader2, Star } from "lucide-react";

export function AdminFeaturedProjects() {
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);

  // Get user role
  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isReadOnly = currentAdmin.role === "limited";

  const handleAddFeaturedProject = (projectId: string) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.home) updated.ru.home = {};
    if (!updated.ru.home.projects) updated.ru.home.projects = [];

    if (updated.ru.home.projects.length >= 6) {
      alert("Максимальное количество избранных проектов - 6 штук.");
      return;
    }

    const allProjects = updated.ru.projects?.items || [];
    const projectToAdd = allProjects.find((p: any) => p.id === projectId);
    if (!projectToAdd) return;

    updated.ru.home.projects = [
      ...updated.ru.home.projects,
      {
        id: projectToAdd.id,
        title: projectToAdd.name,
        tag: projectToAdd.category,
        image: projectToAdd.img
      }
    ];

    setTranslations(updated);
  };

  const handleRemoveFeaturedProject = (index: number) => {
    if (isReadOnly) return;
    const updated = { ...translations };
    if (!updated.ru || !updated.ru.home || !updated.ru.home.projects) return;

    const featured = [...updated.ru.home.projects];
    featured.splice(index, 1);
    updated.ru.home.projects = featured;

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
        if (updated.ru.home) {
          if (!updated[lang].home) updated[lang].home = { ...updated.ru.home };
          
          if (updated.ru.home.projects) {
            const featuredList: any[] = [];
            for (const fp of updated.ru.home.projects) {
              const matchedProj = updated[lang].projects?.items?.find((p: any) => p.id === fp.id);
              featuredList.push({
                id: fp.id,
                title: matchedProj ? matchedProj.name : await translateText(fp.title, lang),
                tag: matchedProj ? matchedProj.category : await translateText(fp.tag, lang),
                image: fp.image || fp.img
              });
            }
            updated[lang].home.projects = featuredList;
          }
        }
      }
      
      setTranslations(updated);
      await cmsService.updateTranslations(updated);

      // Log action
      await logAdminAction(
        "Избранные проекты",
        "Сохранение списка",
        `Сохранен список избранных проектов (${updated.ru.home?.projects?.length || 0} шт.): ` + 
        (updated.ru.home?.projects || []).map((p: any) => p.id).join(", ")
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
  const featuredProjects = currentData.home?.projects || [];
  const allProjects = currentData.projects?.items || [];
  const availableProjects = allProjects.filter((p: any) => 
    !featuredProjects.some((fp: any) => fp.id === p.id)
  );

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

      {/* Main Container */}
      <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#0066FF] flex items-center gap-2">
              <Star className="w-5 h-5" />
              Избранные проекты на Главной (макс. 6)
            </h3>
            <p className="text-xs text-white/40 mt-1">Отображаются в самом последнем блоке на главной странице.</p>
          </div>
          <span className="text-xs font-mono font-bold bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06]">
            {featuredProjects.length} / 6
          </span>
        </div>

        {isReadOnly && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-xl">
            У вас роль с укороченным доступом. Вы можете просматривать избранные проекты, но изменять их список нельзя.
          </div>
        )}

        {featuredProjects.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm border border-dashed border-white/10 rounded-3xl">
            Список избранных проектов пуст.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project: any, idx: number) => (
              <div
                key={project.id || idx}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between relative group"
              >
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeaturedProject(idx)}
                    className="absolute top-3 right-3 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-all active:scale-95 z-10"
                    title="Убрать из избранных"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-3 relative">
                    <img src={project.image || project.img} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#0066FF] uppercase tracking-wider font-semibold">{project.tag}</span>
                    <h4 className="text-base font-bold text-white/90 truncate">{project.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isReadOnly && (
          <>
            {featuredProjects.length < 6 ? (
              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 block">
                  Добавить проект в избранные (Доступно мест: {6 - featuredProjects.length})
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddFeaturedProject(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                  defaultValue=""
                >
                  <option value="" className="bg-[#080810] text-white/40">-- Выберите проект из списка --</option>
                  {availableProjects.map((p: any) => (
                    <option key={p.id} value={p.id} className="bg-[#080810] text-white">
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-xs text-white/30 text-center py-4 border-t border-white/[0.06]">
                Достигнут лимит в 6 избранных проектов. Чтобы добавить новый, удалите какой-то из текущих.
              </div>
            )}
          </>
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
