"use client";

import ContentPanel from "./ContentPanel";
import WernerPortrait from "./WernerPortrait";
import TransactionFeed from "./TransactionFeed";
import { WernerProvider } from "@/contexts/WernerContext";

export default function Hero() {
  return (
    <WernerProvider>
      <section className="relative flex items-center justify-center py-6 md:py-10 z-10 min-h-[calc(100vh-120px)]">
        {/* Hero content */}
        <div className="w-[92%] max-w-[1600px] mx-auto h-full">
          {/* Main grid - 3 column layout only on xl screens (1280px+) */}
          <div className="grid md:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_300px] gap-6 md:gap-8 xl:gap-10 items-stretch h-full">

            {/* Left: Content Panel - order-3 on mobile (below tx feed), order-1 on md+ */}
            <div className="order-3 md:order-1 h-full">
              <ContentPanel />
            </div>

            {/* Center: Werner Portrait - same width as left card */}
            <div className="order-1 md:order-2 h-full">
              <WernerPortrait />
            </div>

            {/* Right: Transaction Feed - only visible in 3-col layout on xl+ */}
            <div className="hidden xl:block xl:order-3 h-full">
              <TransactionFeed />
            </div>

          </div>

          {/* Mobile & Tablet Transaction Feed (below the grid on screens < xl) */}
          <div className="mt-6 xl:hidden">
            <TransactionFeed />
          </div>
        </div>

      </section>
    </WernerProvider>
  );
}
