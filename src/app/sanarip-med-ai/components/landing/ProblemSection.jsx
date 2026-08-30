import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, PhoneCall, Clock } from 'lucide-react';
import { appleScrollVariant, containerVariant } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

export const ProblemSection = () => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Parallax transforms for the three cards
  const y1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]); 
  const y3 = useTransform(scrollYProgress, [0, 1], [-40, 40]); 

  return (
    <section ref={containerRef} id="problems" className="py-32 md:py-48 bg-[#F3F5F9] text-slate-900 overflow-hidden relative">
      
      {/* Abstract Background Typography */}
      <div className="absolute top-[10%] left-[-5%] w-[110%] overflow-hidden opacity-[0.03] pointer-events-none flex justify-center -rotate-2">
        <h2 className="text-[25vw] font-black leading-none whitespace-nowrap select-none">OVERLOAD 103</h2>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 xl:px-20 relative z-10">
        
        {/* Header Title - Centered */}
        <motion.div 
          className="w-full max-w-6xl mb-20 md:mb-32 mx-auto text-center flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariant}
        >
          <motion.h2 variants={appleScrollVariant} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15]">
            {t('problems.title1')} <br />
            <span className="text-gradient-brand">{t('problems.title2')}</span>
          </motion.h2>
        </motion.div>

        {/* Dynamic Grid Container */}
        <div className="relative w-full max-w-7xl mx-auto flex flex-col md:block md:min-h-[850px] gap-8">
          
          {/* Card 1: 30% Calls */}
          <motion.div style={{ y: y1 }} className="md:absolute md:top-0 md:left-[5%] md:w-[45%] lg:w-[40%] z-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={appleScrollVariant}
              className="bg-white p-10 md:p-14 rounded-[48px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100/50 -rotate-3 hover:rotate-0 hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center mb-10">
                <PhoneCall className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                {t('problems.card1.tag')}
              </h3>
              <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
                {t('problems.card1.desc')}
              </p>
            </motion.div>
          </motion.div>

          {/* Card 2: Emergency Assistance */}
          <motion.div style={{ y: y2 }} className="md:absolute md:top-[12%] md:right-[5%] md:w-[48%] lg:w-[42%] z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={appleScrollVariant}
              className="bg-slate-900 text-white p-10 md:p-14 rounded-[48px] shadow-2xl rotate-2 hover:rotate-0 hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mb-10 backdrop-blur-sm">
                <Activity className="w-8 h-8 text-sky-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 leading-[1.1] tracking-tight text-white">
                {t('problems.card2.tag')}
              </h3>
              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
                {t('problems.card2.desc')}
              </p>
            </motion.div>
          </motion.div>

          {/* Card 3: Info Deficit */}
          <motion.div style={{ y: y3 }} className="md:absolute md:bottom-0 md:left-[15%] md:w-[70%] z-30">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={appleScrollVariant}
              className="bg-white/70 backdrop-blur-xl p-10 md:p-14 rounded-[48px] shadow-[0_40px_80px_-20px_rgba(9,99,141,0.15)] border border-white/80 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center rotate-1 hover:rotate-0 hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="w-20 h-20 shrink-0 rounded-3xl bg-sky-500/10 flex items-center justify-center">
                <Clock className="w-10 h-10 text-[#09638D]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-[1.1] tracking-tight">
                  {t('problems.card3.tag')}
                </h3>
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  {t('problems.card3.desc')}
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
