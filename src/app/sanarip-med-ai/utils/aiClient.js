// Base REST API URL for Sanarip Med AI Server
const SERVER_URL = (import.meta.env?.VITE_SANARIP_API_URL || 'https://toys-giant-motorola-arms.trycloudflare.com').replace(/\/$/, '');
const SESSION_STORAGE_KEY = 'sanarip_clinical_session_id';

/**
 * Get existing persistent session ID or generate a new unique UUID
 */
export function getOrCreateSessionId() {
  try {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = `sanarip_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return `sanarip_${Date.now()}`;
  }
}

/**
 * Reset current session ID for a fresh clinical dialogue
 */
export function resetSessionId() {
  const newId = `sanarip_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, newId);
  } catch {
    // Ignore storage issues
  }
  return newId;
}

/**
 * Send text symptom query directly to Sanarip Med AI Server (POST /api/chat/message)
 * Body: { "session_id": "...", "message": "...", "lang": "ru|kg|en" }
 * Response: { "reply": "...", "buttons": [...], "suggested_doctors": [...], "suggested_clinics": [...] }
 */
export async function sendClinicalQueryToAI(query, lang = 'ru', options = {}) {
  const sessionId = options.sessionId || getOrCreateSessionId();

  const candidateUrls = [
    `${SERVER_URL}/api/chat/message`,
    `/api/chat/message`,
    `http://127.0.0.1:8000/api/chat/message`
  ];

  let lastError = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: query,
          lang: lang
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          text: data.reply || data.text || data.message || '',
          buttons: Array.isArray(data.buttons) ? data.buttons : [],
          suggestedDoctors: data.suggested_doctors || data.doctors || [],
          suggestedClinics: data.suggested_clinics || data.clinics || [],
          actionType: data.action_type || 'consultation',
          actionLabel: data.action_label || null
        };
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Сервер Sanarip Med AI недоступен');
}

/**
 * Send injury / rash photo directly to Vision Diagnostics Engine (POST /api/chat/vision)
 */
export async function sendVisionQueryToAI(imageFile, message = '', lang = 'ru') {
  const sessionId = getOrCreateSessionId();

  const candidateUrls = [
    `${SERVER_URL}/api/chat/vision`,
    `/api/chat/vision`,
    `http://127.0.0.1:8000/api/chat/vision`
  ];

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('session_id', sessionId);
  if (message) formData.append('message', message);
  formData.append('lang', lang);

  let lastError = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          type: data.type || data.diagnosis || data.reply || 'Анализ повреждения завершен',
          severity: data.severity || '5 / 10',
          recommendation: data.recommendation || data.reply || '',
          action: data.action || 'Запись к врачу',
          threat: Boolean(data.threat ?? data.is_urgent),
          status: data.status || '✅ Готово'
        };
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Сервер Vision анализа недоступен');
}

/**
 * Send voice audio record directly to Voice Triage Engine (POST /api/chat/voice)
 */
export async function sendVoiceQueryToAI(audioBlob, lang = 'ru') {
  const sessionId = getOrCreateSessionId();

  const candidateUrls = [
    `${SERVER_URL}/api/chat/voice`,
    `/api/chat/voice`,
    `http://127.0.0.1:8000/api/chat/voice`
  ];

  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice_symptoms.webm');
  formData.append('session_id', sessionId);
  formData.append('lang', lang);

  let lastError = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          transcription: data.transcription || '',
          text: data.reply || data.text || data.message || '',
          buttons: Array.isArray(data.buttons) ? data.buttons : [],
          suggestedDoctors: data.suggested_doctors || [],
          suggestedClinics: data.suggested_clinics || []
        };
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Сервер распознавания голоса недоступен');
}
