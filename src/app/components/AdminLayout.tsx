import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, LogOut, ChevronRight, ChevronLeft, Check, Sun, Moon, 
  Star, Users, FolderGit, MapPin, Shield, Briefcase, Package, Inbox, ExternalLink, RefreshCw,
  Search, Bell, Sparkles, Images
} from "lucide-react";
import { cmsService } from "../cmsService";
import logo from "../../imports/logo__2_.svg";
import "../admin.css";

/* ─── Ultra-Dark (Near-Black) & Signature Blue (#0000FF) tokens ─── */
const dark = {
  bg: "#07080B",
  sidebar: "#0D0E13",
  card: "#13141B",
  border: "#222430",
  text: "#F8FAFC",
  muted: "#94A3B8",
  subtle: "#64748B",
  accent: "#0000FF",
  accentGlow: "rgba(0,0,255,0.45)",
};
const light = {
  bg: "#F4F5F9",
  sidebar: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#64748B",
  subtle: "#94A3B8",
  accent: "#0000FF",
  accentGlow: "rgba(0,0,255,0.25)",
};

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
    { name: "Обзор и Аналитика", path: "/admin", icon: LayoutDashboard, permKey: "analytics" },
    { name: "Избранные проекты", path: "/admin/featured", icon: Star, permKey: "featured" },
    { name: "О нас и Команда", path: "/admin/about", icon: Users, permKey: "about" },
    { name: "Проекты", path: "/admin/projects", icon: FolderGit, permKey: "projects" },
    { name: "Продукты", path: "/admin/products", icon: Package, permKey: "projects" },
    { name: "Контакты и Карта", path: "/admin/contacts", icon: MapPin, permKey: "contacts" },
    { name: "Услуги", path: "/admin/services", icon: Briefcase, permKey: "services" },
    { name: "Бренды", path: "/admin/brands", icon: Star, permKey: "about" },
    { name: "Управление галереей", path: "/admin/archive", icon: Images, permKey: "about" },
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
  const t = isDark ? dark : light;

  return (
    <div
      className="admin-app-scope min-h-screen flex transition-colors duration-300"
      style={{ background: t.bg, color: t.text, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ───── FinnHub-Style Sidebar ───── */}
      <aside
        className="flex flex-col shrink-0 relative z-30 transition-all duration-300"
        style={{
          width: isCollapsed ? 72 : 250,
          background: t.sidebar,
          borderRight: `1px solid ${t.border}`,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-center shrink-0 px-4"
          style={{ height: 72, borderBottom: `1px solid ${t.border}` }}
        >
          <Link to="/admin" className="flex items-center justify-center w-full overflow-hidden">
            <img 
              src={logo} 
              alt="Steel Drake Studio Team" 
              className={`w-auto object-contain transition-all duration-300 ${
                isCollapsed ? "h-6 max-w-[40px]" : "h-7 max-w-full"
              } ${isDark ? "brightness-0 invert opacity-90 hover:opacity-100" : "opacity-90 hover:opacity-100"}`} 
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto" style={{ padding: isCollapsed ? "16px 12px" : "16px 12px" }}>
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  className="flex items-center transition-all duration-200 group"
                  style={{
                    borderRadius: 14,
                    padding: isCollapsed ? "10px" : "10px 14px",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    gap: 12,
                    background: isActive ? t.accent : "transparent",
                    color: isActive ? "#FFF" : t.muted,
                    boxShadow: isActive ? `0 4px 16px ${t.accentGlow}` : "none",
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = isDark ? "#1F1F28" : "#F0F0F4";
                      e.currentTarget.style.color = t.text;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = t.muted;
                    }
                  }}
                >
                  <Icon size={19} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom controls */}
        <div className="p-3 space-y-2" style={{ borderTop: `1px solid ${t.border}` }}>
          {currentAdmin && !isCollapsed && (
            <div
              className="p-3 rounded-2xl flex items-center gap-3"
              style={{ background: isDark ? "#1F1F28" : "#F5F5F8", border: `1px solid ${t.border}` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                style={{ background: `${t.accent}20`, color: t.accent, border: `1px solid ${t.accent}30` }}
              >
                {currentAdmin.first_name?.[0] || "A"}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold truncate">{currentAdmin.first_name} {currentAdmin.last_name}</span>
                <span className="text-[10px] capitalize truncate" style={{ color: t.muted }}>
                  {currentAdmin.role === "creator" ? "Создатель" : "Администратор"}
                </span>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              title="Сбросить к дефолту"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              style={{
                border: `1px solid ${resetSuccess ? "#10B981" : t.border}`,
                color: resetSuccess ? "#10B981" : t.muted,
                background: resetSuccess ? "#10B98115" : "transparent",
              }}
            >
              {resetSuccess ? <Check size={14} /> : <RefreshCw size={14} />}
              {!isCollapsed && (resetSuccess ? "Сброшено!" : "Сброс")}
            </button>
            <button
              onClick={handleLogout}
              title="Выйти"
              className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-200 cursor-pointer"
              style={{ border: `1px solid ${t.border}`, color: "#EF4444" }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ───── Main Area ───── */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
        {/* Header bar */}
        <header
          className="shrink-0 flex items-center justify-between px-8"
          style={{ height: 72, borderBottom: `1px solid ${t.border}`, background: t.sidebar }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCollapse}
              className="p-2.5 rounded-xl transition-all cursor-pointer"
              style={{ border: `1px solid ${t.border}`, color: t.muted }}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight m-0">{matchedItem?.name || "Dashboard"}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold"
              style={{ border: `1px solid ${t.border}`, color: t.muted }}
            >
              <ExternalLink size={15} />
              <span className="hidden lg:inline">Перейти на сайт</span>
            </a>

            {/* Theme toggle — FinnHub circle style */}
            <button
              onClick={() => {
                const next = isDark ? "light" : "dark";
                setTheme(next);
                localStorage.setItem("sds_admin_theme", next);
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              style={{ border: `1px solid ${t.border}`, color: isDark ? "#FBBF24" : t.accent }}
              title="Переключить тему"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* DB badge */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ border: `1px solid ${t.border}`, color: t.muted }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase
            </div>

            {/* User avatar */}
            {currentAdmin && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ background: `${t.accent}20`, color: t.accent, border: `1px solid ${t.accent}30` }}
                title={`${currentAdmin.first_name} ${currentAdmin.last_name}`}
              >
                {currentAdmin.first_name?.[0] || "A"}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6 lg:p-10">
          {isAllowed ? (
            <Outlet />
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
              <Shield className="w-16 h-16 text-red-500/80 animate-pulse" />
              <h3 className="text-xl font-bold tracking-tight">Доступ ограничен</h3>
              <p className="text-sm max-w-md" style={{ color: t.muted }}>
                У вашей учетной записи нет прав для просмотра раздела "{matchedItem?.name}".
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
