import React, { useEffect } from 'react';
import App from '../sanarip-med-ai/App';
import { LanguageProvider } from '../sanarip-med-ai/contexts/LanguageContext';

export function SanaripMedAi() {
  useEffect(() => {
    document.body.classList.add('sanarip-page');
    document.documentElement.classList.add('sanarip-page');
    return () => {
      document.body.classList.remove('sanarip-page');
      document.documentElement.classList.remove('sanarip-page');
    };
  }, []);

  return (
    <div className="sanarip-root w-full min-h-screen bg-[#F3F5F9] font-sans antialiased text-slate-900">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </div>
  );
}

export default SanaripMedAi;
