import React from 'react';
import { motion } from 'framer-motion';
import { appleScrollVariant, containerVariant } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

export const StoriesAndDoctorShowcase = () => {
  const { t } = useLanguage();

  return (
    <section id="access" className="py-32 md:py-48 bg-[#F3F5F9] text-slate-900 relative overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 xl:px-20">
        
        {/* Bishkek Pilot Launch & Messenger Access Block */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          variants={containerVariant}
        >
          <motion.h2 variants={appleScrollVariant} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15]">
            {t('stories.title1')} <br /><span className="text-gradient-brand">{t('stories.title2')}</span>
          </motion.h2>

          <motion.div variants={containerVariant} className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mt-16 pt-16 border-t border-slate-300">
            {/* Card 1 */}
            <motion.div variants={appleScrollVariant} className="flex flex-col">
              <h4 className="font-extrabold text-slate-900 text-2xl mb-4 tracking-tight">
                {t('stories.card1Title')}
              </h4>
              <p className="text-base lg:text-lg text-slate-600 font-medium leading-relaxed">
                {t('stories.card1Desc')}
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={appleScrollVariant} className="flex flex-col">
              <h4 className="font-extrabold text-slate-900 text-2xl mb-4 tracking-tight">
                {t('stories.card2Title')}
              </h4>
              <p className="text-base lg:text-lg text-slate-600 font-medium leading-relaxed">
                {t('stories.card2Desc')}
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={appleScrollVariant} className="flex flex-col">
              <h4 className="font-extrabold text-slate-900 text-2xl mb-4 tracking-tight">
                {t('stories.card3Title')}
              </h4>
              <p className="text-base lg:text-lg text-slate-600 font-medium leading-relaxed">
                {t('stories.card3Desc')}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default StoriesAndDoctorShowcase;
