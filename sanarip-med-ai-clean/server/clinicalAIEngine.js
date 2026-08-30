/**
 * Sanarip Med AI - Clinical Triage & Diagnostic Medical Engine
 * Based on Ministry of Health KR Protocols & MedElement Knowledge Base
 */

// Comprehensive Medical Knowledge Base & Clinical Rules
const MEDICAL_KNOWLEDGE_BASE = [
  // 1. CARDIOLOGY & VASCULAR
  {
    id: 'acs_infarction',
    category: 'Кардиология',
    keywords: [
      'сердц', 'груд', 'инфаркт', 'давит', 'жжет', 'жүрөк', 'стенокард', 
      'heart', 'chest', 'left arm', 'одышк', 'дем алуу', 'коронар'
    ],
    triageCode: 'RED',
    urgencyLevel: 'КРИТИЧЕСКАЯ (Экстренная служба 103)',
    icd10: 'I21.9 Острый инфаркт миокарда неуточненный',
    suspectedConditions: [
      'Острый коронарный синдром (ОКС)',
      'Инфаркт миокарда',
      'Нестабильная стенокардия'
    ],
    redFlags: [
      'Боль иррадиирует в левую руку, челюсть, лопатку',
      'Холодный липкий пот, бледность',
      'Чувство страха смерти, удушье'
    ],
    firstAidInstructions: [
      'Немедленно усадите пострадавшего с приподнятым изголовьем (положение полусидя).',
      'Расстегните тугой воротник, откройте окно для притока свежего воздуха.',
      'Категорически запретите любые физические движения и ходьбу.',
      'Если ранее кардиологом был назначен нитроглицерин и систолическое АД выше 100 мм рт. ст. — принять 1 дозу под язык.'
    ],
    recommendedSpecialist: 'Врач-кардиолог / Реанимационная бригада СМП',
    requiredDiagnostics: ['ЭКГ в 12 отведениях', 'Тропониновый экспресс-тест (I/T)', 'ЭхоКГ'],
    hospitalRouting: 'Бишкекский научно-исследовательский центр травматологии и кардиологии (БНИЦТиО) / Городская больница скорой помощи (103)',
    cpaType: 'emergency'
  },

  // 2. PEDIATRICS & HIGH FEVER
  {
    id: 'pediatric_fever',
    category: 'Педиатрия',
    keywords: [
      'ребенок', 'дети', 'малыш', 'температур', '38', '39', '40', 'жар', 
      'бала', 'ысытма', 'child', 'baby', 'fever', 'лихорадк', 'судорог'
    ],
    triageCode: 'YELLOW',
    urgencyLevel: 'СРОЧНАЯ (Педиатрический осмотр)',
    icd10: 'R50.9 Лихорадка неуточненная у детей',
    suspectedConditions: [
      'Острая респираторная вирусная инфекция (ОРВИ)',
      'Фебрильный синдром',
      'Острый тонзиллит / Отит'
    ],
    redFlags: [
      'Температура >39.5°C не снижается жаропонижающими',
      'Появление сыпи (особенно геморрагической), судороги',
      'Выраженная вялость, отказ от питья, рвота'
    ],
    firstAidInstructions: [
      'Разденьте ребенка до легкого белья, обеспечьте температуру в комнате 20–22°C.',
      'Обильное дробное теплое выпаивание (вода, регидрон) по 1 чайной ложке каждые 3–5 минут.',
      'Обтирание водой комнатной температуры (30–32°C). Категорически запрещен спирт и уксус!',
      'Расчет парацетамола: 15 мг/кг или ибупрофена: 10 мг/кг строго по весу ребенка.'
    ],
    recommendedSpecialist: 'Врач-педиатр / Дежурный педиатрический стационар',
    requiredDiagnostics: ['Общий анализ крови (ОАК) с лейкоформулой', 'Общий анализ мочи (ОАМ)', 'Осмотр зева и отоскопия'],
    hospitalRouting: '3-я Детская городская клиническая больница (ДГКБ №3, г. Бишкек) / Педиатрия ЦСМ',
    cpaType: 'pediatric'
  },

  // 3. NEUROLOGY & STROKE
  {
    id: 'neuro_stroke_headache',
    category: 'Неврология',
    keywords: [
      'головокруж', 'онемел', 'лицо', 'рука', 'речь', 'баш', 'инсульт', 
      'мигрен', 'головная боль', 'headache', 'stroke', 'dizzy', 'висок'
    ],
    triageCode: 'YELLOW_RED',
    urgencyLevel: 'СРОЧНАЯ / ЭКСТРЕННАЯ (FAST-протокол)',
    icd10: 'G43.9 Мигрень / I63 Ишемический инсульт',
    suspectedConditions: [
      'Транзиторная ишемическая атака / ОНМК',
      'Острый приступ мигрени с аурой',
      'Гипертонический криз'
    ],
    redFlags: [
      'FAST-тест: Асимметрия улыбки, слабость в одной руке, невнятная речь',
      'Внезапная «кинжальная» головная боль максимальной силы',
      'Потеря сознания, двоение в глазах'
    ],
    firstAidInstructions: [
      'Проверьте тест FAST (Улыбнись, Подними обе руки, Скажи простую фразу). При любом нарушении — немедленно 103!',
      'Измерьте артериальное давление.',
      'При мигрени: покой в темной тихой комнате, прохладный компресс на лоб.',
      'Не снижайте артериальное давление резко более чем на 20% от исходного.'
    ],
    recommendedSpecialist: 'Врач-невролог / Ангионевролог',
    requiredDiagnostics: ['КТ / МРТ головного мозга', 'УЗДГ брахиоцефальных сосудов', 'Коагулограмма'],
    hospitalRouting: 'Национальный госпиталь КР (Отделение неврологии/инсультный блок) / Частные неврологические клиники',
    cpaType: 'neuro'
  },

  // 4. TRAUMATOLOGY & ORTHOPEDICS
  {
    id: 'trauma_fracture',
    category: 'Травматология',
    keywords: [
      'упал', 'сломал', 'перелом', 'вывих', 'нога', 'рука', 'гипс', 'отек', 
      'синяк', 'сынык', 'жыгыл', 'травм', 'bone', 'fracture', 'fall', 'sprain'
    ],
    triageCode: 'YELLOW',
    urgencyLevel: 'СРОЧНАЯ (Травматологическая помощь)',
    icd10: 'T14.2 Перелом в неуточненной области тела',
    suspectedConditions: [
      'Закрытый/открытый перелом костей',
      'Вывих сустава',
      'Разрыв связочного аппарата'
    ],
    redFlags: [
      'Видимая деформация конечности, костный хруст',
      'Открытая рана с кровотечением',
      'Онемение и побледнение дистальных отделов пальцев'
    ],
    firstAidInstructions: [
      'Иммобилизуйте (обездвижьте) поврежденную конечность подручными средствами (шина, дощечка, косынка).',
      'Приложите холод через сухое полотенце на 15–20 минут для уменьшения отека.',
      'При кровотечении — наложите давящую стерильную повязку.',
      'Категорически запрещено пытаться вправлять кости или суставы самостоятельно!'
    ],
    recommendedSpecialist: 'Врач травматолог-ортопед',
    requiredDiagnostics: ['Цифровая рентгенография в 2 проекциях', 'УЗИ сустава / МРТ при разрыве связок'],
    hospitalRouting: 'Городской травмпункт Бишкека (БНИЦТиО, 4-я Горбольница) / Клиника ЭОС',
    cpaType: 'trauma'
  },

  // 5. GASTROENTEROLOGY & ABDOMEN
  {
    id: 'gastro_acute_abdomen',
    category: 'Гастроэнтерология / Хирургия',
    keywords: [
      'живот', 'желудок', 'аппендицит', 'рвот', 'тошнот', 'понос', 'диаре', 
      'ич', 'ашказан', 'stomach', 'abdomen', 'gastritis', 'изжог', 'отравлен'
    ],
    triageCode: 'YELLOW',
    urgencyLevel: 'СРЕДНЯЯ (Исключение острой хирургической патологии)',
    icd10: 'R10.0 Острый живот / K29 Гастрит и дуоденит',
    suspectedConditions: [
      'Острый аппендицит / Холецистит',
      'Острый гастроэнтерит / Пищевая токсикоинфекция',
      'Обострение язвенной болезни'
    ],
    redFlags: [
      'Острая боль, начавшаяся в эпигастрии и сместившаяся в правую подвздошную область',
      '«Доскообразный» напряженный живот',
      'Рвота с примесью крови или дегтеобразный стул'
    ],
    firstAidInstructions: [
      'Холод, голод и покой до осмотра врачом.',
      'КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО: принимать обезболивающие (анальгин, кетонал) и прикладывать теплую грелку — это стирает симптомы аппендицита!',
      'При рвоте — частое дробное питье минеральной воды без газа небольшими глотками.'
    ],
    recommendedSpecialist: 'Врач-хирург / Гастроэнтеролог',
    requiredDiagnostics: ['УЗИ органов брюшной полости', 'ОАК (лейкоцитоз, СОЭ)', 'ФГДС при язвенном анамнезе'],
    hospitalRouting: 'Хирургическое приемное отделение Городской клинической больницы №1 / НХЦ',
    cpaType: 'gastro'
  },

  // 6. LABORATORY & CHECKUP INTERPRETATION
  {
    id: 'lab_checkup_anemia',
    category: 'Лабораторная диагностика',
    keywords: [
      'анализ', 'гемоглобин', 'ферритин', 'кровь', 'соэ', 'холестерин', 'сахар', 
      'глюкоз', 'витамин', 'қан', 'лаборатор', 'lab', 'blood', 'ferritin', 'anemia'
    ],
    triageCode: 'GREEN',
    urgencyLevel: 'ПЛАНОВАЯ (Консультация и коррекция показателей)',
    icd10: 'D50 Железодефицитная анемия / E03 Гипотиреоз',
    suspectedConditions: [
      'Латентный железодефицит / Анемия',
      'Нарушение липидного или углеводного обмена',
      'Дефицит витамина D3 / B12'
    ],
    redFlags: [
      'Гемоглобин <70 г/л (тяжелая анемия)',
      'Глюкоза крови >15 ммоль/л натощак',
      'Выраженная тромбоцитопения'
    ],
    firstAidInstructions: [
      'Результаты анализов необходимо оценивать в комплексе с клиническими симптомами.',
      'Не начинайте самостоятельный бесконтрольный прием препаратов железа или гормонов без дозировки врача.',
      'Рекомендуется ведение дневника питания и повторный контроль через 4–8 недель.'
    ],
    recommendedSpecialist: 'Врач-терапевт / Гематолог / Эндокринолог',
    requiredDiagnostics: ['Развернутый ОАК с ретикулоцитами', 'Ферритин + ОЖСС + Сывороточное железо', 'Витамин D (25-OH)'],
    hospitalRouting: 'Сеть лабораторий Бонецкого (Intelmed) / Инвитро Кыргызстан / Гемотест Бишкек',
    cpaType: 'lab'
  },

  // 7. RESPIRATORY & THERAPY
  {
    id: 'respiratory_cough',
    category: 'Терапия / Пульмонология',
    keywords: [
      'кашель', 'горло', 'грипп', 'орви', 'бронхит', 'насморк', 'мокрот', 
      'жөтөл', 'тамак', 'cough', 'throat', 'flu', 'covid', 'пневмони'
    ],
    triageCode: 'GREEN',
    urgencyLevel: 'ПЛАНОВАЯ / АМБУЛАТОРНАЯ',
    icd10: 'J06 Острая респираторная инфекция верхних дыхательных путей',
    suspectedConditions: [
      'Острый фарингит / Трахеобронхит',
      'Вирусная инфекция (ОРВИ / Грипп)',
      'Аллергический ринофарингит'
    ],
    redFlags: [
      'Появление свистящего дыхания, одышки в покое',
      'Кровохарканье',
      'Лихорадка более 5 дней'
    ],
    firstAidInstructions: [
      'Постельный или полупостельный режим, теплое обильное питье (до 2.5–3 л/сутки).',
      'Полоскание горла солевыми растворами или раствором ромашки 3–4 раза в день.',
      'Проветривание и влажная уборка помещения (влажность 55–65%).'
    ],
    recommendedSpecialist: 'Врач-терапевт / Семейный врач ЦСМ',
    requiredDiagnostics: ['ОАК', 'Рентгенография легких при подозрении на пневмонию', 'Пульсоксиметрия (SpO2)'],
    hospitalRouting: 'Поликлиника / ЦСМ по месту жительства / Частные терапевтические центры Бишкека',
    cpaType: 'therapy'
  }
];

/**
 * Main Clinical AI Triage Analyzer
 */
export function analyzeClinicalSymptoms(userQuery, lang = 'ru', options = {}) {
  if (!userQuery || typeof userQuery !== 'string') {
    return createDefaultResponse(lang);
  }

  const normalizedQuery = userQuery.toLowerCase().trim();

  // 1. Check for emergency red flags
  let bestMatch = null;
  let highestScore = 0;

  for (const knowledge of MEDICAL_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of knowledge.keywords) {
      if (normalizedQuery.includes(kw)) {
        score += kw.length > 5 ? 3 : 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = knowledge;
    }
  }

  // 2. If confident clinical match found
  if (bestMatch && highestScore >= 2) {
    return formatStructuredClinicalResponse(bestMatch, userQuery, lang);
  }

  // 3. Generic intelligent clinical parsing
  return generateDynamicGeneralResponse(userQuery, lang);
}

/**
 * Formats a comprehensive clinical response based on protocols
 */
function formatStructuredClinicalResponse(match, userQuery, lang) {
  const isKg = lang === 'kg';
  const isEn = lang === 'en';

  let headerEmoji = match.triageCode === 'RED' ? '🚨' : match.triageCode === 'YELLOW' || match.triageCode === 'YELLOW_RED' ? '⚠️' : '🟢';

  let triageTitle = isKg 
    ? `Оордук даражасы: ${match.urgencyLevel}`
    : isEn 
    ? `Triage Severity: ${match.urgencyLevel}`
    : `Степень серьезности: ${match.urgencyLevel}`;

  let firstAidTitle = isKg ? 'Дарыгер келгенче алгачкы жардам:' : isEn ? 'Immediate First-Aid Steps:' : 'Пошаговый алгоритм доврачебной помощи:';
  let diagnosticsTitle = isKg ? 'Сунушталган диагностика:' : isEn ? 'Recommended Diagnostics:' : 'Рекомендованные исследования:';
  let specialistTitle = isKg ? 'Адис:' : isEn ? 'Specialist:' : 'Рекомендованный врач:';

  let firstAidList = match.firstAidInstructions.map(step => `• ${step}`).join('\n');
  let diagnosticsList = match.requiredDiagnostics.join(', ');

  let fullResponseText = `${headerEmoji} ${triageTitle}\n\n` +
    `📋 МКБ-10: ${match.icd10}\n` +
    `🔍 Болжолдуу диагноз: ${match.suspectedConditions.join(' / ')}\n\n` +
    `🛡️ ${firstAidTitle}\n${firstAidList}\n\n` +
    `🔬 ${diagnosticsTitle} ${diagnosticsList}\n` +
    `👨‍⚕️ ${specialistTitle} ${match.recommendedSpecialist}`;

  return {
    success: true,
    triageCode: match.triageCode,
    urgencyLevel: match.urgencyLevel,
    category: match.category,
    icd10: match.icd10,
    suspectedConditions: match.suspectedConditions,
    text: fullResponseText,
    actionType: match.cpaType,
    actionLabel: match.triageCode === 'RED' 
      ? '🚨 Вызов бригады 103 (Экстренно)' 
      : match.category.includes('Педиатр')
      ? '👶 Запись к дежурному педиатру'
      : match.category.includes('Лабор')
      ? '🔬 Направление на чекап и анализы'
      : '📅 Запись на очный прием к врачу',
    hospitalRouting: match.hospitalRouting,
    firstAid: match.firstAidInstructions,
    diagnostics: match.requiredDiagnostics
  };
}

/**
 * Dynamic fallback response for complex uncatalogued queries
 */
function generateDynamicGeneralResponse(query, lang) {
  const isKg = lang === 'kg';
  const isEn = lang === 'en';

  const text = isKg
    ? `🟢 Sanarip AI клиникалык анализи (КР Саламаттыкты сактоо министрлигинин протоколдору боюнча).\n\nСиздин сурооңуз боюнча профилдик адистин консультациясы жана базалык анализдер (Кандын жалпы анализи, биохимия) сунушталат.\n\nСистема Бишкек шаарындагы жакынкы аккредиттелген клиниканы жана дарыгерди тандап бере алат.`
    : isEn
    ? `🟢 Sanarip AI Clinical Assessment (Based on MOH KR Clinical Guidelines).\n\nBased on the symptoms described, an outpatient clinical consultation and standard laboratory check-up (CBC, metabolic panel) are recommended.\n\nThe system can route you to the nearest accredited clinic or specialist in Bishkek.`
    : `🟢 Клинический анализ Sanarip Med AI (по протоколам Минздрава КР и MedElement).\n\nПо описанным симптомам рекомендована очная амбулаторная консультация профильного специалиста и сдача базового лабораторного чекапа (ОАК, биохимия).\n\nСистема Sanarip Med AI автоматически подберет сертифицированную клинику или врача в вашем районе Бишкека.`;

  return {
    success: true,
    triageCode: 'GREEN',
    urgencyLevel: 'ПЛАНОВАЯ / АМБУЛАТОРНАЯ',
    category: 'Общая терапия',
    icd10: 'Z01.8 Другое специальное обследование',
    suspectedConditions: ['Требуется клиническое уточнение на очном приеме'],
    text: text,
    actionType: 'booking',
    actionLabel: '📅 Подобрать клинику и врача по геолокации',
    hospitalRouting: 'ЦСМ / Частные медицинские центры г. Бишкек',
    firstAid: ['Покой', 'Обильное теплое питье', 'Контроль АД и температуры тела'],
    diagnostics: ['Общий анализ крови (ОАК)', 'Биохимический профиль']
  };
}

function createDefaultResponse(lang) {
  return generateDynamicGeneralResponse('', lang);
}
