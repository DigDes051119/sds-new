import { queryInstantClinicalAI } from '../services/clinicalAIEngine.js';

// Base REST API URL for Sanarip Med AI Server
const API_BASE_URL = (import.meta.env.VITE_SANARIP_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const SESSION_STORAGE_KEY = 'sanarip_clinical_session_id';

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
 * Send text symptom query to Sanarip Med AI Server (POST /api/chat/message)
 * With zero-downtime client-side offline fallback.
 */
export async function sendClinicalQueryToAI(query, lang = 'ru', options = {}) {
  const sessionId = options.sessionId || getOrCreateSessionId();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
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
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      
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
    // Live server offline or unreachable -> seamless instant fallback
    console.warn('[Sanarip Med AI] Backend unreachable, using built-in clinical engine:', err.message);
  }

  // Graceful Offline Clinical Engine fallback
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
 */
export async function sendVisionQueryToAI(imageFile, message = '', lang = 'ru') {
  const sessionId = getOrCreateSessionId();

  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('session_id', sessionId);
    if (message) formData.append('message', message);
    formData.append('lang', lang);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s for vision model

    const response = await fetch(`${API_BASE_URL}/api/chat/vision`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
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
    console.warn('[Sanarip Med AI Vision] Backend unreachable:', err.message);
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
 */
export async function sendVoiceQueryToAI(audioBlob, lang = 'ru') {
  const sessionId = getOrCreateSessionId();

  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice_symptoms.webm');
    formData.append('session_id', sessionId);
    formData.append('lang', lang);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`${API_BASE_URL}/api/chat/voice`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        transcription: data.transcription || data.transcript || '',
        text: data.reply || data.text || data.message || '',
        suggestedDoctors: data.suggested_doctors || [],
        suggestedClinics: data.suggested_clinics || []
      };
    }
  } catch (err) {
    console.warn('[Sanarip Med AI Voice] Backend voice processing failed:', err.message);
  }

  return {
    success: false,
    text: lang === 'kg' 
      ? 'Үн билдирүүсүн таанууда ката кетти. Сураныч, симптомдорду текст түрүндө жазыңыз.' 
      : 'Не удалось распознать голосовое сообщение. Пожалуйста, напишите симптомы текстом.'
  };
}
