import { NavLink, Link, useLocation, useOutlet } from "react-router";
import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import { LanguageContext, translations, autoTranslateText, getLocText, type Language, languageOptions } from "../i18n";
import { cmsService } from "../cmsService";
import logo from "../../imports/logo__2_.svg";
import { motion, AnimatePresence } from "motion/react";
import { supabaseClient } from "../supabaseClient";
import { Menu, X, ArrowUp, ThumbsUp, ChevronDown, Globe, Check } from "lucide-react";

const languageDetails: Record<Language, { label: string; name: string }> = {
  en: { label: "EN", name: "English" },
  kg: { label: "KG", name: "Кыргызча" },
  ru: { label: "RU", name: "Русский" },
  zh: { label: "ZH", name: "中文" },
  ar: { label: "AR", name: "العربية" },
  de: { label: "DE", name: "Deutsch" },
};


export function Root() {
  const location = useLocation();
  const outlet = useOutlet();
  const [locale, setLocale] = useState<Language>("en");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [siteTranslations, setSiteTranslations] = useState(() => cmsService.getTranslations());
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const updateUnderline = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const activeEl = navRef.current?.querySelector(".nav-link-active");
        if (activeEl && navRef.current) {
          const activeRect = activeEl.getBoundingClientRect();
          const navRect = navRef.current.getBoundingClientRect();
          setUnderlineStyle({
            left: activeRect.left - navRect.left,
            width: activeRect.width,
            opacity: 1
          });
        } else {
          setUnderlineStyle(prev => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
        }
      });
    };

    updateUnderline();

    window.addEventListener("resize", updateUnderline);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateUnderline);
    };
  }, [location.pathname, locale]);

  
  const navClusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = navClusterRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const measure = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!el) return;
        const w = el.offsetWidth;
        if (w > 0) {
          document.documentElement.style.setProperty('--sds-nav-cluster-width', `${w}px`);
        }
      });
    };

    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener("resize", measure);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  
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
        name: formName.trim() || "Без имени",
        email: formContact.trim(),
        phone: !formContact.includes("@") ? formContact.trim() : "",
        message: formMessage.trim(),
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

  const isProjectDetailPage = 
    (location.pathname.startsWith("/projects/") && location.pathname !== "/projects/old" && location.pathname !== "/projects") ||
    (location.pathname.startsWith("/products/") && location.pathname !== "/products") ||
    (location.pathname.startsWith("/web-ui-ux/") && location.pathname !== "/web-ui-ux") ||
    (location.pathname.startsWith("/concepts-and-vision/") && location.pathname !== "/concepts-and-vision") ||
    (location.pathname.startsWith("/architect-projects/") && location.pathname !== "/architect-projects") ||
    (location.pathname.startsWith("/gamedev/") && location.pathname !== "/gamedev");
  const [showProjectBanner, setShowProjectBanner] = useState(false);
  const [projectBannerDismissed, setProjectBannerDismissed] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowProjectBanner(false);
    setProjectBannerDismissed(false);
  }, [location.pathname]);

  // Scroll tracking — native scroll, rAF throttled
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsScrolled(false);
    setShowScrollTop(false);
    let wasScrolled = false;
    let scrollRaf: number | null = null;

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        const currentY = window.scrollY;
        const scrolled = currentY > 80;
        if (scrolled !== wasScrolled) {
          wasScrolled = scrolled;
          setIsScrolled(scrolled);
        }
        setShowScrollTop(currentY > 300);

        // Project detail sticky banner: appears strictly when user reaches middle of page (50% scroll) and disappears when collage section ends
        if (isProjectDetailPage && !projectBannerDismissed) {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPct = totalHeight > 0 ? (currentY / totalHeight) * 100 : 0;
          
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
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [location.pathname, isProjectDetailPage, projectBannerDismissed]);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.02
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          entry.target.classList.remove("reveal-hidden");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sections.forEach((sec, idx) => {
      // First section or already visible sections should not get hidden and transitioned
      if (idx === 0 || sec.classList.contains("reveal-visible")) {
        sec.classList.add("reveal-visible");
        sec.classList.remove("reveal-hidden");
      } else {
        sec.classList.add("reveal-hidden");
        observer.observe(sec);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  const getResolvedTranslations = (loc: Language) => {
    const siteT = siteTranslations[loc] || siteTranslations.en || siteTranslations.ru || {};
    const defT = (translations as any)[loc] || translations.en;
    const ruT = siteTranslations.ru || translations.ru || {};

    const resolveValue = (s: any, d: any, r: any, currentKey?: string): any => {
      // If s exists and is a valid value
      if (s !== undefined && s !== null && s !== "") {
        if (Array.isArray(s)) {
          return s.map((item: any, idx: number) => resolveValue(item, d?.[idx], r?.[idx], currentKey));
        }
        if (typeof s === "object") {
          const res: any = {};
          for (const k of Object.keys(s)) {
            res[k] = resolveValue(s[k], d?.[k], r?.[k], k);
          }
          if (d && typeof d === "object" && !Array.isArray(d)) {
            for (const k of Object.keys(d)) {
              if (res[k] === undefined) {
                res[k] = resolveValue(undefined, d[k], r?.[k], k);
              }
            }
          }
          return res;
        }
        if (typeof s === "string") {
          return autoTranslateText(s, loc);
        }
        return s;
      }
      // If s is empty, fall back to default translation d
      if (d !== undefined && d !== null && d !== "") {
        if (Array.isArray(d)) {
          return d.map((item: any, idx: number) => resolveValue(undefined, item, r?.[idx], currentKey));
        }
        if (typeof d === "object") {
          const res: any = {};
          for (const k of Object.keys(d)) {
            res[k] = resolveValue(undefined, d[k], r?.[k], k);
          }
          return res;
        }
        if (typeof d === "string") return autoTranslateText(d, loc);
        return d;
      }
      // Fall back to Russian r
      if (r !== undefined && r !== null && r !== "") {
        if (Array.isArray(r)) {
          return r.map((item: any, idx: number) => resolveValue(undefined, undefined, item, currentKey));
        }
        if (typeof r === "object") {
          const res: any = {};
          for (const k of Object.keys(r)) {
            res[k] = resolveValue(undefined, undefined, r[k], k);
          }
          return res;
        }
        if (typeof r === "string") return autoTranslateText(r, loc);
        return r;
      }
      return s;
    };

    return resolveValue(siteT, defT, ruT);
  };

  const t = useMemo(() => getResolvedTranslations(locale), [locale, siteTranslations]);

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
    { name: getLocText(locale, (t.nav as any)?.architecture || "Архитектура", "Architecture", "Архитектура", "建筑设计", "الهندسة المعمارية", "Architektur"), path: "/architect-projects" },
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
          <div className="absolute right-[-15%] top-0 h-full w-auto flex items-center justify-end z-0 pointer-events-none ">
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

      <div className={`min-h-screen text-black selection:bg-[#0000FF] selection:text-white relative flex flex-col font-twk-everett overflow-x-hidden ${isProjectDetailPage ? 'bg-[#f0f0f0]' : 'bg-white'}`}>
        
        {/* Top Navigation Row: Clocks left, Expanded Menu & Languages right */}
        <header className={`w-full flex lg:grid lg:grid-cols-12 gap-[28px] justify-between lg:justify-start items-center pt-[30px] md:pt-[40px] px-4 sm:px-6 md:px-[65px] lg:px-[105px] z-50 transition-colors duration-300 ${isProjectDetailPage ? 'bg-[#f0f0f0] pb-[20px] md:pb-[28px]' : 'bg-white pb-[30px] md:pb-[64px]'}`}>
          {/* Logo */}
          <div className="lg:col-span-3 flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src={logo} alt="Steel Drake Studio Team" className="h-[36px] md:h-[48px] w-auto object-contain" />
            </NavLink>
          </div>

          {/* Navigation Links and Languages (Desktop) */}
          <div className="hidden lg:flex lg:col-span-9 justify-end">
            <div ref={navClusterRef} className="flex flex-nowrap items-center gap-[28px] xl:gap-[40px] whitespace-nowrap">
              <nav ref={navRef} className="flex flex-nowrap items-center gap-[20px] xl:gap-[28px] relative pb-[6px]">
              {navLinks.map((link) => {
                if (link.path === "/projects") {
                  return (
                    <div key={link.path} className="relative group/navdropdown">
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `text-[16px] font-medium tracking-[-0.15px] uppercase transition-colors duration-300 group-hover/navdropdown:text-[#0000FF] relative pb-[6px] flex items-center gap-1 ${
                            isActive ? "text-[#0000FF] nav-link-active" : "text-black"
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>

                      {/* Dropdown Menu on Hover */}
                      <div className="absolute top-full -left-2 pt-3 opacity-0 pointer-events-none group-hover/navdropdown:opacity-100 group-hover/navdropdown:pointer-events-auto transition-all duration-300 ease-out z-[999]">
                        <div className="bg-white border border-black/10 rounded-2xl p-4 min-w-[290px] flex flex-col gap-1 backdrop-blur-xl">
                          <NavLink
                            to="/projects"
                            end
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Current projects" : locale === "kg" ? "Учурдагы долбоорлор" : "Current projects"}</span>
                          </NavLink>

                          <NavLink
                            to="/products"
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Products" : locale === "kg" ? "Продукциялар" : "Products"}</span>
                          </NavLink>

                          <NavLink
                            to="/architectural-projects"
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Architecture" : locale === "kg" ? "Архитектура" : "Architecture"}</span>
                          </NavLink>

                          <NavLink
                            to="/concepts-and-vision"
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Concepts and vision" : locale === "kg" ? "Концепциялар жана көрүнүш" : "Concepts and vision"}</span>
                          </NavLink>

                          <NavLink
                            to="/web-ui-ux"
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Web and UI UX" : locale === "kg" ? "Web жана UI UX" : "Web and UI UX"}</span>
                          </NavLink>

                          <NavLink
                            to="/gamedev"
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "GameDev" : locale === "kg" ? "GameDev" : "GameDev"}</span>
                          </NavLink>

                          <NavLink
                            to="/video"
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Video" : locale === "kg" ? "Видео" : "Video"}</span>
                          </NavLink>

                          <NavLink
                            to="/music"
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Music" : locale === "kg" ? "Музыка" : "Music"}</span>
                          </NavLink>
                          
                          <NavLink
                            to="/projects/old"
                            className={({ isActive }) =>
                              `px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between gap-3 tracking-[0.02em] ${
                                isActive ? "bg-[#0000FF]/10 text-[#0000FF]" : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                              }`
                            }
                          >
                            <span>{locale === "ru" ? "Old projects" : locale === "kg" ? "Эски долбоорлор" : "Old projects"}</span>
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
                      `text-[16px] font-medium tracking-[-0.15px] uppercase transition-colors duration-300 hover:text-[#0000FF] relative pb-[6px] ${
                        isActive ? "text-[#0000FF] nav-link-active" : "text-black"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                );
              })}
              
              {/* Single CSS-based GPU sliding active underline */}
              <span
                className="absolute bottom-0 h-[1.5px] bg-[#0000FF] transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: `${underlineStyle.left}px`,
                  width: `${underlineStyle.width}px`,
                  opacity: underlineStyle.opacity
                }}
              />
            </nav>

            <span className="hidden md:inline text-[#808080] text-[17px]">|</span>

            {/* Language Switcher Dropdown (Matching PROJECTS Dropdown Style) */}
            <div className="relative group/langdropdown">
              <button 
                type="button"
                className="text-[16px] font-medium tracking-[-0.15px] uppercase transition-colors duration-300 group-hover/langdropdown:text-[#0000FF] relative pb-[6px] flex items-center gap-1.5 cursor-pointer text-black"
                aria-label="Change language"
              >
                <span>{locale.toUpperCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#808080] group-hover/langdropdown:text-[#0000FF] transition-transform duration-300 group-hover/langdropdown:rotate-180" />
              </button>

              {/* Dropdown Menu on Hover */}
              <div className="absolute top-full right-0 pt-3 opacity-0 pointer-events-none group-hover/langdropdown:opacity-100 group-hover/langdropdown:pointer-events-auto transition-all duration-300 ease-out z-[999]">
                <div className="bg-white border border-black/10 rounded-2xl p-4 min-w-[210px] flex flex-col gap-1 backdrop-blur-xl">
                  {languageOptions.map((opt) => {
                    const isSelected = locale === opt.code;
                    const details = languageDetails[opt.code];
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => setLocale(opt.code)}
                        className={`px-4 py-2.5 rounded-xl text-[13px] font-medium uppercase transition-all duration-200 flex items-center justify-between tracking-[0.02em] cursor-pointer ${
                          isSelected
                            ? "bg-[#0000FF]/10 text-[#0000FF]"
                            : "text-black/80 hover:bg-[#0000FF]/5 hover:text-[#0000FF]"
                        }`}
                      >
                        <span>{details?.name || opt.label}</span>
                        <span className={`text-[11px] font-mono shrink-0 ${isSelected ? "text-[#0000FF]" : "text-[#808080]"}`}>
                          [{opt.label}]
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

        {/* Fullscreen Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`fixed inset-0 w-full max-w-full z-45 flex flex-col justify-start pt-[115px] pb-[100px] px-8 sm:px-10 overflow-y-auto overflow-x-hidden lg:hidden font-twk-everett ${
                isProjectDetailPage ? 'bg-[#f0f0f0]' : 'bg-white'
              }`}
            >
              <div className="flex flex-col gap-[28px] sm:gap-[32px] w-full max-w-full">
                {navLinks.map((link) => {
                  const isProjects = link.path === "/projects";
                  return (
                    <div key={link.path} className="flex flex-col">
                      <NavLink
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `text-[20px] sm:text-[23px] font-normal tracking-[-0.01em] uppercase transition-colors leading-none ${
                            isActive ? "text-[#0000FF] font-medium" : "text-black hover:text-[#0000FF]"
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>

                      {/* If on Projects, show quick sub-categories */}
                      {isProjects && (
                        <div className="flex flex-wrap gap-2 pt-4 pb-1">
                          {[
                            { name: locale === "ru" ? "Продукты" : "Products", path: "/products" },
                            { name: locale === "ru" ? "Архитектура" : "Architecture", path: "/architectural-projects" },
                            { name: locale === "ru" ? "Концепты и видение" : "Concepts & Vision", path: "/concepts-and-vision" },
                            { name: "Web UI / UX", path: "/web-ui-ux" },
                            { name: "GameDev", path: "/gamedev" },
                            { name: locale === "ru" ? "Видео" : "Video", path: "/video" },
                            { name: locale === "ru" ? "Музыка" : "Music", path: "/music" },
                            { name: locale === "ru" ? "Старые проекты (2005-2020)" : "Old Projects", path: "/projects/old" },
                          ].map((sub) => (
                            <NavLink
                              key={sub.path}
                              to={sub.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="font-mono text-[11px] uppercase px-2.5 py-1 bg-black/[0.03] text-black/60 hover:text-[#0000FF] hover:bg-[#0000FF]/10 transition-colors"
                            >
                              {sub.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Single dividing line between navigation links and language switcher */}
                <div className="w-full border-t border-[#808080]/20 my-4" />

                {/* Language Switcher in Mobile Drawer */}
                <div className="flex flex-col gap-2 pt-1 pb-4">
                  <span className="font-mono text-[11px] text-[#808080] uppercase tracking-[0.08em]">
                    {locale === "ru" ? "Язык интерфейса" : locale === "kg" ? "Интерфейс тили" : "Interface Language"}
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {languageOptions.map((opt) => {
                      const isSelected = locale === opt.code;
                      const details = languageDetails[opt.code];
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => {
                            setLocale(opt.code);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#0000FF] border-[#0000FF] text-white shadow-sm"
                              : "bg-black/[0.03] border-black/10 text-black/80 hover:border-black/30 hover:bg-black/[0.06]"
                          }`}
                        >
                          <span className="font-mono text-[12px] font-bold uppercase tracking-wider">
                            {opt.label}
                          </span>
                          <span className={`text-[11px] mt-0.5 ${isSelected ? "text-white/80" : "text-[#808080]"}`}>
                            {details?.name || opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Fixed Full-Width Bottom Tab Bar (Studio Design Aesthetic) */}
        <div className={`fixed bottom-0 left-0 right-0 z-50 border-t border-[#808080]/30 px-6 py-3.5 flex items-center lg:hidden transition-colors duration-300 ${
          isProjectDetailPage ? 'bg-[#f0f0f0]/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'
        }`}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between font-twk-everett cursor-pointer transition-colors duration-200 group"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0000FF] transition-transform duration-200 group-hover:scale-125" />
              <span className="text-[15px] font-medium tracking-[-0.01em] uppercase text-black group-hover:text-[#0000FF] transition-colors">
                {isMobileMenuOpen 
                  ? (locale === "ru" ? "Закрыть меню" : locale === "kg" ? "Менюну жабуу" : "Close Menu") 
                  : (locale === "ru" ? "Меню" : locale === "kg" ? "Меню" : "Menu")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] text-[#808080] uppercase tracking-[0.04em]">
                [{locale.toUpperCase()}]
              </span>
              <span className="text-[#808080]/40 font-mono text-[12px]">|</span>
              <span className="font-mono text-[12px] text-[#808080] uppercase tracking-[0.04em]">
                [07]
              </span>
              <div className="ml-1 text-black group-hover:text-[#0000FF] transition-colors">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </div>
            </div>
          </button>
        </div>

        {/* Main Content + Footer container */}
        <div className="flex flex-col flex-grow">
          {/* Main Content Area */}
          <main key={location.pathname} className="w-full flex-grow px-4 sm:px-6 md:px-[65px] lg:px-[105px] page-transition overflow-hidden">
            <Suspense fallback={null}>
              {outlet}
            </Suspense>
          </main>

          {/* Footer */}
          <footer className={`w-full text-black pt-12 md:pt-20 pb-16 md:pb-24 mt-12 md:mt-20 border-t border-black/10 font-twk-everett px-4 sm:px-6 md:px-[65px] lg:px-[105px] transition-colors duration-300 ${isProjectDetailPage ? 'bg-[#f0f0f0]' : 'bg-white'}`}>
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
              <div className="mt-8 mb-12 md:mb-16">
                <a
                  href="mailto:contact@steeldrakestudio.com"
                  className="text-[18px] xs:text-[22px] sm:text-4xl md:text-5xl lg:text-[76px] font-normal tracking-[-0.04em] text-black leading-none hover:text-[#0000FF] transition-colors duration-300 interactive-element block w-full break-all"
                >
                  contact@steeldrakestudio.com
                </a>
              </div>

              {/* Grid: Address and Call Us columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 md:pb-16">
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

                {location.pathname !== "/" && location.pathname !== "" && (
                  <div className="md:col-span-4 flex flex-col gap-3">
                    <span className="text-[12px] font-mono tracking-[0.08em] text-black/40 uppercase">
                      {locale === "ru" ? "Behance portfolio" : locale === "kg" ? "Behance portfolio" : "Behance portfolio"}
                    </span>
                    <a
                      href="https://www.behance.net/steeldrake"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] text-black hover:opacity-80 transition-opacity interactive-element font-normal"
                    >
                      behance.net/steeldrake
                    </a>
                  </div>
                )}
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
                className="fixed top-1/2 left-1/2 bg-white border border-black p-8 md:p-10 z-45  w-full max-w-[95vw] md:max-w-[760px]"
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
              ref={bannerRef}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-[92vw] sm:max-w-xl md:max-w-2xl bg-white text-black border border-black p-5 sm:p-6 flex items-center justify-between gap-5 font-mono select-none"
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
