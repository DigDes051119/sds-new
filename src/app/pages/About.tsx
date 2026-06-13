import { motion, AnimatePresence } from "motion/react";
import { useContext, useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageContext } from "../i18n";
import { teamTranslations } from "../teamData";

export function About() {
  const { t, locale } = useContext(LanguageContext);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const labels = {
    en: { skills: "Skills", projects: "Favorite projects" },
    kg: { skills: "Компетенциялар", projects: "Тандалган долбоорлор" },
    ru: { skills: "Компетенции", projects: "Любимые проекты" }
  };

  const currentLabels = labels[locale] || labels.ru;
  const team = teamTranslations[locale] || teamTranslations.ru;

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
      {/* Manifesto */}
      <motion.section 
        {...scrollRevealConfig}
        className="grid md:grid-cols-2 gap-12 items-start"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.08] text-[#0000FF] md:sticky md:top-32">
          {t.about.manifestoHeading}
        </h1>
        <div className="text-xl md:text-2xl leading-relaxed text-black/80 font-light">
          «{t.about.manifestoText}»
        </div>
      </motion.section>

      {/* Philosophy */}
      <motion.section 
        {...scrollRevealConfig}
        className="bg-[#F8F8F9] rounded-3xl p-10 md:p-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-12">{t.about.philosophyTitle}</h2>
        <div className="text-xl md:text-2xl leading-relaxed text-black/80 max-w-4xl font-light">
          «{t.about.philosophyText}»
        </div>
      </motion.section>

      {/* Team */}
      <motion.section
        {...scrollRevealConfig}
      >
        <h2 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-12">{t.about.teamTitle}</h2>
        <div className="flex flex-col gap-4">
          {team.map((member) => {
            const isExpanded = expandedId === member.id;

            return (
              <motion.div
                key={member.id}
                layout
                onClick={() => setExpandedId(isExpanded ? null : member.id)}
                className="bg-white border border-[#E5E5E7] rounded-3xl overflow-hidden cursor-pointer interactive-element group"
              >
                <div className="flex flex-col md:flex-row items-center p-6 gap-8">
                  <motion.div layout className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-full">
                    <ImageWithFallback 
                      src={member.img} 
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </motion.div>
                  
                  <motion.div layout className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-[#0000FF] font-medium mt-1">{member.role}</p>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-[#E5E5E7]"
                    >
                      <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12 bg-[#F8F8F9]">
                        <div>
                          <p className="text-2xl font-light italic text-black/80 mb-6">
                            "{member.quote}"
                          </p>
                        </div>
                        <div className="space-y-8">
                          <div>
                            <h4 className="text-sm text-black/50 uppercase tracking-wider font-semibold mb-3">{currentLabels.skills}</h4>
                            <div className="flex flex-wrap gap-2">
                              {member.skills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-white rounded-full text-sm font-medium border border-[#E5E5E7]">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm text-black/50 uppercase tracking-wider font-semibold mb-3">{currentLabels.projects}</h4>
                            <p className="text-lg">{member.projects}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}
