import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const services = [
  {
    id: "01",
    title: "Брендирование",
    desc: "Создание уникального ДНК бренда: от позиционирования и нейминга до визуальной экосистемы и гайдлайнов.",
    steps: [
      "Исследование рынка и аудит конкурентов.",
      "Разработка платформы бренда и концепций визуальной идентификации.",
      "Создание брендбука и поддержка при внедрении."
    ]
  },
  {
    id: "02",
    title: "Графический дизайн",
    desc: "Проектирование коммуникационных материалов, полиграфии, упаковки и цифровых графических интерфейсов.",
    steps: [
      "Анализ носителей и определение стилистического вектора.",
      "Проектирование макетов и подбор шрифтовых пар.",
      "Подготовка файлов к производству и авторский надзор."
    ]
  },
  {
    id: "03",
    title: "Индустриальный дизайн",
    desc: "Разработка эстетичных, функциональных и технологичных физических объектов для серийного производства.",
    steps: [
      "Эскизирование, эргономический анализ и поиск формы.",
      "Трехмерное моделирование (CAD) с учетом производственных ограничений.",
      "Создание прототипов и доработка деталей."
    ]
  },
  {
    id: "04",
    title: "Автомобильный дизайн",
    desc: "Проектирование экстерьеров и интерьеров транспортных средств — от концепт-каров до коммерческого транспорта.",
    steps: [
      "Пропорциональный поиск и компоновка (Package design).",
      "Скетчинг и создание высокополигональных 3D-моделей (Class-A surfaces).",
      "Визуализация в реалистичном окружении и подготовка к инженерной проработке."
    ]
  },
  {
    id: "05",
    title: "Архитектурный дизайн",
    desc: "Разработка концептуальных архитектурных решений, частных вилл, общественных пространств и малых форм.",
    steps: [
      "Анализ контекста участка и разработка объемно-пространственной схемы.",
      "Фасадные решения, планировки и подбор ключевых материалов.",
      "Фотореалистичная 3D-визуализация объекта в ландшафте."
    ]
  },
  {
    id: "06",
    title: "Концепт-дизайн",
    desc: "Создание футуристических и смелых концептов для кино, игр, презентаций и долгосрочных R&D-исследований.",
    steps: [
      "Погружение в сеттинг, сбор референсов и генерация идей.",
      "Создание выразительных концепт-артов и быстрых 3D-болванок.",
      "Финальный рендеринг и презентация концепта."
    ]
  },
  {
    id: "07",
    title: "Продукт-дизайн",
    desc: "Комплексное проектирование цифровых (UI/UX) продуктов: мобильных приложений, веб-сервисов и интерфейсов сложных систем.",
    steps: [
      "Проектирование пользовательских сценариев (UX) и создание интерактивной структуры.",
      "Отрисовка визуального интерфейса (UI) и анимация переходов.",
      "Тестирование кликабельного прототипа и передача разработчикам."
    ]
  },
  {
    id: "08",
    title: "Моушн-дизайн",
    desc: "Создание динамической графики, промо-роликов продуктов, презентационных видео и анимации интерфейсов.",
    steps: [
      "Написание сценария и создание раскадровки (Storyboard).",
      "Анимация элементов, симуляция физики и настройка материалов.",
      "Финальный монтаж, цветокоррекция и саунд-дизайн."
    ]
  },
  {
    id: "09",
    title: "Маркетинг",
    desc: "Стратегическое продвижение продуктов и брендов в цифровой среде, вывод новых решений на рынок.",
    steps: [
      "Разработка маркетинговой стратегии и определение каналов коммуникации.",
      "Создание рекламных креативов и запуск кампаний.",
      "Аналитика эффективности и оптимизация показателей (ROI, CPA)."
    ]
  },
  {
    id: "10",
    title: "Музыка и композиторство",
    desc: "Создание уникального аудиооформления, саундтреков, аудиологотипов и звуковых эффектов для видео и инсталляций.",
    steps: [
      "Обсуждение настроения, темпа и эмоционального посыла проекта.",
      "Написание музыкальной темы, аранжировка и запись инструментов.",
      "Сведение, мастеринг и интеграция звуковых дорожек."
    ]
  }
];

export function Services() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1440px] mx-auto px-6 py-20"
    >
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.08] text-[#0000FF] mb-20">
        Услуги
      </h1>

      <div className="flex flex-col border-t border-[#E5E5E7]">
        {services.map((service) => {
          const isExpanded = expandedId === service.id;

          return (
            <div 
              key={service.id}
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
                        <h4 className="text-sm text-[#0000FF] uppercase tracking-wider font-semibold mb-6">Этапы работы</h4>
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
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
