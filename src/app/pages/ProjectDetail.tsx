import { motion } from "motion/react";
import { useParams } from "react-router";
import videoSrc from "../../imports/__Copy_this_cozy_soft_life_quote_roundup_that_feel_luxe_without_spending_a_fortune_that_balance_trend_comfort_and_everyday_function_and_make_your_-_Pin-1090082284813034216.mp4";
import { useEffect, useRef } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Mock data for projects
const projectData: Record<string, any> = {
  "sandyq": {
    name: "Sandyq",
    desc: "Комплексный ребрендинг и архитектурная концепция для национальной сети.",
    client: "Sandyq Group",
    year: "2024",
    service: "Брендинг, Архитектура",
    challenge: "Создать аутентичный, но современный образ, который будет одинаково хорошо работать как в городских пространствах, так и в рекреационных зонах.",
    processImages: [
      "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600"
    ],
    results: [
      "Выход на международный рынок",
      "Увеличение вовлеченности аудитории на 40%"
    ]
  }
};

export function ProjectDetail() {
  const { id } = useParams();
  const data = id && projectData[id] ? projectData[id] : {
    name: "Проект",
    desc: "Описание проекта.",
    client: "Неизвестно",
    year: "2025",
    service: "Разработка",
    challenge: "Сформировать инновационный подход к классической проблеме.",
    processImages: [
      "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600"
    ],
    results: ["Успешный запуск"]
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Parallax effect for horizontal scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current) {
        // If we're hovering the scroll container, maybe translate vertical scroll to horizontal?
        // Let's just use standard CSS overflow-x for simplicity and smoothness
      }
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] w-full bg-black flex flex-col justify-end p-6 md:p-12 pb-24">
        {id === 'sandyq' ? (
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-end gap-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.08] mb-4">{data.name}</h1>
            <p className="text-xl md:text-2xl font-light opacity-90">{data.desc}</p>
          </div>
          
          <div className="flex gap-8 md:gap-16 text-sm uppercase tracking-widest font-medium opacity-80 shrink-0">
            <div>
              <p className="opacity-50 mb-1">Клиент</p>
              <p>{data.client}</p>
            </div>
            <div>
              <p className="opacity-50 mb-1">Год</p>
              <p>{data.year}</p>
            </div>
            <div>
              <p className="opacity-50 mb-1">Услуга</p>
              <p>{data.service}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="max-w-[1440px] mx-auto px-6 py-32 grid md:grid-cols-2 gap-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.08] text-[#0000FF]">
          Задача и Вызов
        </h2>
        <div className="text-2xl md:text-3xl font-light leading-relaxed text-black/80">
          {data.challenge}
        </div>
      </section>

      {/* Process Horizontal Scroll */}
      <section className="w-full py-16 overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto px-6 md:px-12 pb-12 snap-x snap-mandatory hide-scrollbar"
        >
          {data.processImages.map((img: string, idx: number) => (
            <div key={idx} className="min-w-[85vw] h-[70vh] rounded-3xl overflow-hidden snap-center relative shrink-0">
              <ImageWithFallback 
                src={img} 
                className="w-full h-full object-cover" 
                alt={`Process ${idx + 1}`}
              />
            </div>
          ))}
          {/* Add a placeholder image so scroll looks longer */}
          <div className="min-w-[85vw] h-[70vh] rounded-3xl overflow-hidden snap-center relative shrink-0">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600" 
              className="w-full h-full object-cover" 
              alt="Process"
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-[1440px] mx-auto px-6 pt-16">
        <div className="bg-[#F8F8F9] rounded-3xl p-12 md:p-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-12">Результат</h2>
            <ul className="space-y-6">
              {data.results.map((res: string, idx: number) => (
                <li key={idx} className="flex items-center gap-4 text-xl md:text-2xl font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#0000FF] shrink-0" />
                  {res}
                </li>
              ))}
            </ul>
          </div>
          <div className="h-[400px] rounded-2xl overflow-hidden">
             <ImageWithFallback 
                src={data.processImages[0]} 
                className="w-full h-full object-cover" 
                alt="Final result"
              />
          </div>
        </div>
      </section>

    </motion.div>
  );
}
