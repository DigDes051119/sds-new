import { useContext, useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Play, Pause, Download, Share2, Check 
} from "lucide-react";
import { LanguageContext, getLocText } from "../i18n";
import { cmsService } from "../cmsService";
import { ProjectsNav } from "../components/ProjectsNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface MusicTrack {
  id: string;
  name: string;
  artist?: string;
  category?: string;
  categoryKey?: string;
  img?: string;
  audioUrl: string;
  duration?: string;
  bpm?: string;
  year?: string;
  desc?: string;
  fileSize?: string;
  format?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function Music() {
  const { locale } = useContext(LanguageContext);
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());

  // Track player state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTimeMap, setCurrentTimeMap] = useState<Record<string, number>>({});
  const [durationMap, setDurationMap] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  useEffect(() => {
    return cmsService.subscribe(() => {
      setTranslations(cmsService.getTranslations());
      setProductDetails(cmsService.getProductDetails());
    });
  }, []);

  const localizedDetails = productDetails[locale] || productDetails["en"] || productDetails["ru"] || {};
  const musicList = translations[locale]?.music?.items || translations["en"]?.music?.items || [];

  // Combine CMS tracks or empty list
  const tracks: MusicTrack[] = (musicList && musicList.length > 0)
    ? musicList.map((item: any) => {
        const detail = localizedDetails[item.id] || {};
        return {
          id: item.id,
          name: detail.name || item.name || "Untitled Track",
          artist: detail.client || detail.designer || "Steel Drake Studio",
          category: detail.service || item.category || "Sound Design",
          categoryKey: item.categoryKey || "sound",
          img: item.img || detail.cover || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
          audioUrl: detail.videoUrl || detail.audioUrl || item.audioUrl || item.img,
          duration: detail.duration || item.duration || "03:00",
          bpm: detail.bpm || item.bpm || "120 BPM",
          year: detail.year || item.year || "2026",
          desc: detail.desc || detail.challenge || "Audio production and conceptual sound design.",
          fileSize: detail.fileSize || item.fileSize || "MP3",
          format: detail.format || item.format || "HQ Audio"
        };
      })
    : [];

  const handleTogglePlay = (track: MusicTrack) => {
    const audio = audioRefs.current[track.id];
    if (!audio) return;

    if (playingId === track.id) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Pause any other playing audio
      Object.keys(audioRefs.current).forEach((id) => {
        const a = audioRefs.current[id];
        if (a && id !== track.id) {
          a.pause();
        }
      });

      audio.play().then(() => {
        setPlayingId(track.id);
      }).catch((err) => {
        console.warn("Audio play error:", err);
      });
    }
  };

  const handleTimeUpdate = (id: string, e: React.SyntheticEvent<HTMLAudioElement>) => {
    const target = e.currentTarget;
    setCurrentTimeMap((prev) => ({ ...prev, [id]: target.currentTime }));
  };

  const handleLoadedMetadata = (id: string, e: React.SyntheticEvent<HTMLAudioElement>) => {
    const target = e.currentTarget;
    setDurationMap((prev) => ({ ...prev, [id]: target.duration }));
  };

  const handleSeek = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRefs.current[id];
    const duration = durationMap[id] || (audio ? audio.duration : 0);
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(duration, clickPos * duration));

    audio.currentTime = newTime;
    setCurrentTimeMap((prev) => ({ ...prev, [id]: newTime }));
  };

  const handleCopyLink = (track: MusicTrack) => {
    const url = track.audioUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedId(track.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { key: "all", label: getLocText(locale, "Все треки", "All Tracks", "Бардык тректер") },
    { key: "electronic", label: "Electronic / Cinematic" },
    { key: "ambient", label: "Ambient & Space" },
    { key: "gamedev", label: "GameDev OST" },
    { key: "synthwave", label: "Synthwave" }
  ];

  const filteredTracks = selectedTag === "all"
    ? tracks
    : tracks.filter(t => t.categoryKey === selectedTag || (t.category && t.category.toLowerCase().includes(selectedTag)));

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px]">
      {/* Title Block */}
      <section className="pb-3 md:pb-4 mb-[24px] sm:mb-[40px] w-auto">
        <div className="flex flex-wrap xs:flex-nowrap justify-between items-end gap-2 mb-3 sm:mb-4">
          <h1 className="text-[28px] xs:text-[36px] sm:text-[44px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {translations[locale]?.music?.title || getLocText(locale, "Музыка и Саунд-дизайн", "Music & Sound Design", "Музыка жана үн дизайны")}
          </h1>
          <span className="font-mono text-[13px] sm:text-[16px] tracking-[0.04em] text-[#808080] uppercase shrink-0">
            [AUDIO/SOUNDTRACKS]
          </span>
        </div>
        <p className="text-[#808080] text-[14px] sm:text-[16px] leading-[1.44] m-0 font-normal max-w-[700px]">
          {getLocText(
            locale,
            "Авторские саундтреки, концептуальный саунд-дизайн и атмосферная музыка студии Steel Drake Studio. Все треки доступны для онлайн-прослушивания и прямого скачивания.",
            "Original soundtracks, conceptual sound design, and atmospheric audio compositions created by Steel Drake Studio. Stream in high fidelity and download directly.",
            "Steel Drake Studio автордук саундтректери жана атмосфералык үн дизайны. Онлайн угууга жана түз жүктөп алууга жеткиликтүү."
          )}
        </p>
      </section>

      {/* Navigation Sub-header */}
      <ProjectsNav />

      {/* Genre Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8 mt-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedTag(cat.key)}
            className={`px-4 py-2 rounded-full text-[12px] uppercase font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              selectedTag === cat.key
                ? "bg-[#0000FF] text-white shadow-md shadow-[#0000FF]/25 font-bold"
                : "bg-black/[0.04] text-black/70 hover:bg-black/[0.08] hover:text-black"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4 Tracks in a row Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 xl:gap-8">
        {filteredTracks.map((track, index) => {
          const isPlaying = playingId === track.id;
          const currentTime = currentTimeMap[track.id] || 0;
          const duration = durationMap[track.id] || 0;
          const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="w-full flex flex-col justify-between group"
            >
              {/* Hidden audio element */}
              <audio
                ref={(el) => (audioRefs.current[track.id] = el)}
                src={track.audioUrl}
                preload="metadata"
                onTimeUpdate={(e) => handleTimeUpdate(track.id, e)}
                onLoadedMetadata={(e) => handleLoadedMetadata(track.id, e)}
                onEnded={() => setPlayingId(null)}
              />

              <div className="w-full flex flex-col">
                {/* Image Cover */}
                <div
                  onClick={() => handleTogglePlay(track)}
                  className="w-full bg-transparent overflow-hidden relative aspect-[16/10] flex items-center justify-center cursor-pointer"
                >
                  <ImageWithFallback
                    src={track.img || ""}
                    alt={track.name}
                    className={`w-full h-full object-cover scale-[1.02] transition-all duration-500 ${
                      isPlaying ? "brightness-[0.65]" : "group-hover:brightness-75"
                    }`}
                    loading="lazy"
                  />

                  {/* Play / Pause overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                    isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-200 ${
                      isPlaying
                        ? "bg-[#0000FF] text-white scale-100 shadow-lg shadow-[#0000FF]/30"
                        : "bg-white/90 text-black hover:scale-110 hover:bg-[#0000FF] hover:text-white"
                    }`}>
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Equalizer animation badge */}
                  {isPlaying && (
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-end gap-[3px] h-4">
                      {[0, 1, 2, 3, 4].map(i => (
                        <span
                          key={i}
                          className="w-[2.5px] bg-white rounded-full animate-pulse"
                          style={{
                            height: `${40 + Math.random() * 60}%`,
                            animationDelay: `${i * 120}ms`,
                            animationDuration: `${500 + i * 100}ms`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Bottom progress line on artwork */}
                  {(isPlaying || currentTime > 0) && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
                      <div
                        className="h-full bg-[#0000FF] transition-all duration-100"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="mt-4 flex flex-col">
                  {/* Category tag */}
                  {track.category && (
                    <span className="text-[12px] font-mono tracking-[0.1em] text-[#0000FF] uppercase block mb-1.5 font-semibold">
                      {track.category}
                    </span>
                  )}

                  {/* Title */}
                  <h2
                    onClick={() => handleTogglePlay(track)}
                    className="text-[20px] sm:text-[22px] font-semibold leading-[1.25] tracking-[-0.03em] text-black m-0 group-hover:text-[#0000FF] transition-colors duration-200 cursor-pointer line-clamp-2"
                    title={track.name}
                  >
                    {track.name}
                  </h2>

                  {/* Metadata row (Artist / Year) */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3.5 mb-3.5">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {getLocText(locale, "АВТОР", "ARTIST", "АВТОР")}
                      </span>
                      <span className="text-[14px] text-black font-normal mt-0.5">
                        {track.artist || "Steel Drake Sound"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] tracking-[0.05em] text-[#808080] uppercase">
                        {getLocText(locale, "ГОД", "YEAR", "ЖЫЛ")}
                      </span>
                      <span className="text-[14px] text-black font-normal mt-0.5">
                        {track.year}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {track.desc && (
                    <p className="text-[14px] leading-[1.44] text-[#808080] m-0 font-normal line-clamp-2 mb-4">
                      {track.desc}
                    </p>
                  )}

                  {/* Standard Specs Table matching other catalog items */}
                  <div className="w-full flex flex-col border-t border-[#E5E5E5] pt-1">
                    <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5] gap-2">
                      <span className="font-mono text-[11px] md:text-[12px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">
                        {getLocText(locale, "ФОРМАТ", "FORMAT", "ФОРМАТ")}
                      </span>
                      <span className="text-[14px] text-black font-normal text-right">
                        {track.format || "MP3 320kbps"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5] gap-2">
                      <span className="font-mono text-[11px] md:text-[12px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">
                        {getLocText(locale, "РАЗМЕР", "SIZE", "ӨЛЧӨМҮ")}
                      </span>
                      <span className="text-[14px] text-black font-normal text-right">
                        {track.fileSize || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#E5E5E5] gap-2">
                      <span className="font-mono text-[11px] md:text-[12px] tracking-[0.04em] text-[#808080] uppercase whitespace-nowrap">
                        BPM
                      </span>
                      <span className="text-[14px] text-black font-normal text-right">
                        {track.bpm || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Audio Waveform / Scrubber */}
                  <div className="mt-4">
                    <div
                      onClick={(e) => handleSeek(track.id, e)}
                      className="relative w-full h-2 bg-black/[0.08] hover:bg-black/[0.14] rounded-full cursor-pointer overflow-hidden group/seek transition-colors"
                      title={getLocText(locale, "Перемотка", "Seek", "Артка")}
                    >
                      <div
                        className="h-full bg-[#0000FF] rounded-full transition-all duration-100"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[12px] font-mono text-[#808080] mt-1.5">
                      <span>{formatTime(currentTime)}</span>
                      <span>{duration > 0 ? formatTime(duration) : (track.duration || "00:00")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E5E5E5]">
                {/* Play button */}
                <button
                  onClick={() => handleTogglePlay(track)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                    isPlaying
                      ? "bg-[#0000FF] text-white border-[#0000FF]"
                      : "bg-transparent text-black border-black/20 hover:border-[#0000FF] hover:text-[#0000FF]"
                  }`}
                >
                  {isPlaying ? (
                    <><Pause className="w-3.5 h-3.5" /> {getLocText(locale, "Пауза", "Pause", "Тыным")}</>
                  ) : (
                    <><Play className="w-3.5 h-3.5 ml-0.5" /> {getLocText(locale, "Play", "Play", "Play")}</>
                  )}
                </button>

                {/* Download button */}
                <a
                  href={track.audioUrl}
                  download={`${track.name.replace(/[^a-zA-Z0-9_-]/g, "_")}.mp3`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-mono uppercase tracking-wider bg-black text-white hover:bg-[#0000FF] transition-all duration-200 cursor-pointer border border-black hover:border-[#0000FF]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{getLocText(locale, "Скачать", "Download", "Жүктөө")}</span>
                </a>

                {/* Share button */}
                <button
                  onClick={() => handleCopyLink(track)}
                  title={getLocText(locale, "Копировать ссылку", "Copy link", "Шилтемени көчүрүү")}
                  className="p-2.5 border border-black/20 text-black/50 hover:text-[#0000FF] hover:border-[#0000FF] transition-colors cursor-pointer shrink-0"
                >
                  {copiedId === track.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Empty State */}
      {filteredTracks.length === 0 && (
        <div className="w-full py-20 text-center text-[#808080] text-sm font-mono">
          {getLocText(locale, "Треков в данной категории пока нет", "No tracks in this category yet", "Бул категорияда трек жок")}
        </div>
      )}
    </div>
  );
}
