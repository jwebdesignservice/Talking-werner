"use client";

import ContentPanel from "./ContentPanel";
import WernerPortrait from "./WernerPortrait";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center py-6 md:py-10 z-10 min-h-[calc(100vh-120px)]">
      {/* Hero content */}
      <div className="w-[92%] max-w-[1400px] mx-auto h-full">
        {/* Main grid - equal 50/50 layout */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 xl:gap-24 2xl:gap-[180px] items-stretch h-full">
          
          {/* Left: Content Panel (50%) */}
          <div className="order-2 md:order-1 h-full">
            <ContentPanel />
          </div>

          {/* Right: Werner Portrait (50%) */}
          <div className="order-1 md:order-2 h-full">
            <WernerPortrait />
          </div>

        </div>
      </div>

      {/* Penguin silhouette */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-60">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="55" rx="18" ry="22" fill="var(--matrix-green-muted)"/>
          <circle cx="30" cy="25" r="15" fill="var(--matrix-green-muted)"/>
          <ellipse cx="24" cy="23" rx="3" ry="4" fill="var(--matrix-black)"/>
          <ellipse cx="36" cy="23" rx="3" ry="4" fill="var(--matrix-black)"/>
          <ellipse cx="30" cy="30" rx="4" ry="3" fill="var(--matrix-green-dark)"/>
          <ellipse cx="20" cy="70" rx="5" ry="3" fill="var(--matrix-green-muted)"/>
          <ellipse cx="40" cy="70" rx="5" ry="3" fill="var(--matrix-green-muted)"/>
        </svg>
      </div>
    </section>
  );
}
