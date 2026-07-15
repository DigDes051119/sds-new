import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import { cmsService } from "../cmsService";
import { projectDetailsTranslations } from "../projectDetailsData";
import projectImg1 from "../../imports/image.png";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16.png";
import { InlineVideoPlayer } from "../components/InlineVideoPlayer";

export function ProjectDetail() {
  const { t, locale } = useContext(LanguageContext);
  const { id } = useParams();

  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProjectDetails(cmsService.getProjectDetails());
    });
  }, []);

  const localeData = projectDetails[locale] || projectDetails.ru || projectDetailsTranslations.ru;
  const data = id && localeData[id]
    ? localeData[id]
    : t.projectDetail.defaultProject;

  const projectListItem = t.projects?.items?.find((p: any) => p.id === id);
  const coverImg = projectListItem
    ? ((projectListItem.img && (projectListItem.img.startsWith("http") || projectListItem.img.startsWith("data:") || projectListItem.img.startsWith("/")))
        ? projectListItem.img
        : (projectListItem.id === "sandyq" ? projectImg1 : projectListItem.id === "ala-too" ? projectImg2 : projectListItem.img))
    : (data.processImages?.[0] || "");

  const blocks: string[][] = data.collageBlocks && data.collageBlocks.length > 0
    ? data.collageBlocks
    : (data.processImages || []).map((img: string) => [img]);

  const parseResult = (text: string) => {
    const match = text.match(/(\d+%\s*(?:higher|reduction|увеличение|снижение|жогорулоо|төмөндөө)?|\d+\s*х|\d+\s*\+|\b\d+\b)/i);
    if (match) {
      const stat = match[0];
      const desc = text.replace(stat, "").replace(/^[-–—:]\s*/, "").trim();
      return { stat, desc };
    }
    return { stat: "✓", desc: text };
  };

  return (
    <div className="w-full flex flex-col pb-[150px] gap-[80px]">
      
      {/* 1 БЛОК: Hero Section with Full-Width Cover and Overlay Metadata */}
      <section 
        data-theme="dark" 
        className="relative h-[94vh] min-h-[600px] w-[calc(100%+56px)] md:w-[calc(100%+118px)] mx-[-28px] md:mx-[-59px] mt-[-24px] bg-black flex flex-col justify-end px-[28px] md:px-[59px] pb-[40px] md:pb-[60px] overflow-hidden"
      >
        {/* Cover Image */}
        {coverImg && (
          <div className="absolute inset-0 w-full h-full">
            <ImageWithFallback
              src={coverImg}
              className="w-full h-full object-cover block opacity-80"
              alt={data.name}
              priority={true}
            />
            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>
        )}

        {/* Text and Metadata at the bottom, directly on the cover */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-end w-full">
          <div className="lg:col-span-7">
            <h1 className="text-[48px] md:text-[72px] lg:text-[96px] font-normal leading-[1.0] tracking-[-0.04em] text-white m-0 uppercase">
              {data.name}
            </h1>
          </div>
          <div className="lg:col-span-5 flex flex-nowrap justify-end gap-8 md:gap-[48px] uppercase tracking-wider font-mono text-white">
            <div className="border-l border-white/40 pl-6 md:pl-8">
              <span className="text-white/50 block mb-2 text-[12px] md:text-[14px]">{locale === "ru" ? "Клиент" : "Client"}</span>
              <span className="font-normal text-[18px] md:text-[22px] tracking-tight block whitespace-nowrap">{data.client}</span>
            </div>
            <div>
              <span className="text-white/50 block mb-2 text-[12px] md:text-[14px]">{locale === "ru" ? "Год" : "Year"}</span>
              <span className="font-normal text-[18px] md:text-[22px] tracking-tight block whitespace-nowrap">{data.year}</span>
            </div>
            <div>
              <span className="text-white/50 block mb-2 text-[12px] md:text-[14px]">{locale === "ru" ? "Услуги" : "Services"}</span>
              <span className="font-normal text-[18px] md:text-[22px] tracking-tight block whitespace-nowrap">{data.service}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start pt-[10px]">
        <div className="lg:col-span-5 flex flex-col">
          <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase text-black m-0 leading-none">
            {locale === "ru" ? "задача и вызов" : locale === "kg" ? "маселе жана чакырык" : "challenge"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase mt-2">[01/CHALLENGE]</span>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <p className="text-[20px] md:text-[28px] font-light leading-[1.35] tracking-[-0.03em] text-black m-0">
            {data.challenge}
          </p>
          <p className="text-[17px] leading-[1.5] text-[#808080] m-0 font-normal">
            {data.desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#808080] pt-8 mt-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[14px] text-[#808080] uppercase">[01/SCOPE]</span>
              <span className="text-[17px] text-black font-normal">{data.service}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[14px] text-[#808080] uppercase">[02/FOCUS]</span>
              <span className="text-[17px] text-black font-normal">
                {locale === "ru" 
                  ? "Удовлетворение потребностей рынка и создание нового пользовательского опыта." 
                  : locale === "kg" 
                    ? "Рыноктун муктаждыктарын канааттандыруу жана жаңы колдонуучу тажрыйбасын түзүү."
                    : "Addressing market needs and developing next-generation physical or digital user journeys."}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Wall / Image Stack */}
      <section className="w-full flex flex-col gap-[4px] px-[20px] md:px-[50px] reveal-visible">
        {blocks.map((block: string[], blockIdx: number) => {
          if (!block || block.length === 0) return null;
          
          return (
            <div 
              key={blockIdx} 
              className={`grid w-full gap-[4px] ${
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
                  <div key={`${blockIdx}-${imgIdx}`} className="w-full overflow-hidden bg-[#fafaf6] border border-[#808080]/10">
                    {isVideo ? (
                      <div className="w-full aspect-[16/9]">
                        <InlineVideoPlayer videoUrl={videoUrl} alt={`${data.name} media`} />
                      </div>
                    ) : (
                      <ImageWithFallback
                        src={imgUrl}
                        className="w-full block object-contain"
                        alt={`${data.name} process`}
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

      {/* Results Section */}
      {data.results && data.results.length > 0 && (
        <section className="w-full border-t border-[#808080] pt-[40px] flex flex-col gap-8">
          <div className="flex justify-between items-baseline border-b border-[#808080] pb-4">
            <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase text-black m-0 leading-none">
              {locale === "ru" ? "результаты" : locale === "kg" ? "натыйжалар" : "results"}
            </h2>
            <span className="font-mono text-[16px] text-[#808080] uppercase">[02/RESULTS]</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[59px] gap-y-12">
            {data.results.map((result: string, idx: number) => {
              const parsed = parseResult(result);
              return (
                <div key={idx} className="flex flex-col border-t border-[#808080] pt-6 group">
                  <span className="text-[54px] md:text-[72px] font-normal text-[#0000FF] leading-none tracking-tighter mb-4 group-hover:scale-[1.02] transition-transform origin-left duration-300">
                    {parsed.stat}
                  </span>
                  <p className="text-[17px] leading-[1.44] text-[#808080] group-hover:text-black transition-colors duration-300 m-0">
                    {parsed.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Loop Previous / Next Project Navigation */}
      {(() => {
        const items = t.projects?.items || [];
        const currentIdx = items.findIndex((p: any) => p.id === id);
        if (currentIdx === -1 || items.length <= 1) return null;

        const prevIdx = (currentIdx - 1 + items.length) % items.length;
        const nextIdx = (currentIdx + 1) % items.length;
        
        const prevProject = items[prevIdx];
        const nextProject = items[nextIdx];

        const getProjCover = (pid: string) => {
          const pItem = t.projects?.items?.find((p: any) => p.id === pid);
          const pDetail = localeData[pid] || t.projectDetail?.projects?.[pid];
          if (pItem?.img) {
            if (pItem.img.startsWith('http') || pItem.img.startsWith('data:') || pItem.img.startsWith('/')) return pItem.img;
            if (pid === 'sandyq') return projectImg1;
            if (pid === 'ala-too') return projectImg2;
            return pItem.img;
          }
          return pDetail?.cover || pDetail?.processImages?.[0] || null;
        };

        const getProjDesc = (pid: string) => {
          const detail = localeData[pid] || t.projectDetail?.projects?.[pid];
          return detail?.desc || detail?.challenge || '';
        };

        const tiles = [
          { dir: 'prev', project: prevProject },
          { dir: 'next', project: nextProject }
        ];

        return (
          <section className="w-full border-t border-[#808080] pt-[40px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[28px]">
              {tiles.map(({ dir, project }) => {
                const cover = getProjCover(project.id);
                const desc = getProjDesc(project.id);
                const label = dir === 'prev'
                  ? (locale === "ru" ? "предыдущий проект" : "previous project")
                  : (locale === "ru" ? "следующий проект" : "next project");
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="group w-full border border-[#808080]/30 hover:border-black transition-colors flex flex-col"
                  >
                    {/* Cover Image */}
                    {cover && (
                      <div className="w-full aspect-[16/9] overflow-hidden bg-[#fafaf6]">
                        <ImageWithFallback
                          src={cover}
                          className="w-full h-full object-cover block group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                          alt={project.name}
                        />
                      </div>
                    )}

                    <div className={`flex flex-grow flex-col gap-1.5 p-6 ${dir === 'next' ? 'items-end text-right' : 'items-start text-left'}`}>
                      {/* Label */}
                      <span className="font-mono text-[14px] tracking-[0.04em] text-[#808080] uppercase">
                        {label}
                      </span>

                      {/* Title */}
                      <h3 className="text-[28px] font-normal leading-[1.3] tracking-[-0.28px] text-black m-0 group-hover:text-[#0000FF] transition-colors duration-300 lowercase">
                        {project.name}
                      </h3>

                      {/* Description */}
                      {desc && (
                        <p className={`text-[15px] leading-[1.44] text-[#808080] m-0 line-clamp-2 max-w-[400px] mt-1 ${dir === 'next' ? 'text-right' : 'text-left'}`}>
                          {desc}
                        </p>
                      )}

                      {/* Button */}
                      <div className="mt-4 inline-flex items-center gap-2 font-mono text-[14px] tracking-[0.04em] uppercase text-black border border-[#808080] px-4 py-2 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                        {locale === "ru" ? "перейти" : "go to"}
                        <span>&rarr;</span>
                      </div>
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
