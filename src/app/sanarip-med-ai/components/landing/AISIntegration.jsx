import React from 'react';
import { motion } from 'framer-motion';
import { appleScrollVariant, containerVariant } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

export const AISIntegration = () => {
  const { t } = useLanguage();

  return (
    <section id="integration" className="py-32 md:py-48 bg-[#F3F5F9] text-slate-900 overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 xl:px-20">
        
        {/* Header */}
        <motion.div 
          className="max-w-4xl mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          variants={containerVariant}
        >
          <motion.h2 variants={appleScrollVariant} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15]">
            {t('integration.title1')} <br />
            <span className="text-gradient-brand">{t('integration.title2')}</span>
          </motion.h2>
        </motion.div>

        {/* Integration Comparison Table */}
        <motion.div 
          className="border-y border-slate-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          variants={containerVariant}
        >
          
          <motion.div variants={appleScrollVariant} className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-300 text-base sm:text-lg font-extrabold text-slate-500 tracking-wider">
            <div className="py-6 md:pr-12 md:border-r border-slate-300">{t('integration.colOldTitle')}</div>
            <div className="py-6 md:pl-12 text-[#09638D]">{t('integration.colNewTitle')}</div>
          </motion.div>

          <div className="text-base sm:text-lg text-slate-700 font-medium divide-y divide-slate-200">
            {/* Row 1 */}
            <motion.div variants={appleScrollVariant} className="grid grid-cols-1 md:grid-cols-2">
              <div className="py-8 md:pr-12 md:border-r border-slate-200">{t('integration.row1Old')}</div>
              <div className="py-8 md:pl-12">{t('integration.row1New')}</div>
            </motion.div>

            {/* Row 2 */}
            <motion.div variants={appleScrollVariant} className="grid grid-cols-1 md:grid-cols-2">
              <div className="py-8 md:pr-12 md:border-r border-slate-200">{t('integration.row2Old')}</div>
              <div className="py-8 md:pl-12">{t('integration.row2New')}</div>
            </motion.div>

            {/* Row 3 */}
            <motion.div variants={appleScrollVariant} className="grid grid-cols-1 md:grid-cols-2">
              <div className="py-8 md:pr-12 md:border-r border-slate-200">{t('integration.row3Old')}</div>
              <div className="py-8 md:pl-12">{t('integration.row3New')}</div>
            </motion.div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default AISIntegration;
