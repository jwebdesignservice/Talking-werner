"use client";

export default function MountainLandscape() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Penguin bg.jpg')" }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,42,58,0.7)] via-[rgba(26,42,58,0.5)] to-[rgba(26,42,58,0.8)]" />
      
      {/* Aurora shimmer effect */}
      <div className="aurora-layer" />

      {/* Fog layer at bottom */}
      <div className="fog-layer" />
    </div>
  );
}
