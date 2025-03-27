import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export function Logo({ variant = 'light', layout = 'horizontal', className = '' }: LogoProps) {
  // Updated logo URL to the specified image
  const logoUrl = "https://i.imgur.com/w5oKCqX.png";
  
  // Increased image size for both layouts
  const imageSize = layout === 'horizontal' ? 180 : 220;

  return layout === 'horizontal' ? (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoUrl} 
        alt="Tool2U Logo" 
        width={imageSize} 
        height={imageSize / 2}
        className="object-contain"
      />
    </div>
  ) : (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <img 
        src={logoUrl} 
        alt="Tool2U Logo" 
        width={imageSize} 
        height={imageSize / 2}
        className="object-contain"
      />
    </div>
  );
}
