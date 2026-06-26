import { useState, useEffect } from "react";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingBlocks, setUploadingBlocks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    return cmsService.subscribe(() => {
      setTranslations(cmsService.getTranslations());
      setProjectDetails(cmsService.getProjectDetails());
    });
  }, []);

  // Check current admin permissions
  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isReadOnly = currentAdmin.permissions?.projects === false;

  const handleUploadPhoto = async (target: "img" | { blockIdx: number; imgIdx: number }, file: File) => {
    if (isReadOnly) return;
    const isHero = target === "img";
    const key = isHero ? "img" : `${target.blockIdx}-${target.imgIdx}`;
    try {
      if (isHero) setUploadingImg(true);
      else setUploadingBlocks(prev => ({ ...prev, [key]: true }));

      const fileExt = file.name.split('.').pop();
      const fileName = `project-${isHero ? "hero" : `block-${target.blockIdx}-${target.imgIdx}`}-${Date.now()}.${fileExt}`;
      const path = `projects/${fileName}`;

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
  
  // Collage Blocks (array of arrays of image URLs)
  const [formCollageBlocks, setFormCollageBlocks] = useState<string[][]>([]);

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
    setFormCollageBlocks([
      [
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600"
      ]
    ]);
    setFormResult1Ru("");
    setFormResult1En("");
    setFormResult1Kg("");
    setFormResult2Ru("");
    setFormResult2En("");
    setFormResult2Kg("");
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

    const initialBlocks = detailRu.collageBlocks && detailRu.collageBlocks.length > 0
      ? JSON.parse(JSON.stringify(detailRu.collageBlocks))
      : (detailRu.processImages && detailRu.processImages.length > 0 ? [JSON.parse(JSON.stringify(detailRu.processImages))] : [[]]);
    setFormCollageBlocks(initialBlocks);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

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

      // Deep clone translations and project details
      const newTranslations = JSON.parse(JSON.stringify(translations));
      const newDetails = JSON.parse(JSON.stringify(projectDetails));

      // Formulate the project list entries
      const listEntryRu = { id: formId, name: formNameRu, category: formCategoryRu, categoryKey: formCategoryKey, img: formImg };
      const listEntryEn = { id: formId, name: nameEn, category: categoryEn, categoryKey: formCategoryKey, img: formImg };
      const listEntryKg = { id: formId, name: nameKg, category: categoryKg, categoryKey: formCategoryKey, img: formImg };

      // Formulate project details entries
      const cleanBlocks = formCollageBlocks.map(block => block.filter(Boolean)).filter(block => block.length > 0);
      const flattenedImages = cleanBlocks.flat();

      const detailEntryRu = {
        name: formNameRu,
        desc: formDescRu,
        client: formClientRu,
        year: formYear,
        service: formServiceRu,
        challenge: formChallengeRu,
        processImages: flattenedImages,
        collageBlocks: cleanBlocks,
        results: [formResult1Ru, formResult2Ru].filter(Boolean)
      };

      const detailEntryEn = {
        name: nameEn,
        desc: descEn,
        client: clientEn,
        year: formYear,
        service: serviceEn,
        challenge: challengeEn,
        processImages: flattenedImages,
        collageBlocks: cleanBlocks,
        results: [result1En, result2En].filter(Boolean)
      };

      const detailEntryKg = {
        name: nameKg,
        desc: descKg,
        client: clientKg,
        year: formYear,
        service: serviceKg,
        challenge: challengeKg,
        processImages: flattenedImages,
        collageBlocks: cleanBlocks,
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

      setSuccessMessage(editingId ? "Проект успешно обновлен!" : "Проект успешно создан!");
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
    if (confirm("Вы действительно хотите удалить проект?")) {
      try {
        // Deep clone translations and project details
        const newTranslations = JSON.parse(JSON.stringify(translations));
        const newDetails = JSON.parse(JSON.stringify(projectDetails));

        // Remove from projects list and featured projects list
        ["ru", "en", "kg"].forEach((lang) => {
          if (newTranslations[lang]?.projects?.items) {
            newTranslations[lang].projects.items = newTranslations[lang].projects.items.filter((p: any) => p.id !== id);
          }
          if (newTranslations[lang]?.home?.projects) {
            newTranslations[lang].home.projects = newTranslations[lang].home.projects.filter((p: any) => p.id !== id);
          }
        });

        delete newDetails.ru[id];
        delete newDetails.en[id];
        delete newDetails.kg[id];

        // Save changes to database
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

        setSuccessMessage("Проект успешно удален!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        alert("Ошибка при удалении проекта: " + (err.message || err));
      }
    }
  };

  const projectsList = translations.ru.projects.items;

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {isReadOnly && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-xl">
          Доступ ограничен. У вас нет прав на редактирование проектов.
        </div>
      )}

      {/* Action Header */}
      {!editingId && !isAdding && (
        <div className="flex justify-between items-center">
          <p className="text-white/60 text-sm">Список текущих проектов на сайте</p>
          {!isReadOnly && (
            <button
              onClick={startAdding}
              className="px-5 py-3 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-sm flex items-center gap-2 transition shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Добавить проект
            </button>
          )}
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
              {!isReadOnly && (
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
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Form & Preview Layout */}
      {(editingId || isAdding) && (
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          
          {/* Left Column: Form */}
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

            <div className="grid md:grid-cols-2 gap-6">
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
            </div>

            {/* Details (Description, client, service) */}
            <div className="space-y-6">
              <h4 className="text-md font-bold text-white/80">Детальное описание (Подробная страница)</h4>
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
          </motion.form>

          {/* Right Column: Live Interactive Mockup Preview */}
          <div className="sticky top-6 space-y-4 max-h-[85vh] overflow-y-auto border border-white/[0.08] rounded-3xl p-6 bg-[#161622] shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">Интерактивный макет (Зажмите для сортировки / Клик для замены)</h4>
              <span className="text-[10px] bg-[#0000FF]/15 text-[#0066FF] border border-[#0000FF]/25 font-bold uppercase px-2 py-0.5 rounded">В реальном времени</span>
            </div>

            {/* Scale/Mockup container with project detail theme */}
            <div className="rounded-3xl overflow-hidden bg-[#fafaf6] text-black border border-black/5 shadow-2xl font-['Inter',sans-serif] text-xs pb-16">
              
              {/* Mock Hero Section */}
              <div 
                onClick={() => document.getElementById("file-input-img")?.click()}
                className="relative aspect-[1.7] w-full bg-black cursor-pointer group overflow-hidden flex flex-col justify-end p-6 md:p-8 text-white select-none"
                title="Нажмите, чтобы сменить главное превью"
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
                  <img src={formImg} alt="Hero mockup" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-102 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20"><Camera className="w-8 h-8" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                {/* Camera Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-1 bg-black/60 px-3 py-2 rounded-xl border border-white/10">
                    <Camera className="w-4 h-4 text-white animate-pulse" />
                    <span className="text-[8px] font-bold uppercase text-white/80">Сменить превью</span>
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="text-[8px] opacity-60 font-semibold uppercase tracking-wider flex items-center gap-1">
                    ← Все проекты
                  </span>
                  <h1 className="text-xl md:text-3xl font-bold tracking-tighter leading-none mb-1">{formNameRu || "Название проекта"}</h1>
                  
                  <div className="flex gap-4 text-[7px] uppercase tracking-widest opacity-80 pt-1 border-t border-white/10 mt-1 max-w-sm">
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

              {/* Mock Challenge Section (Splitted Editorial layout matching site) */}
              <div className="max-w-[1720px] mx-auto px-6 py-12 border-b border-black/[0.06] bg-[#fafaf6]">
                <div className="grid grid-cols-[1fr_1.8fr] gap-6 items-start">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-md font-bold tracking-tight text-black">Задача и Вызов</h2>
                    <div className="h-[1.5px] w-8 bg-[#0000FF]" />
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[11px] font-medium leading-relaxed text-black/85">{formChallengeRu || "Описание задачи и вызова..."}</p>
                    <p className="text-[10px] text-black/60 leading-normal font-light">{formDescRu || "Краткое описание проекта..."}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/[0.06]">
                      <div>
                        <h4 className="text-[8px] font-semibold uppercase tracking-wider text-black/40 mb-1">01 / Scope</h4>
                        <p className="text-[9px] text-black/70">{formServiceRu || "..."}</p>
                      </div>
                      <div>
                        <h4 className="text-[8px] font-semibold uppercase tracking-wider text-black/40 mb-1">02 / Focus</h4>
                        <p className="text-[9px] text-black/70">Удовлетворение потребностей рынка и новый пользовательский опыт.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Collage Gallery Section (Vertically Stacked with layout-drag support) */}
              <div className="px-6 py-10 bg-[#fafaf6] space-y-10 select-none">
                {formCollageBlocks.map((block, blockIdx) => {
                  if (!block) return null;
                  const isAlternating = blockIdx % 2 === 1;
                  
                  const hasAddSlot = block.length < 5;
                  const totalGridElements = block.length + (hasAddSlot ? 1 : 0);
                  if (totalGridElements === 0) return null;

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
                    <motion.div 
                      key={blockIdx}
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
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 1.02, zIndex: 10, boxShadow: "0 15px 30px rgba(0,0,0,0.06)", cursor: "grabbing" }}
                      className="w-full p-2.5 border border-dashed border-transparent hover:border-[#0000FF]/15 rounded-[1.8rem] transition-colors cursor-grab relative group/block"
                      title="Зажмите и тащите вверх/вниз для сортировки блоков"
                    >
                      {/* Block Controls Tag & Delete Button */}
                      <div className="absolute top-1 right-4 flex items-center gap-2 opacity-0 group-hover/block:opacity-100 transition-opacity z-20 select-none">
                        <span className="text-[7px] text-black/40 font-bold uppercase pointer-events-none">
                          Блок {blockIdx + 1} • Тяните ↑↓
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Удалить этот блок коллажа?")) {
                              setFormCollageBlocks(prev => prev.filter((_, idx) => idx !== blockIdx));
                            }
                          }}
                          className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition-colors cursor-pointer"
                          title="Удалить блок"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className={`grid gap-3 ${getGridColsClass(totalGridElements)}`}>
                        {block.map((imgUrl, imgIdx) => (
                          <motion.div
                            key={imgIdx}
                            layout
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.4}
                            onDragEnd={(e, info) => {
                              if (info.offset.x > 35) {
                                movePhotoRight(blockIdx, imgIdx);
                              } else if (info.offset.x < -35) {
                                movePhotoLeft(blockIdx, imgIdx);
                              }
                            }}
                            onTap={() => {
                              document.getElementById(`file-input-${blockIdx}-${imgIdx}`)?.click();
                            }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 1.06, zIndex: 50, boxShadow: "0 10px 25px rgba(0,0,0,0.12)", cursor: "grabbing" }}
                            className="relative rounded-[1.2rem] overflow-hidden bg-black/10 cursor-grab border border-black/5 shadow-[0_5px_15px_rgba(0,0,0,0.02)] group/photo select-none"
                            title="Зажмите и тащите влево/вправо для сортировки фото • Нажмите для выбора файла"
                          >
                            <div className={`w-full ${getImageAspectClass(totalGridElements)}`}>
                              {imgUrl ? (
                                <img src={imgUrl} alt="Mockup Process" className="w-full h-full object-cover pointer-events-none" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-black/30 bg-black/5">
                                  <Camera className="w-3.5 h-3.5" />
                                  <span className="text-[5px] uppercase font-bold">Выбрать фото</span>
                                </div>
                              )}
                            </div>

                            {/* Photo controls overlay */}
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
                                  title="Удалить фото"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </>
                            )}
                          </motion.div>
                        ))}

                         {/* Add Photo slot directly inside the block grid */}
                        {hasAddSlot && (
                          <div
                            onClick={() => {
                              document.getElementById(`add-photo-input-${blockIdx}`)?.click();
                            }}
                            className={`rounded-[1.2rem] border border-dashed border-black/15 hover:border-[#0000FF]/50 hover:bg-[#0000FF]/5 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${getImageAspectClass(totalGridElements)}`}
                            title="Добавить фото в этот блок"
                          >
                            <input
                              id={`add-photo-input-${blockIdx}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const key = `${blockIdx}-add`;
                                try {
                                  setUploadingBlocks(prev => ({ ...prev, [key]: true }));
                                  const fileExt = file.name.split('.').pop();
                                  const nextIdx = block.length;
                                  const path = `projects/project-block-${blockIdx}-${nextIdx}-${Date.now()}.${fileExt}`;
                                  const publicUrl = await supabaseClient.uploadFile("assets", path, file);
                                  
                                  setFormCollageBlocks(prev => {
                                    return prev.map((b, bIdx) => {
                                      if (bIdx === blockIdx) return [...b, publicUrl];
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
                      </div>
                    </motion.div>
                  );
                })}

                {/* Add Block Slot inside Mockup */}
                <button
                  type="button"
                  onClick={() => setFormCollageBlocks(prev => [...prev, [""]])}
                  className="w-full py-3.5 bg-[#0000FF]/5 hover:bg-[#0000FF]/10 border border-dashed border-[#0000FF]/20 hover:border-[#0000FF]/40 text-[#0000FF] font-bold rounded-[1.8rem] text-[9px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" /> Добавить блок коллажа
                </button>
              </div>

              {/* Mock Results Showcase */}
              <div className="px-6 py-12 bg-[#fafaf6]">
                <div className="w-full">
                  
                  {/* Results Panel */}
                  <div className="bg-white border border-black/[0.04] rounded-[1.8rem] p-6 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.01)] w-full">
                    <div>
                      <h2 className="text-sm font-bold tracking-tight mb-6">Результаты</h2>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="border-t border-black/[0.06] pt-3">
                          <span className="text-2xl font-bold text-[#0000FF] block tracking-tight">
                            {formResult1Ru ? formResult1Ru.match(/(\d+%\s*(?:увеличение|снижение)?|\d+\s*х|\d+\s*\+|\b\d+\b)/i)?.[0] || "✓" : "✓"}
                          </span>
                          <span className="text-[9px] text-black/55 block leading-tight mt-1 truncate">{formResult1Ru || "Показатель 1"}</span>
                        </div>
                        <div className="border-t border-black/[0.06] pt-3">
                          <span className="text-2xl font-bold text-[#0000FF] block tracking-tight">
                            {formResult2Ru ? formResult2Ru.match(/(\d+%\s*(?:увеличение|снижение)?|\d+\s*х|\d+\s*\+|\b\d+\b)/i)?.[0] || "✓" : "✓"}
                          </span>
                          <span className="text-[9px] text-black/55 block leading-tight mt-1 truncate">{formResult2Ru || "Показатель 2"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-black/[0.06] flex items-center gap-2 text-black/70">
                      <div className="w-5 h-5 rounded-full bg-[#0000FF]/10 flex items-center justify-center text-[#0000FF]">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] font-medium tracking-tight">
                        Проект полностью завершен и передан клиенту
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Success banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-emerald-500 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-emerald-400"
          >
            <Check className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
