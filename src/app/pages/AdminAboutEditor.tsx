import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cmsService } from "../cmsService";
import { supabaseClient } from "../supabaseClient";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { Save, Check, Globe, Users, Trash2, Camera, Loader2 } from "lucide-react";

export function AdminAboutEditor() {
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [success, setSuccess] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [translating, setTranslating] = useState(false);

  const handleFieldChange = (key: string, value: string) => {
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.about) updated.ru.about = {};
    updated.ru.about[key] = value;
    setTranslations(updated);
  };

  const handleTeamMemberChange = (index: number, key: string, value: any) => {
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.about) updated.ru.about = {};
    if (!updated.ru.about.team) updated.ru.about.team = [];
    
    const team = [...updated.ru.about.team];
    team[index] = { ...team[index], [key]: value };
    updated.ru.about.team = team;
    setTranslations(updated);
  };

  const handleAddTeamMember = () => {
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.about) updated.ru.about = {};
    if (!updated.ru.about.team) updated.ru.about.team = [];
    
    const newMember = {
      id: Date.now(),
      name: "",
      role: "",
      quote: "",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      skills: [],
      projects: ""
    };
    
    updated.ru.about.team = [...updated.ru.about.team, newMember];
    setTranslations(updated);
  };

  const handleDeleteTeamMember = (index: number) => {
    const updated = { ...translations };
    if (!updated.ru || !updated.ru.about || !updated.ru.about.team) return;
    
    const team = [...updated.ru.about.team];
    team.splice(index, 1);
    updated.ru.about.team = team;
    setTranslations(updated);
  };

  const handleUploadPhoto = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `member-${Date.now()}.${fileExt}`;
      const path = `team/${fileName}`;
      
      const publicUrl = await supabaseClient.uploadFile("assets", path, file);
      handleTeamMemberChange(index, "img", publicUrl);
    } catch (e: any) {
      alert("Ошибка при загрузке фотографии: " + e.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  // Timeline Helper Methods
  const handleTimelineChange = (index: number, key: string, value: any) => {
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.about) updated.ru.about = {};
    if (!updated.ru.about.timeline) updated.ru.about.timeline = [];
    
    const timeline = [...updated.ru.about.timeline];
    timeline[index] = { ...timeline[index], [key]: value };
    updated.ru.about.timeline = timeline;
    setTranslations(updated);
  };

  const handleAddTimelineStep = () => {
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.about) updated.ru.about = {};
    if (!updated.ru.about.timeline) updated.ru.about.timeline = [];
    
    const newStep = {
      year: "",
      title: "",
      text: "",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
    };
    
    updated.ru.about.timeline = [...updated.ru.about.timeline, newStep];
    setTranslations(updated);
  };

  const handleDeleteTimelineStep = (index: number) => {
    const updated = { ...translations };
    if (!updated.ru || !updated.ru.about || !updated.ru.about.timeline) return;
    
    const timeline = [...updated.ru.about.timeline];
    timeline.splice(index, 1);
    updated.ru.about.timeline = timeline;
    setTranslations(updated);
  };

  const handleUploadTimelinePhoto = async (index: number, file: File) => {
    try {
      setUploadingIndex(1000 + index);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `timeline-${Date.now()}.${fileExt}`;
      const path = `about/${fileName}`;
      
      const publicUrl = await supabaseClient.uploadFile("assets", path, file);
      handleTimelineChange(index, "img", publicUrl);
    } catch (e: any) {
      alert("Ошибка при загрузке фотографии: " + e.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  // Manifesto Pillars Helper Methods
  const handleValueChange = (index: number, key: string, value: any) => {
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.about) updated.ru.about = {};
    if (!updated.ru.about.valuesList) updated.ru.about.valuesList = [];
    
    const valuesList = [...updated.ru.about.valuesList];
    valuesList[index] = { ...valuesList[index], [key]: value };
    updated.ru.about.valuesList = valuesList;
    setTranslations(updated);
  };

  const handleAddValue = () => {
    const updated = { ...translations };
    if (!updated.ru) updated.ru = {};
    if (!updated.ru.about) updated.ru.about = {};
    if (!updated.ru.about.valuesList) updated.ru.about.valuesList = [];
    
    const newValue = {
      num: `0${(updated.ru.about.valuesList.length + 1)}`,
      title: "",
      desc: ""
    };
    
    updated.ru.about.valuesList = [...updated.ru.about.valuesList, newValue];
    setTranslations(updated);
  };

  const handleDeleteValue = (index: number) => {
    const updated = { ...translations };
    if (!updated.ru || !updated.ru.about || !updated.ru.about.valuesList) return;
    
    const valuesList = [...updated.ru.about.valuesList];
    valuesList.splice(index, 1);
    updated.ru.about.valuesList = valuesList;
    setTranslations(updated);
  };

  const saveChanges = async () => {
    try {
      setTranslating(true);
      const updated = { ...translations };
      const targetLangs = ["en", "kg"] as const;
      
      for (const lang of targetLangs) {
        if (!updated[lang]) updated[lang] = {};
        if (updated.ru.about) {
          if (!updated[lang].about) updated[lang].about = {};
          
          updated[lang].about.manifestoHeading = await translateText(updated.ru.about.manifestoHeading || "", lang);
          updated[lang].about.manifestoText = await translateText(updated.ru.about.manifestoText || "", lang);
          updated[lang].about.philosophyText = await translateText(updated.ru.about.philosophyText || "", lang);
          
          // Translate timeline
          if (updated.ru.about.timeline) {
            const translatedTimeline = [];
            for (const step of updated.ru.about.timeline) {
              translatedTimeline.push({
                year: step.year || "",
                img: step.img || "",
                title: await translateText(step.title || "", lang),
                text: await translateText(step.text || "", lang),
              });
            }
            updated[lang].about.timeline = translatedTimeline;
          }

          // Translate valuesList
          if (updated.ru.about.valuesList) {
            const translatedValues = [];
            for (const val of updated.ru.about.valuesList) {
              translatedValues.push({
                num: val.num || "",
                title: await translateText(val.title || "", lang),
                desc: await translateText(val.desc || "", lang),
              });
            }
            updated[lang].about.valuesList = translatedValues;
          }

          // Translate departments
          if (updated.ru.about.departments) {
            const translatedDepts = [];
            for (const dept of updated.ru.about.departments) {
              translatedDepts.push({
                id: dept.id || "",
                num: dept.num || "",
                title: await translateText(dept.title || "", lang),
              });
            }
            updated[lang].about.departments = translatedDepts;
          }

          if (updated.ru.about.team) {
            const translatedTeam = [];
            for (const member of updated.ru.about.team) {
              translatedTeam.push({
                id: member.id,
                img: member.img,
                skills: member.skills || [],
                projects: member.projects || "",
                departmentId: member.departmentId || "",
                name: await translateText(member.name || "", lang),
                role: await translateText(member.role || "", lang),
                quote: await translateText(member.quote || "", lang),
              });
            }
            updated[lang].about.team = translatedTeam;
          }
        }
      }
      
      setTranslations(updated);
      await cmsService.updateTranslations(updated);

      // Log action
      await logAdminAction(
        "О нас",
        "Сохранение изменений",
        `Обновлен манифест, философия, команда (${updated.ru.about?.team?.length || 0} человек), история (${updated.ru.about?.timeline?.length || 0} событий) и ценности (${updated.ru.about?.valuesList?.length || 0} пунктов)`
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
    <div className="space-y-8 max-w-[1720px] mx-auto font-['Inter',sans-serif]">
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
          <Globe className="w-5 h-5" />
          Манифест и Описание студии (RU)
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">Заголовок манифеста</label>
          <input
            type="text"
            value={currentData.about?.manifestoHeading || ""}
            onChange={(e) => handleFieldChange("manifestoHeading", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">Текст манифеста</label>
          <textarea
            value={currentData.about?.manifestoText || ""}
            onChange={(e) => handleFieldChange("manifestoText", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-36 text-base leading-relaxed transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/50">Наша Философия</label>
          <textarea
            value={currentData.about?.philosophyText || ""}
            onChange={(e) => handleFieldChange("philosophyText", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none h-36 text-base leading-relaxed transition-all"
          />
        </div>

        <div className="h-px bg-white/[0.06] my-8" />

        {/* Блок 1: Наша история / Хронология */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold tracking-tight text-[#0066FF] flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Блок 1: Наша история / Хронология (RU)
          </h3>
          <button
            type="button"
            onClick={handleAddTimelineStep}
            className="px-4 py-2 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            + Добавить событие
          </button>
        </div>

        {(!currentData.about?.timeline || currentData.about.timeline.length === 0) ? (
          <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl mb-8">
            Список событий хронологии пуст. Добавьте первое событие.
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            {currentData.about.timeline.map((step: any, idx: number) => (
              <div key={idx} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative space-y-4">
                <button
                  type="button"
                  onClick={() => handleDeleteTimelineStep(idx)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-all active:scale-95"
                  title="Удалить событие"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="grid md:grid-cols-[150px_1fr] gap-6">
                  <div className="space-y-3">
                    <label className="relative w-full aspect-[4/3] bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/20 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadTimelinePhoto(idx, file);
                        }}
                        className="hidden"
                        disabled={uploadingIndex !== null}
                      />
                      
                      {uploadingIndex === (1000 + idx) ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-[#0066FF] animate-spin" />
                          <span className="text-[10px] text-white/50">Загрузка...</span>
                        </div>
                      ) : step.img ? (
                        <>
                          <img src={step.img} alt={step.title} className="w-full h-full object-cover transition duration-300 group-hover:brightness-50" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <Camera className="w-6 h-6 text-white mb-1" />
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Заменить фото</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/30 group-hover:text-white/60">
                          <Camera className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Загрузить</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Годы / Период</label>
                      <input
                        type="text"
                        value={step.year || ""}
                        onChange={(e) => handleTimelineChange(idx, "year", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                        placeholder="2011"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Заголовок события</label>
                      <input
                        type="text"
                        value={step.title || ""}
                        onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                        placeholder="Основание"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Описание события</label>
                      <textarea
                        value={step.text || ""}
                        onChange={(e) => handleTimelineChange(idx, "text", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none h-24 text-sm leading-relaxed"
                        placeholder="Описание происходившего в этот период..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-white/[0.06] my-8" />

        {/* Блок 2: Принципы философии / Манифест */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold tracking-tight text-[#0066FF] flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Блок 2: Принципы философии / Манифест (RU)
          </h3>
          <button
            type="button"
            onClick={handleAddValue}
            className="px-4 py-2 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            + Добавить принцип
          </button>
        </div>

        {(!currentData.about?.valuesList || currentData.about.valuesList.length === 0) ? (
          <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl mb-8">
            Список принципов пуст. Добавьте первый принцип.
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            {currentData.about.valuesList.map((val: any, idx: number) => (
              <div key={idx} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative space-y-4">
                <button
                  type="button"
                  onClick={() => handleDeleteValue(idx)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-all active:scale-95"
                  title="Удалить принцип"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Номер</label>
                    <input
                      type="text"
                      value={val.num || ""}
                      onChange={(e) => handleValueChange(idx, "num", e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                      placeholder="01"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Заголовок принципа</label>
                    <input
                      type="text"
                      value={val.title || ""}
                      onChange={(e) => handleValueChange(idx, "title", e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                      placeholder="Первое восприятие"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Описание принципа</label>
                    <textarea
                      value={val.desc || ""}
                      onChange={(e) => handleValueChange(idx, "desc", e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none h-24 text-sm leading-relaxed"
                      placeholder="Как именно этот принцип применяется в работе..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-white/[0.06] my-8" />

        {/* Блок 3: Отделы компании */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold tracking-tight text-[#0066FF] flex items-center gap-2">
              <Users className="w-5 h-5" />
              Блок 3: Отделы компании (RU)
            </h3>
            <button
              type="button"
              onClick={() => {
                const updated = { ...translations };
                if (!updated.ru) updated.ru = {};
                if (!updated.ru.about) updated.ru.about = {};
                if (!updated.ru.about.departments) {
                  updated.ru.about.departments = [
                    { id: "leadership", title: "Руководство", num: "01" },
                    { id: "design", title: "Графический дизайн", num: "02" },
                    { id: "development", title: "Разработка", num: "03" },
                    { id: "motion", title: "Visual Art и Моушн-дизайн", num: "04" },
                    { id: "operations", title: "Операции", num: "05" },
                    { id: "marketing", title: "Маркетинг", num: "06" }
                  ];
                }
                const newDept = {
                  id: `dept_${Date.now()}`,
                  title: "",
                  num: `0${updated.ru.about.departments.length + 1}`
                };
                updated.ru.about.departments = [...updated.ru.about.departments, newDept];
                setTranslations(updated);
              }}
              className="px-4 py-2 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              + Добавить отдел
            </button>
          </div>

          {(!currentData.about?.departments || currentData.about.departments.length === 0) ? (
            <div className="text-center py-6 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl">
              Отделы не настроены. Будут использованы стандартные (Руководство, Дизайн, Разработка, Моушн, Операции, Маркетинг).
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentData.about.departments.map((dept: any, idx: number) => (
                <div key={dept.id || idx} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 relative space-y-3">
                  {dept.id !== "leadership" && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...translations };
                        const depts = [...(updated.ru.about.departments || [])];
                        depts.splice(idx, 1);
                        updated.ru.about.departments = depts;
                        setTranslations(updated);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all"
                      title="Удалить отдел"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-[60px_1fr] gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/45">№</label>
                      <input
                        type="text"
                        value={dept.num || ""}
                        onChange={(e) => {
                          const updated = { ...translations };
                          updated.ru.about.departments[idx].num = e.target.value;
                          setTranslations(updated);
                        }}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-white outline-none text-xs text-center font-bold"
                        placeholder="01"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-white/45">ID (для кода)</label>
                      <input
                        type="text"
                        value={dept.id || ""}
                        disabled={dept.id === "leadership"}
                        onChange={(e) => {
                          const updated = { ...translations };
                          updated.ru.about.departments[idx].id = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                          setTranslations(updated);
                        }}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-white outline-none text-xs"
                        placeholder="design"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-white/45">Название отдела (RU)</label>
                    <input
                      type="text"
                      value={dept.title || ""}
                      onChange={(e) => {
                        const updated = { ...translations };
                        updated.ru.about.departments[idx].title = e.target.value;
                        setTranslations(updated);
                      }}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 text-white outline-none text-xs"
                      placeholder="Графический дизайн"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-white/[0.06] my-8" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold tracking-tight text-[#0066FF] flex items-center gap-2">
            <Users className="w-5 h-5" />
            Наша команда / Сотрудники (RU)
          </h3>
          <button
            type="button"
            onClick={handleAddTeamMember}
            className="px-4 py-2 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            + Добавить сотрудника
          </button>
        </div>

        {(!currentData.about?.team || currentData.about.team.length === 0) ? (
          <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl">
            Список сотрудников пуст. Добавьте первого сотрудника.
          </div>
        ) : (
          <div className="space-y-6">
            {currentData.about.team.map((member: any, idx: number) => (
              <div key={member.id || idx} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative space-y-4">
                <button
                  type="button"
                  onClick={() => handleDeleteTeamMember(idx)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-all active:scale-95"
                  title="Удалить сотрудника"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="grid md:grid-cols-[150px_1fr] gap-6">
                  <div className="space-y-3">
                    <label className="relative w-full aspect-[3/4] bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/20 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadPhoto(idx, file);
                        }}
                        className="hidden"
                        disabled={uploadingIndex !== null}
                      />
                      
                      {uploadingIndex === idx ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-[#0066FF] animate-spin" />
                          <span className="text-[10px] text-white/50">Загрузка...</span>
                        </div>
                      ) : member.img ? (
                        <>
                          <img src={member.img} alt={member.name} className="w-full h-full object-cover transition duration-300 group-hover:brightness-50" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <Camera className="w-6 h-6 text-white mb-1" />
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Заменить фото</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/30 group-hover:text-white/60">
                          <Camera className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Загрузить</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">ФИО</label>
                      <input
                        type="text"
                        value={member.name || ""}
                        onChange={(e) => handleTeamMemberChange(idx, "name", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                        placeholder="Олег Ермаков"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Должность</label>
                      <input
                        type="text"
                        value={member.role || ""}
                        onChange={(e) => handleTeamMemberChange(idx, "role", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm"
                        placeholder="Арт-директор"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Отдел</label>
                      <select
                        value={member.departmentId || ""}
                        onChange={(e) => handleTeamMemberChange(idx, "departmentId", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none text-sm cursor-pointer"
                      >
                        <option value="" className="bg-neutral-900 text-white/60">-- Выберите отдел --</option>
                        {(currentData.about?.departments || [
                          { id: "leadership", title: "Руководство", num: "01" },
                          { id: "design", title: "Графический дизайн", num: "02" },
                          { id: "development", title: "Разработка", num: "03" },
                          { id: "motion", title: "Visual Art и Моушн-дизайн", num: "04" },
                          { id: "operations", title: "Операции", num: "05" },
                          { id: "marketing", title: "Маркетинг", num: "06" }
                        ]).map((d: any) => (
                          <option key={d.id} value={d.id} className="bg-neutral-900 text-white">
                            {d.num ? `${d.num}. ` : ""}{d.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Описание / Цитата</label>
                      <textarea
                        value={member.quote || ""}
                        onChange={(e) => handleTeamMemberChange(idx, "quote", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-white focus:border-[#0066FF] outline-none h-32 text-sm leading-relaxed"
                        placeholder="Мы убираем всё лишнее, чтобы обнажить суть вещей."
                      />
                    </div>
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
