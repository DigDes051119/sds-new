const cyrillicMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'ң': 'n', 'ө': 'o', 'ү': 'u', 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss'
};

export const COVER_MOMS = "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/maminy-retsepty/project-hero-1784560948544.webp";

export function transliterate(text: string): string {
  if (!text) return "";
  try {
    text = decodeURIComponent(text);
  } catch {}
  return text
    .toLowerCase()
    .split('')
    .map(char => cyrillicMap[char] || char)
    .join('');
}

export function cleanSlug(s?: string): string {
  if (!s) return "";
  try {
    s = decodeURIComponent(s);
  } catch {}
  return s.toLowerCase().trim().replace(/[^\p{L}\p{N}]/gu, "");
}

export function cleanTranslitSlug(s?: string): string {
  if (!s) return "";
  return transliterate(s).toLowerCase().trim().replace(/[^\p{L}\p{N}]/gu, "");
}

export const projectAliases: Record<string, string[]> = {
  "maminy-retsepty": [
    "maminy-retsepty", "moms-recipes", "mom-s-recipes", "maminy_retsepty", "mothers-recipes",
    "мамины-рецепты", "мамины рецепты", "мамины_рецепты", "мамино-сердце", "мамино сердце",
    "энемдин-рецепттери", "энемдин рецепттери", "энемдин", "эненин-рецепттери", "эненин рецепттери",
    "апамдын-рецепттери", "апамдын рецепттери", "апамдын", "moms recipes", "mamas rezepte", "mamas-rezepte",
    "妈妈的食谱", "وصفات أمي", "وصفات-أمي"
  ],
  "one-ordo-resort": [
    "one-ordo", "one-ordo-resort", "one-ordo-resort-web", "one-ordo-resort-website", "one ordo", "ван ордо", "ван-ордо"
  ],
  "oneconstruction": [
    "oneconstruction", "one-construction", "one construction", "уан констракшн"
  ],
  "tooko": [
    "tooko", "tooko-brand", "тооко"
  ],
  "sandyq": [
    "sandyq", "sandyk", "сандык", "сандык келин"
  ],
  "ala-too": [
    "ala-too", "alatoo", "ала-тоо", "алатоо", "alatoo-architecture", "ala-too-architecture"
  ],
  "salkyn": [
    "salkyn", "салкынь", "салкын"
  ],
  "techstart": [
    "techstart", "техстарт"
  ],
  "auto-concept-x": [
    "auto-concept-x", "autoconceptx", "auto-concept", "авто концепт x"
  ],
  "bishbench": [
    "bishbench", "бишбенч"
  ],
  "ps5-concept-2018": [
    "ps5-concept-2018", "ps5", "ps5-concept", "ps5 concept 2018"
  ],
  "vencepto-black-concept": [
    "vencepto-black-concept", "vencepto-black", "vencepto", "vencepto black concept"
  ],
  "sony-zeus": [
    "sony-zeus", "sony zeus", "сони зевс"
  ],
  "iphone-iq-concept-2018": [
    "iphone-iq-concept-2018", "iphone-iq", "iphone iq concept 2018"
  ]
};

export function findInObjectCaseInsensitive<T = any>(obj: Record<string, T> | null | undefined, targetId?: string): T | null {
  if (!obj || !targetId) return null;
  if (obj[targetId]) return obj[targetId];

  const keys = Object.keys(obj);
  const matchedKey = matchProjectKey(targetId, keys);
  if (matchedKey && obj[matchedKey]) {
    return obj[matchedKey];
  }

  const targetClean = cleanSlug(targetId);
  const targetTranslit = cleanTranslitSlug(targetId);

  for (const [key, val] of Object.entries(obj)) {
    if (cleanSlug(key) === targetClean || cleanTranslitSlug(key) === targetTranslit) {
      return val;
    }
  }

  return null;
}

export function matchProjectKey(targetId: string, availableKeys: string[]): string | null {
  if (!targetId || !availableKeys || availableKeys.length === 0) return null;
  
  const targetClean = cleanSlug(targetId);
  const targetTranslit = cleanTranslitSlug(targetId);

  // 1. Direct key match
  for (const k of availableKeys) {
    if (k === targetId || cleanSlug(k) === targetClean || cleanTranslitSlug(k) === targetTranslit) {
      return k;
    }
  }

  // 2. Alias match
  for (const [canonical, aliases] of Object.entries(projectAliases)) {
    const allAliases = [canonical, ...aliases];
    const matchesTarget = allAliases.some(a => 
      cleanSlug(a) === targetClean || cleanTranslitSlug(a) === targetTranslit
    );
    if (matchesTarget) {
      const matchedKey = availableKeys.find(k => 
        k === canonical || allAliases.some(a => cleanSlug(k) === cleanSlug(a) || cleanTranslitSlug(k) === cleanTranslitSlug(a))
      );
      if (matchedKey) return matchedKey;
    }
  }

  return null;
}

export const globalProjectCardsDict: Record<string, Record<string, { name: string; desc: string; service: string }>> = {
  "maminy-retsepty": {
    ru: {
      name: "МАМИНЫ РЕЦЕПТЫ",
      desc: "Мы заложили прямую идею в логотип и символ — открытая книга рецептов, которая к тому же напоминает еще и символ сердца (любви). Проработали стиль, упаковки, оформление, подачу и многое другое.",
      service: "БРЕНДИНГ"
    },
    kg: {
      name: "ЭНЕНИН РЕЦЕПТТЕРИ",
      desc: "Биз логотипке жана белгиге түздөн-түз идеяны киргиздик — ачык рецепт китеби, ал дагы жүрөк (сүйүү) символуна окшош. Биз стилди, таңгакты, дизайнды, презентацияны жана башка көптөгөн нерселерди иштеп чыктык.",
      service: "БРЕНДИНГ"
    },
    en: {
      name: "MOM'S RECIPES",
      desc: "We put a direct idea into the logo and symbol — an open recipe book that also resembles a heart symbol (love). We worked out the style, packaging, design, presentation and much more.",
      service: "BRANDING"
    },
    zh: {
      name: "妈妈的食谱",
      desc: "我们在标志和符号中融入了一个直接的想法——一本打开的食谱书，它也让人想起心（爱）的象征。制定了风格、包装、设计、呈现等。",
      service: "品牌设计"
    },
    ar: {
      name: "وصفات أمي",
      desc: "لقد وضعنا فكرة مباشرة في الشعار والرمز — كتاب وصفات مفتوح يشبه أيضًا رمز القلب (الحب). عملنا على الأسلوب والتغليف والتصميم والعرض وغير ذلك الكثير.",
      service: "الهوية التجارية"
    },
    de: {
      name: "MAMAS REZEPTE",
      desc: "Wir haben eine direkte Idee in das Logo und das Symbol gesteckt – ein offenes Rezeptbuch, das auch an ein Herzsymbol (Liebe) erinnert. Wir haben Stil, Verpackung, Design, Präsentation und vieles mehr ausgearbeitet.",
      service: "BRANDING"
    }
  },
  "tooko": {
    ru: {
      name: "Tooko",
      desc: "Создали все самое необходимое и нужное для нового бренда от и до, который собирается зайти на рынок. Цвета и контрасты для сильного старта.",
      service: "Брендинг"
    },
    en: {
      name: "Tooko",
      desc: "We created everything necessary for a new brand, inside and out, which is about to enter the market. Colors and contrasts for a strong start.",
      service: "Branding"
    },
    kg: {
      name: "Tooko",
      desc: "Жаңы бренд үчүн ичинен жана сыртынан баарын түздүк, ал жакында рынокко кирет. Күчтүү башталыш үчүн түстөр жана контрасттар.",
      service: "Брендинг"
    },
    zh: {
      name: "Tooko",
      desc: "我们由内而外为即将进入市场的全新品牌打造了一切核心要素。鲜明的色彩与对比赋予强力起步。",
      service: "品牌设计"
    },
    ar: {
      name: "Tooko",
      desc: "لقد أنشأنا كل ما هو ضروري لعلامة تجارية جديدة، من الداخل والخارج، والتي على وشك دخول السوق. ألوان وتباينات لبداية قوية.",
      service: "الهوية التجارية"
    },
    de: {
      name: "Tooko",
      desc: "Wir haben alles Notwendige für eine neue Marke von innen und außen geschaffen, die kurz vor dem Markteintritt steht. Farben und Kontraste für einen starken Start.",
      service: "Branding"
    }
  },
  "one-ordo-resort": {
    ru: {
      name: "One Ordo Resort",
      desc: "Брендинг в котором наша студия создала Наминг, и все важные детали брендинга для презентации курорта. Идеология номера 1 пронесена сквозь волны и атмосферу отдыха.",
      service: "Брендинг"
    },
    en: {
      name: "One Ordo Resort",
      desc: "Branding in which our studio created Naming, and all the important branding details for presenting the resort. The ideology of number 1 carried through the waves and resort atmosphere.",
      service: "Branding"
    },
    kg: {
      name: "One Ordo Resort",
      desc: "Курортту презентациялоо үчүн биздин студия Нейминг жана брендингдин бардык маанилүү деталдарын түзгөн брендинг. Толкундар аркылуу №1 идеологиясы.",
      service: "Брендинг"
    },
    zh: {
      name: "One Ordo 度假村",
      desc: "我们工作室为度假村呈现打造了命名及所有重要品牌细节的品牌设计。1号理念穿梭于浪花与休闲氛围之间。",
      service: "品牌设计"
    },
    ar: {
      name: "One Ordo Resort",
      desc: "العلامة التجارية التي أنشأ فيها استوديونا التسمية وجميع تفاصيل العلامة التجارية الهامة لتقديم المنتجع. أيديولوجية الرقم 1 عبر الأمواج وأجواء الاسترخاء.",
      service: "الهوية التجارية"
    },
    de: {
      name: "One Ordo Resort",
      desc: "Branding, bei dem unser Studio das Naming und alle wichtigen Branding-Details zur Präsentation des Resorts erstellt hat. Die Ideologie der Nummer 1 getragen durch Wellen und Urlaubsatmosphäre.",
      service: "Branding"
    }
  },
  "one-ordo": {
    ru: {
      name: "One Ordo Resort",
      desc: "Брендинг в котором наша студия создала Наминг, и все важные детали брендинга для презентации курорта. Идеология номера 1 пронесена сквозь волны и атмосферу отдыха.",
      service: "Брендинг"
    },
    en: {
      name: "One Ordo Resort",
      desc: "Branding in which our studio created Naming, and all the important branding details for presenting the resort. The ideology of number 1 carried through the waves and resort atmosphere.",
      service: "Branding"
    },
    kg: {
      name: "One Ordo Resort",
      desc: "Курортту презентациялоо үчүн биздин студия Нейминг жана брендингдин бардык маанилүү деталдарын түзгөн брендинг. Толкундар аркылуу №1 идеологиясы.",
      service: "Брендинг"
    },
    zh: {
      name: "One Ordo 度假村",
      desc: "我们工作室为度假村呈现打造了命名及所有重要品牌细节的品牌设计。1号理念穿梭于浪花与休闲氛围之间。",
      service: "品牌设计"
    },
    ar: {
      name: "One Ordo Resort",
      desc: "العلامة التجارية التي أنشأ فيها استوديونا التسمية وجميع تفاصيل العلامة التجارية الهامة لتقديم المنتجع. أيديولوجية الرقم 1 عبر الأمواج وأجواء الاسترخاء.",
      service: "الهوية التجارية"
    },
    de: {
      name: "One Ordo Resort",
      desc: "Branding, bei dem unser Studio das Naming und alle wichtigen Branding-Details zur Präsentation des Resorts erstellt hat. Die Ideologie der Nummer 1 getragen durch Wellen und Urlaubsatmosphäre.",
      service: "Branding"
    }
  },
  "sandyq": {
    ru: {
      name: "Sandyq",
      desc: "Синтез традиционных мотивов и современной эстетики. Комплексный брендинг и визуальная идентификация культурного наследия.",
      service: "Брендинг & Архитектура"
    },
    en: {
      name: "Sandyq",
      desc: "Synthesis of traditional motifs and modern aesthetics. Comprehensive branding and visual identity for cultural heritage.",
      service: "Branding & Architecture"
    },
    kg: {
      name: "Sandyq",
      desc: "Салттуу мотивдер менен заманбап эстетиканын синтези. Маданий мурасты комплекстүү брендинг жана визуалдык идентификациялоо.",
      service: "Брендинг & Архитектура"
    },
    zh: {
      name: "Sandyq",
      desc: "传统图案与现代美学的融合。文化遗产的全面品牌塑造与视觉识别系统打造。",
      service: "品牌与建筑设计"
    },
    ar: {
      name: "Sandyq",
      desc: "مزيج من الزخارف التقليدية والجماليات الحديثة. هوية بصرية شاملة وعلامة تجارية للتراث الثقافي.",
      service: "الهوية التجارية والعمارة"
    },
    de: {
      name: "Sandyq",
      desc: "Synthese traditioneller Motive und moderner Ästhetik. Umfassendes Branding und visuelle Identität für das kulturelle Erbe.",
      service: "Branding & Architektur"
    }
  },
  "ala-too": {
    ru: {
      name: "Ala-Too",
      desc: "Архитектурная концепция и продуктовый дизайн, вдохновленный величием горных хребтов и природной чистотой Тянь-Шаня.",
      service: "Продукт Дизайн"
    },
    en: {
      name: "Ala-Too",
      desc: "Architectural concept and product design inspired by the majesty of mountain ranges and the natural purity of Tien Shan.",
      service: "Product Design"
    },
    kg: {
      name: "Ala-Too",
      desc: "Тоо кыркаларынын улуулугунан жана Тянь-Шандын табигый тазалыгынан шыктанган архитектуралык концепция жана продукт дизайны.",
      service: "Продукт дизайны"
    },
    zh: {
      name: "Ala-Too",
      desc: "受雄伟山脉与天山纯净自然启发的建筑概念与产品设计。",
      service: "产品设计"
    },
    ar: {
      name: "Ala-Too",
      desc: "مفهوم معماري وتصميم منتج مستوحى من عظمة سلاسل الجبال والنقاء الطبيعي لسلسلة تيان شان.",
      service: "تصميم المنتجات"
    },
    de: {
      name: "Ala-Too",
      desc: "Architekturkonzept und Produktdesign, inspiriert von der Majestät der Gebirgszüge und der natürlichen Reinheit des Tian Shan.",
      service: "Produktdesign"
    }
  },
  "salkyn": {
    ru: {
      name: "Salkyn",
      desc: "Индустриальный дизайн премиальных климатических систем с акцентом на эргономику, минимализм и бесшумную аэродинамику.",
      service: "Индустриальный Дизайн"
    },
    en: {
      name: "Salkyn",
      desc: "Industrial design of premium climate systems focusing on ergonomics, minimalism, and silent aerodynamics.",
      service: "Industrial Design"
    },
    kg: {
      name: "Salkyn",
      desc: "Эргономикага, минимализмге жана үнсүз аэродинамикага басым жасалган премиум климаттык системалардын өнөр жай дизайны.",
      service: "Өнөр жай дизайны"
    },
    zh: {
      name: "Salkyn",
      desc: "专注于人体工程学、极简主义和静音空气动力学的高端气候系统工业设计。",
      service: "工业设计"
    },
    ar: {
      name: "Salkyn",
      desc: "تصميم صناعي لأنظمة مناخية متميزة مع التركيز على بيئة العمل والبساطة والديناميكا الهوائية الصامتة.",
      service: "التصميم الصناعي"
    },
    de: {
      name: "Salkyn",
      desc: "Industriedesign von Premium-Klimasystemen mit Fokus auf Ergonomie, Minimalismus und leise Aerodynamik.",
      service: "Industriedesign"
    }
  },
  "techstart": {
    ru: {
      name: "TechStart",
      desc: "Цифровой брендинг и масштабируемый веб-интерфейс для венчурной технологической платформы нового поколения.",
      service: "Брендирование"
    },
    en: {
      name: "TechStart",
      desc: "Digital branding and scalable web interface for next-generation venture technology ecosystem.",
      service: "Branding"
    },
    kg: {
      name: "TechStart",
      desc: "Жаңы муундагы венчурдук технологиялык платформа үчүн санариптик брендинг жана масштабдалуучу веб-интерфейс.",
      service: "Брендинг"
    },
    zh: {
      name: "TechStart",
      desc: "为下一代风投科技平台量身打造的数字化品牌形象与高扩展性网络界面。",
      service: "品牌设计"
    },
    ar: {
      name: "TechStart",
      desc: "هوية بصرية رقمية وواجهة ويب قابلة للتطوير لمنصة التكنولوجيا الاستثمارية من الجيل التالي.",
      service: "الهوية التجارية"
    },
    de: {
      name: "TechStart",
      desc: "Digitales Branding und skalierbare Weboberfläche für eine Technologie-Venture-Plattform der nächsten Generation.",
      service: "Branding"
    }
  },
  "auto-concept-x": {
    ru: {
      name: "Auto Concept X",
      desc: "Футуристический автомобильный дизайн суперкара будущего с инновационной аэродинамикой и электрической силовой платформой.",
      service: "Automotive Design"
    },
    en: {
      name: "Auto Concept X",
      desc: "Futuristic automotive supercar concept with cutting-edge aerodynamic surfaces and electric powertrain architecture.",
      service: "Automotive Design"
    },
    kg: {
      name: "Auto Concept X",
      desc: "Инновациялык аэродинамика жана электр кыймылдаткыч платформасы бар келечектин футуристтик суперкарынын авто дизайны.",
      service: "Автомобиль дизайны"
    },
    zh: {
      name: "Auto Concept X",
      desc: "融合前沿空气动力学曲面与纯电动力架构的未来主义超级跑车概念设计。",
      service: "汽车设计"
    },
    ar: {
      name: "Auto Concept X",
      desc: "تصميم سيارة خارقة مستقبلية مع أسطح ديناميكية هوائية متطورة وهندسة دفع كهربائية بالكامل.",
      service: "تصميم السيارات"
    },
    de: {
      name: "Auto Concept X",
      desc: "Futuristisches Supersportwagen-Konzept mit innovativer Aerodynamik und vollelektrischer Antriebsplattform.",
      service: "Automobildesign"
    }
  },
  "bishbench": {
    ru: {
      name: "BishBench",
      desc: "Городской дизайн модульной уличной мебели, созданной из переработанных экологичных полимеров и архитектурного бетона.",
      service: "Городской Дизайн"
    },
    en: {
      name: "BishBench",
      desc: "Urban modular street furniture design crafted from recycled eco-polymers and architectural concrete.",
      service: "Urban Design"
    },
    kg: {
      name: "BishBench",
      desc: "Кайра иштетилген эко-полимерлерден жана архитектуралык бетондон жасалган модулдук көчө эмеректеринин шаардык дизайны.",
      service: "Шаардык дизайн"
    },
    zh: {
      name: "BishBench",
      desc: "采用可回收环保聚合物和建筑混凝土精心打造的城市模块化街头公共家具设计。",
      service: "城市公共设计"
    },
    ar: {
      name: "BishBench",
      desc: "تصميم أثاث شوارع معياري حضري مصنوع من البوليمرات البيئية المعاد تدويرها والخرسانة المعمارية.",
      service: "التصميم الحضري"
    },
    de: {
      name: "BishBench",
      desc: "Städtisches Design modularer Straßenmöbel aus recycelten Öko-Polymeren und Architekturbeton.",
      service: "Stadtdesign"
    }
  }
};

export function getProjectCardInfo(
  id: string,
  locale: string,
  item: any,
  projectDetails: any,
  projectDetailsTranslations: any
) {
  const localCms = findInObjectCaseInsensitive(projectDetails?.[locale], id);
  const localFallback = findInObjectCaseInsensitive(projectDetailsTranslations?.[locale], id);
  const enCms = findInObjectCaseInsensitive(projectDetails?.en, id);
  const ruCms = findInObjectCaseInsensitive(projectDetails?.ru, id);
  const enFallback = findInObjectCaseInsensitive(projectDetailsTranslations?.en, id);
  const ruFallback = findInObjectCaseInsensitive(projectDetailsTranslations?.ru, id);

  // Check global dictionary first for instant, guaranteed multilingual rendering
  const dictKey = Object.keys(globalProjectCardsDict).find(k => 
    cleanSlug(k) === cleanSlug(id) || cleanTranslitSlug(k) === cleanTranslitSlug(id)
  );

  const dictItem = dictKey ? globalProjectCardsDict[dictKey] : null;
  const locDict = dictItem ? (dictItem[locale] || dictItem.en || dictItem.ru) : null;

  const rawTitle = (localCms?.name && localCms.name.trim())
    || (localFallback?.name && localFallback.name.trim())
    || (item?.name && item.name.trim())
    || (item?.title && item.title.trim())
    || locDict?.name
    || ruCms?.name || enCms?.name || "";

  const rawDesc = (localCms?.desc && localCms.desc.trim())
    || (localFallback?.desc && localFallback.desc.trim())
    || (item?.desc && item.desc.trim())
    || locDict?.desc
    || (localCms?.challenge && localCms.challenge.trim())
    || (localFallback?.challenge && localFallback.challenge.trim())
    || (ruCms?.desc && ruCms.desc.trim())
    || (enCms?.desc && enCms.desc.trim())
    || "";

  const rawService = localCms?.service || localFallback?.service || locDict?.service || item?.category || ruCms?.service || "Design";
  const year = localCms?.year || localFallback?.year || item?.year || ruCms?.year || "2026";

  return {
    title: rawTitle,
    desc: rawDesc,
    service: rawService,
    year
  };
}


