import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import { cmsService } from "../cmsService";
import { projectDetailsTranslations } from "../projectDetailsData";
import projectImg1 from "../../imports/image_low.webp";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16_low.webp";
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

  return (
    <div className="w-full flex flex-col pb-[150px] gap-[80px]">
      
      {/* 1 БЛОК: Hero Section with Full-Width Cover and Overlay Metadata */}
      <section 
        data-theme="dark" 
        className="relative h-[80vh] md:h-[94vh] min-h-[500px] md:min-h-[600px] w-[calc(100%+40px)] md:w-[calc(100%+80px)] lg:w-[calc(100%+160px)] mx-[-20px] md:mx-[-40px] lg:mx-[-80px] mt-[-24px] bg-black flex flex-col justify-end px-5 md:px-10 lg:px-[80px] pb-8 md:pb-[60px] overflow-hidden"
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
            <h1 className="text-[32px] xs:text-[44px] md:text-[72px] lg:text-[96px] font-bold leading-[1.0] tracking-[-0.04em] text-white m-0 uppercase">
              {data.name}
            </h1>
          </div>
          <div className="lg:col-span-5 flex flex-wrap lg:flex-nowrap justify-start lg:justify-end gap-6 md:gap-[48px] uppercase tracking-wider font-mono text-white mt-4 lg:mt-0">
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
          <h2 className="text-[40px] md:text-[54px] font-bold tracking-[-0.04em] text-black m-0 leading-none">
            {locale === "ru" ? "Задача и вызов" : locale === "kg" ? "Маселе жана чакырык" : "Challenge"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase mt-2">[01/CHALLENGE]</span>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <p className="text-[20px] md:text-[28px] font-light leading-[1.35] tracking-[-0.03em] text-black m-0">
            {data.challenge}
          </p>
          <p className="text-[15px] leading-[1.5] text-[#808080] m-0 font-normal">
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
      <section className="w-full flex flex-col gap-[4px] reveal-visible">
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
                  <div key={`${blockIdx}-${imgIdx}`} className="w-full bg-[#fafaf6]">
                    {isVideo ? (
                      <div className="w-full aspect-[16/9]">
                        <InlineVideoPlayer videoUrl={videoUrl} alt={`${data.name} media`} />
                      </div>
                    ) : (
                      <ImageWithFallback
                        src={imgUrl}
                        className="w-full h-auto block max-w-full"
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
      <section className="mt-8">
        <div className="border border-[#808080]/30 p-[28px] md:p-[40px]">
          {/* Top Row: Heading + Link */}
          <div className="flex justify-between items-start gap-[28px] mb-6">
            <div className="flex flex-col">
              <h2 className="text-[40px] md:text-[54px] font-bold tracking-[-0.04em] text-black m-0 leading-none">
                {locale === "ru" ? "Результаты" : locale === "kg" ? "Натыйжалар" : "Results"}
              </h2>
              <span className="font-mono text-[16px] text-[#808080] uppercase mt-2">[02/RESULTS]</span>
            </div>
            <Link
              to="/projects"
              className="shrink-0 inline-flex items-center gap-2 text-[17px] font-bold text-black hover:text-[#0000FF] transition-colors duration-300 uppercase tracking-[-0.15px] mt-2"
            >
              {locale === "ru" ? "Другие проекты" : locale === "kg" ? "Башка долбоорлор" : "View other projects"}
              <span className="text-[18px] leading-none">&rarr;</span>
            </Link>
          </div>

          {/* Left-aligned content */}
          <div className="flex flex-col gap-6 max-w-[720px]">
            {/* Description */}
            <p className="text-[15px] leading-[1.5] text-[#808080] font-normal m-0">
              {data.resultsDesc}
            </p>

            {/* Main Result */}
            {data.results && data.results[0] && (
              <p className="text-[22px] md:text-[28px] leading-[1.3] text-black font-bold m-0">
                {data.results[0]}
              </p>
            )}

            {/* Status line */}
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <circle cx="10" cy="10" r="10" fill="#0000FF" fillOpacity="0.1" />
                <path d="M6 10l3 3 5-6" stroke="#0000FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[17px] leading-[1.5] text-black font-normal">
                {locale === "ru" ? "Проект доставлен и успешно развернут" : locale === "kg" ? "Долбоор ийгиликтүү жеткирилди" : "Project delivered and successfully deployed"}
              </span>
            </div>
          </div>
        </div>
      </section>
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

        // Get 4 surrounding projects (2 prev + 2 next)
        const tiles = [];
        for (let i = 2; i >= 1; i--) {
          const idx = (currentIdx - i + items.length) % items.length;
          if (idx !== currentIdx) tiles.push({ dir: 'prev', project: items[idx] });
        }
        for (let i = 1; i <= 2; i++) {
          const idx = (currentIdx + i) % items.length;
          if (idx !== currentIdx) tiles.push({ dir: 'next', project: items[idx] });
        }

        return (
          <section className="w-full border-t border-[#808080] pt-[40px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[28px]">
              {tiles.map(({ dir, project }) => {
                const cover = getProjCover(project.id);
                const desc = getProjDesc(project.id);
                const label = dir === 'prev'
                  ? (locale === "ru" ? "Предыдущий проект" : "Previous project")
                  : (locale === "ru" ? "Следующий проект" : "Next project");
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
                      <h3 className="text-[28px] font-normal leading-[1.3] tracking-[-0.28px] text-black m-0 group-hover:text-[#0000FF] transition-colors duration-300 uppercase">
                        {project.name}
                      </h3>

                      {/* Description */}
                      {desc && (
                        <p className={`text-[15px] leading-[1.44] text-[#808080] m-0 line-clamp-2 max-w-[400px] mt-1 ${dir === 'next' ? 'text-right' : 'text-left'}`}>
                          {desc}
                        </p>
                      )}


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
