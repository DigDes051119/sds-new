import { motion, AnimatePresence } from "motion/react";
import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import videoSrc from "../../imports/__Copy_this_cozy_soft_life_quote_roundup_that_feel_luxe_without_spending_a_fortune_that_balance_trend_comfort_and_everyday_function_and_make_your_-_Pin-1090082284813034216.mp4";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import projectImg1 from "../../imports/image.png";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16.png";
import { projectDetailsTranslations } from "../projectDetailsData";
import { cmsService } from "../cmsService";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";

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
    ? (projectListItem.id === "sandyq" ? projectImg1 : projectListItem.id === "ala-too" ? projectImg2 : projectListItem.img)
    : (data.processImages?.[0] || "");

  const [activeTab, setActiveTab] = useState(0);

  // Parse result strings to extract big infographic numbers/stats
  const parseResultStat = (res: string) => {
    // Matches percentages (40%), multipliers (3x), or simple numbers (100+)
    const match = res.match(/(\d+%\s*(?:higher|reduction|увеличение|снижение|жогорулоо|төмөндөө)?|\d+\s*х|\d+\s*\+|\b\d+\b)/i);
    if (match) {
      const stat = match[0];
      const desc = res.replace(stat, "").replace(/^[-–—:]\s*/, "").trim();
      return { stat, desc };
    }
    return { stat: "✓", desc: res };
  };

  const scrollRevealConfig = {
    initial: { y: 40, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const processStages = [
    { label: locale === "ru" ? "Эскизирование" : locale === "kg" ? "Эскиз даярдоо" : "Concept Ideation", desc: locale === "ru" ? "Поиск формы и пропорций" : locale === "kg" ? "Форма жана пропорцияларды издөө" : "Form finding and conceptual study" },
    { label: locale === "ru" ? "3D Моделирование" : locale === "kg" ? "3D Моделдөө" : "Digital Modeling", desc: locale === "ru" ? "Высокодетализированная геометрия" : locale === "kg" ? "Толук деталдуу геометрия" : "High-precision CAD and geometry" },
    { label: locale === "ru" ? "Визуализация" : locale === "kg" ? "Визуализация" : "Material Render", desc: locale === "ru" ? "Световые схемы и материалы" : locale === "kg" ? "Жарык жана материалдар" : "Material finish and light setups" }
  ];

  return (
    <div className="pb-32 bg-[#fafaf6] text-black">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] w-full bg-black flex flex-col justify-end p-6 md:p-12 pb-24">
        {id === "sandyq" ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
        ) : (
          <ImageWithFallback
            src={coverImg}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            alt={data.name}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="relative z-10 w-full max-w-[1380px] mx-auto flex flex-col md:flex-row justify-between items-end gap-8 text-white">
          <div className="max-w-2xl">
            <Link to="/projects" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group text-sm uppercase tracking-wider font-semibold">
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> {locale === "ru" ? "Все проекты" : locale === "kg" ? "Баардык долбоорлор" : "All projects"}
            </Link>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.08] mb-4">{data.name}</h1>
          </div>

          <div className="flex gap-8 md:gap-16 text-sm uppercase tracking-widest font-medium opacity-80 shrink-0 border-l border-white/20 pl-8">
            <div>
              <p className="opacity-50 mb-1.5">{t.projectDetail.labels.client}</p>
              <p className="font-semibold">{data.client}</p>
            </div>
            <div>
              <p className="opacity-50 mb-1.5">{t.projectDetail.labels.year}</p>
              <p className="font-semibold">{data.year}</p>
            </div>
            <div>
              <p className="opacity-50 mb-1.5">{t.projectDetail.labels.service}</p>
              <p className="font-semibold">{data.service}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Block 2: Redesigned Challenge Block (Split Editorial) */}
      <motion.section 
        {...scrollRevealConfig}
        className="max-w-[1380px] mx-auto px-6 min-[1380px]:px-0 pt-28 md:pt-36 pb-8 border-b border-black/[0.06]"
      >
        <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-12 lg:gap-24 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold tracking-[-0.06em] leading-[1.05] text-black">
              {t.projectDetail.challengeHeading}
            </h2>
            <div className="h-[2px] w-20 bg-[#0000FF] mt-2" />
          </div>
          
          <div className="flex flex-col gap-8">
            <p className="text-2xl sm:text-3xl md:text-[34px] font-light leading-[1.4] tracking-[-0.035em] text-black/85">
              {data.challenge}
            </p>
            <p className="text-lg sm:text-xl text-black/60 leading-relaxed font-light">
              {data.desc}
            </p>
            <div className="grid sm:grid-cols-2 gap-8 mt-4 pt-8 border-t border-black/[0.06]">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-black/40 mb-2">01 / Scope</h4>
                <p className="text-base text-black/70 leading-relaxed">{data.service}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-black/40 mb-2">02 / Focus</h4>
                <p className="text-base text-black/70 leading-relaxed">
                  {locale === "ru" 
                    ? "Удовлетворение потребностей рынка и создание нового пользовательского опыта." 
                    : locale === "kg"
                    ? "Рыноктун муктаждыктарын канааттандыруу жана жаңы колдонуучу тажрыйбасын түзүү."
                    : "Addressing market needs and developing next-generation physical or digital user journeys."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Block 3: Redesigned Process Gallery (Vertically Stacked Editorial Collage) */}
      <section className="max-w-[1380px] mx-auto px-6 min-[1380px]:px-0 pt-8 pb-20 space-y-2 border-b border-black/[0.06]">
        {(() => {
          const blocks: string[][] = data.collageBlocks && data.collageBlocks.length > 0
            ? data.collageBlocks
            : (data.processImages || []).map((img: string) => [img]);

          return blocks.map((block: string[], blockIdx: number) => {
            if (!block || block.length === 0) return null;
            const count = block.length;

            const getGridColsClass = (c: number) => {
              if (c <= 1) return "grid-cols-1";
              if (c === 2) return "grid-cols-1 md:grid-cols-2";
              if (c === 3) return "grid-cols-1 md:grid-cols-3";
              if (c === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
              return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
            };

            return (
              <div 
                key={blockIdx}
                className="w-full"
              >
                <div className={`grid gap-2 ${getGridColsClass(count)}`}>
                  {block.map((imgUrl: string, imgIdx: number) => (
                    <motion.div
                      key={imgIdx}
                      {...scrollRevealConfig}
                      className="relative overflow-hidden bg-[#eeeee9] border border-black/5 shadow-[0_30px_70px_rgba(0,0,0,0.04)] w-full"
                    >
                      <ImageWithFallback
                        src={imgUrl}
                        className="w-full h-auto block"
                        alt={`${data.name} - Block ${blockIdx + 1} Image ${imgIdx + 1}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </section>

      {/* Block 4: Redesigned Results & Impact Showcase (Vibrant Grid) */}
      <motion.section 
        {...scrollRevealConfig}
        className="max-w-[1380px] mx-auto px-6 min-[1380px]:px-0 py-28 md:py-36"
      >
        <div className="w-full">
          
          {/* Infographic Stats Panel */}
          <div className="bg-white border border-black/[0.05] rounded-[2.5rem] p-8 md:p-16 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.02)] w-full">
            <div>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] leading-[1.02] mb-12">
                {t.projectDetail.resultsHeading}
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-10">
                {data.results.map((res: string, idx: number) => {
                  const { stat, desc } = parseResultStat(res);
                  return (
                    <div key={idx} className="flex flex-col justify-between border-t border-black/[0.06] pt-6 group">
                      <div className="text-5xl sm:text-7xl font-bold tracking-tight text-[#0000FF] mb-4 group-hover:scale-[1.02] transition-transform origin-left duration-300">
                        {stat}
                      </div>
                      <p className="text-lg leading-relaxed text-black/65 font-light">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0000FF]/10 flex items-center justify-center text-[#0000FF]">
                  <CheckCircle size={16} />
                </div>
                <span className="text-sm font-medium tracking-tight text-black/75">
                  {locale === "ru" ? "Проект полностью завершен и передан клиенту" : locale === "kg" ? "Долбоор толугу менен аяктап, кардарга өткөрүлүп берилди" : "Project delivered and successfully deployed"}
                </span>
              </div>
              
              <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#0000FF] hover:text-black transition-colors group">
                {locale === "ru" ? "Все проекты" : locale === "kg" ? "Баардык долбоорлор" : "View other projects"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </motion.section>
    </div>
  );
}
