export interface TeamMember {
  id: number;
  name: string;
  role: string;
  quote: string;
  skills: string[];
  projects: string;
  img: string;
}

export const teamTranslations: Record<string, TeamMember[]> = {
  en: [
    {
      id: 1,
      name: "Oleg Ermakov (Steel Drake)",
      role: "Art Director, Creative Director",
      quote: "Design is not just visual; it is the soul of functionality and leadership.",
      skills: ["Art Direction", "Creative Direction", "Industrial Design", "Concept Design"],
      projects: "Sandyq, Ala-Too, One Ordo",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      name: "Zulfiya Ermakova",
      role: "AI Specialist, Video Production, Concept & Interior Designer",
      quote: "Merging technological artificial intelligence with physical interior aesthetics.",
      skills: ["AI Specialist", "Video Production", "Concept Design", "Interior Design"],
      projects: "Oasis Studio, Sandyq",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      name: "Denis",
      role: "3D Specialist, Modeler, Motion & Graphic Designer",
      quote: "Transforming 3D geometry into digital motion art.",
      skills: ["3D Specialist", "Modeling", "Motion Design", "Graphic Design", "AI Specialist"],
      projects: "Auto Concept X, VR Space",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 4,
      name: "Tilek Isakdzhanov",
      role: "Senior Graphic Designer, AI Specialist",
      quote: "Layout and typography are structural languages of design.",
      skills: ["Senior Graphic Design", "AI Specialist", "Concept Design", "Layout", "Motion Design"],
      projects: "Salkyn, TechStart Branding",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 5,
      name: "Akimkhan Soltonkulov",
      role: "AI Specialist / Web Full-Stack Developer / Web & UI UX Designer, Graphic Design, AI Specialist, Concept Design, Layout",
      quote: "Bridging the gap between 3D graphics, user interfaces, and full-stack architecture.",
      skills: [
        "AI Specialist", "Web Full-Stack Development", "UI UX Design", "Graphic Design", "Concept Design", "Layout"
      ],
      projects: "Ala-Too Web Platform, Steel Drake Digital",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 6,
      name: "Nurlan Kumashev",
      role: "Web Full-Stack Developer",
      quote: "Writing clean code to power complex web interactions.",
      skills: ["Web Full-Stack Development", "API Integration", "Database Design", "Performance Optimization"],
      projects: "Ala-Too Platform backend, API Gateways",
      img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 7,
      name: "Kunduz Amanbaeva",
      role: "Graphic Designer, AI Specialist",
      quote: "Bringing creative visual layouts and concepts to life.",
      skills: ["Graphic Design", "AI Specialist", "Concept Design", "Layout"],
      projects: "Sandyq Identity, Brand Guidelines",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 8,
      name: "Daria Kalinkina",
      role: "Graphic Designer, AI Specialist",
      quote: "Structuring graphics and visual layouts with clarity and style.",
      skills: ["Graphic Design", "AI Specialist", "Concept Design", "Layout"],
      projects: "Oasis Studio Identity, Digital Assets",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 9,
      name: "Edelweiss",
      role: "Operations Manager, Graphic Designer",
      quote: "Organizing operations and ensuring visual consistency.",
      skills: ["Operations Management", "Graphic Design", "Project Coordination"],
      projects: "Studio Operations, Event Assets",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 10,
      name: "Mikhail Tuktarov",
      role: "Hardware & Firmware Engineer",
      quote: "Designing schematic solutions and physical enclosures from concept to board.",
      skills: [
        "Schematic Design", "PCB Design & Layout", "Device Enclosure Design", 
        "Programming", "Debugging", "Hardware Engineering"
      ],
      projects: "IoT Device Enclosures, HVAC Controllers",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
    }
  ],
  kg: [
    {
      id: 1,
      name: "Олег Ермаков (Steel Drake)",
      role: "Арт-директор, көркөм жетекчи",
      quote: "Дизайн жөн гана визуалдык эмес; бул функциянын жана лидерликтин жаны.",
      skills: ["Арт-дирекшн", "Көркөм жетекчилик", "Өнөр жай дизайны", "Концепт дизайн"],
      projects: "Sandyq, Ala-Too, One Ordo",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      name: "Зульфия Ермакова",
      role: "ИИ адиси, Видео продакшн, Концепт & Интерьер дизайнери",
      quote: "Технологиялык жасалма интеллектти физикалык интерьер эстетикасы менен айкалыштыруу.",
      skills: ["ИИ адиси", "Видео продакшн", "Концепт дизайн", "Интерьер дизайны"],
      projects: "Oasis Studio, Sandyq",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      name: "Денис",
      role: "3D адиси, Модельер, Моушн & Графикалык дизайнер",
      quote: "3D геометрияны санариптик кыймыл искусствосуна айландыруу.",
      skills: ["3D адиси", "Моделдөө", "Моушн дизайн", "Графикалык дизайн", "ИИ адиси"],
      projects: "Auto Concept X, VR Space",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 4,
      name: "Тилек Исакджанов",
      role: "Улуу графикалык дизайнер, ИИ адиси",
      quote: "Макет жана типография — дизайндын структуралык тили.",
      skills: ["Графикалык дизайн", "ИИ адиси", "Концепт дизайн", "Верстка", "Моушн дизайн"],
      projects: "Salkyn, TechStart Branding",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 5,
      name: "Акимхан Солтонкулов",
      role: "ИИ адиси / Web Full-Stack иштеп чыгуучу / Web & UI UX дизайнери, Графикалык дизайн, ИИ адиси, Концепт дизайн, Верстка",
      quote: "3D графика, колдонуучу интерфейси жана full-stack архитектурасынын ортосундагы көпүрө.",
      skills: [
        "ИИ адиси", "Web Full-Stack иштеп чыгуу", "UI UX дизайн", "Графикалык дизайн", "Концепт дизайн", "Верстка"
      ],
      projects: "Ala-Too Web Platform, Steel Drake Digital",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 6,
      name: "Нурлан Кумашев",
      role: "Web Full-Stack иштеп чыгуучу",
      quote: "Татаал веб-өз ара аракеттенишүүлөрдү иштетүү үчүн таза код жазуу.",
      skills: ["Web Full-Stack иштеп чыгуу", "API интеграциясы", "Маалыматтар базасы", "Оптималдаштыруу"],
      projects: "Ala-Too Platform backend, API Gateways",
      img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 7,
      name: "Кундуз Аманбаева",
      role: "Графикалык дизайнер, ИИ адиси",
      quote: "Чыгармачыл визуалдык макеттерди жана концепцияларды жандандыруу.",
      skills: ["Графикалык дизайн", "ИИ адиси", "Концепт дизайн", "Верстка"],
      projects: "Sandyq Identity, Brand Guidelines",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 8,
      name: "Дарья Калинкина",
      role: "Графикалык дизайнер, ИИ адиси",
      quote: "Графиканы жана визуалдык макеттерди тактык жана стил менен түзүү.",
      skills: ["Графикалык дизайн", "ИИ адиси", "Концепт дизайн", "Верстка"],
      projects: "Oasis Studio Identity, Digital Assets",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 9,
      name: "Эдельвейс",
      role: "Операциондук менеджер, графикалык дизайнер",
      quote: "Операцияларды уюштуруу жана визуалдык ырааттуулукту камсыздоо.",
      skills: ["Операциялык башкаруу", "Графикалык дизайн", "Долбоорлорду координациялоо"],
      projects: "Studio Operations, Event Assets",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 10,
      name: "Михаил Туктаров",
      role: "Аппараттык жана программалык камсыздоо инженери",
      quote: "Схемалык чечимдерди жана физикалык корпустарды долбоорлоо.",
      skills: [
        "Схемалык долбоорлоо", "PCB долбоорлоо жана макет", "Аппараттык корпустарды долбоорлоо", 
        "Программалоо", "Мүчүлүштүктөрдү издөө", "Аппараттык инженерия"
      ],
      projects: "IoT Device Enclosures, HVAC Controllers",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
    }
  ],
  ru: [
    {
      id: 1,
      name: "Олег Ермаков (Steel Drake)",
      role: "Арт-директор, художественный руководитель",
      quote: "Дизайн — это не просто визуальный ряд; это душа функциональности и лидерство.",
      skills: ["Арт-дирекшн", "Художественное руководство", "Индустриальный дизайн", "Концепт-дизайн"],
      projects: "Sandyq, Ala-Too, One Ordo",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      name: "Зульфия Ермакова",
      role: "ИИ специалист, Видео продакшн, Концепт дизайнер, Дизайнер интерьеров",
      quote: "Сочетание технологичного искусственного интеллекта и эстетики физических интерьеров.",
      skills: ["ИИ специалист", "Видео продакшн", "Концепт дизайнер", "Дизайнер интерьеров"],
      projects: "Oasis Studio, Sandyq",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      name: "Денис",
      role: "3D Специалист, Моделирование, Моушн дизайн, Графический дизайн, ИИ специалист",
      quote: "Превращение трехмерной геометрии в цифровое искусство в движении.",
      skills: ["3D Специалист", "Моделирование", "Моушн дизайн", "Графический дизайн", "ИИ специалист"],
      projects: "Auto Concept X, VR Space",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 4,
      name: "Тилек Исакджанов",
      role: "Старший графический дизайнер, ИИ специалист, Концепт дизайнер, Верстка, Моушн дизайн",
      quote: "Верстка и типографика — это структурные языки дизайна.",
      skills: ["Старший графический дизайнер", "ИИ специалист", "Концепт дизайнер", "Верстка", "Моушн дизайн"],
      projects: "Salkyn, TechStart Branding",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 5,
      name: "Акимхан Солтонкулов",
      role: "ИИ специалист / Web-fullstack разработчик / Web & UI UX дизайнер, Графический дизайн, ИИ специалист, Концепт дизайнер, Верстка",
      quote: "Связующее звено между 3D-графикой, пользовательскими интерфейсами и full-stack архитектурой.",
      skills: [
        "ИИ специалист", "Web-fullstack разработчик", "Web & UI UX дизайнер", "Графический дизайн", "Концепт дизайнер", "Верстка"
      ],
      projects: "Ala-Too Web Platform, Steel Drake Digital",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 6,
      name: "Нурлан Кумашев",
      role: "Web-fullstack разработчик",
      quote: "Написание чистого кода для обеспечения работы сложных веб-взаимодействий.",
      skills: ["Web-fullstack разработчик", "Интеграция API", "Проектирование БД", "Оптимизация производительности"],
      projects: "Ala-Too Platform backend, API Gateways",
      img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 7,
      name: "Кундуз Аманбаева",
      role: "Графический дизайн, ИИ специалист, Концепт дизайнер, Верстка",
      quote: "Воплощение креативных визуальных макетов и концепций в жизнь.",
      skills: ["Графический дизайн", "ИИ специалист", "Концепт дизайнер", "Верстка"],
      projects: "Sandyq Identity, Brand Guidelines",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 8,
      name: "Дарья Калинкина",
      role: "Графический дизайн, ИИ специалист, Концепт дизайнер, Верстка",
      quote: "Структурирование графики и визуальных макетов с ясностью и стилем.",
      skills: ["Графический дизайн", "ИИ специалист", "Концепт дизайнер", "Верстка"],
      projects: "Oasis Studio Identity, Digital Assets",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 9,
      name: "Эдельвейс",
      role: "Менеджер операционист, графический дизайнер",
      quote: "Организация операционных процессов студии и поддержание визуального соответствия.",
      skills: ["Операционный менеджмент", "Графический дизайн", "Координация проектов"],
      projects: "Studio Operations, Event Assets",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 10,
      name: "Михаил Туктаров",
      role: "Проектирование схемотехнических решений, проектирование печатных плат, проектирование корпусов приборов, программирование, отладка",
      quote: "Создание комплексных аппаратных решений от схемы до готового устройства в корпусе.",
      skills: [
        "Проектирование схемотехнических решений", "Проектирование печатных плат", 
        "Проектирование корпусов приборов", "Программирование", "Отладка", "Аппаратная инженерия"
      ],
      projects: "IoT Device Enclosures, HVAC Controllers",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
    }
  ]
};
