import React from 'react';
import App from '../sanarip-med-ai/App';
import { LanguageProvider } from '../sanarip-med-ai/contexts/LanguageContext';

export function SanaripMedAi() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}

export default SanaripMedAi;
