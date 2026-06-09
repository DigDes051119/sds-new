import { Outlet, NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import logoPng from "../../imports/logo.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Custom cursor component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive-element')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
      animate={{
        x: position.x - (isHovered ? 40 : 8),
        y: position.y - (isHovered ? 40 : 8),
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <motion.div
        className="rounded-full bg-[#0000FF] flex items-center justify-center overflow-hidden"
        animate={{
          width: isHovered ? 80 : 16,
          height: isHovered ? 80 : 16,
          opacity: isHovered ? 0.8 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white text-[10px] font-semibold tracking-wider uppercase"
            >
              Смотреть
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
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

export function Root() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const navLinks = [
    { name: "Главная", path: "/" },
    { name: "О студии", path: "/about" },
    { name: "Услуги", path: "/services" },
    { name: "Проекты", path: "/projects" },
    { name: "Контакты", path: "/contacts" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-black font-['Inter',sans-serif] selection:bg-[#0000FF] selection:text-white md:cursor-none">
      <CustomCursor />
      <InteractiveBackground />
      
      <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-6">
        <div className="mx-auto flex h-16 max-w-[1380px] items-center justify-between gap-4 rounded-full border border-black/10 bg-white/82 px-5 shadow-[0_18px_60px_rgba(0,0,0,0.07)] backdrop-blur-2xl">
          <NavLink to="/" className="flex min-w-[150px] shrink-0 items-center interactive-element sm:min-w-[220px]">
            <ImageWithFallback src={logoPng} alt="Steel Drake Studio" className="block h-9 w-auto object-contain sm:h-10" />
          </NavLink>

          <nav className="hidden items-center gap-1 rounded-full bg-black/[0.035] p-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-xs font-semibold tracking-[-0.01em] transition-colors ${
                    isActive ? "bg-[#0000FF] text-white" : "text-black/65 hover:bg-white hover:text-black"
                  } interactive-element`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <button 
            className="md:hidden p-2 interactive-element"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6"
          >
            <nav className="flex flex-col gap-6 mt-12">
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
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

      <footer className="mx-3 mb-3 mt-24 rounded-[2rem] border border-black/10 bg-white/70 py-8 backdrop-blur sm:mx-6">
        <div className="mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-4 px-6 text-sm text-black/50 md:flex-row">
          <p>© {new Date().getFullYear()} Steel Drake Studio. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0000FF] interactive-element">Instagram</a>
            <a href="#" className="hover:text-[#0000FF] interactive-element">Behance</a>
            <a href="#" className="hover:text-[#0000FF] interactive-element">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
