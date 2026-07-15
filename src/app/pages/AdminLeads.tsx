import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Inbox, Archive, Trash2, RefreshCw, Phone, User, Clock,
  CheckCircle, AlertCircle, ChevronDown, ChevronUp, X, ArchiveRestore
} from "lucide-react";
import { supabaseClient } from "../supabaseClient";

interface Lead {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  archived?: boolean;
  note?: string;
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин. назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч. назад`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} дн. назад`;
  return new Date(isoDate).toLocaleDateString("ru-RU");
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [noteEditing, setNoteEditing] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const sqlHint = `-- Выполните в Supabase SQL Editor для настройки таблицы sds_leads:

CREATE TABLE IF NOT EXISTS sds_leads (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  archived boolean default false,
  note text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Разрешить публичную запись (INSERT) с сайта:
ALTER TABLE sds_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert leads" ON sds_leads;
CREATE POLICY "Allow public insert leads" ON sds_leads FOR INSERT TO anon WITH CHECK (true);

-- Разрешить чтение/обновление/удаление для авторизованных пользователей:
DROP POLICY IF EXISTS "Allow auth read leads" ON sds_leads;
CREATE POLICY "Allow auth read leads" ON sds_leads FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow auth update leads" ON sds_leads;
CREATE POLICY "Allow auth update leads" ON sds_leads FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Allow auth delete leads" ON sds_leads;
CREATE POLICY "Allow auth delete leads" ON sds_leads FOR DELETE TO authenticated USING (true);

-- Для чтения без авторизации (если хотите):
DROP POLICY IF EXISTS "Allow anon read leads" ON sds_leads;
CREATE POLICY "Allow anon read leads" ON sds_leads FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow anon update leads" ON sds_leads;
CREATE POLICY "Allow anon update leads" ON sds_leads FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Allow anon delete leads" ON sds_leads;
CREATE POLICY "Allow anon delete leads" ON sds_leads FOR DELETE TO anon USING (true);`;

  const [sqlCopied, setSqlCopied] = useState(false);

  async function loadLeads(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await supabaseClient.fetchLeads();
      setLeads(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки заявок");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { loadLeads(); }, []);

  const activeLeads = leads.filter(l => !l.archived);
  const archivedLeads = leads.filter(l => l.archived);
  const displayed = tab === "active" ? activeLeads : archivedLeads;

  const handleArchive = async (lead: Lead) => {
    setActionLoading(lead.id);
    try {
      await supabaseClient.updateLead(lead.id, { archived: !lead.archived });
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, archived: !l.archived } : l));
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (!confirm(`Удалить заявку от ${lead.name} (${lead.phone})? Это действие нельзя отменить.`)) return;
    setActionLoading(lead.id);
    try {
      await supabaseClient.deleteLead(lead.id);
      setLeads(prev => prev.filter(l => l.id !== lead.id));
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveNote = async (lead: Lead) => {
    setActionLoading(lead.id);
    try {
      await supabaseClient.updateLead(lead.id, { note: noteText });
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, note: noteText } : l));
      setNoteEditing(null);
    } catch (err: any) {
      alert("Ошибка сохранения заметки: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#0000FF] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-3xl font-['Inter',sans-serif]">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight">Таблица заявок не найдена</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Необходимо создать таблицу <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">sds_leads</code> в вашем проекте Supabase.
            </p>
            <p className="text-red-400 font-mono text-xs mt-2 bg-black/30 p-3 rounded-lg border border-red-500/10">
              {error}
            </p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0066FF]">SQL для настройки таблицы</h4>
            <button
              onClick={() => { navigator.clipboard.writeText(sqlHint); setSqlCopied(true); setTimeout(() => setSqlCopied(false), 2000); }}
              className="px-4 py-2 bg-[#0000FF] hover:bg-[#0022FF] text-white text-xs font-bold rounded-xl transition"
            >
              {sqlCopied ? "Скопировано!" : "Копировать SQL"}
            </button>
          </div>
          <pre className="bg-[#05050a] border border-white/[0.08] rounded-2xl p-5 font-mono text-xs text-white/70 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {sqlHint}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Заявки с сайта</h2>
          <p className="text-white/40 text-sm mt-1">
            {activeLeads.length} новых · {archivedLeads.length} в архиве
          </p>
        </div>
        <button
          onClick={() => loadLeads(true)}
          disabled={refreshing}
          className="px-4 py-2.5 bg-[#0000FF] hover:bg-[#0022FF] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Обновить
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Новые заявки</p>
            <p className="text-4xl font-bold mt-2">{activeLeads.length}</p>
            <p className="text-[10px] text-[#0066FF] font-semibold flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" /> Ожидают обработки
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#0000FF]/10 border border-[#0000FF]/20 flex items-center justify-center">
            <Inbox className="w-7 h-7 text-[#0066FF]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">В архиве</p>
            <p className="text-4xl font-bold mt-2">{archivedLeads.length}</p>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-2">
              <CheckCircle className="w-3 h-3" /> Обработаны
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Archive className="w-7 h-7 text-emerald-400" />
          </div>
        </motion.div>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-white/[0.03] border border-white/[0.06] p-1 rounded-2xl w-fit">
        {(["active", "archived"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              tab === t ? "bg-[#0000FF] text-white shadow-md" : "text-white/50 hover:text-white"
            }`}
          >
            {t === "active" ? <Inbox className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            {t === "active" ? `Входящие (${activeLeads.length})` : `Архив (${archivedLeads.length})`}
          </button>
        ))}
      </div>

      {/* Leads list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayed.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-4"
            >
              {tab === "active" ? (
                <>
                  <Inbox className="w-12 h-12 text-white/20" />
                  <p className="text-white/40 text-sm">Новых заявок пока нет</p>
                  <p className="text-white/25 text-xs">Когда клиент оставит заявку на сайте, она появится здесь</p>
                </>
              ) : (
                <>
                  <Archive className="w-12 h-12 text-white/20" />
                  <p className="text-white/40 text-sm">Архив пуст</p>
                  <p className="text-white/25 text-xs">Обработанные заявки будут храниться здесь</p>
                </>
              )}
            </motion.div>
          ) : (
            displayed.map((lead, idx) => {
              const isExpanded = expandedId === lead.id;
              const isEditingNote = noteEditing === lead.id;
              const isActing = actionLoading === lead.id;

              return (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`bg-white/[0.02] border rounded-2xl overflow-hidden transition-colors duration-200 ${
                    tab === "active"
                      ? "border-white/[0.06] hover:border-[#0000FF]/20"
                      : "border-white/[0.04] opacity-80"
                  }`}
                >
                  {/* Main row */}
                  <div
                    className="flex items-center gap-4 p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  >
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-base ${
                      tab === "active"
                        ? "bg-[#0000FF]/15 text-[#0066FF]"
                        : "bg-white/[0.04] text-white/40"
                    }`}>
                      {lead.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{lead.name}</span>
                        {tab === "active" && (
                          <span className="text-[10px] bg-[#0000FF]/15 text-[#0066FF] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Новая
                          </span>
                        )}
                        {tab === "archived" && (
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Обработана
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-white/50 text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </span>
                        <span className="text-white/30 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeAgo(lead.created_at)}
                        </span>
                      </div>
                      {lead.note && !isExpanded && (
                        <p className="text-white/35 text-xs mt-1 truncate max-w-md">📝 {lead.note}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleArchive(lead)}
                        disabled={isActing}
                        title={lead.archived ? "Вернуть из архива" : "Добавить в архив"}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 ${
                          lead.archived
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        {isActing ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                        ) : lead.archived ? (
                          <ArchiveRestore className="w-3.5 h-3.5" />
                        ) : (
                          <Archive className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">
                          {lead.archived ? "Вернуть" : "В архив"}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDelete(lead)}
                        disabled={isActing}
                        title="Удалить заявку"
                        className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                        className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white transition-all duration-200"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-white/[0.04] space-y-4">
                          {/* Full details */}
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <User className="w-3 h-3" /> Имя клиента
                              </p>
                              <p className="text-sm font-semibold">{lead.name}</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Phone className="w-3 h-3" /> Телефон
                              </p>
                              <a
                                href={`tel:${lead.phone}`}
                                className="text-sm font-semibold text-[#0066FF] hover:underline"
                              >
                                {lead.phone}
                              </a>
                            </div>
                            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> Дата заявки
                              </p>
                              <p className="text-sm font-semibold">{formatDate(lead.created_at)}</p>
                            </div>
                          </div>

                          {/* Note */}
                          <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">
                                📝 Заметка
                              </p>
                              {!isEditingNote ? (
                                <button
                                  onClick={() => { setNoteEditing(lead.id); setNoteText(lead.note || ""); }}
                                  className="text-[10px] text-[#0066FF] hover:underline font-semibold"
                                >
                                  {lead.note ? "Редактировать" : "Добавить заметку"}
                                </button>
                              ) : (
                                <button
                                  onClick={() => setNoteEditing(null)}
                                  className="text-[10px] text-white/40 hover:text-white"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {isEditingNote ? (
                              <div className="space-y-3">
                                <textarea
                                  value={noteText}
                                  onChange={e => setNoteText(e.target.value)}
                                  rows={3}
                                  placeholder="Напишите заметку по заявке..."
                                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#0000FF] transition resize-none"
                                />
                                <button
                                  onClick={() => handleSaveNote(lead)}
                                  disabled={actionLoading === lead.id}
                                  className="px-4 py-2 bg-[#0000FF] hover:bg-[#0022FF] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                                >
                                  {actionLoading === lead.id
                                    ? <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    : null}
                                  Сохранить заметку
                                </button>
                              </div>
                            ) : (
                              <p className={`text-sm leading-relaxed ${lead.note ? "text-white/70" : "text-white/25 italic"}`}>
                                {lead.note || "Нет заметок"}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
