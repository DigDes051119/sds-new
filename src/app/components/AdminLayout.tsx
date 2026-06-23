import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, LogOut, ChevronRight, Check, Sun, Moon, Star, Users, FolderGit, MapPin, Shield, Briefcase } from "lucide-react";
import logoPng from "../../imports/logo.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { cmsService } from "../cmsService";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("sds_admin_theme") || "dark");
  const [currentAdmin, setCurrentAdmin] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("sds_admin_logged_in");
    if (loggedIn !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sds_admin_logged_in");
    localStorage.removeItem("sds_current_admin");
    navigate("/admin/login");
  };

  const handleReset = () => {
    if (confirm("Вы уверены, что хотите сбросить все изменения сайта к первоначальным?")) {
      cmsService.resetToDefaults();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  const menuItems = [
    { name: "Сводка и аналитика", path: "/admin", icon: LayoutDashboard, permKey: "analytics" },
    { name: "Избранные проекты", path: "/admin/featured", icon: Star, permKey: "featured" },
    { name: "О нас", path: "/admin/about", icon: Users, permKey: "about" },
    { name: "Управление проектами", path: "/admin/projects", icon: FolderGit, permKey: "projects" },
    { name: "Контакты", path: "/admin/contacts", icon: MapPin, permKey: "contacts" },
    { name: "Управление услугами", path: "/admin/services", icon: Briefcase, permKey: "services" },
    { name: "Администрация", path: "/admin/administration", icon: Shield },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === "creator") return true;
    if (item.permKey) {
      return currentAdmin.permissions?.[item.permKey] !== false;
    }
    return true;
  });

  const currentPath = location.pathname;
  const matchedItem = menuItems.find(item => item.path === currentPath);
  const isAllowed = !matchedItem || !matchedItem.permKey || currentAdmin?.role === "creator" || currentAdmin?.permissions?.[matchedItem.permKey] !== false;


  return (
    <div className={`min-h-screen flex font-['Inter',sans-serif] transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-[#080810] text-white admin-theme-dark" 
        : "bg-[#f7f7f3] text-black admin-theme-light"
    }`}>
      {/* Dynamic CSS theme overrides */}
      <style>{`
        .admin-theme-light input, 
        .admin-theme-light select, 
        .admin-theme-light textarea {
          background-color: rgba(0, 0, 0, 0.02) !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
          color: #000000 !important;
        }
        .admin-theme-light select option {
          background-color: #f7f7f3 !important;
          color: #000000 !important;
        }
        .admin-theme-light .bg-white\\/\\[0\\.02\\], 
        .admin-theme-light .bg-white\\/\\[0\\.01\\], 
        .admin-theme-light .bg-white\\/\\[0\\.03\\],
        .admin-theme-light .bg-white\\/\\[0\\.05\\],
        .admin-theme-light .bg-white {
          background-color: #ffffff !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
        }
        .admin-theme-light .border-white\\/\\[0\\.06\\], 
        .admin-theme-light .border-white\\/\\[0\\.08\\], 
        .admin-theme-light .border-white\\/\\[0\\.04\\],
        .admin-theme-light .border-r {
          border-color: rgba(0, 0, 0, 0.08) !important;
        }
        
        /* Elements color reset in light mode */
        .admin-theme-light h1,
        .admin-theme-light h2,
        .admin-theme-light h3,
        .admin-theme-light h4,
        .admin-theme-light p,
        .admin-theme-light label {
          color: #1e1e24 !important;
        }
        
        .admin-theme-light span:not(.text-\\[\\#0066FF\\]):not(.text-red-400):not(.text-emerald-400):not(a *):not(button *) {
          color: rgba(0, 0, 0, 0.8) !important;
        }

        /* Exclude blue buttons / active items from text overrides */
        .admin-theme-light .bg-\\[\\#0000FF\\],
        .admin-theme-light .bg-\\[\\#0000FF\\] *,
        .admin-theme-light .bg-\\[\\#0000FF\\/80\\],
        .admin-theme-light .bg-\\[\\#0000FF\\/80\\] *,
        .admin-theme-light button[class*="bg-[#0000FF]"],
        .admin-theme-light button[class*="bg-[#0000FF]"] *,
        .admin-theme-light a[class*="bg-[#0000FF]"],
        .admin-theme-light a[class*="bg-[#0000FF]"] *,
        .admin-theme-light .bg-blue-600,
        .admin-theme-light .bg-blue-600 * {
          color: #ffffff !important;
        }
        .admin-theme-light .bg-\\[\\#0000FF\\] {
          background-color: #0000FF !important;
        }
        .admin-theme-light .bg-\\[\\#0000FF\\/80\\] {
          background-color: rgba(0, 0, 255, 0.8) !important;
        }

        /* Inactive selector button text color (black) */
        .admin-theme-light button:not([class*="bg-[#0000FF]"]):not([class*="bg-emerald-500"]):not([class*="bg-red-500"]) {
          color: #1e1e24 !important;
        }
        .admin-theme-light button:not([class*="bg-[#0000FF]"]) * {
          color: #1e1e24 !important;
        }

        /* Metric cards circle & icon colors (blue) */
        .admin-theme-light .w-12.h-12.rounded-xl,
        .admin-theme-light div[class*="w-12 h-12"] {
          background-color: rgba(0, 102, 255, 0.08) !important;
          border-color: rgba(0, 102, 255, 0.15) !important;
          color: #0000FF !important;
        }
        .admin-theme-light .w-12.h-12.rounded-xl *,
        .admin-theme-light div[class*="w-12 h-12"] * {
          color: #0000FF !important;
        }

        /* Light-theme styling for Analytics toggle and Reset buttons */
        .admin-theme-light button[class*="bg-emerald-500"] {
          background-color: rgba(16, 185, 129, 0.12) !important;
          border-color: rgba(16, 185, 129, 0.25) !important;
          color: rgb(5, 150, 105) !important;
        }
        .admin-theme-light button[class*="bg-emerald-500"] * {
          color: rgb(5, 150, 105) !important;
        }

        .admin-theme-light button[class*="bg-red-500"] {
          background-color: rgba(239, 68, 68, 0.08) !important;
          border-color: rgba(239, 68, 68, 0.2) !important;
          color: rgb(220, 38, 38) !important;
        }
        .admin-theme-light button[class*="bg-red-500"] * {
          color: rgb(220, 38, 38) !important;
        }

        .admin-theme-light .text-white\\/30,
        .admin-theme-light .text-white\\/40,
        .admin-theme-light .text-white\\/50 {
          color: rgba(0, 0, 0, 0.45) !important;
        }
        .admin-theme-light aside {
          background-color: rgba(0, 0, 0, 0.01) !important;
        }
        .admin-theme-light header {
          background-color: rgba(255, 255, 255, 0.5) !important;
        }
        .admin-theme-light .chart-tooltip {
          background-color: #ffffff !important;
          border-color: rgba(0, 0, 0, 0.12) !important;
          color: #000000 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }
        .admin-theme-dark .chart-tooltip {
          background-color: #0a0a15 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Background ambient lighting (Only in dark mode) */}
      {theme === "dark" && (
        <>
          <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#0000FF]/5 blur-[120px] pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#0066FF]/5 blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Sidebar */}
      <aside className="w-80 bg-white/[0.02] border-r border-white/[0.06] backdrop-blur-2xl flex flex-col shrink-0 relative z-10">
        <div className="p-8 border-b border-white/[0.06] flex items-center justify-center">
          <Link to="/" className="flex flex-col items-center gap-3 text-center">
            <ImageWithFallback 
              src={logoPng} 
              alt="Logo" 
              className={`h-[48px] w-auto object-contain ${theme === "dark" ? "brightness-0 invert" : ""}`} 
            />
            <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${
              theme === "dark" ? "text-white/45" : "text-black/45"
            }`}>
              Административная панель
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 ${
                  isActive
                    ? "bg-[#0000FF]/80 text-white shadow-[0_10px_25px_rgba(0,0,255,0.25)]"
                    : theme === "dark"
                    ? "text-white/60 hover:text-white hover:bg-white/[0.03]"
                    : "text-black/60 hover:text-black hover:bg-black/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : theme === "dark" ? "text-white/40" : "text-black/40"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <button
            onClick={handleReset}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border ${
              resetSuccess
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : theme === "dark"
                ? "border-white/[0.06] hover:border-red-500/30 hover:bg-red-500/5 text-white/40 hover:text-red-400"
                : "border-black/[0.08] hover:border-red-500/30 hover:bg-red-500/5 text-black/40 hover:text-red-400"
            }`}
          >
            {resetSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Сброжено!
              </>
            ) : (
              "Сбросить всё по умолчанию"
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/80 hover:text-white"
                : "bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06] text-black/80 hover:text-black"
            }`}
          >
            <LogOut className="w-4 h-4" />
            Выйти из сессии
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
        <header className={`h-20 border-b px-10 flex items-center justify-between shrink-0 backdrop-blur-md ${
          theme === "dark" ? "border-white/[0.06] bg-black/10" : "border-black/[0.08] bg-white/10"
        }`}>
          <h2 className={`text-xl font-bold tracking-tight ${theme === "dark" ? "text-white/90" : "text-black/90"}`}>
            {menuItems.find((m) => m.path === location.pathname)?.name || "Админка"}
          </h2>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                const nextTheme = theme === "dark" ? "light" : "dark";
                setTheme(nextTheme);
                localStorage.setItem("sds_admin_theme", nextTheme);
              }}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/[0.05] border-white/[0.08] text-white/80 hover:bg-white/[0.1] hover:text-white"
                  : "bg-black/[0.04] border-black/[0.08] text-black/80 hover:bg-black/[0.08] hover:text-black"
              }`}
              title={theme === "dark" ? "Светлая тема" : "Темная тема"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {currentAdmin && currentAdmin.first_name && (
              <span className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border flex items-center gap-2 ${
                theme === "dark" 
                  ? "bg-white/[0.05] border-white/[0.08] text-white/75" 
                  : "bg-black/[0.04] border-black/[0.08] text-black/75"
              }`}>
                <Shield className="w-3.5 h-3.5 text-[#0066FF]" />
                {currentAdmin.first_name} {currentAdmin.last_name} ({currentAdmin.role === "creator" ? "Создатель" : currentAdmin.role === "full" ? "Администратор" : "Модератор"})
              </span>
            )}

            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border flex items-center gap-2 ${
              theme === "dark" 
                ? "bg-white/[0.05] border-white/[0.08] text-white/75" 
                : "bg-black/[0.04] border-black/[0.08] text-black/75"
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Подключение: Supabase DB
            </span>
          </div>
        </header>

        <div className="flex-1 p-10 bg-transparent">
          {isAllowed ? (
            <Outlet />
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
              <Shield className="w-16 h-16 text-red-500/80 animate-pulse" />
              <h3 className="text-xl font-bold tracking-tight text-white/90">Доступ ограничен</h3>
              <p className="text-white/40 text-sm max-w-md">
                У вашей учетной записи нет прав для просмотра раздела "{matchedItem?.name}". Обратитесь к создателю сайта для изменения прав доступа.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
