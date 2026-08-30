import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, BookOpen, Layers } from 'lucide-react';
import { appleScrollVariant, containerVariant } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

export const RAGSecurity = () => {
  const { t } = useLanguage();

  return (
    <section id="rag-security" className="py-24 sm:py-32 md:py-44 bg-[#F3F5F9] text-slate-900 overflow-hidden relative border-t border-slate-200/80">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[#09638D]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-[500px] h-[500px] bg-[#61DED3]/8 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 xl:px-20 relative z-10">
        
        {/* Header Block */}
        <motion.div 
          className="flex flex-col xl:flex-row xl:items-end justify-between mb-16 sm:mb-24 gap-8 sm:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          variants={containerVariant}
        >
          <div>
            <motion.h2 variants={appleScrollVariant} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15]">
              {t('rag.title1')} <br />
              <span className="text-gradient-brand">{t('rag.title2')}</span>
            </motion.h2>
          </div>

          <motion.p variants={appleScrollVariant} className="text-slate-500 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
            {t('rag.description')}
          </motion.p>
        </motion.div>

        {/* Two Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-stretch">
          
          {/* Card 1: Ordinary Generic AI */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={appleScrollVariant}
            className="bg-white p-8 sm:p-12 md:p-14 rounded-[40px] sm:rounded-[48px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] border border-slate-200/80 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-500"
          >
            <div>
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center mb-8 sm:mb-10">
                <XCircle className="w-8 h-8 text-rose-500" />
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.15]">
                {t('rag.genericTitle')}
              </h3>

              <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed mb-8">
                {t('rag.genericDesc')}
              </p>
            </div>

            {/* Visual Risk Tags */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm sm:text-base font-semibold text-rose-600 bg-rose-50/70 px-4 py-3 rounded-2xl border border-rose-100/80">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{t('rag.genericRisk1')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base font-semibold text-rose-600 bg-rose-50/70 px-4 py-3 rounded-2xl border border-rose-100/80">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{t('rag.genericRisk2')}</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Sanarip Med Clinical RAG */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={appleScrollVariant}
            className="bg-slate-900 text-white p-8 sm:p-12 md:p-14 rounded-[40px] sm:rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-transform duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#61DED3]/12 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mb-8 sm:mb-10 backdrop-blur-md border border-white/10">
                <ShieldCheck className="w-8 h-8 text-[#61DED3]" />
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
                {t('rag.ragTitle')}
              </h3>

              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed mb-8">
                {t('rag.ragDesc')}
              </p>
            </div>

            {/* Visual Trusted Tags */}
            <div className="space-y-3 pt-6 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-3 text-sm sm:text-base font-semibold text-[#61DED3] bg-white/5 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <BookOpen className="w-5 h-5 shrink-0" />
                <span>{t('rag.ragTrust1')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base font-semibold text-[#61DED3] bg-white/5 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Layers className="w-5 h-5 shrink-0" />
                <span>{t('rag.ragTrust2')}</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default RAGSecurity;
