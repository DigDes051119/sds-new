import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import { LanguageContext, getLocText } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";
import { ProjectsNav } from "../components/ProjectsNav";
import { GridSwitcher } from "../components/GridSwitcher";
import { projectDetailsTranslations } from "../projectDetailsData";
import projectImg1 from "../../imports/image_low.webp";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16_low.webp";
import coverTooko from "../../imports/cover_tooko.webp";

import { findInObjectCaseInsensitive, getProjectCardInfo, COVER_MOMS } from "../utils/slugUtils";

export function Projects() {
  const { t, locale } = useContext(LanguageContext);
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());
  const [cols, setCols] = useState(() => localStorage.getItem("sds_grid_layout") || "2");

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProjectDetails(cmsService.getProjectDetails());
    });
  }, []);

  const projects = t.projects.items
    .map((project: any) => {
      const cardInfo = getProjectCardInfo(project.id, locale, project, projectDetails, projectDetailsTranslations);

      return {
        ...project,
        name: cardInfo.title,
        img: (project.img && (project.img.startsWith("http") || project.img.startsWith("data:") || project.img.startsWith("/")))
          ? project.img
          : (project.id === "maminy-retsepty" ? COVER_MOMS
            : project.id === "tooko" ? coverTooko
            : (project.id === "sandyq" ? projectImg1 : project.id === "ala-too" ? projectImg2 : project.img)),
        tags: cardInfo.service,
        year: cardInfo.year,
        desc: cardInfo.desc
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
          <GridSwitcher cols={cols} onChange={(val) => {
            setCols(val);
            localStorage.setItem("sds_grid_layout", val);
          }} />
        </div>
      </section>

      {/* Premium Sorting Sub-navigation */}
      <ProjectsNav />

      {/* Projects Grid */}
      <section className={`grid grid-cols-1 ${cols === "3" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-x-[28px] gap-y-[48px]`}>
        {filteredProjects.map((project: any, index: number) => (
          <div key={project.id} className="w-full flex flex-col">
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
