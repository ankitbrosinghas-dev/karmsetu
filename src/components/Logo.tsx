import React from 'react';

interface LogoProps {
  className?: string;
  imgClassName?: string;
  showText?: boolean;
}

export function Logo({ className = "w-8 h-8", imgClassName = "w-full h-full object-contain", showText = false }: LogoProps) {
  return (
    <div className={`relative inline-flex items-center gap-2.5 ${className}`}>
      <img 
        src="/logo.png" 
        alt="KarmSetu Logo" 
        className={imgClassName} 
      />
      {showText && (
        <span className="font-semibold tracking-tight text-white">
          Karm<span className="text-indigo-500">Setu</span>
        </span>
      )}
    </div>
  );
}

