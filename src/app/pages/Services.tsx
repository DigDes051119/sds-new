import { motion, AnimatePresence } from "motion/react";
import { useContext, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { LanguageContext } from "../i18n";

export function Services() {
  const { t } = useContext(LanguageContext);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const services = t.services.items;

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
      className="max-w-[1440px] mx-auto px-6 py-20"
    >
      <motion.h1 
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.08] text-[#0000FF] mb-20"
      >
        {t.services.title}
      </motion.h1>

      <div className="flex flex-col border-t border-[#E5E5E7]">
        {services.map((service) => {
          const isExpanded = expandedId === service.id;

          return (
            <motion.div 
              key={service.id}
              {...scrollRevealConfig}
              className="border-b border-[#E5E5E7] interactive-element"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : service.id)}
                className="w-full py-8 flex items-center justify-between group text-left"
              >
                <div className="flex items-baseline gap-8">
                  <span className="text-2xl font-light text-[#0000FF] w-12">{service.id}</span>
                  <span className="text-3xl md:text-5xl font-semibold group-hover:text-[#0000FF] transition-colors">
                    {service.title}
                  </span>
                </div>
                <div className={`p-2 rounded-full border ${isExpanded ? 'border-[#0000FF] text-[#0000FF]' : 'border-[#E5E5E7] text-black group-hover:border-[#0000FF] group-hover:text-[#0000FF]'} transition-colors`}>
                  {isExpanded ? <Minus size={24} /> : <Plus size={24} />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-12 pl-20 grid md:grid-cols-2 gap-12">
                      <div>
                        <p className="text-xl md:text-2xl font-light leading-relaxed text-black/80">
                          {service.desc}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm text-[#0000FF] uppercase tracking-wider font-semibold mb-6">
                          {t.services.stepsTitle}
                        </h4>
                        <ol className="space-y-4">
                          {service.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-4 text-lg">
                              <span className="font-semibold text-black/40">0{idx + 1}</span>
                              <span className="text-black/80">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
