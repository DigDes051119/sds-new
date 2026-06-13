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
            <a href="mailto:getdesign@steeldrakestudioteam.com" className="text-3xl md:text-5xl font-medium hover:text-[#0000FF] transition-colors interactive-element inline-block">
              getdesign@steeldrakestudioteam.com
            </a>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">{t.contacts.callUs}</h3>
            <a href="https://wa.me/996702507888" target="_blank" rel="noopener noreferrer" className="text-3xl md:text-5xl font-medium hover:text-[#0000FF] transition-colors interactive-element inline-block">
              +996 702 507 888
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">{t.contacts.officeTitle}</h3>
            <a 
              href="https://www.google.com/maps/place/1%2F2+%D1%83%D0%BB.+%D0%93%D0%BE%D1%80%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE,+%D0%91%D0%B8%D1%88%D0%BA%D0%B5%D0%BA+720001/@42.8569615,74.6340349,294m/data=!3m1!1e3!4m6!3m5!1s0x389eb649ed50dd4f:0xfa828968edacc1ba!8m2!3d42.856828!4d74.6180463!16s%2Fg%2F11ym4g96dn?hl=ru&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl md:text-3xl font-light whitespace-pre-line hover:text-[#0000FF] transition-colors interactive-element inline-block"
            >
              {t.contacts.officeAddress}
            </a>
          </div>

          <div className="pt-8 border-t border-[#E5E5E7]">
            <p className="text-lg text-black/60 mb-2">{t.contacts.leader}</p>
            <p className="text-lg text-black/60">{t.contacts.legal}</p>
          </div>
        </motion.div>

        {/* Interactive Map */}
        <motion.div 
          {...scrollRevealConfig}
          className="h-[600px] bg-[#F8F8F9] rounded-3xl overflow-hidden relative"
        >
          <iframe 
            src="https://maps.google.com/maps?q=42.856828,74.6180463&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
