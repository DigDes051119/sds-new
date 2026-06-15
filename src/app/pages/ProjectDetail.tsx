import { motion, AnimatePresence } from "motion/react";
import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import videoSrc from "../../imports/__Copy_this_cozy_soft_life_quote_roundup_that_feel_luxe_without_spending_a_fortune_that_balance_trend_comfort_and_everyday_function_and_make_your_-_Pin-1090082284813034216.mp4";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import { projectDetailsTranslations } from "../projectDetailsData";
import { ArrowLeft, Target, Sparkles, Trophy, CheckCircle, ArrowRight } from "lucide-react";

export function ProjectDetail() {
  const { t, locale } = useContext(LanguageContext);
  const { id } = useParams();

  const localeData = projectDetailsTranslations[locale] || projectDetailsTranslations.ru;
  const data = id && localeData[id]
    ? localeData[id]
    : t.projectDetail.defaultProject;

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
            src={data.processImages[0]}
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
            <p className="text-xl md:text-2xl font-light opacity-90">{data.desc}</p>
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
        className="max-w-[1380px] mx-auto px-6 py-28 md:py-36 border-b border-black/[0.06]"
      >
        <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-12 lg:gap-24 items-start">
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-[#0000FF] uppercase">
              <Target size={16} /> {locale === "ru" ? "ВЫЗОВ И ИССЛЕДОВАНИЕ" : locale === "kg" ? "ТАПШЫРМА ЖАНА ИЗИЛДӨӨ" : "THE BRIEF & CONTEXT"}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold tracking-[-0.06em] leading-[1.05] text-black">
              {t.projectDetail.challengeHeading}
            </h2>
            <div className="h-[2px] w-20 bg-[#0000FF] mt-2" />
          </div>
          
          <div className="flex flex-col gap-8">
            <p className="text-2xl sm:text-3xl md:text-[34px] font-light leading-[1.4] tracking-[-0.035em] text-black/85">
              {data.challenge}
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

      {/* Block 3: Redesigned Process Gallery (Interactive Exhibition) */}
      <motion.section 
        {...scrollRevealConfig}
        className="max-w-[1380px] mx-auto px-6 py-28 md:py-36 border-b border-black/[0.06]"
      >
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-[#0000FF] uppercase mb-4">
              <Sparkles size={16} /> {locale === "ru" ? "ПРОЦЕСС И ПРОЕКТИРОВАНИЕ" : locale === "kg" ? "ПРОЦЕСС ЖАНА ДОЛБООРЛОО" : "PROCESS & EXECUTION"}
            </span>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] leading-[1.02] text-black">
              {locale === "ru" ? "Этапы реализации" : locale === "kg" ? "Ишке ашыруу этаптары" : "Development Exhibition"}
            </h2>
          </div>
          <p className="text-lg text-black/55 max-w-md">
            {locale === "ru" 
              ? "От концептуальных набросков и 3D-чертежей до финального подбора материалов и текстур." 
              : locale === "kg"
              ? "Концептуалдык эскиздерден жана 3D чиймелерден баштап материалдарды жана текстураларды акыркы тандоого чейин."
              : "Every stage is a transition from digital concepts to high-end serial materials and functional systems."}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-12 lg:gap-16 items-stretch">
          {/* Controls / Stage description */}
          <div className="flex flex-col justify-between gap-8 py-2">
            <div className="flex flex-col gap-3">
              {data.processImages.map((_, idx) => {
                const stage = processStages[idx] || { label: `Stage 0${idx + 1}`, desc: "Process step details" };
                const isActive = activeTab === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`text-left p-6 rounded-2xl border transition-all duration-300 interactive-element ${
                      isActive 
                        ? "bg-white border-[#0000FF]/25 shadow-[0_15px_35px_rgba(0,0,0,0.02)] text-black" 
                        : "bg-transparent border-transparent text-black/45 hover:text-black hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold font-mono tracking-widest ${isActive ? "text-[#0000FF]" : "text-black/30"}`}>
                        STAGE 0{idx + 1}
                      </span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[#0000FF]" />}
                    </div>
                    <h4 className="text-xl font-bold tracking-tight mb-1">{stage.label}</h4>
                    <p className="text-sm opacity-80 leading-relaxed font-light">{stage.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="bg-black/5 p-6 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-semibold tracking-wider uppercase text-black/55">
                {locale === "ru" ? "АКТИВНЫЙ ШАГ" : locale === "kg" ? "АКТИВДҮҮ КАДАМ" : "ACTIVE VIEW"}
              </span>
              <span className="font-mono text-base font-bold text-[#0000FF]">
                0{activeTab + 1} / 0{data.processImages.length}
              </span>
            </div>
          </div>

          {/* Interactive display area */}
          <div className="relative aspect-[1.45] bg-[#eeeee9] rounded-[2.2rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-black/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <ImageWithFallback
                  src={data.processImages[activeTab] || data.processImages[0]}
                  className="w-full h-full object-cover"
                  alt={`Process Step ${activeTab + 1}`}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Quick helper controls inside the image */}
            <div className="absolute bottom-6 right-6 z-10 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab((prev) => (prev - 1 + data.processImages.length) % data.processImages.length)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-white flex items-center justify-center transition interactive-element"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab((prev) => (prev + 1) % data.processImages.length)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-white flex items-center justify-center transition interactive-element"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Block 4: Redesigned Results & Impact Showcase (Vibrant Grid) */}
      <motion.section 
        {...scrollRevealConfig}
        className="max-w-[1380px] mx-auto px-6 py-28 md:py-36"
      >
        <div className="grid lg:grid-cols-[1.8fr_1.2fr] gap-12 lg:gap-20 items-stretch">
          
          {/* Infographic Stats Panel */}
          <div className="bg-white border border-black/[0.05] rounded-[2.5rem] p-8 md:p-16 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-[#0000FF] uppercase mb-6">
                <Trophy size={16} /> {locale === "ru" ? "РЕЗУЛЬТАТЫ И ВЛИЯНИЕ" : locale === "kg" ? "НАТЫЙЖАЛАР ЖАНА ТААСИР" : "RESULTS & KEY IMPACT"}
              </span>
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

          {/* Sidebar decorative final result layout */}
          <div className="relative rounded-[2.5rem] overflow-hidden border border-black/5 bg-[#eeeee9] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-end min-h-[420px] lg:min-h-0">
            <ImageWithFallback
              src={data.processImages[data.processImages.length - 1] || data.processImages[0]}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              alt="Final showcase"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="relative z-10 p-8 text-white">
              <span className="font-mono text-xs tracking-wider text-white/50 font-semibold uppercase block mb-1">
                {locale === "ru" ? "ФИНАЛЬНЫЙ РЕНДЕР" : locale === "kg" ? "АКЫРКЫ ВИЗУАЛ" : "FINAL SHOWCASE"}
              </span>
              <h4 className="text-xl font-bold tracking-tight">
                {data.name} — {data.year}
              </h4>
            </div>
          </div>

        </div>
      </motion.section>
    </div>
  );
}
