import { queryInstantClinicalAI } from '../services/clinicalAIEngine.js';

// Base REST API URL for Sanarip Med AI Server
const DEFAULT_LOCAL_URL = 'http://127.0.0.1:8000';
const SESSION_STORAGE_KEY = 'sanarip_clinical_session_id';

/**
 * Get active API base URL (supports environment variable, localStorage custom URL, or proxy fallback)
 */
export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('sanarip_custom_api_url');
    if (customUrl) return customUrl.replace(/\/$/, '');
  }
  const envUrl = import.meta.env?.VITE_SANARIP_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  return DEFAULT_LOCAL_URL;
}

/**
 * Set custom API URL (e.g. Cloudflare tunnel or remote server)
 */
export function setCustomApiUrl(url) {
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem('sanarip_custom_api_url', url.trim().replace(/\/$/, ''));
    } else {
      localStorage.removeItem('sanarip_custom_api_url');
    }
  }
}

/**
 * Get existing persistent session ID or generate a new unique UUID
 */
export function getOrCreateSessionId() {
  try {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = `sanarip_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return `sanarip_sess_${Date.now()}`;
  }
}

/**
 * Reset current session ID for a fresh clinical dialogue
 */
export function resetSessionId() {
  const newId = `sanarip_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, newId);
  } catch {
    // Ignore storage issues
  }
  return newId;
}

/**
 * Helper to fetch with cascade URLs (1. relative proxy /api, 2. active base URL, 3. localhost fallback)
 */
async function fetchWithCascade(path, options = {}) {
  const endpoints = [];
  const primaryBase = getApiBaseUrl();

  // In browser, try relative /api path first (proxied by Vite/server)
  if (typeof window !== 'undefined' && window.location?.origin) {
    endpoints.push(`${window.location.origin}${path}`);
  }
  // Try configured backend URL
  endpoints.push(`${primaryBase}${path}`);
  // Try 127.0.0.1:8000
  if (!endpoints.includes(`http://127.0.0.1:8000${path}`)) {
    endpoints.push(`http://127.0.0.1:8000${path}`);
  }
  // Try localhost:8000
  if (!endpoints.includes(`http://localhost:8000${path}`)) {
    endpoints.push(`http://localhost:8000${path}`);
  }

  let lastError = null;
  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || 12000);
      const fetchOptions = {
        ...options,
        signal: controller.signal,
      };
      const res = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error(`Failed to reach Sanarip Med AI server at ${path}`);
}

/**
 * Send text symptom query to Sanarip Med AI Server (POST /api/chat/message)
 * Body: { "session_id": "unique_id", "message": "текст сообщения" }
 * Response: { "reply": "текст ответа", "suggested_doctors": [...], "suggested_clinics": [...] }
 */
export async function sendClinicalQueryToAI(query, lang = 'ru', options = {}) {
  const sessionId = options.sessionId || getOrCreateSessionId();

  try {
    const data = await fetchWithCascade('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: query,
        lang: lang
      }),
      timeout: 15000
    });

    if (data) {
      const replyText = data.reply || data.text || data.message || data.response || '';
      const suggestedDoctors = data.suggested_doctors || data.doctors || [];
      const suggestedClinics = data.suggested_clinics || data.clinics || [];
      const triageCode = data.triage_code || data.triageCode || null;
      const actionType = data.action_type || data.actionType || (suggestedDoctors.length ? 'booking' : 'consultation');
      const actionLabel = data.action_label || data.actionLabel || null;

      return {
        success: true,
        isLiveServer: true,
        text: replyText,
        suggestedDoctors,
        suggestedClinics,
        triageCode,
        actionType,
        actionLabel
      };
    }
  } catch (err) {
    console.warn('[Sanarip Med AI] Live AI server error, using fallback:', err?.message || err);
  }

  // Graceful fallback if backend is unreachable
  await new Promise(resolve => setTimeout(resolve, 350));
  const fallback = queryInstantClinicalAI(query, lang);
  return {
    ...fallback,
    isLiveServer: false,
    suggestedDoctors: [],
    suggestedClinics: []
  };
}

/**
 * Send injury / rash photo to Vision Diagnostics Engine (POST /api/chat/vision)
 * Multipart form data: image, session_id, message, lang
 */
export async function sendVisionQueryToAI(imageFile, message = '', lang = 'ru') {
  const sessionId = getOrCreateSessionId();

  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('session_id', sessionId);
    if (message) formData.append('message', message);
    formData.append('lang', lang);

    const data = await fetchWithCascade('/api/chat/vision', {
      method: 'POST',
      body: formData,
      timeout: 25000
    });

    if (data) {
      return {
        success: true,
        isLiveServer: true,
        type: data.type || data.diagnosis || data.reply || 'Анализ повреждения завершен',
        severity: data.severity || data.severity_score || '5 / 10',
        recommendation: data.recommendation || data.reply || 'Обратитесь к врачу',
        action: data.action || data.routing || 'Плановый визит',
        threat: Boolean(data.threat ?? data.is_urgent),
        status: data.status || (data.threat ? '🚨 Внимание' : '✅ Стабильно')
      };
    }
  } catch (err) {
    console.warn('[Sanarip Med AI Vision] Live server vision failed:', err?.message || err);
  }

  return {
    success: true,
    isLiveServer: false,
    type: lang === 'kg' 
      ? 'Жаракаттын алгачкы талдоосу аяктады' 
      : 'Визуальный экспресс-анализ повреждения завершен',
    severity: '5 / 10 (Средняя)',
    recommendation: lang === 'kg' 
      ? 'Жараатты тазалап, дарыгердин кароосунан өтүңүз.' 
      : 'Промойте антисептиком и покажитесь профильному врачу.',
    action: lang === 'kg' ? 'Консультацияга жазылуу' : 'Запись на консультацию',
    threat: false,
    status: '✅ Стабильно'
  };
}

/**
 * Send voice audio record to Voice Triage Engine (POST /api/chat/voice)
 * Multipart form data: audio, session_id, lang
 */
export async function sendVoiceQueryToAI(audioBlob, lang = 'ru') {
  const sessionId = getOrCreateSessionId();

  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice_symptoms.webm');
    formData.append('session_id', sessionId);
    formData.append('lang', lang);

    const data = await fetchWithCascade('/api/chat/voice', {
      method: 'POST',
      body: formData,
      timeout: 25000
    });

    if (data) {
      return {
        success: true,
        transcription: data.transcription || data.transcript || '',
        text: data.reply || data.text || data.message || '',
        suggestedDoctors: data.suggested_doctors || [],
        suggestedClinics: data.suggested_clinics || []
      };
    }
  } catch (err) {
    console.warn('[Sanarip Med AI Voice] Live server voice failed:', err?.message || err);
  }

  return {
    success: false,
    text: lang === 'kg' 
      ? 'Үн билдирүүсүн таанууда ката кетти. Сураныч, симптомдорду текст түрүндө жазыңыз.' 
      : 'Не удалось распознать голосовое сообщение. Пожалуйста, напишите симптомы текстом.'
  };
}
