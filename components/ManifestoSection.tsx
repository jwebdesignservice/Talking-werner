export default function ManifestoSection() {
  return (
    <section id="about" className="py-20 relative">
      <div className="w-[92%] max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="section-label mx-auto mb-4">// SYSTEM.MANIFESTO</div>
          <h2 className="headline-matrix text-3xl md:text-4xl lg:text-5xl animate-text-flicker">
            THE PROTOCOL
          </h2>
        </div>

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="card-matrix corner-br p-4">
            <div className="relative w-full aspect-[4/3] overflow-hidden border border-[var(--matrix-green-muted)]">
              <img
                src="/Manifesto.jpg"
                alt="The Manifesto"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(100%) brightness(0.8) contrast(1.2) sepia(100%) hue-rotate(70deg) saturate(2)' }}
              />
              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)'
              }} />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-6">
            {/* Pillar Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-matrix p-5 text-center">
                <div className="text-[var(--matrix-green)] text-3xl mb-2 font-['Orbitron']">01</div>
                <div className="text-[var(--matrix-green-dim)] text-xs uppercase tracking-widest font-['Share_Tech_Mono']">Decentralized</div>
              </div>
              <div className="card-matrix p-5 text-center">
                <div className="text-[var(--matrix-green)] text-3xl mb-2 font-['Orbitron']">02</div>
                <div className="text-[var(--matrix-green-dim)] text-xs uppercase tracking-widest font-['Share_Tech_Mono']">Immutable</div>
              </div>
              <div className="card-matrix p-5 text-center">
                <div className="text-[var(--matrix-green)] text-3xl mb-2 font-['Orbitron']">03</div>
                <div className="text-[var(--matrix-green-dim)] text-xs uppercase tracking-widest font-['Share_Tech_Mono']">Community</div>
              </div>
              <div className="card-matrix p-5 text-center">
                <div className="text-[var(--matrix-green)] text-3xl mb-2 font-['Orbitron']">04</div>
                <div className="text-[var(--matrix-green-dim)] text-xs uppercase tracking-widest font-['Share_Tech_Mono']">Eternal</div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="card-matrix corner-br p-6 flex-1">
              <p className="text-[var(--matrix-green)] text-lg md:text-xl leading-relaxed font-['Share_Tech_Mono'] mb-4">
                &gt; &quot;In the depths of the blockchain, we discover not wealth, but the ecstatic truth of collective madness.&quot;
              </p>
              <p className="text-[var(--text-muted)] text-sm font-['Share_Tech_Mono']">
                — WERNER.PROTOCOL v2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
