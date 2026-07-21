import { NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import type { Language } from "../i18n";

interface BottomMenuWithDuckProps {
  locale: Language;
  setLocale: (lang: Language) => void;
  navLinks: { name: string; path: string }[];
  isScrolled: boolean;
  locationPathname: string;
  onContactClick: () => void;
}

const SIDEBAR_WIDTH = 200;

const LOGO_PATH = "M261.108 97.6614C244.926 89.2858 229.394 87.5781 226.467 87.2528L225.084 87.0901H150.842H53.9127C51.3919 86.6835 37.1615 87.9847 37.1615 75.0554C37.1615 63.7523 51.3919 63.427 53.9127 63.0204H125.878C125.878 63.0204 129.131 63.1018 132.221 66.1105C135.311 69.1192 135.88 75.0554 135.88 75.0554H157.348C159.543 75.0554 161.657 74.1607 163.202 72.6157C164.747 71.0707 165.642 68.9564 165.642 66.7609V8.457C165.642 6.26145 164.747 4.14721 163.202 2.60219L163.04 2.4394C161.495 0.894384 159.381 0 157.185 0H76.1123L74.7298 0.162544C71.8024 0.406494 56.2711 2.19545 40.089 10.5711C14.6369 23.7444 0 47.245 0 74.974C0 102.703 14.6369 126.204 40.089 139.377C56.2711 147.752 71.8024 149.46 74.7298 149.785L76.1123 149.948H150.842H248.748C251.268 150.354 265.499 149.054 265.499 161.983C265.499 173.286 251.268 173.611 248.748 174.018H175.563C175.563 174.018 172.31 174.018 169.22 170.927C166.78 168.569 165.642 161.983 165.642 161.983H144.337C142.141 161.983 140.027 162.877 138.482 164.422H138.401C136.856 166.049 135.961 168.163 135.961 170.358V228.5C135.961 230.695 136.856 232.81 138.401 234.355L138.563 234.517C140.108 236.062 142.223 236.957 144.418 236.957H165.723C199.551 236.957 191.338 236.957 225.166 236.957L226.548 236.794C229.475 236.55 245.007 234.761 261.189 226.385C286.641 213.212 301.278 189.712 301.278 161.983C301.278 134.254 286.641 110.753 261.189 97.58L261.108 97.6614Z";

export function BottomMenuWithDuck({
  locale,
  setLocale,
  navLinks,
  isScrolled,
  locationPathname,
  onContactClick,
}: BottomMenuWithDuckProps) {
  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.aside
          initial={{ x: -(SIDEBAR_WIDTH + 20), opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -(SIDEBAR_WIDTH + 20), opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white/95 backdrop-blur-md border-r border-[#808080]/30"
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* Logo Symbol at top */}
          <div className="pt-[40px] pb-8 px-8 flex items-center justify-start">
            <svg
              width="64"
              height="52"
              viewBox="0 0 302 237"
              fill="none"
              aria-label="Steel Drake Studio logo"
            >
              <path d={LOGO_PATH} fill="#0000FF" />
            </svg>
          </div>

          {/* Divider */}
          <div className="mx-8 border-t border-[#808080]/20" />

          {/* Navigation Links — matching header style */}
          <nav className="flex flex-col gap-2 px-8 pt-8 pb-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-[17px] font-bold tracking-[-0.15px] uppercase transition-colors duration-300 hover:text-[#0000FF] relative pb-[6px] ${
                    isActive ? "text-[#0000FF]" : "text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeUnderlineSidebar"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0000FF]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Contact Button + Language Switcher */}
          <div className="px-8 pb-8 flex flex-col gap-6">
            {locationPathname === "/services" && (
              <button
                onClick={onContactClick}
                className="self-start border border-black hover:border-[#0000FF] hover:bg-[#0000FF] hover:text-white transition-all duration-300 px-5 py-2 uppercase font-mono text-[13px] tracking-[0.06em] text-black cursor-pointer"
              >
                {locale === "ru"
                  ? "связаться"
                  : locale === "kg"
                    ? "байланышуу"
                    : "contact"}
              </button>
            )}

            {/* Language Switcher — matching header style */}
            <div className="flex gap-3 items-center">
              {(["en", "ru", "kg"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`text-[17px] font-normal tracking-[-0.15px] uppercase cursor-pointer transition-opacity relative pb-[6px] ${
                    locale === lang
                      ? "text-black"
                      : "text-[#808080] hover:text-black"
                  }`}
                >
                  {lang}
                  {locale === lang && (
                    <motion.div
                      layoutId="activeLanguageSidebar"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export { SIDEBAR_WIDTH };
