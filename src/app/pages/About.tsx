import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const team = [
  {
    id: 1,
    name: "Олег Ермаков",
    role: "Генеральный директор, Главный дизайнер",
    img: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&q=80&w=800",
    quote: "Мы убираем всё лишнее, чтобы обнажить суть вещей.",
    skills: ["Визионерство", "Индустриальный дизайн", "Арт-дирекшн"],
    projects: "Sandyq, Ala-Too, One Ordo"
  },
  {
    id: 2,
    name: "Анна Смирнова",
    role: "Арт-директор",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    quote: "Эстетика — это не украшение, а способ коммуникации.",
    skills: ["Брендинг", "Графический дизайн", "Типографика"],
    projects: "Salkyn, TechStart"
  },
  {
    id: 3,
    name: "Михаил Чен",
    role: "Lead 3D Artist",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    quote: "Каждая деталь имеет значение, когда ты создаешь миры.",
    skills: ["3D Моделирование", "Рендеринг", "Motion Design"],
    projects: "Auto Concept X, VR Space"
  },
  {
    id: 4,
    name: "Елена Вейс",
    role: "Архитектор",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800",
    quote: "Пространство должно дышать вместе с человеком.",
    skills: ["Концепт-архитектура", "Урбанистика", "Интерьеры"],
    projects: "One Ordo Resort, Eco Villa"
  }
];

export function About() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1440px] mx-auto px-6 py-20 flex flex-col gap-32"
    >
      {/* Manifesto */}
      <section className="grid md:grid-cols-2 gap-12 items-start">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.08] text-[#0000FF] sticky top-32">
          Основано на страсти к форме.
        </h1>
        <div className="text-xl md:text-2xl leading-relaxed text-black/80 font-light">
          «Steel Drake Studio была основана в 2011 году дизайнером и визионером Олегом Ермаковым. Начав как концепт-студия прогрессивного дизайна, мы выросли в международное бюро, способное решать задачи любого масштаба — от айдентики технологического стартапа до проектирования футуристичного транспорта и архитектурных ансамблей. Наша история — это непрерывный поиск гармонии между функциональностью и чистой эмоцией.»
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-[#F8F8F9] rounded-3xl p-10 md:p-20">
        <h2 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-12">Наш манифест</h2>
        <div className="text-xl md:text-2xl leading-relaxed text-black/80 max-w-4xl font-light">
          «Мы верим, что дизайн — это не просто оформление поверхности. Это язык, на котором продукт разговаривает с пользователем. Мы убираем всё лишнее, чтобы обнажить суть вещей. Наша философия строится на трех столпах: бескомпромиссная эргономика, технологическая эстетика и долговечность смыслов. Мы не следуем трендам — мы проектируем будущее, которое останется актуальным через десятилетия.»
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-4xl md:text-5xl font-bold leading-[1.12] mb-12">Команда</h2>
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
                            <h4 className="text-sm text-black/50 uppercase tracking-wider font-semibold mb-3">Компетенции</h4>
                            <div className="flex flex-wrap gap-2">
                              {member.skills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-white rounded-full text-sm font-medium border border-[#E5E5E7]">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm text-black/50 uppercase tracking-wider font-semibold mb-3">Любимые проекты</h4>
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
      </section>
    </motion.div>
  );
}
