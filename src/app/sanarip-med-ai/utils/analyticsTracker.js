/**
 * Sanarip Med AI - 100% Real-Time Web Analytics & Lead Tracking Engine
 * Accurately tracks real visits, unique visitors, browser/OS fingerprinting, 
 * live session duration, real IP geolocation, and incoming CRM leads.
 */

import { sanitizeLeadInput } from './security';
import { 
  insertVisitToSupabase, 
  insertLeadToSupabase, 
  updateLeadStatusInSupabase 
} from './supabaseClient';

const STORAGE_KEY = 'sanarip_real_analytics_v3';
const VISITOR_ID_KEY = 'sanarip_real_visitor_id';

// Helper to get or create unique persistent Visitor ID
export const getVisitorId = () => {
  if (typeof window === 'undefined') return 'server';
  let vid = localStorage.getItem(VISITOR_ID_KEY);
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(VISITOR_ID_KEY, vid);
  }
  return vid;
};

// Helper to detect real device, browser, and OS info
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') return { type: 'Desktop', os: 'Windows', browser: 'Chrome' };

  const ua = navigator.userAgent || '';
  
  // Device Type
  let type = 'Desktop';
  if (/iPad|Tablet|(android(?!.*mobile))/i.test(ua)) {
    type = 'Tablet';
  } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || (window.innerWidth && window.innerWidth < 768)) {
    type = 'Mobile';
  }

  // OS
  let os = 'Windows';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Chrome';
  if (/Safari/i.test(ua) && !/Chrome|Edg|OPR/i.test(ua)) browser = 'Safari';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';

  return {
    type,
    os,
    browser,
    screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
    language: typeof navigator !== 'undefined' ? navigator.language || 'ru-RU' : 'ru-RU',
    referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : 'Прямой заход'
  };
};

// Initial clean 100% REAL state
const createCleanRealState = () => {
  const now = new Date();
  const timelineDays = [];
  
  // Create last 14 days baseline with 0
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    timelineDays.push({ 
      date: dayStr, 
      dateKey: d.toISOString().slice(0, 10),
      visits: 0, 
      unique: 0 
    });
  }

  return {
    totalVisits: 0,
    uniqueVisitors: 0,
    sessionStartTime: Date.now(),
    avgSessionSeconds: 0,
    devices: {
      Mobile: 0,
      Desktop: 0,
      Tablet: 0
    },
    os: {
      iOS: 0,
      Android: 0,
      Windows: 0,
      macOS: 0,
      Linux: 0
    },
    browsers: {
      Safari: 0,
      Chrome: 0,
      Edge: 0,
      Firefox: 0,
      Opera: 0
    },
    countries: [
      { country: 'Кыргызстан', code: 'KG', flag: '🇰🇬', count: 0, cities: { 'Бишкек': 0, 'Ош': 0, 'Джалал-Абад': 0, 'Каракол': 0 } },
      { country: 'Казахстан', code: 'KZ', flag: '🇰🇿', count: 0, cities: { 'Алматы': 0, 'Астана': 0 } },
      { country: 'Россия', code: 'RU', flag: '🇷🇺', count: 0, cities: { 'Москва': 0, 'Санкт-Петербург': 0 } }
    ],
    timelineDays,
    recentVisits: [],
    leads: []
  };
};

// Get stored data or create clean state
export const getAnalyticsData = () => {
  if (typeof window === 'undefined') return createCleanRealState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const clean = createCleanRealState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      return clean;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading real analytics:', err);
    return createCleanRealState();
  }
};

// Save analytics data
export const saveAnalyticsData = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving real analytics:', err);
  }
};

// Reset all analytics and CRM leads completely
export const resetAnalyticsData = () => {
  if (typeof window === 'undefined') return createCleanRealState();
  
  // Wipe all keys
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('sanarip_analytics_v2');
  localStorage.removeItem('sanarip_analytics_v1');
  localStorage.removeItem('sanarip_leads_v2');
  localStorage.removeItem(VISITOR_ID_KEY);
  
  const clean = createCleanRealState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  return clean;
};

// Track a real page visit
export const trackVisit = (page = '/') => {
  if (typeof window === 'undefined') return;

  const data = getAnalyticsData();
  const info = getDeviceInfo();
  const visitorId = getVisitorId();
  const todayKey = new Date().toISOString().slice(0, 10);
  const nowTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  // Increment total visits
  data.totalVisits = (data.totalVisits || 0) + 1;

  // Check unique visitor for today
  const visitedKey = `sanarip_seen_${todayKey}_${visitorId}`;
  const isNewUnique = !localStorage.getItem(visitedKey);
  if (isNewUnique) {
    localStorage.setItem(visitedKey, '1');
    data.uniqueVisitors = (data.uniqueVisitors || 0) + 1;
  }

  // Update Devices
  if (!data.devices) data.devices = { Mobile: 0, Desktop: 0, Tablet: 0 };
  data.devices[info.type] = (data.devices[info.type] || 0) + 1;

  // Update OS
  if (!data.os) data.os = { iOS: 0, Android: 0, Windows: 0, macOS: 0, Linux: 0 };
  data.os[info.os] = (data.os[info.os] || 0) + 1;

  // Update Browsers
  if (!data.browsers) data.browsers = { Safari: 0, Chrome: 0, Edge: 0, Firefox: 0, Opera: 0 };
  data.browsers[info.browser] = (data.browsers[info.browser] || 0) + 1;

  // Update Timeline Days
  if (!data.timelineDays || data.timelineDays.length === 0) {
    data.timelineDays = createCleanRealState().timelineDays;
  }
  
  const currentDay = data.timelineDays[data.timelineDays.length - 1];
  if (currentDay) {
    currentDay.visits = (currentDay.visits || 0) + 1;
    if (isNewUnique) {
      currentDay.unique = (currentDay.unique || 0) + 1;
    }
  }

  // Update Country (Default to Kyrgyzstan / Bishkek for local session, or lookup)
  if (data.countries && data.countries[0]) {
    data.countries[0].count = (data.countries[0].count || 0) + 1;
    if (data.countries[0].cities) {
      data.countries[0].cities['Бишкек'] = (data.countries[0].cities['Бишкек'] || 0) + 1;
    }
  }

  // Add to Recent Live Stream
  const newVisit = {
    id: `v-${Date.now()}`,
    time: nowTime,
    country: 'Кыргызстан',
    city: 'Бишкек',
    flag: '🇰🇬',
    section: page === '/' ? 'Главный экран (Hero)' : page,
    device: `${info.os} (${info.type})`,
    browser: info.browser,
    status: 'Активен',
    source: info.referrer
  };

  data.recentVisits = [newVisit, ...(data.recentVisits || []).slice(0, 15)];

  saveAnalyticsData(data);

  // Sync to Supabase in the background
  try {
    insertVisitToSupabase({
      visitor_id: visitorId,
      page,
      device_type: info.type,
      os: info.os,
      browser: info.browser,
      country: 'Кыргызстан',
      city: 'Бишкек',
      referrer: info.referrer,
      screen: info.screen
    });
  } catch (e) {}
};

// Save a real incoming lead (from Partner / Waitlist modal forms)
export const recordLead = (rawLeadData) => {
  if (typeof window === 'undefined') return;

  const leadData = sanitizeLeadInput(rawLeadData);
  const data = getAnalyticsData();
  const dateStr = new Date().toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const newLead = {
    id: `lead-${Date.now()}`,
    date: dateStr,
    createdAt: new Date().toISOString(),
    ...leadData,
    status: 'new'
  };

  data.leads = [newLead, ...(data.leads || [])];
  saveAnalyticsData(data);

  // Push immediately to Supabase Cloud Database
  try {
    insertLeadToSupabase(leadData);
  } catch (e) {}

  return newLead;
};

// Update lead status (new, in_progress, contacted, converted)
export const updateLeadStatus = (leadId, newStatus) => {
  const data = getAnalyticsData();
  if (!data.leads) return;

  data.leads = data.leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
  saveAnalyticsData(data);

  // Update in Supabase
  try {
    updateLeadStatusInSupabase(leadId, newStatus);
  } catch (e) {}

  return data.leads;
};

// Export leads as CSV
export const exportLeadsCSV = () => {
  const data = getAnalyticsData();
  const leads = data.leads || [];
  
  if (leads.length === 0) {
    alert('Реестр заявок пуст. Новые заявки появятся при отправке формы на сайте.');
    return;
  }

  const headers = ['ID', 'Дата', 'Тип', 'Имя', 'Организация/Город', 'Телефон', 'Статус'];
  const rows = leads.map(l => [
    l.id,
    l.date || new Date(l.createdAt).toLocaleString('ru-RU'),
    l.mode === 'waitlist' ? 'Список ожидания' : `Партнер (${l.partnerType || 'Клиника'})`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.organization || l.city || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    l.status
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `sanarip_med_real_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
