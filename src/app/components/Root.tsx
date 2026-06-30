import { Outlet, NavLink, useLocation, useOutlet } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef, cloneElement } from "react";
import { Menu, X, Mail, Instagram, ArrowUpRight, MapPin } from "lucide-react";
import logoPng from "../../imports/logo.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LanguageContext, languageOptions, translations, type Language } from "../i18n";
import { cmsService } from "../cmsService";
import { supabaseClient } from "../supabaseClient";



// Interactive background grid
function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Grid configuration
    const spacing = 40;
    const points: {x: number, y: number, baseX: number, baseY: number}[] = [];
    
    const initPoints = () => {
      points.length = 0;
      for (let x = 0; x <= width + spacing; x += spacing) {
        for (let y = 0; y <= height + spacing; y += spacing) {
          points.push({ x, y, baseX: x, baseY: y });
        }
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initPoints();
    };

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 255, 0.05)';
      
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Calculate distance to mouse
        const dx = mouse.x - p.baseX;
        const dy = mouse.y - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Magnet effect
        const maxDist = 150;
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          p.x = p.baseX + dx * force * 0.2;
          p.y = p.baseY + dy * force * 0.2;
        } else {
          p.x += (p.baseX - p.x) * 0.1;
          p.y += (p.baseY - p.y) * 0.1;
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[-1]"
    />
  );
}

const CustomMailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19,1H5A5.006,5.006,0,0,0,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V6A5.006,5.006,0,0,0,19,1ZM5,3H19a3,3,0,0,1,2.78,1.887l-7.658,7.659a3.007,3.007,0,0,1-4.244,0L2.22,4.887A3,3,0,0,1,5,3ZM19,21H5a3,3,0,0,1-3-3V7.5L8.464,13.96a5.007,5.007,0,0,0,7.072,0L22,7.5V18A3,3,0,0,1,19,21Z"/>
  </svg>
);

const CustomWhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.17,1.82l-1.05-.91c-1.21-1.21-3.17-1.21-4.38,0-.03,.03-1.88,2.44-1.88,2.44-1.14,1.2-1.14,3.09,0,4.28l1.16,1.46c-1.46,3.31-3.73,5.59-6.93,6.95l-1.46-1.17c-1.19-1.15-3.09-1.15-4.28,0,0,0-2.41,1.85-2.44,1.88-1.21,1.21-1.21,3.17-.05,4.33l1,1.15c1.15,1.15,2.7,1.78,4.38,1.78,7.64,0,17.76-10.13,17.76-17.76,0-1.67-.63-3.23-1.83-4.42ZM6.24,22c-1.14,0-2.19-.42-2.91-1.15l-1-1.15c-.41-.41-.43-1.08-.04-1.51,0,0,2.39-1.84,2.42-1.87,.41-.41,1.13-.41,1.55,0,.03,.03,2.04,1.64,2.04,1.64,.28,.22,.65,.28,.98,.15,4.14-1.58,7.11-4.54,8.82-8.81,.13-.33,.08-.71-.15-1,0,0-1.61-2.02-1.63-2.04-.43-.43-.43-1.12,0-1.55,.03-.03,1.87-2.42,1.87-2.42,.43-.39,1.1-.38,1.56,.08l1.05,.91c.77,.77,1.2,1.82,1.2,2.96,0,6.96-9.77,15.76-15.76,15.76Z"/>
  </svg>
);

const CustomInstagramIcon = () => (
  <svg viewBox="0 0 511 511.9" fill="currentColor" className="w-5 h-5">
    <path d="m510.949219 150.5c-1.199219-27.199219-5.597657-45.898438-11.898438-62.101562-6.5-17.199219-16.5-32.597657-29.601562-45.398438-12.800781-13-28.300781-23.101562-45.300781-29.5-16.296876-6.300781-34.898438-10.699219-62.097657-11.898438-27.402343-1.300781-36.101562-1.601562-105.601562-1.601562s-78.199219.300781-105.5 1.5c-27.199219 1.199219-45.898438 5.601562-62.097657 11.898438-17.203124 6.5-32.601562 16.5-45.402343 29.601562-13 12.800781-23.097657 28.300781-29.5 45.300781-6.300781 16.300781-10.699219 34.898438-11.898438 62.097657-1.300781 27.402343-1.601562 36.101562-1.601562 105.601562s.300781 78.199219 1.5 105.5c1.199219 27.199219 5.601562 45.898438 11.902343 62.101562 6.5 17.199219 16.597657 32.597657 29.597657 45.398438 12.800781 13 28.300781 23.101562 45.300781 29.5 16.300781 6.300781 34.898438 10.699219 62.101562 11.898438 27.296876 1.203124 36 1.5 105.5 1.5s78.199219-.296876 105.5-1.5c27.199219-1.199219 45.898438-5.597657 62.097657-11.898438 34.402343-13.300781 61.601562-40.5 74.902343-74.898438 6.296876-16.300781 10.699219-34.902343 11.898438-62.101562 1.199219-27.300781 1.5-36 1.5-105.5s-.101562-78.199219-1.300781-105.5zm-46.097657 209c-1.101562 25-5.300781 38.5-8.800781 47.5-8.601562 22.300781-26.300781 40-48.601562 48.601562-9 3.5-22.597657 7.699219-47.5 8.796876-27 1.203124-35.097657 1.5-103.398438 1.5s-76.5-.296876-103.402343-1.5c-25-1.097657-38.5-5.296876-47.5-8.796876-11.097657-4.101562-21.199219-10.601562-29.398438-19.101562-8.5-8.300781-15-18.300781-19.101562-29.398438-3.5-9-7.699219-22.601562-8.796876-47.5-1.203124-27-1.5-35.101562-1.5-103.402343s.296876-76.5 1.5-103.398438c1.097657-25 5.296876-38.5 8.796876-47.5 4.101562-11.101562 10.601562-21.199219 19.203124-29.402343 8.296876-8.5 18.296876-15 29.398438-19.097657 9-3.5 22.601562-7.699219 47.5-8.800781 27-1.199219 35.101562-1.5 103.398438-1.5 68.402343 0 76.5.300781 103.402343 1.5 25 1.101562 38.5 5.300781 47.5 8.800781 11.097657 4.097657 21.199219 10.597657 29.398438 19.097657 8.5 8.300781 15 18.300781 19.101562 29.402343 3.5 9 7.699219 22.597657 8.800781 47.5 1.199219 27 1.5 35.097657 1.5 103.398438s-.300781 76.300781-1.5 103.300781zm0 0"></path><path d="m256.449219 124.5c-72.597657 0-131.5 58.898438-131.5 131.5s58.902343 131.5 131.5 131.5c72.601562 0 131.5-58.898438 131.5-131.5s-58.898438-131.5-131.5-131.5zm0 216.800781c-47.097657 0-85.300781-38.199219-85.300781-85.300781s38.203124-85.300781 85.300781-85.300781c47.101562 0 85.300781 38.199219 85.300781 85.300781s-38.199219 85.300781-85.300781 85.300781zm0 0"></path><path d="m423.851562 119.300781c0 16.953125-13.746093 30.699219-30.703124 30.699219-16.953126 0-30.699219-13.746094-30.699219-30.699219 0-16.957031 13.746093-30.699219 30.699219-30.699219 16.957031 0 30.703124 13.742188 30.703124 30.699219zm0 0"></path>
  </svg>
);

export function Root() {
  const location = useLocation();
  const isProjectDetail = location.pathname.startsWith('/projects/') && location.pathname !== '/projects';
  const outlet = useOutlet();
  const [isDarkThemeBehind, setIsDarkThemeBehind] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locale, setLocale] = useState<Language>("en");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isPastMiddle, setIsPastMiddle] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const checkHeaderTheme = () => {
      // If we are at the very top of the page, the header sits on the white background
      if (window.scrollY < 20) {
        setIsDarkThemeBehind(false);
        return;
      }

      // 1. Fast check for elements with data-theme="dark"
      const darkElements = document.querySelectorAll('[data-theme="dark"]');
      const headerHeight = 92; // 12px top + 80px height
      let isDarkBehind = false;

      for (let i = 0; i < darkElements.length; i++) {
        const rect = darkElements[i].getBoundingClientRect();
        if (rect.top <= headerHeight && rect.bottom >= 12) {
          isDarkBehind = true;
          break;
        }
      }

      // 2. Dynamic element & image brightness detection
      if (!isDarkBehind) {
        // Temporarily disable pointer events on the header to look behind it
        const headerEl = document.querySelector('header');
        if (headerEl) headerEl.style.pointerEvents = 'none';

        // Sample at the center of the header position
        const x = window.innerWidth / 2;
        const y = 50; 
        const element = document.elementFromPoint(x, y);

        if (headerEl) headerEl.style.pointerEvents = '';

        if (element) {
          // Check CSS background color of the element and its parents
          let currentEl: HTMLElement | null = element as HTMLElement;
          while (currentEl && currentEl !== document.body) {
            const style = window.getComputedStyle(currentEl);
            const bgColor = style.backgroundColor;
            if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
              const rgb = bgColor.match(/\d+/g);
              if (rgb && rgb.length >= 3) {
                const r = parseInt(rgb[0], 10);
                const g = parseInt(rgb[1], 10);
                const b = parseInt(rgb[2], 10);
                const a = rgb[3] ? parseFloat(rgb[3]) : 1;
                if (a > 0.5) {
                  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                  if (brightness < 120) {
                    isDarkBehind = true;
                  }
                  break; // Found solid background, stop traversing
                }
              }
            }
            currentEl = currentEl.parentElement;
          }

          // If no dark background, check if there is an image under the header
          if (!isDarkBehind) {
            const img = element.tagName === 'IMG' ? element : element.querySelector('img');
            if (img && img.complete && (img as HTMLImageElement).naturalWidth > 0) {
              try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(img, 0, 0, 1, 1);
                  const pixel = ctx.getImageData(0, 0, 1, 1).data;
                  if (pixel[3] > 100) {
                    const brightness = (pixel[0] * 299 + pixel[1] * 587 + pixel[2] * 114) / 1000;
                    if (brightness < 120) {
                      isDarkBehind = true;
                    }
                  }
                }
              } catch (e) {
                // CORS or other canvas error: fallback to URL keywords and route check
                const src = img.getAttribute('src') || '';
                if (
                  src.toLowerCase().includes('dark') || 
                  src.toLowerCase().includes('black') || 
                  src.toLowerCase().includes('chyraq') ||
                  location.pathname.startsWith('/projects/')
                ) {
                  isDarkBehind = true;
                }
              }
            }
          }
        }
      }

      setIsDarkThemeBehind(isDarkBehind);
    };

    checkHeaderTheme();
    const timer = setTimeout(checkHeaderTheme, 100);

    window.addEventListener("scroll", checkHeaderTheme, { passive: true });
    window.addEventListener("resize", checkHeaderTheme);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", checkHeaderTheme);
      window.removeEventListener("resize", checkHeaderTheme);
    };
  }, [location.pathname]);

  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    setIsSubmitting(true);

    try {
      // Save to Supabase database sds_leads table (triggers email automatically on backend!)
      await supabaseClient.insertTable("sds_leads", [
        {
          name: clientName,
          phone: clientPhone,
          created_at: new Date().toISOString()
        }
      ]);

      setSubmitSuccess(true);
      setClientName("");
      setClientPhone("");
    } catch (err: any) {
      console.error("Submission error:", err);
      // Fallback redirect to email client
      window.location.href = `mailto:contact@steeldrakestudio.com?subject=${encodeURIComponent("Заявка с сайта")}&body=${encodeURIComponent(`Имя: ${clientName}\nТелефон: ${clientPhone}`)}`;
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    cmsService.initSupabaseSync();

    // Dynamic Umami script loading
    const websiteId = localStorage.getItem("sds_umami_website_id");
    const scriptUrl = localStorage.getItem("sds_umami_script_url") || "https://cloud.umami.is/script.js";
    if (websiteId) {
      const oldScripts = document.querySelectorAll('script[src*="umami"]');
      oldScripts.forEach((s) => s.remove());

      const script = document.createElement("script");
      script.defer = true;
      script.src = scriptUrl;
      script.setAttribute("data-website-id", websiteId);
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setIsPastMiddle(currentScrollY > scrollHeight / 2 && currentScrollY < scrollHeight * 0.8);
      }

      if (isMenuOpen) {
        setIsHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Only hide/show if the scroll diff is significant (e.g. > 10px) to avoid jittering
      if (Math.abs(diff) > 10) {
        if (currentScrollY > 100 && diff > 0) {
          setIsHeaderVisible(false);
        } else if (diff < 0) {
          setIsHeaderVisible(true);
        }
      }

      // Always show header at the very top of the page
      if (currentScrollY <= 40) {
        setIsHeaderVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsHeaderVisible(true);
    setIsPastMiddle(false);
  }, [location.pathname]);

  useEffect(() => {
    const isEnabled = localStorage.getItem("sds_analytics_enabled") !== "false";
    if (isEnabled) {
      supabaseClient.logVisit(location.pathname, locale);
    }
  }, [location.pathname, locale]);

  useEffect(() => {
    // 1. Disable right-click globally on the entire site
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Ctrl+S and Cmd+S key combinations globally
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
      }
    };

    // 3. Disable dragging of images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "IMG" || target.closest("img"))) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("siteLanguage") as Language | null;
    if (storedLocale && translations[storedLocale]) {
      setLocale(storedLocale);
    }
  }, []);

  const [siteTranslations, setSiteTranslations] = useState(() => cmsService.getTranslations());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setSiteTranslations(cmsService.getTranslations());
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("siteLanguage", locale);
  }, [locale]);

  const t = siteTranslations[locale] || translations[locale];


  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.about, path: "/about" },
    { name: t.nav.services, path: "/services" },
    { name: t.nav.projects, path: "/projects" },
    { name: t.nav.contacts, path: "/contacts" },
  ];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      <div className="min-h-screen bg-[#f7f7f3] text-black font-['Inter',sans-serif] selection:bg-[#0000FF] selection:text-white">
        <InteractiveBackground />
        
        <motion.header
          className={`fixed left-0 right-0 z-50 px-3 sm:px-6 ${isHeaderVisible ? "" : "pointer-events-none"}`}
          initial={{ top: "12px" }}
          animate={{ 
            top: isHeaderVisible ? "12px" : "-150px"
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto relative flex h-20 max-w-[1380px] w-full items-center justify-center">
            
            {/* Logo Container */}
            <div className="absolute left-0 flex items-center z-10">
              <NavLink to="/" className="flex min-w-[130px] shrink-0 items-center">
                <ImageWithFallback src={logoPng} alt="Steel Drake Studio" className={`block h-[54px] w-auto object-contain transition-all duration-300 ${isDarkThemeBehind ? "brightness-0 invert" : ""}`} />
              </NavLink>
            </div>

            {/* Menu Wrapper (Centered) */}
            <div className="flex justify-center">
              <motion.div
                layout
                animate={{
                  backgroundColor: isDarkThemeBehind ? "rgba(255, 255, 255, 0.32)" : "rgba(255, 255, 255, 0.15)",
                  paddingTop: isScrolled ? "10px" : "12px",
                  paddingBottom: isScrolled ? "10px" : "12px",
                  boxShadow: "0 12px 45px rgba(0,0,0,0.04)",
                }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className={`hidden md:flex items-center rounded-full border backdrop-blur-2xl px-4 overflow-hidden transition-colors duration-500 ${
                  isDarkThemeBehind ? "border-white/50" : "border-white/35"
                }`}
              >
                <nav className="flex items-center gap-1 rounded-full p-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `relative rounded-full px-4 py-2 text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 interactive-element ${
                          isDarkThemeBehind
                            ? isActive ? "text-white" : "text-white/60 hover:text-white"
                            : isActive ? "text-black/80" : "text-black/55 hover:text-black/80"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="activeMenuPill"
                              className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none"
                              transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.8 }}
                            >
                              <div className="w-14 h-14 rounded-full bg-[#0066FF]/50 blur-xl" />
                            </motion.div>
                          )}
                          <span className="relative z-10">{link.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </div>

            {/* Language Selector (Separate Plaque on the right) */}
            <div className="absolute right-0 hidden md:flex items-center z-10">
              <motion.div
                layout
                animate={{
                  backgroundColor: isDarkThemeBehind ? "rgba(255, 255, 255, 0.32)" : "rgba(255, 255, 255, 0.15)",
                  paddingTop: isScrolled ? "10px" : "12px",
                  paddingBottom: isScrolled ? "10px" : "12px",
                  boxShadow: "0 12px 45px rgba(0,0,0,0.04)",
                }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className={`flex items-center rounded-full border backdrop-blur-2xl px-4 overflow-hidden transition-colors duration-500 ${
                  isDarkThemeBehind ? "border-white/50" : "border-white/35"
                }`}
              >
                <div className="flex items-center gap-1 rounded-full p-1">
                  {languageOptions.map(({ code, label }) => {
                    const isActive = locale === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setLocale(code)}
                        className={`relative rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300 interactive-element ${
                          isDarkThemeBehind
                            ? isActive ? "text-white" : "text-white/60 hover:text-white"
                            : isActive ? "text-black/80" : "text-black/55 hover:text-black/80"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeLanguagePill"
                            className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none"
                            transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.8 }}
                          >
                            <div className="w-14 h-14 rounded-full bg-[#0066FF]/50 blur-xl" />
                          </motion.div>
                        )}
                        <span className="relative z-10">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Mobile Menu Toggle (stays on right) */}
            <div className="flex items-center gap-2 md:hidden absolute right-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`rounded-full border p-3 shadow-[0_16px_40px_rgba(0,0,0,0.12)] interactive-element transition-all duration-300 ${
                  isDarkThemeBehind
                    ? "bg-black/35 border-white/25 text-white hover:bg-black/50"
                    : "bg-white/70 border-white/60 text-black hover:bg-white/95"
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </motion.header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-40 bg-white pt-24 px-6"
            >
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-3xl font-semibold tracking-tight ${
                        isActive ? "text-[#0000FF]" : "text-black"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-10 flex flex-wrap gap-3">
                {languageOptions.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setLocale(code);
                      setIsMenuOpen(false);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      locale === code ? "border-[#0000FF] bg-[#0000FF] text-white" : "border-black/10 bg-white text-black/80 hover:border-[#0000FF]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

         <main className="pt-24">
          <AnimatePresence mode="wait" initial={false}>
            {outlet && (
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ willChange: "opacity" }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                {cloneElement(outlet, { context: { openContactForm: () => setIsContactPopupOpen(true) } })}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer data-theme="dark" ref={footerRef} className="w-full bg-gradient-to-b from-[#0000FF] to-[#000033] text-white pt-24 pb-12 mt-24">
          <div className="mx-auto max-w-[1380px] w-full px-6">
            
            <div className="flex flex-col md:flex-row justify-between pb-16">
              
              {/* Left side: Let's Talk & Email */}
              <div className="flex flex-col items-start gap-6 mb-12 md:mb-0">
                <button 
                  type="button"
                  onClick={() => setIsContactPopupOpen(true)}
                  className="inline-flex items-center justify-center px-5 py-2 border border-white/30 rounded-full text-sm font-medium hover:bg-white hover:text-[#0000FF] hover:border-white transition-all duration-300 interactive-element"
                >
                  {t.contacts.letsTalk}
                </button>
                <a 
                  href="mailto:contact@steeldrakestudio.com" 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium tracking-tight hover:text-white/80 transition-colors interactive-element"
                >
                  contact@steeldrakestudio.com
                </a>
              </div>

              {/* Right side: Socials */}
              <div className="flex flex-col items-start md:items-end gap-5">
                <a 
                  href="https://www.instagram.com/steeldrakestudioteam/#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-[15px] hover:opacity-80 transition-opacity interactive-element"
                >
                  Instagram <ArrowUpRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </a>
                <a 
                  href="https://wa.me/996702507888" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-[15px] hover:opacity-80 transition-opacity interactive-element"
                >
                  WhatsApp <ArrowUpRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </a>
              </div>

            </div>

            {/* Info Row */}
            <div className="flex flex-col md:flex-row gap-12 md:gap-32 pb-12">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium">{t.contacts.officeTitle}</span>
                <a 
                  href="https://www.google.com/maps/place/1%2F2+ул.+Горького,+Бишкек+720001/@42.8569615,74.6340349,294m/data=!3m1!1e3!4m6!3m5!1s0x389eb649ed50dd4f:0xfa828968edacc1ba!8m2!3d42.856828!4d74.6180463!16s%2Fg%2F11ym4g96dn?hl=ru&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[15px] text-white hover:opacity-80 transition-opacity leading-relaxed interactive-element"
                >
                  {t.contacts.officeAddress.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i !== t.contacts.officeAddress.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium">{t.contacts.callUs}</span>
                <a 
                  href="tel:+996702507888" 
                  className="text-[15px] text-white hover:opacity-80 transition-opacity interactive-element"
                >
                  +996 702 507888
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/20 w-full mb-10"></div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center">
                <ImageWithFallback src={logoPng} alt="Steel Drake Studio" className="block h-10 w-auto object-contain brightness-0 invert" />
              </div>
              <div className="flex flex-col items-center md:items-end gap-1">
                <div className="text-[13px] text-white/80">
                  © 2026 STEEL DRAKE STUDIO TEAM. All Right Reserved
                </div>
              </div>
            </div>

          </div>
        </footer>

        {/* Floating Contacts Pill */}
        <div
          className={`fixed bottom-8 left-0 right-0 mx-auto w-fit z-40 flex flex-col items-center transition-all duration-500 ease-out overflow-hidden border text-center rounded-[2.5rem] ${
            isFooterVisible 
              ? "opacity-0 translate-y-10 pointer-events-none" 
              : "opacity-100 translate-y-0"
          } ${
            isProjectDetail && isPastMiddle
              ? "bg-white/95 border-white/60 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-2xl p-6 max-h-[300px] max-w-[400px]"
              : "bg-transparent border-transparent p-0 max-h-[60px] max-w-[200px]"
          }`}
        >
          <div 
            className={`transition-all duration-500 ease-out w-full flex justify-center ${
              isProjectDetail && isPastMiddle 
                ? "opacity-100 mb-3 transform translate-y-0 max-h-[100px]" 
                : "opacity-0 max-h-0 pointer-events-none transform -translate-y-2 overflow-hidden"
            }`}
          >
            <p className="text-[17px] font-semibold text-black/90 leading-relaxed tracking-tight max-w-[320px]">
              {locale === "ru" ? (
                <>
                  Понравился проект?
                  <br />
                  Свяжитесь с нами для обсуждения вашей идеи.
                </>
              ) : locale === "kg" ? (
                <>
                  Долбоор жактыбы?
                  <br />
                  Идеяңызды талкуулоо үчүн биз менен байланышыңыз.
                </>
              ) : (
                <>
                  Liked the project?
                  <br />
                  Contact us to discuss your idea.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="mailto:contact@steeldrakestudio.com" 
              className="w-12 h-12 rounded-full bg-white/90 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md text-black/70 hover:bg-white hover:text-[#0000FF] hover:scale-110 active:scale-95 transition-all duration-300 interactive-element flex items-center justify-center"
              title="Mail"
            >
              <CustomMailIcon />
            </a>
            <a 
              href="https://wa.me/996702507888" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-full bg-white/90 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md text-black/70 hover:bg-white hover:text-[#0000FF] hover:scale-110 active:scale-95 transition-all duration-300 interactive-element flex items-center justify-center"
              title="WhatsApp"
            >
              <CustomWhatsAppIcon />
            </a>
            <a 
              href="https://www.instagram.com/steeldrakestudioteam/#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-full bg-white/90 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md text-black/70 hover:bg-white hover:text-[#0000FF] hover:scale-110 active:scale-95 transition-all duration-300 interactive-element flex items-center justify-center"
              title="Instagram"
            >
              <CustomInstagramIcon />
            </a>
          </div>
        </div>

        {/* Contact Popup Modal */}
        <AnimatePresence>
          {isContactPopupOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={() => {
                if (!isSubmitting) setIsContactPopupOpen(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-[2rem] p-8 max-w-[440px] w-full shadow-2xl relative border border-white/20 text-black flex flex-col justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsContactPopupOpen(false)}
                  disabled={isSubmitting}
                  className="absolute top-6 right-6 p-2 bg-black/[0.03] hover:bg-black/[0.08] text-black/60 hover:text-black rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>

                {submitSuccess ? (
                  <div className="py-8 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-3xl font-bold animate-bounce">
                      ✓
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mt-2">
                      {locale === "ru" ? "Заявка отправлена!" : locale === "kg" ? "Билдирүү жөнөтүлдү!" : "Request Sent!"}
                    </h3>
                    <p className="text-black/55 text-sm leading-relaxed max-w-[320px]">
                      {locale === "ru" 
                        ? "Спасибо! Мы свяжемся с вами в ближайшее время для обсуждения вашего проекта." 
                        : locale === "kg"
                        ? "Рахмат! Долбооруңузду талкуулоо үчүн жакында сиз менен байланышабыз."
                        : "Thank you! We will contact you shortly to discuss your project."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitSuccess(false);
                        setIsContactPopupOpen(false);
                      }}
                      className="mt-6 px-6 py-2.5 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-sm transition-all"
                    >
                      {locale === "ru" ? "Закрыть" : locale === "kg" ? "Жабуу" : "Close"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">
                        {locale === "ru" ? "Давайте обсудим проект" : locale === "kg" ? "Долбоорду талкуулайлы" : "Let's discuss your project"}
                      </h3>
                      <p className="text-sm text-black/50 mt-1">
                        {locale === "ru" 
                          ? "Оставьте ваши данные, и мы свяжемся с вами." 
                          : locale === "kg"
                          ? "Маалыматыңызды калтырыңыз, биз сиз менен байланышабыз."
                          : "Leave your details and we will get in touch."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
                          {locale === "ru" ? "Ваше имя" : locale === "kg" ? "Атыңыз" : "Your Name"}
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder={locale === "ru" ? "Иван Иванов" : locale === "kg" ? "Атыңызды жазыңыз" : "John Doe"}
                          className="w-full bg-black/[0.03] border border-black/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0000FF] focus:ring-1 focus:ring-[#0000FF] transition-all text-base placeholder-black/30"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
                          {locale === "ru" ? "Номер телефона" : locale === "kg" ? "Телефон номериңиз" : "Phone Number"}
                        </label>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+996 (___) __-__-__"
                          className="w-full bg-black/[0.03] border border-black/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0000FF] focus:ring-1 focus:ring-[#0000FF] transition-all text-base placeholder-black/30"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#0000FF]/10 hover:shadow-[#0000FF]/25 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      ) : (
                        <span>{locale === "ru" ? "Отправить заявку" : locale === "kg" ? "Жөнөтүү" : "Submit Request"}</span>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LanguageContext.Provider>
  );
}
