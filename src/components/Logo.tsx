import React from 'react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export function Logo({ className = "w-8 h-8", iconClassName = "w-[65%] h-[65%]" }: LogoProps) {
  const bgClass = className.includes('bg-') ? '' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white';
  return (
    <div className={`relative flex items-center justify-center rounded-xl shadow-md overflow-hidden ${bgClass} ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={iconClassName}
      >
        {/* The Arch */}
        <path d="M3 18v-4a9 9 0 0 1 18 0v4" />
        {/* The Deck */}
        <path d="M3 18h18" />
        {/* Central Pillar */}
        <path d="M12 18v-13" />
        {/* Left Pillar */}
        <path d="M7 18v-11.5" />
        {/* Right Pillar */}
        <path d="M17 18v-11.5" />
      </svg>
    </div>
  );
}
