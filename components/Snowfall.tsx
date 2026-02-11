"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  size: "large" | "medium" | "small";
  duration: number;
  delay: number;
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    
    // Large snowflakes (close, slow) - 15 flakes
    for (let i = 0; i < 15; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        size: "large",
        duration: 15 + Math.random() * 10,
        delay: Math.random() * 15,
      });
    }
    
    // Medium snowflakes - 25 flakes
    for (let i = 15; i < 40; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        size: "medium",
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 12,
      });
    }
    
    // Small snowflakes (distant, fast) - 40 flakes
    for (let i = 40; i < 80; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        size: "small",
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 10,
      });
    }

    setSnowflakes(flakes);
  }, []);

  const getSizeClass = (size: "large" | "medium" | "small") => {
    switch (size) {
      case "large": return "snowflake-large";
      case "medium": return "snowflake-medium";
      case "small": return "snowflake-small";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={`snowflake ${getSizeClass(flake.size)}`}
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
