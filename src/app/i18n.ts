import { createContext, Dispatch, SetStateAction } from "react";
import { teamTranslations } from "./teamData";

export type Language = "en" | "kg" | "ru" | "zh" | "ar" | "de";

export const languageOptions: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "kg", label: "KG" },
  { code: "ru", label: "RU" },
  { code: "zh", label: "ZH" },
  { code: "ar", label: "AR" },
  { code: "de", label: "DE" },
];

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      projects: "Projects",
      products: "Products",
      webUiUx: "WEB / UI UX",
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
        ["13", "Game Dev", "Developing 3D worlds, game environments, mechanics, and interactive game art.", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600"],
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
          id: "13",
          title: "Game Dev",
          desc: "Developing 3D worlds, game environments, mechanics, and interactive game art.",
          steps: [
            "Game design document & concept art creation.",
            "3D modeling, texturing & environment design.",
            "Engine setup, mechanics programming & optimization.",
          ],
        },
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
        {
            "id": "maminy-retsepty",
            "img": "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/maminy-retsepty/project-hero-1784560948544.webp",
            "name": "Мамины рецепты",
            "desc": "Мы заложили прямую идею в логотип и символ - открытая книга рецептов, которая к тому же напоминает еще и символ сердца (любви).",
            "category": "Брендинг",
            "createdAt": "2026-07-19T10:41:45.380Z",
            "categoryKey": "branding"
        },
        {
            "id": "tooko",
            "img": "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-hero-1784395034213.webp",
            "name": "Tooko",
            "desc": "Создали все самое необходимое и нужное для нового бренда от и до, который собирается зайти на рынок. Цвета и контрасты для сильного старта.",
            "category": "Брендинг",
            "createdAt": "2026-07-18T17:10:14.147Z",
            "categoryKey": "branding"
        },
        { id: "sandyq", name: "Sandyq", category: "Branding & Architecture", categoryKey: "branding", img: "image.png" },
        { id: "ala-too", name: "Ala-Too", category: "Product Design", categoryKey: "web", img: "image_2026-06-09_10-31-16.png" },
        { id: "salkyn", name: "Salkyn", category: "Industrial Design", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600" },
        { id: "one-ordo-resort", name: "One Ordo Resort", category: "Branding", categoryKey: "branding", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp" },
        { id: "one-ordo", name: "One Ordo Resort", category: "Branding", categoryKey: "branding", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp" },
        { id: "techstart", name: "TechStart", category: "Branding & Web", categoryKey: "branding", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" },
        { id: "auto-concept-x", name: "Auto Concept X", category: "Automotive Design", categoryKey: "automotive", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600" },
      ],
    },
    webUiUx: {
      title: "WEB / UI UX",
      items: [],
    },
    concepts: {
      title: "Concepts & Vision",
      items: [
        { id: "evodrone", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785433766519.webp", name: "Evodrone", category: "Industrial design", categoryKey: "industrial" },
        { id: "iphone-iq-concept-2018", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785435568845.webp", name: "Iphone IQ concept 2018", category: "Industrial design", categoryKey: "industrial" },
        { id: "sony-zeus", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785056660421.webp", name: "SONY ZEUS", category: "Concept design", categoryKey: "concept" },
        { id: "ps5-concept-2018", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785657893376.webp", name: "PS5 concept 2018", category: "Industrial design", categoryKey: "industrial" },
        { id: "tesla-sd-concept", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp", name: "TESLA SD CONCEPT", category: "Industrial design", categoryKey: "industrial" },
        { id: "bishbench", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785532296450.webp", name: "Bishbench", category: "Industrial design", categoryKey: "industrial" }
      ],
    },
    architects: {
      title: "Architect Projects",
      items: [
        { id: "one-ordo-resort", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp", name: "One Ordo Resort", category: "Architectural Design", categoryKey: "architectural", desc: "Conceptual architectural ensemble and premium resort complex." },
        { id: "villa-horizon", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", name: "Villa Horizon", category: "Architectural Design", categoryKey: "architectural", desc: "Futuristic residential villa concept with panoramic glazing and natural integration." }
      ],
    },
    gamedev: {
      title: "GameDev",
      items: [],
    },
    products: {
      title: "Studio Products",
      items: [
        { id: "chyraq", name: "Chyraq", category: "Industrial Design", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600" }
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
            "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=600",
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
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600"],
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
        studio: "Studio",
        designer: "Designer",
        location: "Location",
        projectType: "Project Type",
        project: "Project",
        class: "Class",
      },
      products: {
        chyraq: {
          name: "Chyraq",
          desc: "A smart minimal light fixture with touch controls and sustainable brass base.",
          client: "Chyraq Labs",
          year: "2026",
          service: "Industrial Design",
          studio: "-",
          designer: "-",
          location: "Bishkek, Kyrgyzstan",
          projectType: "Industrial Design Concept",
          class: "A",
          challenge: "Design a premium, tactile desk lamp that acts as an art piece while off.",
          processImages: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"
          ],
          results: ["Winner of Interior Design Show 2026"]
        },
        evodrone: {
          name: "Evodrone",
          desc: "Во главе стояла идея изменить привычные пульты управления дронами на одноручный, в котором будет учтено множество функций упрощяющих управление, наподобии рычага управления самолетом.",
          year: "2016",
          class: "-",
          client: "Personal concept",
          studio: "Steel Drake Studio team",
          service: "concept design",
          designer: "Steel Drake",
          location: "Bishkek, Kyrgyzstan",
          challenge: "Идея создать удобный контроллер управление дроном - однйо рукой.",
          projectType: "concept",
          collageTheme: "light",
          collageBlocks: [
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-0-0-1785433999273.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-1-0-1785434006514.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-2-0-1785434010517.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-3-0-1785434017539.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-4-0-1785434020971.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-5-0-1785434037206.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-6-0-1785434066130.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-7-0-1785434080022.webp"]
          ],
          processImages: [
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-0-0-1785433999273.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-1-0-1785434006514.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-2-0-1785434010517.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-3-0-1785434017539.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-4-0-1785434020971.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-5-0-1785434037206.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-6-0-1785434066130.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-7-0-1785434080022.webp"
          ],
          results: []
        },
        "ps5-concept-2018": {
          name: "PS5 concept 2018",
          desc: "This concept was made in 2018 and it is still popular, many publics still publish it under name ps6 concept.",
          year: "2018",
          class: "-",
          client: "Personal concept",
          studio: "Steel Drake Studio Team",
          service: "Concept design",
          designer: "Steel Drake",
          location: "Bishkek, Kyrgyzstan",
          challenge: "A Desire to show another way of exterior device design for Sony",
          projectType: "personal concept",
          collageTheme: "light",
          collageBlocks: [
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-0-0-1785662333489.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-0-0-1785657849508.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-1-0-1785658032364.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-2-0-1785658044819.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-3-0-1785658049212.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-4-0-1785658052737.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-5-0-1785658057347.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-6-0-1785658061557.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-7-0-1785658065498.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-8-0-1785658069512.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-9-0-1785658073187.webp"],
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-12-0-1785662348161.webp"]
          ],
          processImages: [
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-0-0-1785662333489.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-0-0-1785657849508.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-1-0-1785658032364.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-2-0-1785658044819.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-3-0-1785658049212.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-4-0-1785658052737.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-5-0-1785658057347.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-6-0-1785658061557.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-7-0-1785658065498.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-8-0-1785658069512.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-9-0-1785658073187.webp",
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-block-12-0-1785662348161.webp"
          ],
          results: ["published on many publics worldwide"]
        },
        "iphone-iq-concept-2018": {
          name: "Iphone IQ concept 2018",
          desc: "Концептуальное видение флагманского смартфона Apple с усовершенствованной эргономикой и бесшовным корпусом.",
          year: "2018",
          class: "-",
          client: "Personal concept",
          studio: "Steel Drake Studio team",
          service: "Industrial design",
          designer: "Steel Drake",
          location: "Bishkek, Kyrgyzstan",
          challenge: "Переосмысление визуальной эстетики линейки iPhone.",
          projectType: "Concept",
          collageTheme: "light",
          collageBlocks: [
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785435568845.webp"]
          ],
          processImages: [
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785435568845.webp"
          ],
          results: []
        },
        "sony-zeus": {
          name: "SONY ZEUS",
          desc: "Концепт премиальной техники SONY с акцентом на монолитную архитектуру и современный промышленный язык форм.",
          year: "2018",
          class: "-",
          client: "Personal concept",
          studio: "Steel Drake Studio team",
          service: "Concept design",
          designer: "Steel Drake",
          location: "Bishkek, Kyrgyzstan",
          challenge: "Создание флагманского языка дизайна для устройств Sony.",
          projectType: "Concept",
          collageTheme: "dark",
          collageBlocks: [
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785056660421.webp"]
          ],
          processImages: [
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785056660421.webp"
          ],
          results: []
        },
        "tesla-sd-concept": {
          name: "TESLA SD CONCEPT",
          desc: "Концептуальный дизайн премиального электрического транспортного средства со специфической аэродинамикой.",
          year: "2019",
          class: "-",
          client: "Personal concept",
          studio: "Steel Drake Studio team",
          service: "Industrial design",
          designer: "Steel Drake",
          location: "Bishkek, Kyrgyzstan",
          challenge: "Аэродинамический дизайн и спортивные пропорции электромобиля.",
          projectType: "Concept",
          collageTheme: "dark",
          collageBlocks: [
            ["https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp"]
          ],
          processImages: [
            "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp"
          ],
          results: []
        }
      },
      defaultProduct: {
        name: "Product",
        desc: "Product description.",
        client: "Unknown",
        year: "2026",
        service: "Industrial Design",
        studio: "-",
        designer: "-",
        location: "-",
        projectType: "Concept",
        class: "-",
        challenge: "Develop a premium physical product concept.",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"],
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
      webUiUx: "WEB / UI UX",
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
        ["13", "Game Dev", "3D-дүйнөлөрдү, оюн чөйрөлөрүн, механиканы жана интерактивдүү концепт-артты иштеп чыгуу.", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600"],
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
          id: "13",
          title: "Game Dev",
          desc: "3D-дүйнөлөрдү, оюн чөйрөлөрүн, механиканы жана интерактивдүү концепт-артты иштеп чыгуу.",
          steps: [
            "Геймдизайн документ жана концепт-арт түзүү.",
            "3D-моделдөө, текстуралоо жана деңгээл дизайны.",
            "Оюн кыймылдаткычында жөндөө, механиканы программалоо жана оптимизациялоо.",
          ],
        },
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
        {
            "id": "maminy-retsepty",
            "img": "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/maminy-retsepty/project-hero-1784560948544.webp",
            "name": "Мамины рецепты",
            "category": "Брендинг",
            "createdAt": "2026-07-19T10:41:45.380Z",
            "categoryKey": "branding"
        },
        {
            "id": "tooko",
            "img": "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-hero-1784395034213.webp",
            "name": "Tooko",
            "category": "Брендинг",
            "createdAt": "2026-07-18T17:10:14.147Z",
            "categoryKey": "branding"
        },
        { id: "sandyq", name: "Sandyq", category: "Брендинг & Архитектура", categoryKey: "branding", img: "image.png" },
        { id: "ala-too", name: "Ala-Too", category: "Продукт дизайны", categoryKey: "web", img: "image_2026-06-09_10-31-16.png" },
        { id: "salkyn", name: "Salkyn", category: "Өнөр жай дизайны", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600" },
        { id: "one-ordo-resort", name: "One Ordo Resort", category: "Брендинг", categoryKey: "branding", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp" },
        { id: "one-ordo", name: "One Ordo Resort", category: "Брендинг", categoryKey: "branding", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp" },
        { id: "techstart", name: "TechStart", category: "Брендинг", categoryKey: "branding", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" },
        { id: "auto-concept-x", name: "Auto Concept X", category: "Автомобиль дизайны", categoryKey: "automotive", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600" },
      ],
    },
    webUiUx: {
      title: "WEB / UI UX",
      items: [],
    },
    concepts: {
      title: "Концепциялар жана көрүнүш",
      items: [
        { id: "evodrone", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785433766519.webp", name: "Evodrone", category: "Өнөр жай дизайны", categoryKey: "industrial" },
        { id: "iphone-iq-concept-2018", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785435568845.webp", name: "Iphone IQ concept 2018", category: "Өнөр жай дизайны", categoryKey: "industrial" },
        { id: "sony-zeus", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785056660421.webp", name: "SONY ZEUS", category: "Концепт-дизайн", categoryKey: "concept" },
        { id: "ps5-concept-2018", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785657893376.webp", name: "PS5 concept 2018", category: "Өнөр жай дизайны", categoryKey: "industrial" },
        { id: "tesla-sd-concept", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp", name: "TESLA SD CONCEPT", category: "Өнөр жай дизайны", categoryKey: "industrial" }
      ],
    },
    architects: {
      title: "Архитектуралык долбоорлор",
      items: [
        { id: "one-ordo-resort", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp", name: "One Ordo Resort", category: "Архитектуралык дизайн", categoryKey: "architectural", desc: "Концептуалдык архитектуралык ансамбль жана премиум-класстагы курорттук комплекс." },
        { id: "villa-horizon", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", name: "Villa Horizon", category: "Архитектуралык дизайн", categoryKey: "architectural", desc: "Панорамалык айнек жана ландшафтка интеграцияланган футуристтик турак жай вилла концепти." }
      ],
    },
    gamedev: {
      title: "GameDev",
      items: [],
    },
    products: {
      title: "Студиянын продукциялары",
      items: [
        { id: "chyraq", name: "Chyraq", category: "Өнөр жай дизайны", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600" }
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
            "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=600",
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
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600"],
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
        studio: "Студия",
        designer: "Дизайнер",
        location: "Жайгашкан жери",
        projectType: "Долбоордун түрү",
        project: "Долбоор",
        class: "Класс",
      },
      products: {
        chyraq: {
          name: "Chyraq",
          desc: "Инновациялык минималисттик стол чырагы сенсордук башкаруу жана жез негизи менен.",
          client: "Chyraq Labs",
          year: "2026",
          service: "Индустриальный дизайн",
          studio: "-",
          designer: "-",
          location: "Бишкек, Кыргызстан",
          projectType: "Өнөр жай дизайн концепциясы",
          class: "А",
          challenge: "Өчүрүлүп турганда да көркөм чыгарма катары кызмат кылган премиум сенсордук стол лампасын долбоорлоо.",
          processImages: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"
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
        studio: "-",
        designer: "-",
        location: "-",
        projectType: "Концепция",
        class: "-",
        challenge: "Премиум физикалык продукт концептисин түзүү.",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"],
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
      webUiUx: "WEB / UI UX",
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
        ["13", "Game Dev", "Разработка 3D-миров, игровых окружений, механик и интерактивного концепт-арта.", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600"],
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
          id: "13",
          title: "Game Dev",
          desc: "Разработка 3D-миров, игровых окружений, механик и интерактивного концепт-арта.",
          steps: [
            "Создание геймдизайн-документа и концепт-арта.",
            "3D-моделирование, текстурирование и дизайн уровней.",
            "Настройка в игровом движке, программирование механик и оптимизация.",
          ],
        },
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
        {
            "id": "maminy-retsepty",
            "img": "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/maminy-retsepty/project-hero-1784560948544.webp",
            "name": "Мамины рецепты",
            "category": "Брендинг",
            "createdAt": "2026-07-19T10:41:45.380Z",
            "categoryKey": "branding"
        },
        {
            "id": "tooko",
            "img": "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/projects/project-hero-1784395034213.webp",
            "name": "Tooko",
            "category": "Брендинг",
            "createdAt": "2026-07-18T17:10:14.147Z",
            "categoryKey": "branding"
        },
        { id: "sandyq", name: "Sandyq", category: "Брендинг & Архитектура", categoryKey: "branding", img: "image.png" },
        { id: "ala-too", name: "Ala-Too", category: "Продукт Дизайн", categoryKey: "web", img: "image_2026-06-09_10-31-16.png" },
        { id: "salkyn", name: "Salkyn", category: "Индустриальный Дизайн", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600" },
        { id: "one-ordo-resort", name: "One Ordo Resort", category: "Брендинг", categoryKey: "branding", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp" },
        { id: "one-ordo", name: "One Ordo Resort", category: "Брендинг", categoryKey: "branding", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp" },
        { id: "techstart", name: "TechStart", category: "Брендирование", categoryKey: "branding", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" },
        { id: "auto-concept-x", name: "Auto Concept X", category: "Automotive Design", categoryKey: "automotive", img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600" },
      ],
    },
    webUiUx: {
      title: "WEB / UI UX",
      items: [],
    },
    concepts: {
      title: "Концепты и видение",
      items: [
        { id: "evodrone", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785433766519.webp", name: "Evodrone", category: "Индустриальный дизайн", categoryKey: "industrial" },
        { id: "iphone-iq-concept-2018", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785435568845.webp", name: "Iphone IQ concept 2018", category: "Индустриальный дизайн", categoryKey: "industrial" },
        { id: "sony-zeus", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785056660421.webp", name: "SONY ZEUS", category: "Концептуальный дизайн", categoryKey: "concept" },
        { id: "ps5-concept-2018", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785657893376.webp", name: "PS5 concept 2018", category: "Индустриальный дизайн", categoryKey: "industrial" },
        { id: "tesla-sd-concept", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp", name: "TESLA SD CONCEPT", category: "Индустриальный дизайн", categoryKey: "industrial" }
      ],
    },
    architects: {
      title: "Архитектурные проекты",
      items: [
        { id: "one-ordo-resort", img: "https://hniqpnuqqsmqpolxgbav.supabase.co/storage/v1/object/public/assets/projects/project-hero-1784022970658.webp", name: "One Ordo Resort", category: "Архитектурный дизайн", categoryKey: "architectural", desc: "Концептуальный архитектурный ансамбль и курортный комплекс премиум-класса." },
        { id: "villa-horizon", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", name: "Villa Horizon", category: "Архитектурный дизайн", categoryKey: "architectural", desc: "Футуристический жилой комплекс с панорамным остеклением и интеграцией в ландшафт." }
      ],
    },
    gamedev: {
      title: "GameDev",
      items: [],
    },
    products: {
      title: "Продукты студии",
      items: [
        { id: "chyraq", name: "Chyraq", category: "Индустриальный Дизайн", categoryKey: "industrial", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600" }
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
            "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=600",
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
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600"],
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
        studio: "Студия",
        designer: "Дизайнер",
        location: "Локация",
        projectType: "Тип проекта",
        project: "Проект",
        class: "Класс",
      },
      products: {
        chyraq: {
          name: "Chyraq",
          desc: "Инновационный минималистичный настольный светильник с сенсорным управлением и латунным основанием.",
          client: "Chyraq Labs",
          year: "2026",
          service: "Индустриальный дизайн",
          studio: "-",
          designer: "-",
          location: "Бишкек, Кыргызстан",
          projectType: "Концепт Индустриального Дизайна",
          class: "А",
          challenge: "Разработать премиальный настольный светильник с сенсорным управлением, выступающий в роли арт-объекта в выключенном состоянии.",
          processImages: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"
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
        studio: "-",
        designer: "-",
        location: "-",
        projectType: "Концепт",
        class: "-",
        challenge: "Сформировать инновационный подход к созданию физического продукта.",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"],
        results: ["Успешный запуск"],
      },
    },
  },
  zh: {
    nav: {
      home: "首页",
      about: "关于我们",
      services: "服务项目",
      projects: "设计项目",
      products: "设计产品",
      webUiUx: "网页 / UI UX",
      contacts: "联系方式",
    },
    home: {
      heroTag: '(c) "你所看到的一切，都阻碍了我们感知物理世界的首要纽带。这就是我的哲学。"',
      heroDescription: "你所看到的一切，只是我们感知物理世界的首要纽带，这就是为什么工作室的哲学是设计第一。",
      viewProjects: "查看项目",
      statsYears: "15年+",
      statsLabel: "独立行业真实经验，自2011年起创立品牌与方向。",
      globalLabel: "面向中亚、欧洲及数字优先团队的项目。",
      principleLabel: "你需要联系谁？",
      studioLabel: "未来的形式应该让人感到是必然的。",
      servicesTitle: "服务项目",
      servicesHint: "悬停 / 展开",
      selectedWorkTitle: "精选作品",
      featuredProjectsTitle: "全新及近期作品",
      newProject: {
        label: "全新项目",
        title: "铁锹与钢",
        description: "现代化工作空间的全新工业概念，具有触觉材料和结构清晰度。",
        publishedLabel: "发布于",
        date: "2026年6月11日",
        time: "14:20",
        action: "查看",
      },
      recentProject: {
        label: "近期项目",
        title: "绿洲工作室",
        description: "为高端建筑品牌提供近期数字身份与产品设计。",
        publishedLabel: "发布于",
        date: "2026年6月4日",
        time: "10:45",
        action: "查看",
      },
      services: [
        ["01", "品牌设计", "身份标识、动态系统、视觉语言和产品发布。", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/brand.png"],
        ["03", "工业设计", "为批量生产开发美学、功能和技术兼备的实体产品。", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/industrial.png"],
        ["09", "数字营销", "在数字环境中进行战略性产品推广和发布活动。", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/marketing.png"],
        ["06", "概念设计", "为电影、游戏、演示和研发研究创建大胆的概念。", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/concept.png"],
        ["13", "游戏开发", "开发3D世界、游戏环境、机制和互动游戏艺术。", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600"],
      ],
      projects: [],
      brands: []
    },
    about: {
      whoWeAre: "我们是谁",
      ourStoryTitle: "我们的故事",
      manifestoHeading: "创立于对形式的热爱。",
      manifestoText: "Steel Drake Studio由设计师和远见家Oleg Ermakov于2011年创立。从一家前卫的概念工作室开始，我们已成长为一家能够解决任何规模任务的国际局——从科技初创公司的身份标识到未来主义交通工具和建筑群。我们的故事是一场在功能性与纯粹情感之间寻求和谐的持续探索。",
      philosophyTitle: "我们的宣言",
      philosophyText: "我们相信设计不仅仅是表面处理。它是产品与用户对话的语言。我们移除所有不必要的内容以展示本质。我们的哲学建立在三个支柱上：不妥协的人体工程学、技术美学和持久的意义。我们不追随趋势——我们设计数十年后依然适用的未来。",
      teamTitle: "团队成员",
      teamIntro: "由战略家、设计师、开发人员和问题解决者组成的集体，因好奇心和工艺凝聚在一起。我们创造优雅、实用且令人难忘的数字体验。",
      team: teamTranslations.en,
      timeline: [
        { year: "2011", title: "创立", text: "我们始于一个简单的想法：将战略、创意和技术融合在一起，创造有意义的设计。", img: "/about/story_1.png" },
        { year: "2012 - 2015", title: "概念工作室起源", text: "我们的早期项目塑造了我们的方法——研究驱动的概念、优雅的解决方案和对细节的关注。", img: "/about/story_2.png" },
        { year: "2016 - 2019", title: "国际化成长", text: "扩大我们的团队和专业知识，我们开始跨越国界和行业工作，迎接更大的挑战。", img: "/about/story_3.png" },
        { year: "2020 - 至今", title: "多学科设计局", text: "今天，我们是一家全周期设计局，在数字、出行和空间领域创造有影响力的解决方案。", img: "/about/story_4.png" }
      ],
      awardsTitle: "荣誉认可",
      awardsSub: "设计奖项与里程碑。",
      awardsList: [],
      valuesTitle: "核心原则",
      valuesSub: "哲学基础",
      valuesList: [
        { num: "01", title: "第一感知", desc: "正如我们所声明的，最先发生的是您视觉上感知到的事物。" },
        { num: "02", title: "感受体会", desc: "在第一眼之后，您开始产生某些感受：您是否喜欢它，是否想要研究它，或者已经开始尝试使用它。" },
        { num: "03", title: "情感共鸣", desc: "如果结果不能带来情感，那么肯定有哪里不对。就像锁上车门离开前如果不回头看一眼——如果是这样，那您就选错了车。" }
      ],
      mapTitle: "全球足迹",
      mapSub: "与全世界合作",
    },
    services: {
      title: "服务项目",
      description: "我们专注于物理与数字产品设计的交叉领域。从概念研发到全面品牌打造和数字开发，我们帮助团队构思、验证并启动具有持久影响力的计划。",
      categories: {
        branding: "品牌设计",
        industrial: "工业设计",
        marketing: "数字营销",
        concept: "概念设计",
        graphic: "平面设计",
        automotive: "汽车设计",
        architectural: "建筑设计",
        product: "产品设计",
        motion: "动态设计",
        music: "音乐与声音",
        web: "网页开发/设计",
        uiux: "UI UX 设计"
      }
    },
    projects: {
      title: "所有项目",
      items: []
    },
    products: {
      title: "产品展示",
      items: []
    },
    webUiUx: {
      title: "WEB / UI UX",
      items: []
    },
    gamedev: {
      title: "GameDev",
      items: []
    },
    concepts: {
      title: "Concepts & Vision",
      items: []
    },
    architects: {
      title: "Architect Projects",
      items: []
    },
    contacts: {
      title: "让我们讨论未来。",
      letsTalk: "开始讨论",
      writeUs: "写信给我们",
      callUs: "致电我们",
      officeTitle: "办公地址",
      officeAddress: "吉尔吉斯斯坦，比什凯克\nIT - Hub Technopark",
      leader: "负责人: Oleg Ermakov — 首席执行官",
      legal: "法律信息: IP Ermakov O.",
      markerLabel: "Steel Drake Studio Team",
      addressFooter: "吉尔吉斯斯坦比什凯克 IT-Hub Technopark",
      form: {
        name: "您的姓名",
        email: "您的邮箱",
        message: "告诉我们您的项目...",
        submit: "发送消息",
        success: "感谢！您的消息已成功发送。",
        error: "发送失败。请重试。",
        company: "公司名称（选填）",
        phone: "电话号码",
        service: "所需服务",
        budget: "预算范围",
        discussProject: "让我们讨论您的项目",
        backToHome: "返回首页"
      }
    },
    projectDetail: {
      challengeHeading: "任务与挑战",
      resultsHeading: "取得成果",
      labels: {
        client: "客户",
        year: "年份",
        service: "服务",
      },
      projects: {},
      defaultProject: {
        name: "项目",
        desc: "项目描述。",
        client: "未知",
        year: "2026",
        service: "开发设计",
        challenge: "为传统问题制定出创新的解决方案。",
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600"],
        results: ["成功启动"],
      },
    },
    productDetail: {
      challengeHeading: "任务与挑战",
      resultsHeading: "取得成果",
      labels: {
        client: "客户",
        year: "年份",
        service: "服务",
        studio: "工作室",
        designer: "设计师",
        location: "位置",
        projectType: "项目类型",
        project: "项目",
        class: "级别",
      },
      products: {},
      defaultProduct: {
        name: "产品",
        desc: "产品描述。",
        client: "未知",
        year: "2026",
        service: "工业设计",
        studio: "-",
        designer: "-",
        location: "-",
        projectType: "概念设计",
        class: "-",
        challenge: "形成创建物理产品的创新方法。",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"],
        results: ["成功发布"],
      },
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "الخدمات",
      projects: "المشاريع",
      products: "المنتجات",
      webUiUx: "الويب / UI UX",
      contacts: "اتصل بنا",
    },
    home: {
      heroTag: '(c) "كل ما تراه ليس سوى حلقة أولية في كيفية إدراكنا لعالمنا المادي. هذه هي فلسفتي."',
      heroDescription: "كل ما تراه ليس سوى حلقة أولية في كيفية إدراكنا لعالمنا المادي، ولهذا السبب فإن فلسفة الاستوديو هي التصميم أولاً.",
      viewProjects: "عرض المشاريع",
      statsYears: "+15",
      statsLabel: "خبرة حقيقية في الصناعة المستقلة، ننشئ العلامات التجارية والتوجهات منذ عام 2011.",
      globalLabel: "مشاريع لآسيا الوسطى وأوروبا والفرق الرقمية الأولى.",
      principleLabel: "بمن ستتصل؟",
      studioLabel: "يجب أن يبدو شكل المستقبل حتميًا.",
      servicesTitle: "الخدمات",
      servicesHint: "حرك المؤشر / وسّع",
      selectedWorkTitle: "أعمال مختارة",
      featuredProjectsTitle: "أعمال جديدة وحديثة",
      newProject: {
        label: "مشروع جديد",
        title: "المجارف والصلب",
        description: "مفهوم صناعي جديد لمساحة عمل حديثة مع مواد ملموسة ووضوح هيكلي.",
        publishedLabel: "نُشر في",
        date: "11 يونيو 2026",
        time: "14:20",
        action: "عرض",
      },
      recentProject: {
        label: "مشروع حديث",
        title: "استوديو الواحة",
        description: "تصميم هوية رقمية ومنتج حديث لعلامة تجارية معمارية متميزة.",
        publishedLabel: "نُشر في",
        date: "4 يونيو 2026",
        time: "10:45",
        action: "عرض",
      },
      services: [
        ["01", "العلامة التجارية", "الهوية، أنظمة الحركة، اللغة البصرية، وإطلاق المنتجات.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/brand.png"],
        ["03", "التصميم الصناعي", "تطوير منتجات مادية جمالية ووظيفية وتكنولوجية للإنتاج التسلسلي.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/industrial.png"],
        ["09", "التسويق الرقمي", "الترويج الاستراتيجي للمنتجات وحملات الإطلاق في البيئات الرقمية.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/marketing.png"],
        ["06", "تصميم المفاهيم", "إنشاء مفاهيم جريئة للأفلام والألعاب والعروض التقديمية والبحث والتطوير.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/concept.png"],
        ["13", "تطوير الألعاب", "تطوير عوالم ثلاثية الأبعاد وبيئات ألعاب وآليات وفنون تفاعلية للألعاب.", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600"],
      ],
      projects: [],
      brands: []
    },
    about: {
      whoWeAre: "من نحن",
      ourStoryTitle: "قصتنا",
      manifestoHeading: "تأسسنا على شغف بالشكل الهندسي.",
      manifestoText: "تأسس استوديو ستيل دريك في عام 2011 من قبل المصمم صاحب الرؤية أوليغ إرماكوف. بدأنا كاستوديو مفاهيم تقدمي، ونمونا إلى مكتب دولي قادر على حل المهام من أي حجم - من هوية الشركات الناشئة التكنولوجية إلى وسائل النقل المستقبلية والمجمعات المعمارية. قصتنا هي بحث مستمر عن الانسجام بين الوظيفة والعاطفة الصافية.",
      philosophyTitle: "بياننا",
      philosophyText: "نعتقد أن التصميم ليس مجرد معالجة سطحية. إنه لغة يتحدث بها المنتج مع مستخدمه. نزيل كل ما هو غير ضروري للكشف عن الجوهر. تُبنى فلسفتنا على ثلاث ركائز: الهندسة البشرية الصارمة، والجماليات التكنولوجية، والمعنى الدائم. نحن لا نتبع الصيحات - نحن نصمم مستقبلاً يظل وثيق الصلة لعقود.",
      teamTitle: "فريق العمل",
      teamIntro: "مجموعة من الاستراتيجيين والمصممين والمطورين وحلالي المشكلات يجمعهم الفضول والمهارة الحرفية. نحن نخلق تجارب رقمية أنيقة ووظيفية ولا تُنسى.",
      team: teamTranslations.en,
      timeline: [
        { year: "2011", title: "التأسيس", text: "بدأنا بفكرة بسيطة: الجمع بين الاستراتيجية والإبداع والتكنولوجيا لإنشاء تصميم ذي مغزى.", img: "/about/story_1.png" },
        { year: "2012 - 2015", title: "أصول استوديو المفاهيم", text: "شكلت مشاريعنا الأولى نهجنا - مفاهيم قائمة على البحث، وحلول أنيقة، واهتمام بالتفاصيل.", img: "/about/story_2.png" },
        { year: "2016 - 2019", title: "النمو الدولي", text: "بتوسيع فريقنا وخبراتنا، بدأنا العمل عبر الحدود والصناعات، لمواجهة تحديات أكبر.", img: "/about/story_3.png" },
        { year: "2020 - اليوم", title: "مكتب متعدد التخصصات اليوم", text: "اليوم، نحن مكتب تصميم متكامل الخدمات نخلق حلولاً مؤثرة في المجالات الرقمية والتنقل والمساحة.", img: "/about/story_4.png" }
      ],
      awardsTitle: "التقدير والجوائز",
      awardsSub: "تصميم الجوائز والمعالم البارزة.",
      awardsList: [],
      valuesTitle: "المبادئ الأساسية",
      valuesSub: "أساس الفلسفة",
      valuesList: [
        { num: "01", title: "الإدراك الأول", desc: "كما هو مذكور في بياننا، فإن أول ما يحدث هو ما تدركه بصريًا." },
        { num: "02", title: "المشاعر", desc: "بعد النظرة الأولى، تبدأ في تجربة مشاعر معينة: سواء أعجبك ذلك أم لا، أو تريد فحصه، أو بدأت بالفعل في تجربته." },
        { num: "03", title: "العواطف", desc: "إذا كانت النتيجة لا تجلب مشاعر، فهناك خطأ ما. مثل قفل سيارتك وعدم الالتفات للنظر إليها قبل المغادرة - إذا كان الأمر كذلك، فلديك السيارة الخاطئة." }
      ],
      mapTitle: "البصمة العالمية",
      mapSub: "نعمل مع العالم أجمع",
    },
    services: {
      title: "الخدمات",
      description: "نحن متخصصون في تقاطع تصميم المنتجات المادية والرقمية. من أبحاث المفاهيم إلى العلامات التجارية الكاملة والتطوير الرقمي، نساعد الفرق على تصور المبادرات ذات التأثير الدائم والتحقق منها وإطلاقها.",
      categories: {
        branding: "العلامة التجارية",
        industrial: "التصميم الصناعي",
        marketing: "التسويق الرقمي",
        concept: "تصميم المفاهيم",
        graphic: "التصميم الجرافيكي",
        automotive: "تصميم السيارات",
        architectural: "التصميم المعماري",
        product: "تصميم المنتجات",
        motion: "تصميم الحركة",
        music: "الموسيقى والصوت",
        web: "تطوير / تصميم الويب",
        uiux: "تصميم واجهة المستخدم UI UX"
      }
    },
    projects: {
      title: "جميع المشاريع",
      items: []
    },
    products: {
      title: "جميع المنتجات",
      items: []
    },
    webUiUx: {
      title: "الويب / UI UX",
      items: []
    },
    gamedev: {
      title: "تطوير الألعاب",
      items: []
    },
    concepts: {
      title: "الرؤى والمفاهيم",
      items: []
    },
    architects: {
      title: "المشاريع المعمارية",
      items: []
    },
    contacts: {
      title: "دعونا نناقش المستقبل.",
      letsTalk: "دعونا نتحدث",
      writeUs: "اكتب إلينا",
      callUs: "اتصل بنا",
      officeTitle: "عنوان المكتب",
      officeAddress: "بيشكيك، قيرغيزستان\nIT - Hub Technopark",
      leader: "القيادة: أوليغ إرماكوف — المدير التنفيذي",
      legal: "المعلومات القانونية: الشريك الفردي إرماكوف أ.",
      markerLabel: "فريق استوديو ستيل دريك",
      addressFooter: "تكنوبارك IT-Hub، بيشكيك، قيرغيزستان",
      form: {
        name: "اسمك الكريم",
        email: "بريدك الإلكتروني",
        message: "أخبرنا عن مشروعك...",
        submit: "إرسال الرسالة",
        success: "شكرًا لك! تم إرسال رسالتك بنجاح.",
        error: "فشل الإرسال. يرجى المحاولة مرة أخرى.",
        company: "اسم الشركة (اختياري)",
        phone: "رقم الهاتف",
        service: "الخدمة المطلوبة",
        budget: "الميزانية المتوقعة",
        discussProject: "دعونا نناقش مشروعك",
        backToHome: "العودة للرئيسية"
      }
    },
    projectDetail: {
      challengeHeading: "المهمة والتحدي",
      resultsHeading: "النتائج المحققة",
      labels: {
        client: "العميل",
        year: "السنة",
        service: "الخدمة",
      },
      projects: {},
      defaultProject: {
        name: "مشروع",
        desc: "وصف المشروع.",
        client: "غير معروف",
        year: "2026",
        service: "التصميم والتطوير",
        challenge: "صياغة نهج مبتكر لمشكلة كلاسيكية.",
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600"],
        results: ["إطلاق ناجح"],
      },
    },
    productDetail: {
      challengeHeading: "المهمة والتحدي",
      resultsHeading: "النتائج المحققة",
      labels: {
        client: "العميل",
        year: "السنة",
        service: "الخدمة",
        studio: "الاستوديو",
        designer: "المصمم",
        location: "الموقع",
        projectType: "نوع المشروع",
        project: "المشروع",
        class: "الفئة",
      },
      products: {},
      defaultProduct: {
        name: "منتج",
        desc: "وصف المنتج.",
        client: "غير معروف",
        year: "2026",
        service: "التصميم الصناعي",
        studio: "-",
        designer: "-",
        location: "-",
        projectType: "مفهوم",
        class: "-",
        challenge: "تطوير نهج مبتكر لإنشاء منتج مادي.",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"],
        results: ["إطلاق ناجح"],
      },
    },
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      services: "Services",
      projects: "Projekte",
      products: "Produkte",
      webUiUx: "WEB / UI UX",
      contacts: "Kontakt",
    },
    home: {
      heroTag: '(c) "Alles, was Sie sehen, ist nur ein primäres Glied in der Art und Weise, wie wir unsere physische Welt wahrnehmen. Das ist meine Philosophie."',
      heroDescription: "Alles, was Sie sehen, ist nur ein primäres Glied in der Art und Weise, wie wir unsere physische Welt wahrnehmen. Deshalb lautet die Philosophie des Studios: Design zuerst.",
      viewProjects: "Projekte ansehen",
      statsYears: "15+",
      statsLabel: "Echte Erfahrung in der unabhängigen Industrie, Marken und Richtungen seit 2011.",
      globalLabel: "Projekte für Zentralasien, Europa und digital ausgerichtete Teams.",
      principleLabel: "Wen wirst du\nanrufen?",
      studioLabel: "Die Form der Zukunft sollte sich unvermeidlich anfühlen.",
      servicesTitle: "Services",
      servicesHint: "Hover / Erweitern",
      selectedWorkTitle: "Ausgewählte Arbeiten",
      featuredProjectsTitle: "Neue und aktuelle Arbeiten",
      newProject: {
        label: "Neues Projekt",
        title: "Schaufeln & Stahl",
        description: "Ein frisches industrielles Konzept für einen modernen Arbeitsbereich mit haptischen Materialien und struktureller Klarheit.",
        publishedLabel: "Veröffentlicht am",
        date: "11. Juni 2026",
        time: "14:20",
        action: "Ansehen",
      },
      recentProject: {
        label: "Aktuelles Projekt",
        title: "Oasis Studio",
        description: "Ein aktuelles digitales Identitäts- und Produktdesign für eine Premium-Architekturmarke.",
        publishedLabel: "Veröffentlicht am",
        date: "4. Juni 2026",
        time: "10:45",
        action: "Ansehen",
      },
      services: [
        ["01", "Brand Design", "Identität, Bewegungssysteme, visuelle Sprache und Produkteinführung.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/brand.png"],
        ["03", "Industriedesign", "Entwicklung ästhetischer, funktionaler und technologischer physischer Produkte für die Serienproduktion.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/industrial.png"],
        ["09", "Marketing", "Strategische Produktförderung und Launch-Kampagnen in digitalen Umgebungen.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/marketing.png"],
        ["06", "Concept Design", "Erstellung kühner Konzepte für Film, Spiele, Präsentationen und F&E-Forschung.", "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/services/concept.png"],
        ["13", "Game Dev", "Entwicklung von 3D-Welten, Spielumgebungen, Spielmechaniken und interaktiver Spielkunst.", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600"],
      ],
      projects: [],
      brands: []
    },
    about: {
      whoWeAre: "Wer wir sind",
      ourStoryTitle: "Unsere Geschichte",
      manifestoHeading: "Gegründet auf der Leidenschaft für Form.",
      manifestoText: "Steel Drake Studio wurde 2011 von dem Designer und Visionär Oleg Ermakov gegründet. Beginnend als progressives Konzeptstudio wuchsen wir zu einem internationalen Büro heran, das Aufgaben jeder Größenordnung lösen kann – von der Identität für Tech-Startups bis hin zu futuristischen Transportmitteln und architektonischen Ensembles. Unsere Geschichte ist eine kontinuierliche Suche nach Harmonie zwischen Funktionalität und reiner Emotion.",
      philosophyTitle: "Unser Manifest",
      philosophyText: "Wir glauben, dass Design nicht nur Oberflächenbehandlung ist. Es ist eine Sprache, durch die ein Produkt zu seinem Benutzer spricht. Wir entfernen alles Überflüssige, um das Wesentliche zu enthüllen. Unsere Philosophie ruht auf drei Säulen: kompromisslose Ergonomie, technologische Ästhetik und dauerhafte Bedeutung. Wir folgen keinen Trends – wir gestalten eine Zukunft, die über Jahrzehnte relevant bleibt.",
      teamTitle: "Das Team",
      teamIntro: "Ein Kollektiv aus Strategen, Designern, Entwicklern und Problemlösern, vereint durch Neugierde und Handwerk. Wir schaffen digitale Erlebnisse, die elegant, funktional und unvermeidlich sind.",
      team: teamTranslations.en,
      timeline: [
        { year: "2011", title: "Gründung", text: "Wir begannen mit einer einfachen Idee: Strategie, Kreativität und Technologie zusammenzubringen, um sinnvolles Design zu schaffen.", img: "/about/story_1.png" },
        { year: "2012 - 2015", title: "Ursprünge des Konzeptstudios", text: "Unsere frühen Projekte prägten unseren Ansatz – forschungsorientierte Konzepte, elegante Lösungen und Liebe zum Detail.", img: "/about/story_2.png" },
        { year: "2016 - 2019", title: "Internationales Wachstum", text: "Durch den Ausbau unseres Teams und unserer Expertise begannen wir, über Grenzen und Branchen hinweg zu arbeiten und größere Herausforderungen anzunehmen.", img: "/about/story_3.png" },
        { year: "2020 - Heute", title: "Multidisziplinäres Büro Heute", text: "Heute sind wir ein Full-Cycle-Designbüro, das wirkungsvolle Lösungen in den Bereichen Digital, Mobilität und Raum schafft.", img: "/about/story_4.png" }
      ],
      awardsTitle: "Anerkennung",
      awardsSub: "Design-Auszeichnungen und Meilensteine.",
      awardsList: [],
      valuesTitle: "Grundprinzipien",
      valuesSub: "Philosophische\nGrundlage",
      valuesList: [
        { num: "01", title: "Erste\nWahrnehmung", desc: "Wie in unserem Statement dargelegt, ist das allererste, was passiert, das, was Sie visuell wahrnehmen." },
        { num: "02", title: "Gefühle", desc: "Nach dem ersten Blick beginnen Sie, bestimmte Gefühle zu empfinden: ob es Ihnen gefällt oder nicht, ob Sie es untersuchen möchten oder bereits beginnen, es anzuprobieren." },
        { num: "03", title: "Emotionen", desc: "Wenn das Ergebnis keine Emotionen hervorruft, stimmt etwas nicht. Es ist wie das Abschließen des Autos, ohne sich vor dem Weggehen noch einmal umzudrehen – wenn das so ist, haben Sie das falsche Auto." }
      ],
      mapTitle: "Globale Reichweite",
      mapSub: "Arbeiten mit der ganzen Welt",
    },
    services: {
      title: "Services",
      description: "Wir sind spezialisiert auf die Schnittstelle von physischem und digitalem Produktdesign. Von der Konzeptentwicklung bis hin zu umfassendem Branding und digitaler Entwicklung helfen wir Teams, Initiativen mit nachhaltiger Wirkung zu konzipieren, zu validieren und zu starten.",
      categories: {
        branding: "Brand Design",
        industrial: "Industriedesign",
        marketing: "Marketing",
        concept: "Concept Design",
        graphic: "Grafikdesign",
        automotive: "Automotive Design",
        architectural: "Architekturdesign",
        product: "Produktdesign",
        motion: "Motion Design",
        music: "Musik & Sound",
        web: "Webentwicklung / Design",
        uiux: "UI UX Design"
      }
    },
    projects: {
      title: "Alle Projekte",
      items: []
    },
    products: {
      title: "Alle Produkte",
      items: []
    },
    webUiUx: {
      title: "WEB / UI UX",
      items: []
    },
    gamedev: {
      title: "GameDev",
      items: []
    },
    concepts: {
      title: "Konzepte & Visionen",
      items: []
    },
    architects: {
      title: "Architekturprojekte",
      items: []
    },
    contacts: {
      title: "Lassen Sie uns die Zukunft besprechen.",
      letsTalk: "Lassen Sie uns sprechen",
      writeUs: "Schreiben Sie uns",
      callUs: "Rufen Sie uns an",
      officeTitle: "Büroadresse",
      officeAddress: "Bischkek, Kirgisistan\nIT - Hub Technopark",
      leader: "Leitung: Oleg Ermakov — CEO",
      legal: "Rechtliche Informationen: Einzelunternehmen Ermakov O.",
      markerLabel: "Steel Drake Studio Team",
      addressFooter: "IT-Hub Technopark, Bischkek, Kirgisistan",
      form: {
        name: "Ihr Name",
        email: "Ihre E-Mail",
        message: "Erzählen Sie uns von Ihrem Projekt...",
        submit: "Nachricht senden",
        success: "Danke! Ihre Nachricht wurde erfolgreich gesendet.",
        error: "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.",
        company: "Firmenname (optional)",
        phone: "Telefonnummer",
        service: "Gewünschter Service",
        budget: "Budgetbereich",
        discussProject: "Lassen Sie uns Ihr Projekt besprechen",
        backToHome: "Zurück zur Startseite"
      }
    },
    projectDetail: {
      challengeHeading: "Aufgabe & Herausforderung",
      resultsHeading: "Ergebnisse",
      labels: {
        client: "Kunde",
        year: "Jahr",
        service: "Service",
      },
      projects: {},
      defaultProject: {
        name: "Projekt",
        desc: "Projektbeschreibung.",
        client: "Unbekannt",
        year: "2026",
        service: "Entwicklung & Design",
        challenge: "Entwicklung eines innovativen Ansatzes für ein klassisches Problem.",
        processImages: ["https://images.unsplash.com/photo-1752524722694-e0976575a993?auto=format&fit=crop&q=80&w=600"],
        results: ["Erfolgreicher Launch"],
      },
    },
    productDetail: {
      challengeHeading: "Aufgabe & Herausforderung",
      resultsHeading: "Ergebnisse",
      labels: {
        client: "Kunde",
        year: "Jahr",
        service: "Service",
        studio: "Studio",
        designer: "Designer",
        location: "Standort",
        projectType: "Projekttyp",
        project: "Projekt",
        class: "Klasse",
      },
      products: {},
      defaultProduct: {
        name: "Produkt",
        desc: "Produktbeschreibung.",
        client: "Unbekannt",
        year: "2026",
        service: "Industriedesign",
        studio: "-",
        designer: "-",
        location: "-",
        projectType: "Konzept",
        class: "-",
        challenge: "Etablierung eines innovativen Ansatzes zur Erstellung eines physischen Produkts.",
        processImages: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"],
        results: ["Erfolgreicher Launch"],
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

const translationsDictionary: Record<string, Record<Language, string>> = {
  "Everything you see is but a primary link in how we perceive our physical world, which is why the studio's philosophy is Design at first.": {
    en: "Everything you see is but a primary link in how we perceive our physical world, which is why the studio's philosophy is Design at first.",
    ru: "Все что вы видите является одним из первичных звеньев того, как мы воспринимаем наш физический мир, именно поэтому философия студии это Дизайн в первую очередь",
    kg: "Сиз көргөндөрдүн бардыгы биздин физикалык дүйнөнү кабыл алуубуздун баштапкы муундарынын бири болуп саналат, ошондуктан студиянын философиясы — биринчи кезекте Дизайн.",
    zh: "你所看到的一切，只是我们感知物理世界的首要纽带，这就是为什么工作室的哲学是设计第一。",
    ar: "كل ما تراه ليس سوى حلقة أولية في كيفية إدراكنا لعالمنا المادي، ولهذا السبب فإن فلسفة الاستوديو هي التصميم أولاً.",
    de: "Alles, was Sie sehen, ist nur ein primäres Bindeglied in der Art und Weise, wie wir unsere physische Welt wahrnehmen. Deshalb lautet die Philosophie des Studios: Design an erster Stelle.",
  },
  "Years of experience in Design — studio founder": {
    en: "Years of experience in Design — studio founder",
    ru: "Год опыта в дизайне — основатель студии",
    kg: "Дизайндагы 21 жылдык тажрыйба",
    zh: "21年设计经验 — 工作室创始人",
    ar: "21 عامًا من الخبرة في التصميم - مؤسس الاستوديو",
    de: "21 Jahre Erfahrung im Design – Studio-Gründer",
  },
  "Experience as studio": {
    en: "Experience as studio",
    ru: "Опыт работы как студия",
    kg: "Студия катары тажрыйба",
    zh: "自2011年起作为专业工作室的丰富经验",
    ar: "خبرة كاستوديو محترف منذ عام 2011",
    de: "Erfahrung als Studio seit 2011",
  },
  "Brands you know that were created or have been renewed thanks to our studio": {
    en: "Brands you know that were created or have been renewed thanks to our studio",
    ru: "Знакомые вам бренды которые были созданы или обрели обновленный стиль благодаря нашей студии",
    kg: "Сизге тааныш болгон бренддер биздин студия тарабынан түзүлгөн же жаңыланган стилге ээ болгон",
    zh: "您所熟知的品牌，由我们工作室倾力打造或重塑焕新",
    ar: "العلامات التجارية الشهيرة التي تم إنشاؤها أو تجديدها بواسطة استوديونا",
    de: "Bekannte Marken, die durch unser Studio geschaffen oder erneuert wurden",
  },
  "Where we started": {
    en: "Where we started",
    ru: "Откуда мы начинали",
    kg: "Биз кайдан баштаганбыз",
    zh: "我们的起点",
    ar: "من أين بدأنا",
    de: "Wo wir angefangen haben",
  },
  "Some of the works created between 2005 and 2020 — signature projects by which our long-time clients have known and remembered us.": {
    en: "Some of the works created between 2005 and 2020 — signature projects by which our long-time clients have known and remembered us.",
    ru: "Некоторые из работ, которые были сделаны с 2005 по 2020 год — проекты, по которым некоторые из наших клиентов нас знают и помнят со дня основания.",
    kg: "2005-жылдан 2020-жылга чейин жасалган айрым иштер — кардарларыбыз негизделген күндөн бери бизди тааныган жана эстеп калган долбоорлор.",
    zh: "2005年至2020年间创作的部分代表作品 — 老客户自创立之日起就熟知并铭记的标志性项目。",
    ar: "بعض الأعمال التي تم إنشاؤها بين عامي 2005 و2020 - مشاريع مميزة يعرفنا بها عملاؤنا القدامى.",
    de: "Einige der zwischen 2005 und 2020 entstandenen Arbeiten – Signaturprojekte, an die sich unsere langjährigen Kunden erinnern.",
  },
  "All Old Projects (2005—2020)": {
    en: "All Old Projects (2005—2020)",
    ru: "Все старые проекты (2005—2020)",
    kg: "Бардык эски долбоорлор (2005—2020)",
    zh: "所有历史项目 (2005—2020)",
    ar: "جميع المشاريع السابقة (2005-2020)",
    de: "Alle alten Projekte (2005–2020)",
  },
  "Branding": {
    en: "Branding",
    ru: "Брендинг",
    kg: "Брендинг",
    zh: "品牌设计",
    ar: "هوية العلامة التجارية",
    de: "Branding",
  },
  "BRANDING": {
    en: "BRANDING",
    ru: "БРЕНДИНГ",
    kg: "БРЕНДИНГ",
    zh: "品牌设计",
    ar: "هوية العلامة التجارية",
    de: "BRANDING",
  },
  "Industrial Design": {
    en: "Industrial Design",
    ru: "Промышленный дизайн",
    kg: "Өнөр жай дизайны",
    zh: "工业设计",
    ar: "التصميم الصناعي",
    de: "Industriedesign",
  },
  "INDUSTRIAL DESIGN": {
    en: "INDUSTRIAL DESIGN",
    ru: "ПРОМЫШЛЕННЫЙ ДИЗАЙН",
    kg: "ӨНӨР ЖАЙ ДИЗАЙНЫ",
    zh: "工业设计",
    ar: "التصميم الصناعي",
    de: "INDUSTRIEDESIGN",
  },
  "Marketing": {
    en: "Marketing",
    ru: "Маркетинг",
    kg: "Маркетинг",
    zh: "数字营销",
    ar: "التسويق الرقمي",
    de: "Marketing",
  },
  "MARKETING": {
    en: "MARKETING",
    ru: "МАРКЕТИНГ",
    kg: "МАРКЕТИНГ",
    zh: "数字营销",
    ar: "التسويق الرقمي",
    de: "MARKETING",
  },
  "Concept Design": {
    en: "Concept Design",
    ru: "Концептуальный дизайн",
    kg: "Концептуалдык дизайн",
    zh: "概念设计",
    ar: "تصميم المفاهيم",
    de: "Konzeptdesign",
  },
  "CONCEPT DESIGN": {
    en: "CONCEPT DESIGN",
    ru: "КОНЦЕПТУАЛЬНЫЙ ДИЗАЙН",
    kg: "КОНЦЕПТУАЛДЫК ДИЗАЙН",
    zh: "概念设计",
    ar: "تصميم المفاهيم",
    de: "KONZEPTDESIGN",
  },
  "WEB / UI UX": {
    en: "WEB / UI UX",
    ru: "WEB / UI UX",
    kg: "WEB / UI UX",
    zh: "网页 / UI UX",
    ar: "تطوير الويب وواجهة المستخدم",
    de: "WEB / UI UX",
  },
  "Discuss Project": {
    en: "Discuss Project",
    ru: "Обсудить проект",
    kg: "Долбоорду талкуулоо",
    zh: "洽谈项目",
    ar: "مناقشة المشروع",
    de: "Projekt besprechen",
  },
  "ALL YEARS": {
    en: "ALL YEARS",
    ru: "ВСЕ ГОДА",
    kg: "БАРДЫК ЖЫЛДАР",
    zh: "所有年份",
    ar: "جميع السنوات",
    de: "ALLE JAHRE",
  },
  "Recent projects": {
    en: "Recent projects",
    ru: "Недавние проекты",
    kg: "Жакында долбоорлор",
    zh: "近期项目",
    ar: "المشاريع الحديثة",
    de: "Aktuelle Projekte",
  },
  "Recent products": {
    en: "Recent products",
    ru: "Недавние продукты",
    kg: "Жакында өнүмдөр",
    zh: "近期产品",
    ar: "المنتجات الحديثة",
    de: "Aktuelle Produkte",
  },
  "Recent concepts": {
    en: "Recent concepts",
    ru: "Недавние концепты",
    kg: "Акыркы концепциялар",
    zh: "近期概念",
    ar: "المفاهيم الحديثة",
    de: "Aktuelle Konzepte",
  },
  "Advantages": {
    en: "Advantages",
    ru: "Преимущества",
    kg: "Артыкчылыктар",
    zh: "优势与价值",
    ar: "المزايا والقيم",
    de: "Vorteile & Werte",
  },
  "Services": {
    en: "Services",
    ru: "Услуги",
    kg: "Кызматтар",
    zh: "服务项目",
    ar: "الخدمات",
    de: "Dienstleistungen",
  },
  "Order service →": {
    en: "Order service →",
    ru: "Заказать услугу →",
    kg: "Кызматты заказ кылуу →",
    zh: "预订服务 →",
    ar: "طلب الخدمة ←",
    de: "Service bestellen →",
  },
  "View all services →": {
    en: "View all services →",
    ru: "Смотреть все услуги →",
    kg: "Бардык кызматтарды көрүү →",
    zh: "查看所有服务 →",
    ar: "عرض جميع الخدمات ←",
    de: "Alle Services anzeigen →",
  },
  "Featured projects": {
    en: "Featured projects",
    ru: "Избранные проекты",
    kg: "Тандалган долбоорлор",
    zh: "精选项目",
    ar: "المشاريع المميزة",
    de: "Hervorgehobene Projekte",
  },
  "Selected brands": {
    en: "Selected brands",
    ru: "Бренды",
    kg: "Бренддер",
    zh: "合作品牌",
    ar: "العلامات التجارية",
    de: "Ausgewählte Marken",
  },
  "Concepts & Vision": {
    en: "Concepts & Vision",
    ru: "Концепты и видение",
    kg: "Концепциялар жана көрүнүш",
    zh: "概念与远景",
    ar: "المفاهيم والرؤية",
    de: "Konzepte & Visionen",
  },
  "Recent WEB / UI UX projects": {
    en: "Recent WEB / UI UX projects",
    ru: "Недавние проекты WEB / UI UX",
    kg: "Акыркы WEB / UI UX долбоорлору",
    zh: "近期 WEB / UI UX 项目",
    ar: "مشاريع الويب وواجهة المستخدم الحديثة",
    de: "Aktuelle WEB / UI UX Projekte",
  },
  "ALL PROJECTS": {
    en: "ALL PROJECTS",
    ru: "ВСЕ ПРОЕКТЫ",
    kg: "БАРДЫК ДОЛБООРЛОР",
    zh: "所有项目",
    ar: "جميع المشاريع",
    de: "ALLE PROJEKTE",
  },
  "Studio products": {
    en: "Studio products",
    ru: "Продукты студии",
    kg: "Студиянын продукциялары",
    zh: "工作室产品",
    ar: "منتجات الاستوديو",
    de: "Studio-Produkte",
  },
  "Challenge": {
    en: "Challenge",
    ru: "Задача и вызов",
    kg: "Маселе жана чакырык",
    zh: "任务与挑战",
    ar: "المهمة والتحدي",
    de: "Aufgabe & Herausforderung",
  },
  "Gallery": {
    en: "Gallery",
    ru: "Галерея",
    kg: "Галерея",
    zh: "画廊",
    ar: "معرض الصور",
    de: "Galerie",
  },
  "Video": {
    en: "Video",
    ru: "Видео",
    kg: "Видео",
    zh: "视频",
    ar: "فيديو",
    de: "Video",
  },
  "Results": {
    en: "Results",
    ru: "Результаты",
    kg: "Натыйжалар",
    zh: "成果与业绩",
    ar: "النتائج المحققة",
    de: "Ergebnisse",
  },
  "View other projects": {
    en: "View other projects",
    ru: "Другие проекты",
    kg: "Башка долбоорлор",
    zh: "查看其他项目",
    ar: "عرض مشاريع أخرى",
    de: "Andere Projekte anzeigen",
  },
  "View other products": {
    en: "View other products",
    ru: "Другие продукты",
    kg: "Башка продукциялар",
    zh: "查看其他产品",
    ar: "عرض منتجات أخرى",
    de: "Andere Produkte anzeigen",
  },
  "View other concepts": {
    en: "View other concepts",
    ru: "Другие концепты",
    kg: "Башка концепциялар",
    zh: "查看其他概念",
    ar: "عرض مفاهيم أخرى",
    de: "Andere Konzepte anzeigen",
  },
  "View Website": {
    en: "View Website",
    ru: "Посмотреть сайт",
    kg: "Сайтты көрүү",
    zh: "访问网站",
    ar: "زيارة الموقع الإلكتروني",
    de: "Website besuchen",
  },
  "YEAR": {
    en: "YEAR",
    ru: "ГОД",
    kg: "ЖЫЛ",
    zh: "年份",
    ar: "السنة",
    de: "JAHR",
  },
  "CATEGORY": {
    en: "CATEGORY",
    ru: "КАТЕГОРИЯ",
    kg: "КАТЕГОРИЯ",
    zh: "类别",
    ar: "الفئة",
    de: "KATEGORIE",
  },
  "Client": {
    en: "Client",
    ru: "Клиент",
    kg: "Кардар",
    zh: "客户",
    ar: "العميل",
    de: "Kunde",
  },
  "ONE ORDO RESORT": {
    en: "ONE ORDO RESORT",
    ru: "ОДИН ОРДО РЕЗОРТ",
    kg: "УАН ОРДО РЕЗОРТ",
    zh: "ONE ORDO 度假村",
    ar: "منتجع وان أوردو",
    de: "ONE ORDO RESORT",
  },
  "One Ordo Resort": {
    en: "One Ordo Resort",
    ru: "Один Ордо Резорт",
    kg: "Уан Ордо Резорт",
    zh: "One Ordo 度假村",
    ar: "منتجع وان أوردو",
    de: "One Ordo Resort",
  },
  "Branding in which our studio created Naming, and all the important branding details for presenting the resort. The ideology of number 1 carried through the waves and...": {
    en: "Branding in which our studio created Naming, and all the important branding details for presenting the resort. The ideology of number 1 carried through the waves and...",
    ru: "Брендинг в котором наша студия создала Наминг, и все важные детали брендинга для презентации курорта. Идеология номера 1 пронесена сквозь волны...",
    kg: "Курортту презентациялоо үчүн биздин студия Нейминг жана брендингдин бардык маанилүү деталдарын түзгөн брендинг. Толкундар аркылуу №1 идеологиясы...",
    zh: "我们工作室为度假村呈现打造了命名及所有重要品牌细节的品牌设计。1号理念穿梭于浪花与设计之间...",
    ar: "العلامة التجارية التي أنشأ فيها استوديونا التسمية وجميع تفاصيل العلامة التجارية الهامة لتقديم المنتجع...",
    de: "Branding, bei dem unser Studio das Naming und alle wichtigen Branding-Details zur Präsentation des Resorts erstellt hat...",
  },
  "Брендинг в котором наша студия создала Наминг, и все важные детали брендинга для презентации курорта. Идеология номера 1 пронесена сквозь волны...": {
    en: "Branding in which our studio created Naming, and all the important branding details for presenting the resort. The ideology of number 1 carried through the waves and...",
    ru: "Брендинг в котором наша студия создала Наминг, и все важные детали брендинга для презентации курорта. Идеология номера 1 пронесена сквозь волны...",
    kg: "Курортту презентациялоо үчүн биздин студия Нейминг жана брендингдин бардык маанилүү деталдарын түзгөн брендинг. Толкундар аркылуу №1 идеологиясы...",
    zh: "我们工作室为度假村呈现打造了命名及所有重要品牌细节的品牌设计。1号理念穿梭于浪花与设计之间...",
    ar: "العلامة التجارية التي أنشأ فيها استوديونا التسمية وجميع تفاصيل العلامة التجارية الهامة لتقديم المنتجع...",
    de: "Branding, bei dem unser Studio das Naming und alle важных Branding-Details zur Präsentation des Resorts erstellt hat...",
  },
  "TOOKO": {
    en: "TOOKO",
    ru: "TOOKO",
    kg: "TOOKO",
    zh: "TOOKO",
    ar: "TOOKO",
    de: "TOOKO",
  },
  "Tooko": {
    en: "Tooko",
    ru: "Tooko",
    kg: "Tooko",
    zh: "Tooko",
    ar: "Tooko",
    de: "Tooko",
  },
  "We created everything necessary and necessary for a new brand, inside and out, which is about to enter the market. Colors and contrasts for a strong start. Light, friendly style and...": {
    en: "We created everything necessary and necessary for a new brand, inside and out, which is about to enter the market. Colors and contrasts for a strong start. Light, friendly style and...",
    ru: "Мы создали всё необходимое для нового бренда внутри и снаружи, который готов выйти на рынок. Цвета и контрасты для сильного старта. Легкий, дружелюбный стиль...",
    kg: "Биз жаңы бренд үчүн ичинен да, сыртынан да бардык зарыл нерселерди түздүк, ал жакында рынокко чыгат. Күчтүү старт үчүн түстөр жана контрасттар...",
    zh: "我们由内而外为即将进入市场的全新品牌打造了一切核心要素。鲜明的色彩与对比赋予强力起步，轻松亲和的风格...",
    ar: "لقد أنشأنا كل ما هو ضروري لعلامة تجارية جديدة، من الداخل والخارج، والتي على وشك دخول السوق...",
    de: "Wir haben alles Notwendige für eine neue Marke von innen und außen geschaffen, die kurz vor dem Markteintritt steht...",
  },
  "Мы создали всё необходимое для нового бренда внутри и снаружи, который готов выйти на рынок. Цвета и контрасты для сильного старта. Легкий, дружелюбный стиль...": {
    en: "We created everything necessary for a new brand, inside and out, which is about to enter the market. Colors and contrasts for a strong start. Light, friendly style and...",
    ru: "Мы создали всё необходимое для нового бренда внутри и снаружи, который готов выйти на рынок. Цвета и контрасты для сильного старта. Легкий, дружелюбный стиль...",
    kg: "Биз жаңы бренд үчүн ичинен да, сыртынан да бардык зарыл нерселерди түздүк, ал жакында рынокко чыгат. Күчтүү старт үчүн түстөр жана контрасттар...",
    zh: "我们由内而外为即将进入市场的全新品牌打造了一切核心要素。鲜明的色彩与对比赋予强力起步，轻松亲和的风格...",
    ar: "لقد أنشأنا كل ما هو ضروري لعلامة تجارية جديدة، من الداخل والخارج، والتي على وشك دخول السوق...",
    de: "Wir haben alles Notwendige für eine новое Marke von innen und außen geschaffen, die kurz vor dem Markteintritt steht...",
  },
  "MAMINY RETSEPTY": {
    en: "MOM'S RECIPES",
    ru: "МАМИНЫ РЕЦЕПТЫ",
    kg: "МАМИНЫ РЕЦЕПТЫ",
    zh: "MOM'S RECIPES",
    ar: "MOM'S RECIPES",
    de: "MOM'S RECIPES",
  },
  "Мамины рецепты": {
    en: "Mom's Recipes",
    ru: "Мамины рецепты",
    kg: "Мамины рецепты",
    zh: "Mom's Recipes",
    ar: "Mom's Recipes",
    de: "Mom's Recipes",
  },
  "BISHBENCH": {
    en: "BISHBENCH",
    ru: "BISHBENCH",
    kg: "BISHBENCH",
    zh: "BISHBENCH",
    ar: "BISHBENCH",
    de: "BISHBENCH",
  },
  "Bishbench": {
    en: "Bishbench",
    ru: "Bishbench",
    kg: "Bishbench",
    zh: "Bishbench",
    ar: "Bishbench",
    de: "Bishbench",
  },
  "SANDYQ": {
    en: "SANDYQ",
    ru: "SANDYQ",
    kg: "SANDYQ",
    zh: "SANDYQ",
    ar: "SANDYQ",
    de: "SANDYQ",
  },
  "Sandyq": {
    en: "Sandyq",
    ru: "Sandyq",
    kg: "Sandyq",
    zh: "Sandyq",
    ar: "Sandyq",
    de: "Sandyq",
  },
  "ALA-TOO": {
    en: "ALA-TOO",
    ru: "ALA-TOO",
    kg: "ALA-TOO",
    zh: "ALA-TOO",
    ar: "ALA-TOO",
    de: "ALA-TOO",
  },
  "Ala-Too": {
    en: "Ala-Too",
    ru: "Ala-Too",
    kg: "Ala-Too",
    zh: "Ala-Too",
    ar: "Ala-Too",
    de: "Ala-Too",
  },
  "SALKYN": {
    en: "SALKYN",
    ru: "SALKYN",
    kg: "SALKYN",
    zh: "SALKYN",
    ar: "SALKYN",
    de: "SALKYN",
  },
  "Salkyn": {
    en: "Salkyn",
    ru: "Salkyn",
    kg: "Salkyn",
    zh: "Salkyn",
    ar: "Salkyn",
    de: "Salkyn",
  },
  "TECHSTART": {
    en: "TECHSTART",
    ru: "TECHSTART",
    kg: "TECHSTART",
    zh: "TECHSTART",
    ar: "TECHSTART",
    de: "TECHSTART",
  },
  "TechStart": {
    en: "TechStart",
    ru: "TechStart",
    kg: "TechStart",
    zh: "TechStart",
    ar: "TechStart",
    de: "TechStart",
  },
  "AUTO CONCEPT X": {
    en: "AUTO CONCEPT X",
    ru: "AUTO CONCEPT X",
    kg: "AUTO CONCEPT X",
    zh: "AUTO CONCEPT X",
    ar: "AUTO CONCEPT X",
    de: "AUTO CONCEPT X",
  },
  "Auto Concept X": {
    en: "Auto Concept X",
    ru: "Auto Concept X",
    kg: "Auto Concept X",
    zh: "Auto Concept X",
    ar: "Auto Concept X",
    de: "Auto Concept X",
  },
  "ONE CONSTRUCTION": {
    en: "ONE CONSTRUCTION",
    ru: "ONE CONSTRUCTION",
    kg: "ONE CONSTRUCTION",
    zh: "ONE CONSTRUCTION",
    ar: "ONE CONSTRUCTION",
    de: "ONE CONSTRUCTION",
  },
  "One Construction": {
    en: "One Construction",
    ru: "One Construction",
    kg: "One Construction",
    zh: "One Construction",
    ar: "One Construction",
    de: "One Construction",
  },
  "Updating the brand in accordance with the company's plans.": {
    en: "Updating the brand in accordance with the company's plans.",
    ru: "Обновление бренда в соответствии с планами компании.",
    kg: "Компаниянын пландарына ылайык брендди жаңыртуу.",
    zh: "根据公司战略规划重塑并升级品牌形象。",
    ar: "تحديث العلامة التجارية وفقاً لخطط الشركة.",
    de: "Aktualisierung der Marke gemäß den Unternehmensplänen.",
  },
  "We created branding, the goal of which was to raise the level of the company through brand style, so that the graphics, lines and details corresponded to the plans of the company itself and its future projects.": {
    en: "We created branding, the goal of which was to raise the level of the company through brand style, so that the graphics, lines and details corresponded to the plans of the company itself and its future projects.",
    ru: "Мы создали брендинг, целью которого было поднять уровень компании через фирменный стиль, чтобы графика, линии и детали соответствовали планам самой компании и её будущих проектов.",
    kg: "Биз компаниянын деңгээлин бренддик стиль аркылуу көтөрүү максатында брендинг түздүк, графика, сызыктар жана деталдар компаниянын пландарына шайкеш келет.",
    zh: "我们打造了全新的品牌设计，旨在通过品牌风格提升公司形象，让视觉、线条与细节完美契合公司本身及其未来项目的宏伟规划。",
    ar: "لقد أنشأنا هوية تجارية كان الهدف منها رفع مستوى الشركة من خلال أسلوب العلامة التجارية، بحيث تتوافق الرسومات والخطوط والتفاصيل مع خطط الشركة نفسها والمشاريع المستقبلية.",
    de: "Wir haben ein Branding geschaffen, dessen Ziel es war, das Niveau des Unternehmens durch Markenstil zu heben, sodass Grafiken, Linien und Details den Plänen des Unternehmens und seiner zukünftigen Projekte entsprechen.",
  },
  "Create a completely new logo style and branding for a growing company.": {
    en: "Create a completely new logo style and branding for a growing company.",
    ru: "Создать совершенно новый логотип, стиль и брендинг для развивающейся компании.",
    kg: "Өсүп жаткан компания үчүн таптакыр жаңы логотип, стиль жана брендинг түзүү.",
    zh: "为一家蓬勃发展的公司打造全新标志、视觉风格与品牌形象。",
    ar: "إنشاء شعار وأسلوب وهوية تجارية جديدة تماماً لشركة متنامية.",
    de: "Erstellung eines völlig neuen Logos, Stils und Brandings für ein wachsendes Unternehmen.",
  },
  "Создать соверешнно новыйй логотип стиль и брендинг для развивающейся компании.": {
    en: "Create a completely new logo style and branding for a growing company.",
    ru: "Создать совершенно новый логотип, стиль и брендинг для развивающейся компании.",
    kg: "Өсүп жаткан компания үчүн таптакыр жаңы логотип, стиль жана брендинг түзүү.",
    zh: "为一家蓬勃发展的公司打造全新标志、视觉风格与品牌形象。",
    ar: "إنشاء شعار وأسلوب وهوية تجارية جديدة تماماً لشركة متنامية.",
    de: "Erstellung eines völlig neuen Logos, Stils und Brandings für ein wachsendes Unternehmen.",
  },
  "We put a direct idea into the logo and symbol - an open book of recipes, which also resembles the symbol of a heart, (love), we worked on the style, packaging, design, presentation and much more. Important! Only some portions of the branding are shown that are acceptable for viewing purposes.": {
    en: "We put a direct idea into the logo and symbol - an open book of recipes, which also resembles the symbol of a heart, (love), we worked on the style, packaging, design, presentation and much more. Important! Only some portions of the branding are shown that are acceptable for viewing purposes.",
    ru: "Мы вложили прямую идею в логотип и символ — открытую книгу рецептов, которая также напоминает символ сердца (любовь). Проработали стиль, упаковку, оформление, презентацию и многое другое. Важно! Показана лишь часть брендинга.",
    kg: "Биз логотипке жана символго түз идеяны салдык — ачык рецепттер китеби, ал жүрөк символун (сүйүүнү) да эске салат. Стиль, таңгактоо, дизайн жана презентация үстүндө иштедик. Маанилүү! Брендингдин бир бөлүгү гана көрсөтүлгөн.",
    zh: "我们在标志与象征符号中融入了最直观的创意——一本翻开的食谱书，同时勾勒出心形（爱）的轮廓。我们精心设计了品牌风格、包装、外观呈现及更多细节。重要提示：此处仅展示允许公开的部分品牌设计内容。",
    ar: "لقد وضعنا فكرة مباشرة في الشعار والرمز - كتاب مفتوح للوصفات يشبه أيضاً رمز القلب (الحب). عملنا على الأسلوب والتعبئة والتصميم والعرض والتفاصيل. هام! يتم عرض أجزاء من العلامة التجارية فقط.",
    de: "Wir haben eine direkte Idee in das Logo und Symbol gesteckt - ein offenes Rezeptbuch, das auch dem Symbol eines Herzens (Liebe) ähnelt. Wir haben am Stil, der Verpackung, dem Design und der Präsentation gearbeitet. Wichtig! Es werden nur zugelassene Teile des Brandings gezeigt.",
  },
  "Addressing market needs and developing next-generation physical or digital user journeys.": {
    en: "Addressing market needs and developing next-generation physical or digital user journeys.",
    ru: "Удовлетворение потребностей рынка и создание нового пользовательского опыта.",
    kg: "Рыноктун муктаждыктарын канааттандыруу жана жаңы колдонуучу тажрыйбасын түзүү.",
    zh: "满足市场需求并开发下一代物理与数字用户旅程。",
    ar: "تلبية احتياجات السوق وتطوير رحلات المستخدم الفيزيائية والرقمية من الجيل القادم.",
    de: "Erfüllung von Marktbedürfnissen und Entwicklung von Nutzererlebnissen der nächsten Generation.",
  },
  "Удовлетворение потребностей рынка и создание нового пользовательского опыта.": {
    en: "Addressing market needs and developing next-generation physical or digital user journeys.",
    ru: "Удовлетворение потребностей рынка и создание нового пользовательского опыта.",
    kg: "Рыноктун муктаждыктарын канааттандыруу жана жаңы колдонуучу тажрыйбасын түзүү.",
    zh: "满足市场需求并开发下一代物理与数字用户旅程。",
    ar: "تلبية احتياجات السوق وتطوير رحلات المستخدم الفيزيائية والرقمية من الجيل القادم.",
    de: "Erfüllung von Marktbedürfnissen und Entwicklung von Nutzererlebnissen der nächsten Generation.",
  },
  "maminy-retsepty": {
    en: "Mom's Recipes",
    ru: "Мамины рецепты",
    kg: "Энемдин рецепттери",
    zh: "妈妈的食谱",
    ar: "وصفات أمي",
    de: "Mutters Rezepte",
  },
  "MOM'S RECIPES": {
    en: "MOM'S RECIPES",
    ru: "MOM'S RECIPES",
    kg: "MOM'S RECIPES",
    zh: "MOM'S RECIPES",
    ar: "MOM'S RECIPES",
    de: "MOM'S RECIPES",
  },
  "БРЕНДИРОВАНИЕ": {
    en: "BRANDING",
    ru: "БРЕНДИРОВАНИЕ",
    kg: "БРЕНДИНГ",
    zh: "品牌设计",
    ar: "الهوية العلامة التجارية",
    de: "BRANDING",
  },
  "Брендирование": {
    en: "Branding",
    ru: "Брендирование",
    kg: "Брендинг",
    zh: "品牌设计",
    ar: "الهوية العلامة التجارية",
    de: "Branding",
  },
  "ИНДУСТРИАЛЬНЫЙ ДИЗАЙН": {
    en: "INDUSTRIAL DESIGN",
    ru: "ИНДУСТРИАЛЬНЫЙ ДИЗАЙН",
    kg: "ӨНӨР ЖАЙ ДИЗАЙНЫ",
    zh: "工业设计",
    ar: "التصميم الصناعي",
    de: "INDUSTRIEDESIGN",
  },
  "Индустриальный дизайн": {
    en: "Industrial Design",
    ru: "Индустриальный дизайн",
    kg: "Өнөр жай дизайны",
    zh: "工业设计",
    ar: "التصميم الصناعي",
    de: "Industriedesign",
  },
  "МАРКЕТИНГ": {
    en: "MARKETING",
    ru: "МАРКЕТИНГ",
    kg: "МАРКЕТИНГ",
    zh: "市场营销",
    ar: "التسويق",
    de: "MARKETING",
  },
  "Маркетинг": {
    en: "Marketing",
    ru: "Маркетинг",
    kg: "Маркетинг",
    zh: "市场营销",
    ar: "التسويق",
    de: "Marketing",
  },
  "КОНЦЕПТ-ДИЗАЙН": {
    en: "CONCEPT DESIGN",
    ru: "КОНЦЕПТ-ДИЗАЙН",
    kg: "КОНЦЕПТ ДИЗАЙН",
    zh: "概念设计",
    ar: "تصميم المفاهيم",
    de: "KONZEPTDESIGN",
  },
  "Концепт-дизайн": {
    en: "Concept Design",
    ru: "Концепт-дизайн",
    kg: "Концепт дизайн",
    zh: "概念设计",
    ar: "تصميم المفاهيم",
    de: "Konzeptdesign",
  },
  "ИГРОВАЯ РАЗРАБОТКА": {
    en: "GAME DEV",
    ru: "ИГРОВАЯ РАЗРАБОТКА",
    kg: "ОЮН ИШТЕП ЧЫГУУ",
    zh: "游戏开发",
    ar: "تطوير الألعاب",
    de: "SPIELEENTWICKLUNG",
  },
  "Game Dev": {
    en: "Game Dev",
    ru: "Game Dev",
    kg: "Game Dev",
    zh: "Game Dev",
    ar: "Game Dev",
    de: "Game Dev",
  },
  "Mom's Recipes": {
    en: "Mom's Recipes",
    ru: "Mom's Recipes",
    kg: "Mom's Recipes",
    zh: "Mom's Recipes",
    ar: "Mom's Recipes",
    de: "Mom's Recipes",
  },
  "We put a direct idea into the logo and symbol - an open book of recipes, which also resembles the symbol of a heart, (love), we worked on the style, packaging, design,...": {
    en: "We put a direct idea into the logo and symbol - an open book of recipes, which also resembles the symbol of a heart, (love), we worked on the style, packaging, design,...",
    ru: "Мы вложили прямую идею в логотип и символ — открытую книгу рецептов, которая также напоминает символ сердца (любовь), мы поработали над стилем, упаковкой, дизайном...",
    kg: "Биз логотипке жана символго түз идеяны салдык — ачык рецепттер китеби, ал ошондой эле жүрөк символун (сүйүүнү) эске салат, биз стиль, таңгактоо, дизайн үстүндө иштедик...",
    zh: "我们在标志和象征符号中融入了最直观的创意——一本翻开的食谱书，同时勾勒出心形（爱）的轮廓。我们精心设计了视觉风格、包装与外形...",
    ar: "لقد وضعنا فكرة مباشرة في الشعار والرمز - كتاب مفتوح للوصفات، والذي يشبه أيضاً رمز القلب (الحب)، وعملنا على الأسلوب، والتعبئة، والتصميم...",
    de: "Wir haben eine direkte Idee in das Logo und Symbol gesteckt - ein offenes Rezeptbuch, das auch dem Symbol eines Herzens (Liebe) ähnelt. Wir haben am Stil, an der Verpackung und am Design gearbeitet...",
  },
  "CONSTRUCTION COMPANY": {
    en: "CONSTRUCTION COMPANY",
    ru: "СТРОИТЕЛЬНАЯ КОМПАНИЯ",
    kg: "КУРУЛУШ КОМПАНИЯСЫ",
    zh: "建筑施工企业",
    ar: "شركة إنشاءات",
    de: "BAUUNTERNEHMEN",
  },
  "Brand Identity": {
    en: "Brand Identity",
    ru: "Брендинг",
    kg: "Брендинг",
    zh: "品牌视觉形象",
    ar: "هوية العلامة التجارية",
    de: "Markenidentität",
  },
  "BRAND IDENTITY": {
    en: "BRAND IDENTITY",
    ru: "БРЕНДИНГ",
    kg: "БРЕНДИНГ",
    zh: "品牌视觉形象",
    ar: "هوية العلامة التجارية",
    de: "MARKENIDENTITÄT",
  },
  "PROJECT BRANDING": {
    en: "PROJECT BRANDING",
    ru: "БРЕНДИНГ ПРОЕКТА",
    kg: "ДОЛБООРДУН БРЕНДИНГИ",
    zh: "项目品牌设计",
    ar: "هوية العلامة التجارية",
    de: "PROJEKT BRANDING",
  },
  "Projects": {
    en: "Projects",
    ru: "Проекты",
    kg: "Долбоорлор",
    zh: "项目作品",
    ar: "المشاريع",
    de: "Projekte",
  },
  "Studio Products": {
    en: "Studio Products",
    ru: "Продукты студии",
    kg: "Студиянын продукциялары",
    zh: "工作室产品",
    ar: "منتجات الاستوديو",
    de: "Studio Produkte",
  },
  "GameDev": {
    en: "GameDev",
    ru: "Игровая разработка",
    kg: "Оюн иштеп чыгуу",
    zh: "游戏开发",
    ar: "تطوير الألعاب",
    de: "Spieleentwicklung",
  },
  "Development of 3D worlds, game environments, mechanics and interactive game art": {
    en: "Development of 3D worlds, game environments, mechanics and interactive game art",
    ru: "Разработка 3D миров, игровых окружений, механик и интерактивного игрового арта",
    kg: "3D дүйнөлөрдү, оюн чөйрөлөрүн, механиканы жана интерактивдүү оюн артын иштеп чыгуу",
    zh: "3D世界、游戏环境、核心玩法机制与互动游戏艺术的开发",
    ar: "تطوير العوالم ثلاثية الأبعاد وبيئات الألعاب والميكانيكا وفن الألعاب التفاعلي",
    de: "Entwicklung von 3D-Welten, Spielumgebungen, Spielmechaniken und interaktiver Spielkunst",
  },
  "Some of the projects and products that was made in our studio for clients, for partners and for our personal visionary concepts": {
    en: "Some of the projects and products that was made in our studio for clients, for partners and for our personal visionary concepts",
    ru: "Некоторые из проектов и продуктов, которые были созданы в нашей студии для клиентов, для партнеров и для наших личных визионерских концептов",
    kg: "Биздин студияда кардарлар, өнөктөштөр жана жеке визионердик концепцияларыбыз үчүн жаратылган кээ бир долбоорлор жана өнүмдөр",
    zh: "我们在工作室中为客户、合作伙伴以及我们个人的愿景概念所打造的部分代表性项目与产品",
    ar: "بعض المشاريع والمنتجات التي تم إنشاؤها في استوديونا للعملاء والشركاء والمفاهيم الرؤيوية الشخصية",
    de: "Einige der Projekte und Produkte, die in unserem Studio für Kunden, Partner und unsere eigenen visionären Konzepte entwickelt wurden",
  },
};

export function autoTranslateText(text: string, locale: Language): string {
  if (!text || typeof text !== "string") return text || "";
  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Direct lookup in translationsDictionary
  if (translationsDictionary[trimmed] && translationsDictionary[trimmed][locale]) {
    return translationsDictionary[trimmed][locale];
  }

  // 2. Case insensitive lookup
  const lower = trimmed.toLowerCase();
  for (const [key, map] of Object.entries(translationsDictionary)) {
    if (key.toLowerCase() === lower && map[locale]) {
      return map[locale];
    }
  }

  // 3. Robust substring / phrase matching
  if (trimmed.includes("Создаем ДНК бренда") || trimmed.includes("Создание уникального ДНК бренда") || trimmed.includes("We create brand DNA")) {
    if (locale === "en") return "Creating brand DNA: from positioning and naming to visual ecosystem and brand guidelines.";
    if (locale === "ru") return "Создаем ДНК бренда: от позиционирования и нейминга до визуальной экосистемы и всего бренда в целом.";
    if (locale === "kg") return "Бренд ДНКсын түзөбүз: позициялоодон жана неймингден визуалдык экосистемага чейин.";
    if (locale === "zh") return "打造品牌DNA：从定位、命名到视觉生态系统及完整品牌指南。";
    if (locale === "ar") return "ننشئ الهوية الجينية للعلامة التجارية: من التحديد والتسمية إلى المنظومة البصرية الشاملة.";
    if (locale === "de") return "Wir schaffen Marken-DNA: von der Positionierung und Namensgebung bis hin zum visuellen Ökosystem.";
  }

  if (trimmed.includes("Разработка эстетичных, функциональных и технологичных") || trimmed.includes("Development of aesthetic, functional")) {
    if (locale === "en") return "Development of aesthetic, functional, and technological physical objects for serial production.";
    if (locale === "ru") return "Разработка эстетичных, функциональных и технологичных физических объектов для серийного производства.";
    if (locale === "kg") return "Сериялык өндүрүш үчүн эстетикалык, функционалдуу жана технологиялык объекттерди иштеп чыгуу.";
    if (locale === "zh") return "面向批量生产开发兼具美学、功能与高科技的物理实体产品。";
    if (locale === "ar") return "تطوير كائنات فيزيائية جمالية وظيفية وتكنولوجية للإنتاج التسلسلي.";
    if (locale === "de") return "Entwicklung ästhetischer, funktionaler und technologischer physischer Objekte für die Serienproduktion.";
  }

  if (trimmed.includes("Стратегическое продвижение продуктов") || trimmed.includes("Strategic product promotion")) {
    if (locale === "en") return "Strategic product promotion and brand launching in digital environments.";
    if (locale === "ru") return "Стратегическое продвижение продуктов и брендов в цифровой среде, вывод новых решений на рынок.";
    if (locale === "kg") return "Продукттарды жана бренддерди санариптик чөйрөдө стратегиялык илгерилетүү.";
    if (locale === "zh") return "在数字环境中对产品和品牌进行战略推广，并将新解决方案引入市场。";
    if (locale === "ar") return "الترويج الاستراتيجي للمنتجات والعلامات التجارية في البيئة الرقمية.";
    if (locale === "de") return "Strategische Förderung von Produkten und Marken im digitalen Umfeld.";
  }

  if (trimmed.includes("Создание футуристических и смелых концептов") || trimmed.includes("Creating futuristic and bold concepts")) {
    if (locale === "en") return "Creating futuristic and bold concepts for cinema, gaming, presentations, and R&D research.";
    if (locale === "ru") return "Создание футуристических и смелых концептов для кино, игр, презентаций и долгосрочных R&D-исследований.";
    if (locale === "kg") return "Кино, оюн, презентация жана R&D үчүн футуристикалык жана тайманбас концепцияларды түзүү.";
    if (locale === "zh") return "为电影、游戏、演示及研发研究打造前卫而具未来感的设计概念。";
    if (locale === "ar") return "إنشاء مفاهيم مستقبلية وجريئة للسينما والألعاب والعروض التقديمية والأبحاث.";
    if (locale === "de") return "Erstellung futuristischer und kühner Konzepte für Film, Spiele, Präsentationen und F&E-Forschung.";
  }

  if (trimmed.includes("Разработка 3D-миров, игровых окружений") || trimmed.includes("Development of 3D worlds")) {
    if (locale === "en") return "Development of 3D worlds, game environments, core mechanics, and interactive concept art.";
    if (locale === "ru") return "Разработка 3D-миров, игровых окружений, механик и интерактивного концепт-арта.";
    if (locale === "kg") return "3D-дүйнөлөрдү, оюн чөйрөлөрүн, механиканы жана интерактивдүү концепт-артты иштеп чыгуу.";
    if (locale === "zh") return "开发3D世界、游戏环境、核心玩法机制与互动概念艺术。";
    if (locale === "ar") return "تطوير عوالم ثلاثية الأبعاد وبيئات ألعاب وميكانيكا وفن مفاهيمي تفاعلي.";
    if (locale === "de") return "Entwicklung von 3D-Welten, Spielumgebungen, Mechaniken und interaktiver Konzeptkunst.";
  }

  if (trimmed.includes("заложили прямую идею") || trimmed.includes("вложили прямую идею") || trimmed.includes("direct idea into the logo")) {
    if (locale === "zh") return "我们在标志与象征符号中融入了最直观的创意——一本翻开的食谱书，同时勾勒出心形（爱）的轮廓。我们精心设计了品牌风格、包装、外观呈现及更多细节。";
    if (locale === "ar") return "لقد وضعنا فكرة مباشرة في الشعار والرمز - كتاب مفتوح للوصفات يشبه أيضاً رمز القلب (الحب). عملنا على الأسلوب والتعبئة والتصميم والعرض والتفاصيل.";
    if (locale === "de") return "Wir haben eine direkte Idee in das Logo und Symbol gesteckt - ein offenes Rezeptbuch, das auch dem Symbol eines Herzens (Liebe) ähnelt. Wir haben am Stil, der Verpackung, dem Design und der Präsentation gearbeitet.";
    if (locale === "kg") return "Биз логотипке жана символго түз идеяны салдык — ачык рецепттер китеби, ал жүрөк символун (сүйүүнү) да эске салат. Стиль, таңгактоо, дизайн жана презентация үстүндө иштедик.";
    if (locale === "ru") return "Мы вложили прямую идею в логотип и символ — открытую книгу рецептов, которая также напоминает символ сердца (любовь). Проработали стиль, упаковку, оформление, презентацию и многое другое.";
    if (locale === "en") return "We put a direct idea into the logo and symbol - an open book of recipes, which also resembles the symbol of a heart, (love), we worked on the style, packaging, design, presentation and much more.";
  }

  if (trimmed.includes("Создали все самое необходимое") || trimmed.includes("We created everything necessary")) {
    if (locale === "zh") return "我们由内而外为即将进入市场的全新品牌打造了一切核心要素。鲜明的色彩与对比赋予强力起步，轻松亲和的风格与令人印象深刻的吉祥物标志。";
    if (locale === "ar") return "لقد أنشأنا كل ما هو ضروري لعلامة تجارية جديدة، من الداخل والخارج، والتي على وشك دخول السوق. ألوان وتباينات لبداية قوية.";
    if (locale === "de") return "Wir haben alles Notwendige für eine neue Marke von innen und außen geschaffen, die kurz vor dem Markteintritt steht. Farben und Kontraste für einen starken Start.";
    if (locale === "kg") return "Биз жаңы бренд үчүн ичинен да, сыртынан да бардык зарыл нерселерди түздүк, ал жакында рынокко чыгат. Күчтүү старт үчүн түстөр жана контрасттар.";
    if (locale === "ru") return "Мы создали всё необходимое для нового бренда внутри и снаружи, который готов выйти на рынок. Цвета и контрасты для сильного старта. Легкий, дружелюбный стиль...";
    if (locale === "en") return "We created everything necessary for a new brand, inside and out, which is about to enter the market. Colors and contrasts for a strong start. Light, friendly style...";
  }

  // Sentence / Phrase prefix matching or dynamic translation
  if (locale === "ru") {
    if (trimmed.startsWith("Branding in which our studio")) {
      return "Брендинг в котором наша студия создала Наминг, и все важные детали брендинга для презентации курорта. Идеология номера 1 пронесена сквозь волны...";
    }
    if (trimmed.startsWith("We created everything necessary")) {
      return "Мы создали всё необходимое для нового бренда внутри и снаружи, который готов выйти на рынок. Цвета и контрасты для сильного старта...";
    }
  } else if (locale === "kg") {
    if (trimmed.startsWith("Branding in which") || trimmed.startsWith("Брендинг в котором")) {
      return "Курортту презентациялоо үчүн биздин студия Нейминг жана брендингдин бардык маанилүү деталдарын түзгөн брендинг. Толкундар аркылуу №1 идеологиясы...";
    }
    if (trimmed.startsWith("We created everything") || trimmed.startsWith("Мы создали всё")) {
      return "Биз жаңы бренд үчүн ичинен да, сыртынан да бардык зарыл нерселерди түздүк, ал жакында рынокко чыгат. Күчтүү старт үчүн түстөр жана контрасттар...";
    }
  } else if (locale === "zh") {
    if (trimmed.startsWith("Branding in which") || trimmed.startsWith("Брендинг в котором")) {
      return "我们工作室为度假村呈现打造了命名及所有重要品牌细节的品牌设计。1号理念穿梭于浪花与设计之间...";
    }
    if (trimmed.startsWith("We created everything") || trimmed.startsWith("Мы создали всё")) {
      return "我们由内而外为即将进入市场的全新品牌打造了一切核心要素。鲜明的色彩与对比赋予强力起步...";
    }
  } else if (locale === "ar") {
    if (trimmed.startsWith("Branding in which") || trimmed.startsWith("Брендинг в котором")) {
      return "العلامة التجارية التي أنشأ فيها استوديونا التسمية وجميع تفاصيل العلامة التجارية الهامة لتقديم المنتجع...";
    }
    if (trimmed.startsWith("We created everything") || trimmed.startsWith("Мы создали всё")) {
      return "لقد أنشأنا كل ما هو ضروري لعلامة تجارية جديدة، من الداخل والخارج، والتي على وشك دخول السوق...";
    }
  } else if (locale === "de") {
    if (trimmed.startsWith("Branding in which") || trimmed.startsWith("Брендинг в котором")) {
      return "Branding, bei dem unser Studio das Naming und alle wichtigen Branding-Details zur Präsentation des Resorts erstellt hat...";
    }
    if (trimmed.startsWith("We created everything") || trimmed.startsWith("Мы создали всё")) {
      return "Wir haben alles Notwendige für eine neue Marke von innen und außen geschaffen, die kurz vor dem Markteintritt steht...";
    }
  } else if (locale === "en") {
    if (trimmed.startsWith("Брендинг в котором")) {
      return "Branding in which our studio created Naming, and all the important branding details for presenting the resort. The ideology of number 1 carried through the waves and...";
    }
    if (trimmed.startsWith("Мы создали всё необходимое")) {
      return "We created everything necessary for a new brand, inside and out, which is about to enter the market. Colors and contrasts for a strong start. Light, friendly style and...";
    }
  }

  return text;
}

export function getLocText(
  locale: Language,
  ru: string,
  en: string,
  kg?: string,
  zh?: string,
  ar?: string,
  de?: string
): string {
  // 1. Direct dictionary match first!
  const dictMatch = translationsDictionary[ru] || translationsDictionary[en] || (kg ? translationsDictionary[kg] : null);
  if (dictMatch && dictMatch[locale]) {
    return dictMatch[locale];
  }

  // 2. Exact language parameter check if provided and distinct
  if (locale === "zh" && zh && zh !== ru && zh !== en) return autoTranslateText(zh, "zh");
  if (locale === "ar" && ar && ar !== ru && ar !== en) return autoTranslateText(ar, "ar");
  if (locale === "de" && de && de !== ru && de !== en) return autoTranslateText(de, "de");
  if (locale === "kg" && kg && kg !== ru && kg !== en) return autoTranslateText(kg, "kg");

  // 3. Auto translate Russian or English
  if (ru) {
    const ruMatch = autoTranslateText(ru, locale);
    if (ruMatch && ruMatch !== ru) return ruMatch;
  }
  if (en) {
    const enMatch = autoTranslateText(en, locale);
    if (enMatch && enMatch !== en) return enMatch;
  }

  if (locale === "ru") return autoTranslateText(ru || en, "ru");
  if (locale === "kg") return autoTranslateText(kg || en || ru, "kg");
  if (locale === "zh") return autoTranslateText(zh || en || ru, "zh");
  if (locale === "ar") return autoTranslateText(ar || en || ru, "ar");
  if (locale === "de") return autoTranslateText(de || en || ru, "de");
  return autoTranslateText(en || ru, "en");
}


