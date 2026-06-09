import { motion } from "motion/react";
import { ArrowUpRight, Circle, Sparkles } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import referenceA from "../../imports/image.png";
import referenceB from "../../imports/image_2026-06-09_10-31-16.png";
import logoSvg from "../../imports/logo__2_-2.svg";

const services = [
  ["01", "Product", "UI/UX, физические объекты, промышленная логика и интерфейсы сложных систем."],
  ["02", "Transport", "Экстерьеры, cockpit experience, CMF и презентационные 3D-сцены."],
  ["03", "Architecture", "Пространства, павильоны и интерьерные концепции с инженерной дисциплиной."],
  ["04", "Brand", "Айдентика, motion-система, визуальный язык и запуск продукта."],
];

const projects = [
  { title: "Sandyq", tag: "Hospitality / Identity", image: referenceA },
  { title: "Ala-Too", tag: "Strategy / Web", image: referenceB },
  { title: "Ordo X", tag: "Architecture / 3D", image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=90&w=1400" },
];

function ChromeDots() {
  return <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-black/15" /><span className="h-2.5 w-2.5 rounded-full bg-black/10" /><span className="h-2.5 w-2.5 rounded-full bg-[#0000FF]" /></div>;
}

export function Home() {
  const [active, setActive] = useState(0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden pb-24">
      <section className="px-3 sm:px-6 pt-8">
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.985 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#f6f6f2]/90 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.10)] sm:rounded-[2.7rem] sm:p-8"
        >
          <div className="relative h-[72vh] min-h-[620px] overflow-hidden rounded-[1.5rem] bg-[#eeeee9] sm:rounded-[2rem]">
            <ImageWithFallback src={referenceB} alt="Steel Drake visual reference" className="absolute inset-x-6 top-6 h-[31%] w-[calc(100%-3rem)] rounded-[1.35rem] object-cover grayscale contrast-125 sm:inset-x-10 sm:top-8 sm:w-[calc(100%-5rem)]" />
            <div className="absolute inset-x-6 top-6 h-[31%] rounded-[1.35rem] bg-gradient-to-r from-black/50 via-transparent to-black/20 sm:inset-x-10 sm:top-8" />

            <motion.div
              animate={{ x: ["-8%", "4%", "-8%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[-8%] top-[18%] h-16 w-[116%] -rotate-6 rounded-full border border-[#0000FF]/25 bg-[#0000FF]/10 text-[#0000FF] backdrop-blur-md"
            >
              <div className="flex h-full items-center whitespace-nowrap text-lg tracking-tight sm:text-2xl">
                <span className="mx-10">Engineering Beauty / Rendering Future / Steel Drake Studio /</span>
                <span className="mx-10">Engineering Beauty / Rendering Future / Steel Drake Studio /</span>
              </div>
            </motion.div>

            <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-white/85 sm:left-10 sm:right-10 sm:top-9">
              <ChromeDots />
              <span>SteelDrake®</span>
              <span>2011—Now</span>
            </div>

            <div className="absolute bottom-8 left-6 right-6 grid gap-8 sm:bottom-10 sm:left-10 sm:right-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white interactive-element"><Sparkles size={14} /> Design systems for objects, spaces and screens</div>
                <h1 className="max-w-[780px] text-[clamp(4.7rem,12vw,11.8rem)] font-semibold leading-[0.88] tracking-[-0.085em] text-black">
                  Steel<br /><span className="text-[#0000FF]">Drake</span>
                </h1>
              </div>
              <div className="grid gap-5 lg:justify-items-end">
                <p className="max-w-[420px] text-balance text-lg leading-[1.16] tracking-[-0.035em] text-black/75 sm:text-2xl">
                  Премиальная дизайн-студия на стыке инженерии, 3D-материалов и спокойной цифровой роскоши.
                </p>
                <a href="/projects" className="group inline-flex w-fit items-center gap-4 rounded-full bg-[#0000FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black interactive-element">
                  Смотреть проекты <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-6 grid max-w-[1380px] grid-cols-1 gap-4 px-3 sm:px-6 md:grid-cols-4 md:auto-rows-[300px]">
        <motion.div whileHover={{ y: -6 }} className="group flex min-h-[300px] flex-col rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.05)] transition hover:border-[#0000FF]/60 interactive-element md:col-span-2">
          <p className="text-sm text-black/45">about[01]</p><div className="mt-auto text-[clamp(5.2rem,10vw,7rem)] font-semibold leading-[0.96] tracking-[-0.08em] text-[#0000FF]">13+</div><p className="mt-3 max-w-[520px] text-[clamp(1.25rem,2.25vw,1.75rem)] leading-[1.14] tracking-[-0.055em]">лет формируем продукты, бренды и пространства.</p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#0000FF] p-7 text-white interactive-element">
          <Circle className="absolute -right-12 -top-12 h-56 w-56 opacity-20" strokeWidth={0.6} />
          <p className="text-sm text-white/60">global[02]</p><p className="mt-16 text-[clamp(1.55rem,2.5vw,2rem)] leading-[1.12] tracking-[-0.06em]">Проекты для рынков Центральной Азии, Европы и digital-first команд.</p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="rounded-[2rem] border border-black/10 bg-[#f1f1ed] p-7 interactive-element">
          <p className="text-sm text-black/45">principle[03]</p><p className="mt-16 text-[clamp(1.6rem,2.5vw,2rem)] leading-[1.12] tracking-[-0.06em]">Минимум шума. Максимум тактильности.</p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="relative flex min-h-[300px] overflow-hidden rounded-[2rem] border border-black/10 bg-black p-7 text-white interactive-element md:col-span-2">
          <p className="text-sm text-white/45">studio[04]</p><p className="mt-auto max-w-[720px] text-left text-[clamp(2.05rem,4.65vw,3.75rem)] leading-[1.04] tracking-[-0.075em]">Форма будущего должна казаться неизбежной.</p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="overflow-hidden rounded-[2rem] border border-black/10 bg-white interactive-element md:col-span-2">
          <ImageWithFallback src={referenceA} alt="interface collage" className="h-full w-full object-cover opacity-90 transition duration-700 hover:scale-105" />
        </motion.div>
      </section>

      <section className="mx-auto mt-28 max-w-[1380px] px-3 sm:px-6">
        <div className="mb-8 flex items-end justify-between"><h2 className="text-5xl font-semibold tracking-[-0.07em] sm:text-8xl">Services</h2><span className="hidden text-sm text-black/45 sm:block">hover / expand</span></div>
        <div className="flex min-h-[620px] flex-col gap-3 md:h-[620px] md:flex-row">
          {services.map((s, i) => (
            <motion.button key={s[1]} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} animate={{ flex: active === i ? 2.7 : 0.82 }} transition={{ type: "spring", stiffness: 170, damping: 24 }} className="group relative min-h-[210px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#f4f4f0] p-7 text-left transition hover:border-[#0000FF]/60 interactive-element md:min-h-0">
              <span className="text-sm text-[#0000FF]">{s[0]}</span><h3 className="mt-4 text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">{s[1]}</h3>
              <motion.p animate={{ opacity: active === i ? 1 : 0 }} className="absolute bottom-7 left-7 right-7 max-w-md text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.16] tracking-[-0.05em] text-black/70">{s[2]}</motion.p>
              <ArrowUpRight className="absolute right-7 top-7 text-[#0000FF]" />
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-[1380px] px-3 sm:px-6">
        <h2 className="mb-8 text-5xl font-semibold tracking-[-0.07em] sm:text-8xl">Selected work</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((p, i) => <a key={p.title} href={`/projects/${i + 1}`} className="group relative h-[520px] overflow-hidden rounded-[2rem] border border-black/10 bg-black interactive-element"><ImageWithFallback src={p.image} alt={p.title} className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95" /><div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] bg-white/88 p-5 backdrop-blur-xl transition group-hover:bg-[#0000FF] group-hover:text-white"><p className="text-sm opacity-60">0{i + 1} / {p.tag}</p><h3 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">{p.title}</h3></div></a>)}
        </div>
      </section>
    </motion.div>
  );
}
