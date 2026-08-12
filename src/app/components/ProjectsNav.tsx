import { NavLink } from "react-router";
import { useContext } from "react";
import { LanguageContext } from "../i18n";

interface ProjectsNavProps {
  activeTab?: string;
  onTabChange?: (path: string) => void;
}

export function ProjectsNav({ activeTab, onTabChange }: ProjectsNavProps = {}) {
  const { locale } = useContext(LanguageContext);

  const navItems = [
    {
      path: "/projects",
      label: {
        en: "All Projects",
        ru: "Все проекты",
        kg: "Бардык долбоорлор",
        zh: "所有项目",
        ar: "جميع المشاريع",
        de: "Alle Projekte"
      },
      subtext: {
        en: "Worlwide",
        ru: "По всему миру",
        kg: "Дүйнө жүзү боюнча",
        zh: "全球范围",
        ar: "عالمي",
        de: "Weltweit"
      }
    },
    {
      path: "/products",
      label: {
        en: "Products",
        ru: "Продукты",
        kg: "Продукциялар",
        zh: "产品",
        ar: "المنتجات",
        de: "Produkte"
      },
      subtext: {
        en: "For companies and from studio",
        ru: "Для компаний и от студии",
        kg: "Компаниялар үчүн жана студиядан",
        zh: "为公司及来自工作室",
        ar: "للشركات ومن الاستوديو",
        de: "Für Unternehmen und vom Studio"
      }
    },
    {
      path: "/architect-projects",
      label: {
        en: "Architecture",
        ru: "Архитектура",
        kg: "Архитектура",
        zh: "建筑",
        ar: "الهندسة المعمارية",
        de: "Architektur"
      },
      subtext: {
        en: "Complex projects",
        ru: "Сложные проекты",
        kg: "Татаал долбоорлор",
        zh: "复杂项目",
        ar: "مشاريع معقدة",
        de: "Komplexe Projekte"
      }
    },
    {
      path: "/concepts-and-vision",
      label: {
        en: "Concepts",
        ru: "Концепты",
        kg: "Концепттер",
        zh: "概念",
        ar: "المفاهيم",
        de: "Konzepte"
      },
      subtext: {
        en: "Our vision projects",
        ru: "Наше видение проектов",
        kg: "Биздин долбоорлордун көрүнүшү",
        zh: "我们的愿景项目",
        ar: "مشاريع رؤيتنا",
        de: "Unsere Visionsprojekte"
      }
    },
    {
      path: "/gamedev",
      label: {
        en: "Gamedev",
        ru: "Геймдев",
        kg: "Геймдев",
        zh: "游戏开发",
        ar: "تطوير الألعاب",
        de: "Spieleentwicklung"
      },
      subtext: {
        en: "3d environment",
        ru: "3D окружение",
        kg: "3D чөйрөсү",
        zh: "3D 环境",
        ar: "بيئة ثلاثية الأبعاد",
        de: "3D-Umgebung"
      }
    },
    {
      path: "/web-ui-ux",
      label: {
        en: "Web UI UX",
        ru: "Web UI UX",
        kg: "Web UI UX",
        zh: "网页与UI UX",
        ar: "تصميم المواقع وواجهة المستخدم",
        de: "Web UI UX"
      },
      subtext: {
        en: "Websites and interfaces",
        ru: "Сайты и интерфейсы",
        kg: "Сайттар жана интерфейстер",
        zh: "网站和界面",
        ar: "المواقع والواجهات",
        de: "Websites und Schnittstellen"
      }
    },
    {
      path: "/projects/old",
      label: {
        en: "Old projects",
        ru: "Старые проекты",
        kg: "Эски долбоорлор",
        zh: "旧项目",
        ar: "المشاريع القديمة",
        de: "Alte Projekte"
      },
      subtext: {
        en: "2005-2020",
        ru: "2005-2020",
        kg: "2005-2020",
        zh: "2005-2020",
        ar: "2005-2020",
        de: "2005-2020"
      }
    },
    {
      path: "/video",
      label: {
        en: "Video",
        ru: "Видео",
        kg: "Видео",
        zh: "视频",
        ar: "فيديو",
        de: "Video"
      },
      subtext: {
        en: "Our video directing and motion design",
        ru: "Наше видеорежиссура и моушн-дизайн",
        kg: "Биздин видео режиссёрлук жана моушн дизайн",
        zh: "我们的视频导演和动态设计",
        ar: "إخراج الفيديو وتصميم الحركة لدينا",
        de: "Unsere Regie- und Motion-Design-Arbeiten"
      }
    }
  ];

  return (
    <div className="w-full mb-12 md:mb-16 overflow-x-auto no-scrollbar">
      <div className="flex items-start justify-between flex-nowrap min-w-max md:min-w-0 md:w-full">
        {navItems.map((item, idx) => {
          const l = item.label[locale as keyof typeof item.label] || item.label["en"];
          const s = item.subtext[locale as keyof typeof item.subtext] || item.subtext["en"];
          
          const activeClass = (active: boolean) =>
            `flex flex-col text-left gap-2 transition-colors duration-300 hover:text-[#0000FF] cursor-pointer group ${
              active ? "text-[#0000FF]" : "text-black"
            }`;

          return (
            <div key={item.path} className="flex items-start">
              {onTabChange ? (
                <button
                  type="button"
                  onClick={() => onTabChange(item.path)}
                  className={activeClass(activeTab === item.path)}
                >
                  <span className="text-[18px] md:text-[25px] font-medium leading-none tracking-[-0.03em] whitespace-nowrap">
                    {l}
                  </span>
                  <span className="text-[12px] md:text-[13px] font-normal leading-[1.3] text-[#808080] max-w-[130px] md:max-w-[170px] whitespace-normal">
                    {s}
                  </span>
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === "/projects"}
                  className={({ isActive }) => activeClass(isActive)}
                >
                  <span className="text-[18px] md:text-[25px] font-medium leading-none tracking-[-0.03em] whitespace-nowrap">
                    {l}
                  </span>
                  <span className="text-[12px] md:text-[13px] font-normal leading-[1.3] text-[#808080] max-w-[130px] md:max-w-[170px] whitespace-normal">
                    {s}
                  </span>
                </NavLink>
              )}
              
              {idx < navItems.length - 1 && (
                <span className="text-black/40 mx-3 md:mx-4.5 text-[18px] md:text-[25px] font-light select-none pt-0.5">
                  /
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
