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
    },
    {
      path: "/music",
      label: {
        en: "Music",
        ru: "Музыка",
        kg: "Музыка",
        zh: "音乐",
        ar: "موسيقى",
        de: "Musik"
      },
      subtext: {
        en: "Soundtracks & audio design",
        ru: "Саундтреки и звуковой дизайн",
        kg: "Саундтректер жана үн дизайны",
        zh: "原声带与音频设计",
        ar: "الموسيقى التصويرية والتصميم الصوتي",
        de: "Soundtracks & Audiodesign"
      }
    }
  ];

  const elements: React.ReactNode[] = [];
  navItems.forEach((item, idx) => {
    const l = item.label[locale as keyof typeof item.label] || item.label["en"];
    const s = item.subtext[locale as keyof typeof item.subtext] || item.subtext["en"];
    
    const activeClass = (active: boolean) =>
      `flex flex-col text-left gap-1.5 transition-colors duration-300 hover:text-[#0000FF] cursor-pointer group ${
        active ? "text-[#0000FF]" : "text-black"
      }`;

    elements.push(
      <div key={item.path} className="flex items-start shrink-0">
        {onTabChange ? (
          <button
            type="button"
            onClick={() => onTabChange(item.path)}
            className={activeClass(activeTab === item.path)}
          >
            <span className="text-[17px] sm:text-[20px] md:text-[25px] font-medium leading-none tracking-[-0.03em] whitespace-nowrap">
              {l}
            </span>
            <span className="text-[11px] sm:text-[12px] md:text-[13px] font-normal leading-[1.3] text-[#808080] max-w-[120px] sm:max-w-[140px] whitespace-normal line-clamp-2 mt-1.5">
              {s}
            </span>
          </button>
        ) : (
          <NavLink
            to={item.path}
            end={item.path === "/projects"}
            className={({ isActive }) => activeClass(isActive)}
          >
            <span className="text-[17px] sm:text-[20px] md:text-[25px] font-medium leading-none tracking-[-0.03em] whitespace-nowrap">
              {l}
            </span>
            <span className="text-[11px] sm:text-[12px] md:text-[13px] font-normal leading-[1.3] text-[#808080] max-w-[120px] sm:max-w-[140px] whitespace-normal line-clamp-2 mt-1.5">
              {s}
            </span>
          </NavLink>
        )}
      </div>
    );

    if (idx < navItems.length - 1) {
      elements.push(
        <span key={`slash-${idx}`} className="text-black/30 text-[16px] sm:text-[18px] md:text-[25px] font-light select-none pt-0.5 px-2 sm:px-3 md:px-4 self-start shrink-0">
          /
        </span>
      );
    }
  });

  return (
    <div className="w-full mb-8 sm:mb-12 md:mb-16 font-twk-everett">
      {/* ── Mobile View (< md): Flex-wrap All Categories (100% Visible & Accessible) ── */}
      <div className="md:hidden w-full">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3.5 border-b border-[#808080]/20 pb-4 pt-1 w-full">
          {navItems.map((item) => {
            const l = item.label[locale as keyof typeof item.label] || item.label["en"];
            if (onTabChange) {
              const isActive = activeTab === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onTabChange(item.path)}
                  className={`text-[14px] xs:text-[15px] uppercase tracking-[-0.01em] whitespace-nowrap transition-colors relative pb-0.5 cursor-pointer ${
                    isActive
                      ? "text-[#0000FF] font-medium border-b-2 border-[#0000FF]"
                      : "text-[#808080] hover:text-black font-normal"
                  }`}
                >
                  {l}
                </button>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/projects"}
                className={({ isActive }) =>
                  `text-[14px] xs:text-[15px] uppercase tracking-[-0.01em] whitespace-nowrap transition-colors relative pb-0.5 ${
                    isActive
                      ? "text-[#0000FF] font-medium border-b-2 border-[#0000FF]"
                      : "text-[#808080] hover:text-black font-normal"
                  }`
                }
              >
                {l}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* ── Desktop View (>= md): Full Editorial Column Layout with Slashes and Subtexts ── */}
      <div className="hidden md:flex items-start justify-between w-full py-1">
        {elements}
      </div>
    </div>
  );
}
