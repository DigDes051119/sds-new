import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import { LanguageContext, getLocText } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";
import { ProjectsNav } from "../components/ProjectsNav";
import { projectDetailsTranslations } from "../projectDetailsData";
import projectImg1 from "../../imports/image_low.webp";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16_low.webp";
import coverMoms from "../../imports/cover_moms.webp";
import coverTooko from "../../imports/cover_tooko.webp";

export function Projects() {
  const { t, locale } = useContext(LanguageContext);
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProjectDetails(cmsService.getProjectDetails());
    });
  }, []);

  const projectAliases: Record<string, string[]> = {
    "maminy-retsepty": ["moms-recipes", "mom-s-recipes", "maminy_retsepty", "maminy-retsepty", "mothers-recipes"],
    "one-ordo-resort": ["one-ordo", "one-ordo-resort", "one-ordo-resort-web"],
    "tooko": ["tooko", "tooko-brand"],
    "sandyq": ["sandyq", "sandyk"],
    "ala-too": ["ala-too", "alatoo"],
    "salkyn": ["salkyn"],
    "techstart": ["techstart"],
    "auto-concept-x": ["auto-concept-x", "autoconceptx", "auto-concept"],
    "bishbench": ["bishbench"]
  };

  const findInObj = (obj: any, targetId: string) => {
    if (!obj || !targetId) return null;
    if (obj[targetId]) return obj[targetId];

    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const targetClean = clean(targetId);

    // 1. Direct clean match
    for (const k of Object.keys(obj)) {
      if (clean(k) === targetClean) return obj[k];
    }

    // 2. Alias match
    for (const [canonical, aliases] of Object.entries(projectAliases)) {
      const allKeys = [canonical, ...aliases].map(clean);
      if (allKeys.includes(targetClean)) {
        for (const k of Object.keys(obj)) {
          if (allKeys.includes(clean(k))) return obj[k];
        }
      }
    }

    return null;
  };

  const projects = t.projects.items
    .map((project: any) => {
      const cmsDetail = findInObj(projectDetails[locale], project.id) || findInObj(projectDetails.ru, project.id) || findInObj(projectDetails.en, project.id) || {};
      const fallbackDetail = findInObj(projectDetailsTranslations[locale], project.id) || findInObj(projectDetailsTranslations.ru, project.id) || findInObj(projectDetailsTranslations.en, project.id) || {};
      
      const rawTitle = project.name || project.title || cmsDetail.name || fallbackDetail.name || "";
      const rawDesc = (cmsDetail.desc && cmsDetail.desc.trim()) || (cmsDetail.challenge && cmsDetail.challenge.trim()) || (fallbackDetail.desc && fallbackDetail.desc.trim()) || (fallbackDetail.challenge && fallbackDetail.challenge.trim()) || project.desc || "";
      const rawTag = cmsDetail.service || fallbackDetail.service || project.category || "Design";
      const year = cmsDetail.year || fallbackDetail.year || "2026";

      return {
        ...project,
        name: getLocText(locale, rawTitle, rawTitle),
        img: (project.img && (project.img.startsWith("http") || project.img.startsWith("data:") || project.img.startsWith("/")))
          ? project.img
          : (project.id === "maminy-retsepty" ? coverMoms
            : project.id === "tooko" ? coverTooko
            : (project.id === "sandyq" ? projectImg1 : project.id === "ala-too" ? projectImg2 : project.img)),
        tags: getLocText(locale, rawTag, rawTag),
        year: year,
        desc: getLocText(locale, rawDesc, rawDesc)
      };
    });

  const filteredProjects = projects;

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title Block */}
      <section className="pb-4 mb-[40px] w-auto">
        <div className="flex justify-between items-baseline gap-4">
          <h1 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {t.projects.title}
          </h1>
          <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase shrink-0">
            [PORTFOLIO/INDEX]
          </span>
        </div>
      </section>

      {/* Premium Sorting Sub-navigation */}
      <ProjectsNav />

      {/* Projects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
        {filteredProjects.map((project: any, index: number) => (
          <div key={project.id} className="w-full flex flex-col"
            style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
            <Link to={`/projects/${project.id}`} className="group flex flex-col flex-1">
              
              {/* Image band container */}
              <div className="w-full bg-transparent overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                <ImageWithFallback 
                  src={project.img} 
                  alt={project.name} 
                  className="w-full h-full object-cover scale-[1.02] transition duration-500 group-hover:brightness-75"
                  loading="lazy"
                />
              </div>

              {/* Meta information */}
              <div className="mt-[25px] flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4 md:gap-0">
                  {/* Left block: label + title + description */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <span className="font-mono text-[16px] text-[#808080]">
                      {String(index + 1).padStart(2, '0')} / PROJECT
                    </span>
                    <h3 className="text-[28px] font-semibold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                      {project.name}
                    </h3>
                    {project.desc && (
                      <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                        {project.desc}
                      </p>
                    )}
                  </div>
                  {/* Vertical divider stretching to end of description */}
                  <div className="w-[1px] bg-black/60 mx-6 shrink-0 self-stretch my-0.5"></div>
                  {/* Right block: category + year */}
                  <div className="text-left flex flex-col gap-1 shrink-0 self-start">
                    <span className="text-[16px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">
                      {project.tags}
                    </span>
                    <span className="font-mono text-[16px] tracking-[0.04em] text-black whitespace-nowrap">
                      {project.year}
                    </span>
                  </div>
                </div>
              </div>

            </Link>
          </div>
        ))}
      </section>

    </div>
  );
}
