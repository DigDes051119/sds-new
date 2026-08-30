import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SanaripLogo } from '../common/SanaripLogo';
import { ArrowRight, ShieldCheck, Heart, MessageCircle, Clock, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const FooterCTA = () => {
  const { t } = useLanguage();
  const [isSoonModalOpen, setIsSoonModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSoonModalOpen(false);
    };
    if (isSoonModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSoonModalOpen]);

  return (
    <footer className="bg-[#F3F5F9] text-slate-900 pt-12 pb-16 relative">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 xl:px-20">
        
        {/* Luxury Full-Width Site Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[3rem] bg-gradient-to-br from-[#063C57] via-[#09638D] to-[#0E82BA] text-white p-10 sm:p-16 lg:p-24 shadow-2xl overflow-hidden mb-16 text-center flex flex-col items-center justify-center border border-white/15"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#61DED3]/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0E82BA]/30 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]">
            {t('footer.ctaTitle')}
          </h2>

          <p className="mt-5 text-cyan-100 text-base sm:text-xl max-w-2xl font-normal leading-relaxed">
            {t('footer.ctaSubtitle')}
          </p>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsSoonModalOpen(true)}
              className="px-8 py-4 rounded-full bg-white text-[#09638D] hover:bg-slate-50 font-extrabold text-base transition-all shadow-xl shadow-slate-950/20 flex items-center gap-2.5 group active:scale-95 cursor-pointer"
            >
              <span>{t('footer.ctaTelegram')}</span>
              <div className="w-7 h-7 rounded-full bg-[#09638D] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <a
              href="https://wa.me/996778051119?text=Здравствуйте!%20Хочу%20получить%20консультацию%20Sanarip%20Med%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/25 text-white font-bold text-base flex items-center gap-2.5 transition-all backdrop-blur-md active:scale-95"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span>{t('footer.ctaWhatsApp')}</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 pt-7 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-cyan-100/90 font-medium">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#61DED3]" /> Минздрав КР
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#61DED3]" /> 100% Privacy
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#61DED3]" /> 24/7 Access
            </span>
          </div>
        </motion.div>

        {/* Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pt-10 border-t border-slate-200/80">
          
          {/* Col 1: Logo & Info */}
          <div className="lg:col-span-4 space-y-5">
            <SanaripLogo className="h-11 sm:h-12" />
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-sm">
              {t('hero.description')}
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-100/90 border border-slate-200 text-sm font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#09638D]" />
                <span className="text-slate-500">Dev:</span>
                <span className="font-bold text-slate-900">Steel Drake Studio</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-700">Акимхан Солтонкулов</span>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Features */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">{t('footer.col1Title')}</h4>
            <ul className="space-y-3 text-sm sm:text-[15px] font-medium text-slate-600">
              <li><a href="#ai-chat" className="hover:text-[#09638D] transition-colors">{t('footer.col1L1')}</a></li>
              <li><a href="#ai-vision" className="hover:text-[#09638D] transition-colors">{t('footer.col1L2')}</a></li>
              <li><a href="#rag-security" className="hover:text-[#09638D] transition-colors">{t('footer.col1L3')}</a></li>
              <li><a href="#integration" className="hover:text-[#09638D] transition-colors">{t('footer.col1L4')}</a></li>
            </ul>
          </div>

          {/* Col 3: Partners & Doctors */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">{t('footer.col2Title')}</h4>
            <ul className="space-y-3 text-sm sm:text-[15px] font-medium text-slate-600">
              <li><a href="#partnership" className="hover:text-[#09638D] transition-colors font-semibold text-[#09638D]">{t('footer.col2L1')}</a></li>
              <li><a href="#partnership" className="hover:text-[#09638D] transition-colors">{t('footer.col2L2')}</a></li>
              <li><a href="#partnership" className="hover:text-[#09638D] transition-colors">{t('footer.col2L3')}</a></li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { tabId: 'clinics' } }))}
                  className="hover:text-[#09638D] transition-colors cursor-pointer text-left"
                >
                  {t('footer.col2L4')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">{t('footer.col3Title')}</h4>
            <ul className="space-y-3 text-sm sm:text-[15px] font-medium text-slate-600">
              <li>📍 {t('footer.col3City')}</li>
              <li>
                <a href="tel:+996778051119" className="hover:text-[#09638D] transition-colors font-semibold">
                  📞 +996 (778) 05-11-19
                </a>
              </li>
              <li>
                <a href="mailto:sanaripmedai@gmail.com" className="hover:text-[#09638D] transition-colors">
                  ✉️ sanaripmedai@gmail.com
                </a>
              </li>
              <li>⏰ {t('footer.col3Desc')}</li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 font-medium gap-4">
          <div>
            © 2026 Sanarip Med AI. {t('footer.rights')}
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-[#09638D] transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-[#09638D] transition-colors">{t('footer.terms')}</a>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-admin-dashboard'))}
              className="hover:text-[#09638D] transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-[#09638D]"
              title="Горячая клавиша: Ctrl + Shift + A"
            >
              <span>🔒</span>
              <span>Админка</span>
            </button>
          </div>
        </div>

      </div>

      {/* SOON Popup Modal */}
      <AnimatePresence>
        {isSoonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsSoonModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 overflow-hidden text-center z-10 transform-gpu backface-hidden will-change-transform antialiased"
            >
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-[#61DED3]/25 to-[#09638D]/20 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={() => setIsSoonModalOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-6xl sm:text-7xl font-black tracking-tight text-slate-900 leading-none mb-4 mt-4">
                SOON
              </h2>

              <p className="text-lg sm:text-xl font-bold text-[#09638D] mb-3">
                {t('footer.soonModal.subheading')}
              </p>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-8">
                {t('footer.soonModal.desc')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  onClick={() => setIsSoonModalOpen(false)}
                  className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t('footer.soonModal.btnOk')}
                </button>
                <a
                  href="https://wa.me/996778051119?text=Здравствуйте!%20Хочу%20узнать%20о%20запуске%20Sanarip%20Med%20AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                  <span>{t('footer.soonModal.btnWa')}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default FooterCTA;
