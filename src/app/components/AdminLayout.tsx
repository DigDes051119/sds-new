import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, LogOut, ChevronRight, ChevronLeft, Check, Sun, Moon, Star, Users, FolderGit, MapPin, Shield, Briefcase, Package, Inbox } from "lucide-react";
import logoPng from "../../imports/logo.webp";
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
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex font-['Inter',sans-serif] transition-colors duration-300 ${
      isDark ? "bg-[#0F1015] text-[#FCFCFD] admin-theme-dark" : "bg-[#F3F4F6] text-[#111827] admin-theme-light"
    }`}>
      {/* Sidebar */}
      <aside className={`flex flex-col shrink-0 relative z-10 transition-all duration-300 border-r ${
        isDark ? "bg-[#16181E] border-[#232630]" : "bg-white border-[#E5E7EB] shadow-sm"
      } ${isCollapsed ? "w-20" : "w-72"}`}>
        {/* Brand Header */}
        <div className={`flex items-center justify-center border-b transition-all duration-300 ${
          isDark ? "border-[#232630]" : "border-[#E5E7EB]"
        } ${isCollapsed ? "p-4 h-20" : "p-6"}`}>
          {isCollapsed ? (
            <Link to="/" className="flex items-center justify-center" title="Перейти на сайт">
              <svg viewBox="0 0 302 237" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M261.108 97.6614C244.926 89.2858 229.394 87.5781 226.467 87.2528L225.084 87.0901H150.842H53.9127C51.3919 86.6835 37.1615 87.9847 37.1615 75.0554C37.1615 63.7523 51.3919 63.427 53.9127 63.0204H125.878C125.878 63.0204 129.131 63.1018 132.221 66.1105C135.311 69.1192 135.88 75.0554 135.88 75.0554H157.348C159.543 75.0554 161.657 74.1607 163.202 72.6157C164.747 71.0707 165.642 68.9564 165.642 66.7609V8.457C165.642 6.26145 164.747 4.14721 163.202 2.60219L163.04 2.4394C161.495 0.894384 159.381 0 157.185 0H76.1123L74.7298 0.162544C71.8024 0.406494 56.2711 2.19545 40.089 10.5711C14.6369 23.7444 0 47.245 0 74.974C0 102.703 14.6369 126.204 40.089 139.377C56.2711 147.752 71.8024 149.46 74.7298 149.785L76.1123 149.948H150.842H248.748C251.268 150.354 265.499 149.054 265.499 161.983C265.499 173.286 251.268 173.611 248.748 174.018H175.563C175.563 174.018 172.31 174.018 169.22 170.927C166.78 168.569 165.642 161.983 165.642 161.983H144.337C142.141 161.983 140.027 162.877 138.482 164.422H138.401C136.856 166.049 135.961 168.163 135.961 170.358V228.5C135.961 230.695 136.856 232.81 138.401 234.355L138.563 234.517C140.108 236.062 142.223 236.957 144.418 236.957H165.723C199.551 236.957 191.338 236.957 225.166 236.957L226.548 236.794C229.475 236.55 245.007 234.761 261.189 226.385C286.641 213.212 301.278 189.712 301.278 161.983C301.278 134.254 286.641 110.753 261.189 97.58L261.108 97.6614Z" fill="#0000FF" />
              </svg>
            </Link>
          ) : (
            <Link to="/" className="flex flex-col items-center gap-2 text-center" title="Перейти на сайт">
              <ImageWithFallback 
                src={logoPng} 
                alt="Logo" 
                className={`h-[42px] w-auto object-contain ${isDark ? "brightness-0 invert" : ""}`} 
              />
              <span className={`text-[9px] font-bold tracking-widest uppercase ${
                isDark ? "text-[#9CA3AF]" : "text-[#6B7280]"
              }`}>
                Административная панель
              </span>
            </Link>
          )}
        </div>

        {/* Menu items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isCollapsed ? "justify-center p-3" : "justify-between px-3.5 py-3"
                } ${
                  isActive
                    ? "bg-[#0000FF] text-white shadow-md shadow-[#0000FF]/25 font-bold"
                    : isDark
                    ? "text-[#9CA3AF] hover:text-white hover:bg-[#1F222A]"
                    : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : isDark ? "text-[#9CA3AF]" : "text-[#6B7280]"}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-3 border-t space-y-2 ${isDark ? "border-[#232630]" : "border-[#E5E7EB]"}`}>
          <button
            onClick={handleReset}
            title={isCollapsed ? "Сбросить всё по умолчанию" : undefined}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 border ${
              resetSuccess
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : isDark
                ? "border-[#232630] hover:border-red-500/30 hover:bg-red-500/10 text-[#9CA3AF] hover:text-red-400"
                : "border-[#E5E7EB] hover:border-red-500/30 hover:bg-red-50 text-[#6B7280] hover:text-red-600"
            }`}
          >
            {resetSuccess ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            )}
            {!isCollapsed && (resetSuccess ? "Сброшено!" : "Сбросить по умолчанию")}
          </button>

          <button
            onClick={handleLogout}
            title={isCollapsed ? "Выйти из сессии" : undefined}
            className={`w-full py-2.5 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 border ${
              isDark
                ? "bg-[#1F222A] hover:bg-[#272B35] border-[#2A2E39] text-[#E5E7EB]"
                : "bg-[#F9FAFB] hover:bg-[#F3F4F6] border-[#E5E7EB] text-[#374151]"
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && "Выйти из сессии"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
        {/* Top Header */}
        <header className={`h-16 border-b px-8 flex items-center justify-between shrink-0 transition-colors ${
          isDark ? "bg-[#16181E] border-[#232630]" : "bg-white border-[#E5E7EB] shadow-xs"
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCollapse}
              className={`p-2 rounded-xl border transition-all duration-200 ${
                isDark
                  ? "bg-[#1F222A] border-[#2A2E39] text-[#9CA3AF] hover:text-white"
                  : "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]"
              }`}
              title={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-[#111827]"}`}>
              {menuItems.find((m) => m.path === location.pathname)?.name || "Админка"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Pill */}
            <button
              onClick={() => {
                const nextTheme = isDark ? "light" : "dark";
                setTheme(nextTheme);
                localStorage.setItem("sds_admin_theme", nextTheme);
              }}
              className={`p-2 rounded-xl border transition-all duration-200 flex items-center gap-2 px-3 text-xs font-semibold ${
                isDark
                  ? "bg-[#1F222A] border-[#2A2E39] text-[#FCFCFD] hover:bg-[#272B35]"
                  : "bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6]"
              }`}
              title="Переключить тему"
            >
              {isDark ? (
                <>
                  <Sun size={15} className="text-amber-400" />
                  <span>Светлая тема</span>
                </>
              ) : (
                <>
                  <Moon size={15} className="text-[#0000FF]" />
                  <span>Темная тема</span>
                </>
              )}
            </button>

            {currentAdmin && currentAdmin.first_name && (
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
                isDark
                  ? "bg-[#1F222A] border-[#2A2E39] text-[#D1D5DB]"
                  : "bg-[#F9FAFB] border-[#E5E7EB] text-[#374151]"
              }`}>
                <Shield className="w-3.5 h-3.5 text-[#0000FF]" />
                {currentAdmin.first_name} {currentAdmin.last_name}
              </span>
            )}

            <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
              isDark
                ? "bg-[#1F222A] border-[#2A2E39] text-[#D1D5DB]"
                : "bg-[#F9FAFB] border-[#E5E7EB] text-[#374151]"
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase DB
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
