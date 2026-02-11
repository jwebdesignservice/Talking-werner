"use client";

import ContentPanel from "./ContentPanel";
import WernerPortrait from "./WernerPortrait";
import TransactionFeed from "./TransactionFeed";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center py-6 md:py-10 z-10 min-h-[calc(100vh-120px)]">
      {/* Hero content */}
      <div className="w-[92%] max-w-[1600px] mx-auto h-full">
        {/* Main grid - 3 column layout on large screens */}
        <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_auto_280px] gap-6 md:gap-8 lg:gap-10 items-stretch h-full">
          
          {/* Left: Content Panel */}
          <div className="order-2 md:order-1 h-full">
            <ContentPanel />
          </div>

          {/* Center: Werner Portrait */}
          <div className="order-1 md:order-2 h-full">
            <WernerPortrait />
          </div>

          {/* Right: Transaction Feed (hidden on mobile, visible on lg+) */}
          <div className="order-3 hidden lg:block h-full">
            <TransactionFeed />
          </div>

        </div>

        {/* Mobile Transaction Feed (shown below on smaller screens) */}
        <div className="mt-6 lg:hidden">
          <TransactionFeed />
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
