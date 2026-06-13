import { motion } from "motion/react";
import { useContext } from "react";
import { LanguageContext } from "../i18n";

export function Contacts() {
  const { t } = useContext(LanguageContext);

  const scrollRevealConfig = {
    initial: { y: 40, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.9, ease: [0.215, 0.61, 0.355, 1] }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1440px] mx-auto px-6 py-20 flex flex-col gap-32"
    >
      <motion.h1 
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.08] text-[#0000FF]"
      >
        {t.contacts.title}
      </motion.h1>

      <div className="grid lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <motion.div 
          {...scrollRevealConfig}
          className="flex flex-col gap-16"
        >
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">{t.contacts.writeUs}</h3>
            <a href="mailto:hello@steeldrake.com" className="text-3xl md:text-5xl font-medium hover:text-[#0000FF] transition-colors interactive-element inline-block">
              hello@steeldrake.com
            </a>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">{t.contacts.callUs}</h3>
            <a href="tel:+70000000000" className="text-3xl md:text-5xl font-medium hover:text-[#0000FF] transition-colors interactive-element inline-block">
              +7 (XXX) XXX-XX-XX
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">{t.contacts.officeTitle}</h3>
            <p className="text-2xl md:text-3xl font-light whitespace-pre-line">
              {t.contacts.officeAddress}
            </p>
          </div>

          <div className="pt-8 border-t border-[#E5E5E7]">
            <p className="text-lg text-black/60 mb-2">{t.contacts.leader}</p>
            <p className="text-lg text-black/60">{t.contacts.legal}</p>
          </div>
        </motion.div>

        {/* Interactive Map placeholder */}
        <motion.div 
          {...scrollRevealConfig}
          className="h-[600px] bg-[#F8F8F9] rounded-3xl overflow-hidden relative group cursor-pointer interactive-element"
        >
          {/* Simple map visual using CSS pattern since we can't easily embed real gmaps without api key */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
          
          {/* Transition on hover to invert */}
          <div className="absolute inset-0 bg-white mix-blend-difference opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-6 h-6 bg-[#0000FF] rounded-full animate-ping absolute opacity-50" />
            <div className="w-6 h-6 bg-[#0000FF] rounded-full relative z-10 border-4 border-white shadow-lg" />
            <div className="mt-4 px-4 py-2 bg-white rounded-full shadow-lg font-medium text-sm z-10 transition-colors group-hover:bg-black group-hover:text-white">
              {t.contacts.markerLabel}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
