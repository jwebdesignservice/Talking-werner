export default function SafetySection() {
  const safetyItems = [
    { icon: "✓", label: "Contract Verified", status: "ACTIVE" },
    { icon: "✓", label: "Ownership Renounced", status: "ACTIVE" },
    { icon: "✓", label: "LP Tokens Burned", status: "ACTIVE" },
    { icon: "✓", label: "No Mint Function", status: "ACTIVE" },
  ];

  return (
    <section id="safety" className="py-20 relative">
      <div className="w-[92%] max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="section-label mx-auto mb-4">// SYSTEM.SECURITY</div>
          <h2 className="headline-matrix text-3xl md:text-4xl lg:text-5xl animate-text-flicker">
            SAFETY PROTOCOL
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Shield Icon & Message */}
          <div className="card-matrix corner-br p-8 flex flex-col items-center justify-center text-center h-full">
            <div className="text-[var(--matrix-green)] text-8xl mb-6 animate-pulse-glow">🛡</div>
            <h3 className="headline-matrix text-2xl mb-4">FULLY SECURED</h3>
            <p className="text-[var(--text-secondary)] font-['Share_Tech_Mono'] text-sm leading-relaxed max-w-md">
              &gt; The contract stands immutable. No developer keys. No backdoors. 
              Only the cold, unfeeling permanence of code.
            </p>
          </div>

          {/* Right: Checklist */}
          <div className="card-matrix corner-br p-8 h-full">
            <h3 className="headline-matrix text-xl mb-6">SECURITY_CHECK</h3>
            
            <div className="space-y-4">
              {safetyItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border border-[var(--matrix-green-muted)] bg-[rgba(0,40,0,0.3)] hover:border-[var(--matrix-green)] hover:shadow-[0_0_10px_rgba(0,255,0,0.2)] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--matrix-green)] text-xl">{item.icon}</span>
                    <span className="text-[var(--matrix-green)] font-['Share_Tech_Mono'] text-sm">{item.label}</span>
                  </div>
                  <span className="text-[var(--matrix-green-bright)] font-['Orbitron'] text-xs animate-pulse">
                    [{item.status}]
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--matrix-green-muted)]">
              <div className="flex items-center justify-between text-xs font-['Share_Tech_Mono']">
                <span className="text-[var(--text-muted)]">LAST_AUDIT:</span>
                <span className="text-[var(--matrix-green)]">2026.02.11</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
