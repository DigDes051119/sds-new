import { motion } from "motion/react";
import { useContext, useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import { teamTranslations } from "../teamData";
import { Globe, Award, Sparkles, MapPin, Layers, Infinity, PenTool, Plus, Eye, Heart, Zap } from "lucide-react";
import { Map, MapMarker, MarkerContent, MapPopup } from "../components/ui/map";

const scrollReveal = {
  initial: { y: 50, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export function About() {
  const { t, locale } = useContext(LanguageContext);
  const [expandedAwards, setExpandedAwards] = useState<Record<number, boolean>>({});

  const toggleAward = (idx: number) => {
    setExpandedAwards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const ab = t.about || {};
  const team = ab.team || teamTranslations[locale] || teamTranslations.ru;

  const statsLabels = {
    ru: { storyTitle: "Наша история" },
    en: { storyTitle: "Our story" },
    kg: { storyTitle: "Биздин тарых" },
  };
  const stats = statsLabels[locale] || statsLabels.ru;

  const awardImages = [
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  ];

  // Actual geographic LngLat coordinates of target cities
  const mapPoints = [
    { name: "Almaty", lng: 76.9286, lat: 43.2389, count: 12 },
    { name: "Bishkek", lng: 74.59, lat: 42.8747, count: 18 },
    { name: "Tashkent", lng: 69.2401, lat: 41.2995, count: 6 },
    { name: "Berlin", lng: 13.405, lat: 52.52, count: 4 },
    { name: "San Francisco", lng: -122.4194, lat: 37.7749, count: 3 }
  ];

  return (
    <div
      className="overflow-hidden pb-32 bg-[#fafaf6] text-[#111] pt-16 text-lg sm:text-[1.125rem]"
    >

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — STUDIO STORY
      ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        {...scrollReveal}
        className="mx-auto max-w-[1380px] px-3 sm:px-6 min-[1380px]:px-0"
      >
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-16 items-start">
          <div>
            <h2 className="text-5xl sm:text-7xl font-semibold tracking-[-0.07em] leading-[0.95]">
              {stats.storyTitle}
            </h2>
            <div className="mt-6 h-1 w-16 bg-[#0000FF] rounded-full" />
          </div>

          <p className="text-[clamp(1.15rem,2vw,1.55rem)] leading-[1.55] tracking-[-0.02em] text-[#111]/80 text-lg sm:text-[1.125rem]">
            {ab.manifestoText}
          </p>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — CORE VALUES (Infographic style)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        {...scrollReveal}
        className="mx-auto mt-32 max-w-[1380px] px-3 sm:px-6 min-[1380px]:px-0"
      >
        <div className="h-px bg-black/10 w-full mb-16" />
        <div className="grid lg:grid-cols-[1fr_2.5fr] gap-12 lg:gap-16">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] leading-[1.02] text-black whitespace-pre-line">
              {ab.valuesSub || "Signature Approach"}
            </h2>
          </div>
          
          <div className="relative grid sm:grid-cols-3 gap-8">
            {/* Visual connecting pipeline for infographic style */}
            <div className="absolute top-[88px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#0000FF]/5 via-[#0000FF]/40 to-[#0000FF]/5 hidden sm:block z-0 pointer-events-none" />

            {(ab.valuesList || []).map((val: any, idx: number) => {
              // Map technical icons matching the card themes (Perception, Feelings, Emotions)
              const stepMeta = [
                {
                  icon: <Eye className="text-[#0000FF]" size={24} />,
                },
                {
                  icon: <Heart className="text-[#0000FF]" size={24} />,
                },
                {
                  icon: <Zap className="text-[#0000FF]" size={24} />,
                }
              ][idx] || {
                icon: <Sparkles className="text-[#0000FF]" size={24} />,
              };

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative bg-white border border-black/[0.06] rounded-[2rem] p-7 flex flex-col justify-start shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden group min-h-[300px] z-10"
                >
                  {/* Infographic Technical Grid Overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" 
                    style={{ 
                      backgroundImage: 'radial-gradient(#0000FF 1px, transparent 1px)', 
                      backgroundSize: '18px 18px' 
                    }} 
                  />

                  {/* Header row with Number pill and Icon circle */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-sm bg-black/[0.03] text-[#0000FF] font-bold px-3 py-1.5 rounded-full border border-black/[0.04]">
                      {val.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#0000FF]/5 flex items-center justify-center border border-[#0000FF]/10 group-hover:bg-[#0000FF] group-hover:text-white transition-all duration-300">
                      <div className="group-hover:brightness-0 group-hover:invert transition-all">
                        {stepMeta.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="mt-10 mb-2 z-10">
                    <h3 className="text-2xl font-bold tracking-tight mb-3 text-black whitespace-pre-line">
                      {val.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-black/60 font-light whitespace-pre-line">
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — AWARDS
      ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        {...scrollReveal}
        className="mx-auto mt-32 max-w-[1380px] px-3 sm:px-6 min-[1380px]:px-0 relative"
      >
        <div className="h-px bg-black/10 w-full mb-16" />
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-12 lg:gap-24 items-start">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] leading-[1.02]">
              {ab.awardsSub || "Awards"}
            </h2>
          </div>

          <div className="divide-y divide-black/10">
            {(ab.awardsList || []).map((aw: any, idx: number) => {
              const isExpanded = !!expandedAwards[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleAward(idx)}
                  className="py-8 flex flex-col transition-all duration-300 cursor-pointer hover:bg-black/[0.02] px-4 -mx-4 rounded-2xl select-none group"
                >
                  <div className="flex items-center justify-between gap-6 w-full">
                    <div className="flex items-start gap-6 md:w-[45%] shrink-0">
                      <span className="font-mono text-xl text-black/35 pt-1">
                        {aw.year}
                      </span>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight text-black transition-colors group-hover:text-[#0000FF]">
                          {aw.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-black/[0.03] flex items-center justify-center shrink-0 border border-black/[0.04] transition-all group-hover:bg-[#0000FF]/5 group-hover:border-[#0000FF]/10">
                      <Plus 
                        className={`w-5 h-5 text-black/60 transition-transform duration-300 group-hover:text-[#0000FF] ${
                          isExpanded ? "rotate-45" : ""
                        }`} 
                      />
                    </div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={
                      isExpanded
                        ? { height: "auto", opacity: 1, marginTop: 24 }
                        : { height: 0, opacity: 0, marginTop: 0 }
                    }
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden w-full flex flex-col md:flex-row md:items-start justify-between gap-8"
                  >
                    <div className="hidden md:block md:w-[45%] shrink-0" />
                    <div className="text-left text-lg text-black/65 md:flex-1 whitespace-pre-line leading-relaxed pt-1 md:pl-8 flex flex-col gap-4">
                      {aw.project && (
                        <p className="text-black/75">
                          {aw.project}
                        </p>
                      )}
                      {aw.details && (
                        <p className="text-black/55 font-medium border-t border-black/[0.06] pt-3 mt-1">
                          {aw.details}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — GEOGRAPHY MAP (Using custom mapcn library with MapLibre GL)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        {...scrollReveal}
        className="mx-auto mt-32 max-w-[1380px] px-3 sm:px-6 min-[1380px]:px-0"
      >
        <div className="h-px bg-black/10 w-full mb-16" />
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-12 lg:gap-24 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] leading-[1.02]">
              {ab.mapSub || "International Projects"}
            </h2>
            <p className="mt-6 text-lg text-black/65 leading-relaxed max-w-[380px]">
              {ab.mapCities}
            </p>
          </div>

          {/* Mapcn Map component wrapper with light Positron elegant styling */}
          <div className="relative w-full aspect-[16/9] bg-[#eeeee9] rounded-[2rem] border border-black/10 overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.06)]">
            <Map
              theme="light"
              viewport={{
                center: [30, 45], // Centered between Central Asia and Europe
                zoom: 2.2,
                bearing: 0,
                pitch: 0,
              }}
              className="w-full h-full"
            >
              {mapPoints.map((pt, idx) => (
                <MapMarker
                  key={idx}
                  longitude={pt.lng}
                  latitude={pt.lat}
                >
                  <MarkerContent>
                    <div className="relative group flex items-center justify-center">
                      {/* Elegant pulsing target marker styled in blue */}
                      <span className="absolute w-7 h-7 rounded-full bg-[#0000FF]/25 animate-ping" />
                      <div className="relative w-4 h-4 rounded-full bg-[#0000FF] border-2 border-white shadow-[0_2px_10px_rgba(0,0,255,0.4)] transition-transform duration-300 group-hover:scale-125" />
                    </div>
                  </MarkerContent>
                  
                  {/* Styled Popups inside mapcn structure */}
                  <MapPopup closeOnClick={false} anchor="bottom" offset={14}>
                    <div className="bg-white/80 backdrop-blur-md text-black py-3.5 px-5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.06)] flex items-center gap-4 border border-black/[0.08]">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0000FF]/8 text-[#0000FF] shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-black/95 text-lg font-semibold leading-tight">{pt.name}</span>
                        <span className="text-[#0000FF] font-mono text-[17px] mt-0.5 font-semibold">
                          {pt.count} {locale === "ru" ? "проект." : locale === "kg" ? "долбоор." : "proj."}
                        </span>
                      </div>
                    </div>
                  </MapPopup>
                </MapMarker>
              ))}
            </Map>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — TEAM (Grid layout with hover reveal)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        {...scrollReveal}
        className="mx-auto mt-32 max-w-[1380px] px-3 sm:px-6 min-[1380px]:px-0"
      >
        <div className="h-px bg-black/10 w-full mb-16" />

        {/* Section title */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] leading-[1.02] text-[#111111]">
            {locale === "ru" ? "Наша команда" : locale === "kg" ? "Биздин команда" : "Our team"}
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {team.map((member: any, idx: number) => (
            <div
              key={member.id || idx}
              className="flex flex-col group select-none cursor-pointer"
            >
              {/* Photo Container */}
              <div className="relative w-full aspect-[3/4] rounded-[0.8rem] overflow-hidden bg-[#eeeee9]">
                <ImageWithFallback
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-500 ease-out filter grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>

              {/* Name & Role (Always visible below the photo) */}
              <div className="mt-5">
                <span className="text-[17px] text-[#0000FF] font-semibold block mb-1">
                  0{idx + 1}
                </span>
                <h3 className="tracking-tight text-[22px] font-bold text-black transition-colors duration-300 group-hover:text-[#0000FF]">
                  {member.name}
                </h3>
                <p className="mt-1.5 text-[18px] text-black/55 leading-snug">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

    </div>
  );
}
