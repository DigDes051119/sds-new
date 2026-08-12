import { useContext, useEffect, useState } from "react";
import { LanguageContext, getLocText } from "../i18n";
import { cmsService } from "../cmsService";
import { Eye, Heart, Zap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Map, MapMarker, MarkerContent, MapPopup } from "../components/ui/map";

const globalLocations = [
  { name: "Bishkek, Kyrgyzstan (HQ)", lng: 74.6186, lat: 42.8710, isHQ: true },
  { name: "Miami, USA", lng: -80.1918, lat: 25.7617 },
  { name: "Washington, USA", lng: -77.0369, lat: 38.8951 },
  { name: "Brussels, Belgium", lng: 4.3517, lat: 50.8503 },
  { name: "Almaty, Kazakhstan", lng: 76.8512, lat: 43.2220 },
  { name: "London, UK", lng: -0.1276, lat: 51.5074 },
  { name: "Toronto, Canada", lng: -79.3832, lat: 43.6532 },
  { name: "Beijing, China", lng: 116.4074, lat: 39.9042 },
  { name: "Tashkent, Uzbekistan", lng: 69.2401, lat: 41.2995 },
  { name: "Dushanbe, Tajikistan", lng: 68.7870, lat: 38.5598 },
  { name: "Berlin, Germany", lng: 13.4050, lat: 52.5200 },
  { name: "Paris, France", lng: 2.3522, lat: 48.8566 },
];

export function About() {
  const { t, locale } = useContext(LanguageContext);
  const [siteTranslations, setSiteTranslations] = useState(() => cmsService.getTranslations());

  useEffect(() => {
    const unsub = cmsService.subscribe(() => {
      setSiteTranslations(cmsService.getTranslations());
    });
    return unsub;
  }, []);

  const ab = t.about || {};
  const team = ab.team || [];

  const deptMap: Record<number, string> = {
    1: "MANAGEMENT",                    // Oleg
    2: "VISUAL ART AND MOTION DESIGN",  // Zulfiya
    3: "DEVELOPMENT",                   // Denis
    4: "GRAPHIC DESIGN",                // Tilek
    5: "DEVELOPMENT",                   // Akimkhan
    6: "DEVELOPMENT",                   // Nurlan
    7: "GRAPHIC DESIGN",                // Kunduz
    8: "GRAPHIC DESIGN",                // Daria
    9: "OPERATIONS",                    // Edelweiss
    10: "DEVELOPMENT",                   // Mikhail
  };

  const grouped: Record<string, any[]> = {};
  for (const p of team) {
    const d = deptMap[p.id] || "Other";
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(p);
  }

  const deptOrder = [
    "MANAGEMENT",
    "GRAPHIC DESIGN",
    "DEVELOPMENT",
    "VISUAL ART AND MOTION DESIGN",
    "OPERATIONS",
    "MARKETING",
  ];

  const timeline = ab.timeline || [];
  const valuesList = ab.valuesList || [];
  const awardsList = ab.awardsList || [];

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      {/* Our Story Block */}
      <section className="mb-24 border-b border-[#808080]/30 pb-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-2 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0000FF]"></span>
              <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase">
                {getLocText(locale, "Кто мы", "Who we are", "Биз кимбиз")}
              </span>
            </div>
            <h2 className="text-[40px] md:text-[54px] font-bold leading-[1.1] tracking-[-0.04em] text-[#191919] m-0">
              {ab.ourStoryTitle || getLocText(locale, "Наша история", "Our story", "Биздин тарых")}
            </h2>
            <div className="w-[50px] h-[2px] bg-[#0000FF]"></div>
            <p className="text-[17px] leading-[1.5] text-[#808080] max-w-[450px] m-0 font-normal">
              {ab.manifestoText || ""}
            </p>
          </div>

          {/* Right Column (Timeline Horizontal Grid) */}
          <div className="lg:col-span-7 w-full mt-10 lg:mt-0">
            {timeline.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[28px]">
                {timeline.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col">
                    {/* Header */}
                    <div className="mb-4 h-[84px] flex flex-col justify-start">
                      <span className="font-mono text-[14px] font-bold text-[#0000FF] uppercase block mb-1">
                        {item.year}
                      </span>
                      <span className="text-[16px] font-normal text-[#191919] leading-tight block">
                        {item.title}
                      </span>
                    </div>

                    {/* Image Card */}
                    <div 
                      className="aspect-square w-full bg-[#f5f5f5] flex items-center justify-center overflow-hidden"
                      style={{ borderRadius: "50%" }}
                    >
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: "50%" }}
                        />
                      ) : (
                        <svg className="w-8 h-8 text-[#808080]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Dot & Timeline axis line */}
                    <div className="relative w-full my-6 flex items-center justify-center">
                      <div className="absolute left-0 right-0 h-[1px] bg-[#808080]/30"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0000FF] z-10 relative"></div>
                    </div>

                    {/* Description text */}
                    <p className="text-[14px] leading-[1.5] text-[#808080] m-0 font-normal">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy Foundation Block */}
      {valuesList.length > 0 && (
        <section className="mb-24 border-b border-[#808080]/30 pb-[100px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex items-center gap-2 select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0000FF]"></span>
                <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase">
                  {getLocText(locale, "Наша философия", "Our philosophy", "Биздин философия")}
                </span>
              </div>
              <h2 className="text-[40px] md:text-[54px] font-bold leading-[1.1] tracking-[-0.04em] text-[#191919] m-0 whitespace-pre-line">
                {ab.valuesSub || "Philosophy\nfoundation"}
              </h2>
              <div className="w-[50px] h-[2px] bg-[#0000FF]"></div>
              <p className="text-[17px] leading-[1.5] text-[#808080] max-w-[450px] m-0 font-normal">
                {ab.philosophyText || ""}
              </p>

              {/* Decorative dot grid */}
              <div className="grid grid-cols-6 gap-2 w-[72px] opacity-15 mt-8 select-none">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-black"></div>
                ))}
              </div>
            </div>

            {/* Right Column (Principles Cards Layout) */}
            <div className="lg:col-span-7 w-full mt-10 lg:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px]">
                {valuesList.map((v: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col p-8 md:p-9 lg:p-10 bg-white rounded-[32px] border border-[#808080]/20 min-h-[490px] md:min-h-[520px] overflow-hidden group transition-colors duration-300 hover:border-[#0000FF]"
                    >
                      {/* Top Row: Number & Icon */}
                      <div className="flex justify-between items-center mb-12 md:mb-14">
                        <span className="font-mono text-[17px] font-bold text-[#0000FF] tracking-wider">
                          {v.num}
                        </span>
                        <div className="w-[52px] h-[52px] rounded-full border border-[#0000FF]/20 flex items-center justify-center text-[#0000FF] bg-[#f4f7ff]">
                          {v.num === "01" || idx === 0 ? (
                            <Eye className="w-6 h-6 stroke-[1.8]" />
                          ) : v.num === "02" || idx === 1 ? (
                            <Heart className="w-6 h-6 stroke-[1.8]" />
                          ) : (
                            <Zap className="w-6 h-6 stroke-[1.8]" />
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-[24px] md:text-[26px] font-bold leading-[1.2] text-[#191919] m-0 whitespace-pre-line tracking-[-0.02em]">
                        {v.title}
                      </h3>

                      {/* Short Blue Line under title */}
                      <div className="w-7 h-[2.5px] bg-[#0000FF] mt-6 mb-7 rounded-full"></div>

                      {/* Description */}
                      <p className="text-[14px] md:text-[15px] leading-[1.75] text-[#808080] m-0 font-normal">
                        {v.desc}
                      </p>

                      {/* Connecting Line and Dot Node */}
                      {idx < valuesList.length - 1 && (
                        <div className="absolute top-[215px] md:top-[225px] -right-[28px] w-[28px] h-[1px] bg-[#0000FF]/25 z-20 hidden md:block">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#0000FF] bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0000FF]" />
                          </div>
                        </div>
                      )}

                      {/* Softer, more premium double gradient wave decoration */}
                      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none overflow-hidden select-none">
                        <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id={`waveGrad1-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#0000FF" stopOpacity="0.03" />
                              <stop offset="50%" stopColor="#0000FF" stopOpacity="0.12" />
                              <stop offset="100%" stopColor="#0000FF" stopOpacity="0.03" />
                            </linearGradient>
                            <linearGradient id={`waveGrad2-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#0000FF" stopOpacity="0.02" />
                              <stop offset="30%" stopColor="#0000FF" stopOpacity="0.08" />
                              <stop offset="70%" stopColor="#0000FF" stopOpacity="0.05" />
                              <stop offset="100%" stopColor="#0000FF" stopOpacity="0.01" />
                            </linearGradient>
                          </defs>
                          {/* Back wave */}
                          <path d="M0,15 C30,22 70,8 100,15 L100,25 L0,25 Z" fill={`url(#waveGrad1-${idx})`} />
                          {/* Front wave */}
                          <path d="M0,10 C45,2 55,20 100,10 L100,25 L0,25 Z" fill={`url(#waveGrad2-${idx})`} />
                          {/* Very thin top strokes */}
                          <path d="M0,15 C30,22 70,8 100,15" fill="none" stroke="#0000FF" strokeWidth="0.15" strokeOpacity="0.3" />
                          <path d="M0,10 C45,2 55,20 100,10" fill="none" stroke="#0000FF" strokeWidth="0.1" strokeOpacity="0.2" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      <section className="mb-24">
        {/* Top Header: Title and Leader card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.1fr] gap-12 lg:gap-16 items-start border-b border-black/10 pb-16 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0000FF]" />
              <span className="text-[12px] font-mono tracking-widest text-black/60 uppercase">
                {getLocText(locale, "Студия", "Studio team", "Студия")}
              </span>
            </div>
            <h2 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-black m-0">
              {getLocText(locale, "Наша команда", "Our team", "Биздин команда")}
            </h2>
            <div className="h-[2px] w-12 bg-[#0000FF]" />
            <p className="text-[17px] leading-[1.44] text-[#808080] max-w-[450px] m-0">
              {ab.teamIntro || getLocText(locale, "Команда стратегов, дизайнеров, разработчиков и проектировщиков, объединенных любопытством и мастерством.", "A collective of strategists, designers, developers and problem-solvers united by curiosity and craft.", "Кызыгуу жана чеберчилик менен бириккен стратегдердин, дизайнерлердин, иштеп чыгуучулардын жана долбоорлоочулардын командасы.")}
            </p>
          </div>

          {/* Oleg's Leadership card */}
          {(() => {
            const oleg = team.find((m: any) => m.id === 1 || m.name.toLowerCase().includes("oleg") || m.name.toLowerCase().includes("олег"));
            if (!oleg) return null;
            return (
              <div className="relative overflow-hidden rounded-[24px] bg-[#f9f9f6] border border-black/5 p-8 lg:p-10 flex flex-col justify-between min-h-[380px] sm:min-h-[420px] w-full lg:max-w-[1020px] justify-self-end group transition-all duration-300">
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[18px] font-medium text-[#0000FF]">01</span>
                    <span className="text-[14px] font-mono font-bold uppercase tracking-wider text-[#0000FF]">
                      {getLocText(locale, "РУКОВОДСТВО", "LEADERSHIP", "ЖЕТЕКЧИЛИК")}
                    </span>
                  </div>
                </div>

                <div className="absolute right-0 bottom-0 top-0 w-1/2 xs:w-[45%] md:w-1/2 overflow-hidden pointer-events-none rounded-r-[24px]">
                  {oleg.img && (
                    <img
                      src={oleg.img}
                      alt={oleg.name}
                      className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f9f9f6] via-[#f9f9f6]/20 via-[15%] to-transparent" />
                </div>

                <div className="mt-auto relative z-10">
                  <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-normal tracking-tight text-black leading-tight max-w-[55%] sm:max-w-[50%] mb-2">
                    {oleg.name}
                  </h3>
                  <p className="text-[13px] xs:text-[15px] sm:text-[17px] text-black/65 font-light leading-relaxed max-w-[55%] sm:max-w-[50%] m-0">
                    {oleg.role}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Departments Section */}
        {(() => {
          const getDeptId = (member: any) => {
            const role = (member.role || "").toLowerCase();
            if (role.includes("marketer") || role.includes("маркетолог") || role.includes("marketing")) {
              return "marketing";
            }
            
            const dept = deptMap[member.id];
            if (dept === "MANAGEMENT") return "leadership";
            if (dept === "GRAPHIC DESIGN") return "design";
            if (dept === "DEVELOPMENT") return "development";
            if (dept === "VISUAL ART AND MOTION DESIGN") return "motion";
            if (dept === "OPERATIONS") return "operations";
            if (dept === "MARKETING") return "marketing";
            return "design";
          };

          const restOfTeam = team.filter((m: any) => getDeptId(m) !== "leadership");
          
          const departments = [
            { id: "Design", title: getLocText(locale, "Графический дизайн", "GRAPHIC DESIGN", "Графикалык дизайн"), num: "02", label: "DESIGN" },
            { id: "Development", title: getLocText(locale, "Разработка", "DEVELOPMENT", "Иштеп чыгуу"), num: "03", label: "CODE" },
            { id: "Motion", title: getLocText(locale, "Visual Art и Моушн-дизайн", "Visual Art & Motion Design", "Visual Art жана Моушн-дизайн"), num: "04", label: "MOTION" },
            { id: "Operations", title: getLocText(locale, "Операции", "OPERATIONS", "Операциялар"), num: "05", label: "OPS" },
            { id: "Marketing", title: getLocText(locale, "Маркетинг", "MARKETING", "Маркетинг"), num: "06", label: "MKT" }
          ];

          return (
            <div className="space-y-24">
              {/* All Departments rendered in uniform full-width rows */}
              {departments.map((dept) => {
                const members = restOfTeam.filter(m => getDeptId(m).toLowerCase() === dept.id.toLowerCase());
                if (members.length === 0) return null;
                return (
                  <div key={dept.id} className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-12 gap-y-6 items-start">
                    {/* Left Axis Indicator */}
                    <div className="hidden md:flex flex-col items-center select-none self-stretch pb-2">
                      <div className="flex items-center justify-center h-7">
                        <span className="text-[16px] font-medium text-[#0000FF]">{dept.num}</span>
                      </div>
                      <div className="w-px bg-black/10 flex-1 mt-4 mb-4" />
                      <span 
                        className="text-[14px] font-mono font-bold uppercase tracking-[0.2em] text-black/25 transform rotate-180"
                        style={{ writingMode: "Vertical-rl" }}
                      >
                        {dept.label}
                      </span>
                    </div>

                    {/* Department Content */}
                    <div className="space-y-8 flex-1">
                      <div className="flex items-center gap-4 h-7">
                        <span className="text-[14px] font-mono font-bold uppercase tracking-wider text-[#0000FF] whitespace-nowrap">
                          {dept.title}
                        </span>
                        <div className="h-px bg-[#0000FF]/15 flex-1 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0000FF]" />
                        </div>
                      </div>

                      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {members.map((member) => (
                          <div key={member.id} className="flex flex-col group">
                            <div className="space-y-4">
                              <div className="relative w-full rounded-[20px] overflow-hidden bg-[#f5f5f5] aspect-[4/5]">
                                {member.img && (
                                  <ImageWithFallback
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 ease-out"
                                    loading="eager"
                                  />
                                )}
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-[19px] font-normal text-black m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                                  {member.name}
                                </h4>
                                <p className="text-[15px] text-[#808080] font-light leading-relaxed m-0">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* Awards [04/AWARDS] - DISABLED (see Блок Признание и награды.txt) */}
      {false && awardsList.length > 0 && (
        <section className="mt-[100px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[28px] items-start mb-[40px]">
            <div className="md:col-span-5">
              <h2 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#191919] m-0">
                {ab.awardsTitle || "Recognition & awards"}
              </h2>
            </div>
            <div className="md:col-span-7 flex md:justify-end md:pl-[59px]">
              <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase mt-2 md:mt-4 block">
                [04/AWARDS]
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            {awardsList.map((award: any, idx: number) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-[28px] py-[28px] border-t border-[#808080]/30"
              >
                <div className="md:col-span-2">
                  <span className="font-mono text-[14px] tracking-[0.04em] text-[#0000FF] uppercase">
                    {award.year}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <h3 className="text-[18px] font-normal text-[#191919] m-0">
                    {award.title}
                  </h3>
                  <p className="text-[15px] text-[#808080] mt-1 m-0">
                    {award.project}
                  </p>
                </div>
                <div className="md:col-span-5">
                  <p className="text-[15px] leading-[1.5] text-[#808080] m-0">
                    {award.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* Map / Global Footprint [05/MAP] */}
      <section className="mt-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[28px] items-start border-b border-[#808080]/30 pb-4 mb-[60px]">
          <div className="md:col-span-5">
            <h2 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#191919] m-0">
              {ab.mapTitle || "Global footprint"}
            </h2>
            <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase mt-4 block">
              [05/MAP]
            </span>
          </div>
          <div className="md:col-span-7 md:pl-[59px]">
            <p className="text-[17px] leading-[1.44] text-[#808080] max-w-[500px] m-0">
              {ab.mapSub || ""}
            </p>
          </div>
        </div>

        <div className="w-full border border-[#808080]/30 relative overflow-hidden select-none bg-[#f5f5f5] rounded-xl flex flex-col">
          <div className="w-full h-[400px] md:h-[500px]">
            <Map
              viewport={{
                center: [20, 25],
                zoom: 1.6,
                bearing: 0,
                pitch: 0
              }}
              theme="light"
              locale={locale}
            >
              {globalLocations.map((loc) => (
                <MapMarker key={loc.name} longitude={loc.lng} latitude={loc.lat}>
                  <MarkerContent>
                    <div className="relative group cursor-pointer">
                      <div 
                        className={`rounded-full transition-transform duration-300 ${
                          loc.isHQ 
                            ? "w-5 h-5 bg-[#0000FF] border-2 border-white ring-4 ring-[#0000FF]/30 animate-pulse" 
                            : "w-3.5 h-3.5 bg-[#0000FF] border border-white hover:scale-150"
                        }`} 
                      />
                    </div>
                  </MarkerContent>
                  <MapPopup permanent={false} className="bg-black text-white px-3 py-1.5 rounded text-[12px] font-mono">
                    {loc.name}
                  </MapPopup>
                </MapMarker>
              ))}
            </Map>
          </div>

          {/* Text Summary banner at the bottom of the map */}
          <div className="w-full bg-white/90 backdrop-blur-md border-t border-[#808080]/20 p-4 md:p-6 text-center">
            <p className="text-[14px] md:text-[16px] leading-[1.5] text-[#808080] m-0 max-w-[800px] mx-auto font-normal">
              {ab.mapCities || ""}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
