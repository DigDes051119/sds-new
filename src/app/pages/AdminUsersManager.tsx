import { useState, useEffect } from "react";
import { supabaseClient } from "../supabaseClient";
import { logAdminAction } from "../adminLogger";
import { Shield, Plus, Trash2, Edit2, Check, X, Loader2, AlertCircle, Copy, Terminal, ExternalLink, History, Users, ToggleLeft, ToggleRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminUser {
  id?: number;
  username: string;
  password?: string;
  first_name: string;
  last_name: string;
  role: "creator" | "full" | "limited";
  permissions?: Record<string, boolean>;
}

interface AdminLog {
  id: number;
  admin_username: string;
  admin_name: string;
  section: string;
  action: string;
  details: string;
  created_at: string;
}

export function AdminUsersManager() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users");
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Get current admin
  const currentAdmin = JSON.parse(localStorage.getItem("sds_current_admin") || "{}");
  const isCreator = currentAdmin.role === "creator";
  const canViewLogs = currentAdmin.role === "creator" || (currentAdmin.role === "full" && currentAdmin.permissions?.history !== false);

  const sqlCode = `-- SQL для добавления колонки прав к существующей таблице (запустите, если sds_admins уже создана):
alter table sds_admins add column if not exists permissions jsonb;

-- Полный скрипт инициализации таблиц (для новой базы):
create table sds_admins (
  id bigint generated always as identity primary key,
  username text unique not null,
  password text not null,
  first_name text not null,
  last_name text not null,
  role text not null check (role in ('creator', 'full', 'limited')),
  permissions jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Отключаем защиту RLS для возможности записи администраторов
alter table sds_admins disable row level security;

-- Добавляем первого создателя
insert into sds_admins (username, password, first_name, last_name, role, permissions)
values ('akimkhan', 'akimkhan2026', 'Акимхан', 'Солтокулов', 'creator', '{"analytics":true,"featured":true,"about":true,"projects":true,"contacts":true,"services":true,"history":true}');

-- Создаем таблицу логов действий администраторов
create table sds_admin_logs (
  id bigint generated always as identity primary key,
  admin_username text not null,
  admin_name text not null,
  section text not null,
  action text not null,
  details text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Отключаем защиту RLS для логов
alter table sds_admin_logs disable row level security;`;

  const copySQL = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await supabaseClient.fetchTable("sds_admins");
      setAdmins(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки списка администраторов");
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await supabaseClient.fetchTable("sds_admin_logs");
      const sorted = (data || []).sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setLogs(sorted);
    } catch (err: any) {
      console.warn("Ошибка загрузки логов:", err.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    if (activeTab === "logs" && canViewLogs) {
      loadLogs();
    }
  }, [activeTab, canViewLogs]);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formRole, setFormRole] = useState<"creator" | "full" | "limited">("full");
  const [formPermissions, setFormPermissions] = useState<Record<string, boolean>>({
    analytics: true,
    featured: true,
    about: true,
    projects: true,
    contacts: true,
    services: true,
    history: true
  });

  const resetForm = () => {
    setFormUsername("");
    setFormPassword("");
    setFormFirstName("");
    setFormLastName("");
    setFormRole("full");
    setFormPermissions({
      analytics: true,
      featured: true,
      about: true,
      projects: true,
      contacts: true,
      services: true,
      history: true
    });
  };

  const handleRoleChange = (role: "creator" | "full" | "limited") => {
    setFormRole(role);
    if (role === "creator") {
      setFormPermissions({ analytics: true, featured: true, about: true, projects: true, contacts: true, services: true, history: true });
    } else if (role === "full") {
      setFormPermissions({ analytics: true, featured: true, about: true, projects: true, contacts: true, services: true, history: true });
    } else {
      setFormPermissions({ analytics: true, featured: false, about: false, projects: true, contacts: false, services: true, history: false });
    }
  };

  const handlePermissionToggle = (permKey: string) => {
    setFormPermissions(prev => ({
      ...prev,
      [permKey]: !prev[permKey]
    }));
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCreator) return;

    try {
      setSubmitting(true);
      const newAdmin: AdminUser = {
        username: formUsername.trim().toLowerCase(),
        password: formPassword,
        first_name: formFirstName.trim(),
        last_name: formLastName.trim(),
        role: formRole,
        permissions: formPermissions
      };

      await supabaseClient.insertTable("sds_admins", [newAdmin]);
      
      await logAdminAction(
        "Администрация",
        "Создание администратора",
        `Создана учетная запись для: ${newAdmin.first_name} ${newAdmin.last_name} (логин: ${newAdmin.username}, роль: ${newAdmin.role})`
      );

      setIsAdding(false);
      resetForm();
      showToast("Учетная запись добавлена", "success");
      await loadAdmins();
    } catch (err: any) {
      setIsAdding(false);
      resetForm();
      showToast("Ошибка при создании: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAdmin = (admin: AdminUser) => {
    if (!isCreator) return;
    setEditingId(admin.id || null);
    setFormUsername(admin.username);
    setFormPassword(admin.password || "");
    setFormFirstName(admin.first_name);
    setFormLastName(admin.last_name);
    setFormRole(admin.role);
    
    // Set permissions with fallback defaults
    const defaultPerms = {
      analytics: true,
      featured: admin.role !== "limited",
      about: admin.role !== "limited",
      projects: true,
      contacts: admin.role !== "limited",
      services: true,
      history: admin.role === "creator" || admin.role === "full"
    };
    setFormPermissions(admin.permissions ? { ...defaultPerms, ...admin.permissions } : defaultPerms);
    setIsAdding(false);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCreator || editingId === null) return;

    try {
      setSubmitting(true);
      const updatedAdmin: AdminUser = {
        id: editingId,
        username: formUsername.trim().toLowerCase(),
        password: formPassword,
        first_name: formFirstName.trim(),
        last_name: formLastName.trim(),
        role: formRole,
        permissions: formPermissions
      };

      await supabaseClient.upsertTable("sds_admins", [updatedAdmin]);

      await logAdminAction(
        "Администрация",
        "Редактирование администратора",
        `Обновлена учетная запись: ${updatedAdmin.first_name} ${updatedAdmin.last_name} (роль: ${updatedAdmin.role})`
      );

      setEditingId(null);
      resetForm();
      showToast("Изменения сохранены", "success");
      await loadAdmins();
    } catch (err: any) {
      setEditingId(null);
      resetForm();
      showToast("Ошибка при сохранении: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id: number, username: string) => {
    if (!isCreator) return;
    if (username === currentAdmin.username) {
      alert("Вы не можете удалить свою собственную учётную запись!");
      return;
    }

    if (confirm(`Вы действительно хотите удалить администратора ${username}?`)) {
      try {
        setLoading(true);
        const token = supabaseClient.getToken() || "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";
        const response = await fetch(`https://hniqpnuqqsmqpolxgbav.supabase.co/rest/v1/sds_admins?id=eq.${id}`, {
          method: "DELETE",
          headers: {
            "apikey": "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Не удалось удалить запись");
        }

        await logAdminAction(
          "Администрация",
          "Удаление администратора",
          `Удален доступ для логина: ${username}`
        );

        showToast("Сотрудник удален", "success");
        await loadAdmins();
      } catch (err: any) {
        showToast("Ошибка при удалении: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "creator":
        return "bg-purple-500/10 border-purple-500/25 text-purple-400";
      case "full":
        return "bg-[#0000FF]/10 border-[#0000FF]/25 text-[#0066FF]";
      default:
        return "bg-amber-500/10 border-amber-500/25 text-amber-400";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "creator":
        return "Создатель";
      case "full":
        return "Администратор";
      default:
        return "Модератор";
    }
  };

  const formatLogDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  // Filter logs so that Administrators cannot see Creator logs
  const filteredLogs = logs.filter(log => {
    if (currentAdmin.role === "creator") return true;
    
    // Find admin profile of the log author
    const authorProfile = admins.find(a => a.username === log.admin_username);
    if (authorProfile && authorProfile.role === "creator") {
      return false; // Hide Creator actions from normal Administrators
    }
    return true;
  });

  if (loading && admins.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 max-w-4xl font-['Inter',sans-serif]">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight text-white">Требуется обновление базы данных</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Необходимо выполнить SQL-запрос для добавления колонки прав (permissions) или создания таблиц.
            </p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-bold tracking-tight flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#0066FF]" />
              Создание/обновление таблиц
            </h4>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0066FF] hover:underline flex items-center gap-1"
            >
              Открыть Supabase <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-sm text-white/60 leading-relaxed">
            Выполните этот SQL скрипт в панели SQL Editor вашего проекта Supabase:
          </p>

          <div className="relative bg-[#05050a] border border-white/[0.08] rounded-2xl p-6 font-mono text-xs text-white/80 overflow-x-auto leading-relaxed">
            <button
              onClick={copySQL}
              className="absolute top-4 right-4 p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition flex items-center gap-2 text-white/80 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Скопировано!" : "Копировать SQL"}
            </button>
            <pre>{sqlCode}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full font-['Inter',sans-serif]">
      {/* Tab bar (Creator & Administrator only) */}
      {canViewLogs && !isAdding && editingId === null && (
        <div className="flex gap-4 border-b border-white/[0.06] pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-5 py-3 text-sm font-bold tracking-tight border-b-2 transition-all duration-300 flex items-center gap-2 ${
              activeTab === "users"
                ? "border-[#0000FF] text-white"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            <Users className="w-4 h-4" />
            Список сотрудников
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-5 py-3 text-sm font-bold tracking-tight border-b-2 transition-all duration-300 flex items-center gap-2 ${
              activeTab === "logs"
                ? "border-[#0000FF] text-white"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            <History className="w-4 h-4" />
            История изменений
          </button>
        </div>
      )}

      {/* Header and Add button */}
      {activeTab === "users" && !isAdding && editingId === null && (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white/60 text-sm">Управление правами доступа и администраторами</p>
          </div>
          {isCreator && (
            <button
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="px-5 py-3 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-sm flex items-center gap-2 transition shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Добавить сотрудника
            </button>
          )}
        </div>
      )}

      {/* Role Warnings */}
      {!isCreator && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-xl flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Только создатель имеет доступ к добавлению, редактированию и удалению учетных записей сотрудников. У вас режим просмотра.</span>
        </div>
      )}

      {/* Adding / Editing Forms */}
      {activeTab === "users" && (isAdding || editingId !== null) && (
        <motion.form
          onSubmit={editingId !== null ? handleUpdateAdmin : handleCreateAdmin}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.01] border border-white/[0.06] rounded-3xl p-8 space-y-6"
        >
          <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
            <h3 className="text-xl font-bold tracking-tight text-white/90">
              {editingId !== null ? "Редактирование сотрудника" : "Создание нового сотрудника"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              }}
              className="p-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/60 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Имя</label>
              <input
                type="text"
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
                placeholder="Иван"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Фамилия</label>
              <input
                type="text"
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
                placeholder="Иванов"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Логин (Английский)</label>
              <input
                type="text"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                placeholder="ivanov_i"
                disabled={editingId !== null}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base disabled:opacity-50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Пароль</label>
              <input
                type="text"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Роль доступа</label>
              <select
                value={formRole}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:border-[#0066FF] outline-none text-base"
              >
                <option value="creator" className="bg-[#080810] text-white">Создатель</option>
                <option value="full" className="bg-[#080810] text-white">Администратор</option>
                <option value="limited" className="bg-[#080810] text-white">Модератор</option>
              </select>
            </div>
          </div>

          {/* Granular Permissions Section (Creator only) */}
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/70">Детальные права доступа для роли</h4>
            <p className="text-xs text-white/40">Вы можете включить/отключить права доступа к конкретным разделам сайта для сотрудника.</p>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "analytics", label: "Сводка и аналитика" },
                { key: "featured", label: "Избранные проекты" },
                { key: "about", label: "О нас" },
                { key: "projects", label: "Управление проектами" },
                { key: "contacts", label: "Контакты" },
                { key: "services", label: "Управление услугами" },
                { key: "history", label: "Просмотр истории (логов)" }
              ].map(perm => {
                const isChecked = formPermissions[perm.key] !== false;
                return (
                  <button
                    key={perm.key}
                    type="button"
                    onClick={() => handlePermissionToggle(perm.key)}
                    className={`p-4 rounded-xl border flex items-center justify-between transition text-left ${
                      isChecked
                        ? "bg-[#0000FF]/5 border-[#0000FF]/30 text-white"
                        : "bg-white/[0.01] border-white/[0.06] text-white/40"
                    }`}
                  >
                    <span className="text-xs font-semibold">{perm.label}</span>
                    {isChecked ? (
                      <ToggleRight className="w-6 h-6 text-[#0066FF]" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-white/20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-4 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold rounded-xl text-sm transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Сохранение...
                </>
              ) : editingId !== null ? (
                "Сохранить сотрудника"
              ) : (
                "Создать учетную запись"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              }}
              className="px-6 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] font-bold rounded-xl text-sm transition duration-300"
            >
              Отмена
            </button>
          </div>
        </motion.form>
      )}

      {/* Users Tab View */}
      {activeTab === "users" && !isAdding && editingId === null && (
        <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Имя и Фамилия</th>
                  {isCreator && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Логин (Имя пользователя)</th>}
                  {isCreator && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Пароль</th>}
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Роль доступа</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Разделы (Доступ)</th>
                  {isCreator && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50 text-right">Действия</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {admins.map((admin) => {
                  const defaultPerms = {
                    analytics: true,
                    featured: admin.role !== "limited",
                    about: admin.role !== "limited",
                    projects: true,
                    contacts: admin.role !== "limited",
                    services: true,
                    history: admin.role === "creator" || admin.role === "full"
                  };
                  const perms = admin.permissions ? { ...defaultPerms, ...admin.permissions } : defaultPerms;
                  
                  return (
                    <tr key={admin.id || admin.username} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-white/95">
                        {admin.first_name} {admin.last_name}
                      </td>
                      {isCreator && (
                        <td className="px-6 py-4 text-sm font-mono text-white/60">
                          {admin.username}
                        </td>
                      )}
                      {isCreator && (
                        <td className="px-6 py-4 text-sm font-mono text-white/60">
                          {admin.password}
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getRoleBadgeColor(admin.role)}`}>
                          {getRoleLabel(admin.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {perms.analytics && <span className="bg-white/[0.02] border border-white/[0.05] text-white/50 px-2 py-0.5 rounded-md">Аналитика</span>}
                          {perms.featured && <span className="bg-white/[0.02] border border-white/[0.05] text-white/50 px-2 py-0.5 rounded-md">Избранные</span>}
                          {perms.about && <span className="bg-white/[0.02] border border-white/[0.05] text-white/50 px-2 py-0.5 rounded-md">О нас</span>}
                          {perms.projects && <span className="bg-white/[0.02] border border-white/[0.05] text-white/50 px-2 py-0.5 rounded-md">Проекты</span>}
                          {perms.contacts && <span className="bg-white/[0.02] border border-white/[0.05] text-white/50 px-2 py-0.5 rounded-md">Контакты</span>}
                          {perms.services && <span className="bg-white/[0.02] border border-white/[0.05] text-white/50 px-2 py-0.5 rounded-md">Услуги</span>}
                          {perms.history && <span className="bg-white/[0.02] border border-white/[0.05] text-white/50 px-2 py-0.5 rounded-md">Логи</span>}
                        </div>
                      </td>
                      {isCreator && (
                        <td className="px-6 py-4 text-sm text-right space-x-2">
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="p-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-white/70 hover:text-white rounded-xl transition"
                            title="Редактировать"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id!, admin.username)}
                            disabled={admin.username === currentAdmin.username}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition disabled:opacity-30 disabled:pointer-events-none"
                            title="Удалить"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Logs Tab View */}
      {canViewLogs && activeTab === "logs" && !isAdding && editingId === null && (
        <div className="bg-white/[0.01] border border-white/[0.06] rounded-3xl overflow-hidden shadow-sm">
          {loadingLogs ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-6 h-6 text-[#0066FF] animate-spin" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-white/40 text-sm">
              Логи действий отсутствуют.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50 w-44">Дата и время</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50 w-52">Администратор</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50 w-40">Раздел</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50 w-48">Действие</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-white/50">Детали изменения</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-sm">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 text-white/60 font-mono text-xs whitespace-nowrap">
                        {formatLogDate(log.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white/95">{log.admin_name}</div>
                        <div className="text-xs text-white/40 font-mono">@{log.admin_username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-white/[0.03] border border-white/[0.06] text-white/80 px-2.5 py-1 rounded-lg text-xs font-medium">
                          {log.section}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#0066FF]">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-white/70 max-w-xs md:max-w-md truncate" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Floating top toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 24, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            className={`fixed top-0 left-1/2 -translate-x-1/2 font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border max-w-md text-center ${
              toast.type === "success"
                ? "bg-emerald-500 text-white border-emerald-400"
                : "bg-red-500 text-white border-red-400"
            }`}
          >
            {toast.type === "success" ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
