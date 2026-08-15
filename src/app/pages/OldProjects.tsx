import { useContext } from "react";
import { ArchiveOriginsSection } from "../components/ArchiveOriginsSection";
import { LanguageContext, getLocText } from "../i18n";
import { ProjectsNav } from "../components/ProjectsNav";

export function OldProjects() {
  const { locale } = useContext(LanguageContext);

  const title = getLocText(
    locale,
    "Откуда мы начинали (2005 — 2020)",
    "Where we started (2005 — 2020)",
    "Биз кайдан баштаганбыз (2005 — 2020)",
    "我们的起点 (2005 — 2020)",
    "من أين بدأنا (2005 - 2020)",
    "Wo wir angefangen haben (2005–2020)"
  );

  const subtitle = getLocText(
    locale,
    "Полный архив концептуальных, брендинговых и промышленных работ Steel Drake Studio со дня основания компании.",
    "Complete archive of conceptual, branding, and industrial design projects by Steel Drake Studio since day one.",
    "Компания негизделген күндөн берки Steel Drake Studio'нун концептуалдык, брендингдик жана өнөр жай иштеринин толук архиви.",
    "自公司成立首日起 Steel Drake Studio 的概念、品牌和工业设计项目的完整归档。",
    "الأرشيف الكامل للمشاريع المفاهيمية والعلامات التجارية والتصميم الصناعي لـ Steel Drake Studio منذ اليوم الأول.",
    "Vollständiges Archiv der Konzept-, Branding- und Industriedesignprojekte von Steel Drake Studio seit dem ersten Tag."
  );

  return (
    <div className="w-full min-h-screen py-5 font-twk-everett">
      {/* Top Header */}
      <section className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] w-auto">
        <div className="flex flex-wrap xs:flex-nowrap justify-between items-end gap-2 mb-3 sm:mb-4">
          <h1 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {title}
          </h1>
          <span className="font-mono text-[13px] sm:text-[16px] tracking-[0.04em] text-[#808080] uppercase shrink-0">
            [07/ORIGINS ARCHIVE]
          </span>
        </div>
        <p className="text-[#808080] text-[14px] sm:text-[16px] leading-[1.44] m-0 font-normal max-w-[650px]">
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
