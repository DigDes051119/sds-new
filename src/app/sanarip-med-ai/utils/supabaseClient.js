/**
 * Lightweight Supabase REST Client (No heavy dependencies needed)
 * Handles Cloud CRM Leads and Real Analytics Storage
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dquqrhckdyeehxvkjwjk.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxdXFyaGNrZHllZWh4dmtqd2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNjI5MTEsImV4cCI6MjEwMjczODkxMX0.Mc2DpJ2mpURnrhw3TkfqAJZTmvMsetMhhwt7yohrrVs';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Prefer': 'return=representation'
};

// Insert a real lead into Supabase
export const insertLeadToSupabase = async (leadData) => {
  try {
    const payload = {
      name: leadData.name || '',
      phone: leadData.phone || '',
      organization: leadData.organization || '',
      city: leadData.city || 'Бишкек',
      mode: leadData.mode || 'waitlist',
      partner_type: leadData.partnerType || '',
      status: 'new'
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.warn('Supabase lead insert warning:', await res.text());
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('Supabase insertLead error:', err);
    return null;
  }
};

// Fetch all real leads from Supabase for Admin
export const fetchLeadsFromSupabase = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc`, {
      method: 'GET',
      headers
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows.map(r => ({
      id: r.id,
      date: new Date(r.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      name: r.name,
      phone: r.phone,
      organization: r.organization,
      city: r.city,
      mode: r.mode,
      partnerType: r.partner_type,
      status: r.status
    }));
  } catch (err) {
    console.error('Supabase fetchLeads error:', err);
    return null;
  }
};

// Update lead status in Supabase
export const updateLeadStatusInSupabase = async (leadId, newStatus) => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: newStatus })
    });
    return res.ok;
  } catch (err) {
    console.error('Supabase updateStatus error:', err);
    return false;
  }
};

// Insert a real visit event to Supabase
export const insertVisitToSupabase = async (visitData) => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/analytics_visits`, {
      method: 'POST',
      headers,
      body: JSON.stringify(visitData)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
};

// Fetch full analytics summary from Supabase Cloud
export const fetchAnalyticsFromSupabase = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/analytics_visits?select=*&order=created_at.desc&limit=1000`, {
      method: 'GET',
      headers
    });
    if (!res.ok) return null;
    const visits = await res.json();

    const totalVisits = visits.length;
    const uniqueVisitorIds = new Set(visits.map(v => v.visitor_id).filter(Boolean));
    const uniqueVisitors = uniqueVisitorIds.size;

    const devices = { Mobile: 0, Desktop: 0, Tablet: 0 };
    const os = { Windows: 0, iOS: 0, Android: 0, macOS: 0, Linux: 0 };
    const browsers = { Chrome: 0, Safari: 0, Edge: 0, Firefox: 0, Opera: 0 };
    const cityCounts = { 'Бишкек': 0, 'Ош': 0, 'Джалал-Абад': 0, 'Каракол': 0 };

    visits.forEach(v => {
      if (v.device_type && devices[v.device_type] !== undefined) devices[v.device_type]++;
      if (v.os && os[v.os] !== undefined) os[v.os]++;
      if (v.browser && browsers[v.browser] !== undefined) browsers[v.browser]++;
      if (v.city && cityCounts[v.city] !== undefined) cityCounts[v.city]++;
    });

    // Recent visits stream
    const recentVisits = visits.slice(0, 15).map((v, idx) => ({
      id: v.id || `v-${idx}`,
      time: new Date(v.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      country: v.country || 'Кыргызстан',
      city: v.city || 'Бишкек',
      flag: '🇰🇬',
      section: v.page === '/' ? 'Главная страница' : v.page,
      device: `${v.os || 'Desktop'} (${v.device_type || 'PC'})`,
      browser: v.browser || 'Chrome',
      status: 'Онлайн',
      source: v.referrer || 'Прямой заход'
    }));

    return {
      totalVisits,
      uniqueVisitors,
      devices,
      os,
      browsers,
      recentVisits,
      countries: [
        { country: 'Кыргызстан', code: 'KG', flag: '🇰🇬', count: totalVisits, cities: cityCounts }
      ]
    };
  } catch (err) {
    console.error('Supabase fetchAnalytics error:', err);
    return null;
  }
};
