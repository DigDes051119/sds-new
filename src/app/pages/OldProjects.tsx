import { useContext } from "react";
import { ArchiveOriginsSection } from "../components/ArchiveOriginsSection";
import { LanguageContext } from "../i18n";
import { ProjectsNav } from "../components/ProjectsNav";

export function OldProjects() {
  const { locale } = useContext(LanguageContext);

  const title = locale === "ru" 
    ? "Откуда мы начинали (2005 — 2020)" 
    : locale === "kg" 
      ? "Биз кайдан баштаганбыз (2005 — 2020)" 
      : "Where we started (2005 — 2020)";

  const subtitle = locale === "ru"
    ? "Полный архив концептуальных, брендинговых и промышленных работ Steel Drake Studio со дня основания компании."
    : locale === "kg"
      ? "Компания негизделген күндөн берки Steel Drake Studio'нун концептуалдык, брендингдик жана өнөр жай иштеринин толук архиви."
      : "Complete archive of conceptual, branding, and industrial design projects by Steel Drake Studio since day one.";

  return (
    <div className="w-full min-h-screen py-5 font-twk-everett">
      {/* Top Header */}
      <section className="pb-4 mb-[40px] w-auto">
        <div className="flex justify-between items-baseline gap-4 mb-4">
          <h1 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {title}
          </h1>
          <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase shrink-0">
            [07/ORIGINS ARCHIVE]
          </span>
        </div>
        <p className="text-[#808080] text-[16px] leading-[1.44] m-0 font-normal max-w-[650px]">
          {subtitle}
        </p>
      </section>

      {/* Premium Sorting Sub-navigation */}
      <ProjectsNav />

      {/* Render Full ArchiveOriginsSection without secondary header or duplicate padding */}
      <ArchiveOriginsSection limit={undefined} showTitle={false} noPadding={true} />
    </div>
  );
}
