import { motion } from "motion/react";

export function Contacts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1440px] mx-auto px-6 py-20 flex flex-col gap-32"
    >
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.08] text-[#0000FF]">
        Давайте обсудим<br />будущее.
      </h1>

      <div className="grid lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div className="flex flex-col gap-16">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">Написать нам</h3>
            <a href="mailto:hello@steeldrake.com" className="text-3xl md:text-5xl font-medium hover:text-[#0000FF] transition-colors interactive-element inline-block">
              hello@steeldrake.com
            </a>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">Позвонить</h3>
            <a href="tel:+70000000000" className="text-3xl md:text-5xl font-medium hover:text-[#0000FF] transition-colors interactive-element inline-block">
              +7 (XXX) XXX-XX-XX
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/40 mb-4">Адрес офиса</h3>
            <p className="text-2xl md:text-3xl font-light">
              Бишкек, Кыргызстан<br />
              ул. Примерная, 123
            </p>
          </div>

          <div className="pt-8 border-t border-[#E5E5E7]">
            <p className="text-lg text-black/60 mb-2">Руководство: Олег Ермаков — Генеральный директор</p>
            <p className="text-lg text-black/60">Юридическая информация: ИП Ермаков О.</p>
          </div>
        </div>

        {/* Interactive Map placeholder */}
        <div className="h-[600px] bg-[#F8F8F9] rounded-3xl overflow-hidden relative group cursor-pointer interactive-element">
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
              Steel Drake Studio
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
