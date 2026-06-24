import { useState } from "react";
import { cmsService } from "../cmsService";
import { Plus, Trash2, Edit2, Check, Save, X, Image, Loader2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { translateText } from "../translateHelper";
import { logAdminAction } from "../adminLogger";
import { supabaseClient } from "../supabaseClient";


export function AdminProjectsEditor() {
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingImage1, setUploadingImage1] = useState(false);
  const [uploadingImage2, setUploadingImage2] = useState(false);

  const handleUploadPhoto = async (target: "img" | "image1" | "image2", file: File) => {
    try {
      if (target === "img") setUploadingImg(true);
      else if (target === "image1") setUploadingImage1(true);
      else if (target === "image2") setUploadingImage2(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `project-${target}-${Date.now()}.${fileExt}`;
      const path = `projects/${fileName}`;

      const publicUrl = await supabaseClient.uploadFile("assets", path, file);
      
      if (target === "img") setFormImg(publicUrl);
      else if (target === "image1") setFormImage1(publicUrl);
      else if (target === "image2") setFormImage2(publicUrl);
    } catch (e: any) {
      alert("Ошибка при загрузке фотографии: " + e.message);
    } finally {
      if (target === "img") setUploadingImg(false);
      else if (target === "image1") setUploadingImage1(false);
      else if (target === "image2") setUploadingImage2(false);
    }
  };

  // Form states for creating/editing a project
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
  
  // Images (array)
  const [formImage1, setFormImage1] = useState("");
  const [formImage2, setFormImage2] = useState("");

  // Results (list of stats)
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
    setFormCategoryKey("branding");
    setFormImg("https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600");
    setFormNameRu("");
    setFormNameEn("");
    setFormNameKg("");
    setFormCategoryRu("Брендинг");
    setFormCategoryEn("Branding");
    setFormCategoryKg("Брендинг");
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
    setFormImage1("https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600");
    setFormImage2("https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600");
    setFormResult1Ru("");
    setFormResult1En("");
    setFormResult1Kg("");
    setFormResult2Ru("");
    setFormResult2En("");
    setFormResult2Kg("");
  };

  const startAdding = () => {
    resetForm();
    setIsAdding(true);
    setEditingId(null);
  };

  const startEditing = (id: string) => {
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

    setFormImage1(detailRu.processImages?.[0] || "");
    setFormImage2(detailRu.processImages?.[1] || "");

    setFormResult1Ru(detailRu.results?.[0] || "");
    setFormResult1En(detailEn.results?.[0] || "");
    setFormResult1Kg(detailKg.results?.[0] || "");

    setFormResult2Ru(detailRu.results?.[1] || "");
    setFormResult2En(detailEn.results?.[1] || "");
    setFormResult2Kg(detailKg.results?.[1] || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const newTranslations = { ...translations };
      const newDetails = { ...projectDetails };

      // Formulate the project list entries
      const listEntryRu = { id: formId, name: formNameRu, category: formCategoryRu, categoryKey: formCategoryKey, img: formImg };
      const listEntryEn = { id: formId, name: nameEn, category: categoryEn, categoryKey: formCategoryKey, img: formImg };
      const listEntryKg = { id: formId, name: nameKg, category: categoryKg, categoryKey: formCategoryKey, img: formImg };

      // Formulate project details entries
      const detailEntryRu = {
        name: formNameRu,
        desc: formDescRu,
        client: formClientRu,
        year: formYear,
        service: formServiceRu,
        challenge: formChallengeRu,
        processImages: [formImage1, formImage2].filter(Boolean),
        results: [formResult1Ru, formResult2Ru].filter(Boolean)
      };

      const detailEntryEn = {
        name: nameEn,
        desc: descEn,
        client: clientEn,
        year: formYear,
        service: serviceEn,
        challenge: challengeEn,
        processImages: [formImage1, formImage2].filter(Boolean),
        results: [result1En, result2En].filter(Boolean)
      };

      const detailEntryKg = {
        name: nameKg,
        desc: descKg,
        client: clientKg,
        year: formYear,
        service: serviceKg,
        challenge: challengeKg,
        processImages: [formImage1, formImage2].filter(Boolean),
        results: [result1Kg, result2Kg].filter(Boolean)
      };

      if (editingId) {
        // Modify existing entries in translations
        ["ru", "en", "kg"].forEach((lang) => {
          const items = newTranslations[lang].projects.items;
          const index = items.findIndex((p: any) => p.id === editingId);
          if (index !== -1) {
            items[index] = lang === "ru" ? listEntryRu : lang === "en" ? listEntryEn : listEntryKg;
          }
        });

        // Modify existing entries in details
        newDetails.ru[editingId] = detailEntryRu;
        newDetails.en[editingId] = detailEntryEn;
        newDetails.kg[editingId] = detailEntryKg;
      } else {
        // Add new entries to translations
        newTranslations.ru.projects.items.push(listEntryRu);
        newTranslations.en.projects.items.push(listEntryEn);
        newTranslations.kg.projects.items.push(listEntryKg);

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

      setSuccess(true);
      setEditingId(null);
      setIsAdding(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Ошибка перевода или сохранения: " + err.message);
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Вы действительно хотите удалить проект?")) {
      const newTranslations = { ...translations };
      const newDetails = { ...projectDetails };

      ["ru", "en", "kg"].forEach((lang) => {
        newTranslations[lang].projects.items = newTranslations[lang].projects.items.filter((p: any) => p.id !== id);
      });

      delete newDetails.ru[id];
      delete newDetails.en[id];
      delete newDetails.kg[id];

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

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const projectsList = translations.ru.projects.items;

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {/* Action Header */}
      {!editingId && !isAdding && (
        <div className="flex justify-between items-center">
          <p className="text-white/60 text-sm">Список текущих проектов на сайте</p>
          <button
            onClick={startAdding}
            className="px-5 py-3 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-sm flex items-center gap-2 transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Добавить проект
          </button>
        </div>
      )}

      {/* Projects Grid List */}
      {!editingId && !isAdding && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsList.map((project: any) => (
            <motion.div
              key={project.id}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between hover:border-white/[0.12] transition duration-300 relative group overflow-hidden"
            >
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-4 relative">
                <img src={project.img} alt={project.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 mb-6">
                <span className="text-xs font-mono text-[#0066FF] tracking-wider font-semibold uppercase">{project.categoryKey}</span>
                <h4 className="text-lg font-bold tracking-tight text-white/95">{project.name}</h4>
                <p className="text-xs text-white/50">{project.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(project.id)}
                  className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Form */}
      {(editingId || isAdding) && (
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

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">ID Проекта (URL латиница)</label>
              <input
                type="text"
                value={formId}
                onChange={(e) => setFormId(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                disabled={!!editingId}
                placeholder="sandyq"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base disabled:opacity-50"
                required
              />
            </div>

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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Название проекта (RU)</label>
              <input
                type="text"
                value={formNameRu}
                onChange={(e) => setFormNameRu(e.target.value)}
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

          {/* Details (Description, client, service) */}
          <div className="space-y-6">
            <h4 className="text-md font-bold text-white/80">Детальное описание (Подробная страница)</h4>

            <div className="grid md:grid-cols-3 gap-6">
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
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Главное превью (Изображение)</label>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <label className="relative aspect-video bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/20 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadPhoto("img", file);
                      }}
                      className="hidden"
                      disabled={uploadingImg}
                    />
                    {uploadingImg ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 text-[#0066FF] animate-spin" />
                      </div>
                    ) : formImg ? (
                      <>
                        <img src={formImg} alt="Preview" className="w-full h-full object-cover transition duration-300 group-hover:brightness-50" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <Camera className="w-5 h-5 text-white/30 group-hover:text-white/60" />
                    )}
                  </label>
                  <input
                    type="text"
                    value={formImg}
                    onChange={(e) => setFormImg(e.target.value)}
                    placeholder="Или вставьте ссылку..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-sm"
                    required
                  />
                </div>
              </div>
            </div>

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
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Изображение этапа 1 (Изображение)</label>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <label className="relative aspect-video bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/20 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadPhoto("image1", file);
                      }}
                      className="hidden"
                      disabled={uploadingImage1}
                    />
                    {uploadingImage1 ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 text-[#0066FF] animate-spin" />
                      </div>
                    ) : formImage1 ? (
                      <>
                        <img src={formImage1} alt="Preview" className="w-full h-full object-cover transition duration-300 group-hover:brightness-50" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <Camera className="w-5 h-5 text-white/30 group-hover:text-white/60" />
                    )}
                  </label>
                  <input
                    type="text"
                    value={formImage1}
                    onChange={(e) => setFormImage1(e.target.value)}
                    placeholder="Или вставьте ссылку..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Изображение этапа 2 (Изображение)</label>
                <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                  <label className="relative aspect-video bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/20 rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadPhoto("image2", file);
                      }}
                      className="hidden"
                      disabled={uploadingImage2}
                    />
                    {uploadingImage2 ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 text-[#0066FF] animate-spin" />
                      </div>
                    ) : formImage2 ? (
                      <>
                        <img src={formImage2} alt="Preview" className="w-full h-full object-cover transition duration-300 group-hover:brightness-50" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <Camera className="w-5 h-5 text-white/30 group-hover:text-white/60" />
                    )}
                  </label>
                  <input
                    type="text"
                    value={formImage2}
                    onChange={(e) => setFormImage2(e.target.value)}
                    placeholder="Или вставьте ссылку..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-sm"
                  />
                </div>
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
          </div>
        </motion.form>
      )}

      {/* Success banner */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-emerald-500 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-emerald-400"
          >
            <Check className="w-5 h-5" />
            Проекты успешно обновлены!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
