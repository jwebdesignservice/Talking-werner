"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[rgba(0,10,0,0.9)] backdrop-blur-md border-b border-[var(--matrix-green-muted)]">
      <div className="w-[92%] max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="headline-matrix text-xl tracking-wider animate-text-flicker">
            $WERNER
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#top" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="font-['Share_Tech_Mono'] text-sm uppercase tracking-widest text-[var(--matrix-green)] hover:text-[var(--matrix-green-bright)] transition-colors text-glow cursor-pointer"
            >
              Home
            </a>
            <Link 
              href="#about" 
              className="font-['Share_Tech_Mono'] text-sm uppercase tracking-widest text-[var(--matrix-green)] hover:text-[var(--matrix-green-bright)] transition-colors text-glow"
            >
              About
            </Link>
            <Link 
              href="#tokenomics" 
              className="font-['Share_Tech_Mono'] text-sm uppercase tracking-widest text-[var(--matrix-green)] hover:text-[var(--matrix-green-bright)] transition-colors text-glow"
            >
              Tokenomics
            </Link>
            <Link 
              href="#safety" 
              className="font-['Share_Tech_Mono'] text-sm uppercase tracking-widest text-[var(--matrix-green)] hover:text-[var(--matrix-green-bright)] transition-colors text-glow"
            >
              Safety
            </Link>
          </nav>

          {/* CTA Button */}
          <a href="#tokenomics" className="btn-matrix text-xs px-4 py-2">
            Buy $Werner
          </a>
        </div>
      </div>
    </header>
  );
}
