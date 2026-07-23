import { useContext } from "react";
import { ArchiveOriginsSection } from "../components/ArchiveOriginsSection";
import { LanguageContext } from "../i18n";

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
    <div className="w-full min-h-screen py-12 md:py-16 font-twk-everett">
      {/* Top Header */}
      <div className="flex flex-col gap-3 mb-12">
        <span className="font-mono text-sm text-[#0000FF] uppercase tracking-[0.06em]">
          [07/ORIGINS ARCHIVE]
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black m-0 uppercase">
          {title}
        </h1>
        <p className="text-base md:text-lg text-[#808080] max-w-3xl m-0 leading-relaxed font-normal">
          {subtitle}
        </p>
      </div>

      {/* Render Full ArchiveOriginsSection without secondary header or duplicate padding */}
      <ArchiveOriginsSection limit={undefined} showTitle={false} noPadding={true} />
    </div>
  );
}
