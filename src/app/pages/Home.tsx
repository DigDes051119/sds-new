import { motion } from "motion/react";
import { ArrowUpRight, Circle, Sparkles } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import abstractBlue from "../../imports/abstract_blue.webp";
import projectImg1 from "../../imports/image.png";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16.png";

export function Home() {
  const { t, locale } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const services = t.home.services;
  const projects = t.home.projects;

  const categoryMap: Record<string, string> = {
    "Brand": "branding",
    "Industrial Design": "industrial",
    "Marketing": "marketing",
    "Concept Design": "concept"
  };

  const handleServiceClick = (i: number, serviceName: string) => {
    if (active === i) {
      const catKey = categoryMap[serviceName];
      if (catKey) {
        navigate(`/projects?category=${catKey}`);
      } else {
        navigate("/projects");
      }
    } else {
      setActive(i);
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  const serviceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const observers = serviceRefs.current.map((el, index) => {
      if (!el) return null;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(index);
          }
        });
      }, {
        rootMargin: "-25% 0px -45% 0px",
        threshold: 0.1
      });
      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach(obs => obs?.disconnect());
    };
  }, [isMobile]);

  const homeProjects = projects.map((p, i) => {
    const ids = ["sandyq", "ala-too", "one-ordo", "salkyn", "techstart", "auto-concept-x"];
    const images = [
      projectImg1,
      projectImg2,
      "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600"
    ];
    return {
      ...p,
      id: ids[i] || "default",
      image: images[i]
    };
  });

  const scrollRevealConfig = {
    initial: { y: 40, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.9, ease: [0.215, 0.61, 0.355, 1] } // Apple-style easeOutCubic/Quint variation
  };

  return (
    <div className="overflow-hidden pb-24">
      {/* Hero Section */}
      <section className="px-3 sm:px-6 pt-8">
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.985 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#f6f6f2]/90 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.10)] sm:rounded-[2.7rem] sm:p-8"
        >
          <div className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] bg-[#eeeee9] sm:rounded-[2rem]">
            <div className="absolute bottom-8 left-6 right-6 grid gap-8 sm:bottom-10 sm:left-10 sm:right-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
              <div className="flex flex-col gap-5 max-w-[680px]">
                <h1 className="text-[clamp(3.8rem,9vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.075em] text-black">
                  AT FIRST<br /><span className="text-[#0000FF]">DESIGN</span>
                </h1>
                <p className="text-balance text-sm font-medium italic text-black/45 leading-relaxed border-l-2 border-[#0000FF]/30 pl-4 mt-2">
                  {t.home.heroTag}
                </p>
              </div>
              <div className="flex flex-col gap-6 items-start lg:pl-8">
                <p className="text-balance text-lg sm:text-[19px] leading-[1.35] tracking-[-0.03em] text-black/80">
                  {t.home.heroDescription}
                </p>
                <Link to="/projects" className="group inline-flex w-fit items-center gap-4 rounded-full bg-[#0000FF] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black interactive-element mt-1">
                  {t.home.viewProjects} <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Projects Block */}
      <motion.section 
        {...scrollRevealConfig}
        className="mx-auto mt-24 max-w-[1380px] px-3 sm:px-6"
      >
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] leading-[1.02] text-black mb-8">
          {locale === "ru" ? "Недавние проекты" : locale === "kg" ? "Жакында долбоорлор" : "Recent projects"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[t.home.newProject, t.home.recentProject].map((project) => (
            <motion.div
              key={project.title}
              whileHover={{ y: -6 }}
              className="group flex min-h-[300px] flex-col rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.05)] transition interactive-element"
            >
              <span className="text-sm text-black/45">{project.label}</span>
              <h3 className="mt-4 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">{project.title}</h3>
              <p className="mt-5 max-w-xl text-[clamp(1.1rem,2vw,1.45rem)] leading-[1.5] tracking-[-0.035em] text-black/70">{project.description}</p>
              <div className="mt-auto flex flex-wrap items-center gap-4 text-sm text-black/60">
                <span>{project.publishedLabel}</span>
                <span>{project.date}</span>
                <span>{project.time}</span>
              </div>
              <Link to="/projects" className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-[#0000FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black">
                {project.action}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats/Philosophy Grid */}
      <motion.section 
        {...scrollRevealConfig}
        className="mx-auto mt-16 grid max-w-[1380px] grid-cols-1 gap-4 px-3 sm:px-6 md:grid-cols-4 md:auto-rows-[300px]"
      >
        <motion.div whileHover={{ y: -6 }} className="group flex min-h-[300px] flex-col rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.05)] transition interactive-element md:col-span-2">
          <p className="text-sm text-black/45">about[01]</p><div className="mt-auto text-[clamp(5.2rem,10vw,7rem)] font-semibold leading-[0.96] tracking-[-0.08em] text-[#0000FF]">{t.home.statsYears}</div><p className="mt-3 max-w-[520px] text-[clamp(1.25rem,2.25vw,1.75rem)] leading-[1.14] tracking-[-0.055em]">{t.home.statsLabel}</p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#0000FF] p-7 text-white interactive-element">
          <Circle className="absolute -right-12 -top-12 h-56 w-56 opacity-20" strokeWidth={0.6} />
          <p className="text-sm text-white/60">global[02]</p><p className="mt-16 text-[clamp(1.55rem,2.5vw,2rem)] leading-[1.12] tracking-[-0.06em]">{t.home.globalLabel}</p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="rounded-[2rem] border border-black/10 bg-[#f1f1ed] p-7 interactive-element">
          <p className="text-sm text-black/45">principle[03]</p><p className="mt-16 text-[clamp(1.6rem,2.5vw,2rem)] leading-[1.12] tracking-[-0.06em]">{t.home.principleLabel}</p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="relative flex min-h-[300px] overflow-hidden rounded-[2rem] border border-black/10 bg-black p-7 text-white interactive-element md:col-span-2">
          <p className="text-sm text-white/45">studio[04]</p><p className="mt-auto max-w-[720px] text-left text-[clamp(2.05rem,4.65vw,3.75rem)] leading-[1.04] tracking-[-0.075em]">{t.home.studioLabel}</p>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="overflow-hidden rounded-[2rem] border border-black/10 bg-white interactive-element md:col-span-2">
          <ImageWithFallback src={abstractBlue} alt="abstract blue art" className="h-full w-full object-cover opacity-90 transition duration-700 hover:scale-105" />
        </motion.div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        {...scrollRevealConfig}
        className="mx-auto mt-28 max-w-[1380px] px-3 sm:px-6"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-5xl font-semibold tracking-[-0.07em] sm:text-8xl">{t.home.servicesTitle}</h2>
          <Link
            to="/services"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-black/20 hover:border-[#0000FF] hover:text-[#0000FF] rounded-full text-[17px] font-semibold transition-all duration-300 interactive-element whitespace-nowrap mb-2 sm:mb-0"
          >
            {locale === "ru" ? "Смотреть все услуги" : locale === "kg" ? "Бардык кызматтарды көрүү" : "View all services"}
          </Link>
        </div>
        <div className="flex flex-col gap-3 md:h-[620px] md:flex-row">
          {services.map((s, i) => (
            <motion.button 
              key={s[1]} 
              ref={(el) => { serviceRefs.current[i] = el; }}
              onMouseEnter={() => !isMobile && setActive(i)} 
              onClick={() => handleServiceClick(i, s[1])} 
              animate={isMobile ? {} : { flex: active === i ? 2.7 : 0.82 }} 
              transition={{ type: "spring", stiffness: 170, damping: 24 }} 
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-black/10 bg-[#f4f4f0] p-7 text-left transition hover:border-[#0000FF]/60 interactive-element min-h-[140px] md:min-h-0 md:h-full"
            >
              <div>
                <span className="text-sm text-[#0000FF]">{s[0]}</span>
                <h3 className="mt-4 text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">{s[1]}</h3>
              </div>

              <motion.div 
                animate={isMobile ? { 
                  height: active === i ? "auto" : 0, 
                  opacity: active === i ? 1 : 0,
                  marginTop: active === i ? 16 : 0
                } : {
                  opacity: active === i ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={isMobile ? "overflow-hidden" : "absolute bottom-7 left-7 right-7 max-w-md"}
              >
                <p className="text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.16] tracking-[-0.05em] text-black/70">
                  {s[2]}
                </p>
              </motion.div>
              <ArrowUpRight className="absolute right-7 top-7 text-[#0000FF]" />
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Selected Works Section */}
      <motion.section 
        {...scrollRevealConfig}
        className="mx-auto mt-28 max-w-[1380px] px-3 sm:px-6"
      >
        <h2 className="mb-8 text-5xl font-semibold tracking-[-0.07em] sm:text-8xl">{t.home.selectedWorkTitle}</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {homeProjects.map((p, i) => (
            <Link key={p.title} to={`/projects/${p.id}`} className="group relative h-[520px] overflow-hidden rounded-[2rem] bg-black interactive-element">
              <ImageWithFallback src={p.image} alt={p.title} className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95" />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] bg-white/88 p-5 backdrop-blur-xl transition group-hover:bg-[#0000FF] group-hover:text-white">
                <p className="text-sm opacity-60">0{i + 1} / {p.tag}</p>
                <h3 className="mt-2 text-4xl font-semibold tracking-[-0.06em]">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
