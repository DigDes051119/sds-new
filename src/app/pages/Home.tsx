import { motion } from "motion/react";
import { ArrowUpRight, Circle, Sparkles } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import { cmsService } from "../cmsService";
import abstractBlue from "../../imports/abstract_blue.webp";
import projectImg1 from "../../imports/image.png";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16.png";

export function Home() {
  const { t, locale } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const services = t.home.services;
  const projects = t.home.projects;

  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProjectDetails(cmsService.getProjectDetails());
    });
  }, []);

  const allDbProjects = t.projects?.items || [];
  const localizedDetails = projectDetails[locale] || projectDetails["ru"] || {};

  const recentWorks = allDbProjects.length >= 2
    ? [...allDbProjects].slice(-2).reverse().map((p, idx) => {
        const detail = localizedDetails[p.id] || {};
        return {
          id: p.id,
          label: idx === 0
            ? (locale === "ru" ? "Новый проект" : locale === "kg" ? "Жаңы долбоор" : "New project")
            : (locale === "ru" ? "Недавний проект" : locale === "kg" ? "Жакында долбоор" : "Recent project"),
          title: p.name || "",
          description: detail.desc || "",
          image: p.img || projectImg1,
          date: detail.year || "2026",
          action: locale === "ru" ? "Посмотреть" : locale === "kg" ? "Караңыз" : "View"
        };
      })
    : [
        {
          id: "sandyq",
          label: t.home.newProject.label,
          title: t.home.newProject.title,
          description: t.home.newProject.description,
          image: projectImg1,
          date: t.home.newProject.date,
          action: t.home.newProject.action
        },
        {
          id: "ala-too",
          label: t.home.recentProject.label,
          title: t.home.recentProject.title,
          description: t.home.recentProject.description,
          image: projectImg2,
          date: t.home.recentProject.date,
          action: t.home.recentProject.action
        }
      ];

  const serviceImages = [
    "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/services/brand.png", // Brand
    "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/services/industrial.png", // Industrial Design
    "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/services/marketing.png", // Marketing
    "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/services/concept.png"  // Concept Design
  ];

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
    // Helper fallback for legacy static values
    const legacyIds = ["sandyq", "ala-too", "one-ordo", "salkyn", "techstart", "auto-concept-x"];
    const legacyImages = [
      projectImg1,
      projectImg2,
      "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600"
    ];

    return {
      id: p.id || legacyIds[i] || "default",
      title: p.title || p.name || "",
      tag: p.tag || p.category || "",
      image: p.image || p.img || legacyImages[i] || projectImg1
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
      <section className="px-3 sm:px-6 min-[1380px]:px-0 pt-10 sm:pt-16">
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.985 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-[1380px] pt-16 pb-20 sm:pt-24 sm:pb-28"
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
            <div className="flex flex-col gap-5 max-w-[900px]">
              <h1 className="text-[clamp(3.5rem,15vw,13rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-black">
                AT FIRST<br /><span className="text-[#0000FF]">DESIGN</span>
              </h1>
            </div>
            <div className="flex flex-col justify-between items-start lg:items-end lg:pl-8 lg:h-full gap-6 lg:gap-0">
              <p className="text-balance text-lg sm:text-[19px] leading-[1.35] tracking-[-0.03em] text-black/80 text-left lg:text-right">
                {t.home.heroDescription}
              </p>
              <Link to="/projects" className="group inline-flex w-fit items-center gap-4 rounded-full bg-[#0000FF] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black interactive-element mt-1 lg:self-end lg:-translate-y-3">
                {t.home.viewProjects} <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Projects Block */}
      <motion.section 
        {...scrollRevealConfig}
        className="px-3 sm:px-6 mt-24"
      >
        <div className="mx-auto max-w-[1380px]">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] leading-[1.02] text-black mb-8">
            {locale === "ru" ? "Недавние проекты" : locale === "kg" ? "Жакында долбоорлор" : "Recent projects"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {recentWorks.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                className="group flex flex-col rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.05)] transition interactive-element"
              >
                <div className="w-full aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-6 bg-[#eeeee9]">
                  <ImageWithFallback src={project.image} alt={project.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-102" />
                </div>
                <span className="text-sm text-black/45">{project.label}</span>
                <h3 className="mt-3 text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">{project.title}</h3>
                <p className="mt-4 max-w-xl text-[clamp(1.1rem,2vw,1.35rem)] leading-[1.45] tracking-[-0.035em] text-black/70 line-clamp-3">{project.description}</p>
                <div className="mt-auto pt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
                  <span>{locale === "ru" ? "Опубликовано" : locale === "kg" ? "Жарыяланды" : "Published"}</span>
                  <span>{project.date}</span>
                </div>
                <Link to={`/projects/${project.id}`} className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-[#0000FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black">
                  {project.action}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats/Philosophy Grid */}
      <motion.section 
        {...scrollRevealConfig}
        className="px-3 sm:px-6 mt-16"
      >
        <div className="mx-auto max-w-[1380px] grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[300px]">
          <motion.div whileHover={{ y: -6 }} className="group flex min-h-[300px] flex-col rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.05)] transition interactive-element md:col-span-2">
            <p className="text-sm text-black/45">about[01]</p><div className="mt-auto text-[clamp(5.2rem,10vw,7rem)] font-semibold leading-[0.96] tracking-[-0.08em] text-[#0000FF]">{t.home.statsYears}</div><p className="mt-3 max-w-[520px] text-[26px] leading-[1.14] tracking-[-0.03em]">{t.home.statsLabel}</p>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#0000FF] p-7 text-white interactive-element">
            <Circle className="absolute -right-12 -top-12 h-56 w-56 opacity-20" strokeWidth={0.6} />
            <p className="text-sm text-white/60">global[02]</p><p className="mt-16 text-[26px] leading-[1.12] tracking-[-0.03em]">{t.home.globalLabel}</p>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="rounded-[2rem] border border-black/10 bg-[#f1f1ed] p-7 interactive-element">
            <p className="text-sm text-black/45">principle[03]</p><p className="mt-16 text-[26px] leading-[1.12] tracking-[-0.03em]">{t.home.principleLabel}</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        {...scrollRevealConfig}
        className="px-3 sm:px-6 mt-28"
      >
        <div className="mx-auto max-w-[1380px]">
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
            {services.map((s, i) => {
              const imageSrc = s[3] || serviceImages[i % serviceImages.length];
              return (
                <motion.button 
                  key={s[1]} 
                  ref={(el) => { serviceRefs.current[i] = el; }}
                  onMouseEnter={() => !isMobile && setActive(i)} 
                  onClick={() => handleServiceClick(i, s[1])} 
                  animate={isMobile ? {} : { flex: active === i ? 2.7 : 0.82 }} 
                  transition={{ type: "spring", stiffness: 170, damping: 24 }} 
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-black/10 bg-[#f4f4f0] p-7 text-left transition hover:border-[#0000FF]/60 interactive-element min-h-[140px] md:min-h-0 md:h-full"
                >
                  <div className={active === i && !isMobile ? "max-w-[55%]" : ""}>
                    <span className="text-sm text-[#0000FF]">{s[0]}</span>
                    <h3 className="mt-4 text-4xl font-semibold tracking-[-0.07em] sm:text-6xl">{s[1]}</h3>
                  </div>

                  {/* Desktop Image */}
                  {active === i && !isMobile && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute right-0 top-0 bottom-0 w-[42%] overflow-hidden bg-black/5"
                    >
                      <img src={imageSrc} alt={s[1]} className="w-full h-full object-cover" />
                    </motion.div>
                  )}

                  <div 
                    className={`transition-all duration-500 ease-out ${
                      isMobile ? "overflow-hidden" : "absolute bottom-7 left-7 w-[320px]"
                    } ${
                      active === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                    style={isMobile ? {
                      height: active === i ? "auto" : 0,
                      marginTop: active === i ? 16 : 0
                    } : undefined}
                  >
                    <p className="text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.16] tracking-[-0.05em] text-black/70">
                      {s[2]}
                    </p>
                    
                    {/* Mobile Image */}
                    {isMobile && (
                      <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mt-4 bg-black/5">
                        <img src={imageSrc} alt={s[1]} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  
                  <div className={`absolute right-7 top-7 p-2 rounded-full transition-all duration-300 z-10 ${
                    active === i && !isMobile 
                      ? "bg-white text-[#0000FF] shadow-lg scale-110" 
                      : "bg-transparent text-[#0000FF]"
                  }`}>
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Selected Works Section */}
      <motion.section 
        {...scrollRevealConfig}
        className="px-3 sm:px-6 mt-28"
      >
        <div className="mx-auto max-w-[1380px]">
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
        </div>
      </motion.section>
    </div>
  );
}
