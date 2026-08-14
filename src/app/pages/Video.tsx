import { useContext, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { LanguageContext, getLocText } from "../i18n";
import { cmsService } from "../cmsService";
import { ProjectsNav } from "../components/ProjectsNav";

export function Video() {
  const { t, locale } = useContext(LanguageContext);
  const [translations, setTranslations] = useState(() => cmsService.getTranslations());
  const [productDetails, setProductDetails] = useState(() => cmsService.getProductDetails());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setTranslations(cmsService.getTranslations());
      setProductDetails(cmsService.getProductDetails());
    });
  }, []);

  const localizedDetails = productDetails[locale] || productDetails["en"] || productDetails["ru"] || {};
  const videoList = translations[locale]?.video?.items || translations["en"]?.video?.items || [];

  const videos = videoList.map((item: any) => {
    const detail = localizedDetails[item.id] || {};
    const displayVideoUrl = detail.videoUrl || item.img;

    return {
      ...item,
      videoUrl: displayVideoUrl,
      detail
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  const openModalAt = (index: number) => {
    setActiveIdx(index);
    setActiveMediaIdx(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const currentItem = videos[activeIdx];
  const collageBlocks = currentItem?.detail?.collageBlocks || [];
  const mediaList = collageBlocks.flat().filter(Boolean);

  const nextSlide = () => {
    setActiveMediaIdx((prev) => (prev + 1) % mediaList.length);
  };

  const prevSlide = () => {
    setActiveMediaIdx((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  // Keyboard navigation when modal open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, mediaList.length]);

  return (
    <div className="w-full flex flex-col pt-5 pb-[150px] font-twk-everett">
      {/* Title Block */}
      <section className="pb-4 mb-[40px] w-auto">
        <div className="flex justify-between items-baseline gap-4 mb-4">
          <h1 className="text-[40px] md:text-[54px] font-bold leading-[1.2] tracking-[-0.04em] text-[#0000FF] m-0">
            {translations[locale]?.video?.title || getLocText(locale, "Видео", "Video", "Видео")}
          </h1>
          <span className="font-mono text-[16px] tracking-[0.04em] text-[#808080] uppercase shrink-0">
            [VIDEO/DIRECTING]
          </span>
        </div>
        <p className="text-[#808080] text-[16px] leading-[1.44] m-0 font-normal max-w-[650px]">
          {getLocText(
            locale,
            "Наша видеорежиссура и моушн-дизайн",
            "Our video directing and motion design",
            "Биздин видео режиссёрлук жана моушн дизайн"
          )}
        </p>
      </section>

      {/* Premium Sorting Sub-navigation */}
      <ProjectsNav />

      {/* Dense Masonry Puzzle Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 w-full mt-4">
        {videos.map((item: any, index: number) => {
          const isVideo = item.videoUrl?.startsWith("video:") || item.videoUrl?.endsWith(".webm") || item.videoUrl?.endsWith(".mp4");
          const realUrl = item.videoUrl?.startsWith("video:") ? item.videoUrl.slice(6) : item.videoUrl;

          return (
            <div
              key={item.id}
              onClick={() => openModalAt(index)}
              className="break-inside-avoid mb-2 w-full group relative cursor-pointer overflow-hidden rounded-[8px] bg-[#111]"
            >
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
                  src={item.img}
                  alt={item.name}
                  className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              )}

              {/* Overlay with info on hover (only if filled) */}
              {(item.name || item.detail?.year || item.category) ? (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10 pointer-events-none">
                  {(item.detail?.year || item.category) && (
                    <span className="font-mono text-[11px] text-[#808080] uppercase tracking-[0.04em] mb-1">
                      {[item.detail?.year, item.category].filter(Boolean).join(" — ")}
                    </span>
                  )}
                  {item.name && (
                    <h3 className="text-[18px] font-bold text-white uppercase leading-none m-0">
                      {item.name}
                    </h3>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Detail Popup Modal */}
      {typeof document !== "undefined" && isModalOpen && currentItem && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />

            {/* Layout Wrapper */}
            <div className="relative w-full max-w-[1500px] h-full max-h-[90vh] z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full bg-[#f3f3f3] text-black overflow-hidden flex flex-col lg:flex-row rounded-[8px]"
              >
                {/* Media Player Column */}
                <div className={`w-full ${
                  Boolean(currentItem.name || currentItem.detail?.client || currentItem.detail?.year || currentItem.category || currentItem.detail?.challenge || currentItem.detail?.desc)
                    ? "lg:w-[65%] border-r border-[#808080]/20"
                    : "lg:w-full"
                } flex flex-col bg-[#eeeee9] relative`}>
                  <div className="w-full pt-[25px] px-[25px] shrink-0 flex justify-between items-center z-10">
                    <span className="font-mono text-[12px] text-[#808080] uppercase tracking-[0.04em]">
                      [01 / 01]
                    </span>
                    {!Boolean(currentItem.name || currentItem.detail?.client || currentItem.detail?.year || currentItem.category || currentItem.detail?.challenge || currentItem.detail?.desc) && (
                      <button
                        onClick={closeModal}
                        className="font-mono text-[13px] text-[#808080] hover:text-black transition-colors uppercase cursor-pointer px-2 py-1"
                      >
                        [CLOSE / X]
                      </button>
                    )}
                  </div>

                  <div className="flex-1 relative flex items-center justify-center px-[25px] py-[20px] overflow-hidden">
                    <AnimatePresence mode="wait">
                      {currentItem?.videoUrl?.startsWith("video:") || currentItem?.videoUrl?.endsWith(".webm") || currentItem?.videoUrl?.endsWith(".mp4") ? (
                          <InstagramVideoPlayer
                            src={currentItem.videoUrl?.startsWith("video:") ? currentItem.videoUrl.slice(6) : currentItem.videoUrl}
                          />
                      ) : (
                        <img
                          src={currentItem.img}
                          alt={currentItem.name || "Video"}
                          className="max-w-full max-h-full object-contain rounded-[4px]"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right Side: Details Information (Only rendered if info is filled) */}
                {Boolean(currentItem.name || currentItem.detail?.client || currentItem.detail?.year || currentItem.category || currentItem.detail?.challenge || currentItem.detail?.desc) && (
                  <div className="w-full lg:w-[35%] flex flex-col p-[35px] md:p-[50px] bg-[#f3f3f3] overflow-y-auto">
                    <div className="flex justify-end mb-8 shrink-0">
                      <button
                        onClick={closeModal}
                        className="font-mono text-[14px] text-[#808080] hover:text-black transition-colors uppercase flex items-center gap-2 cursor-pointer"
                      >
                        [CLOSE / X]
                      </button>
                    </div>

                    <div className="flex flex-col gap-6 w-full max-w-[480px]">
                      {(currentItem.detail?.year || currentItem.category || currentItem.name || currentItem.detail?.client) && (
                        <div className="flex flex-col gap-2">
                          {(currentItem.detail?.year || currentItem.category) && (
                            <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em]">
                              {[currentItem.detail?.year, currentItem.category].filter(Boolean).join(" — ")}
                            </span>
                          )}
                          {currentItem.name && (
                            <h3 className="text-[32px] md:text-[40px] font-bold tracking-[-0.04em] text-black m-0 leading-[1.1] uppercase">
                              {currentItem.name}
                            </h3>
                          )}
                          {currentItem.detail?.client && (
                            <div className="font-mono text-[13px] text-[#808080] uppercase mt-2">
                              Client: <span className="text-black">{currentItem.detail.client}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {(currentItem.detail?.challenge || currentItem.detail?.desc) && (
                        <div className="h-[1px] w-full bg-[#808080]/30 shrink-0" />
                      )}

                      {currentItem.detail?.challenge && (
                        <div className="space-y-2">
                          <span className="font-mono text-[12px] text-[#808080] uppercase tracking-[0.04em] block">
                            [Challenge]
                          </span>
                          <p className="text-[15px] leading-[1.5] text-black font-normal m-0">
                            {currentItem.detail.challenge}
                          </p>
                        </div>
                      )}

                      {currentItem.detail?.desc && (
                        <div className="space-y-2">
                          <span className="font-mono text-[12px] text-[#808080] uppercase tracking-[0.04em] block">
                            [About]
                          </span>
                          <p className="text-[15px] leading-[1.5] text-[#808080] font-normal m-0">
                            {currentItem.detail.desc}
                          </p>
                        </div>
                      )}

                      <div className="mt-8 pt-8 border-t border-[#808080]/30 shrink-0">
                        <button
                          onClick={() => {
                            closeModal();
                            window.dispatchEvent(new CustomEvent("sds:open-contact-modal"));
                          }}
                          className="group inline-flex items-center gap-2 text-[17px] font-bold text-black hover:text-[#0000FF] transition-colors duration-300 uppercase tracking-[-0.15px] cursor-pointer"
                        >
                          {getLocText(locale, "Обсудить проект", "Discuss Project", "Долбоорду талкуулоо")}
                          <span className="text-[18px] leading-none group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function InstagramVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    videoRef.current.volume = 1;
    
    // Play on mount; if browser blocks unmuted autoplay, smoothly fallback to muted
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setShowPlayOverlay(true);
    setTimeout(() => setShowPlayOverlay(false), 500);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    videoRef.current.volume = 1;
    setIsMuted(nextMuted);
    if (!nextMuted && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center cursor-pointer select-none bg-black/40" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        className="max-w-full max-h-full object-contain rounded-[4px]"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Instagram-like Centered Play/Pause Icon Animation on click */}
      <AnimatePresence>
        {showPlayOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.3 }}
            className="absolute p-5 bg-[#0000FF]/90 rounded-full text-white pointer-events-none z-10 shadow-2xl shadow-[#0000FF]/40"
          >
            {!isPlaying ? (
              <Pause className="w-7 h-7 fill-current text-white" />
            ) : (
              <Play className="w-7 h-7 fill-current text-white" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Progress Line */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-20">
          <div
            className="h-full bg-[#0000FF] transition-all duration-100 ease-linear"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      )}

      {/* Sound Toggle Button Bottom-Right */}
      <button
        type="button"
        onClick={toggleMute}
        className={`absolute bottom-6 right-6 px-4 py-2 rounded-full backdrop-blur-md transition duration-300 active:scale-95 z-30 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider font-bold shadow-lg cursor-pointer ${
          isMuted
            ? "bg-black/70 hover:bg-black/90 text-white border border-white/20"
            : "bg-[#0000FF] hover:bg-[#0000FF]/90 text-white border border-transparent shadow-[#0000FF]/30"
        }`}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span>Включить звук</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Звук включен</span>
          </>
        )}
      </button>
    </div>
  );
}
