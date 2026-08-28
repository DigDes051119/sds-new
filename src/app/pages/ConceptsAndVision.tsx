import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import { LanguageContext, getLocText } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";
import { safeLocalStorage } from "../safeStorage";
import { ProjectsNav } from "../components/ProjectsNav";
import { GridSwitcher } from "../components/GridSwitcher";

function renderCommaSplitList(text: any) {
  if (typeof text !== "string" || !text || text === "-") return text || "-";
  if (!text.includes(",")) return text;
  const parts = text.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <span className="flex flex-col gap-0.5 text-right">
      {parts.map((part, idx) => (
        <span key={idx} className="block whitespace-nowrap">
          {part}{idx < parts.length - 1 ? "," : ""}
        </span>
      ))}
    </span>
  );
}

export function ConceptsAndVision() {
  const { t, locale } = useContext(LanguageContext);
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());
  const [cols, setCols] = useState(() => safeLocalStorage.getItem("sds_grid_layout") || "2");

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProductDetails(cmsService.getProductDetails());
    });
  }, []);

  const localizedDetails = productDetails[locale] || productDetails["ru"] || {};
  const list = t.concepts?.items || [];
  
  const items = list.map((item: any) => {
    const detail = localizedDetails[item.id] || {};
    const rawName = item.name || item.title || "";
    const rawDesc = item.desc || item.challenge || detail.desc || detail.challenge || "";
    const rawTag = item.tags || item.service || detail.service || "Concept & Vision";
    return {
      ...item,
      name: getLocText(locale, rawName, rawName),
      tags: getLocText(locale, rawTag, rawTag),
      year: item.year || detail.year || "2026",
      desc: getLocText(locale, rawDesc, rawDesc),
      client: item.client || detail.client || "",
      studio: item.studio || detail.studio || "-",
      designer: item.designer || detail.designer || "-",
      location: item.location || detail.location || "-",
      projectType: item.projectType || detail.projectType || "-",
      class: item.class || detail.class || "-"
    };
  });

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title Block */}
      <section className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] w-auto">
        <div className="flex justify-between items-baseline gap-4 mb-3 sm:mb-4">
          <h1 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {t.concepts?.title || getLocText(locale, "Концепты и видение", "Concepts & Vision", "Концепциялар жана көрүнүш", "概念与愿景", "المفاهيم والرؤية", "Konzepte & Vision")}
          </h1>
          <GridSwitcher cols={cols} onChange={(val) => {
            setCols(val);
            safeLocalStorage.setItem("sds_grid_layout", val);
          }} />
        </div>
        <p className="text-[#808080] text-[14px] sm:text-[16px] leading-[1.44] m-0 font-normal max-w-[650px]">
          {getLocText(locale, "Перспективные визионерские исследования, футуристические концепты транспорта, электроники и архитектуры будущего", "Visionary research, futuristic concepts of transport, electronics and architecture of the future", "Келечектин футуристикалык концепциялары, транспорт, электроника жана архитектура боюнча визионердик изилдөөлөр")}
        </p>
      </section>

      {/* Premium Sorting Sub-navigation */}
      <ProjectsNav />

      {/* Concepts Grid */}
      <section className={`grid grid-cols-1 ${cols === "3" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-[40px] md:gap-[59px]`}>
        {items.map((item: any, index: number) => (
          <div key={item.id} className="w-full flex flex-col">
            <Link to={`/concepts-and-vision/${item.id}`} className="group flex flex-col flex-1">
              
              {/* Image band container */}
              <div className="w-full bg-transparent overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                <ImageWithFallback 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover scale-[1.02] transition-all duration-500 group-hover:brightness-75"
                  loading="lazy"
                />
              </div>

              {/* Meta details */}
              <div className="mt-[20px] flex flex-col md:flex-row justify-between items-stretch gap-6 md:gap-0">
                {/* Left column */}
                <div className="flex-1 md:flex-[3] min-w-0 flex flex-col pr-0 md:pr-5">
                  <h2 className="text-[22px] xs:text-[26px] md:text-[34px] font-semibold leading-[1.2] tracking-[-0.03em] text-black m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                    {item.name}
                  </h2>
                  {item.category && (
                    <span className="text-[12px] md:text-[13px] font-mono tracking-[0.1em] text-[#808080] uppercase mt-1 block">
                      {item.category}
                    </span>
                  )}

                  <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-2 sm:gap-y-3 mt-4 sm:mt-6 mb-4 sm:mb-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {getLocText(locale, "КАТЕГОРИЯ", "CATEGORY", "КАТЕГОРИЯ")}
                      </span>
                      <span className="text-[13px] sm:text-[15px] text-black font-normal mt-0.5 sm:mt-1">
                        {item.tags}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {getLocText(locale, "ГОД", "YEAR", "ЖЫЛ")}
                      </span>
                      <span className="text-[13px] sm:text-[15px] text-black font-normal mt-0.5 sm:mt-1">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {item.desc && (
                    <p className="text-[14px] sm:text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-3">
                      {item.desc}
                    </p>
                  )}
                </div>
                {/* Vertical divider */}
                <div className="hidden md:block w-[1px] bg-black/60 shrink-0 self-stretch my-0.5"></div>
                {/* Right column */}
                <div className="flex-1 md:flex-[2] min-w-0 flex flex-col pl-0 md:pl-5 border-t md:border-t-0 border-[#E5E5E5] pt-3 md:pt-0">
                  <div className="w-full flex flex-col">
                    {[
                      { label: t.productDetail?.labels?.project || "Project", value: String(index + 1).padStart(2, '0') },
                      { label: t.productDetail?.labels?.studio || "Studio", value: item.studio },
                      { label: t.productDetail?.labels?.designer || "Designer", value: item.designer },
                      { label: t.productDetail?.labels?.location || "Location", value: item.location },
                      { label: t.productDetail?.labels?.projectType || "Project Type", value: item.projectType },
                    ].map((row, rowIdx) => (
                      <div key={rowIdx} className="flex justify-between items-center py-2 sm:py-2.5 border-b border-[#E5E5E5] gap-4">
                        <span className="font-mono text-[11px] md:text-[12px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">
                          {row.label}
                        </span>
                        <span className="text-[13px] sm:text-[15px] text-black font-normal text-right">
                          {renderCommaSplitList(row.value)}
                        </span>
                      </div>
                    ))}
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
