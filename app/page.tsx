import Hero from "@/components/Hero";
import ManifestoSection from "@/components/ManifestoSection";
import TokenomicsSection from "@/components/TokenomicsSection";
import SafetySection from "@/components/SafetySection";
import Footer from "@/components/Footer";
import MarqueeBanner from "@/components/MarqueeBanner";
import Header from "@/components/Header";
import MatrixRain from "@/components/MatrixRain";
import PageWrapper from "@/components/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <main className="relative min-h-screen overflow-hidden bg-[var(--matrix-black)]">
        {/* Penguin background image */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: "url('/Penguin bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        
        {/* Dark overlay on top of background */}
        <div className="fixed inset-0 z-[1] bg-[rgba(0,10,0,0.85)]" />
        
        {/* Matrix digital rain background */}
        <div className="relative z-[2]">
          <MatrixRain />
        </div>
        
        {/* Scanlines overlay */}
        <div className="scanlines z-[3]" />

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
    </PageWrapper>
  );
}
