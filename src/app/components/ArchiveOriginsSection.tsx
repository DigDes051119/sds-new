import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LanguageContext } from "../i18n";
import { type ArchiveItem } from "../archiveData";
import { cmsService } from "../cmsService";

export function ArchiveOriginsSection() {
  const { locale } = useContext(LanguageContext);
  const langKey = (locale === "ru" || locale === "kg" || locale === "en") ? locale : "ru";

  const [allArchiveData, setAllArchiveData] = useState(() => cmsService.getArchiveItems());

  useEffect(() => {
    return cmsService.subscribe(() => {
      setAllArchiveData(cmsService.getArchiveItems());
    });
  }, []);

  const items: ArchiveItem[] = allArchiveData[langKey] || allArchiveData.ru || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const openModalAt = (projectIndex: number) => {
    setActiveProjectIdx(projectIndex);
    setActiveImageIdx(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const currentItem = items[activeProjectIdx] || items[0];
  const images = currentItem?.images || [];

  const nextSlide = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation when modal open
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, images.length]);

  useEffect(() => {
    if (isModalOpen) {
      window.dispatchEvent(new CustomEvent("sds:archive-modal-open"));
    } else {
      window.dispatchEvent(new CustomEvent("sds:archive-modal-close"));
    }
  }, [isModalOpen]);

  const sectionHeading = langKey === "ru" 
    ? "Откуда мы начинали" 
    : langKey === "kg" 
      ? "Биз кайдан баштаганбыз" 
      : "Where we started";

  const colleagueIntroQuote = langKey === "ru"
    ? "Некоторые из работ, которые были сделаны с 2005 по 2020 год — проекты, по которым некоторые из наших клиентов нас знают и помнят со дня основания."
    : langKey === "kg"
      ? "2005-жылдан 2020-жылга чейин жасалган айрым иштер — кардарларыбыз негизделген күндөн бери бизди тааныган жана эстеп калган долбоорлор."
      : "Some of the works created between 2005 and 2020 — signature projects by which our long-time clients have known and remembered us.";

  return (
    <section className="flex flex-col w-full py-16 md:py-24 px-[45px] md:px-[65px] lg:px-[105px] border-t border-[#808080]/20 font-twk-everett select-none">
      {/* ───── Section Header (Exact Site Hierarchy) ───── */}
      <div className="pb-4 mb-[59px] flex justify-between items-baseline select-none border-b border-[#808080]/30">
        <div className="flex flex-col">
          <span className="font-mono text-[18px] text-[#808080] uppercase tracking-[0.04em]">
            2005 — 2020
          </span>
          <h2 className="text-[32px] xs:text-[40px] md:text-[54px] font-bold tracking-[-0.04em] m-0 text-black">
            {sectionHeading}
          </h2>
        </div>
        <span className="font-mono text-[16px] text-[#808080] uppercase border-b border-[#808080] pb-[15px]">
          [07/ORIGINS]
        </span>
      </div>

      {/* ───── Projects Grid (Archive Style Cards - 4 in a row) ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[20px] lg:gap-x-[24px] gap-y-[40px]">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="w-full flex flex-col group cursor-pointer"
            onClick={() => openModalAt(index)}
          >
            {/* Image Band Container - 16:9 Aspect Ratio */}
            <div className="w-full bg-[#191919] overflow-hidden relative aspect-[16/9] flex items-center justify-center rounded-[8px]">
              <img
                src={item.images[0]} 
                alt={item.title} 
                className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:brightness-75"
                loading="lazy"
              />
            </div>

            {/* Meta Information Container - Catalog Style */}
            <div className="mt-[20px] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[14px] text-[#808080] uppercase tracking-[0.04em]">
                  [{String(index + 1).padStart(2, '0')}] — {item.year}
                </span>
                <span className="font-mono text-[13px] text-[#808080] uppercase tracking-[0.04em] text-right truncate pl-4">
                  {item.category}
                </span>
              </div>
              <h3 className="text-[22px] xs:text-[26px] font-bold leading-[1.2] tracking-[-0.02em] text-black uppercase m-0 group-hover:text-[#0000FF] transition-colors duration-300">
                {item.title}
              </h3>
              {item.shortDesc && (
                <p className="text-[15px] leading-[1.4] text-[#808080] m-0 mt-2 font-normal line-clamp-2 pr-4">
                  {item.shortDesc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ───── Large Interactive Popup Modal (Rendered in document.body via Portal) ───── */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Layout Wrapper (Native DOM, No Framer Motion Interference) */}
            <div className="relative w-full max-w-[1600px] h-full max-h-[92vh] z-10">
              {/* Main Modal Box (Animated) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full bg-white text-black shadow-2xl overflow-hidden flex flex-col lg:flex-row rounded-[8px]"
              >
              
              {/* Left Side: Image Slider */}
              <div className="w-full lg:w-[65%] flex flex-col bg-[#fafaf6] relative border-r border-[#808080]/20">
                {/* Slide counter at the top */}
                <div className="w-full pt-[30px] px-[30px] md:pt-[40px] md:px-[40px] shrink-0">
                  <span className="font-mono text-[14px] text-[#808080] uppercase tracking-[0.04em]">
                    [{String(activeImageIdx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}]
                  </span>
                </div>

                <div className="flex-1 relative flex items-center justify-center px-[30px] py-[20px] md:px-[40px] md:py-[30px] overflow-hidden group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${currentItem.id}-${activeImageIdx}`}
                      src={images[activeImageIdx]}
                      alt={`${currentItem.title} - view ${activeImageIdx + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-full max-h-full object-contain"
                    />
                  </AnimatePresence>

                  {/* Navigation arrows (only show if multiple images) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-[30px] md:left-[40px] top-1/2 -translate-y-1/2 p-2 text-black/20 hover:text-black transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-10 h-10 md:w-14 md:h-14 stroke-[1]" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-[30px] md:right-[40px] top-1/2 -translate-y-1/2 p-2 text-black/20 hover:text-black transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-10 h-10 md:w-14 md:h-14 stroke-[1]" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails (only show if multiple images) */}
                {images.length > 1 && (
                  <div className="h-[90px] md:h-[110px] w-full flex items-center gap-3 px-[30px] md:px-[40px] pb-[30px] md:pb-[40px] overflow-x-auto scrollbar-none shrink-0">
                    {images.map((img, idx) => (
                      <button
                        key={`thumb-${idx}`}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative h-full aspect-[16/9] shrink-0 overflow-hidden transition-all duration-300 cursor-pointer rounded-[4px] ${
                          activeImageIdx === idx ? "opacity-100 ring-1 ring-black ring-offset-2 ring-offset-[#fafaf6]" : "opacity-40 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Information */}
              <div className="w-full lg:w-[35%] flex flex-col p-[30px] md:p-[50px] lg:p-[60px] bg-white overflow-y-auto">
                <div className="flex justify-end mb-8 md:mb-12 shrink-0">
                  <button onClick={closeModal} className="font-mono text-[14px] text-[#808080] hover:text-black transition-colors uppercase flex items-center gap-2 cursor-pointer">
                    [CLOSE / X]
                  </button>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-[500px]">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[14px] text-[#808080] uppercase tracking-[0.04em]">
                      {currentItem.year} — {currentItem.category}
                    </span>
                    <h3 className="text-[32px] md:text-[40px] font-bold tracking-[-0.04em] text-black m-0 leading-[1.1] uppercase">
                      {currentItem.title}
                    </h3>
                    <div className="font-mono text-[14px] text-[#808080] uppercase mt-2">
                      Client: <span className="text-black">{currentItem.client}</span>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-[#808080]/30 shrink-0" />

                  <p className="text-[18px] md:text-[22px] font-light leading-[1.4] tracking-[-0.02em] text-black m-0 italic">
                    "{colleagueIntroQuote}"
                  </p>

                  <p className="text-[15px] leading-[1.5] text-[#808080] m-0 font-normal">
                    {currentItem.fullDesc}
                  </p>

                  {/* Highlights */}
                  {currentItem.highlights && currentItem.highlights.length > 0 && (
                    <div className="flex flex-col gap-3 mt-2">
                      <span className="font-mono text-[14px] text-[#808080] uppercase tracking-[0.04em]">
                        [KEY HIGHLIGHTS]
                      </span>
                      <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                        {currentItem.highlights.map((h, i) => (
                          <li key={i} className="flex gap-4 text-[15px] leading-[1.5] text-black items-start">
                            <span className="text-[#808080] font-mono mt-0.5">0{i+1}</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-[#808080]/30 shrink-0">
                    <button
                      onClick={() => {
                        closeModal();
                        window.dispatchEvent(new CustomEvent("sds:open-contact-modal"));
                      }}
                      className="group inline-flex items-center gap-2 text-[17px] font-bold text-black hover:text-[#0000FF] transition-colors duration-300 uppercase tracking-[-0.15px]"
                    >
                      {langKey === "ru" ? "Обсудить проект" : langKey === "kg" ? "Долбоорду талкуулоо" : "Discuss Project"}
                      <span className="text-[18px] leading-none group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </section>
  );
}
