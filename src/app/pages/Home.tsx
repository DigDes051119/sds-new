import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../i18n";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { cmsService } from "../cmsService";
import projectImg1 from "../../imports/image_low.webp";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16_low.webp";
import coverMoms from "../../imports/cover_moms.webp";
import coverTooko from "../../imports/cover_tooko.webp";

export function Home() {
  const { t, locale } = useContext(LanguageContext);
  const [projectDetails, setProjectDetails] = useState(() => cmsService.getProjectDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setProjectDetails(cmsService.getProjectDetails());
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

  const localizedDetails = projectDetails[locale] || projectDetails["ru"] || {};

  // All projects from i18n
  const allProjects = t.projects?.items || [];
  const mappedProjects = allProjects.map((p: any, idx: number) => {
    const detail = localizedDetails[p.id] || {};
    return {
      id: p.id || String(idx),
      title: p.name || p.title || "",
      image: p.id === "maminy-retsepty" ? coverMoms
        : p.id === "tooko" ? coverTooko
        : (p.img && (p.img.startsWith("http") || p.img.startsWith("data:") || p.img.startsWith("/")))
          ? p.img
          : (p.id === "sandyq" ? projectImg1 : p.id === "ala-too" ? projectImg2 : p.img),
      tags: detail.service || p.category || "Design",
      year: detail.year || "2026",
      desc: detail.desc || p.desc || ""
    };
  });

  // Block 2: Recent Projects (first 2 items)
  const recentProjects = mappedProjects.slice(0, 2);

  // Block 5: Selected / Featured Projects (next 4 items or all)
  const featuredProjects = mappedProjects;

  // Block 3: Advantages list based on i18n about values
  const advantages = locale === "ru" ? [
    { num: "01", title: "About", desc: "15+ лет настоящего опыта в независимой сфере с 2011 года создаем бренды и направления" },
    { num: "02", title: "Global", desc: "Проекты для рынков Центральной Азии, Европы и digital-first команд." },
    { num: "03", title: "Principle", desc: "Who you gonna call?" }
  ] : locale === "kg" ? [
    { num: "01", title: "About", desc: "15+ жылдык көз карандысыз тармактагы чыныгы тажрыйба, 2011-жылдан бери бренддерди жана багыттарды түзүп келебиз." },
    { num: "02", title: "Global", desc: "Борбордук Азия, Европа жана санарип биринчи командалар үчүн долбоорлор." },
    { num: "03", title: "Principle", desc: "Who you gonna call?" }
  ] : [
    { num: "01", title: "About", desc: "15+ years of real experience in the independent industry, creating brands and directions since 2011." },
    { num: "02", title: "Global", desc: "Projects for Central Asia, Europe and digital-first teams." },
    { num: "03", title: "Principle", desc: "Who you gonna call?" }
  ];

  // Block 4: Services list from t.services.items with image references
  const servicesList = (t.services?.items?.slice(0, 4) || []).map((service: any) => {
    const match = t.home.services?.find((s: any) => s[0] === service.id || s[1].toLowerCase() === service.title.toLowerCase());
    let imgUrl = match ? match[3] : "";
    
    // Use high-quality Unsplash design placeholders for immediate presentation
    if (!imgUrl || imgUrl.includes("supabase.co")) {
      if (service.id === "01") {
        imgUrl = "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600";
      } else if (service.id === "03") {
        imgUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600";
      } else if (service.id === "09" || service.id === "05") {
        imgUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600";
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
    <div className="w-full flex flex-col pt-[40px] pb-[80px] gap-[80px]">
      
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
              {locale === "ru"
                ? "Все что вы видите является одним из первичных звеньев того, как мы воспринимаем наш физический мир, именно поэтому философия студии это Дизайн в первую очередь"
                : locale === "kg"
                ? "Сиз көргөндөрдүн бардыгы биздин физикалык дүйнөнү кабыл алуубуздун баштапкы муундарынын бири болуп саналат, ошондуктан студиянын философиясы — биринчи кезекте Дизайн."
                : "Everything you see is but a primary link in how we perceive our physical world, which is why the studio's philosophy is Design at first."}
            </p>
          </div>
        </div>
      </section>

      {/* 2 БЛОК: Recent Projects (Недавние проекты) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[59px] flex justify-between items-baseline select-none">
          <div className="flex flex-col">
            <span className="font-mono text-[18px] text-[#808080] uppercase tracking-[0.04em]">SDST</span>
            <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-bold tracking-[-0.04em] m-0 text-black">
              {locale === "ru" ? "Недавние проекты" : locale === "kg" ? "Жакында долбоорлор" : "Recent projects"}
            </h2>
          </div>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[02/RECENT]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[28px] gap-y-[48px]">
          {recentProjects.map((project, index) => (
            <div key={`recent-${project.id}`} className="w-full flex flex-col group"
              style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
              <Link to={`/projects/${project.id}`} className="group flex flex-col flex-1">
                <div className="w-full bg-[#191919] overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                  <ImageWithFallback 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition duration-500 group-hover:brightness-75"
                  />
                </div>
                <div className="mt-[25px] flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4 md:gap-0">
                    {/* Left block: label + title */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <span className="font-mono text-[16px] text-[#808080]">
                        0{index + 1} / NEW
                      </span>
                      <h3 className="text-[22px] xs:text-[28px] font-bold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.desc && (
                        <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                          {project.desc}
                        </p>
                      )}
                    </div>
                    {/* Vertical divider */}
                    <div className="hidden md:block w-[1px] bg-[#808080] mx-6 shrink-0 self-stretch"></div>
                    {/* Right block: category + year */}
                    <div className="text-left flex flex-col gap-1 shrink-0 md:max-w-[40%]">
                      <span className="text-[16px] tracking-[0.04em] text-[#808080] uppercase">{project.tags}</span>
                      <span className="font-mono text-[16px] tracking-[0.04em] text-black">{project.year}</span>
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
        <div className="pb-4 mb-[28px] flex flex-col xs:flex-row justify-between items-start xs:items-baseline gap-2 select-none">
          <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-bold tracking-[-0.04em] m-0">
            {locale === "ru" ? "Преимущества" : locale === "kg" ? "Артыкчылыктар" : "Advantages"}
          </h2>
          <span className="font-mono text-[14px] xs:text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-1 xs:pb-[15px] shrink-0">[03/VALUES]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[59px] pt-[28px] items-start">
          {/* Left Column: Big typographic display stat */}
          <div className="lg:col-span-5 flex flex-col select-none">
            <div className="text-[64px] xs:text-[80px] sm:text-[100px] md:text-[160px] lg:text-[180px] font-normal leading-none tracking-[-0.06em] text-[#0000FF] m-0">
              15+
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



      {/* 4 БЛОК: Services (Услуги) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[28px] flex justify-between items-baseline select-none">
          <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-bold tracking-[-0.04em] m-0 text-black">
            {locale === "ru" ? "Услуги" : locale === "kg" ? "Кызматтар" : "Services"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[04/SERVICES]</span>
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
                            <span className="font-mono text-[13px] text-[#0000FF] font-bold tracking-[0.04em] uppercase">
                              [0{stepIdx + 1}/STAGE]
                            </span>
                            <p className="text-[14px] leading-[1.5] text-black m-0 font-normal">
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
                        className="w-full sm:w-auto border border-[#0000FF] text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300 px-6 py-3 font-mono text-[13px] uppercase tracking-[0.06em] cursor-pointer select-none text-center"
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
            className="block w-full border border-[#0000FF] py-[20px] text-[17px] font-mono tracking-[0.06em] uppercase text-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300 select-none text-center"
          >
            {locale === "ru" ? "Смотреть все услуги \u2192" : locale === "kg" ? "Бардык кызматтарды көрүү \u2192" : "View all services \u2192"}
          </Link>
        </div>
      </section>



      {/* 5 БЛОК: Featured Projects (Избранные проекты) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[59px] flex justify-between items-baseline select-none">
          <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-bold tracking-[-0.04em] m-0 text-black">
            {locale === "ru" ? "Избранные проекты" : locale === "kg" ? "Тандалган долбоорлор" : "Featured projects"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[05/FEATURED]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[28px] gap-y-[48px]">
          {featuredProjects.map((project, index) => (
            <div key={`featured-${project.id}`} className="w-full flex flex-col group"
              style={{ contentVisibility: "Auto", containIntrinsicSize: "Auto 400px" }}>
              <Link to={`/projects/${project.id}`} className="group flex flex-col flex-1">
                <div className={`w-full overflow-hidden relative aspect-[16/9] flex items-center justify-center transition duration-500 rounded-[8px] ${
                  index % 2 === 1
                    ? 'bg-[#0000FF]/5' 
                    : 'bg-[#191919]'
                }`}>
                  <ImageWithFallback
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition duration-500 group-hover:brightness-75"
                  />
                </div>
                <div className="mt-[25px] flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4 md:gap-0">
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <span className="font-mono text-[16px] text-[#808080]">
                        {String(index + 1).padStart(2, '0')} / WORK
                      </span>
                      <h3 className="text-[22px] xs:text-[28px] font-bold leading-[1.30] tracking-[-0.28px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.desc && (
                        <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">{project.desc}</p>
                      )}
                    </div>
                    <div className="hidden md:block w-[1px] bg-[#808080] mx-6 shrink-0 self-stretch"></div>
                    <div className="text-left flex flex-col gap-1 shrink-0 md:max-w-[40%]">
                      <span className="text-[16px] tracking-[0.04em] text-[#808080] uppercase">{project.tags}</span>
                      <span className="font-mono text-[16px] tracking-[0.04em] text-black">{project.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6 БЛОК: Brands (Бренды) */}
      <section className="flex flex-col w-full overflow-hidden">
        <div className="pb-4 mb-[59px] select-none">
          <div className="flex justify-between items-baseline">
            <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-bold tracking-[-0.04em] m-0 text-black">
              {locale === "ru" ? "Бренды" : locale === "kg" ? "Бренддер" : "Selected brands"}
            </h2>
            <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[06/BRANDS]</span>
          </div>
          <p className="text-[#808080] text-[16px] leading-[1.44] m-0 font-normal mt-2 max-w-[600px]">
            {locale === "ru" 
              ? "Знакомые вам бренды которые были созданы или обрели обновленный стиль благодаря нашей студии" 
              : locale === "kg" 
                ? "Сизге тааныш болгон бренддер биздин студия тарабынан түзүлгөн же жаңыланган стилге ээ болгон"
                : "Brands you know that were created or have been renewed thanks to our studio"}
          </p>
        </div>

        {/* Marquee slider container */}
        <div className="relative w-full overflow-hidden py-6 select-none">
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

    </div>
  );
}
