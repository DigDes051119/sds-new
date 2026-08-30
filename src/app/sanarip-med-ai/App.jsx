import React, { useEffect } from 'react';
import Lenis from 'lenis';
import './sanarip.css';
import { CureLinkHero } from './components/landing/CureLinkHero';
import { ProblemSection } from './components/landing/ProblemSection';
import { HeroAIChat } from './components/landing/HeroAIChat';
import { AIVisionModule } from './components/landing/AIVisionModule';
import { RAGSecurity } from './components/landing/RAGSecurity';
import { AISIntegration } from './components/landing/AISIntegration';
import { StoriesAndDoctorShowcase } from './components/landing/StoriesAndDoctorShowcase';
import { MedicalPartnership } from './components/landing/MedicalPartnership';
import { FooterCTA } from './components/landing/FooterCTA';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { useAdminAuth } from './hooks/useAdminAuth';
import { trackVisit } from './utils/analyticsTracker';

export function App() {
  const {
    isAdminOpen,
    isAuthModalOpen,
    closeAdmin,
    closeAuthModal,
    onAuthenticated
  } = useAdminAuth();

  // Track visit on initial load
  useEffect(() => {
    trackVisit(window.location.pathname);
  }, []);

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    if (isAdminOpen) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false
    });

    // Expose lenis instance globally for modal scroll locks
    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Smooth scroll handler for anchor links
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#admin' || href === '#analytics') return;

      e.preventDefault();

      if (href === '#' || href === '#top' || href === '#hero') {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          lenis.scrollTo(targetElement, { offset: -30, duration: 1.2 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [isAdminOpen]);

  return (
    <div id="top" className="bg-[#F3F5F9] text-slate-900 selection:bg-[#1C64F2]/20 selection:text-[#1C64F2] min-h-screen font-sans">
      {isAdminOpen ? (
        /* Full-Screen Admin & Analytics Panel */
        <AdminDashboard onClose={closeAdmin} />
      ) : (
        <>
          <main>
            {/* Block 1: Hero Banner & Navigation */}
            <CureLinkHero />

            {/* Block 2: Problems of 103 Emergency Medicine */}
            <ProblemSection />

            {/* Block 3: Interactive Triage AI Chat */}
            <HeroAIChat />

            {/* Block 4: AI Vision Damage Assessment */}
            <AIVisionModule />

            {/* Block 5: RAG & Clinical Security Database */}
            <RAGSecurity />

            {/* Block 6: Synergy & Integration with AIS "103" */}
            <AISIntegration />

            {/* Block 7: Messenger Access & Pilot Launch */}
            <StoriesAndDoctorShowcase />

            {/* Block 8: B2B Partnership Ecosystem */}
            <MedicalPartnership />
          </main>

          {/* Block 9: Footer & Contacts */}
          <FooterCTA />
        </>
      )}

      {/* Admin PIN Gatekeeper Modal */}
      <AdminAuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onAuthenticated={onAuthenticated}
      />
    </div>
  );
}

export default App;
