import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { SanaripLogo } from '../common/SanaripLogo';
import { ArrowRight } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navigation';
import { useScrollSpy } from '../../hooks/useScrollSpy';

import vid1 from '../../../videos/1.webm';
import vid2 from '../../../videos/2.webm';
import vid3 from '../../../videos/3.webm';
import vid4 from '../../../videos/4.webm';

const VIDEOS = [vid1, vid2, vid3, vid4];

const revealVariant = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 15 },
  visible: (customDelay) => ({
    opacity: 1, 
    filter: 'blur(0px)', 
    y: 0, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: customDelay }
  })
};

export const CureLinkHero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isShrunk, setIsShrunk] = useState(false);
  const activeSection = useScrollSpy();
  const { language, setLanguage, t } = useLanguage();
  const videoRefs = useRef([]);

  // Scroll to top on initial mount & trigger shrink animation
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsShrunk(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEOS.length);
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch((err) => {
        // Autoplay policy check
      });
    }
  }, [currentVideoIndex]);

  return (
    <div className="w-full bg-[#F3F5F9] text-slate-900 overflow-hidden relative min-h-screen flex flex-col items-center">
      
      {/* Floating Glass Header */}
      <motion.div 
        initial={{ y: '-150%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-6 sm:px-12 xl:px-20 mx-auto w-full max-w-[1920px]"
      >
        <header className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-full px-6 py-4 flex items-center justify-between w-full relative">
          
          <motion.a custom={2.6} variants={revealVariant} initial="hidden" animate="visible" href="#" className="flex items-center gap-2 shrink-0">
            <SanaripLogo className="h-10 sm:h-12" />
          </motion.a>

          {/* Centered Navigation */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[15px] font-semibold antialiased absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.a
                  key={item.id}
                  custom={item.delay}
                  variants={revealVariant}
                  initial="hidden"
                  animate="visible"
                  href={item.href}
                  className={`transition-colors duration-200 whitespace-nowrap transform-gpu backface-hidden will-change-transform ${
                    isActive
                      ? 'text-[#09638D]'
                      : 'text-slate-700 hover:text-[#09638D]'
                  }`}
                >
                  {t(item.labelKey)}
                </motion.a>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 antialiased">
            <motion.div custom={3.4} variants={revealVariant} initial="hidden" animate="visible" className="hidden sm:flex items-center gap-1 text-sm font-bold text-slate-500 bg-slate-200/60 p-1 rounded-full shrink-0">
              {['RU', 'KG', 'EN'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    language === lang 
                      ? 'bg-white text-[#09638D] shadow-xs font-extrabold' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </motion.div>

            <motion.button 
              custom={3.5} 
              variants={revealVariant} 
              initial="hidden" 
              animate="visible" 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { tabId: 'clinics' } }));
              }}
              className="px-8 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[15px] font-bold transition-all flex items-center gap-3 shrink-0 whitespace-nowrap transform-gpu backface-hidden will-change-transform cursor-pointer active:scale-95"
            >
              {t('header.contact')}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </header>
      </motion.div>

      {/* Main Ultra-Wide Hero Banner Card */}
      <motion.div 
        layout
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full flex justify-center h-screen max-w-[1920px] mx-auto transform-gpu backface-hidden ${
          isShrunk ? 'px-6 sm:px-12 xl:px-20' : 'px-0'
        }`}
      >
        <motion.div 
          layout
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden bg-slate-900 w-full flex flex-col justify-between p-10 sm:p-14 lg:p-20 text-white z-40 transform-gpu backface-hidden [-webkit-mask-image:-webkit-radial-gradient(white,black)] ${
            isShrunk 
              ? 'h-[calc(100vh-12rem)] rounded-[56px] mt-36' 
              : 'h-screen rounded-none mt-0'
          }`}
        >
          
          {/* Background Video */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-[100vw] h-[100vh] shrink-0 relative"
            >
              {VIDEOS.map((src, index) => (
                <video
                  key={src}
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={src}
                  muted
                  playsInline
                  onEnded={index === currentVideoIndex ? handleVideoEnded : undefined}
                  onTimeUpdate={(e) => {
                    if (index === currentVideoIndex && index === 0 && e.target.currentTime >= 4) {
                      handleVideoEnded();
                    }
                  }}
                  className={`absolute inset-0 w-full h-full object-cover transform-gpu ${
                    index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                />
              ))}
            </motion.div>
          </div>

          {/* Top Hero Description */}
          <motion.div layout transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="relative z-20 max-w-xl antialiased">
            <motion.p 
              custom={2.6} variants={revealVariant} initial="hidden" animate="visible"
              className="text-sm sm:text-base md:text-lg text-slate-100 font-medium leading-relaxed transform-gpu backface-hidden will-change-transform"
            >
              {t('hero.description')}
            </motion.p>
          </motion.div>

          {/* Giant Semi-Transparent Overlay Typography */}
          <motion.div layout transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="relative z-20 pt-12 antialiased">
            <motion.h1 
              custom={3.2} variants={revealVariant} initial="hidden" animate="visible"
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-extrabold tracking-tight text-white/90 leading-none transform-gpu backface-hidden will-change-transform"
            >
              Sanarip Med AI <span className="opacity-[0.15]">Soon</span>
            </motion.h1>
          </motion.div>

        </motion.div>
      </motion.div>

    </div>
  );
};

export default CureLinkHero;
