import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { LanguageContext } from "../i18n";
import { cmsService } from "../cmsService";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import projectImg1 from "../../imports/image.png";
import projectImg2 from "../../imports/image_2026-06-09_10-31-16.png";

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

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
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
      image: (p.img && (p.img.startsWith("http") || p.img.startsWith("data:") || p.img.startsWith("/")))
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
    { num: "01", title: "about[01]", desc: "15+ лет настоящего опыта в независимой сфере с 2011 года создаем бренды и направления" },
    { num: "02", title: "global[02]", desc: "Проекты для рынков Центральной Азии, Европы и digital-first команд." },
    { num: "03", title: "principle[03]", desc: "Who you gonna call?" }
  ] : locale === "kg" ? [
    { num: "01", title: "about[01]", desc: "15+ жылдык көз карандысыз тармактагы чыныгы тажрыйба, 2011-жылдан бери бренддерди жана багыттарды түзүп келебиз." },
    { num: "02", title: "global[02]", desc: "Борбордук Азия, Европа жана санарип биринчи командалар үчүн долбоорлор." },
    { num: "03", title: "principle[03]", desc: "Who you gonna call?" }
  ] : [
    { num: "01", title: "about[01]", desc: "15+ years of real experience in the independent industry, creating brands and directions since 2011." },
    { num: "02", title: "global[02]", desc: "Projects for Central Asia, Europe and digital-first teams." },
    { num: "03", title: "principle[03]", desc: "Who you gonna call?" }
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
    <div className="w-full flex flex-col pt-[40px] pb-[150px] gap-[150px]">
      
      {/* 1 БЛОК: Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start">
        {/* Left Column: Big Display Brand Mark */}
        <div className="lg:col-span-6 pr-4">
          <h1 className="text-[48px] md:text-[90px] lg:text-[110px] xl:text-[124px] leading-[0.85] tracking-[-0.05em] font-normal uppercase text-black m-0 pt-1">
            AT FIRST<br /><span className="text-[#0000FF]">DESIGN</span>
          </h1>

        </div>
        
        {/* Right Column: Studio Description Block */}
        <div className="lg:col-span-6 pt-4 flex justify-end">
          <div className="w-full max-w-[680px] xl:max-w-[700px]">
            <p className="text-[17px] leading-[1.44] text-[#808080] m-0 max-w-[400px]">
              {locale === "ru" 
                ? "Все что вы видите является одним из первичных звеньев того, как мы воспринимаем наш физический мир, именно поэтому философия студии это Дизайн в первую очередь" 
                : "Everything you see is but a primary link in how we perceive our physical world, which is why the studio's philosophy is Design at first."}
            </p>
          </div>
        </div>
      </section>

      {/* 2 БЛОК: Recent Projects (Недавние проекты) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[59px] flex justify-between items-baseline select-none">
          <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase m-0 text-black">
            {locale === "ru" ? "недавние проекты" : locale === "kg" ? "жакында долбоорлор" : "recent projects"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[02/RECENT]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[59px]">
          {recentProjects.map((project, index) => (
            <div key={`recent-${project.id}`} className="w-full flex flex-col group">
              <Link to={`/projects/${project.id}`} className="group flex flex-col flex-1">
                <div className="w-full bg-[#191919] overflow-hidden relative aspect-[16/9] flex items-center justify-center">
                  <ImageWithFallback 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-75"
                  />
                </div>
                <div className="mt-[25px] flex flex-col">
                  <div className="flex justify-between items-start w-full">
                    {/* Left block: label + title */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <span className="font-mono text-[16px] text-[#808080]">
                        0{index + 1} / NEW
                      </span>
                      <h3 className="text-[21px] font-bold leading-[1.40] tracking-[-0.21px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.desc && (
                        <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">
                          {project.desc}
                        </p>
                      )}
                    </div>
                    {/* Vertical divider */}
                    <div className="w-[1px] bg-[#808080] mx-6 shrink-0 self-stretch"></div>
                    {/* Right block: category + year */}
                    <div className="text-left flex flex-col gap-1 shrink-0">
                      <span className="text-[16px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">{project.tags}</span>
                      <span className="font-mono text-[16px] tracking-[0.04em] text-black whitespace-nowrap">{project.year}</span>
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
        <div className="pb-4 mb-[28px] flex justify-between items-baseline select-none">
          <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase m-0">
            {locale === "ru" ? "преимущества" : locale === "kg" ? "артыкчылыктар" : "advantages"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[03/VALUES]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[59px] pt-[28px] items-start">
          {/* Left Column: Big typographic display stat */}
          <div className="lg:col-span-5 flex flex-col select-none">
            <div className="text-[120px] md:text-[160px] lg:text-[180px] font-normal leading-none tracking-[-0.06em] text-[#0000FF] m-0">
              15+
            </div>
          </div>

          {/* Right Column: Stacked list rows */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[#808080] w-full">
            {advantages.map((adv) => (
              <div key={adv.num} className="grid grid-cols-12 gap-4 py-8 first:pt-0 last:pb-0 items-start group">
                {/* Index number */}
                <div className="col-span-1 font-mono text-[16px] text-[#808080] pt-1">
                  [{adv.num}]
                </div>
                {/* Advantage Title */}
                <div className="col-span-11 md:col-span-4 pt-1">
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
          <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase m-0 text-black">
            {locale === "ru" ? "услуги" : locale === "kg" ? "кызматтар" : "services"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[04/SERVICES]</span>
        </div>

        <div className="flex flex-col w-full">
          {servicesList.map((service, index) => (
            <div 
              key={`service-${service.id}`} 
              className={`grid grid-cols-1 md:grid-cols-12 gap-4 py-8 relative group cursor-pointer items-start ${
                index === 0 ? '' : 'border-t border-[#808080]'
              }`}
            >
              {/* Col 1: Index */}
              <div className="col-span-1 font-mono text-[16px] text-[#808080] z-10">
                [0{index + 1}]
              </div>

              {/* Col 2-5: Title */}
              <div className="col-span-11 md:col-span-4 z-10">
                <h3 className="text-[21px] font-normal tracking-[-0.21px] text-black m-0 uppercase group-hover:text-[#0000FF] transition-colors duration-300">
                  {service.title}
                </h3>
              </div>

              {/* Col 6-12: Description */}
              <div className="col-span-11 md:col-span-7 z-10 flex justify-start md:justify-end">
                <p className="text-[17px] leading-[1.44] text-[#808080] m-0 max-w-[500px] text-left md:text-right group-hover:text-black transition-colors duration-300">
                  {service.desc}
                </p>
              </div>

              {/* Col 12: Full width Accordion Expand Image Wrapper */}
              <div className="col-span-12 grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out mt-0 group-hover:mt-6 z-0">
                <div className="overflow-hidden transition-all duration-500">
                  {service.imgUrl && (
                    <div className="w-full aspect-[21/6] md:aspect-[32/7] bg-[#191919] overflow-hidden border border-[#808080]/20">
                      <img 
                        src={service.imgUrl} 
                        alt={service.title} 
                        className="w-full h-full object-cover opacity-90 filter grayscale hover:grayscale-0 transition-all duration-500" 
                      />
                    </div>
                  )}
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
            {locale === "ru" ? "смотреть все услуги \u2192" : locale === "kg" ? "бардык кызматтарды көрүү \u2192" : "view all services \u2192"}
          </Link>
        </div>
      </section>



      {/* 5 БЛОК: Featured Projects (Избранные проекты) */}
      <section className="flex flex-col w-full">
        <div className="pb-4 mb-[59px] flex justify-between items-baseline select-none">
          <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase m-0">
            {locale === "ru" ? "избранные проекты" : locale === "kg" ? "тандалган иштер" : "featured projects"}
          </h2>
          <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">[05/FEATURED]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[59px]">
          {featuredProjects.map((project, index) => (
            <div key={`featured-${project.id}`} className="w-full flex flex-col group">
              <Link to={`/projects/${project.id}`} className="group flex flex-col flex-1">
                <div className={`w-full overflow-hidden relative aspect-[16/9] flex items-center justify-center transition-all duration-500 rounded-[8px] ${
                  index % 2 === 1 
                    ? 'bg-[#0000FF]/5' 
                    : 'bg-[#191919]'
                }`}>
                  <ImageWithFallback 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-75"
                  />
                </div>
                <div className="mt-[25px] flex flex-col">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <span className="font-mono text-[16px] text-[#808080]">
                        {String(index + 1).padStart(2, '0')} / WORK
                      </span>
                      <h3 className="text-[21px] font-bold leading-[1.40] tracking-[-0.21px] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.desc && (
                        <p className="text-[16px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2">{project.desc}</p>
                      )}
                    </div>
                    <div className="w-[1px] bg-[#808080] mx-6 shrink-0 self-stretch"></div>
                    <div className="text-left flex flex-col gap-1 shrink-0">
                      <span className="text-[16px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">{project.tags}</span>
                      <span className="font-mono text-[16px] tracking-[0.04em] text-black whitespace-nowrap">{project.year}</span>
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
            <h2 className="text-[40px] md:text-[54px] font-normal tracking-[-0.04em] lowercase m-0 text-black">
              {locale === "ru" ? "бренды" : locale === "kg" ? "бренддер" : "selected brands"}
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

          <div ref={marqueeRef} className="flex w-[200%] will-change-transform">
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
                      className="h-[120px] max-w-[360px] object-contain opacity-50 filter grayscale group-hover:opacity-100 transition-all duration-500 ease-out" 
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
                      className="h-[120px] max-w-[360px] object-contain opacity-50 filter grayscale group-hover:opacity-100 transition-all duration-500 ease-out" 
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
