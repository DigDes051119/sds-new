import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router";
import { LanguageContext, translations, getLocText } from "../i18n";
import { ArchiveOriginsSection } from "../components/ArchiveOriginsSection";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProjectsNav } from "../components/ProjectsNav";
import { cmsService } from "../cmsService";
import { projectDetailsTranslations } from "../projectDetailsData";
import projectImg1 from "../../imports/image_low.webp";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16_low.webp";
import coverTooko from "../../imports/cover_tooko.webp";
import { findInObjectCaseInsensitive, getProjectCardInfo, COVER_MOMS } from "../utils/slugUtils";

export function Home() {
  const { t, locale } = useContext(LanguageContext);
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());
  const [siteTranslations, setSiteTranslations] = useState(() => cmsService.getTranslations());
  const [activeFilterTab, setActiveFilterTab] = useState("/projects");

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProjectDetails(cmsService.getProjectDetails());
      setProductDetails(cmsService.getProductDetails());
      setSiteTranslations(cmsService.getTranslations());
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
    let halfWidth = el.scrollWidth / 2;

    const onResize = () => {
      if (el) halfWidth = el.scrollWidth / 2;
    };
    window.addEventListener("resize", onResize, { passive: true });

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

  const findInObj = (obj: any, targetId: string) => {
    return findInObjectCaseInsensitive(obj, targetId);
  };

  const localizedDetails = projectDetails[locale] || projectDetails["ru"] || {};

  const allProjects = t.projects?.items || [];
  const mappedProjects = useMemo(() => {
    return allProjects.map((p: any, idx: number) => {
      const cardInfo = getProjectCardInfo(p.id, locale, p, projectDetails, projectDetailsTranslations);

      return {
        id: p.id || String(idx),
        title: cardInfo.title,
        image: (p.img && (p.img.startsWith("http") || p.img.startsWith("data:") || p.img.startsWith("/")))
          ? p.img
          : (p.id === "maminy-retsepty" ? COVER_MOMS
            : p.id === "tooko" ? coverTooko
            : (p.id === "sandyq" ? projectImg1 : p.id === "ala-too" ? projectImg2 : p.img)),
        tags: cardInfo.service,
        year: cardInfo.year,
        desc: cardInfo.desc
      };
    });
  }, [allProjects, locale, projectDetails]);

  // Block 2: Recent Projects (4 items = 2 rows of 2 cards)
  const recentProjects = useMemo(() => mappedProjects.slice(0, 4), [mappedProjects]);

  // Recent Products (4 items = 2 rows of 2 cards)
  const localizedProductDetails = productDetails[locale] || productDetails["ru"] || {};
  const allProducts = t.products?.items || [];
  const mappedProducts = useMemo(() => {
    return allProducts.map((p: any, idx: number) => {
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
  }, [allProducts, localizedProductDetails, locale]);
  const recentProducts = useMemo(() => mappedProducts.slice(0, 4), [mappedProducts]);

  // Recent Architecture Projects (4 items = 2 rows of 2 cards)
  const allArchitects = t.architects?.items || [];
  const mappedArchitects = useMemo(() => {
    return allArchitects.map((p: any, idx: number) => {
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
  }, [allArchitects, localizedProductDetails, localizedDetails, locale]);
  const recentArchitects = useMemo(() => mappedArchitects.slice(0, 4), [mappedArchitects]);

  // Selected / Featured Concepts (4 items = 2 rows of 2 cards)
  const allConcepts = t.concepts?.items || [];
  const featuredConcepts = useMemo(() => {
    let featuredConceptsRaw: any[] = (t.home?.featuredConcepts && Array.isArray(t.home.featuredConcepts) && t.home.featuredConcepts.length > 0)
      ? [...t.home.featuredConcepts]
      : [];

    if (featuredConceptsRaw.length < 4) {
      for (const c of allConcepts) {
        if (!featuredConceptsRaw.some((fc: any) => fc.id === c.id)) {
          featuredConceptsRaw.push({
            id: c.id,
            title: c.name || c.title || "",
            image: c.img || c.image || "",
            tag: c.category || "Concept",
            year: c.year || "2026",
            desc: c.desc || ""
          });
        }
        if (featuredConceptsRaw.length >= 4) break;
      }
    }
    featuredConceptsRaw = featuredConceptsRaw.slice(0, 4);

    return featuredConceptsRaw.map((fc: any) => {
      const matched = allConcepts.find((c: any) => c.id === fc.id);
      const detail = localizedProductDetails[fc.id] || {};
      const rawTitle = matched?.name || fc.title || fc.name || "";
      const rawDesc = detail.desc || detail.challenge || fc.desc || matched?.desc || "";
      const rawTag = detail.service || matched?.category || fc.tag || "Concept";
      return {
        id: fc.id,
        title: getLocText(locale, rawTitle, rawTitle),
        image: fc.image || fc.img || matched?.img || "",
        tags: getLocText(locale, rawTag, rawTag),
        year: detail.year || fc.year || "2026",
        desc: getLocText(locale, rawDesc, rawDesc)
      };
    });
  }, [t.home?.featuredConcepts, allConcepts, localizedProductDetails, locale]);

  // Recent WEB / UI UX Projects (4 items = 2 rows of 2 cards)
  const allWebUiUx = t.webUiUx?.items || [];
  const mappedWebUiUx = useMemo(() => {
    return allWebUiUx.map((p: any, idx: number) => {
      const detail = localizedDetails[p.id] || {};
      const rawTitle = p.name || p.title || "";
      const rawDesc = detail.desc || detail.challenge || p.desc || "";
      const rawTag = detail.service || p.category || "WEB / UI UX";
      return {
        id: p.id || String(idx),
        title: getLocText(locale, rawTitle, rawTitle),
        image: (p.img && (p.img.startsWith("http") || p.img.startsWith("data:") || p.img.startsWith("/")))
          ? p.img
          : (p.id === "maminy-retsepty" ? COVER_MOMS
            : p.id === "tooko" ? coverTooko
            : (p.id === "sandyq" ? projectImg1 : p.id === "ala-too" ? projectImg2 : p.img)),
        tags: getLocText(locale, rawTag, rawTag),
        year: detail.year || "2026",
        desc: getLocText(locale, rawDesc, rawDesc)
      };
    });
  }, [allWebUiUx, localizedDetails, locale]);
  const recentWebUiUx = useMemo(() => mappedWebUiUx.slice(0, 3), [mappedWebUiUx]);

  // Block 5: Selected / Featured Projects (from t.home.projects)
  const featuredProjects = useMemo(() => {
    const featuredProjectsRaw = (t.home?.projects && Array.isArray(t.home.projects) && t.home.projects.length > 0)
      ? t.home.projects
      : allProjects.slice(0, 6);

    return featuredProjectsRaw.map((fp: any) => {
      const matched = allProjects.find((p: any) => p.id === fp.id);
      const cardInfo = getProjectCardInfo(fp.id, locale, matched || fp, projectDetails, projectDetailsTranslations);

      return {
        id: fp.id,
        title: cardInfo.title,
        image: (fp.img && (fp.img.startsWith("http") || fp.img.startsWith("data:") || fp.img.startsWith("/")))
          ? fp.img
          : (fp.id === "maminy-retsepty" ? COVER_MOMS
            : fp.id === "tooko" ? coverTooko
            : (fp.img || fp.image || matched?.img || "")),
        tags: cardInfo.service,
        year: cardInfo.year,
        desc: cardInfo.desc
      };
    });
  }, [t.home?.projects, allProjects, locale, projectDetails]);

  // Dynamic filtered projects for the main page interactive Recent Projects filter tab
  let currentFilteredProjects: any[] = [];
  let detailPathPrefix = "/projects";
  let isArchiveOrVideo = false;

  if (activeFilterTab === "/projects") {
    currentFilteredProjects = mappedProjects.slice(0, 4);
    detailPathPrefix = "/projects";
  } else if (activeFilterTab === "/products") {
    currentFilteredProjects = mappedProducts.slice(0, 4);
    detailPathPrefix = "/products";
  } else if (activeFilterTab === "/architect-projects") {
    currentFilteredProjects = mappedArchitects.slice(0, 4);
    detailPathPrefix = "/architect-projects";
  } else if (activeFilterTab === "/concepts-and-vision") {
    currentFilteredProjects = featuredConcepts.slice(0, 4);
    detailPathPrefix = "/concepts-and-vision";
  } else if (activeFilterTab === "/gamedev") {
    const allGameDev = t.gamedev?.items || [];
    const mappedGameDev = allGameDev.map((p: any, idx: number) => {
      const detail = localizedProductDetails[p.id] || {};
      return {
        id: p.id || String(idx),
        title: getLocText(locale, p.name || p.title || "", p.name || p.title || ""),
        image: p.img || "",
        tags: getLocText(locale, detail.service || p.category || "Gamedev", detail.service || p.category || "Gamedev"),
        year: detail.year || "2026",
        desc: getLocText(locale, detail.desc || detail.challenge || p.desc || "", detail.desc || detail.challenge || p.desc || "")
      };
    });
    currentFilteredProjects = mappedGameDev.slice(0, 4);
    detailPathPrefix = "/gamedev";
  } else if (activeFilterTab === "/web-ui-ux") {
    currentFilteredProjects = mappedWebUiUx.slice(0, 4);
    detailPathPrefix = "/web-ui-ux";
  } else if (activeFilterTab === "/projects/old") {
    isArchiveOrVideo = true;
    detailPathPrefix = "/projects/old";
    const archiveItems = cmsService.getArchiveItems();
    const localizedArchive = archiveItems[locale] || archiveItems["ru"] || [];
    currentFilteredProjects = localizedArchive.slice(0, 4).map((p: any) => ({
      id: p.id,
      title: p.title || p.name || "",
      image: p.images?.[0] || p.img || p.image || "",
      tags: p.category || "Archive",
      year: p.year || "2020",
      desc: p.challenge || p.description || ""
    }));
  } else if (activeFilterTab === "/video") {
    isArchiveOrVideo = true;
    detailPathPrefix = "/video";
    const videoItems = siteTranslations[locale]?.video?.items || siteTranslations["en"]?.video?.items || [];
    currentFilteredProjects = videoItems.slice(0, 4).map((p: any) => {
      const detail = localizedDetails[p.id] || {};
      const displayVideoUrl = detail.videoUrl || p.img || "";
      return {
        id: p.id,
        title: p.name || p.title || "",
        image: p.img || "",
        videoUrl: displayVideoUrl,
        tags: detail.service || p.category || "Video",
        year: detail.year || "2026",
        desc: detail.desc || detail.challenge || p.desc || ""
      };
    });
  } else if (activeFilterTab === "/music") {
    isArchiveOrVideo = true;
    detailPathPrefix = "/music";
    const musicItems = siteTranslations[locale]?.music?.items || siteTranslations["en"]?.music?.items || [];
    currentFilteredProjects = musicItems.slice(0, 4).map((p: any) => ({
      id: p.id,
      title: p.name || p.title || "",
      image: p.img || "",
      tags: p.category || "Music",
      year: p.year || "2026",
      desc: p.desc || p.artist || ""
    }));
  }

  const getRecentProjectsButtonInfo = () => {
    switch (activeFilterTab) {
      case "/concepts-and-vision":
        return {
          to: "/concepts-and-vision",
          label: getLocText(locale, "Смотреть все концепты \u2192", "View all concepts \u2192", "Бардык концепттерди көрүү \u2192", "查看所有概念 \u2192", "عرض جميع المفاهيم \u2192", "Alle Konzepte anzeigen \u2192")
        };
      case "/gamedev":
        return {
          to: "/gamedev",
          label: getLocText(locale, "Смотреть все геймдев проекты \u2192", "View all gamedev projects \u2192", "Бардык геймдев долбоорлорун көрүү \u2192", "查看所有游戏开发项目 \u2192", "عرض جميع مشاريع تطوير الألعاب \u2192", "Alle Gamedev-Projekte anzeigen \u2192")
        };
      case "/web-ui-ux":
        return {
          to: "/web-ui-ux",
          label: getLocText(locale, "Смотреть все Web / UI UX проекты \u2192", "View all Web / UI UX projects \u2192", "Бардык Web / UI UX долбоорлорун көрүү \u2192", "查看所有网页与UI/UX项目 \u2192", "عرض جميع مشاريع الويب وواجهات المستخدم \u2192", "Alle Web / UI UX Projekte anzeigen \u2192")
        };
      case "/projects/old":
        return {
          to: "/projects/old",
          label: getLocText(locale, "Смотреть все старые проекты \u2192", "View all old projects \u2192", "Бардык эски долбоорлорду көрүү \u2192", "查看所有旧项目 \u2192", "عرض جميع المشاريع القديمة \u2192", "Alle alten Projekte anzeigen \u2192")
        };
      case "/video":
        return {
          to: "/video",
          label: getLocText(locale, "Смотреть все видео \u2192", "View all videos \u2192", "Бардык видеолорду көрүү \u2192", "查看所有视频 \u2192", "عرض جميع مقاطع الفيديو \u2192", "Alle Videos anzeigen \u2192")
        };
      case "/music":
        return {
          to: "/music",
          label: getLocText(locale, "Смотреть всю музыку \u2192", "View all music \u2192", "Бардык музыкаларды көрүү \u2192", "查看所有音乐 \u2192", "عرض جميع المقاطع الموسيقية \u2192", "Alle Musik anzeigen \u2192")
        };
      case "/products":
        return {
          to: "/products",
          label: getLocText(locale, "Смотреть все продукты \u2192", "View all products \u2192", "Бардык өнүмдөрдү көрүү \u2192", "查看所有产品 \u2192", "عرض جميع المنتجات \u2192", "Alle Produkte anzeigen \u2192")
        };
      case "/architect-projects":
        return {
          to: "/architect-projects",
          label: getLocText(locale, "Смотреть все проекты архитектуры \u2192", "View all architecture projects \u2192", "Бардык архитектура долбоорлорун көрүү \u2192", "查看所有建筑项目 \u2192", "عرض جميع المشاريع المعمارية \u2192", "Alle Architekturprojekte anzeigen \u2192")
        };
      case "/projects":
      default:
        return {
          to: "/projects",
          label: getLocText(locale, "Смотреть все проекты \u2192", "View all projects \u2192", "Бардык долбоорлорду көрүү \u2192", "查看所有项目 \u2192", "عرض جميع المشاريع \u2192", "Alle Projekte anzeigen \u2192")
        };
    }
  };

  const recentProjectsBtn = getRecentProjectsButtonInfo();

  // Block 3: Advantages list based on i18n about values
  const advantages = [
    { num: "01", title: "Founder", desc: getLocText(locale, "21 год опыта в дизайне — основатель студии.", "21 year of experience in Design - studio founder.", "Дизайндагы 21 жылдык тажрыйба — студиянын негиздөөчүсү.", "21年设计经验 — 工作室创始人", "21 عامًا من الخبرة في التصميم - مؤسс الاستوديو", "21 Jahre Erfahrung im Design – Studio-Gründer") },
    { num: "02", title: "Studio", desc: getLocText(locale, "2011 год — опыт работы как студия.", "2011 year - experience as studio.", "2011-жылдан бери — студия катары тажрыйба.", "自2011年起作为专业工作室的丰富经验", "خبرة كاستوديو محترف منذ عام 2011", "Erfahrung als Studio seit 2011") },
    { num: "03", title: "Global", desc: getLocText(locale, "Проекты для рынков Центральной Азии, Европы и digital-first команд.", "Projects for Central Asia, Europe and digital-first teams.", "Борбордук Азия, Европа жана санарип биринчи командалар үчүн долбоорлор.", "服务于中亚、欧洲和数字优先团队的项目。", "مشاريع لأسواق آسيا الوسطى وأوروبا والفرق الرقمية.", "Projekte für Zentralasien, Europa und Digital-First-Teams.") },
    { num: "04", title: "Principle", desc: getLocText(locale, "Становимся частью каждого проекта поэтому переживаем вместе с клиентом и стараемся делать работу по совести. Никаких громких пустых слов, просто делаем как должно быть.", "We become a part of every project, so we care deeply alongside the client and strive to work with integrity. No empty loud words, we simply do things as they should be done.", "Ар бир долбоордун бир бөлүгү болобуз, ошондуктан кардар менен бирге сарсанаа болуп, ишти абийир менен жасоого аракет кылабыз. Эч кандай куру сөз жок, жөн гана кандай болушу керек болсо, ошондой кылабыз.", "我们深融于每个项目，与客户同频共振，以诚做事。无句虚言，唯求至臻。", "نصبح جزءًا من كل проект, لذا نهتم بعمق جنباً إلى جنب مع العميل ونحافظ على النزاهة.", "Wir werden Teil jedes Projekts, arbeiten mit Integrität und ohne leere Versprechungen.") }
  ];

  // Block 4: Services list (Top 5 main services: Branding, Industrial Design, Marketing, Concept Design, Game Dev)
  const mainServiceIds = ["01", "03", "09", "06", "13"];

  const hasRussian = (text: string) => /[а-яА-ЯёЁ]/.test(text);
  let servicesSource = t;
  if (locale !== "ru" && t.services?.items?.some((s: any) => s.id === "01" && hasRussian(s.title))) {
    servicesSource = siteTranslations[locale];
  }
  const allItems = servicesSource.services?.items || [];
  
  const filteredServices = mainServiceIds
    .map(id => allItems.find((s: any) => s.id === id))
    .filter(Boolean);

  const finalItems = filteredServices.length === 5 ? filteredServices : allItems.slice(0, 5);

  const servicesList = useMemo(() => {
    return finalItems.map((service: any) => {
      let homeSource = t;
      if (locale !== "ru" && t.home?.services?.some((s: any) => s[0] === "01" && hasRussian(s[1]))) {
        homeSource = siteTranslations[locale];
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
        title: getLocText(locale, service.title, service.title),
        desc: getLocText(locale, service.desc, service.desc),
        steps: Array.isArray(service.steps) ? service.steps.map((step: string) => getLocText(locale, step, step)) : [],
        imgUrl
      };
    });
  }, [finalItems, t, siteTranslations, locale]);

  // Block 6: Brands list
  const brands = t.home.brands || [];

  return (
    <div className="w-full flex flex-col pt-[30px] sm:pt-[60px] md:pt-[100px] lg:pt-[140px] pb-[60px] md:pb-[120px] gap-[64px] sm:gap-[90px] md:gap-[130px] lg:gap-[160px]">
      
      {/* 1 БЛОК: Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] md:gap-[28px] items-start">
        {/* Left: Big Display Brand Mark */}
        <div className="lg:col-span-3 pr-0 md:pr-4">
          <h1 className="text-[38px] xs:text-[48px] sm:text-[68px] md:text-[90px] lg:text-[110px] xl:text-[124px] leading-[0.88] tracking-[-0.05em] font-bold uppercase text-black m-0 pt-1">
            AT FIRST<br /><span className="text-[#0000FF]">DESIGN</span>
          </h1>
        </div>
        {/* Right: Description aligned under HOME nav */}
        <div className="lg:col-span-9 pt-2 md:pt-4 flex justify-start lg:justify-end">
          <div className="w-full lg:w-[var(--sds-nav-cluster-width,680px)] max-w-full">
            <p className="text-[15px] sm:text-[17px] leading-[1.44] text-black m-0 max-w-[560px]">
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
        <div className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] flex flex-wrap xs:flex-nowrap justify-between items-end gap-2">
          <div className="flex flex-col">
            <span className="font-mono text-[14px] sm:text-[18px] text-[#808080] uppercase tracking-[0.04em]">SDST</span>
            <h2 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Недавние проекты", "Recent projects", "Жакында долбоорлор")}
            </h2>
          </div>
          <span className="font-mono text-[13px] sm:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 sm:pb-[15px] shrink-0">[02/RECENT]</span>
        </div>

        <ProjectsNav activeTab={activeFilterTab} onTabChange={setActiveFilterTab} />



        <div className={
          activeFilterTab === "/video"
            ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 w-full mt-4"
            : activeFilterTab === "/projects/old"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[20px] lg:gap-x-[24px] gap-y-[40px]"
              : "grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]"
        }>
          {currentFilteredProjects.map((project, index) => {
            if (activeFilterTab === "/video") {
              const isVideo = project.videoUrl?.startsWith("video:") || project.videoUrl?.endsWith(".webm") || project.videoUrl?.endsWith(".mp4");
              const realUrl = project.videoUrl?.startsWith("video:") ? project.videoUrl.slice(6) : project.videoUrl;

              return (
                <div
                  key={`recent-${project.id}-${activeFilterTab}`}
                  className="break-inside-avoid mb-2 w-full group relative cursor-pointer overflow-hidden rounded-[8px] bg-[#111]"
                >
                  <Link to="/video" className="block relative w-full h-full">
                    {isVideo ? (
                      <video
                        src={realUrl}
                        className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.03]"
                        muted
                        playsInline
                        autoPlay
                        loop
                      />
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}

                    {/* Overlay with info on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                      <span className="font-mono text-[11px] text-[#808080] uppercase tracking-[0.04em] mb-1">
                        {project.year} — {project.tags}
                      </span>
                      <h3 className="text-[18px] font-bold text-white uppercase leading-none m-0">
                        {project.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              );
            }

            return (
              <div key={`recent-${project.id}-${activeFilterTab}`} className="w-full flex flex-col group">
                <Link to={isArchiveOrVideo ? detailPathPrefix : `${detailPathPrefix}/${project.id}`} className="group flex flex-col flex-1">
                  <div className={`w-full bg-[#191919] overflow-hidden relative aspect-[16/9] flex items-center justify-center ${activeFilterTab === "/projects/old" ? "rounded-[8px]" : ""}`}>
                    <ImageWithFallback 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover scale-[1.02] transition duration-500 group-hover:brightness-75"
                    />
                  </div>
                  {activeFilterTab === "/projects/old" ? (
                    <div className="mt-[20px] flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                          [{String(index + 1).padStart(2, '0')}] — {project.year}
                        </span>
                        <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em] text-right truncate pl-4">
                          {project.tags}
                        </span>
                      </div>
                      <h3 className="text-[22px] xs:text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.desc && (
                        <p className="text-[15px] leading-[1.4] text-[#808080] m-0 mt-2 font-normal line-clamp-2 pr-4">
                          {project.desc}
                        </p>
                      )}
                    </div>
                  ) : (
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
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* View all projects button for active category */}
        <div className="mt-[32px] sm:mt-[48px] w-full z-10">
          <Link 
            to={recentProjectsBtn.to} 
            className="block w-full border border-[#0000FF] py-[20px] text-[17px] font-mono tracking-[0.06em] uppercase text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300 text-center"
          >
            {recentProjectsBtn.label}
          </Link>
        </div>
      </section>



      {/* 3 БЛОК: Advantages (Преимущества) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[40px] flex flex-col xs:flex-row justify-between items-start xs:items-baseline gap-2 ">
          <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-medium tracking-[-0.04em] m-0">
            {getLocText(locale, "Преимущества", "Advantages", "Артыкчылыктар")}
          </h2>
          <span className="font-mono text-[14px] xs:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 xs:pb-[15px] shrink-0">[03/VALUES]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[59px] pt-0 items-start">
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
        <div className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] flex flex-wrap xs:flex-nowrap justify-between items-end gap-2">
          <div className="flex flex-col">
            <span className="font-mono text-[14px] sm:text-[18px] text-[#808080] uppercase tracking-[0.04em]">SDST</span>
            <h2 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Недавние продукты", "Recent products", "Жакында өнүмдөр")}
            </h2>
          </div>
          <span className="font-mono text-[13px] sm:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 sm:pb-[15px] shrink-0">[04/PRODUCTS]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
          {recentProducts.map((product, index) => (
            <div key={`recent-prod-${product.id}`} className="w-full flex flex-col group">
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
          <div className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] flex flex-wrap xs:flex-nowrap justify-between items-end gap-2">
            <div className="flex flex-col">
              <span className="font-mono text-[14px] sm:text-[18px] text-[#808080] uppercase tracking-[0.04em]">SDST</span>
              <h2 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
                {t.architects?.title || getLocText(locale, "Архитектура", "Architecture", "Архитектура", "建筑设计", "الهندسة المعمارية", "Architektur")}
              </h2>
            </div>
            <span className="font-mono text-[13px] sm:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 sm:pb-[15px] shrink-0">[04.5/ARCHITECTURE]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
            {recentArchitects.map((project, index) => (
              <div key={`recent-arch-${project.id}`} className="w-full flex flex-col group">
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
        <div className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] flex flex-wrap xs:flex-nowrap justify-between items-end gap-2">
          <h2 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
            {getLocText(locale, "Услуги", "Services", "Кызматтар")}
          </h2>
          <span className="font-mono text-[13px] sm:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 sm:pb-[15px] shrink-0">[05/SERVICES]</span>
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
        <div className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] flex flex-wrap xs:flex-nowrap justify-between items-end gap-2">
          <h2 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
            {getLocText(locale, "Избранные проекты", "Featured projects", "Тандалган долбоорлор")}
          </h2>
          <span className="font-mono text-[13px] sm:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 sm:pb-[15px] shrink-0">[06/FEATURED]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[28px] gap-y-[48px]">
          {featuredProjects.map((project, index) => (
            <div key={`featured-${project.id}`} className="w-full flex flex-col group">
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
      <section className="flex flex-col w-full overflow-hidden mb-[60px] md:mb-[100px]">
        <div className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px]">
          <div className="flex flex-wrap xs:flex-nowrap justify-between items-end gap-2">
            <h2 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Бренды", "Selected brands", "Бренддер")}
            </h2>
            <span className="font-mono text-[13px] sm:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 sm:pb-[15px] shrink-0">[07/BRANDS]</span>
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
          <div className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] flex flex-wrap xs:flex-nowrap justify-between items-end gap-2">
            <h2 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Концепты и видение", "Concepts & Vision", "Концепциялар жана көрүнүш", "概念与愿景", "المفاهيم والرؤية", "Konzepte & Vision")}
            </h2>
            <span className="font-mono text-[13px] sm:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 sm:pb-[15px] shrink-0">[07.5/FEATURED-CONCEPTS]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
            {featuredConcepts.map((concept, index) => (
              <div key={`feat-concept-${concept.id}`} className="w-full flex flex-col group">
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
          <div className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] flex flex-wrap xs:flex-nowrap justify-between items-end gap-2">
            <h2 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-medium tracking-[-0.04em] m-0 text-black">
              {getLocText(locale, "Недавние проекты WEB / UI UX", "Recent WEB / UI UX projects", "Акыркы WEB / UI UX долбоорлору", "近期网页与UI/UX项目", "المشاريع الأخيرة للويب وواجهات المستخدم", "Neueste WEB / UI UX Projekte")}
            </h2>
            <span className="font-mono text-[13px] sm:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 sm:pb-[15px] shrink-0">[09/WEB-UI-UX]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[28px] gap-y-[48px]">
            {recentWebUiUx.map((project, index) => (
              <div key={`recent-web-${project.id}`} className="w-full flex flex-col group">
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
