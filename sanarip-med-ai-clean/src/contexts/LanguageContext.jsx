import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('sanarip_lang');
      return saved ? saved.toUpperCase() : 'RU';
    } catch {
      return 'RU';
    }
  });

  const setLanguage = (lang) => {
    const upper = (lang || 'RU').toUpperCase();
    setLanguageState(upper);
    try {
      localStorage.setItem('sanarip_lang', upper);
    } catch (e) {
      // Ignore localstorage errors
    }
  };

  // Safe nested translation lookup with fallback to RU
  const t = (key, fallback = '') => {
    if (!key) return '';
    const keys = key.split('.');
    const activeLang = language.toUpperCase();
    
    // 1. Try active language
    let current = translations[activeLang];
    let found = true;
    for (const k of keys) {
      if (!current || current[k] === undefined) {
        found = false;
        break;
      }
      current = current[k];
    }
    if (found && current !== undefined) return current;

    // 2. Try RU fallback
    let ruCurrent = translations.RU;
    let ruFound = true;
    for (const k of keys) {
      if (!ruCurrent || ruCurrent[k] === undefined) {
        ruFound = false;
        break;
      }
      ruCurrent = ruCurrent[k];
    }
    if (ruFound && ruCurrent !== undefined) return ruCurrent;

    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
