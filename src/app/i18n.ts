import { createContext, Dispatch, SetStateAction } from "react";
import { teamTranslations } from "./teamData";

export type Language = "en" | "kg" | "ru";

export const languageOptions: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "kg", label: "KG" },
  { code: "ru", label: "RU" },
];

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      projects: "Projects",
      products: "Products",
      contacts: "Contacts",
    },
    home: {
      heroTag: '(c) "Everything you see is but a primary link in how we perceive our physical world. That is my philosophy."',
      heroDescription: "Everything you see is but a primary link in how we perceive our physical world, which is why the studio's philosophy is Design at first.",
      viewProjects: "View projects",
      statsYears: "15+",
      statsLabel: "Real experience in the independent industry, creating brands and directions since 2011.",
      globalLabel: "Projects for Central Asia, Europe and digital-first teams.",
      principleLabel: "Who you\ngonna call?",
      studioLabel: "The form of the future should feel inevitable.",
      servicesTitle: "Services",
      servicesHint: "hover / expand",
      selectedWorkTitle: "Selected work",
      featuredProjectsTitle: "New & recent work",
      newProject: {
        label: "New project",
        title: "Shovels & Steel",
        description: "A fresh industrial concept for a modern workspace with tactile materials and structural clarity.",
        publishedLabel: "Published",
        date: "June 11, 2026",
        time: "14:20",
        action: "View",
      },
      recentProject: {
        label: "Recent project",
        title: "Oasis Studio",
        description: "A recent digital identity and product design for a premium architecture brand.",
        publishedLabel: "Published",
        date: "June 4, 2026",
        time: "10:45",
        action: "View",
      },
      services: [
        ["01", "Brand", "Identity, motion systems, visual language, and product launch.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/brand.png"],
        ["03", "Industrial Design", "Developing aesthetic, functional, and technological physical products for serial production.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/industrial.png"],
        ["09", "Marketing", "Strategic product promotion and launch campaigns in digital environments.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/marketing.png"],
        ["06", "Concept Design", "Creating bold concepts for film, games, presentations, and R&D research.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/concept.png"],
      ],
      projects: [
        { title: "Sandyq", tag: "Hospitality / Identity" },
        { title: "Ala-Too", tag: "Strategy / Web" },
        { title: "Ordo X", tag: "Architecture / 3D" },
        { title: "Salkyn", tag: "Industrial Design" },
        { title: "TechStart", tag: "Branding / SaaS" },
        { title: "Auto Concept X", tag: "Automotive / R&D" },
      ],
      brands: [
        { logoUrl: "", tag: "Identity & Space" },
        { logoUrl: "", tag: "Web & Platform" },
        { logoUrl: "", tag: "3D & Space" },
        { logoUrl: "", tag: "Industrial Design" },
        { logoUrl: "", tag: "Branding & SaaS" },
        { logoUrl: "", tag: "Product & Lighting" }
      ],
    },
    about: {
      whoWeAre: "Who we are",
      ourStoryTitle: "Our story",
      manifestoHeading: "Founded on a passion for form.",
      manifestoText: "Steel Drake Studio was founded in 2011 by designer and visionary Oleg Ermakov. Starting as a progressive concept studio, we grew into an international bureau able to solve tasks of any scale — from tech startup identity to futuristic transport and architectural ensembles. Our story is a continuous search for harmony between functionality and pure emotion.",
      philosophyTitle: "Our manifesto",
      philosophyText: "We believe design is not just surface treatment. It is a language through which a product speaks to its user. We remove everything unnecessary to reveal the essence. Our philosophy is built on three pillars: uncompromising ergonomics, technological aesthetics, and durable meaning. We don't follow trends — we design a future that remains relevant for decades.",
      teamTitle: "Team",
      teamIntro: "A collective of strategists, designers, developers and problem-solvers united by curiosity and craft. We create digital experiences that are elegant, functional and unforgettable.",
      team: teamTranslations.en,
      timeline: [
        { year: "2011", title: "Foundation", text: "We started with a simple idea: bring together strategy, creativity and technology to create meaningful design.", img: "/about/story_1.png" },
        { year: "2012 - 2015", title: "Concept Studio Origins", text: "Our early projects shaped our approach — research-driven concepts, elegant solutions and attention to detail.", img: "/about/story_2.png" },
        { year: "2016 - 2019", title: "International Growth", text: "Expanding our team and expertise, we began working across borders and industries, tackling bigger challenges.", img: "/about/story_3.png" },
        { year: "2020 - Today", title: "Multidisciplinary Bureau Today", text: "Today, we are a full-cycle design bureau creating impactful solutions across digital, mobility, and space.", img: "/about/story_4.png" }
      ],
      awardsTitle: "Recognition",
      awardsSub: "Designing awards & milestones.",
      awardsList: [
        { year: "2011", title: "First Red Jolbor Fest Kyrgyzstan", project: "1 award out of 6", details: "Art direction of the brand magazine for Manas Airport" },
        { year: "2008", title: "Silver medalist of the Design Championship", project: "Kyrgyzstan", details: "National Design Championship" },
        { year: "2014", title: "The most popular smartphone concept in the world - iPhone ©Google", project: "This project didn't just sit on Behance. Virtually all major trade and lifestyle publications wrote about it:\n\nForbes, Business Insider, and CNET published compilations of renders, calling them 'the most beautiful look into the future.'\n\nIn the Russian segment, the concept was widely discussed on TJournal, iPhones.ru, and Hi-Tech Mail.ru.\n\nVideos of this concept on YouTube gathered hundreds of thousands of views, with many users in comments seriously asking: 'Is this the real iPhone 8?'", details: "Verdict: If measured by global likes, it ranks in the Top 10 best of all time. If measured by real results (sale of rights, author's career), it is likely No.1 in history. Most other creators only got likes on Behance." },
        { year: "2011–2015", title: "Global viral reach", project: "During the peak of publications, the author's concepts gathered millions of views on leading design and tech platforms worldwide, including Yanko Design, Trendland, Delood, Motoring Exposure, and Trend Hunter.", details: "Steel Drake's works regularly topped the views and were discussed in print and online publications worldwide. ©Google" }
      ],
      valuesTitle: "Core Principles",
      valuesSub: "Philosophy\nFoundation",
      valuesList: [
        { num: "01", title: "First\nPerception", desc: "As stated in our statement, the very first thing that happens is what you visually perceive." },
        { num: "02", title: "Feelings", desc: "After the first look, you start to experience certain feelings: whether you like it or not, want to examine it, or are already starting to try it on." },
        { num: "03", title: "Emotions", desc: "If the result does not bring\nemotion, then something is wrong.\nIt's like locking your car and not turning to look at it before leaving — if so, you have the wrong car." }
      ],
      mapTitle: "Global Footprint",
      mapSub: "Working with the whole world",
      mapCities: "Except Antarctica and the North Pole, we don't tolerate cold very well. Today, our clients include partners from Kyrgyzstan, USA (Miami, Washington), Belgium (Brussels), Kazakhstan, United Kingdom, Canada, China, Tajikistan, Uzbekistan, Ukraine, Germany, and France."
    },
    services: {
      title: "Services",
      stepsTitle: "Work stages",
      items: [
        {
          id: "01",
          title: "Branding",
          desc: "Creating a unique brand DNA: from positioning and naming to visual ecosystem and guidelines.",
          steps: [
            "Market research and competitor audit.",
            "Platform development and visual identity concepts.",
            "Brand book creation and implementation support.",
          ],
        },
        {
          id: "03",
          title: "Industrial Design",
          desc: "Developing aesthetic, functional, and technological physical products for serial production.",
          steps: [
            "Sketching, ergonomic analysis, and form exploration.",
            "3D modeling with manufacturing constraints.",
            "Prototype development and detail refinement.",
          ],
        },
        {
          id: "09",
          title: "Marketing",
          desc: "Strategic product promotion and launch campaigns in digital environments.",
          steps: [
            "Strategy development and channel selection.",
            "Creative production and campaign launch.",
            "Performance analysis and optimization.",
          ],
        },
        {
          id: "06",
          title: "Concept Design",
          desc: "Creating bold concepts for film, games, presentations, and R&D research.",
          steps: [
            "Immersion in setting, reference collection, and ideation.",
            "Concept art development and quick 3D prototypes.",
            "Final rendering and concept presentation.",
          ],
        },
        {
          id: "02",
          title: "Graphic Design",
          desc: "Designing communication materials, packaging, and digital graphic interfaces.",
          steps: [
            "Carrier analysis and style direction definition.",
            "Layout design and typography pairing.",
            "Production-ready file preparation and supervision.",
          ],
        },
        {
          id: "04",
          title: "Automotive Design",
          desc: "Designing exteriors and interiors of vehicles — from concept cars to commercial transport.",
          steps: [
            "Proportional study and packaging design.",
            "Sketching and high-polygon 3D modeling.",
            "Realistic visualization and engineering handoff.",
          ],
        },
        {
          id: "05",
          title: "Architectural Design",
          desc: "Developing conceptual architecture, private villas, public spaces, and small forms.",
          steps: [
            "Site context study and volumetric planning.",
            "Facade solutions, layouts, and material selection.",
            "Photorealistic 3D visualization in landscape.",
          ],
        },
        {
          id: "07",
          title: "Product Design",
          desc: "Comprehensive digital product design: mobile apps, web services, and complex interfaces.",
          steps: [
            "User journey design and interaction structure.",
            "Visual interface layout and transition design.",
            "Prototype testing and developer handoff.",
          ],
        },
        {
          id: "08",
          title: "Motion Design",
          desc: "Creating dynamic graphics, promo videos, and interface animation.",
          steps: [
            "Story development and storyboard creation.",
            "Animation, physics simulation, and material settings.",
            "Final edit, color correction, and sound design.",
          ],
        },
        {
          id: "10",
          title: "Music & Sound",
          desc: "Creating bespoke audio identity, soundtracks, and sound design for media.",
          steps: [
            "Mood briefing and composition planning.",
            "Theme writing, arrangement, and recording.",
            "Mixing, mastering, and integration.",
          ],
        },
        {
          id: "11",
          title: "Web Developing / Design",
          desc: "Building polished digital products with a full-stack approach to UX, UI and front-end performance.",
          steps: [
            "Designing responsive interfaces and interactive user journeys.",
            "Developing pixel-perfect front-end experiences with modern web tools.",
            "Testing, optimization and deployment for production-ready delivery.",
          ],
        },
        {
          id: "12",
          title: "UI UX Design",
          desc: "Crafting thoughtful interface systems and user experiences for digital products.",
          steps: [
            "Researching user needs and defining experience flows.",
            "Iterating on interface concepts with clear visual hierarchy.",
            "Delivering UI kits and usability-ready product screens.",
          ],
        },
      ],
    },
    projects: {
      title: "Projects",
      items: [
        { id: "sandyq", name: "Sandyq", category: "Branding & Architecture", categoryKey: "branding", img: "image.png" },
        { id: "ala-too", name: "Ala-Too", category: "Product Design", categoryKey: "web", img: "image_2026-06-09_10-31-16.png" },
        { id: "salkyn", name: "Salkyn", category: "Industrial Design", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600" },
        { id: "one-ordo", name: "One Ordo Resort", category: "Architecture", categoryKey: "architectural", img: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600" },
        { id: "techstart", name: "TechStart", category: "Branding & Web", categoryKey: "branding", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600" },
        { id: "auto-concept-x", name: "Auto Concept X", category: "Automotive Design", categoryKey: "automotive", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600" },
      ],
    },
    products: {
      title: "Studio Products",
      items: [
        { id: "chyraq", name: "Chyraq", category: "Industrial Design", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600" }
      ],
    },
    projectCategories: {
      all: "All",
      branding: "Branding",
      industrial: "Industrial Design",
      marketing: "Marketing",
      concept: "Concept Design",
      graphic: "Graphic Design",
      automotive: "Automotive Design",
      architectural: "Architectural Design",
      product: "Product Design",
      motion: "Motion Design",
      music: "Music & Sound",
      web: "Web Developing / Design",
      uiux: "UI UX Design"
    },
    contacts: {
      title: "Let's discuss the future.",
      letsTalk: "Let's Talk",
      writeUs: "Write to us",
      callUs: "Call us",
      officeTitle: "Office address",
      officeAddress: "Bishkek, Kyrgyzstan\nIT - Hub Technopark",
      leader: "Management: Oleg Ermakov — CEO",
      legal: "Legal information: Individual entrepreneur Ermakov O.",
      markerLabel: "Steel Drake Studio Team",
      addressFooter: "IT - Hub Technopark, Bishkek",
    },
    projectDetail: {
      challengeHeading: "Challenge",
      resultsHeading: "Results",
      labels: {
        client: "Client",
        year: "Year",
        service: "Service",
      },
      projects: {
        sandyq: {
          name: "Sandyq",
          desc: "A full rebrand and architectural concept for a national hospitality brand.",
          client: "Sandyq Group",
          year: "2024",
          service: "Branding, Architecture",
          challenge: "Create an authentic yet modern identity that works equally well in urban spaces and recreational zones.",
          processImages: [
            "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600",
          ],
          results: ["International market launch", "40% higher audience engagement"],
        },
      },
      defaultProject: {
        name: "Project",
        desc: "Project description.",
        client: "Unknown",
        year: "2025",
        service: "Design",
        challenge: "Develop an innovative approach to a classic challenge.",
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600"],
        results: ["Successful launch"],
      },
    },
    productDetail: {
      challengeHeading: "Challenge",
      resultsHeading: "Results",
      labels: {
        client: "Client",
        year: "Year",
        service: "Service",
      },
      products: {
        chyraq: {
          name: "Chyraq",
          desc: "A smart minimal light fixture with touch controls and sustainable brass base.",
          client: "Chyraq Labs",
          year: "2026",
          service: "Industrial Design",
          challenge: "Design a premium, tactile desk lamp that acts as an art piece while off.",
          processImages: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600"
          ],
          results: ["Winner of Interior Design Show 2026"]
        }
      },
      defaultProduct: {
        name: "Product",
        desc: "Product description.",
        client: "Unknown",
        year: "2026",
        service: "Industrial Design",
        challenge: "Develop a premium physical product concept.",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600"],
        results: ["Successful launch"],
      },
    },
  },
  kg: {
    nav: {
      home: "Башкы",
      about: "Биз",
      services: "Кызматтар",
      projects: "Долбоор",
      products: "Продукциялар",
      contacts: "Байланыш",
    },
    home: {
      heroTag: "Сиз көргөн нерселердин баары биздин физикалык дүйнөнү кандай кабыл алганыбыздын баштапкы шилтемелеринин бири болуп саналат. Бул менин философиям.",
      heroDescription: "Сиз көргөн нерселердин баары биздин физикалык дүйнөнү кандай кабыл алганыбыздын баштапкы шилтемелеринин бири болуп саналат, ошондуктан студиянын философиясы - бул биринчи кезекте Дизайн.",
      viewProjects: "Проекттерди караңыз",
      statsYears: "15+",
      statsLabel: "Көз карандысыз тармактагы чыныгы тажрыйба, 2011-жылдан бери бренддерди жана багыттарды түзүп келебиз.",
      globalLabel: "Борбордук Азия, Европа жана санарип биринчи командалар үчүн долбоорлор.",
      principleLabel: "Who you\ngonna call?",
      studioLabel: "Келечектин формасы неизбилүү сезилиши керек.",
      servicesTitle: "Кызматтар",
      servicesHint: "hover / кеңейтүү",
      selectedWorkTitle: "Тандалган иштер",
      featuredProjectsTitle: "Жаңы жана акыркы иштер",
      newProject: {
        label: "Жаңы долбоор",
        title: "Shovels & Steel",
        description: "Тактилдүү материалдар жана структуралык ачыктык менен заманбап иш мейкиндиги үчүн жаңы өнөр жай концепти.",
        publishedLabel: "Жарыяланган",
        date: "11-июнь, 2026",
        time: "14:20",
        action: "Караңыз",
      },
      recentProject: {
        label: "Жакында долбоор",
        title: "Oasis Studio",
        description: "Кадыр-барктуу архитектуралык бренд үчүн акыркы санариптик айдентика жана продукт дизайны.",
        publishedLabel: "Жарыяланган",
        date: "4-июнь, 2026",
        time: "10:45",
        action: "Караңыз",
      },
      services: [
        ["01", "Brand", "Айдентика, motion системасы, визуалдык тил жана продуктту баштоо.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/brand.png"],
        ["03", "Industrial Design", "Сериялык өндүрүш үчүн эстетикалык, функционалдуу жана технологиялык физикалык объекттерди иштеп чыгуу.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/industrial.png"],
        ["09", "Marketing", "Продуктту жана брендди санариптик мейкиндикте стратегиялык илгерилетүү.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/marketing.png"],
        ["06", "Concept Design", "Кино, оюн, презентация жана R&D үчүн келечектүү жана эрктүү концепттерди түзүү.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/concept.png"],
      ],
      projects: [
        { title: "Sandyq", tag: "Гостиница / Айдентика" },
        { title: "Ala-Too", tag: "Стратегия / Веб" },
        { title: "Ordo X", tag: "Архитектура / 3D" },
        { title: "Salkyn", tag: "Өнөр жай дизайны" },
        { title: "TechStart", tag: "Брендинг / SaaS" },
        { title: "Auto Concept X", tag: "Автомобиль / R&D" },
      ],
      brands: [
        { logoUrl: "", tag: "Айдентика жана Мейкиндик" },
        { logoUrl: "", tag: "Веб жана Платформалар" },
        { logoUrl: "", tag: "Архитектура жана 3D" },
        { logoUrl: "", tag: "Өнөр жай дизайны" },
        { logoUrl: "", tag: "Брендинг жана SaaS" },
        { logoUrl: "", tag: "Продукт жана Жарык" }
      ],
    },
    about: {
      whoWeAre: "Биз кимбиз",
      ourStoryTitle: "Биздин тарых",
      manifestoHeading: "Формасына болгон страсть менен негизделген.",
      manifestoText: "Steel Drake Studio 2011-жылы дизайнер жана визионер Олег Ермаков тарабынан негизделген. Прогрессивдүү концепциялык студиядан эл аралык бюрого айланып, биз ар кандай масштабдагы тапшырмаларды чече алабыз — технологиялык стартаптын айдентикасынан футуристтик транспортко жана архитектуралык ансамблдерге чейин. Биздин тарых функционалдуулук менен таза эмоциянын гармониясын издөөнүн үзгүлтүксүз сапары.",
      philosophyTitle: "Биздин манифест",
      philosophyText: "Биз дизайн жөн гана беттик өңдөө эмес деп ишенебиз. Бул продукт колдонуучу менен сүйлөшкөн тил. Биз бардык керексиз нерселерди алып салабыз, түйүнүн ачабыз. Биздин философия үч устунга курулган: суроо-жоопсуз эргономика, технологикалык эстетика жана маанилердин туруктуулугу. Биз тренддерди көздөбөйбүз — он жылдыкта актуалдуу болчу келечекти долбоорлайбыз.",
      teamTitle: "Команда",
      teamIntro: "Кызыгуу жана чеберчилик менен бириккен стратегдердин, дизайнерлердин, иштеп чыгуучулардын жана изилдөөчүлөрдүн командасы. Биз эстетикалык, функционалдык жана унутулгус санариптик тажрыйбаларды түзөбүз.",
      team: teamTranslations.kg,
      timeline: [
        { year: "2011", title: "Түптөлүшү", text: "Биз жөнөкөй идеядан баштадык: маанилүү дизайнды түзүү үчүн стратегияны, чыгармачылыкты жана технологияны бириктирдик.", img: "/about/story_1.png" },
        { year: "2012 - 2015", title: "Концепт-студиянын башталышы", text: "Биздин алгачкы долбоорлорубуз мамилебизди калыптандырды — изилдөөгө негизделген концепциялар, кооз чечимдер жана деталдарга көңүл буруу.", img: "/about/story_2.png" },
        { year: "2016 - 2019", title: "Эл аралык өсүш", text: "Командабызды жана тажрыйбабызды кеңейтип, биз чек аралардан жана тармактардан тышкары иштеп, чоңураак милдеттерди чече баштадык.", img: "/about/story_3.png" },
        { year: "2020 - Бүгүн", title: "Бүгүнкү мультидисциплинардык бюро", text: "Бүгүн биз санариптик, мобилдүүлүк жана мейкиндикте таасирдүү чечимдерди жараткан толук циклдуу дизайн бюробуз.", img: "/about/story_4.png" }
      ],
      awardsTitle: "Таануу жана сыйлыктар",
      awardsSub: "Дизайн багытындагы жетишкендиктерибиз.",
      awardsList: [
        { year: "2011", title: "Биринчи Red Jolbor Fest Кыргызстан", project: "6 сыйлыктын ичинен 1 статуэтка", details: "Манас аэропортунун бренд журналынын арт-дирекциясы" },
        { year: "2008", title: "Дизайн боюнча чемпионаттын күмүш байгесинин ээси", project: "Кыргызстан", details: "Улуттук дизайн чемпионаты" },
        { year: "2014", title: "Дүйнөдөгү эң популярдуу смартфон концепциясы - iPhone ©Google", project: "Бул долбоор жөн гана Behance-те туруп калган жок. Ал жөнүндө дээрлик бардык ири тармактык жана лайфстайл басылмалар жазышкан:\n\nForbes, Business Insider жана CNET рендерлердин жыйнагын жарыялап, аларды 'келечектин эң кооз көрүнүшү' деп аташкан.\n\nКоомдук тармактарда концепция кызуу талкууланган.\n\nYouTube-дагы бул концепт видеолору жүз миңдеген көрүүлөргө ээ болуп, көптөгөн колдонуучулар пикирлеринде олуттуу түрдө: 'Бул чыныгы iPhone 8би?' деп сурашкан.", details: "Чечим: Эгерде дүйнөлүк деңгээлдеги лайктар менен өлчөсөк — ал бардык убактагы эң мыкты Топ-10го кирет. Эгерде реалдуу жыйынтык менен өлчөсөк (укуктарды сатуу, автордун карьерасы) — бул тарыхта №1 болушу мүмкүн. Башка авторлордун көбү Behance-те гана лайк алышкан." },
        { year: "2011–2015", title: "Глобалдык вирус оозу", project: "Басылмалардын туу чокусунда автордун концепциялары дүйнөлүк алдыңкы дизайн жана техно-платформаларда миллиондогон көрүүлөргө ээ болгон, анын ичинде Yanko Design, Trendland, Delood, Motoring Exposure жана Trend Hunter.", details: "Steel Drake иштери дүйнө жүзү боюнча басылмаларда талкууланган. ©Google" }
      ],
      valuesTitle: "Негизги принциптерибиз",
      valuesSub: "Философиянын\nнегизи",
      valuesList: [
        { num: "01", title: "Биринчи\nкабыл алуу", desc: "Биздин билдирүүбүздө айтылгандай, эң биринчи болуп сиз көргөн нерсе ишке ашат." },
        { num: "02", title: "Сезимдер", desc: "Биринчи карагандан кийин сиз белгилүү бир сезимдерди баштан өткөрө баштайсыз: бул сизге жагабы же жокпу, кылдат изилдегиңиз келеби же аны кийип көрө баштайсызбы." },
        { num: "03", title: "Эмоциялар", desc: "Эгерде натыйжа эмоция\nалып келбесе, анда бир нерсе туура эмес.\nБул унааңызды кулпулап, кетээрдин алдында артыңызды карап койбогон сыяктуу — андай болсо, анда сизде туура эмес унаа бар." }
      ],
      mapTitle: "Глобалдык география",
      mapSub: "Бүткүл дүйнө менен иштейбиз",
      mapCities: "Антарктида жана түндүк уюлдан тышкары, суукту анча жактыра бербейбиз. Бүгүнкү күндө биздин кардарлардын өлкөлөрүнүн тизмеси: Кыргызстан, АКШ (Майами, Вашингтон), Бельгия (Брюссель), Казакстан, Улуу Британия, Канада, Кытай, Тажикстан, Өзбекстан, Украина, Германия, Франция."
    },
    services: {
      title: "Кызматтар",
      stepsTitle: "Иш этаптары",
      items: [
        {
          id: "01",
          title: "Брендинг",
          desc: "Уникалдуу бренд ДНКсын түзүү: позициядан жана неймингден визуалдык экосистемага жана гайдлайнга чейин.",
          steps: [
            "Рынокту изилдөө жана атаандаштарды аудит кылуу.",
            "Бренд платформасын жана визуалдык инсанын концепцияларын түзүү.",
            "Брендбук түзүү жана киргизүүгө колдоо көрсөтүү.",
          ],
        },
        {
          id: "03",
          title: "Өнөр жай дизайны",
          desc: "Сериялык өндүрүш үчүн эстетикалык, функционалдуу жана технологиялык физикалык объекттерди иштеп чыгуу.",
          steps: [
            "Эскиз, эргономикалык анализ жана форманы издөө.",
            "Өндүрүштүк чектөөлөр эске алынган 3D моделдөө.",
            "Прототип түзүү жана детальдарды жакшыртуу.",
          ],
        },
        {
          id: "09",
          title: "Маркетинг",
          desc: "Продуктту жана брендди санариптик мейкиндикте стратегиялык илгерилетүү.",
          steps: [
            "Маркетинг стратегиясын түзүү жана каналдарды аныктоо.",
            "Реклама креативдерин түзүү жана кампанияларды баштоо.",
            "Натыйжалуулукту анализдөө жана оптимизациялоо.",
          ],
        },
        {
          id: "06",
          title: "Концепт дизайн",
          desc: "Кино, оюн, презентация жана R&D үчүн келечектүү жана эрктүү концепттерди түзүү.",
          steps: [
            "Сеттингке кирүү, референстөрдү чогултуу жана идея жаратуу.",
            "Эске алыныктуу концепт-арт жана тез 3D болванкаларды түзүү.",
            "Акыркы рендеринг жана концепт презентациясы.",
          ],
        },
        {
          id: "02",
          title: "Графикалык дизайн",
          desc: "Коммуникациялык материалдарды, таңгактоону жана санариптик графикалык интерфейстерди долбоорлоо.",
          steps: [
            "Ташуучуну талдоо жана стилистикалык векторду аныктоо.",
            "Макеттерди долбоорлоо жана шрифт тандоо.",
            "Өндүрүүгө даяр файлдарды даярдоо жана автордук көзөмөл.",
          ],
        },
        {
          id: "04",
          title: "Автомобиль дизайны",
          desc: "Маалыматтарды жана ички мейкиндиктерди долбоорлоо — концепт-кардан коммерциялык транспортко чейин.",
          steps: [
            "Пропорциялык издөө жана компоновка (Package design).",
            "Скетчинг жана жогорку полигондуу 3D моделдөө.",
            "Реалисттик визуализация жана инженердик өткөрүп берүү.",
          ],
        },
        {
          id: "05",
          title: "Архитектуралык дизайн",
          desc: "Идеялык архитектуралык чечимдерди, жеке виллаларды, коомдук мейкиндиктерди жана кичинекей формаларды иштеп чыгуу.",
          steps: [
            "Участок контекстин талдоо жана объемдук-жай схемасын түзүү.",
            "Фасад чечимдери, пландоо жана негизги материалдарды тандоо.",
            "Жандуу 3D визуализация объекттин ландшафтта.",
          ],
        },
        {
          id: "07",
          title: "Продукт дизайны",
          desc: "Мобилдик колдонмолор, веб кызматтар жана татаал интерфейстер үчүн толук санариптик продукт дизайны.",
          steps: [
            "Колдонуучунун сценарийлерин жана структурасын долбоорлоо.",
            "Визуалдык интерфейстин макеттерин жана өтмөктөрдү долбоорлоо.",
            "Прототипти тестирлөө жана иштеп чыгуучуларга өткөрүп берүү.",
          ],
        },
        {
          id: "08",
          title: "Моушн дизайн",
          desc: "Динамикалуу графика, промо роликтер жана интерфейс анимациясын түзүү.",
          steps: [
            "Сценарий жазуу жана раскадровканы түзүү.",
            "Элементтерди анимациялоо, физика симуляциясы жана материалдарды орнотуу.",
            "Акыркы монтаж, түс оңдоо жана үн дизайны.",
          ],
        },
        {
          id: "10",
          title: "Музыка жана композитордук",
          desc: "Видео жана инсталляция үчүн уникалдуу аудио дизайн, саундтректер жана үн эффекти иштеп чыгуу.",
          steps: [
            "Көңүл-күйдү, темпти жана эмоционалдык маанини талкуулоо.",
            "Музыкалык теманы жазуу, аранжировка жана аспаптарды жазуу.",
            "Сведение, мастеринг жана интеграция.",
          ],
        },
        {
          id: "11",
          title: "Web Developing / Design",
          desc: "UX, UI жана front-end өндүрүмдүүлүгүн эске алган бышык санарип продуктыларды куруу.",
          steps: [
            "Жооптуу интерфейстерди жана интерактивдүү колдонуучу жолдорун долбоорлоо.",
            "Модерн веб куралдар менен пикселдик таклыктагы фронтэнд тажрыйбасын ишке ашыруу.",
            "Тестирлөө, оптимизация жана өндүрүшкө даяр жөнөтүү.",
          ],
        },
        {
          id: "12",
          title: "UI UX дизайны",
          desc: "Санарип продуктылар үчүн ойлонулган интерфейс системаларын жана колдонуу тажрыйбасын иштеп чыгуу.",
          steps: [
            "Колдонуучу муктаждыктарын изилдеп, тажрыйба агымын аныктоо.",
            "Ачык визуалдык иерархия менен интерфейс концептилерин кайталантуу.",
            "UI кутуларын жана колдонууга даяр продукт скриндерин даярдоо.",
          ],
        },
      ],
    },
    projects: {
      title: "Проекттер",
      items: [
        { id: "sandyq", name: "Sandyq", category: "Брендинг & Архитектура", categoryKey: "branding", img: "image.png" },
        { id: "ala-too", name: "Ala-Too", category: "Продукт дизайны", categoryKey: "web", img: "image_2026-06-09_10-31-16.png" },
        { id: "salkyn", name: "Salkyn", category: "Өнөр жай дизайны", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600" },
        { id: "one-ordo", name: "One Ordo Resort", category: "Архитектура", categoryKey: "architectural", img: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600" },
        { id: "techstart", name: "TechStart", category: "Брендинг", categoryKey: "branding", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600" },
        { id: "auto-concept-x", name: "Auto Concept X", category: "Автомобиль дизайны", categoryKey: "automotive", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600" },
      ],
    },
    products: {
      title: "Студиянын продукциялары",
      items: [
        { id: "chyraq", name: "Chyraq", category: "Өнөр жай дизайны", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600" }
      ],
    },
    projectCategories: {
      all: "Баардыгы",
      branding: "Брендинг",
      industrial: "Өнөр жай дизайны",
      marketing: "Маркетинг",
      concept: "Концепт-дизайн",
      graphic: "Графикалык дизайн",
      automotive: "Автомобиль дизайны",
      architectural: "Архитектуралык дизайн",
      product: "Продукт дизайны",
      motion: "Моушн-дизайн",
      music: "Музыка жана композитордук",
      web: "Web иштеп чыгуу / Дизайн",
      uiux: "UI UX дизайны"
    },
    contacts: {
      title: "Келечек жөнүндө сүйлөшөлү.",
      letsTalk: "Сүйлөшөлү",
      writeUs: "Бизге жаз",
      callUs: "Чалып көр",
      officeTitle: "Офис дареги",
      officeAddress: "Бишкек, Кыргызстан\nIT - Hub Technopark",
      leader: "Башкаруу: Олег Ермаков — Башкы директор",
      legal: "Юридикалык маалымат: жеке ишкана Ермаков О.",
      markerLabel: "Steel Drake Studio Team",
      addressFooter: "IT - Hub Technopark, Бишкек",
    },
    projectDetail: {
      challengeHeading: "Тапшырма жана чакырык",
      resultsHeading: "Натыйжалар",
      labels: {
        client: "Клиент",
        year: "Жыл",
        service: "Кызмат",
      },
      projects: {
        sandyq: {
          name: "Sandyq",
          desc: "Националдуу конок жай бренди үчүн толук ребрендинг жана архитектуралык концепция.",
          client: "Sandyq Group",
          year: "2024",
          service: "Брендинг, Архитектура",
          challenge: "Шаар мейкиндигинде да, эс алуу зонасында да бирдей жакшы иштеген аутентификациялык, бирок заманбап образ түзүү.",
          processImages: [
            "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600",
          ],
          results: ["Эл аралык базарга чыгуу", "Аудиториянын катышуусу 40% жогорулады"],
        },
      },
      defaultProject: {
        name: "Долбоор",
        desc: "Долбоордун сүрөттөлүшү.",
        client: "Белгисиз",
        year: "2025",
        service: "Дизайн",
        challenge: "Классикалык көйгөйгө инновациялык ыкма түзүү.",
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600"],
        results: ["Үстүк чыгуу"],
      },
    },
    productDetail: {
      challengeHeading: "Тапшырма жана чакырык",
      resultsHeading: "Натыйжалар",
      labels: {
        client: "Клиент",
        year: "Жыл",
        service: "Кызмат",
      },
      products: {
        chyraq: {
          name: "Chyraq",
          desc: "Инновациялык минималисттик стол чырагы сенсордук башкаруу жана жез негизи менен.",
          client: "Chyraq Labs",
          year: "2026",
          service: "Индустриальный дизайн",
          challenge: "Өчүрүлүп турганда да көркөм чыгарма катары кызмат кылган премиум сенсордук стол лампасын долбоорлоо.",
          processImages: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600"
          ],
          results: ["Interior Design Show 2026 жеңүүчүсү"]
        }
      },
      defaultProduct: {
        name: "Продукт",
        desc: "Продукттун сүрөттөлүшү.",
        client: "Белгисиз",
        year: "2026",
        service: "Өнөр жай дизайны",
        challenge: "Премиум физикалык продукт концептисин түзүү.",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600"],
        results: ["Ийгиликтүү баштоо"],
      },
    },
  },
  ru: {
    nav: {
      home: "Главная",
      about: "О студии",
      services: "Услуги",
      projects: "Проекты",
      products: "Продукты",
      contacts: "Контакты",
    },
    home: {
      heroTag: "Все что вы видите является одним из первичных звеньев того, как мы воспринимаем наш физический мир, Такова моя философия",
      heroDescription: "Все что вы видите является одним из первичных звеньев того, как мы воспринимаем наш физический мир, именно поэтому философия студии это Дизайн в первую очередь",
      viewProjects: "Смотреть проекты",
      statsYears: "15+",
      statsLabel: "Настоящего опыта в независимой сфере с 2011 года создаем бренды и направления",
      globalLabel: "Проекты для рынков Центральной Азии, Европы и digital-first команд.",
      principleLabel: "Who you\ngonna call?",
      studioLabel: "Форма будущего должна казаться неизбежной.",
      servicesTitle: "Услуги",
      servicesHint: "наведение / раскрытие",
      selectedWorkTitle: "Избранные проекты",
      featuredProjectsTitle: "Новый и недавний проект",
      newProject: {
        label: "Новый проект",
        title: "Shovels & Steel",
        description: "Новый индустриальный концепт для современного рабочего пространства с тактильными материалами и чистой структурой.",
        publishedLabel: "Опубликовано",
        date: "11 июня 2026",
        time: "14:20",
        action: "Посмотреть",
      },
      recentProject: {
        label: "Недавний проект",
        title: "Oasis Studio",
        description: "Недавняя цифровая идентика и продуктовый дизайн для премиального архитектурного бренда.",
        publishedLabel: "Опубликовано",
        date: "4 июня 2026",
        time: "10:45",
        action: "Посмотреть",
      },
      services: [
        ["01", "Brand", "Айдентика, motion-система, визуальный язык и запуск продукта.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/brand.png"],
        ["03", "Industrial Design", "Разработка эстетичных, функциональных и технологичных физических объектов для серийного производства.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/industrial.png"],
        ["09", "Marketing", "Стратегическое продвижение продуктов и брендов в цифровой среде.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/marketing.png"],
        ["06", "Concept Design", "Создание футуристических и смелых концептов для кино, игр, презентаций и R&D-исследований.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/concept.png"],
      ],
      projects: [
        { title: "Sandyq", tag: "Hospitality / Identity" },
        { title: "Ala-Too", tag: "Strategy / Web" },
        { title: "Ordo X", tag: "Architecture / 3D" },
        { title: "Salkyn", tag: "Индустриальный дизайн" },
        { title: "TechStart", tag: "Брендирование / SaaS" },
        { title: "Auto Concept X", tag: "Automotive / R&D" },
      ],
      brands: [
        { logoUrl: "", tag: "Айдентика и Пространство" },
        { logoUrl: "", tag: "Веб и Платформы" },
        { logoUrl: "", tag: "Архитектура и 3D" },
        { logoUrl: "", tag: "Промышленный дизайн" },
        { logoUrl: "", tag: "Брендинг и SaaS" },
        { logoUrl: "", tag: "Продукт и Свет" }
      ],
    },
    about: {
      whoWeAre: "Кто мы",
      ourStoryTitle: "Наша история",
      manifestoHeading: "Основано на страсти к форме.",
      manifestoText: "Steel Drake Studio была основана в 2011 году дизайнером и визионером Олегом Ермаковым. Начав как концепт-студия прогрессивного дизайна, мы выросли в международное бюро, способное решать задачи любого масштаба — от айдентики технологического стартапа до проектирования футуристичного транспорта и архитектурных ансамблей. Наша история — это непрерывный поиск гармонии между функциональностью и чистой эмоцией.",
      philosophyTitle: "Наш манифест",
      philosophyText: "Мы верим, что дизайн — это не просто оформление поверхности. Это язык, на котором продукт разговаривает с пользователем. Мы убираем всё лишнее, чтобы обнажить суть вещей. Наша философия строится на трех столпах: бескомпромиссная эргономика, технологическая эстетика и долговечность смыслов. Мы не следуем трендам — мы проектируем будущее, которое останется актуальным через десятилетия.",
      teamTitle: "Команда",
      teamIntro: "Команда стратегов, дизайнеров, разработчиков и авторов решений, объединенных любознательностью и мастерством. Мы создаем цифровой опыт — элегантный, функциональный и незабываемый.",
      team: teamTranslations.ru,
      timeline: [
        { year: "2011", title: "Основание", text: "Мы начали с простой идеи: объединить стратегию, креативность и технологии для создания значимого дизайна.", img: "/about/story_1.png" },
        { year: "2012 - 2015", title: "Истоки концепт-студии", text: "Наши ранние проекты сформировали наш подход — концепции, основанные на исследованиях, элегантные решения и внимание к деталям.", img: "/about/story_2.png" },
        { year: "2016 - 2019", title: "Международный рост", text: "Расширяя команду и экспертность, мы начали работать за пределами границ и отраслей, решая более масштабные задачи.", img: "/about/story_3.png" },
        { year: "2020 - Сегодня", title: "Мультидисциплинарное бюро сегодня", text: "Сегодня мы являемся дизайн-бюро полного цикла, создающим эффективные решения в цифровой, мобильной и пространственной сферах.", img: "/about/story_4.png" }
      ],
      awardsTitle: "Признание и награды",
      awardsSub: "Наши достижения в области дизайна и проектирования.",
      awardsList: [
        { year: "2011", title: "Первый Red Jolbor Fest Кыргызстан", project: "1 статуэтка из 6", details: "Арт дирекшн брендового журнала для аэропорт Манас" },
        { year: "2008", title: "Серебряный призер чемпионата по дизайну", project: "Кыргызстан", details: "Национальный чемпионат по дизайну" },
        { year: "2014", title: "Самый популярный концепт смартфона в мире - iphone ©Google", project: "Этот проект не просто висел на Behance. О нем написали практически все крупные профильные и лайфстайл издания:\n\nForbes, Business Insider и CNET опубликовали подборки рендеров, называя их «самым красивым взглядом в будущее».\n\nВ российском сегменте (так как дизайнер из Киргизии) концепт обсуждали на тJournal, iPhones.ru и Hi-Tech Mail.ru.\n\nВидео с этим концептом на YouTube набирали сотни тысяч просмотров, причем многие пользователи в комментариях всерьез спрашивали: «Это настоящий iPhone 8?».", details: "Вердикт: Если мерить лайками в мировом масштабе — он входит в Топ-10 лучших за все время. Если мерить реальным результатом (продажа прав, карьера автора) — это, возможно, №1 в истории. Большинству других авторов достались только лайки на Behance." },
        { year: "2011–2015", title: "Глобальный вирусный охват", project: "В период пика публикаций концепты автора суммарно набрали миллионы просмотров на ведущих мировых дизайн- и техно-платформах, включая Yanko Design, Trendland, Delood, Motoring Exposure и Trend Hunter.", details: "Работы Steel Drake регулярно возглавляли топы просмотров и обсуждались в профильных печатных и онлайн-изданиях по всему миру. ©Google" }
      ],
      valuesTitle: "Наши принципы",
      valuesSub: "Фундамент\nфилософии",
      valuesList: [
        { num: "01", title: "Первое\nвосприятие", desc: "То о чем говорится в нашем утверждении, первое что происходит это то что вы видите." },
        { num: "02", title: "Чувства", desc: "После первого взгляда вы начинаете испытывать определенные чувства, вам это нравится или нет, хочется рассмотреть или уже начинаете примерять это." },
        { num: "03", title: "Эмоции", desc: "Если результат не приносит\nэмоции значит что то не так,\nЭто как если вы закрываете свою машину и не повернулись посмотреть на нее перед уходом, значит у вас не та машина" }
      ],
      mapTitle: "География проектов",
      mapSub: "Работаем со всем миром",
      mapCities: "Кроме Антарктиды, и северного полюса, не очень переносим холод.\nНа сегодня список стран наших клиентов:\nКыргызстан. США Майами, Вашингтон, Брюссель, Казахстан, Великобритания, Канада, \nКитай, Таджикистан, Узбекистан, Украина, Германия, Франция."
    },
    services: {
      title: "Услуги",
      stepsTitle: "Этапы работы",
      items: [
        {
          id: "01",
          title: "Брендирование",
          desc: "Создание уникального ДНК бренда: от позиционирования и нейминга до визуальной экосистемы и гайдлайнов.",
          steps: [
            "Исследование рынка и аудит конкурентов.",
            "Разработка платформы бренда и концепций визуальной идентификации.",
            "Создание брендбука и поддержка при внедрении.",
          ],
        },
        {
          id: "03",
          title: "Индустриальный дизайн",
          desc: "Разработка эстетичных, функциональных и технологичных физических объектов для серийного производства.",
          steps: [
            "Эскизирование, эргономический анализ и поиск формы.",
            "Трехмерное моделирование (CAD) с учетом производственных ограничений.",
            "Создание прототипов и доработка деталей.",
          ],
        },
        {
          id: "09",
          title: "Маркетинг",
          desc: "Стратегическое продвижение продуктов и брендов в цифровой среде, вывод новых решений на рынок.",
          steps: [
            "Разработка маркетинговой стратегии и определение каналов коммуникации.",
            "Создание рекламных креативов и запуск кампаний.",
            "Аналитика эффективности и оптимизация показателей (ROI, CPA).",
          ],
        },
        {
          id: "06",
          title: "Концепт-дизайн",
          desc: "Создание футуристических и смелых концептов для кино, игр, презентаций и долгосрочных R&D-исследований.",
          steps: [
            "Погружение в сеттинг, сбор референсов и генерация идей.",
            "Создание выразительных концепт-артов и быстрых 3D-болванок.",
            "Финальный рендеринг и презентация концепта.",
          ],
        },
        {
          id: "02",
          title: "Графический дизайн",
          desc: "Проектирование коммуникационных материалов, полиграфии, упаковки и цифровых графических интерфейсов.",
          steps: [
            "Анализ носителей и определение стилистического вектора.",
            "Проектирование макетов и подбор шрифтовых пар.",
            "Подготовка файлов к производству и авторский надзор.",
          ],
        },
        {
          id: "04",
          title: "Автомобильный дизайн",
          desc: "Проектирование экстерьеров и интерьеров транспортных средств — от концепт-каров до коммерческого транспорта.",
          steps: [
            "Пропорциональный поиск и компоновка (Package design).",
            "Скетчинг и создание высокополигональных 3D-моделей (Class-A surfaces).",
            "Визуализация в реалистичном окружении и подготовка к инженерной проработке.",
          ],
        },
        {
          id: "05",
          title: "Архитектурный дизайн",
          desc: "Разработка концептуальных архитектурных решений, частных вилл, общественных пространств и малых форм.",
          steps: [
            "Анализ контекста участка и разработка объемно-пространственной схемы.",
            "Фасадные решения, планировки и подбор ключевых материалов.",
            "Фотореалистичная 3D-визуализация объекта в ландшафте.",
          ],
        },
        {
          id: "07",
          title: "Продукт-дизайн",
          desc: "Комплексное проектирование цифровых (UI/UX) продуктов: мобильных приложений, веб-сервисов и интерфейсов сложных систем.",
          steps: [
            "Проектирование пользовательских сценариев (UX) и создание интерактивной структуры.",
            "Отрисовка визуального интерфейса (UI) и анимация переходов.",
            "Тестирование кликабельного прототипа и передача разработчикам.",
          ],
        },
        {
          id: "08",
          title: "Моушн-дизайн",
          desc: "Создание динамической графики, промо-роликов продуктов, презентационных видео и анимации интерфейсов.",
          steps: [
            "Написание сценария и создание раскадровки (Storyboard).",
            "Анимация элементов, симуляция физики и настройка материалов.",
            "Финальный монтаж, цветокоррекция и саунд-дизайн.",
          ],
        },
        {
          id: "10",
          title: "Музыка и композиторство",
          desc: "Создание уникального аудиооформления, саундтреков, аудиологотипов и звуковых эффектов для видео и инсталляций.",
          steps: [
            "Обсуждение настроения, темпа и эмоционального посыла проекта.",
            "Написание музыкальной темы, аранжировка и запись инструментов.",
            "Сведение, мастеринг и интеграция звуковых дорожек.",
          ],
        },
        {
          id: "11",
          title: "Web Developing / Design",
          desc: "Создание проработанных цифровых продуктов с полным подходом к UX, UI и front-end производительности.",
          steps: [
            "Проектирование адаптивных интерфейсов и интерактивных пользовательских путей.",
            "Разработка фронтенда с точностью до пикселя на современных web-инструментах.",
            "Тестирование, оптимизация и деплой готового решения.",
          ],
        },
        {
          id: "12",
          title: "UI UX дизайн",
          desc: "Создание продуманных интерфейсных систем и пользовательских опытов для цифровых продуктов.",
          steps: [
            "Исследование потребностей пользователей и определение путей взаимодействия.",
            "Итерация интерфейсных концептов с чёткой визуальной иерархией.",
            "Подготовка UI-китов и экранов, готовых к использованию.",
          ],
        },
      ],
    },
    projects: {
      title: "Проекты",
      items: [
        { id: "sandyq", name: "Sandyq", category: "Брендинг & Архитектура", categoryKey: "branding", img: "image.png" },
        { id: "ala-too", name: "Ala-Too", category: "Продукт Дизайн", categoryKey: "web", img: "image_2026-06-09_10-31-16.png" },
        { id: "salkyn", name: "Salkyn", category: "Индустриальный Дизайн", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600" },
        { id: "one-ordo", name: "One Ordo Resort", category: "Архитектура", categoryKey: "architectural", img: "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600" },
        { id: "techstart", name: "TechStart", category: "Брендирование", categoryKey: "branding", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600" },
        { id: "auto-concept-x", name: "Auto Concept X", category: "Automotive Design", categoryKey: "automotive", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600" },
      ],
    },
    products: {
      title: "Продукты студии",
      items: [
        { id: "chyraq", name: "Chyraq", category: "Индустриальный Дизайн", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600" }
      ],
    },
    projectCategories: {
      all: "Все",
      branding: "Брендирование",
      industrial: "Индустриальный дизайн",
      marketing: "Маркетинг",
      concept: "Концепт-дизайн",
      graphic: "Графический дизайн",
      automotive: "Automotive Design",
      architectural: "Архитектурный дизайн",
      product: "Продукт-дизайн",
      motion: "Моушн-дизайн",
      music: "Музыка и композиторство",
      web: "Web разработка / Дизайн",
      uiux: "UI UX дизайн"
    },
    contacts: {
      title: "Давайте обсудим будущее.",
      letsTalk: "Давайте обсудим",
      writeUs: "Написать нам",
      callUs: "Позвонить",
      officeTitle: "Адрес офиса",
      officeAddress: "Бишкек, Кыргызстан\nIT - Hub Technopark",
      leader: "Руководство: Олег Ермаков — Генеральный директор",
      legal: "Юридическая информация: ИП Ермаков О.",
      markerLabel: "Steel Drake Studio Team",
      addressFooter: "IT - Hub Technopark, Бишкек",
    },
    projectDetail: {
      challengeHeading: "Задача и Вызов",
      resultsHeading: "Результат",
      labels: {
        client: "Клиент",
        year: "Год",
        service: "Услуга",
      },
      projects: {
        sandyq: {
          name: "Sandyq",
          desc: "Комплексный ребрендинг и архитектурная концепция для национальной сети.",
          client: "Sandyq Group",
          year: "2024",
          service: "Брендинг, Архитектура",
          challenge: "Создать аутентичный, но современный образ, который будет одинаково хорошо работать как в городских пространствах, так и в рекреационных зонах.",
          processImages: [
            "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=1600",
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1600",
          ],
          results: ["Выход на международный рынок", "Увеличение вовлеченности аудитории на 40%"],
        },
      },
      defaultProject: {
        name: "Проект",
        desc: "Описание проекта.",
        client: "Неизвестно",
        year: "2025",
        service: "Разработка",
        challenge: "Сформировать инновационный подход к классической проблеме.",
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=1600"],
        results: ["Успешный запуск"],
      },
    },
    productDetail: {
      challengeHeading: "Задача и Вызов",
      resultsHeading: "Результат",
      labels: {
        client: "Клиент",
        year: "Год",
        service: "Услуга",
      },
      products: {
        chyraq: {
          name: "Chyraq",
          desc: "Инновационный минималистичный настольный светильник с сенсорным управлением и латунным основанием.",
          client: "Chyraq Labs",
          year: "2026",
          service: "Индустриальный дизайн",
          challenge: "Разработать премиальный настольный светильник с сенсорным управлением, выступающий в роли арт-объекта в выключенном состоянии.",
          processImages: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600"
          ],
          results: ["Победитель Interior Design Show 2026"]
        }
      },
      defaultProduct: {
        name: "Продукт",
        desc: "Описание продукта.",
        client: "Неизвестно",
        year: "2026",
        service: "Индустриальный дизайн",
        challenge: "Сформировать инновационный подход к созданию физического продукта.",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1600"],
        results: ["Успешный запуск"],
      },
    },
  },
} as const;

export type TranslationSet = typeof translations[typeof languageOptions[number]["code"]];

export const LanguageContext = createContext<{
  locale: Language;
  setLocale: Dispatch<SetStateAction<Language>>;
  t: TranslationSet;
}>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});
