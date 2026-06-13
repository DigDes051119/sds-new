import { Outlet, NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Menu, X, Mail, Instagram, ArrowUpRight, MapPin } from "lucide-react";
import logoPng from "../../imports/logo.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LanguageContext, languageOptions, translations, type Language } from "../i18n";

// Custom cursor component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <motion.div
      className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] items-center justify-center"
      animate={{
        x: position.x - 8,
        y: position.y - 8,
      }}
      transition={{ type: "tween", duration: 0.03, ease: "linear" }}
    >
      <motion.div
        className="rounded-full bg-[#0000FF] flex items-center justify-center overflow-hidden"
        animate={{
          width: 16,
          height: 16,
          opacity: 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locale, setLocale] = useState<Language>("ru");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

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
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("siteLanguage") as Language | null;
    if (storedLocale && translations[storedLocale]) {
      setLocale(storedLocale);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("siteLanguage", locale);
  }, [locale]);

  const t = translations[locale];

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
      <div className="min-h-screen bg-[#f7f7f3] text-black font-['Inter',sans-serif] selection:bg-[#0000FF] selection:text-white md:cursor-none">
        <CustomCursor />
        <InteractiveBackground />
        
        <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-6">
          <div className="mx-auto relative flex h-20 max-w-[1380px] items-center">
            
            {/* Logo Container */}
            <motion.div
              animate={{
                opacity: isScrolled ? 0 : 1,
                pointerEvents: isScrolled ? "none" : "auto",
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 flex items-center z-10"
            >
              <NavLink to="/" className="flex min-w-[130px] shrink-0 items-center">
                <ImageWithFallback src={logoPng} alt="Steel Drake Studio" className="block h-[54px] w-auto object-contain" />
              </NavLink>
            </motion.div>

             {/* Menu Wrapper without CSS transition to avoid conflict with Framer Motion layout */}
            <div className={`w-full flex ${isScrolled ? "justify-center" : "justify-end"}`}>
              <motion.div
                layout
                animate={{
                  backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.70)",
                  paddingTop: isScrolled ? "10px" : "12px",
                  paddingBottom: isScrolled ? "10px" : "12px",
                  boxShadow: isScrolled ? "0 12px 45px rgba(0,0,0,0.06)" : "0 24px 80px rgba(0,0,0,0.12)",
                }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="hidden md:flex items-center gap-3 rounded-full border border-white/60 backdrop-blur-2xl px-4"
              >
                <nav className="flex items-center gap-1 rounded-full bg-black/[0.035] p-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `rounded-full px-4 py-2 text-sm font-semibold tracking-[-0.01em] transition-colors ${
                          isActive ? "bg-[#0000FF] text-white" : "text-black/65 hover:bg-white hover:text-black"
                        } interactive-element`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </nav>

                <div className="flex items-center gap-2 rounded-full bg-white/90 p-1 shadow-sm">
                  {languageOptions.map(({ code, label }) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLocale(code)}
                      className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                        locale === code ? "bg-[#0000FF] text-white" : "bg-transparent text-black/70 hover:bg-black/5"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Mobile Menu Toggle (stays on right) */}
            <div className="flex items-center gap-2 md:hidden absolute right-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full bg-white/70 border border-white/60 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.12)] interactive-element"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

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
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>

        <footer ref={footerRef} className="w-full bg-gradient-to-b from-[#0000FF] to-[#000033] text-white pt-28 pb-20 mt-24">
          <div className="mx-auto max-w-[1380px] px-6">
            
            {/* First Row: Contacts */}
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pb-8 border-b border-white/10">
              <a 
                href="mailto:getdesign@steeldrakestudioteam.com" 
                className="flex items-center gap-2.5 text-white/85 hover:text-white transition-colors text-sm font-medium interactive-element"
              >
                <span className="opacity-70"><CustomMailIcon /></span>
                <span>getdesign@steeldrakestudioteam.com</span>
              </a>
              <a 
                href="https://wa.me/996702507888" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2.5 text-white/85 hover:text-white transition-colors text-sm font-medium interactive-element"
              >
                <span className="opacity-70"><CustomWhatsAppIcon /></span>
                <span>+996702507888</span>
              </a>
              <a 
                href="https://www.instagram.com/steeldrakestudioteam/#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2.5 text-white/85 hover:text-white transition-colors text-sm font-medium interactive-element"
              >
                <span className="opacity-70"><CustomInstagramIcon /></span>
                <span>@steeldrakestudioteam</span>
              </a>
              <a 
                href="https://www.google.com/maps/place/1%2F2+ул.+Горького,+Бишкек+720001/@42.8569615,74.6340349,294m/data=!3m1!1e3!4m6!3m5!1s0x389eb649ed50dd4f:0xfa828968edacc1ba!8m2!3d42.856828!4d74.6180463!16s%2Fg%2F11ym4g96dn?hl=ru&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2.5 text-white/85 hover:text-white transition-colors text-sm font-medium interactive-element"
              >
                <span className="opacity-70"><MapPin size={20} /></span>
                <span>{t.contacts.addressFooter}</span>
              </a>
            </div>

            {/* Second Row: Copyright */}
            <div className="pt-8 flex items-center justify-center">
              <p className="text-xs text-white/55 tracking-wide">
                © 2026 STEEL DRAKE STUDIO TEAM.
              </p>
            </div>

          </div>
        </footer>

        {/* Floating Contacts Pill */}
        <AnimatePresence>
          {!isFooterVisible && (
            <motion.div
              initial={{ y: 100, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 100, x: "-50%", opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-8 left-1/2 z-40 flex items-center gap-3"
            >
              <a 
                href="mailto:design@steeldrakestudioteam.com" 
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LanguageContext.Provider>
  );
}
