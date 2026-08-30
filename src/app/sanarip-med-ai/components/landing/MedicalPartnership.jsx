import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Stethoscope, 
  FlaskConical, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  Check, 
  Calculator, 
  ShieldCheck,
  X
} from 'lucide-react';
import { appleScrollVariant, containerVariant } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';
import { recordLead } from '../../utils/analyticsTracker';

export const MedicalPartnership = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('clinics');
  const [stageMode, setStageMode] = useState('features');
  const [patientCount, setPatientCount] = useState(50);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const partnerCategories = [
    {
      id: 'clinics',
      typeKey: 'clinic',
      title: t('partnership.clinics.title'),
      badge: t('partnership.clinics.badge'),
      icon: Building2,
      subtitle: t('partnership.clinics.subtitle'),
      highlights: [
        t('partnership.clinics.h1'),
        t('partnership.clinics.h2'),
        t('partnership.clinics.h3'),
        t('partnership.clinics.h4')
      ],
      pricing: t('partnership.clinics.pricing'),
      cta: t('partnership.clinics.cta')
    },
    {
      id: 'doctors',
      typeKey: 'doctor',
      title: t('partnership.doctors.title'),
      badge: t('partnership.doctors.badge'),
      icon: Stethoscope,
      subtitle: t('partnership.doctors.subtitle'),
      highlights: [
        t('partnership.doctors.h1'),
        t('partnership.doctors.h2'),
        t('partnership.doctors.h3'),
        t('partnership.doctors.h4')
      ],
      pricing: t('partnership.doctors.pricing'),
      cta: t('partnership.doctors.cta')
    },
    {
      id: 'labs',
      typeKey: 'lab',
      title: t('partnership.labs.title'),
      badge: t('partnership.labs.badge'),
      icon: FlaskConical,
      subtitle: t('partnership.labs.subtitle'),
      highlights: [
        t('partnership.labs.h1'),
        t('partnership.labs.h2'),
        t('partnership.labs.h3'),
        t('partnership.labs.h4')
      ],
      pricing: t('partnership.labs.pricing'),
      cta: t('partnership.labs.cta')
    },
    {
      id: 'corporate',
      typeKey: 'b2b',
      title: t('partnership.b2b.title'),
      badge: t('partnership.b2b.badge'),
      icon: Briefcase,
      subtitle: t('partnership.b2b.subtitle'),
      highlights: [
        t('partnership.b2b.h1'),
        t('partnership.b2b.h2'),
        t('partnership.b2b.h3'),
        t('partnership.b2b.h4')
      ],
      pricing: t('partnership.b2b.pricing'),
      cta: t('partnership.b2b.cta')
    }
  ];

  const calcConfigs = {
    clinics: {
      title: t('partnership.clinics.calcTitle'),
      sliderLabel: t('partnership.clinics.sliderLabel'),
      unit: t('partnership.clinics.unit'),
      unitShort: t('partnership.clinics.unitShort'),
      min: 10,
      max: 300,
      step: 10,
      defaultVal: 50,
      label1: t('partnership.clinics.label1'),
      label2: t('partnership.clinics.label2'),
      calc: (count) => {
        const rev = count * 3000;
        const fee = count * 300;
        return { value1: rev, value2: rev - fee };
      }
    },
    doctors: {
      title: t('partnership.doctors.calcTitle'),
      sliderLabel: t('partnership.doctors.sliderLabel'),
      unit: t('partnership.doctors.unit'),
      unitShort: t('partnership.doctors.unitShort'),
      min: 10,
      max: 150,
      step: 5,
      defaultVal: 30,
      label1: t('partnership.doctors.label1'),
      label2: t('partnership.doctors.label2'),
      calc: (count) => {
        const rev = count * 1500;
        const fee = count * 300;
        return { value1: rev, value2: rev - fee };
      }
    },
    labs: {
      title: t('partnership.labs.calcTitle'),
      sliderLabel: t('partnership.labs.sliderLabel'),
      unit: t('partnership.labs.unit'),
      unitShort: t('partnership.labs.unitShort'),
      min: 20,
      max: 500,
      step: 20,
      defaultVal: 100,
      label1: t('partnership.labs.label1'),
      label2: t('partnership.labs.label2'),
      calc: (count) => {
        const rev = count * 2000;
        const profit = Math.round(rev * 0.65);
        return { value1: rev, value2: profit };
      }
    },
    corporate: {
      title: t('partnership.b2b.calcTitle'),
      sliderLabel: t('partnership.b2b.sliderLabel'),
      unit: t('partnership.b2b.unit'),
      unitShort: t('partnership.b2b.unitShort'),
      min: 20,
      max: 500,
      step: 10,
      defaultVal: 100,
      label1: t('partnership.b2b.label1'),
      label2: t('partnership.b2b.label2'),
      calc: (count) => {
        const cost = Math.max(5000, count * 50);
        const savings = Math.round(count * 850);
        return { value1: cost, value2: savings };
      }
    }
  };

  const currentCalcConfig = calcConfigs[activeTab] || calcConfigs.clinics;
  const { value1: estimatedValue1, value2: estimatedValue2 } = currentCalcConfig.calc(patientCount);

  const currentCategory = partnerCategories.find(c => c.id === activeTab) || partnerCategories[0];

  const [modalTab, setModalTab] = useState('partner');
  const [formData, setFormData] = useState({
    partnerType: 'clinic',
    name: '',
    organization: '',
    phone: '',
    comment: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (calcConfigs[activeTab]) {
      setPatientCount(calcConfigs[activeTab].defaultVal);
    }
  }, [activeTab]);

  const handleOpenModal = (tabId, mode = 'partner') => {
    const category = partnerCategories.find(c => c.id === tabId) || currentCategory;
    setFormData(prev => ({ ...prev, partnerType: category.typeKey }));
    setModalTab(mode);
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleGlobalOpen = (e) => {
      const targetTab = e?.detail?.tabId || activeTab || 'clinics';
      const mode = e?.detail?.mode || 'partner';
      handleOpenModal(targetTab, mode);
    };
    window.addEventListener('open-contact-modal', handleGlobalOpen);
    return () => window.removeEventListener('open-contact-modal', handleGlobalOpen);
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    recordLead({
      type: activeTab,
      partnerType: formData.partnerType,
      mode: modalTab,
      name: formData.name,
      organization: formData.organization,
      phone: formData.phone
    });
    setIsSubmitted(true);
  };

  return (
    <section id="partnership" className="py-12 sm:py-16 bg-[#F3F5F9] text-slate-900 relative overflow-hidden border-t border-slate-300">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-[#61DED3]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[500px] h-[500px] bg-[#09638D]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 xl:px-20 relative z-10">
        
        {/* Top Header Block */}
        <motion.div 
          className="flex flex-col xl:flex-row xl:items-end justify-between mb-16 sm:mb-20 gap-8 sm:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-100px' }}
          variants={containerVariant}
        >
          <div>
            <motion.h2 variants={appleScrollVariant} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15]">
              {t('partnership.title1')} <br />
              <span className="text-gradient-brand">{t('partnership.title2')}</span>
            </motion.h2>
          </div>

          <motion.p variants={appleScrollVariant} className="text-slate-500 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
            {t('partnership.description')}
          </motion.p>
        </motion.div>

        {/* Dynamic Studio Canvas */}
        <motion.div 
          animate={{ 
            height: typeof window !== 'undefined' && window.innerWidth >= 1024 
              ? (stageMode === 'features' ? 570 : 695) 
              : 'auto' 
          }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="bg-white rounded-[32px] border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 will-change-[height]"
        >
          
          {/* Left Sidebar */}
          <div className="lg:col-span-4 bg-[#F8FAFC] border-b lg:border-b-0 lg:border-r border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 px-2">
                {t('partnership.categoryTitle')}
              </div>

              <div className="space-y-3">
                {partnerCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeTab === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`w-full pl-4 pr-5 py-3.5 rounded-2xl text-left flex items-center justify-between gap-3 cursor-pointer ${
                        isActive 
                          ? 'bg-[#09638D] text-white shadow-md shadow-[#09638D]/25 font-bold' 
                          : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-slate-200/70 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white/20 text-[#61DED3]' : 'bg-[#09638D]/10 text-[#09638D]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className={`font-bold text-base tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            {cat.title}
                          </h3>
                          <div className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-cyan-200' : 'text-slate-400'}`}>
                            {cat.badge}
                          </div>
                        </div>
                      </div>

                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 mr-1 ${
                        isActive ? 'bg-[#61DED3] ring-4 ring-[#61DED3]/30' : 'bg-slate-300'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/70 text-slate-600 text-xs font-medium flex items-center gap-3 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#09638D] shrink-0" />
              <span>{t('partnership.contractTrust')}</span>
            </div>
          </div>

          {/* Right Stage */}
          <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold uppercase tracking-wider text-[#09638D] bg-[#09638D]/10 px-3.5 py-1.5 rounded-full">
                  {currentCategory.badge}
                </span>
              </div>

              <div className="bg-slate-100/90 p-1 rounded-full inline-flex items-center gap-1 border border-slate-200/80 shrink-0">
                <button
                  onClick={() => setStageMode('features')}
                  className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                    stageMode === 'features'
                      ? 'bg-white text-[#09638D] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('partnership.tabFeatures')}
                </button>
                <button
                  onClick={() => setStageMode('calculator')}
                  className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                    stageMode === 'calculator'
                      ? 'bg-[#09638D] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calculator className="w-4 h-4 shrink-0" />
                  <span>{t('partnership.tabCalc')}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center py-4">
              <AnimatePresence mode="wait" initial={false}>
                {stageMode === 'features' ? (
                  <motion.div
                    key={`features-${activeTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {currentCategory.title}
                      </h3>
                      <p className="text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
                        {currentCategory.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentCategory.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                          <div className="w-6 h-6 rounded-lg bg-[#09638D]/10 text-[#09638D] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <span className="text-base text-slate-700 font-medium leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`calc-${activeTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0A3D59] text-white p-7 sm:p-8 shadow-lg relative overflow-hidden space-y-6"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#61DED3]/15 blur-[60px] rounded-full pointer-events-none" />

                    <div className="relative z-10 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                          {currentCalcConfig.title}
                        </h4>
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-200 bg-white/10 px-3.5 py-1.5 rounded-full">
                          {t('partnership.calcMonthBadge')}
                        </span>
                      </div>

                      <div className="space-y-4 bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="flex justify-between items-center text-base font-bold">
                          <span className="text-cyan-100">{currentCalcConfig.sliderLabel}</span>
                          <span className="text-2xl font-black text-[#61DED3]">{patientCount} {currentCalcConfig.unit}</span>
                        </div>
                        
                        <div className="py-2.5">
                          <input 
                            type="range" 
                            min={currentCalcConfig.min} 
                            max={currentCalcConfig.max} 
                            step={currentCalcConfig.step}
                            value={patientCount}
                            onChange={(e) => setPatientCount(Number(e.target.value))}
                            className="w-full h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#61DED3]"
                          />
                        </div>

                        <div className="flex justify-between text-xs text-cyan-200/70 font-semibold">
                          <span>{currentCalcConfig.min} {currentCalcConfig.unitShort}</span>
                          <span>{Math.round((currentCalcConfig.min + currentCalcConfig.max) / 2)} {currentCalcConfig.unitShort}</span>
                          <span>{currentCalcConfig.max} {currentCalcConfig.unitShort}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col justify-center px-6 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                          <div className="text-xs text-cyan-200/80 font-bold uppercase tracking-wider mb-2 leading-snug">
                            {currentCalcConfig.label1}
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-white leading-tight">
                            ~{estimatedValue1.toLocaleString()} <span className="text-base font-normal text-cyan-200">сом</span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center px-6 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                          <div className="text-xs text-cyan-200/80 font-bold uppercase tracking-wider mb-2 leading-snug">
                            {currentCalcConfig.label2}
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-[#61DED3] leading-tight">
                            ~{estimatedValue2.toLocaleString()} <span className="text-base font-normal text-cyan-200">сом</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 shrink-0">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('partnership.tariffModel')}</div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#09638D]">{currentCategory.pricing}</div>
              </div>

              <button 
                onClick={() => handleOpenModal(activeTab)}
                className="px-8 py-3.5 rounded-full bg-[#09638D] hover:bg-[#075174] text-white font-extrabold text-base transition-all shadow-md shadow-[#09638D]/20 inline-flex items-center justify-center gap-2 group whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <span>{currentCategory.cta}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </motion.div>

      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[3.2rem] p-8 sm:p-12 lg:p-14 shadow-[0_32px_96px_-24px_rgba(9,99,141,0.2)] border border-white/90 z-10 my-auto text-left transform-gpu backface-hidden will-change-transform antialiased overflow-hidden"
            >
              <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#61DED3]/15 blur-3xl rounded-full pointer-events-none" />

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 px-2 relative"
                >
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-0 right-0 w-11 h-11 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-100">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {modalTab === 'waitlist' ? t('partnership.modal.waitlistSuccessTitle') : t('partnership.modal.successTitle')}
                  </h3>
                  <p className="text-slate-500 text-base sm:text-lg font-normal max-w-md mx-auto mb-8 leading-relaxed">
                    {modalTab === 'waitlist' ? t('partnership.modal.waitlistSuccessDesc') : t('partnership.modal.successDesc')}
                  </p>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-10 py-4 rounded-full bg-[#09638D] text-white font-extrabold text-base hover:bg-[#075174] transition-all shadow-md shadow-[#09638D]/20 cursor-pointer active:scale-95"
                    >
                      {t('partnership.modal.close')}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-6 mb-7">
                    <div className="space-y-2 max-w-lg">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
                        {modalTab === 'waitlist' ? t('partnership.modal.waitlistTitle') : t('partnership.modal.title')}
                      </h3>
                      <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
                        {modalTab === 'waitlist' ? t('partnership.modal.waitlistSubtitle') : t('partnership.modal.subtitle')}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-11 h-11 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all active:scale-90 cursor-pointer shrink-0 mt-0.5"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="w-full bg-slate-100/90 p-1.5 rounded-full flex border border-slate-200/70 mb-8">
                    <button
                      type="button"
                      onClick={() => setModalTab('partner')}
                      className={`flex-1 py-3 px-4 rounded-full text-sm sm:text-base font-bold transition-all text-center cursor-pointer ${
                        modalTab === 'partner'
                          ? 'bg-white text-[#09638D] shadow-sm font-extrabold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {t('partnership.modal.tabPartner')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('waitlist')}
                      className={`flex-1 py-3 px-4 rounded-full text-sm sm:text-base font-bold transition-all text-center cursor-pointer ${
                        modalTab === 'waitlist'
                          ? 'bg-[#09638D] text-white shadow-sm font-extrabold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {t('partnership.modal.tabWaitlist')}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {modalTab === 'waitlist' ? t('partnership.modal.waitlistNameLabel') : t('partnership.modal.nameLabel')} *
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder={modalTab === 'waitlist' ? t('partnership.modal.waitlistNamePlaceholder') : t('partnership.modal.namePlaceholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-[58px] px-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-lg font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#09638D]/10 focus:border-[#09638D] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {modalTab === 'waitlist' ? t('partnership.modal.waitlistOrgLabel') : t('partnership.modal.orgLabel')}
                      </label>
                      <input 
                        type="text"
                        placeholder={modalTab === 'waitlist' ? t('partnership.modal.waitlistOrgPlaceholder') : t('partnership.modal.orgPlaceholder')}
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full h-[58px] px-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-lg font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#09638D]/10 focus:border-[#09638D] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {t('partnership.modal.phoneLabel')} *
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder={t('partnership.modal.phonePlaceholder')}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-[58px] px-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base sm:text-lg font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#09638D]/10 focus:border-[#09638D] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full h-[58px] rounded-full bg-[#09638D] hover:bg-[#075174] text-white font-extrabold text-base sm:text-lg transition-all shadow-xl shadow-[#09638D]/25 flex items-center justify-center gap-2.5 group active:scale-[0.98] cursor-pointer"
                      >
                        <span>{modalTab === 'waitlist' ? t('partnership.modal.waitlistSubmit') : t('partnership.modal.submit')}</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default MedicalPartnership;
