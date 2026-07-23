export interface ArchiveItem {
  id: string;
  year: string;
  title: string;
  category: string;
  client: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  quote?: string;
}

export const archiveItems: Record<"ru" | "en" | "kg", ArchiveItem[]> = {
  ru: [
    {
      id: "iphone-concept-2014",
      year: "2014",
      title: "iPhone 8 Viral Concept",
      category: "Concept Design / R&D",
      client: "Global Viral Publication",
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 14200,
      commentsCount: 890,
      shortDesc: "Самый известный концепт смартфона в мире по версии Forbes, Business Insider и CNET.",
      fullDesc: "Проект, взорвавший мировой интернет в 2014 году. Футуристичный алюминиевый и стеклянный корпус, изогнутый дисплей и бесшовный дизайн. Концепт собрал десятки миллионов просмотров, обсуждался в Forbes, Business Insider, CNET, TJournal и iPhones.ru, а видео на YouTube набрали сотни тысяч просмотров.",
      highlights: [
        "Топ-1 в мировой прессе по охватам концептов (Forbes, CNET)",
        "Миллионы органических просмотров по всему миру",
        "Публикации на Yanko Design, TrendHunter, Delood"
      ]
    },
    {
      id: "manas-airport-mag-2011",
      year: "2011",
      title: "Журнал и Брендинг Аэропорта Манас",
      category: "Editorial & Brand Identity",
      client: "Международный Аэропорт Манас",
      images: [
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1569154941061-e231b4732ef1?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 3850,
      commentsCount: 142,
      shortDesc: "Победитель Red Jolbor Fest 2011 (1 статуэтка из 6).",
      fullDesc: "Арт-дирекшн и полный дизайн собственного премиум-издания аэропорта Манас. Проект выиграл статуэтку на самом первом фестивале рекламы Red Jolbor Fest в 2011 году и стал визитной карточкой независимого дизайна в регионе.",
      highlights: [
        "Награда Red Jolbor Fest 2011",
        "Полный арт-дирекшн печатного издания",
        "Создание единого стандарта бортовой полиграфии"
      ]
    },
    {
      id: "supercar-concept-2015",
      year: "2015",
      title: "Futuristic Supercar Aerodynamics",
      category: "Automotive Design",
      client: "Steel Drake R&D Concept",
      images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 9400,
      commentsCount: 512,
      shortDesc: "Футуристический суперкар с активной аэродинамикой.",
      fullDesc: "Исследовательский концепт гиперкара с агрессивными хищными линиями и скрытыми аэродинамическими плоскостями. Публиковался в Motoring Exposure, Yanko Design и международном авто-глянце.",
      highlights: [
        "Публикации в международных автомобильных журналах",
        "Инновационная форма кузова и оптики",
        "Высокополигональное 3D-моделирование и визуализация"
      ]
    },
    {
      id: "chronograph-watch-2012",
      year: "2012",
      title: "Monolith Chronograph Watch",
      category: "Industrial Design",
      client: "Steel Drake Heritage",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 5210,
      commentsCount: 230,
      shortDesc: "Минималистичные наручные часы из титана и матовой керамики.",
      fullDesc: "Тактильный хронограф без лишних деталей — монолитный титановый корпус, сапфировое стекло и скрытые застежки. Проект заложил фирменный метод студии: убирать все лишнее для обнажения естественной формы предмета.",
      highlights: [
        "Бескомпромиссная эргономика корпуса",
        "Скрытый циферблат с лазерной гравировкой",
        "Прообраз премиальной линейки студийных аксесуаров"
      ]
    },
    {
      id: "wireless-audio-2016",
      year: "2016",
      title: "Acoustica Wireless Headphones",
      category: "Product & Hardware",
      client: "Concept Audio Tech",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 7600,
      commentsCount: 388,
      shortDesc: "Анодированный алюминий и физический комфорт во главе угла.",
      fullDesc: "Концепт беспроводных полноразмерных наушников с чашками из фрезерованного алюминия и амбушюрами с эффектом памяти. Дизайн совмещал эстетику хай-тек аппаратуры с премиальным уличным стилем.",
      highlights: [
        "Фрезерованный алюминиевый оголовник",
        "Тактильный интуитивный регулятор громкости",
        "Популярный рендер в дизайне гаджетов 2016 года"
      ]
    },
    {
      id: "glass-villa-2018",
      year: "2018",
      title: "Mountain Glass Pavilion Villa",
      category: "Architectural Design",
      client: "Private Concept",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 8100,
      commentsCount: 402,
      shortDesc: "Концепт стеклянной виллы, интегрированной в горный ландшафт.",
      fullDesc: "Концептуальный архитектурный ансамбль из панорамного остекления, консольных бетонных плит и натурального камня. Проект показал способность студии работать с масштабом пространства и светом.",
      highlights: [
        "Панорамные фасадные конструкции",
        "Бесшовный перепад высот и интеграция в рельеф",
        "Фотореалистичная ландшафтная визуализация"
      ]
    },
    {
      id: "chyraq-prototype-2019",
      year: "2019",
      title: "Chyraq Early Brass Luminaire",
      category: "Lighting & Form R&D",
      client: "Steel Drake Originals",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 6300,
      commentsCount: 295,
      shortDesc: "Первые прототипы латунного светильника Chyraq.",
      fullDesc: "Ранний поисковый макет легендарного светильника Chyraq. Проработка угла рассеивания теплого света, физического взаимодействия с сенсорной панелью и баланса латунного основания.",
      highlights: [
        "Истоки фирменного продукта студии Chyraq",
        "Скульптурная пластика латунного основания",
        "Победитель концептуальных показов 2019–2020"
      ]
    },
    {
      id: "mobility-pod-2020",
      year: "2020",
      title: "Urban Electric Autonomous Pod",
      category: "Concept Mobility",
      client: "Smart Mobility Research",
      images: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1518984650508-d2182b8c56cc?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 11200,
      commentsCount: 630,
      shortDesc: "Концепт беспилотного городского транспорта нового поколения.",
      fullDesc: "Концепция автономизированного городского капсульного транспорта с панорамной крышей и трансформируемым салоном. Проект стал итоговой вехой периода 2005–2020 годов перед новым этапом развития компании.",
      highlights: [
        "Концепт автономной городской капсулы",
        "Интерьер-трансформер для работы в пути",
        "Символ перехода студии к масштабным экосистемам"
      ]
    }
  ],
  en: [
    {
      id: "iphone-concept-2014",
      year: "2014",
      title: "iPhone 8 Viral Concept",
      category: "Concept Design / R&D",
      client: "Global Viral Publication",
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 14200,
      commentsCount: 890,
      shortDesc: "The world's most viral smartphone concept according to Forbes, Business Insider, and CNET.",
      fullDesc: "The project that took the global tech world by storm in 2014. Featuring a futuristic aluminum and glass body, curved display, and seamless ergonomics. Written about by Forbes, CNET, Business Insider, and viewed millions of times globally.",
      highlights: [
        "Ranked #1 global viral tech concept in major media",
        "Millions of organic views worldwide",
        "Featured on Yanko Design, TrendHunter, Delood"
      ]
    },
    {
      id: "manas-airport-mag-2011",
      year: "2011",
      title: "Manas Airport Magazine & Brand",
      category: "Editorial & Brand Identity",
      client: "Manas International Airport",
      images: [
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1569154941061-e231b4732ef1?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 3850,
      commentsCount: 142,
      shortDesc: "Winner of Red Jolbor Fest 2011 (1 of 6 trophies).",
      fullDesc: "Art direction and full design for the official premium magazine of Manas International Airport. Awarded a trophy at the very first Red Jolbor Fest advertising festival in 2011.",
      highlights: [
        "Red Jolbor Fest 2011 Award winner",
        "Full editorial print art direction",
        "Unified inflight identity standard"
      ]
    },
    {
      id: "supercar-concept-2015",
      year: "2015",
      title: "Futuristic Supercar Aerodynamics",
      category: "Automotive Design",
      client: "Steel Drake R&D Concept",
      images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 9400,
      commentsCount: 512,
      shortDesc: "Futuristic supercar featuring active aerodynamic wings.",
      fullDesc: "Research concept hypercar featuring sharp muscular surfacing and active aerodynamic channels. Featured across international automotive journals and motoring portals.",
      highlights: [
        "Featured in global automotive press",
        "Innovative body architecture & optics",
        "High-poly 3D modeling & render"
      ]
    },
    {
      id: "chronograph-watch-2012",
      year: "2012",
      title: "Monolith Chronograph Watch",
      category: "Industrial Design",
      client: "Steel Drake Heritage",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 5210,
      commentsCount: 230,
      shortDesc: "Minimalist timepiece crafted from titanium and matte ceramic.",
      fullDesc: "A tactile chronograph free of unnecessary ornamentation — solid titanium case, sapphire crystal, and concealed clasps. Established our core philosophy: stripping away excess to expose raw form.",
      highlights: [
        "Uncompromising casing ergonomics",
        "Laser-etched hidden dial details",
        "Prototype for studio luxury hardware"
      ]
    },
    {
      id: "wireless-audio-2016",
      year: "2016",
      title: "Acoustica Wireless Headphones",
      category: "Product & Hardware",
      client: "Concept Audio Tech",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 7600,
      commentsCount: 388,
      shortDesc: "Anodized aluminum & physical comfort leading audio design.",
      fullDesc: "Over-ear wireless headphone concept with CNC-milled aluminum earcups and memory foam cushions. Merging high-tech audio equipment aesthetic with premium street style.",
      highlights: [
        "CNC-milled aluminum headband",
        "Tactile intuitive volume ring",
        "Iconic render in 2016 gadget design"
      ]
    },
    {
      id: "glass-villa-2018",
      year: "2018",
      title: "Mountain Glass Pavilion Villa",
      category: "Architectural Design",
      client: "Private Concept",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 8100,
      commentsCount: 402,
      shortDesc: "Glass villa concept seamlessly integrated into mountain terrain.",
      fullDesc: "Conceptual architectural ensemble using floor-to-ceiling glass, cantilevered concrete slabs, and natural stone. Showcased the studio's mastery in spatial scale and natural light.",
      highlights: [
        "Panoramic curtain-wall facade",
        "Seamless terrain integration",
        "Photorealistic landscape rendering"
      ]
    },
    {
      id: "chyraq-prototype-2019",
      year: "2019",
      title: "Chyraq Early Brass Luminaire",
      category: "Lighting & Form R&D",
      client: "Steel Drake Originals",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 6300,
      commentsCount: 295,
      shortDesc: "Early prototype iteration of the iconic brass Chyraq lamp.",
      fullDesc: "Early physical research mockup for the Chyraq luminaire. Calibrating warm light diffusion angles, touch control interaction, and brass base counter-balance.",
      highlights: [
        "Origins of the signature Chyraq product",
        "Sculptural brass base geometry",
        "Winner of 2019–2020 concept showcases"
      ]
    },
    {
      id: "mobility-pod-2020",
      year: "2020",
      title: "Urban Electric Autonomous Pod",
      category: "Concept Mobility",
      client: "Smart Mobility Research",
      images: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1518984650508-d2182b8c56cc?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 11200,
      commentsCount: 630,
      shortDesc: "Next-generation autonomous urban mobility capsule concept.",
      fullDesc: "Autonomous urban transport capsule featuring a panoramic glass dome and modular interior layout. Marked the concluding milestone of our 2005–2020 era before expanding into full multidisciplinary scale.",
      highlights: [
        "Autonomous urban mobility capsule",
        "Reconfigurable work-lounge interior",
        "Symbol of studio shift into ecosystems"
      ]
    }
  ],
  kg: [
    {
      id: "iphone-concept-2014",
      year: "2014",
      title: "iPhone 8 Viral Concept",
      category: "Concept Design / R&D",
      client: "Global Viral Publication",
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 14200,
      commentsCount: 890,
      shortDesc: "Forbes, Business Insider жана CNET версиясы боюнча дүйнөдөгү эң атактуу смартфон концепциясы.",
      fullDesc: "2014-жылы бүткүл дүйнөлүк интернетти тан калтырган проект. Футуристтик алюминий жана айнек корпус, ийилген дисплей жана жылмакай дизайн. Forbes, Business Insider, CNET басылмаларында талкууланып, миллиондогон көрүүлөргө ээ болгон.",
      highlights: [
        "Дүйнөлүк басылмаларда эң көп көрүлгөн концепт (Forbes, CNET)",
        "Миллиондогон органикалык көрүүлөр",
        "Yanko Design, TrendHunter, Delood басылмаларында жарыяланган"
      ]
    },
    {
      id: "manas-airport-mag-2011",
      year: "2011",
      title: "Манас аэропортунун журналы жана брендинги",
      category: "Editorial & Brand Identity",
      client: "Манас Эл аралык Аэропорту",
      images: [
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1569154941061-e231b4732ef1?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 3850,
      commentsCount: 142,
      shortDesc: "Red Jolbor Fest 2011 жеңүүчүсү (6 сыйлыктын ичинен 1 статуэтка).",
      fullDesc: "Манас аэропортунун өзүнүн премиум журналынын толук арт-дирекциясы жана дизайны. Бул долбоор 2011-жылдагы эң биринчи Red Jolbor Fest фестивалында статуэтка утуп алган.",
      highlights: [
        "Red Jolbor Fest 2011 сыйлыгынын ээси",
        "Басма басылмасынын арт-дирекциясы",
        "Бирдиктүү борттук полиграфия стандарты"
      ]
    },
    {
      id: "supercar-concept-2015",
      year: "2015",
      title: "Futuristic Supercar Aerodynamics",
      category: "Automotive Design",
      client: "Steel Drake R&D Concept",
      images: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 9400,
      commentsCount: 512,
      shortDesc: "Активдүү аэродинамикасы бар футуристтик суперкар.",
      fullDesc: "Жигердүү сызыктары жана жашыруун аэродинамикалык бети бар гиперкар изилдөө концепти. Motoring Exposure жана Yanko Design авто-журналдарында жарыяланган.",
      highlights: [
        "Эл аралык автомобиль журналдарында жарыяланган",
        "Инновациялык кузов формасы",
        "Жогорку полигондуу 3D-моделдөө"
      ]
    },
    {
      id: "chronograph-watch-2012",
      year: "2012",
      title: "Monolith Chronograph Watch",
      category: "Industrial Design",
      client: "Steel Drake Heritage",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 5210,
      commentsCount: 230,
      shortDesc: "Титан жана матовый керамикадан жасалган минималисттик кол саат.",
      fullDesc: "Ашыкча деталдары жок хронграф — монолиттик титан корпус, сапфир айнек жана жашыруун бекиткичтер. Студиянын негизги ыкмасын түптөгөн: ашыкча нерселердин баарын алып салуу.",
      highlights: [
        "Корпустун ыңгайлуу эргономикасы",
        "Лазердик оюп жасалган жашыруун деталдар",
        "Студиянын премиум аксессуарлар катары туу чокусу"
      ]
    },
    {
      id: "wireless-audio-2016",
      year: "2016",
      title: "Acoustica Wireless Headphones",
      category: "Product & Hardware",
      client: "Concept Audio Tech",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 7600,
      commentsCount: 388,
      shortDesc: "Аноддолгон алюминий жана физикалык комфорт биринчи орунда.",
      fullDesc: "Фрезеровкаланган алюминий чашкалары жана эс тутуму бар жумшак амбушюралары бар зымсыз кулакчындардын концепти. Дизайн хай-тек аппаратурасынын эстетикасын премиум көчө стили менен айкалыштырган.",
      highlights: [
        "Фрезеровкаланган алюминий каркас",
        "Интуитивдик үндү жөнгө салгыч",
        "2016-жылдын гаджет дизайнындагы популярдуу рендер"
      ]
    },
    {
      id: "glass-villa-2018",
      year: "2018",
      title: "Mountain Glass Pavilion Villa",
      category: "Architectural Design",
      client: "Private Concept",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 8100,
      commentsCount: 402,
      shortDesc: "Тоо ландшафтына интеграцияланган айнек вилланын концепти.",
      fullDesc: "Панорамалык айнектерден, бетон плиталардан жана табигый таштан турган концептуалдык архитектуралык ансамбль. Студиянын мейкиндик масштабы жана жарык менен иштөө жөндөмүн көрсөткөн.",
      highlights: [
        "Панорамалык фасаддык конструкциялар",
        "Ландшафтка үзгүлтүксүз интеграция",
        "Фотореалисттик ландшафттык визуализация"
      ]
    },
    {
      id: "chyraq-prototype-2019",
      year: "2019",
      title: "Chyraq Early Brass Luminaire",
      category: "Lighting & Form R&D",
      client: "Steel Drake Originals",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 6300,
      commentsCount: 295,
      shortDesc: "Chyraq жез чырагынын алгачкы прототиптери.",
      fullDesc: "Атактуу Chyraq чырагынын алгачкы макети. Жылуу жарыктын чачыроо бурчун, сенсордук панель менен физикалык өз ара аракеттенүүнү жана жез негизинин балансын иштеп чыгуу.",
      highlights: [
        "Фирмалык Chyraq продуктусунун башталышы",
        "Жез негизинин скульптуралык геометриясы",
        "2019–2020 концептуалдык көргөзмөлөрүнүн жеңүүчүсү"
      ]
    },
    {
      id: "mobility-pod-2020",
      year: "2020",
      title: "Urban Electric Autonomous Pod",
      category: "Concept Mobility",
      client: "Smart Mobility Research",
      images: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1518984650508-d2182b8c56cc?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000"
      ],
      likesCount: 11200,
      commentsCount: 630,
      shortDesc: "Жаны муундагы учкучсуз шаардык транспорт концепти.",
      fullDesc: "Панорамалык чатыры жана өзгөрүлмө салону бар автономиялуу шаардык капсула транспортунун концепциясы. Бул долбоор компаниянын 2005–2020-жылдардагы мезгилинин корутундусу болуп калды.",
      highlights: [
        "Автономдук шаардык капсула концепти",
        "Жолдо иштөө үчүн трансформер-интерьер",
        "Студиянын ири экосистемаларга өтүү белгиси"
      ]
    }
  ]
};
