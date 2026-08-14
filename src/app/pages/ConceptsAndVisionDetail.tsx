import { Link } from "react-router";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getLocText } from "../i18n";
import { InlineVideoPlayer } from "../components/InlineVideoPlayer";
import { renderCommaSplitList } from "../utils/renderCommaSplitList";
import { parseTextBlock, TextBlockRenderer } from "../components/TextBlockRenderer";
import { useProjectDetail } from "../utils/useProjectDetail";

export function ConceptsAndVisionDetail() {
  const {
    id,
    locale,
    data,
    listItem,
    items,
    collageBlocks,
    filteredBlocks,
    activeTab,
    setActiveTab,
    hasVideos,
    heroImage
  } = useProjectDetail("concepts");

  return (
    <div className="w-full flex flex-col pb-[150px] gap-[80px]">
      
      {/* 1 БЛОК: Hero Section with Full-Width Cover and Overlay Metadata */}
      <section 
        data-theme="dark" 
        className="relative h-[80vh] md:h-[94vh] min-h-[500px] md:min-h-[600px] w-[calc(100%+32px)] sm:w-[calc(100%+48px)] md:w-[calc(100%+130px)] lg:w-[calc(100%+210px)] mx-[-16px] sm:mx-[-24px] md:mx-[-65px] lg:mx-[-105px] mt-[-24px] bg-black flex flex-col justify-end px-4 sm:px-6 md:px-[65px] lg:px-[105px] pb-8 md:pb-[60px] overflow-hidden"
      >
        {/* Cover Image */}
        {heroImage && (
          <div className="absolute inset-0 w-full h-full">
            <ImageWithFallback
              src={heroImage}
              className="w-full h-full object-cover block opacity-80"
              alt={data.name || "Concept"}
              priority={true}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>
        )}

        {/* Text and Metadata at bottom */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-end w-full">
          <div className="lg:col-span-7">
            <div className="mb-4">
              <Link 
                to="/concepts-and-vision" 
                className="text-[14px] font-mono tracking-wider uppercase text-white/70 hover:text-white transition-colors"
              >
                &larr; {getLocText(locale, "К концептам", "Back to concepts", "Концепцияларга кайтуу")}
              </Link>
            </div>
            <h1 className="text-[32px] xs:text-[44px] md:text-[72px] lg:text-[96px] font-bold leading-[1.0] tracking-[-0.04em] text-white m-0 uppercase">
              {data.name || listItem?.name}
            </h1>
          </div>
          <div className="lg:col-span-5 flex flex-col uppercase tracking-wider font-mono text-white mt-6 lg:mt-0 w-full lg:max-w-[420px] text-right lg:ml-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-white/20">
              <div className="flex flex-col text-right">
                <span className="text-white/50 text-[11px] mb-1">STUDIO</span>
                <span className="font-normal text-[15px] leading-tight">{renderCommaSplitList(data.studio || "-")}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-white/50 text-[11px] mb-1">DESIGNER</span>
                <span className="font-normal text-[15px] leading-tight">{renderCommaSplitList(data.designer || "-")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 mt-4 border-t border-white/20">
              <div className="flex flex-col text-right">
                <span className="text-white/50 text-[11px] mb-1">LOCATION</span>
                <span className="font-normal text-[15px] leading-tight">{renderCommaSplitList(data.location || "-")}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-white/50 text-[11px] mb-1">PROJECT TYPE</span>
                <span className="font-normal text-[15px] leading-tight">{renderCommaSplitList(data.projectType || "-")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 mt-4 border-t border-white/20 pb-4 border-b">
              <div className="flex flex-col text-right">
                <span className="text-white/50 text-[11px] mb-1">{getLocText(locale, "ГОД", "YEAR", "ЖЫЛ")}</span>
                <span className="font-normal text-[15px] leading-tight">{data.year || "2026"}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-white/50 text-[11px] mb-1">{getLocText(locale, "КАТЕГОРИЯ", "CATEGORY", "КАТЕГОРИЯ")}</span>
                <span className="font-normal text-[15px] leading-tight">{data.service || "CONCEPT & VISION"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start pt-[10px]">
        <div className="lg:col-span-5 flex flex-col">
          <h2 className="text-[40px] md:text-[54px] font-bold tracking-[-0.04em] text-black m-0 leading-none">
            {getLocText(locale, "Идея и концепт", "Concept & Idea", "Идея жана концепт")}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase mt-2">[01/CONCEPT]</span>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <p className="text-[20px] md:text-[28px] font-light leading-[1.35] tracking-[-0.03em] text-black m-0">
            {data.challenge || data.desc}
          </p>
          {data.challenge && (
            <p className="text-[17px] leading-[1.5] text-black m-0 font-normal subpixel-antialiased">
              {data.desc}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#808080] pt-8 mt-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[14px] text-[#808080] uppercase">[01/SCOPE]</span>
              <span className="text-[17px] text-black font-normal subpixel-antialiased">{data.service || "Visionary Design & R&D"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[14px] text-[#808080] uppercase">[02/FOCUS]</span>
              <span className="text-[17px] text-black font-normal subpixel-antialiased">
                {getLocText(
                  locale,
                  "Исследование перспективных направлений дизайна и технологий.",
                  "Exploring prospective directions of design, forms, and emerging technologies.",
                  "Дизайн жана технологиялардын келечектүү багыттарын изилдөө.",
                  "探索设计、形态与前沿技术的未来方向。",
                  "استكشاف الاتجاهات الواعدة للتصميم والتقنيات.",
                  "Erforschung zukunftsweisender Designrichtungen und Technologien."
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Toggle */}
      {hasVideos && (
        <div className="flex justify-center border-b border-black/10 pb-4 mb-2">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("gallery")}
              className={`text-[16px] font-mono font-bold uppercase tracking-[0.06em] transition-all cursor-pointer relative pb-2 ${
                activeTab === "gallery" ? "text-[#0000FF]" : "text-[#808080] hover:text-black"
              }`}
            >
              {getLocText(locale, "Галерея", "Gallery", "Галерея")}
              {activeTab === "gallery" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0000FF]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`text-[16px] font-mono font-bold uppercase tracking-[0.06em] transition-all cursor-pointer relative pb-2 ${
                activeTab === "video" ? "text-[#0000FF]" : "text-[#808080] hover:text-black"
              }`}
            >
              {getLocText(locale, "Видео", "Video", "Видео")}
              {activeTab === "video" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0000FF]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Gallery */}
      {filteredBlocks.length > 0 && (
        <section className="max-w-[1600px] mx-auto w-full flex flex-col gap-[12px] reveal-visible">
          {filteredBlocks.map((block: string[], blockIdx: number) => {
            if (!block || block.length === 0) return null;
            if (block[0]?.startsWith("text:")) {
              const textData = parseTextBlock(block[0]);
              return textData ? <TextBlockRenderer key={blockIdx} data={textData} /> : null;
            }
            return (
              <div 
                key={blockIdx} 
                className={`grid w-full gap-[12px] ${
                  block.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                  block.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 
                  block.length === 4 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 
                  block.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' : 
                  'grid-cols-1'
                }`}
              >
                {block.map((imgUrl: string, imgIdx: number) => {
                  const isVideo = imgUrl?.startsWith("video:");
                  const videoUrl = isVideo ? imgUrl.slice(6) : "";
                  return (
                    <div key={`${blockIdx}-${imgIdx}`} className="w-full bg-[#F4F6F9]">
                      {isVideo ? (
                        <div className="w-full">
                          <InlineVideoPlayer videoUrl={videoUrl} alt="Concept media" />
                        </div>
                      ) : (
                        <ImageWithFallback
                          src={imgUrl}
                          className="w-full h-auto block max-w-full"
                          alt="Concept process"
                          loading="eager"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
      )}

      {/* Results */}
      <section className="mt-8">
        <div className="border border-[#808080]/30 p-[28px] md:p-[40px]">
          <div className="flex justify-between items-start gap-[28px] mb-6">
            <div className="flex flex-col">
              <h2 className="text-[40px] md:text-[54px] font-bold tracking-[-0.04em] text-black m-0 leading-none">
                {getLocText(locale, "Итоги", "Outcomes", "Жыйынтыктар")}
              </h2>
              <span className="font-mono text-[16px] text-[#808080] uppercase mt-2">[02/RESULTS]</span>
            </div>
            <Link
              to="/concepts-and-vision"
              className="shrink-0 inline-flex items-center gap-2 text-[17px] font-bold text-black hover:text-[#0000FF] transition-colors duration-300 uppercase tracking-[-0.15px] mt-2"
            >
              {getLocText(locale, "Другие концепты", "View other concepts", "Башка концепциялар")}
              <span className="text-[18px] leading-none">&rarr;</span>
            </Link>
          </div>

          <div className="flex flex-col gap-6 max-w-[720px]">
            {data.resultsDesc && (
              <p className="text-[15px] leading-[1.5] text-[#808080] font-normal m-0">
                {data.resultsDesc}
              </p>
            )}
            {data.results && data.results[0] && (
              <p className="text-[22px] md:text-[28px] leading-[1.3] text-black font-bold m-0">
                {data.results[0]}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Previous / Next Navigation */}
      {(() => {
        const clean = (s?: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const targetClean = clean(id);
        const currentIdx = (items || []).findIndex((p: any) => clean(p.id) === targetClean || clean(p.name) === targetClean);
        if (currentIdx === -1 || (items || []).length <= 1) return null;

        const prevIdx = (currentIdx - 1 + items.length) % items.length;
        const nextIdx = (currentIdx + 1) % items.length;
        
        const prevItem = items[prevIdx];
        const nextItem = items[nextIdx];

        const getCover = (pid: string) => {
          const pItem = (items || []).find((p: any) => clean(p.id) === clean(pid));
          return pItem?.img || pItem?.collageBlocks?.[0]?.[0] || null;
        };

        const getDesc = (pid: string) => {
          const pItem = (items || []).find((p: any) => clean(p.id) === clean(pid));
          return pItem?.desc || pItem?.challenge || '';
        };

        const tiles = [
          { dir: 'prev', item: prevItem },
          { dir: 'next', item: nextItem }
        ];

        return (
          <section className="w-full border-t border-[#808080] pt-[40px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[28px]">
              {tiles.map(({ dir, item }) => {
                const cover = getCover(item.id);
                const desc = getDesc(item.id);
                const label = dir === 'prev'
                  ? (locale === "ru" ? "Предыдущий концепт" : "Previous concept")
                  : (locale === "ru" ? "Следующий концепт" : "Next concept");
                return (
                  <Link
                    key={item.id}
                    to={`/concepts-and-vision/${item.id}`}
                    className="group w-full border border-[#808080]/30 hover:border-black transition-colors flex flex-col"
                  >
                    {cover && (
                      <div className="w-full aspect-[16/9] overflow-hidden bg-[#F4F6F9] border-b border-[#808080]/30">
                        <img 
                          src={cover} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                      </div>
                    )}
                    <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[13px] text-[#808080] uppercase tracking-wider">{label}</span>
                        <h3 className="text-[28px] md:text-[38px] font-normal leading-tight tracking-[-0.03em] text-black m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-[15px] leading-relaxed text-[#808080] line-clamp-2 m-0">
                        {desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })()}

    </div>
  );
}
