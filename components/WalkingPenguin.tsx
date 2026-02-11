"use client";

import { useEffect, useState } from "react";

export default function WalkingPenguin() {
  const [position, setPosition] = useState(5);

  useEffect(() => {
    // Slowly move penguin toward mountains on scroll
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const newPosition = 5 + scrollPercent * 25; // Move from 5% to 30%
      setPosition(Math.min(newPosition, 30));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className="fixed bottom-16 z-40 penguin-walking transition-all duration-1000 ease-out"
      style={{ left: `${position}%` }}
    >
      {/* Penguin SVG - Simple, iconic silhouette */}
      <svg viewBox="0 0 60 80" className="w-10 h-14 md:w-12 md:h-16">
        <defs>
          <linearGradient id="penguinBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <linearGradient id="penguinBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0f0f0" />
            <stop offset="100%" stopColor="#d0d0d0" />
          </linearGradient>
        </defs>
        
        {/* Body */}
        <ellipse cx="30" cy="48" rx="18" ry="28" fill="url(#penguinBody)" />
        
        {/* Belly */}
        <ellipse cx="30" cy="52" rx="11" ry="20" fill="url(#penguinBelly)" />
        
        {/* Head */}
        <ellipse cx="30" cy="18" rx="14" ry="16" fill="url(#penguinBody)" />
        
        {/* White face patch */}
        <ellipse cx="30" cy="20" rx="8" ry="10" fill="#f0f0f0" />
        
        {/* Eyes */}
        <circle cx="25" cy="16" r="2.5" fill="#1a1a1a" />
        <circle cx="35" cy="16" r="2.5" fill="#1a1a1a" />
        
        {/* Eye highlights */}
        <circle cx="24" cy="15" r="0.8" fill="#ffffff" />
        <circle cx="34" cy="15" r="0.8" fill="#ffffff" />
        
        {/* Beak */}
        <path d="M26 22 L30 28 L34 22 Z" fill="#d89030" />
        
        {/* Flippers */}
        <ellipse cx="12" cy="45" rx="5" ry="15" fill="#1a1a1a" transform="rotate(-15, 12, 45)" />
        <ellipse cx="48" cy="45" rx="5" ry="15" fill="#1a1a1a" transform="rotate(15, 48, 45)" />
        
        {/* Feet */}
        <ellipse cx="22" cy="76" rx="6" ry="3" fill="#d89030" />
        <ellipse cx="38" cy="76" rx="6" ry="3" fill="#d89030" />
      </svg>

      {/* Footprints trail (fading behind) */}
      <div className="absolute bottom-0 right-full flex gap-8 opacity-30">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="flex gap-1"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <div className="w-2 h-1 bg-[#8a9aa8] rounded-full" />
            <div className="w-2 h-1 bg-[#8a9aa8] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
