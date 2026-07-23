import { NavLink, Link, useLocation, useOutlet } from "react-router";
import { useEffect, useState, useRef } from "react";
import { LanguageContext, translations, type Language } from "../i18n";
import { cmsService } from "../cmsService";
import logo from "../../imports/logo__2_.svg";
import { motion, AnimatePresence } from "motion/react";
import { supabaseClient } from "../supabaseClient";
import { Menu, X, ArrowUp, ThumbsUp } from "lucide-react";
import { ArchiveOriginsSection } from "./ArchiveOriginsSection";
export function Root() {
  const location = useLocation();
  const outlet = useOutlet();
  const [locale, setLocale] = useState<Language>("en");
  const [siteTranslations, setSiteTranslations] = useState(() => cmsService.getTranslations());
  
  const navClusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = navClusterRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.offsetWidth;
      if (w > 0) {
        document.documentElement.style.setProperty('--sds-nav-cluster-width', `${w}px`);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [locale, location.pathname]);
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPreloader, setShowPreloader] = useState(false);
  const [preloaderActive, setPreloaderActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Contact form states
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingForm(true);
    setFormError("");
    try {
      await supabaseClient.insertTable("sds_leads", [{
        name: formName,
        email: formContact,
        message: formMessage,
        archived: false,
        created_at: new Date().toISOString()
      }]);
      setFormSuccess(true);
      setFormName("");
      setFormContact("");
      setFormMessage("");
      setTimeout(() => {
        setFormSuccess(false);
        setIsContactFormOpen(false);
      }, 2500);
    } catch (err: any) {
      setFormError(err.message || "Error submitting request");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  useEffect(() => {
    const handleOpenModal = () => setIsContactFormOpen(true);
    const handleArchiveOpen = () => setIsArchiveModalOpen(true);
    const handleArchiveClose = () => setIsArchiveModalOpen(false);
    
    window.addEventListener("sds:open-contact-modal", handleOpenModal);
    window.addEventListener("sds:archive-modal-open", handleArchiveOpen);
    window.addEventListener("sds:archive-modal-close", handleArchiveClose);
    
    return () => {
      window.removeEventListener("sds:open-contact-modal", handleOpenModal);
      window.removeEventListener("sds:archive-modal-open", handleArchiveOpen);
      window.removeEventListener("sds:archive-modal-close", handleArchiveClose);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloaderActive(false);
      setTimeout(() => {
        setShowPreloader(false);
      }, 1200);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return cmsService.subscribe(() => {
      setSiteTranslations(cmsService.getTranslations());
    });
  }, []);

  // Sync translations from Supabase on page load (without touching the preloader)
  useEffect(() => {
    cmsService.initSupabaseSync();
  }, []);


  // Log analytics visit on every page navigation
  useEffect(() => {
    supabaseClient.logVisit(location.pathname, locale);
  }, [location.pathname, locale]);

  const isProjectDetailPage = location.pathname.startsWith("/projects/") && location.pathname !== "/projects";
  const [showProjectBanner, setShowProjectBanner] = useState(false);
  const [projectBannerDismissed, setProjectBannerDismissed] = useState(false);

  useEffect(() => {
    setShowProjectBanner(false);
    setProjectBannerDismissed(false);
  }, [location.pathname]);

  // Scroll tracking — native scroll, no custom animation
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsScrolled(false);
    setShowScrollTop(false);
    let wasScrolled = false;
    const onScroll = () => {
      const scrolled = window.scrollY > 80;
      if (scrolled !== wasScrolled) {
        wasScrolled = scrolled;
        setIsScrolled(scrolled);
      }
      setShowScrollTop(window.scrollY > 300);

      // Project detail sticky banner: appears strictly when user reaches middle of page (50% scroll) and disappears when collage section ends
      if (isProjectDetailPage && !projectBannerDismissed) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        
        const collageEl = document.getElementById("project-collage-section");
        const collageRect = collageEl ? collageEl.getBoundingClientRect() : null;
        
        // Collage section has ended when its bottom edge scrolls above 30% of viewport
        const collageEnded = collageRect ? collageRect.bottom < window.innerHeight * 0.3 : false;

        if (scrollPct >= 48 && !collageEnded) {
          setShowProjectBanner(true);
        } else {
          setShowProjectBanner(false);
        }
      } else {
        setShowProjectBanner(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname, isProjectDetailPage, projectBannerDismissed]);

  useEffect(() => {
    window.scrollTo(0, 0);

    let observer: IntersectionObserver | null = null;

    const delayTimer = setTimeout(() => {
      window.scrollTo(0, 0);
      const sections = document.querySelectorAll("section");
      
      const observerOptions = {
        root: null,
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.05
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer?.unobserve(entry.target);
          }
        });
      }, observerOptions);

      sections.forEach((sec) => {
        if (!sec.classList.contains("reveal-visible")) {
          sec.classList.add("reveal-hidden");
          observer?.observe(sec);
        }
      });
    }, 150);

    return () => {
      clearTimeout(delayTimer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [location.pathname]);

  const t = siteTranslations[locale] || translations[locale];

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, locale]);

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.about, path: "/about" },
    { name: t.nav.services, path: "/services" },
    { name: t.nav.projects, path: "/projects" },
    { name: t.nav.products, path: "/products" },
    { name: t.nav.contacts, path: "/contacts" },
  ];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {/* Initial Website Preloader Screen */}
      {showPreloader && (
        <div 
          className={`fixed inset-0 bg-[#0000FF] z-[9999] flex flex-col justify-between p-8 md:p-[59px] overflow-hidden transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${
            preloaderActive ? 'translate-y-0' : 'translate-y-[-100%]'
          }`}
        >
          {/* Giant Brand Symbol cropped on the right */}
          <div className="absolute right-[-15%] top-0 h-full w-auto flex items-center justify-end z-0 pointer-events-none select-none">
            <svg 
              viewBox="0 0 302 237" 
              className="h-full w-auto text-white opacity-100"
              fill="currentColor"
            >
              <path d="M261.108 97.6614C244.926 89.2858 229.394 87.5781 226.467 87.2528L225.084 87.0901H150.842H53.9127C51.3919 86.6835 37.1615 87.9847 37.1615 75.0554C37.1615 63.7523 51.3919 63.427 53.9127 63.0204H125.878C125.878 63.0204 129.131 63.1018 132.221 66.1105C135.311 69.1192 135.88 75.0554 135.88 75.0554H157.348C159.543 75.0554 161.657 74.1607 163.202 72.6157C164.747 71.0707 165.642 68.9564 165.642 66.7609V8.457C165.642 6.26145 164.747 4.14721 163.202 2.60219L163.04 2.4394C161.495 0.894384 159.381 0 157.185 0H76.1123L74.7298 0.162544C71.8024 0.406494 56.2711 2.19545 40.089 10.5711C14.6369 23.7444 0 47.245 0 74.974C0 102.703 14.6369 126.204 40.089 139.377C56.2711 147.752 71.8024 149.46 74.7298 149.785L76.1123 149.948H150.842H248.748C251.268 150.354 265.499 149.054 265.499 161.983C265.499 173.286 251.268 173.611 248.748 174.018H175.563C175.563 174.018 172.31 174.018 169.22 170.927C166.78 168.569 165.642 161.983 165.642 161.983H144.337C142.141 161.983 140.027 162.877 138.482 164.422H138.401C136.856 166.049 135.961 168.163 135.961 170.358V228.5C135.961 230.695 136.856 232.81 138.401 234.355L138.563 234.517C140.108 236.062 142.223 236.957 144.418 236.957H165.723C199.551 236.957 191.338 236.957 225.166 236.957L226.548 236.794C229.475 236.55 245.007 234.761 261.189 226.385C286.641 213.212 301.278 189.712 301.278 161.983C301.278 134.254 286.641 110.753 261.189 97.58L261.108 97.6614Z" />
            </svg>
          </div>

          {/* Top Label */}
          <div className="font-mono text-[14px] text-white/60 uppercase tracking-[0.06em] z-10 relative">
            [ INITIALIZING SYSTEM ]
          </div>
          
          {/* Middle Brand Name */}
          <div className="flex flex-col gap-2 z-10 relative">
            <h1 className="text-[32px] md:text-[64px] font-normal text-white uppercase tracking-[-0.03em] leading-none m-0">
              STEEL DRAKE
            </h1>
            <div className="text-[16px] md:text-[21px] font-normal text-white/75 uppercase tracking-[0.04em]">
              STUDIO TEAM
            </div>
          </div>
          
          {/* Empty spacer to keep justify-between layout intact */}
          <div className="z-10 relative" />
        </div>
      )}

      <div className="min-h-screen bg-white text-black selection:bg-[#0000FF] selection:text-white relative flex flex-col font-twk-everett antialiased overflow-x-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Top Navigation Row: Clocks left, Expanded Menu & Languages right */}
        <header className={`w-full flex lg:grid lg:grid-cols-12 gap-[28px] justify-between lg:justify-start items-center pt-[30px] md:pt-[40px] px-[45px] md:px-[65px] lg:px-[105px] z-50 bg-white ${isProjectDetailPage ? 'pb-[20px] md:pb-[28px]' : 'pb-[30px] md:pb-[64px]'}`}>
          {/* Logo */}
          <div className="lg:col-span-3 flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src={logo} alt="Steel Drake Studio Team" className="h-[36px] md:h-[48px] w-auto object-contain" />
            </NavLink>
          </div>

          {/* Navigation Links and Languages (Desktop) */}
          <div className="hidden lg:flex lg:col-span-9 justify-end">
            <div ref={navClusterRef} className="flex flex-nowrap items-center gap-[28px] xl:gap-[40px] whitespace-nowrap">
              <nav className="flex flex-nowrap items-center gap-[20px] xl:gap-[28px]">
              {navLinks.map((link) => {
                if (link.path === "/projects") {
                  return (
                    <div key={link.path} className="relative group/navdropdown">
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `text-[16px] font-bold tracking-[-0.15px] uppercase transition-colors duration-300 group-hover/navdropdown:text-[#0000FF] relative pb-[6px] flex items-center gap-1 ${
                            isActive ? "text-[#0000FF]" : "text-black"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {link.name}
                            {isActive && (
                              <motion.div
                                layoutId="activeUnderline"
                                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0000FF]"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                          </>
                        )}
                      </NavLink>

                      {/* Dropdown Menu on Hover */}
                      <div className="absolute top-full -left-2 pt-3 opacity-0 pointer-events-none group-hover/navdropdown:opacity-100 group-hover/navdropdown:pointer-events-auto transition-all duration-300 ease-out z-[999]">
                        <div className="bg-white border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl p-4 min-w-[280px] flex flex-col gap-2 backdrop-blur-xl">
                          <NavLink
                            to="/projects"
                            end
                            className={({ isActive }) =>
                              `px-4 py-3 rounded-xl text-[13px] font-bold uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Актуальные проекты" : locale === "kg" ? "Учурдагы долбоорлор" : "Current Projects"}</span>
                          </NavLink>
                          
                          <NavLink
                            to="/projects/old"
                            className={({ isActive }) =>
                              `px-4 py-3 rounded-xl text-[13px] font-bold uppercase transition-all duration-200 flex items-center justify-between gap-3 tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Старые проекты" : locale === "kg" ? "Эски долбоорлор" : "Old Projects"}</span>
                            <span className="text-[11px] font-mono text-[#808080] font-normal tracking-normal shrink-0">(2005 — 2020)</span>
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-[16px] font-bold tracking-[-0.15px] uppercase transition-colors duration-300 hover:text-[#0000FF] relative pb-[6px] ${
                        isActive ? "text-[#0000FF]" : "text-black"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="activeUnderline"
                            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0000FF]"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <span className="hidden md:inline text-[#808080] text-[17px]">|</span>

            {/* Language Switcher */}
            <div className="flex gap-3">
              {['en', 'ru', 'kg'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setLocale(lang as Language)}
                  className={`text-[17px] font-normal tracking-[-0.15px] uppercase cursor-pointer transition-opacity relative pb-[6px] ${
                    locale === lang ? "text-black" : "text-[#808080] hover:text-black"
                  }`}
                >
                  {lang}
                  {locale === lang && (
                    <motion.div
                      layoutId="activeLanguage"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

          {/* Mobile Right Side: Language Switcher */}
          <div className="flex lg:hidden items-center justify-end">
            <div className="flex gap-2">
              {['en', 'ru', 'kg'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setLocale(lang as Language)}
                  className={`text-[13px] font-mono tracking-[-0.15px] uppercase cursor-pointer transition-opacity relative pb-[2px] ${
                    locale === lang ? "text-[#0000FF] font-bold" : "text-[#808080] hover:text-black"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </header>


        {/* Main Content + Footer container */}
        <div className="flex flex-col flex-grow">
          {/* Main Content Area */}
          <main key={location.pathname} className="w-full flex-grow px-[45px] md:px-[65px] lg:px-[105px] page-transition overflow-hidden">
            {outlet}
          </main>

          {/* Section: Откуда мы начинали (Archives 2005–2020) — Max 9 items on homepage */}
          {location.pathname === "/" && <ArchiveOriginsSection limit={9} showYearFilter={false} />}

          {/* Footer */}
          <footer className="w-full bg-white text-black pt-16 md:pt-20 pb-36 md:pb-40 lg:pb-24 mt-16 md:mt-20 border-t border-black/10 font-twk-everett px-[45px] md:px-[65px] lg:px-[105px]">
            <div className="w-full">
              {/* Top Row: Button and Social Links */}
              <div className="flex flex-row justify-between items-start">
                <button
                  type="button"
                  onClick={() => setIsContactFormOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-black/30 !rounded-full text-[14px] font-normal hover:bg-[#0000FF] hover:text-white hover:border-[#0000FF] transition-all duration-300 interactive-element cursor-pointer"
                >
                  {locale === "ru" ? "Давайте обсудим" : locale === "kg" ? "Сүйлөшөлү" : "Let's Talk"}
                </button>

                <div className="flex flex-col items-end gap-3 text-right">
                  <a
                    href="https://www.instagram.com/steeldrakestudioteam/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[15px] font-normal hover:opacity-80 transition-opacity interactive-element"
                  >
                    Instagram <span className="text-[14px] font-sans">↗</span>
                  </a>
                  <a
                    href="https://wa.me/996702507888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[15px] font-normal hover:opacity-80 transition-opacity interactive-element"
                  >
                    WhatsApp <span className="text-[14px] font-sans">↗</span>
                  </a>
                </div>
              </div>

              {/* Huge Email Address */}
              <div className="mt-8 mb-16">
                <a
                  href="mailto:contact@steeldrakestudio.com"
                  className="text-[18px] xs:text-[22px] sm:text-4xl md:text-5xl lg:text-[76px] font-normal tracking-[-0.04em] text-black leading-none hover:opacity-70 transition-opacity interactive-element block w-full break-all"
                >
                  contact@steeldrakestudio.com
                </a>
              </div>

              {/* Grid: Address and Call Us columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-16">
                <div className="md:col-span-4 flex flex-col gap-3">
                  <span className="text-[12px] font-mono tracking-[0.08em] text-black/40 uppercase">
                    {locale === "ru" ? "Office address" : locale === "kg" ? "Office address" : "Office address"}
                  </span>
                  <div className="text-[15px] leading-relaxed text-black font-normal">
                    Bishkek, Kyrgyzstan<br />
                    IT - Hub Technopark
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-3">
                  <span className="text-[12px] font-mono tracking-[0.08em] text-black/40 uppercase">
                    {locale === "ru" ? "Call us" : locale === "kg" ? "Call us" : "Call us"}
                  </span>
                  <a
                    href="tel:+996702507888"
                    className="text-[15px] text-black hover:opacity-80 transition-opacity interactive-element font-normal"
                  >
                    +996 702 507888
                  </a>
                </div>
              </div>

              {/* Divider line */}
              <div className="h-px bg-black/10 -mx-[45px] md:-mx-[65px] lg:-mx-[105px] mb-10" />

              {/* Bottom Row: Logo and Copyright */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                  <img
                    src={logo}
                    alt="Steel Drake Studio"
                    className="block h-10 w-auto object-contain cursor-pointer"
                  />
                </Link>
                <div className="flex flex-col items-center md:items-end gap-1">
                  <div className="text-[12px] text-black/55 uppercase font-mono tracking-[0.06em]">
                    &copy; 2026 STEEL DRAKE STUDIO TEAM. ALL RIGHT RESERVED
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* 2-Row Grid Tab Bar (Mobile) */}
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-black/10 z-[900] lg:hidden pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-3 w-full">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-center py-3 text-[10px] xs:text-[11px] sm:text-[12px] font-bold font-mono tracking-[0.02em] uppercase transition-colors duration-300 ${
                    index < 3 ? 'border-b border-black/10' : ''
                  } ${
                    (index + 1) % 3 !== 0 ? 'border-r border-black/10' : ''
                  } ${
                    isActive 
                      ? "text-[#0000FF]" 
                      : "text-black hover:text-[#0000FF]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Contact Form Overlay and Panel */}
        <AnimatePresence>
          {isContactFormOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsContactFormOpen(false)}
                className="fixed inset-0 bg-black/60 z-40"
              />

              {/* Form Panel */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
                transition={{ type: "spring", stiffness: 240, damping: 28 }}
                className="fixed top-1/2 left-1/2 bg-white border border-black p-8 md:p-10 z-45 select-none w-full max-w-[95vw] md:max-w-[760px]"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Bold Typographic Accent */}
                  <div className="col-span-12 md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#808080]/20 pb-6 md:pb-0 md:pr-8 text-left">
                    <div>
                      <div className="flex justify-between items-center md:block">
                        <span className="font-mono text-[#0000FF] text-[13px] uppercase tracking-[0.06em] block mb-1">[01/INQUIRY]</span>
                        {/* Close button for mobile */}
                        <button 
                          onClick={() => setIsContactFormOpen(false)}
                          className="md:hidden text-[#808080] hover:text-black font-mono text-[14px] cursor-pointer"
                        >
                          [X]
                        </button>
                      </div>
                      <h3 className="text-[28px] md:text-[32px] font-normal leading-[1.05] tracking-[-0.04em] lowercase text-black mt-2 whitespace-pre-line">
                        {locale === "ru" 
                          ? "создадим\nновый\nпроект\nвместе." 
                          : locale === "kg"
                            ? "жаңы\nдолбоорду\nбирге түзөлү."
                            : "let's\nshape\nnew ideas\ntogether."}
                      </h3>
                    </div>
                    <p className="font-mono text-[11px] text-[#808080] lowercase mt-6 md:mt-12 leading-relaxed">
                      {locale === "ru" 
                        ? "инженерные и дизайнерские решения с бескомпромиссным физическим и цифровым опытом." 
                        : locale === "kg"
                          ? "компромисссиз физикалык жана санариптик тажрыйбаны камсыз кылуу үчүн иштелип чыккан инженердик жана дизайн системалары."
                          : "engineering & design systems designed for physical and digital monograph."}
                    </p>
                  </div>

                  {/* Right Column: Clean Form Fields */}
                  <div className="col-span-12 md:col-span-7 flex flex-col gap-5 relative text-left">
                    {/* Close button for desktop */}
                    <button 
                      onClick={() => setIsContactFormOpen(false)}
                      className="hidden md:block absolute -top-4 -right-2 text-[#808080] hover:text-black font-mono text-[15px] cursor-pointer"
                    >
                      [CLOSE/X]
                    </button>

                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#808080]">
                          {locale === "ru" ? "Имя" : locale === "kg" ? "Аты" : "Name"}
                        </label>
                        <input
                          required
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder={locale === "ru" ? "Введите имя" : locale === "kg" ? "Атыңызды киргизиңиз" : "Enter name"}
                          className="w-full bg-transparent border-b border-[#808080]/50 py-2 outline-none focus:border-[#0000FF] font-sans text-[15px] transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#808080]">
                          {locale === "ru" ? "Email или телефон" : locale === "kg" ? "Email же телефон" : "Email or phone"}
                        </label>
                        <input
                          required
                          type="text"
                          value={formContact}
                          onChange={(e) => setFormContact(e.target.value)}
                          placeholder={locale === "ru" ? "example@mail.com" : "example@mail.com"}
                          className="w-full bg-transparent border-b border-[#808080]/50 py-2 outline-none focus:border-[#0000FF] font-sans text-[15px] transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#808080]">
                          {locale === "ru" ? "Сообщение" : locale === "kg" ? "Билдирүү" : "Message"}
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder={locale === "ru" ? "Опишите ваш проект..." : locale === "kg" ? "Долбооруңузду сүрөттөп бериңиз..." : "Describe your project..."}
                          className="w-full bg-transparent border-b border-[#808080]/50 py-2 outline-none focus:border-[#0000FF] font-sans text-[15px] resize-none transition-colors"
                        />
                      </div>

                      {formError && (
                        <span className="text-red-600 font-mono text-[13px] mt-1">
                          {formError}
                        </span>
                      )}

                      {formSuccess ? (
                        <span className="text-green-600 font-mono text-[13px] text-center py-2.5 border border-green-600/30 bg-green-50 mt-2">
                          {locale === "ru" ? "Заявка успешно отправлена!" : locale === "kg" ? "Суроо-талап ийгиликтүү жөнөтүлдү!" : "Request submitted successfully!"}
                        </span>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmittingForm}
                          className="w-full border border-black hover:border-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300 py-3 uppercase font-mono text-[13px] tracking-[0.06em] cursor-pointer mt-2 disabled:opacity-50 text-black"
                        >
                          {isSubmittingForm 
                            ? (locale === "ru" ? "отправка..." : "sending...") 
                            : (locale === "ru" ? "отправить заявку \u2192" : "send request \u2192")}
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Scroll To Top Fixed Square Button (Aligned to Site Grid) */}
        <AnimatePresence>
          {!isContactFormOpen && !isArchiveModalOpen && showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 md:bottom-10 right-[45px] md:right-[65px] lg:right-[105px] z-50 w-12 h-12 sm:w-14 sm:h-14 bg-white text-black border border-black hover:bg-[#0000FF] hover:text-white hover:border-[#0000FF] active:bg-[#0000FF] active:text-white active:border-[#0000FF] transition-all duration-300 flex items-center justify-center cursor-pointer select-none group"
              title={locale === "ru" ? "Наверх" : "Scroll to top"}
            >
              <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.25] group-hover:-translate-y-0.5 transition-transform duration-300" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Fixed Sticky Inquiry Banner for Project Detail Pages (Truly Viewport Fixed) */}
        <AnimatePresence>
          {!isContactFormOpen && isProjectDetailPage && showProjectBanner && !projectBannerDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-[92vw] sm:max-w-xl md:max-w-2xl bg-white text-black border border-black p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)] flex items-center justify-between gap-5 font-mono select-none"
            >
              <div 
                onClick={() => setIsContactFormOpen(true)}
                className="flex items-center gap-4 sm:gap-5 cursor-pointer group min-w-0 flex-1"
              >
                {/* Thumbs Up Button */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 bg-white text-black border border-black group-hover:bg-[#0000FF] group-hover:border-[#0000FF] group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0">
                  <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[#0000FF] text-[11px] sm:text-[12px] uppercase tracking-[0.06em] block mb-1">
                    [01/PROJECT INQUIRY]
                  </span>
                  <p className="font-sans text-[14px] sm:text-[16px] font-normal leading-snug text-black m-0 group-hover:text-[#0000FF] transition-colors truncate sm:whitespace-normal">
                    {locale === "ru" 
                      ? "Понравился проект? Свяжитесь с нами, для обсуждения вашей идеи."
                      : locale === "kg"
                        ? "Долбоор жактыбы? Идеяңызды талкуулоо үчүн биз менен байланышыңыз."
                        : "Like this project? Contact us to discuss your idea."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsContactFormOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 border border-black hover:border-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300 px-4 py-2.5 uppercase font-mono text-[12px] tracking-[0.06em] cursor-pointer text-black"
                >
                  {locale === "ru" ? "Обсудить" : "Discuss"} &rarr;
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectBannerDismissed(true);
                  }}
                  className="text-[#808080] hover:text-black font-mono text-[13px] cursor-pointer p-1"
                  title={locale === "ru" ? "Закрыть" : "Close"}
                >
                  [X]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </LanguageContext.Provider>
  );
}
