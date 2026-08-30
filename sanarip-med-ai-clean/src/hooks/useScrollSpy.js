import { useState, useEffect } from 'react';
import { SECTION_ORDER } from '../constants/navigation';

/**
 * Custom Hook for tracking the active section during scrolling.
 */
export function useScrollSpy(sections = SECTION_ORDER, offset = 250) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Bottom of page -> activate last section ('partnership')
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection(sections[0] || 'partnership');
        return;
      }

      // Top of page -> activate 'home'
      if (window.scrollY < offset) {
        setActiveSection('home');
        return;
      }

      // Check sections from bottom up or in declared priority
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            setActiveSection(id);
            return;
          }
        }
      }

      setActiveSection('home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, offset]);

  return activeSection;
}
