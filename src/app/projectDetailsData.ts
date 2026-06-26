import projectImg1 from "../imports/image.png";
import projectImg2 from "../imports/image_2026-06-09_10-31-16.png";

export interface ProjectDetailData {
  name: string;
  desc: string;
  client: string;
  year: string;
  service: string;
  challenge: string;
  processImages: string[];
  collageBlocks?: string[][];
  results: string[];
}

export const projectDetailsTranslations: Record<string, Record<string, ProjectDetailData>> = {
  en: {
    sandyq: {
      name: "Sandyq",
      desc: "A full rebrand and architectural concept for a national hospitality brand.",
      client: "Sandyq Group",
      year: "2024",
      service: "Branding, Architecture",
      challenge: "Create an authentic yet modern identity that works equally well in urban spaces and recreational zones.",
      processImages: [
        projectImg1,
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["International market launch", "40% higher audience engagement"]
    },
    "ala-too": {
      name: "Ala-Too",
      desc: "A premium digital ecosystem and brand identity for a logistics and transportation network.",
      client: "Ala-Too Express",
      year: "2025",
      service: "Product Design, UI/UX",
      challenge: "Design a scalable digital platform that handles complex booking and tracking with a clean, high-end feel.",
      processImages: [
        projectImg2,
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Unified 3 platforms into 1 ecosystem", "30% reduction in average booking time"]
    },
    salkyn: {
      name: "Salkyn",
      desc: "Modern cooling appliance and HVAC product design with physical ergonomics.",
      client: "Salkyn Technologies",
      year: "2025",
      service: "Industrial Design",
      challenge: "Reinvent standard home climate appliances with tactile metal textures and sustainable energy components.",
      processImages: [
        "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Red Dot Design Award winner", "100% biodegradable packaging"]
    },
    "one-ordo": {
      name: "One Ordo Resort",
      desc: "Conceptual architecture and master planning for a lakeside luxury resort.",
      client: "Ordo Development",
      year: "2026",
      service: "Architecture, 3D",
      challenge: "Integrate premium modern villas into a highly sensitive natural landscape on the lake shore.",
      processImages: [
        "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Zero-emission green rating", "Full architectural documentation delivered"]
    },
    techstart: {
      name: "TechStart",
      desc: "A complete digital product brand identity and design system for a SaaS workspace.",
      client: "TechStart Inc.",
      year: "2026",
      service: "Branding, Web",
      challenge: "Design a scalable design system and brand identity that communicates efficiency and modern collaboration.",
      processImages: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Design system adopted by 20+ engineering teams", "Conversion rate increased by 25%"]
    },
    "auto-concept-x": {
      name: "Auto Concept X",
      desc: "Futuristic electric vehicle conceptual design and proportional packaging study.",
      client: "X-Motors",
      year: "2025",
      service: "Automotive Design",
      challenge: "Create a visionary hypercar styling concept highlighting aerodynamic efficiency and premium carbon composites.",
      processImages: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Showcased at Geneva Motor Show", "Won Michelin Design Challenge Gold"]
    }
  },
  kg: {
    sandyq: {
      name: "Sandyq",
      desc: "Националдуу конок жай бренди үчүн толук ребрендинг жана архитектуралык концепция.",
      client: "Sandyq Group",
      year: "2024",
      service: "Брендинг, Архитектура",
      challenge: "Шаар мейкиндигинде да, эс алуу зонасында да бирдей жакшы иштеген аутентификациялык, бирок заманбап образ түзүү.",
      processImages: [
        projectImg1,
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Эл аралык базарга чыгуу", "Аудиториянын катышуусу 40% жогорулады"]
    },
    "ala-too": {
      name: "Ala-Too",
      desc: "Логистика жана транспорт тармагы үчүн премиум санариптик экосистема жана бренд иденттүүлүгү.",
      client: "Ala-Too Express",
      year: "2025",
      service: "Продукт дизайны, UI/UX",
      challenge: "Татаал брондоо жана көзөмөлдөөнү таза, жогорку сапаттагы сезим менен башкарган масштабдуу санариптик платформаны долбоорлоо.",
      processImages: [
        projectImg2,
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["3 платформаны 1 экосистемага бириктирдик", "Орточо брондоо убактысы 30% кыскарды"]
    },
    salkyn: {
      name: "Salkyn",
      desc: "Физикалык эргономика менен заманбап муздатуучу шаймандардын жана HVAC продуктуларынын дизайны.",
      client: "Salkyn Technologies",
      year: "2025",
      service: "Өнөр жай дизайны",
      challenge: "Тактилдүү металл текстуралары жана туруктуу энергия компоненттери менен стандарттуу үй климаттык шаймандарын кайра ойлоп табуу.",
      processImages: [
        "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Red Dot Design Award жеңүүчүсү", "100% био-ажыроочу таңгак"]
    },
    "one-ordo": {
      name: "One Ordo Resort",
      desc: "Көлдүн жээгиндеги кымбат баалуу курорт үчүн концептуалдык архитектура жана мастер-пландаштыруу.",
      client: "Ordo Development",
      year: "2026",
      service: "Архитектура, 3D",
      challenge: "Көлдүн жээгиндеги абдан сезгич табигый ландшафтка заманбап виллаларды интеграциялоо.",
      processImages: [
        "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Нөлдүк эмиссия жашыл рейтинги", "Толук архитектуралык документтер жеткирилди"]
    },
    techstart: {
      name: "TechStart",
      desc: "SaaS платформасы үчүн толук фирмалык стиль жана дизайн системасы.",
      client: "TechStart Inc.",
      year: "2026",
      service: "Брендинг, Веб",
      challenge: "Натыйжалуулукту жана заманбап кызматташууну билдирген масштабдуу дизайн тутумун жана бренд иденттүүлүгүн долбоорлоо.",
      processImages: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Дизайн системасы 20+ инженердик топ тарабынан кабыл алынды", "Конверсиялык көрсөткүч 25% жогорулады"]
    },
    "auto-concept-x": {
      name: "Auto Concept X",
      desc: "Футуристтик электромобилдин концептуалдык дизайны жана пропорциялуу долбоорлоо.",
      client: "X-Motors",
      year: "2025",
      service: "Автомобиль дизайны",
      challenge: "Аэродинамикалык эффективдүүлүктү жана премиум көмүртек композиттерин көрсөткөн гиперкардын стилистикалык концепциясын түзүү.",
      processImages: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Женева автосалонунда көрсөтүлгөн", "Michelin Design Challenge Алтын сыйлыгын алды"]
    }
  },
  ru: {
    sandyq: {
      name: "Sandyq",
      desc: "Комплексный ребрендинг и архитектурная концепция для национальной сети.",
      client: "Sandyq Group",
      year: "2024",
      service: "Брендинг, Архитектура",
      challenge: "Создать аутентичный, но современный образ, который будет одинаково хорошо работать как в городских пространствах, так и в рекреационных зонах.",
      processImages: [
        projectImg1,
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Выход на международный рынок", "Увеличение вовлеченности аудитории на 40%"]
    },
    "ala-too": {
      name: "Ala-Too",
      desc: "Премиальная цифровая экосистема и фирменный стиль для логистической и транспортной сети.",
      client: "Ala-Too Express",
      year: "2025",
      service: "Продукт-дизайн, UI/UX",
      challenge: "Спроектировать масштабируемую цифровую платформу для сложного бронирования и отслеживания с чистым, премиальным интерфейсом.",
      processImages: [
        projectImg2,
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Объединение 3 платформ в единую экосистему", "Сокращение времени бронирования на 30%"]
    },
    salkyn: {
      name: "Salkyn",
      desc: "Дизайн климатической техники и приборов HVAC с акцентом на эргономику.",
      client: "Salkyn Technologies",
      year: "2025",
      service: "Индустриальный дизайн",
      challenge: "Переосмыслить привычные кондиционеры и обогреватели с использованием благородных текстур металла и энергоэффективных технологий.",
      processImages: [
        "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Победитель Red Dot Design Award", "100% биоразлагаемая упаковка"]
    },
    "one-ordo": {
      name: "One Ordo Resort",
      desc: "Концептуальная архитектура и генеральный план премиального курорта на побережье озера.",
      client: "Ordo Development",
      year: "2026",
      service: "Архитектура, 3D",
      challenge: "Интегрировать современные виллы премиум-класса в экологически уязвимый природный ландшафт побережья.",
      processImages: [
        "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Зеленый рейтинг с нулевым уровнем выбросов", "Передана полная архитектурная документация"]
    },
    techstart: {
      name: "TechStart",
      desc: "Комплексный фирменный стиль и дизайн-система для SaaS-платформы.",
      client: "TechStart Inc.",
      year: "2026",
      service: "Брендирование, Веб",
      challenge: "Разработать масштабируемую систему дизайна и фирменный стиль, выражающие эффективность и современное сотрудничество.",
      processImages: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Система дизайна внедрена более чем в 20 командах", "Рост конверсии составил 25%"]
    },
    "auto-concept-x": {
      name: "Auto Concept X",
      desc: "Концептуальный дизайн футуристического электромобиля и пропорциональное проектирование.",
      client: "X-Motors",
      year: "2025",
      service: "Automotive Design",
      challenge: "Создать инновационную дизайн-концепцию гиперкара, подчеркивающую аэродинамику и использование премиального углепластика.",
      processImages: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600"
      ],
      results: ["Показан на Женевском автосалоне", "Золотая медаль конкурса Michelin Design Challenge"]
    }
  }
};
