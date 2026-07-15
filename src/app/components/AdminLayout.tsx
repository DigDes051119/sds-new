import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, LogOut, ChevronRight, ChevronLeft, Check, Sun, Moon, Star, Users, FolderGit, MapPin, Shield, Briefcase, Package, Inbox } from "lucide-react";
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
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem("sds_admin_sidebar_collapsed") === "true");

  const toggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem("sds_admin_sidebar_collapsed", String(nextVal));
  };
  useEffect(() => {
    const loggedIn = localStorage.getItem("sds_admin_logged_in");
    const password = sessionStorage.getItem("sds_current_admin_password");
    if (loggedIn !== "true" || !password) {
      localStorage.removeItem("sds_admin_logged_in");
      localStorage.removeItem("sds_current_admin");
      sessionStorage.removeItem("sds_current_admin_password");
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sds_admin_logged_in");
    localStorage.removeItem("sds_current_admin");
    sessionStorage.removeItem("sds_current_admin_password");
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
    { name: "Управление продуктами", path: "/admin/products", icon: Package, permKey: "projects" },
    { name: "Контакты", path: "/admin/contacts", icon: MapPin, permKey: "contacts" },
    { name: "Управление услугами", path: "/admin/services", icon: Briefcase, permKey: "services" },
    { name: "Управление брендами", path: "/admin/brands", icon: Star, permKey: "about" },
    { name: "Заявки с сайта", path: "/admin/leads", icon: Inbox, permKey: "contacts" },
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
      <aside className={`bg-white/[0.02] border-r border-white/[0.06] backdrop-blur-2xl flex flex-col shrink-0 relative z-10 transition-all duration-300 ${isCollapsed ? "w-20" : "w-80"}`}>
        <div className={`border-b border-white/[0.06] flex items-center justify-center transition-all duration-300 ${isCollapsed ? "p-4 h-20" : "p-8"}`}>
          {isCollapsed ? (
            <Link to="/" className="flex items-center justify-center" title="Перейти на сайт">
              <svg viewBox="0 0 302 237" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M261.108 97.6614C244.926 89.2858 229.394 87.5781 226.467 87.2528L225.084 87.0901H150.842H53.9127C51.3919 86.6835 37.1615 87.9847 37.1615 75.0554C37.1615 63.7523 51.3919 63.427 53.9127 63.0204H125.878C125.878 63.0204 129.131 63.1018 132.221 66.1105C135.311 69.1192 135.88 75.0554 135.88 75.0554H157.348C159.543 75.0554 161.657 74.1607 163.202 72.6157C164.747 71.0707 165.642 68.9564 165.642 66.7609V8.457C165.642 6.26145 164.747 4.14721 163.202 2.60219L163.04 2.4394C161.495 0.894384 159.381 0 157.185 0H76.1123L74.7298 0.162544C71.8024 0.406494 56.2711 2.19545 40.089 10.5711C14.6369 23.7444 0 47.245 0 74.974C0 102.703 14.6369 126.204 40.089 139.377C56.2711 147.752 71.8024 149.46 74.7298 149.785L76.1123 149.948H150.842H248.748C251.268 150.354 265.499 149.054 265.499 161.983C265.499 173.286 251.268 173.611 248.748 174.018H175.563C175.563 174.018 172.31 174.018 169.22 170.927C166.78 168.569 165.642 161.983 165.642 161.983H144.337C142.141 161.983 140.027 162.877 138.482 164.422H138.401C136.856 166.049 135.961 168.163 135.961 170.358V228.5C135.961 230.695 136.856 232.81 138.401 234.355L138.563 234.517C140.108 236.062 142.223 236.957 144.418 236.957H165.723C199.551 236.957 191.338 236.957 225.166 236.957L226.548 236.794C229.475 236.55 245.007 234.761 261.189 226.385C286.641 213.212 301.278 189.712 301.278 161.983C301.278 134.254 286.641 110.753 261.189 97.58L261.108 97.6614Z" fill={theme === "dark" ? "#FFFFFF" : "#0000FF"} />
              </svg>
            </Link>
          ) : (
            <Link to="/" className="flex flex-col items-center gap-3 text-center" title="Перейти на сайт">
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
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 ${
                  isCollapsed ? "justify-center p-3.5" : "justify-between px-4 py-3.5"
                } ${
                  isActive
                    ? "bg-[#0000FF]/80 text-white shadow-[0_10px_25px_rgba(0,0,255,0.25)]"
                    : theme === "dark"
                    ? "text-white/60 hover:text-white hover:bg-white/[0.03]"
                    : "text-black/60 hover:text-black hover:bg-black/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : theme === "dark" ? "text-white/40" : "text-black/40"}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <button
            onClick={handleReset}
            title={isCollapsed ? "Сбросить всё по умолчанию" : undefined}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border ${
              resetSuccess
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : theme === "dark"
                ? "border-white/[0.06] hover:border-red-500/30 hover:bg-red-500/5 text-white/40 hover:text-red-400"
                : "border-black/[0.08] hover:border-red-500/30 hover:bg-red-500/5 text-black/40 hover:text-red-400"
            }`}
          >
            {resetSuccess ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            )}
            {!isCollapsed && (resetSuccess ? "Сброшено!" : "Сбросить всё по умолчанию")}
          </button>

          <button
            onClick={handleLogout}
            title={isCollapsed ? "Выйти из сессии" : undefined}
            className={`w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/80 hover:text-white"
                : "bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06] text-black/80 hover:text-black"
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && "Выйти из сессии"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
        <header className={`h-20 border-b px-10 flex items-center justify-between shrink-0 backdrop-blur-md ${
          theme === "dark" ? "border-white/[0.06] bg-black/10" : "border-black/[0.08] bg-white/10"
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCollapse}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/[0.05] border-white/[0.08] text-white/80 hover:bg-white/[0.1] hover:text-white"
                  : "bg-black/[0.04] border-black/[0.08] text-black/80 hover:bg-black/[0.08] hover:text-black"
              }`}
              title={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <h2 className={`text-xl font-bold tracking-tight ${theme === "dark" ? "text-white/90" : "text-black/90"}`}>
              {menuItems.find((m) => m.path === location.pathname)?.name || "Админка"}
            </h2>
          </div>
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
