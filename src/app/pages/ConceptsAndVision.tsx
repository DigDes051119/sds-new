import { Link } from "react-router";
import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";

export function ConceptsAndVision() {
  const { t, locale } = useContext(LanguageContext);
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProductDetails(cmsService.getProductDetails());
    });
  }, []);

  const localizedDetails = productDetails[locale] || productDetails["ru"] || {};
  const list = t.concepts?.items || [];
  
  const items = list.map((item: any) => {
    const detail = localizedDetails[item.id] || {};
    return {
      ...item,
      tags: detail.service || "Concept & Vision",
      year: detail.year || "2026",
      desc: detail.desc || detail.challenge || "",
      client: detail.client || "",
      studio: detail.studio || "-",
      designer: detail.designer || "-",
      location: detail.location || "-",
      projectType: detail.projectType || "-",
      class: detail.class || "-"
    };
  });

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      
      {/* Title Block */}
      <section className="border-b border-[#808080] pb-4 mb-[100px] w-auto">
        <div className="flex justify-between items-baseline gap-4 mb-4">
          <h1 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {t.concepts?.title || (locale === "ru" ? "Концепты и видение" : locale === "kg" ? "Концепциялар жана көрүнүш" : "Concepts & Vision")}
          </h1>
          <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase shrink-0">
            [CONCEPTS/CATALOGUE]
          </span>
        </div>
        <p className="text-[#808080] text-[16px] leading-[1.44] m-0 font-normal max-w-[650px]">
          {locale === "ru" 
            ? "Наши визионерские концепты, идеи будущего и экспериментальный дизайн" 
            : locale === "kg" 
              ? "Биздин визионердик концепциялар, келечектин идеялары жана эксперименталдык дизайн"
              : "Our visionary concepts, futuristic ideas and experimental design studies"}
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-[59px]">
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

              {/* Meta details — two columns with vertical divider */}
              <div className="mt-[20px] flex justify-between items-stretch gap-0">
                {/* Left column */}
                <div className="flex-[3] min-w-0 flex flex-col pr-5">
                  <h2 className="text-[28px] md:text-[34px] font-semibold leading-[1.2] tracking-[-0.03em] text-black m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                    {item.name}
                  </h2>
                  {item.category && (
                    <span className="text-[12px] md:text-[13px] font-mono tracking-[0.1em] text-[#808080] uppercase mt-1 block">
                      {item.category}
                    </span>
                  )}

                  <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6 mb-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {locale === "ru" ? "КАТЕГОРИЯ" : locale === "kg" ? "КАТЕГОРИЯ" : "CATEGORY"}
                      </span>
                      <span className="text-[14px] md:text-[15px] text-black font-normal mt-1">
                        {item.tags}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {locale === "ru" ? "ГОД" : locale === "kg" ? "ЖЫЛ" : "YEAR"}
                      </span>
                      <span className="text-[14px] md:text-[15px] text-black font-normal mt-1">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {item.desc && (
                    <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-3">
                      {item.desc}
                    </p>
                  )}
                </div>
                {/* Vertical divider */}
                <div className="w-[1px] bg-black/60 shrink-0 self-stretch my-0.5"></div>
                {/* Right column */}
                <div className="flex-[2] min-w-0 flex flex-col pl-5">
                  <div className="w-full flex flex-col">
                    {[
                      { label: t.productDetail?.labels?.project || "Project", value: String(index + 1).padStart(2, '0') },
                      { label: t.productDetail?.labels?.studio || "Studio", value: item.studio },
                      { label: t.productDetail?.labels?.designer || "Designer", value: item.designer },
                      { label: t.productDetail?.labels?.location || "Location", value: item.location },
                      { label: t.productDetail?.labels?.projectType || "Project Type", value: item.projectType },
                    ].map((row, rowIdx) => (
                      <div key={rowIdx} className="flex justify-between items-center py-2.5 border-b border-[#E5E5E5] gap-4">
                        <span className="font-mono text-[11px] md:text-[12px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">
                          {row.label}
                        </span>
                        <span className="text-[14px] md:text-[15px] text-black font-normal text-right">
                          {row.value}
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
