import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { LanguageContext, translations, getLocText } from "../i18n";
import { ArchiveOriginsSection } from "../components/ArchiveOriginsSection";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";
import { projectDetailsTranslations } from "../projectDetailsData";
import projectImg1 from "../../imports/image_low.webp";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16_low.webp";
import coverMoms from "../../imports/cover_moms.webp";
import coverTooko from "../../imports/cover_tooko.webp";

export function Home() {
  const { t, locale } = useContext(LanguageContext);
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProjectDetails(cmsService.getProjectDetails());
      setProductDetails(cmsService.getProductDetails());
    });
  }, []);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const hoveredIdxRef = useRef<number | null>(null);
  const edgeHoverRef = useRef<"left" | "right" | null>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    let x = 0;
    let speed = 1.2;
    let animationFrameId: number;
    let isRunning = false;

    const update = () => {
      let targetSpeed = 1.2;
      if (hoveredIdxRef.current !== null) {
        targetSpeed = 0.0;
      } else if (edgeHoverRef.current === "left") {
        targetSpeed = -5.5;
      } else if (edgeHoverRef.current === "right") {
        targetSpeed = 5.5;
      }

      // Inertial speed transition
      if (Math.abs(targetSpeed - speed) < 0.05) {
        speed = targetSpeed;
      } else {
        speed += (targetSpeed - speed) * 0.05;
      }


      x -= speed;

      const halfWidth = el.scrollWidth / 2;
      if (halfWidth > 0) {
        if (x <= -halfWidth) {
          x += halfWidth;
        } else if (x > 0) {
          x -= halfWidth;
        }
      }

      el.style.transform = `translateX(${x}px) translateZ(0)`;
      animationFrameId = requestAnimationFrame(update);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(update);
      }
    };

    const stopLoop = () => {
      if (isRunning) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      }
    };

    // Only animate marquee when visible on screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );

    const section = el.closest('section');
    if (section) {
      observer.observe(section);
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      observer.disconnect();
    };
  }, []);

  const projectAliases: Record<string, string[]> = {
    "maminy-retsepty": ["moms-recipes", "mom-s-recipes", "maminy_retsepty", "maminy-retsepty", "mothers-recipes"],
    "one-ordo-resort": ["one-ordo", "one-ordo-resort", "one-ordo-resort-web"],
    "tooko": ["tooko", "tooko-brand"],
    "sandyq": ["sandyq", "sandyk"],
    "ala-too": ["ala-too", "alatoo"],
    "salkyn": ["salkyn"],
    "techstart": ["techstart"],
    "auto-concept-x": ["auto-concept-x", "autoconceptx", "auto-concept"],
    "bishbench": ["bishbench"]
  };

  const findInObj = (obj: any, targetId: string) => {
    if (!obj || !targetId) return null;
    if (obj[targetId]) return obj[targetId];

    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const targetClean = clean(targetId);

    // 1. Direct clean match
    for (const k of Object.keys(obj)) {
      if (clean(k) === targetClean) return obj[k];
    }

    // 2. Alias match
    for (const [canonical, aliases] of Object.entries(projectAliases)) {
      const allKeys = [canonical, ...aliases].map(clean);
      if (allKeys.includes(targetClean)) {
        for (const k of Object.keys(obj)) {
          if (allKeys.includes(clean(k))) return obj[k];
        }
      }
    }

    return null;
  };

  const localizedDetails = projectDetails[locale] || projectDetails["ru"] || {};

  // All projects from i18n
  const allProjects = t.projects?.items || [];
  const mappedProjects = allProjects.map((p: any, idx: number) => {
    const cmsDetail = findInObj(projectDetails[locale], p.id) || findInObj(projectDetails.ru, p.id) || findInObj(projectDetails.en, p.id) || {};
    const fallbackDetail = findInObj(projectDetailsTranslations[locale], p.id) || findInObj(projectDetailsTranslations.ru, p.id) || findInObj(projectDetailsTranslations.en, p.id) || {};

    const rawTitle = p.name || p.title || cmsDetail.name || fallbackDetail.name || "";
    const rawDesc = (cmsDetail.desc && cmsDetail.desc.trim()) || (cmsDetail.challenge && cmsDetail.challenge.trim()) || (fallbackDetail.desc && fallbackDetail.desc.trim()) || (fallbackDetail.challenge && fallbackDetail.challenge.trim()) || p.desc || "";
    const rawTag = cmsDetail.service || fallbackDetail.service || p.category || "Design";
    const year = cmsDetail.year || fallbackDetail.year || "2026";

    return {
      id: p.id || String(idx),
      title: getLocText(locale, rawTitle, rawTitle),
      image: (p.img && (p.img.startsWith("http") || p.img.startsWith("data:") || p.img.startsWith("/")))
        ? p.img
        : (p.id === "maminy-retsepty" ? coverMoms
          : p.id === "tooko" ? coverTooko
          : (p.id === "sandyq" ? projectImg1 : p.id === "ala-too" ? projectImg2 : p.img)),
      tags: getLocText(locale, rawTag, rawTag),
      year: year,
      desc: getLocText(locale, rawDesc, rawDesc)
    };
  });

  // Block 2: Recent Projects (4 items = 2 rows of 2 cards)
  const recentProjects = mappedProjects.slice(0, 4);

  // Recent Products (4 items = 2 rows of 2 cards)
  const localizedProductDetails = productDetails[locale] || productDetails["ru"] || {};
  const allProducts = t.products?.items || [];
  const mappedProducts = allProducts.map((p: any, idx: number) => {
    const detail = localizedProductDetails[p.id] || {};
    const rawTitle = p.name || p.title || "";
    const rawDesc = detail.desc || detail.challenge || p.desc || "";
    const rawTag = detail.service || p.category || "Product";
    return {
      id: p.id || String(idx),
      title: getLocText(locale, rawTitle, rawTitle),
      image: p.img || (p.images && p.images[0]) || "",
      tags: getLocText(locale, rawTag, rawTag),
      year: detail.year || "2026",
      desc: getLocText(locale, rawDesc, rawDesc)
    };
  });
  const recentProducts = mappedProducts.slice(0, 4);

  // Recent Architecture Projects (2 items = 1 row of 2 cards)
  const allArchitects = t.architects?.items || [];
  const mappedArchitects = allArchitects.map((p: any, idx: number) => {
    const detail = localizedProductDetails[p.id] || localizedDetails[p.id] || {};
    const rawTitle = p.name || p.title || "";
    const rawDesc = detail.desc || detail.challenge || p.desc || "";
    const rawTag = p.tags || detail.service || p.category || "Architecture";
    return {
      id: p.id || String(idx),
      title: getLocText(locale, rawTitle, rawTitle),
      image: p.img || p.image || (p.images && p.images[0]) || "",
      tags: getLocText(locale, rawTag, rawTag),
      year: p.year || detail.year || "2026",
      desc: getLocText(locale, rawDesc, rawDesc)
    };
  });
  const recentArchitects = mappedArchitects.slice(0, 2);

  // Selected / Featured Concepts (from t.home.featuredConcepts or top 4 concepts = 2 rows of 2)
  const allConcepts = t.concepts?.items || [];
  const featuredConceptsRaw = (t.home?.featuredConcepts && Array.isArray(t.home.featuredConcepts) && t.home.featuredConcepts.length > 0)
    ? t.home.featuredConcepts.slice(0, 4)
    : allConcepts.slice(0, 4);

  const featuredConcepts = featuredConceptsRaw.map((fc: any) => {
    const matched = allConcepts.find((c: any) => c.id === fc.id);
    const detail = localizedProductDetails[fc.id] || {};
    const rawTitle = matched?.name || fc.title || fc.name || "";
    const rawDesc = detail.desc || detail.challenge || fc.desc || "";
    const rawTag = detail.service || matched?.category || fc.tag || "Concept";
    return {
      id: fc.id,
      title: getLocText(locale, rawTitle, rawTitle),
      image: fc.image || fc.img || matched?.img || "",
      tags: getLocText(locale, rawTag, rawTag),
      year: detail.year || "2026",
      desc: getLocText(locale, rawDesc, rawDesc)
    };
  });

  // Recent WEB / UI UX Projects (4 items = 2 rows of 2 cards)
  const allWebUiUx = t.webUiUx?.items || [];
  const mappedWebUiUx = allWebUiUx.map((p: any, idx: number) => {
    const detail = localizedDetails[p.id] || {};
    const rawTitle = p.name || p.title || "";
    const rawDesc = detail.desc || detail.challenge || p.desc || "";
    const rawTag = detail.service || p.category || "WEB / UI UX";
    return {
      id: p.id || String(idx),
      title: getLocText(locale, rawTitle, rawTitle),
      image: (p.img && (p.img.startsWith("http") || p.img.startsWith("data:") || p.img.startsWith("/")))
        ? p.img
        : (p.id === "maminy-retsepty" ? coverMoms
          : p.id === "tooko" ? coverTooko
          : (p.id === "sandyq" ? projectImg1 : p.id === "ala-too" ? projectImg2 : p.img)),
      tags: getLocText(locale, rawTag, rawTag),
      year: detail.year || "2026",
      desc: getLocText(locale, rawDesc, rawDesc)
    };
  });
  const recentWebUiUx = mappedWebUiUx.slice(0, 3);

  // Block 5: Selected / Featured Projects (from t.home.projects)
  const featuredProjectsRaw = (t.home?.projects && Array.isArray(t.home.projects) && t.home.projects.length > 0)
    ? t.home.projects
    : allProjects.slice(0, 6);

  const featuredProjects = featuredProjectsRaw.map((fp: any) => {
    const matched = allProjects.find((p: any) => p.id === fp.id);
    const detail = localizedDetails[fp.id] || {};
    const rawTitle = (matched?.name && (fp.title === "Ala-Too" || fp.name === "Ala-Too")) ? matched.name : (matched?.name || fp.title || fp.name || "");
    const rawDesc = detail.desc || detail.challenge || matched?.desc || "";
    const rawTag = fp.category || fp.tag || detail.service || matched?.category || "Design";
    return {
      id: fp.id,
      title: getLocText(locale, rawTitle, rawTitle),
      image: (fp.img && (fp.img.startsWith("http") || fp.img.startsWith("data:") || fp.img.startsWith("/")))
        ? fp.img
        : (fp.id === "maminy-retsepty" ? coverMoms
          : fp.id === "tooko" ? coverTooko
          : (fp.img || fp.image || matched?.img || "")),
      tags: getLocText(locale, rawTag, rawTag),
      year: detail.year || "2026",
      desc: getLocText(locale, rawDesc, rawDesc)
    };
  });

  // Block 3: Advantages list based on i18n about values
  const advantages = [
    { num: "01", title: "Founder", desc: getLocText(locale, "21 год опыта в дизайне — основатель студии.", "21 year of experience in Design - studio founder.", "Дизайндагы 21 жылдык тажрыйба — студиянын негиздөөчүсү.", "21年设计经验 — 工作室创始人", "21 عامًا من الخبرة في التصميم - مؤسس الاستوديو", "21 Jahre Erfahrung im Design – Studio-Gründer") },
    { num: "02", title: "Studio", desc: getLocText(locale, "2011 год — опыт работы как студия.", "2011 year - experience as studio.", "2011-жылдан бери — студия катары тажрыйба.", "自2011年起作为专业工作室的丰富经验", "خبرة كاستوديو محترف منذ عام 2011", "Erfahrung als Studio seit 2011") },
    { num: "03", title: "Global", desc: getLocText(locale, "Проекты для рынков Центральной Азии, Европы и digital-first команд.", "Projects for Central Asia, Europe and digital-first teams.", "Борбордук Азия, Европа жана санарип биринчи командалар үчүн долбоорлор.", "服务于中亚、欧洲和数字优先团队的项目。", "مشاريع لأسواق آسيا الوسطى وأوروبا والفرق الرقمية.", "Projekte für Zentralasien, Europa und Digital-First-Teams.") },
    { num: "04", title: "Principle", desc: getLocText(locale, "Становимся частью каждого проекта поэтому переживаем вместе с клиентом и стараемся делать работу по совести. Никаких громких пустых слов, просто делаем как должно быть.", "We become a part of every project, so we care deeply alongside the client and strive to work with integrity. No empty loud words, we simply do things as they should be done.", "Ар бир долбоордун бир бөлүгү болобуз, ошондуктан кардар менен бирге сарсанаа болуп, ишти абийир менен жасоого аракет кылабыз. Эч кандай куру сөз жок, жөн гана кандай болушу керек болсо, ошондой кылабыз.", "我们深融于每个项目，与客户同频共振，以诚做事。无句虚言，唯求至臻。", "نصبح جزءًا من كل مشروع، لذا نهتم بعمق جنباً إلى جنب مع العميل ونحافظ على النزاهة.", "Wir werden Teil jedes Projekts, arbeiten mit Integrität und ohne leere Versprechungen.") }
  ];

  // Block 4: Services list (Top 5 main services: Branding, Industrial Design, Marketing, Concept Design, Game Dev)
  const mainServiceIds = ["01", "03", "09", "06", "13"];

  const hasRussian = (text: string) => /[а-яА-ЯёЁ]/.test(text);
  let servicesSource = t;
  if (locale !== "ru" && t.services?.items?.some((s: any) => s.id === "01" && hasRussian(s.title))) {
    servicesSource = translations[locale];
  }
  const allItems = servicesSource.services?.items || [];
  
  const filteredServices = mainServiceIds
    .map(id => allItems.find((s: any) => s.id === id))
    .filter(Boolean);

  const finalItems = filteredServices.length === 5 ? filteredServices : allItems.slice(0, 5);

  const servicesList = finalItems.map((service: any) => {
    let homeSource = t;
    if (locale !== "ru" && t.home?.services?.some((s: any) => s[0] === "01" && hasRussian(s[1]))) {
      homeSource = translations[locale];
    }
    const match = homeSource.home.services?.find((s: any) => s[0] === service.id || s[1].toLowerCase() === service.title.toLowerCase());
    let imgUrl = match ? match[3] : "";
    
    // Use high-quality Unsplash design placeholders for immediate presentation
    if (!imgUrl || imgUrl.includes("supabase.co")) {
      if (service.id === "01") {
        imgUrl = "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600";
      } else if (service.id === "03") {
        imgUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600";
      } else if (service.id === "09") {
        imgUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600";
      } else if (service.id === "13") {
        imgUrl = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600";
      } else {
        imgUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600";
      }
    }
    
    return {
      ...service,
      imgUrl
    };
  });

  // Block 6: Brands list
  const brands = t.home.brands || [];

  return (
    <div className="w-full flex flex-col pt-[80px] md:pt-[120px] lg:pt-[160px] pb-[120px] gap-[120px] md:gap-[140px] lg:gap-[160px]">
      
      {/* 1 БЛОК: Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start">
        {/* Left: Big Display Brand Mark */}
        <div className="lg:col-span-3 pr-4">
          <h1 className="text-[40px] xs:text-[48px] md:text-[90px] lg:text-[110px] xl:text-[124px] leading-[0.85] tracking-[-0.05em] font-bold uppercase text-black m-0 pt-1">
            AT FIRST<br /><span className="text-[#0000FF]">DESIGN</span>
          </h1>
        </div>
        {/* Right: Description aligned under HOME nav */}
        <div className="lg:col-span-9 pt-4 flex justify-end">
          <div className="w-[var(--sds-nav-cluster-width,680px)] max-w-full">
            <p className="text-[17px] leading-[1.44] text-black m-0 max-w-[560px]">
              {getLocText(
                locale,
                "Все что вы видите является одним из первичных звеньев того, как мы воспринимаем наш физический мир, именно поэтому философия студии это Дизайн в первую очередь",
                "Everything you see is but a primary link in how we perceive our physical world, which is why the studio's philosophy is Design at first."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 2 БЛОК: Recent Projects (Недавние проекты) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[30px] flex justify-between items-baseline ">
          <div className="flex flex-col">
            <span className="font-mono text-[18px] text-[#808080] uppercase tracking-[0.04em]">SDST</span>
            <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Недавние проекты", "Recent projects", "Жакында долбоорлор")}
            </h2>
          </div>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[02/RECENT]</span>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
          {recentProjects.map((project, index) => (
            <div key={`recent-${project.id}`} className="w-full flex flex-col group"
              style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
              <Link to={`/projects/${project.id}`} className="group flex flex-col flex-1">
                <div className="w-full bg-transparent overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                  <ImageWithFallback 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover scale-[1.02] transition duration-500 group-hover:brightness-75"
                  />
                </div>
                <div className="mt-[25px] flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4 md:gap-0">
                    {/* Left block: label + title */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                        0{index + 1} / NEW
                      </span>
                      <h3 className="text-[22px] xs:text-[28px] font-semibold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.desc && (
                        <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                          {project.desc}
                        </p>
                      )}
                    </div>
                    {/* Vertical divider stretching to end of description */}
                    <div className="hidden md:block w-[1px] bg-black/60 mx-6 shrink-0 self-stretch my-0.5"></div>
                    {/* Right block: category + year */}
                    <div className="text-left flex flex-col gap-1 shrink-0 md:max-w-[40%] self-start">
                      <span className="text-[13px] tracking-[0.04em] text-[#808080] uppercase">{project.tags}</span>
                      <span className="font-mono text-[13px] tracking-[0.04em] text-black">{project.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>



      {/* 3 БЛОК: Advantages (Преимущества) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[28px] flex flex-col xs:flex-row justify-between items-start xs:items-baseline gap-2 ">
          <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0">
            {getLocText(locale, "Преимущества", "Advantages", "Артыкчылыктар")}
          </h2>
          <span className="font-mono text-[14px] xs:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 xs:pb-[15px] shrink-0">[03/VALUES]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[59px] pt-[28px] items-start">
          {/* Left Column: Divided into 2 display stats */}
          <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8  pr-4">
            {/* Stat 1: Founder Experience */}
            <div className="flex flex-col gap-1">
              <div className="text-[54px] xs:text-[70px] sm:text-[88px] md:text-[100px] font-normal leading-none tracking-[-0.06em] text-[#0000FF] m-0">
                21+
              </div>
              <span className="font-mono text-[12px] md:text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                {getLocText(locale, "Год опыта в дизайне — основатель студии", "Years of experience in Design — studio founder", "Дизайндагы 21 жылдык тажрыйба", "设计领域从业年限 — 工作室创始人", "سنوات الخبرة في التصميم - مؤسس الاستوديو", "Jahre Erfahrung im Design - Studio-Gründer")}
              </span>
            </div>

            <div className="h-px w-full bg-[#808080]/20" />

            {/* Stat 2: Studio Experience */}
            <div className="flex flex-col gap-1">
              <div className="text-[54px] xs:text-[70px] sm:text-[88px] md:text-[100px] font-normal leading-none tracking-[-0.06em] text-black m-0">
                2011
              </div>
              <span className="font-mono text-[12px] md:text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                {getLocText(locale, "Опыт работы как студия", "Experience as studio", "Студия катары тажрыйба", "工作室运营历程", "خبرة العمل كاستوديو", "Erfahrung als Studio")}
              </span>
            </div>
          </div>

          {/* Right Column: Stacked list rows */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[#808080] w-full">
            {advantages.map((adv) => (
              <div key={adv.num} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-8 first:pt-0 last:pb-0 items-start group">
                {/* Title and Index Container */}
                <div className="md:col-span-5 flex items-start gap-4 pt-1">
                  <div className="font-mono text-[16px] text-[#808080] shrink-0">
                    [{adv.num}]
                  </div>
                  <h3 className="text-[21px] font-normal tracking-[-0.21px] text-black m-0 uppercase group-hover:text-[#0000FF] transition-colors duration-300">
                    {adv.title}
                  </h3>
                </div>
                {/* Advantage Description */}
                <div className="col-span-11 md:col-span-7 md:pl-4 pt-1">
                  <p className="text-[17px] leading-[1.44] text-[#808080] m-0 group-hover:text-black transition-colors duration-300">
                    {adv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 4 БЛОК: Recent Products (Недавние продукты) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[59px] flex justify-between items-baseline ">
          <div className="flex flex-col">
            <span className="font-mono text-[18px] text-[#808080] uppercase tracking-[0.04em]">SDST</span>
            <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Недавние продукты", "Recent products", "Жакында өнүмдөр")}
            </h2>
          </div>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[04/PRODUCTS]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
          {recentProducts.map((product, index) => (
            <div key={`recent-prod-${product.id}`} className="w-full flex flex-col group"
              style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
              <Link to={`/products/${product.id}`} className="group flex flex-col flex-1">
                <div className="w-full bg-transparent overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                  <ImageWithFallback 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover scale-[1.02] transition duration-500 group-hover:brightness-75"
                  />
                </div>
                <div className="mt-[25px] flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4 md:gap-0">
                    {/* Left block: label + title */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                        0{index + 1} / PRODUCT
                      </span>
                      <h3 className="text-[22px] xs:text-[28px] font-semibold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                        {product.title}
                      </h3>
                      {product.desc && (
                        <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                          {product.desc}
                        </p>
                      )}
                    </div>
                    {/* Vertical divider stretching to end of description */}
                    <div className="hidden md:block w-[1px] bg-black/60 mx-6 shrink-0 self-stretch my-0.5"></div>
                    {/* Right block: category + year */}
                    <div className="text-left flex flex-col gap-1 shrink-0 md:max-w-[40%] self-start">
                      <span className="text-[13px] tracking-[0.04em] text-[#808080] uppercase">{product.tags}</span>
                      <span className="font-mono text-[13px] tracking-[0.04em] text-black">{product.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4.5 БЛОК: Architecture (Архитектура - 2 плашки) */}
      {recentArchitects.length > 0 && (
        <section className="flex flex-col w-full">
          <div className="pb-4 mb-[59px] flex justify-between items-baseline ">
            <div className="flex flex-col">
              <span className="font-mono text-[18px] text-[#808080] uppercase tracking-[0.04em]">SDST</span>
              <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
                {t.architects?.title || getLocText(locale, "Архитектура", "Architecture", "Архитектура", "建筑设计", "الهندسة المعمارية", "Architektur")}
              </h2>
            </div>
            <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[04.5/ARCHITECTURE]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
            {recentArchitects.map((project, index) => (
              <div key={`recent-arch-${project.id}`} className="w-full flex flex-col group"
                style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
                <Link to={`/architect-projects/${project.id}`} className="group flex flex-col flex-1">
                  <div className="w-full bg-transparent overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                    <ImageWithFallback 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover scale-[1.02] transition duration-500 group-hover:brightness-75"
                    />
                  </div>
                  <div className="mt-[25px] flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4 md:gap-0">
                      {/* Left block: label + title */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                          0{index + 1} / ARCHITECTURE
                        </span>
                        <h3 className="text-[22px] xs:text-[28px] font-semibold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                          {project.title}
                        </h3>
                        {project.desc && (
                          <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                            {project.desc}
                          </p>
                        )}
                      </div>
                      {/* Vertical divider stretching to end of description */}
                      <div className="hidden md:block w-[1px] bg-black/60 mx-6 shrink-0 self-stretch my-0.5"></div>
                      {/* Right block: category + year */}
                      <div className="text-left flex flex-col gap-1 shrink-0 md:max-w-[40%] self-start">
                        <span className="text-[13px] tracking-[0.04em] text-[#808080] uppercase">{project.tags}</span>
                        <span className="font-mono text-[13px] tracking-[0.04em] text-black">{project.year}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5 БЛОК: Services (Услуги) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[28px] flex justify-between items-baseline ">
          <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
            {getLocText(locale, "Услуги", "Services", "Кызматтар")}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[05/SERVICES]</span>
        </div>

        <div className="flex flex-col w-full">
          {servicesList.map((service, index) => (
            <div 
              key={`service-${service.id}`} 
              className={`flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 p-6 md:p-8 relative group cursor-pointer items-start border transition-all duration-300 ${
                index === 0 ? 'border-transparent hover:border-black' : 'border-t-[#808080]/30 border-x-transparent border-b-transparent hover:border-black'
              }`}
            >
              {/* Title and Index Container */}
              <div className="md:col-span-5 flex items-start gap-4 z-10 pt-1">
                <div className="font-mono text-[16px] text-[#808080] shrink-0">
                  [0{index + 1}]
                </div>
                <h3 className="text-[21px] font-normal tracking-[-0.21px] text-black m-0 uppercase group-hover:text-[#0000FF] transition-colors duration-300">
                  {service.title}
                </h3>
              </div>

              {/* Col 6-12: Description */}
              <div className="md:col-span-7 z-10 flex justify-start md:justify-end">
                <p className="text-[15px] sm:text-[17px] leading-[1.44] text-[#808080] m-0 max-w-[500px] text-left md:text-right group-hover:text-black transition-colors duration-300">
                  {service.desc}
                </p>
              </div>

              {/* Full width Accordion Expand Work Stages & Order Button */}
              <div className="w-full md:col-span-12 grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out mt-0 group-hover:mt-6 z-10">
                <div className="overflow-hidden transition-all duration-500">
                  <div className="w-full pt-6 border-t border-[#808080]/15 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    {/* Workflow steps: 3 columns spanning col-span-9 */}
                    {service.steps && service.steps.length > 0 && (
                      <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {service.steps.map((stepText: string, stepIdx: number) => (
                          <div key={stepIdx} className="flex flex-col gap-2">
                            <span className="font-mono text-[15px] text-[#0000FF] font-bold tracking-[0.04em] uppercase">
                              [0{stepIdx + 1}/STAGE]
                            </span>
                            <p className="text-[16px] leading-[1.5] text-black m-0 font-normal">
                              {stepText}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Order Button: aligned in col-span-3 in the same row! */}
                    <div className="md:col-span-3 flex justify-start md:justify-end items-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.dispatchEvent(new CustomEvent("sds:open-contact-modal"));
                        }}
                        className="w-full sm:w-auto border border-[#0000FF] text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300 px-6 py-3 font-mono text-[13px] uppercase tracking-[0.06em] cursor-pointer  text-center"
                      >
                        {locale === "ru" ? "Заказать услугу →" : locale === "kg" ? "Кызматты заказ кылуу →" : "Order service →"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

         {/* View all services button */}
        <div className="mt-[12px] w-full z-10">
          <Link 
            to="/services" 
            className="block w-full border border-[#0000FF] py-[20px] text-[17px] font-mono tracking-[0.06em] uppercase text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300  text-center"
          >
            {locale === "ru" ? "Смотреть все услуги \u2192" : locale === "kg" ? "Бардык кызматтарды көрүү \u2192" : "View all services \u2192"}
          </Link>
        </div>
      </section>



      {/* 6 БЛОК: Featured Projects (Избранные проекты) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[59px] flex justify-between items-baseline ">
          <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
            {getLocText(locale, "Избранные проекты", "Featured projects", "Тандалган долбоорлор")}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[06/FEATURED]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[28px] gap-y-[48px]">
          {featuredProjects.map((project, index) => (
            <div key={`featured-${project.id}`} className="w-full flex flex-col group"
              style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
              <Link to={`/projects/${project.id}`} className="group flex flex-col flex-1">
                <div className="w-full overflow-hidden relative aspect-[16/9] flex items-center justify-center transition duration-500 rounded-[8px] bg-transparent">
                  <ImageWithFallback
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover scale-[1.02] transition duration-500 group-hover:brightness-75"
                  />
                </div>
                <div className="mt-[25px] flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4 md:gap-0">
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                        {String(index + 1).padStart(2, '0')} / WORK
                      </span>
                      <h3 className="text-[22px] xs:text-[28px] font-semibold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.desc && (
                        <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">{project.desc}</p>
                      )}
                    </div>
                    <div className="text-left flex flex-col gap-1 shrink-0 md:max-w-[40%] self-start">
                      <span className="text-[13px] tracking-[0.04em] text-[#808080] uppercase">{project.tags}</span>
                      <span className="font-mono text-[13px] tracking-[0.04em] text-black">{project.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 7 БЛОК: Brands (Бренды) */}
      <section className="flex flex-col w-full overflow-hidden mb-[100px]">
        <div className="pb-4 mb-[59px] ">
          <div className="flex justify-between items-baseline">
            <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Бренды", "Selected brands", "Бренддер")}
            </h2>
            <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[07/BRANDS]</span>
          </div>
          <p className="text-[#808080] text-[16px] leading-[1.44] m-0 font-normal mt-2 max-w-[600px]">
            {getLocText(locale, "Знакомые вам бренды которые были созданы или обрели обновленный стиль благодаря нашей студии", "Brands you know that were created or have been renewed thanks to our studio", "Сизге тааныш болгон бренддер биздин студия тарабынан түзүлгөн же жаңыланган стилге ээ болгон")}
          </p>
        </div>

        {/* Marquee slider container */}
        <div className="relative w-full overflow-hidden py-6 ">
          {/* Edge Hover Speedup Triggers */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-[15%] z-20 cursor-w-resize"
            onMouseEnter={() => { edgeHoverRef.current = "left"; }}
            onMouseLeave={() => { edgeHoverRef.current = null; }}
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-[15%] z-20 cursor-e-resize"
            onMouseEnter={() => { edgeHoverRef.current = "right"; }}
            onMouseLeave={() => { edgeHoverRef.current = null; }}
          />

          <div ref={marqueeRef} className="flex w-[200%]">
            {/* First loop */}
            <div className="flex justify-start items-center shrink-0 gap-[100px] pr-[100px]">
              {brands.map((brand: any, idx: number) => (
                <div 
                  key={`brand-a-${idx}`} 
                  className="flex flex-col items-center shrink-0 group relative z-10 cursor-pointer"
                  onMouseEnter={() => { hoveredIdxRef.current = idx; }}
                  onMouseLeave={() => { hoveredIdxRef.current = null; }}
                >
                  {brand.logoUrl ? (
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.tag} 
                      className="h-[120px] max-w-[360px] object-contain opacity-50 filter grayscale group-hover:opacity-100 transition duration-500 ease-out" 
                    />
                  ) : (
                    <span className="font-mono text-[16px] tracking-[0.04em] uppercase text-[#808080] group-hover:text-black transition-colors duration-500">
                      {brand.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Second loop (duplication for seamless animation) */}
            <div className="flex justify-start items-center shrink-0 gap-[100px] pr-[100px]">
              {brands.map((brand: any, idx: number) => (
                <div 
                  key={`brand-b-${idx}`} 
                  className="flex flex-col items-center shrink-0 group relative z-10 cursor-pointer"
                  onMouseEnter={() => { hoveredIdxRef.current = idx; }}
                  onMouseLeave={() => { hoveredIdxRef.current = null; }}
                >
                  {brand.logoUrl ? (
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.tag} 
                      className="h-[120px] max-w-[360px] object-contain opacity-50 filter grayscale group-hover:opacity-100 transition duration-500 ease-out" 
                    />
                  ) : (
                    <span className="font-mono text-[16px] tracking-[0.04em] uppercase text-[#808080] group-hover:text-black transition-colors duration-500">
                      {brand.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7.5 БЛОК: Featured Concepts (Избранные концепты на Главной - 2 в ряд) */}
      {featuredConcepts.length > 0 && (
        <section className="flex flex-col w-full">
          <div className="pb-4 mb-[59px] flex justify-between items-baseline ">
            <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Концепты и видение", "Concepts & Vision", "Концепциялар жана көрүнүш", "概念与愿景", "المفاهيم والرؤية", "Konzepte & Vision")}
            </h2>
            <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[07.5/FEATURED-CONCEPTS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
            {featuredConcepts.map((concept, index) => (
              <div key={`feat-concept-${concept.id}`} className="w-full flex flex-col group"
                style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
                <Link to={`/concepts-and-vision/${concept.id}`} className="group flex flex-col flex-1">
                  <div className="w-full bg-transparent overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                    <ImageWithFallback 
                      src={concept.image} 
                      alt={concept.title} 
                      className="w-full h-full object-cover scale-[1.02] transition duration-500 group-hover:brightness-75"
                    />
                  </div>
                  <div className="mt-[25px] flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4 md:gap-0">
                      {/* Left block: label + title */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                          0{index + 1} / CONCEPT
                        </span>
                        <h3 className="text-[22px] xs:text-[28px] font-semibold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                          {concept.title}
                        </h3>
                        {concept.desc && (
                          <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                            {concept.desc}
                          </p>
                        )}
                      </div>
                      {/* Vertical divider stretching to end of description */}
                      <div className="hidden md:block w-[1px] bg-black/60 mx-6 shrink-0 self-stretch my-0.5"></div>
                      {/* Right block: category + year */}
                      <div className="text-left flex flex-col gap-1 shrink-0 md:max-w-[40%] self-start">
                        <span className="text-[13px] tracking-[0.04em] text-[#808080] uppercase">{concept.tags}</span>
                        <span className="font-mono text-[13px] tracking-[0.04em] text-black">{concept.year}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8 БЛОК: Откуда мы начинали (Archives 2005–2020) */}
      <ArchiveOriginsSection limit={8} showYearFilter={false} noPadding={true} />

      {/* 9 БЛОК: Recent WEB / UI UX Projects (Недавние проекты WEB / UI UX) */}
      {recentWebUiUx.length > 0 && (
        <section className="flex flex-col w-full">
          <div className="pb-4 mb-[59px] flex justify-between items-baseline ">
            <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Недавние проекты WEB / UI UX", "Recent WEB / UI UX projects", "Акыркы WEB / UI UX долбоорлору", "近期网页与UI/UX项目", "المشاريع الأخيرة للويب وواجهات المستخدم", "Neueste WEB / UI UX Projekte")}
            </h2>
            <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[09/WEB-UI-UX]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[28px] gap-y-[48px]">
            {recentWebUiUx.map((project, index) => (
              <div key={`recent-web-${project.id}`} className="w-full flex flex-col group"
                style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
                <Link to={`/web-ui-ux/${project.id}`} className="group flex flex-col flex-1">
                  <div className="w-full bg-transparent overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                    <ImageWithFallback 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover scale-[1.02] transition duration-500 group-hover:brightness-75"
                    />
                  </div>
                  <div className="mt-[25px] flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-stretch w-full gap-4 md:gap-0">
                      {/* Left block: label + title */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                          0{index + 1} / WEB UI UX
                        </span>
                        <h3 className="text-[22px] xs:text-[28px] font-semibold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                          {project.title}
                        </h3>
                        {project.desc && (
                          <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                            {project.desc}
                          </p>
                        )}
                      </div>
                      {/* Vertical divider */}
                      <div className="hidden md:block w-[1px] bg-black/60 mx-6 shrink-0 self-stretch my-0.5"></div>
                      {/* Right block: category + year */}
                      <div className="text-left flex flex-col gap-1 shrink-0 md:max-w-[40%] self-start">
                        <span className="text-[13px] tracking-[0.04em] text-[#808080] uppercase">{project.tags}</span>
                        <span className="font-mono text-[13px] tracking-[0.04em] text-black">{project.year}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
