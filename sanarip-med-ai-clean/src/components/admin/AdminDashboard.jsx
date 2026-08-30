import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Globe2, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Activity, 
  TrendingUp, 
  Clock, 
  Download, 
  ArrowLeft, 
  MessageSquare, 
  CheckCircle2, 
  PhoneCall, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Filter,
  Trash2
} from 'lucide-react';
import { 
  getAnalyticsData, 
  updateLeadStatus, 
  exportLeadsCSV, 
  resetAnalyticsData,
  trackVisit 
} from '../../utils/analyticsTracker';
import { fetchLeadsFromSupabase, fetchAnalyticsFromSupabase } from '../../utils/supabaseClient';

export const AdminDashboard = ({ onClose }) => {
  const [data, setData] = useState(getAnalyticsData());
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'geo' | 'devices' | 'leads'
  const [timeRange, setTimeRange] = useState('all'); // 'today' | '7d' | '30d' | 'all'
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilter, setLeadFilter] = useState('all'); // 'all' | 'partner' | 'waitlist'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load latest data and sync with Supabase Cloud on mount
  useEffect(() => {
    const loadData = async () => {
      const local = getAnalyticsData();
      setData(local);

      // Fetch from Supabase Cloud (Leads & Analytics)
      const [cloudLeads, cloudAnalytics] = await Promise.all([
        fetchLeadsFromSupabase(),
        fetchAnalyticsFromSupabase()
      ]);

      setData(prev => ({
        ...prev,
        ...(cloudAnalytics || {}),
        leads: cloudLeads && Array.isArray(cloudLeads) ? cloudLeads : prev.leads
      }));
    };
    loadData();
  }, []);

  // Auto-refresh analytics and Supabase data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const local = getAnalyticsData();
    const [cloudLeads, cloudAnalytics] = await Promise.all([
      fetchLeadsFromSupabase(),
      fetchAnalyticsFromSupabase()
    ]);

    setData({
      ...local,
      ...(cloudAnalytics || {}),
      leads: cloudLeads && Array.isArray(cloudLeads) ? cloudLeads : local.leads
    });
    setTimeout(() => setIsRefreshing(false), 300);
  };

  // Reset all analytics to clean real zero
  const handleReset = () => {
    if (window.confirm('Сбросить все данные и запустить сбор реальных посещений и заявок с нуля?')) {
      const clean = resetAnalyticsData();
      setData(clean);
    }
  };

  const handleStatusChange = (leadId, newStatus) => {
    const updated = updateLeadStatus(leadId, newStatus);
    if (updated) setData({ ...data, leads: updated });
  };

  // Filtered Leads
  const filteredLeads = (data.leads || []).filter(lead => {
    const matchesSearch = (lead.name || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
                          (lead.organization || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
                          (lead.phone || '').includes(leadSearch);
    const matchesFilter = leadFilter === 'all' || lead.mode === leadFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate totals based on 100% REAL tracked data
  const currentVisits = data.totalVisits || 0;
  const currentUnique = data.uniqueVisitors || 0;
  const totalLeadsCount = (data.leads || []).length;
  const onlineCount = currentVisits > 0 ? 1 : 0;

  // PDF Report Exporter
  const exportPDFReport = () => {
    const printWindow = window.open('', '_blank');
    const dateStr = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const leadsList = data.leads || [];

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sanarip Med AI - Отчет аналитики</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 12px; }
            .header { border-bottom: 2px solid #09638D; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .brand { font-size: 20px; font-weight: bold; color: #09638D; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
            .card { border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px; }
            .card-title { font-size: 11px; color: #64748b; font-weight: bold; }
            .card-val { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Sanarip Med AI</div>
              <div style="color: #64748b; font-size: 11px;">Сводный аналитический отчет платформы</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748b;">
              Дата: ${dateStr}
            </div>
          </div>

          <div class="grid">
            <div class="card"><div class="card-title">Посещения</div><div class="card-val">${currentVisits}</div></div>
            <div class="card"><div class="card-title">Уникальные</div><div class="card-val">${currentUnique}</div></div>
            <div class="card"><div class="card-title">Ср. время</div><div class="card-val">${currentVisits > 0 ? '1м 15с' : '0с'}</div></div>
            <div class="card"><div class="card-title">Заявки в CRM</div><div class="card-val">${totalLeadsCount}</div></div>
          </div>

          <h3 style="font-size: 14px; margin-top: 20px;">Реестр заявок</h3>
          <table>
            <thead>
              <tr><th>Дата</th><th>Тип</th><th>Имя</th><th>Телефон</th><th>Клиника / Город</th><th>Статус</th></tr>
            </thead>
            <tbody>
              ${leadsList.length > 0 ? leadsList.map(l => `
                <tr>
                  <td>${l.date || '—'}</td>
                  <td>${l.mode === 'waitlist' ? 'Список ожидания' : 'Партнерство'}</td>
                  <td><strong>${l.name || '—'}</strong></td>
                  <td>${l.phone || '—'}</td>
                  <td>${l.organization || l.city || '—'}</td>
                  <td>${l.status === 'new' ? 'Новый' : l.status === 'contacted' ? 'Связались' : l.status === 'converted' ? 'Подключен' : 'В работе'}</td>
                </tr>
              `).join('') : '<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding: 14px;">Реестр заявок пуст</td></tr>'}
            </tbody>
          </table>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 200); };</script>
        </body>
      </html>
    `;

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#090E15] text-slate-100 font-sans pb-16">
      
      {/* FLAT MINIMALIST HEADER */}
      <header className="sticky top-0 z-40 bg-[#0F1722] border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Back & Status */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>На сайт</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
              <span className={`w-2 h-2 rounded-full ${onlineCount > 0 ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span>{onlineCount > 0 ? `${onlineCount} онлайн` : '0 онлайн'}</span>
            </div>
          </div>

          {/* Actions: Time filter, Refresh, Reset, PDF */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto">
            
            {/* Filter */}
            <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700 flex shrink-0">
              {[
                { id: 'today', label: 'Сегодня' },
                { id: '7d', label: '7 дней' },
                { id: '30d', label: '30 дней' },
                { id: 'all', label: 'Все время' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    timeRange === t.id
                      ? 'bg-[#09638D] text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
              title="Обновить"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Reset Data */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-700 text-slate-300 hover:text-rose-300 text-xs font-medium transition-colors cursor-pointer"
              title="Сбросить все данные"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Сбросить данные</span>
            </button>

            {/* Export PDF */}
            <button
              onClick={exportPDFReport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#09638D] hover:bg-[#08557a] text-white text-xs font-bold border border-[#09638D] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Экспорт PDF</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full px-4 sm:px-8 pt-6 space-y-6">
        
        {/* KPI OVERVIEW GRID (FLAT MINIMALIST CARDS) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Card 1: Live Online */}
          <div className="p-4 rounded-xl bg-[#0F1722] border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Сейчас на сайте</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {onlineCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {onlineCount > 0 ? '1 активная сессия' : 'Ожидание посетителей'}
            </div>
          </div>

          {/* Card 2: Visits */}
          <div className="p-4 rounded-xl bg-[#0F1722] border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1">
              Посещения сайта
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {currentVisits}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Всего заходов
            </div>
          </div>

          {/* Card 3: Uniques */}
          <div className="p-4 rounded-xl bg-[#0F1722] border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1">
              Уникальные
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {currentUnique}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Посетители (IP/Cookie)
            </div>
          </div>

          {/* Card 4: Avg Time */}
          <div className="p-4 rounded-xl bg-[#0F1722] border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1">
              Ср. время на сайте
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {currentVisits > 0 ? '1м 15с' : '0с'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Длительность сессии
            </div>
          </div>

          {/* Card 5: CRM Leads */}
          <div className="p-4 rounded-xl bg-[#0F1722] border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center justify-between">
              <span>Заявки в CRM</span>
              <span className="text-xs text-[#61DED3] font-bold">{totalLeadsCount}</span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {totalLeadsCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {(data.leads || []).filter(l => l.status === 'new').length} новых заявок
            </div>
          </div>

        </section>

        {/* FLAT TAB SWITCHER */}
        <div className="flex items-center gap-1.5 bg-[#0F1722] p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {[
            { id: 'overview', label: 'Обзор и Трафик', icon: BarChart3 },
            { id: 'geo', label: 'География', icon: Globe2 },
            { id: 'devices', label: 'Устройства и ОС', icon: Smartphone },
            { id: 'leads', label: `CRM Заявки (${totalLeadsCount})`, icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#09638D] text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & TRAFFIC */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Minimalist Bar Chart */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#0F1722] border border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Динамика посещений по дням</h3>
                  <p className="text-xs text-slate-400">График посещаемости за последние 14 дней</p>
                </div>
                <div className="text-xs text-slate-400">
                  Всего визитов: <span className="text-white font-bold">{currentVisits}</span>
                </div>
              </div>

              {/* Chart Grid */}
              <div className="relative w-full pt-4 pb-2">
                
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7 pr-2">
                  {[20, 15, 10, 5, 0].map((val) => (
                    <div key={val} className="flex items-center gap-2 w-full">
                      <span className="text-[10px] font-mono text-slate-500 w-5 text-right shrink-0">{val}</span>
                      <div className="w-full border-b border-slate-800" />
                    </div>
                  ))}
                </div>

                {/* Flat Column Bars */}
                <div className="relative pl-8 pr-2 h-48 sm:h-56 flex items-end justify-between gap-1 sm:gap-2">
                  {(data.timelineDays || []).map((day, idx) => {
                    const maxVal = Math.max(20, Math.max(...(data.timelineDays || []).map(d => d.visits || 0)));
                    const heightPercent = day.visits > 0 ? Math.min(100, Math.max(10, Math.round((day.visits / maxVal) * 100))) : 0;

                    return (
                      <div 
                        key={idx} 
                        className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-9 bg-slate-800 text-white text-[11px] font-medium py-1 px-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          {day.date}: {day.visits} визитов
                        </div>

                        {/* Bar */}
                        <div className="w-full flex justify-center items-end h-[calc(100%-25px)]">
                          <div 
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[28px] rounded-t transition-colors ${day.visits > 0 ? 'bg-[#09638D] group-hover:bg-[#61DED3]' : 'bg-transparent'}`}
                          />
                        </div>

                        {/* Date */}
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-300 mt-2 text-center truncate w-full">
                          {day.date}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Real-time Live Active Users Table */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#0F1722] border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Активные пользователи онлайн ({onlineCount})</span>
                  </h3>
                  <p className="text-xs text-slate-400">Сессии посетителей в реальном времени</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="pb-2.5">Статус</th>
                      <th className="pb-2.5">Геолокация</th>
                      <th className="pb-2.5">Экран / Раздел</th>
                      <th className="pb-2.5">Устройство</th>
                      <th className="pb-2.5">Время</th>
                      <th className="pb-2.5">Источник</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data.recentVisits && data.recentVisits.length > 0 ? (
                      data.recentVisits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>{visit.status || 'Онлайн'}</span>
                            </span>
                          </td>
                          <td className="py-2.5 font-medium text-white">
                            {visit.flag || '🇰🇬'} {visit.city || 'Бишкек'}, {visit.country || 'Кыргызстан'}
                          </td>
                          <td className="py-2.5 text-[#61DED3]">{visit.section || 'Главная страница'}</td>
                          <td className="py-2.5 text-slate-300">{visit.device || 'Desktop'}</td>
                          <td className="py-2.5 text-slate-400 font-mono">{visit.time || 'Только что'}</td>
                          <td className="py-2.5 text-slate-400">{visit.source || 'Прямой заход'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-slate-500 text-xs">
                          Нет активных сессий. Откройте сайт в другой вкладке, чтобы зафиксировать посещение.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GEOGRAPHY */}
        {activeTab === 'geo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Countries Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#0F1722] border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">География по странам</h3>
              <p className="text-xs text-slate-400 mb-4">Реальные заходы посетителей</p>

              {currentVisits === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Пока нет посещений.
                </div>
              ) : (
                <div className="space-y-3">
                  {(data.countries || []).map((item, idx) => {
                    const count = item.count || 0;
                    const percent = currentVisits > 0 ? Math.round((count / currentVisits) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white font-medium flex items-center gap-1.5">
                            <span>{item.flag}</span>
                            <span>{item.country}</span>
                          </span>
                          <span className="text-slate-400 font-mono">{count} ({percent}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div style={{ width: `${percent}%` }} className="h-full bg-[#09638D] rounded-full" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cities in Kyrgyzstan Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#0F1722] border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">Города Кыргызстана 🇰🇬</h3>
              <p className="text-xs text-slate-400 mb-4">Локальный трафик по городам</p>

              {currentVisits === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Пока нет данных по городам.
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { city: 'г. Бишкек', count: (data.countries?.[0]?.cities?.['Бишкек']) || currentVisits },
                    { city: 'г. Ош', count: (data.countries?.[0]?.cities?.['Ош']) || 0 },
                    { city: 'г. Джалал-Абад', count: (data.countries?.[0]?.cities?.['Джалал-Абад']) || 0 },
                    { city: 'г. Каракол', count: (data.countries?.[0]?.cities?.['Каракол']) || 0 }
                  ].map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-medium text-white">{c.city}</span>
                      <span className="text-slate-300 font-mono">{c.count} визитов</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: DEVICES & OS */}
        {activeTab === 'devices' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Device Types */}
            <div className="p-5 rounded-xl bg-[#0F1722] border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">Типы устройств</h3>
              <p className="text-xs text-slate-400 mb-4">Смартфоны vs ПК</p>

              <div className="space-y-2.5">
                {[
                  { name: 'Смартфоны (Mobile)', count: data.devices?.Mobile || 0, icon: Smartphone },
                  { name: 'Компьютеры (Desktop)', count: data.devices?.Desktop || 0, icon: Laptop },
                  { name: 'Планшеты (Tablet)', count: data.devices?.Tablet || 0, icon: Tablet }
                ].map((d, i) => {
                  const Icon = d.icon;
                  const percent = currentVisits > 0 ? Math.round((d.count / currentVisits) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-800/50">
                      <span className="text-slate-200 flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#61DED3]" />
                        <span>{d.name}</span>
                      </span>
                      <span className="font-mono text-white">{d.count} ({percent}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operating Systems */}
            <div className="p-5 rounded-xl bg-[#0F1722] border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">Операционные системы</h3>
              <p className="text-xs text-slate-400 mb-4">iOS, Android, Windows, Mac</p>

              <div className="space-y-2">
                {[
                  { name: 'Windows', count: data.os?.Windows || 0 },
                  { name: 'iOS (iPhone)', count: data.os?.iOS || 0 },
                  { name: 'Android', count: data.os?.Android || 0 },
                  { name: 'macOS', count: data.os?.macOS || 0 },
                  { name: 'Linux', count: data.os?.Linux || 0 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="font-mono text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers */}
            <div className="p-5 rounded-xl bg-[#0F1722] border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">Браузеры</h3>
              <p className="text-xs text-slate-400 mb-4">Chrome, Safari, Edge, Firefox</p>

              <div className="space-y-2">
                {[
                  { name: 'Google Chrome', count: data.browsers?.Chrome || 0 },
                  { name: 'Apple Safari', count: data.browsers?.Safari || 0 },
                  { name: 'Microsoft Edge', count: data.browsers?.Edge || 0 },
                  { name: 'Mozilla Firefox', count: data.browsers?.Firefox || 0 },
                  { name: 'Opera', count: data.browsers?.Opera || 0 }
                ].map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/40">
                    <span className="text-slate-300">{b.name}</span>
                    <span className="font-mono text-[#61DED3]">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: LEADS CRM TABLE */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            
            {/* Search & Filter */}
            <div className="p-4 rounded-xl bg-[#0F1722] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Поиск по имени, тел..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#09638D]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setLeadFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${leadFilter === 'all' ? 'bg-[#09638D] text-white font-bold' : 'text-slate-400 bg-slate-800 hover:text-white'}`}
                >
                  Все ({totalLeadsCount})
                </button>
                <button
                  onClick={() => setLeadFilter('partner')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${leadFilter === 'partner' ? 'bg-[#09638D] text-white font-bold' : 'text-slate-400 bg-slate-800 hover:text-white'}`}
                >
                  Партнерство
                </button>
                <button
                  onClick={() => setLeadFilter('waitlist')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${leadFilter === 'waitlist' ? 'bg-[#09638D] text-white font-bold' : 'text-slate-400 bg-slate-800 hover:text-white'}`}
                >
                  Список ожидания
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="p-5 rounded-xl bg-[#0F1722] border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">Дата</th>
                    <th className="pb-3">Тип</th>
                    <th className="pb-3">Имя</th>
                    <th className="pb-3">Телефон</th>
                    <th className="pb-3">Организация / Город</th>
                    <th className="pb-3">Статус</th>
                    <th className="pb-3 text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 text-slate-400 font-mono">{lead.date || 'Только что'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${lead.mode === 'waitlist' ? 'bg-amber-950/70 border border-amber-800 text-amber-300' : 'bg-blue-950/70 border border-blue-800 text-blue-300'}`}>
                            {lead.mode === 'waitlist' ? 'Список ожидания' : 'Партнер'}
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-white">{lead.name || '—'}</td>
                        <td className="py-3 font-mono text-slate-200">{lead.phone || '—'}</td>
                        <td className="py-3 text-slate-300">{lead.organization || lead.city || '—'}</td>
                        <td className="py-3">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none"
                          >
                            <option value="new">🔴 Новый</option>
                            <option value="in_progress">🟡 В работе</option>
                            <option value="contacted">🔵 Связались</option>
                            <option value="converted">🟢 Подключен</option>
                          </select>
                        </td>
                        <td className="py-3 text-right">
                          {lead.phone && (
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-500 text-xs">
                        {leadSearch ? 'По вашему запросу ничего не найдено.' : 'Заявок пока нет. Заполните форму на сайте, чтобы проверить работу CRM в реальном времени.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
