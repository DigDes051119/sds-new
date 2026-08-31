import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Send, 
  Heart, 
  Baby, 
  Brain, 
  FlaskConical, 
  Bone, 
  RefreshCw, 
  ShieldCheck, 
  ArrowUpRight,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Stethoscope,
  Building2,
  Calendar,
  Phone
} from 'lucide-react';
import { sendClinicalQueryToAI, sendVisionQueryToAI, sendVoiceQueryToAI, resetSessionId } from '../../utils/aiClient';

// Gemini Suggestion Cards with Category Badges & Color Themes
const GEMINI_SUGGESTIONS = {
  ru: [
    {
      id: 'cardio',
      icon: Heart,
      badge: 'Кардиология',
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200/60',
      iconBg: 'bg-rose-500/10 text-rose-600',
      title: 'Давящая боль в груди',
      desc: 'Оценка симптомов инфаркта и алгоритм первой помощи до приезда 103',
      prompt: 'Давящая боль за грудиной, отдает в левую руку и челюсть, трудно дышать. Что делать?'
    },
    {
      id: 'pediatrics',
      icon: Baby,
      badge: 'Педиатрия',
      badgeColor: 'bg-amber-50 text-amber-600 border-amber-200/60',
      iconBg: 'bg-amber-500/10 text-amber-600',
      title: 'Температура 39°C у ребенка',
      desc: 'Педиатрический протокол: безопасное снижение жара и расчет дозировок',
      prompt: 'У ребенка 3 года температура 39.2°C, вялость, не сбивается парацетамолом.'
    },
    {
      id: 'neuro',
      icon: Brain,
      badge: 'Неврология',
      badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
      iconBg: 'bg-indigo-500/10 text-indigo-600',
      title: 'Острая мигрень & FAST-тест',
      desc: 'Дифференциальная диагностика головной боли и исключение инсульта',
      prompt: 'Сильная пульсирующая боль в правом виске со светобоязнью и тошнотой.'
    },
    {
      id: 'labs',
      icon: FlaskConical,
      badge: 'Анализы',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      title: 'Расшифровка анализов',
      desc: 'Интерпретация общего анализа крови, ферритина, железа и витаминов',
      prompt: 'Гемоглобин 95 г/л, ферритин 8 мкг/л, постоянная усталость. Что это значит?'
    }
  ],
  kg: [
    {
      id: 'cardio',
      icon: Heart,
      badge: 'Кардиология',
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200/60',
      iconBg: 'bg-rose-500/10 text-rose-600',
      title: 'Көкүрөктүн катуу оорушу',
      desc: 'Инфаркт коркунучун баалоо жана 103 кызматы келгенче алгачкы жардам',
      prompt: 'Көкүрөк кысылып, сол колго берип ооруп жатат, дем алуу кыйындады. Эмне кылуу керек?'
    },
    {
      id: 'pediatrics',
      icon: Baby,
      badge: 'Педиатрия',
      badgeColor: 'bg-amber-50 text-amber-600 border-amber-200/60',
      iconBg: 'bg-amber-500/10 text-amber-600',
      title: 'Баланын дене табы 39°C',
      desc: 'Педиатриялык эрежелер: температураны туура түшүрүү жана суюктук ичирүү',
      prompt: '3 жаштагы баланын температурасы 39.2°C болуп түшпөй жатат, шашылыш кеңеш бериңиз.'
    },
    {
      id: 'trauma',
      icon: Bone,
      badge: 'Травматология',
      badgeColor: 'bg-blue-50 text-blue-600 border-blue-200/60',
      iconBg: 'bg-blue-500/10 text-blue-600',
      title: 'Кол же буттун травмасы',
      desc: 'Сөөк сынуу шеги жана травмпунктка чейинки коопсуз иммобилизация',
      prompt: 'Жыгылып түшүп билекти катуу оорутуп алдым, шишип манжалар кыймылдабай калды.'
    },
    {
      id: 'labs',
      icon: FlaskConical,
      badge: 'Лаборатория',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      title: 'Кан анализин чечмелөө',
      desc: 'Гемоглобин, ферритин жана витаминдердин жетишсиздигин аныктоо',
      prompt: 'Гемоглобин 95, ферритин 8 болуп чыкты, дайыма чарчап алсырайм. Кандай дарыгерге көрүнүү керек?'
    }
  ],
  en: [
    {
      id: 'cardio',
      icon: Heart,
      badge: 'Cardiology Triage',
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200/60',
      iconBg: 'bg-rose-500/10 text-rose-600',
      title: 'Severe chest pain triage',
      desc: 'Acute coronary syndrome assessment & step-by-step emergency instructions',
      prompt: 'Crushing chest pain radiating to left arm and jaw, difficulty breathing. What should I do?'
    },
    {
      id: 'pediatrics',
      icon: Baby,
      badge: 'Pediatrics',
      badgeColor: 'bg-amber-50 text-amber-600 border-amber-200/60',
      iconBg: 'bg-amber-500/10 text-amber-600',
      title: 'High fever in child 39°C',
      desc: 'Pediatric protocol: safe antipyretic dosing and dehydration management',
      prompt: 'My 3-year-old toddler has a fever of 39.2°C, lethargic, paracetamol is not working.'
    },
    {
      id: 'neuro',
      icon: Brain,
      badge: 'Neurology',
      badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
      iconBg: 'bg-indigo-500/10 text-indigo-600',
      title: 'Migraine & FAST test',
      desc: 'Headache differential evaluation and stroke symptom checklist',
      prompt: 'Throbbing headache in right temple with photophobia, nausea, and aura.'
    },
    {
      id: 'labs',
      icon: FlaskConical,
      badge: 'Lab Interpretation',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      title: 'Blood test interpretation',
      desc: 'Comprehensive analysis of CBC, Ferritin, Iron, and Vitamin D panels',
      prompt: 'Hemoglobin 95 g/L, ferritin 8 mcg/L, constant chronic fatigue. How should I proceed?'
    }
  ]
};

/**
 * Parses Markdown formatting (**bold**, *italic*, lists, headings, dividers)
 * and renders clean, beautifully styled React typography elements with zero raw asterisks.
 */
function renderFormattedMessage(rawText, isUser = false) {
  if (!rawText) return null;
  if (isUser) {
    return (
      <div className="text-base leading-relaxed font-normal whitespace-pre-line text-white">
        {rawText}
      </div>
    );
  }

  const parseInline = (str) => {
    const parts = [];
    const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.slice(lastIndex, match.index));
      }
      if (match[2] !== undefined) {
        parts.push(
          <strong key={match.index} className="font-extrabold text-slate-950">
            {match[2]}
          </strong>
        );
      } else if (match[4] !== undefined) {
        parts.push(
          <em key={match.index} className="italic text-slate-700">
            {match[4]}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.slice(lastIndex));
    }
    return parts.length > 0 ? parts : str;
  };

  const lines = rawText.split('\n');
  const elements = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1.5 my-2 pl-0.5">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-slate-800 text-[15px] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#09638D] mt-2 shrink-0" />
              <div className="flex-1">{parseInline(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentList = null;
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    // Horizontal rule
    if (/^(\-{3,}|\_{3,}|\*{3,})$/.test(trimmed)) {
      flushList();
      elements.push(<hr key={lineIdx} className="my-3 border-slate-200" />);
      return;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      elements.push(
        <div key={lineIdx} className="font-extrabold text-slate-900 text-base sm:text-lg mt-3 mb-1">
          {parseInline(headingMatch[2])}
        </div>
      );
      return;
    }

    // Bullet item (- or * or •)
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      if (!currentList) currentList = [];
      currentList.push(bulletMatch[1]);
      return;
    }

    // Numbered list item (1. or 2.)
    const numberMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numberMatch) {
      flushList();
      elements.push(
        <div key={lineIdx} className="flex items-start gap-2 text-slate-800 text-[15px] leading-relaxed my-1 pl-0.5">
          <span className="font-bold text-[#09638D] shrink-0 min-w-[20px]">{numberMatch[1]}.</span>
          <div className="flex-1">{parseInline(numberMatch[2])}</div>
        </div>
      );
      return;
    }

    // Empty line
    if (!trimmed) {
      flushList();
      elements.push(<div key={lineIdx} className="h-2" />);
      return;
    }

    // Paragraph
    flushList();
    elements.push(
      <p key={lineIdx} className="text-slate-800 text-[15px] leading-relaxed font-normal">
        {parseInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export const HeroAIChat = () => {
  const { language, t } = useLanguage();
  const currentLang = (language || 'RU').toLowerCase();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [showMessagesFeed, setShowMessagesFeed] = useState(false);
  
  // Voice & Image Attachment State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedImagePreview, setAttachedImagePreview] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const activeSuggestions = GEMINI_SUGGESTIONS[currentLang] || GEMINI_SUGGESTIONS.ru;
  const hasMessages = isChatExpanded;

  useEffect(() => {
    if (messagesContainerRef.current && showMessagesFeed) {
      const timer = setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [messages, isTyping, showMessagesFeed]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const isScrollable = el.scrollHeight > el.clientHeight;
      if (isScrollable) {
        e.stopPropagation();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [hasMessages, messages, showMessagesFeed]);

  // Voice recording toggle
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        handleSendVoice(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Не удалось получить доступ к микрофону. Разрешите доступ в браузере.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedImage(file);
      const reader = new FileReader();
      reader.onload = () => setAttachedImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const executeAIQuery = async (query, imageFile = null) => {
    setIsTyping(true);
    try {
      let response;
      if (imageFile) {
        response = await sendVisionQueryToAI(imageFile, query, currentLang);
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.recommendation ? `🔍 Результат анализа фото:\n\n${response.type}\n\nРекомендация: ${response.recommendation}` : response.type,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: response.action ? 'booking' : 'consultation',
          actionLabel: response.action || 'Записаться к врачу',
          suggestedDoctors: [],
          suggestedClinics: []
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        response = await sendClinicalQueryToAI(query, currentLang);
        
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.text || (currentLang === 'kg' ? 'Сурооңуз кабыл алынды.' : 'Я изучил ваши симптомы.'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: response.actionType || 'booking',
          actionLabel: response.actionLabel || (currentLang === 'kg' ? '📅 Дарыгерге жазылуу' : '📅 Записаться на прием'),
          suggestedDoctors: response.suggestedDoctors || [],
          suggestedClinics: response.suggestedClinics || []
        };

        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: currentLang === 'kg'
          ? 'Симптомдор сакталса же күчөсө, профилдик дарыгердин очной кароосунан өтүүнү сунуштайм.'
          : 'Если симптомы сохраняются или усиливаются, рекомендую записаться на очный осмотр к профильному врачу.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: 'booking',
        actionLabel: currentLang === 'kg' ? '📅 Дарыгерге жазылуу' : '📅 Записаться к врачу'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      setAttachedImage(null);
      setAttachedImagePreview(null);
    }
  };

  const handleSendVoice = async (audioBlob) => {
    setIsTyping(true);
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: '🎤 [Голосовое сообщение с симптомами]',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!isChatExpanded) {
      setIsChatExpanded(true);
      setShowMessagesFeed(false);
      setTimeout(async () => {
        setMessages([userMsg]);
        setShowMessagesFeed(true);
        const res = await sendVoiceQueryToAI(audioBlob, currentLang);
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.text || 'Голосовое сообщение обработано.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedDoctors: res.suggestedDoctors || [],
          suggestedClinics: res.suggestedClinics || []
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 780);
    } else {
      setMessages(prev => [...prev, userMsg]);
      const res = await sendVoiceQueryToAI(audioBlob, currentLang);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.text || 'Голосовое сообщение обработано.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedDoctors: res.suggestedDoctors || [],
        suggestedClinics: res.suggestedClinics || []
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }
  };

  const handleSend = async (customPrompt = null) => {
    const query = customPrompt || inputText;
    const currentImg = attachedImage;
    const currentImgPreview = attachedImagePreview;

    if (!query && !currentImg) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query ? query.trim() : '📷 [Отправлено фото повреждения]',
      image: currentImgPreview,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!customPrompt) setInputText('');

    if (!isChatExpanded) {
      setIsChatExpanded(true);
      setShowMessagesFeed(false);

      setTimeout(() => {
        setMessages([userMsg]);
        setShowMessagesFeed(true);
        executeAIQuery(query, currentImg);
      }, 780);
    } else {
      setMessages(prev => [...prev, userMsg]);
      executeAIQuery(query, currentImg);
    }
  };

  const handleReset = () => {
    resetSessionId();
    setIsChatExpanded(false);
    setShowMessagesFeed(false);
    setMessages([]);
    setInputText('');
    setIsTyping(false);
    setAttachedImage(null);
    setAttachedImagePreview(null);
  };

  return (
    <section id="ai-chat" className="py-16 sm:py-20 bg-[#F3F5F9] text-slate-900 relative overflow-hidden h-[900px] sm:h-[940px] flex flex-col justify-between">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#61DED3]/15 via-[#09638D]/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between h-10 shrink-0 mb-3">
          {isChatExpanded ? (
            <>
              <div className="h-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs">
                <img src={`${import.meta.env.BASE_URL}sanarip_symbol.png`} alt="Sanarip Med AI" className="w-5 h-5 object-contain shrink-0" />
                <span className="font-extrabold text-sm text-slate-900 tracking-tight whitespace-nowrap">
                  Sanarip Med AI
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  REST API Online
                </span>
              </div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleReset}
                title={t('aiChat.newChatTitle')}
                className="h-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{t('aiChat.newChat')}</span>
              </motion.button>
            </>
          ) : (
            <div className="h-10" />
          )}
        </div>

        {/* Stage Container */}
        <div className="relative flex-1 min-h-0 w-full flex flex-col justify-center items-center overflow-hidden">
          
          {/* Initial Welcome Content */}
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center">
            
            {/* Initial Greeting Text */}
            <motion.div
              initial={false}
              animate={{ 
                opacity: !isChatExpanded ? 1 : 0,
                y: !isChatExpanded ? 0 : -30,
                scale: !isChatExpanded ? 1 : 0.96,
                pointerEvents: !isChatExpanded ? 'auto' : 'none'
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center justify-center text-center mb-6 shrink-0 transform-gpu will-change-transform"
            >
              <div className="flex items-center justify-center mb-4 sm:mb-5">
                <img 
                  src={`${import.meta.env.BASE_URL}sanarip_symbol.png`} 
                  alt="Sanarip Med AI" 
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain pointer-events-none select-none" 
                />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-2 max-w-xl">
                <span className="bg-gradient-to-r from-slate-950 via-[#09638D] to-[#0E82BA] bg-clip-text text-transparent">
                  {currentLang === 'kg' 
                    ? 'Саламатсызбы! Кандай жардам керек?' 
                    : currentLang === 'en' 
                    ? 'Hello, how can I help you today?' 
                    : 'Здравствуйте! Чем я могу помочь?'}
                </span>
              </h2>

              <p className="text-slate-500 text-sm sm:text-base font-normal max-w-md leading-relaxed">
                {currentLang === 'kg'
                  ? 'Симптомдоруңузду жазыңыз, үн билдирүү же сүрөт жөнөтүңүз.'
                  : currentLang === 'en'
                  ? 'Describe symptoms, send a voice recording, or attach a photo for instant triage.'
                  : 'Опишите ваши симптомы, отправьте голосовое или фото для экспресс-триажа.'}
              </p>
            </motion.div>

            {/* Input Bar */}
            <motion.div 
              initial={false}
              animate={{ 
                y: isChatExpanded ? 280 : 0,
              }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-5xl mx-auto z-30 mb-6 shrink-0 transform-gpu will-change-transform"
            >
              {/* Image Preview Banner */}
              {attachedImagePreview && (
                <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-white/95 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
                  <img src={attachedImagePreview} alt="Attached" className="w-8 h-8 rounded-lg object-cover" />
                  <span className="truncate max-w-[200px]">{attachedImage?.name}</span>
                  <button onClick={() => { setAttachedImage(null); setAttachedImagePreview(null); }} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-slate-300/90 focus-within:border-[#09638D] focus-within:ring-4 focus-within:ring-[#09638D]/10 transition-colors shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_45px_rgba(9,99,141,0.1)] p-2 sm:p-2.5 flex items-center gap-2 pl-4 sm:pl-5"
              >
                {/* Hidden File Input for Image */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                  accept="image/*" 
                  className="hidden" 
                />

                {/* Attach Photo Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Прикрепить фото повреждения"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* Voice Record Button */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  title={isRecording ? 'Остановить запись' : 'Голосовой ввод симптомов'}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {isRecording ? (
                  <div className="flex-1 flex items-center gap-2 px-2 text-sm font-bold text-rose-600">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Идет запись голоса... ({recordingDuration}с)</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      currentLang === 'kg' 
                        ? 'Симптомдоруңузду жазыңыз...' 
                        : currentLang === 'en' 
                        ? 'Ask any health question or symptoms...' 
                        : 'Опишите симптомы или задайте вопрос врачу...'
                    }
                    className="flex-1 bg-transparent border-none focus:outline-none text-base font-medium text-slate-900 placeholder-slate-400 py-1"
                  />
                )}

                <button
                  type="submit"
                  disabled={(!inputText.trim() && !attachedImage) || isTyping}
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#09638D] to-[#0E82BA] hover:opacity-95 text-white flex items-center justify-center transition-all shadow-md shadow-[#09638D]/20 disabled:opacity-40 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <motion.div 
                initial={false}
                animate={{ 
                  opacity: isChatExpanded ? 1 : 0,
                  height: isChatExpanded ? 'auto' : 0,
                }}
                transition={{ duration: 0.4, delay: isChatExpanded ? 0.4 : 0 }}
                className="text-center text-xs sm:text-sm text-slate-400 font-medium flex items-center justify-center gap-1.5 overflow-hidden pt-2.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {currentLang === 'kg'
                    ? 'КР Саламаттык сактоо министрлигинин протоколдору'
                    : currentLang === 'en'
                    ? 'Official clinical protocols of the Ministry of Health'
                    : 'Протоколы Минздрава КР'}
                </span>
              </motion.div>
            </motion.div>

            {/* 4 Suggestion Cards */}
            <motion.div
              initial={false}
              animate={{ 
                opacity: !isChatExpanded ? 1 : 0,
                y: !isChatExpanded ? 0 : 40,
                scale: !isChatExpanded ? 1 : 0.96,
                pointerEvents: !isChatExpanded ? 'auto' : 'none'
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left transform-gpu will-change-transform shrink-0"
            >
              {activeSuggestions.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={card.id}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.15 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleSend(card.prompt)}
                    className="group relative p-5 rounded-3xl bg-white/95 hover:bg-white backdrop-blur-xl border border-slate-200/90 hover:border-[#09638D]/40 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(9,99,141,0.08)] hover:-translate-y-0.5 text-left flex flex-col justify-between cursor-pointer active:scale-[0.98] overflow-hidden transform-gpu will-change-transform"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#61DED3]/10 to-[#09638D]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="flex items-center justify-between w-full mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${card.iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
                          {card.badge}
                        </span>
                      </div>

                      <div className="w-7 h-7 rounded-full bg-slate-100/90 group-hover:bg-[#09638D] text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <div className="font-extrabold text-base text-slate-900 group-hover:text-[#09638D] transition-colors leading-snug mb-1">
                        {card.title}
                      </div>

                      <p className="text-sm text-slate-500 font-normal leading-relaxed line-clamp-2">
                        {card.desc}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

          </div>

          {/* Active Conversation Feed */}
          <div 
            data-lenis-prevent
            className={`absolute inset-x-0 top-0 bottom-28 overflow-y-auto pr-2 sm:pr-3 space-y-5 pb-4 overscroll-contain chat-scrollbar [mask-image:linear-gradient(to_bottom,transparent_0%,black_24px,black_100%)] transition-opacity duration-300 transform-gpu z-10 ${
              isChatExpanded && showMessagesFeed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            ref={messagesContainerRef}
          >
            <div className="h-4 shrink-0" />

            {showMessagesFeed && (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} transform-gpu will-change-transform`}
                  >
                    {msg.sender === 'ai' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 20 }}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1 shrink-0 mt-1"
                      >
                        <img src={`${import.meta.env.BASE_URL}sanarip_symbol.png`} alt="Sanarip Med AI" className="w-full h-full object-contain select-none" />
                      </motion.div>
                    )}

                    <div className={`max-w-[90%] sm:max-w-[80%] space-y-3 ${
                      msg.sender === 'user'
                        ? 'bg-[#09638D] text-white rounded-3xl rounded-tr-md p-4 sm:p-5 shadow-sm'
                        : 'bg-white rounded-3xl rounded-tl-md p-5 sm:p-6 border border-slate-200/90 shadow-sm text-slate-800'
                    }`}>
                      {msg.image && (
                        <img src={msg.image} alt="User upload" className="rounded-2xl max-h-48 object-cover mb-2" />
                      )}

                      {renderFormattedMessage(msg.text, msg.sender === 'user')}

                      {/* Suggested Doctors Grid if returned by Server */}
                      {msg.suggestedDoctors && msg.suggestedDoctors.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <div className="text-xs font-extrabold uppercase text-[#09638D] flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Рекомендованные специалисты в Бишкеке:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.suggestedDoctors.map((doc, dIdx) => (
                              <div key={dIdx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-left text-xs space-y-1">
                                <div className="font-bold text-slate-900 text-sm">{doc.name || 'Врач-специалист'}</div>
                                <div className="text-slate-500">{doc.specialty || doc.category}</div>
                                {doc.clinic && <div className="text-slate-600 font-medium">🏥 {doc.clinic}</div>}
                                <button 
                                  onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { tabId: 'doctors' } }))}
                                  className="mt-2 w-full py-1.5 rounded-xl bg-[#09638D] text-white font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#075174]"
                                >
                                  <Calendar className="w-3 h-3" />
                                  <span>Записаться</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Clinics Grid if returned by Server */}
                      {msg.suggestedClinics && msg.suggestedClinics.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <div className="text-xs font-extrabold uppercase text-[#09638D] flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Ближайшие клиники:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.suggestedClinics.map((clinic, cIdx) => (
                              <div key={cIdx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-left text-xs space-y-1">
                                <div className="font-bold text-slate-900 text-sm">{clinic.name}</div>
                                <div className="text-slate-500">📍 {clinic.address || 'Бишкек'}</div>
                                {clinic.phone && <div className="text-slate-600">📞 {clinic.phone}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={`text-sm font-medium mt-2 text-right ${
                        msg.sender === 'user' ? 'text-cyan-100/80' : 'text-slate-400'
                      }`}>
                        {msg.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Thinking Indicator */}
            {showMessagesFeed && isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 transform-gpu will-change-transform"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1 shrink-0">
                  <img src={`${import.meta.env.BASE_URL}sanarip_symbol.png`} alt="Sanarip Med AI" className="w-full h-full object-contain animate-pulse select-none" />
                </div>
                <div className="bg-white rounded-3xl rounded-tl-md p-4 border border-slate-200 shadow-sm flex items-center gap-3">
                  <span className="text-sm font-bold text-[#09638D]">
                    {currentLang === 'kg' ? 'Sanarip Med AI ойлонууда...' : currentLang === 'en' ? 'Sanarip Med AI is thinking...' : 'Sanarip Med AI думает...'}
                  </span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#09638D] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E82BA] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#61DED3] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="h-10 shrink-0 pointer-events-none" />
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroAIChat;
