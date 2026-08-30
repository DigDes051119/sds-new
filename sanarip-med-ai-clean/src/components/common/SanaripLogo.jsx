import React from 'react';
import officialLogo from '../../../logo.png';

export const SanaripLogo = ({ className = 'h-10', dark = false }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={officialLogo}
        alt="Sanarip Med AI Logo"
        className="h-full w-auto object-contain shrink-0"
      />
    </div>
  );
};

export default SanaripLogo;
