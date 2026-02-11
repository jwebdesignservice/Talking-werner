import Hero from "@/components/Hero";
import ManifestoSection from "@/components/ManifestoSection";
import TokenomicsSection from "@/components/TokenomicsSection";
import SafetySection from "@/components/SafetySection";
import Footer from "@/components/Footer";
import MarqueeBanner from "@/components/MarqueeBanner";
import Header from "@/components/Header";
import MatrixRain from "@/components/MatrixRain";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--matrix-black)]">
      {/* Matrix digital rain background */}
      <MatrixRain />
      
      {/* Scanlines overlay */}
      <div className="scanlines" />

      {/* Content sections */}
      <div className="relative z-10">
        {/* Moving banner */}
        <MarqueeBanner />
        
        {/* Header/Nav */}
        <Header />
        
        <Hero />
        <ManifestoSection />
        <TokenomicsSection />
        <SafetySection />
        <Footer />
      </div>
    </main>
  );
}
