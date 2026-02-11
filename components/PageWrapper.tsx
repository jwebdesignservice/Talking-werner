"use client";

import { useState } from "react";
import Preloader from "./Preloader";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {/* Preloader */}
      {isLoading && <Preloader onLoadComplete={handleLoadComplete} />}
      
      {/* Main content with fade-in */}
      <div
        className={`transition-opacity duration-500 ${showContent ? "opacity-100" : "opacity-0"}`}
        style={{ visibility: showContent ? "visible" : "hidden" }}
      >
        {children}
      </div>
    </>
  );
}
