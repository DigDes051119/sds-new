import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";
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

  const localizedDetails = projectDetails[locale] || projectDetails["ru"] || {};

  const projects = t.projects.items
    .map((project) => {
      const detail = localizedDetails[project.id] || {};
      return {
        ...project,
        img: project.id === "maminy-retsepty" ? coverMoms
          : project.id === "tooko" ? coverTooko
          : (project.img && (project.img.startsWith("http") || project.img.startsWith("data:") || project.img.startsWith("/")))
            ? project.img
            : (project.id === "sandyq" ? projectImg1 : project.id === "ala-too" ? projectImg2 : project.img),
        tags: detail.service || project.category || "Design",
        year: detail.year || "2026",
        desc: detail.desc || project.desc || ""
      };
    })
    .sort((a: any, b: any) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title Block */}
      <section className="border-b border-[#808080] pb-4 mb-[100px] w-auto">
        <h1 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
          {t.projects.title}
        </h1>
        <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase mt-2 block">
          [PORTFOLIO/INDEX]
        </span>
      </section>

      {/* Projects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
        {projects.map((project, index) => (
          <div key={project.id} className="w-full flex flex-col"
            style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
            <Link to={`/projects/${project.id}`} className="group flex flex-col flex-1">
              
              {/* Image band container */}
              <div className="w-full bg-[#191919] overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                <ImageWithFallback 
                  src={project.img} 
                  alt={project.name} 
                  className="w-full h-full object-cover transition duration-500 group-hover:brightness-75"
                  loading="lazy"
                />
              </div>

              {/* Meta information */}
              <div className="mt-[25px] flex flex-col">
                <div className="flex justify-between items-start w-full">
                  {/* Left block: label + title */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080]">
                      {String(index + 1).padStart(2, '0')} / PROJECT
                    </span>
                    <h3 className="text-[28px] font-bold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                      {project.name}
                    </h3>
                    {project.desc && (
                      <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                        {project.desc}
                      </p>
                    )}
                  </div>
                  {/* Vertical divider */}
                  <div className="w-[1px] bg-[#808080] mx-6 shrink-0 self-stretch"></div>
                  {/* Right block: category + year */}
                  <div className="text-left flex flex-col gap-1 shrink-0">
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
