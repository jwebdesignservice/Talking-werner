export default function TokenomicsSection() {
  const stats = [
    { value: "1B", label: "Total Supply", icon: "◉" },
    { value: "0%", label: "Buy Tax", icon: "◈" },
    { value: "0%", label: "Sell Tax", icon: "◇" },
    { value: "100%", label: "LP Burned", icon: "◆" },
  ];

  return (
    <section id="tokenomics" className="py-20 relative">
      <div className="w-[92%] max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="section-label mx-auto mb-4">// SYSTEM.ECONOMICS</div>
          <h2 className="headline-matrix text-3xl md:text-4xl lg:text-5xl animate-text-flicker">
            TOKENOMICS
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card-matrix corner-br p-6 text-center animate-pulse-glow">
              <div className="text-[var(--matrix-green)] text-2xl mb-2">{stat.icon}</div>
              <div className="headline-matrix text-3xl md:text-4xl mb-2">{stat.value}</div>
              <div className="text-[var(--text-muted)] text-xs uppercase tracking-widest font-['Share_Tech_Mono']">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Distribution */}
        <div className="card-matrix corner-br p-8">
          <h3 className="headline-matrix text-xl mb-6 text-center">DISTRIBUTION_MATRIX</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-[var(--matrix-green)] font-['Share_Tech_Mono'] text-sm w-32">LIQUIDITY</div>
              <div className="flex-1 h-6 bg-[var(--matrix-green-muted)] border border-[var(--matrix-green)]">
                <div className="h-full bg-[var(--matrix-green)] animate-pulse" style={{ width: '85%' }} />
              </div>
              <div className="text-[var(--matrix-green)] font-['Orbitron'] text-sm w-16 text-right">85%</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-[var(--matrix-green)] font-['Share_Tech_Mono'] text-sm w-32">MARKETING</div>
              <div className="flex-1 h-6 bg-[var(--matrix-green-muted)] border border-[var(--matrix-green)]">
                <div className="h-full bg-[var(--matrix-green)] animate-pulse" style={{ width: '10%' }} />
              </div>
              <div className="text-[var(--matrix-green)] font-['Orbitron'] text-sm w-16 text-right">10%</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-[var(--matrix-green)] font-['Share_Tech_Mono'] text-sm w-32">TEAM</div>
              <div className="flex-1 h-6 bg-[var(--matrix-green-muted)] border border-[var(--matrix-green)]">
                <div className="h-full bg-[var(--matrix-green)] animate-pulse" style={{ width: '5%' }} />
              </div>
              <div className="text-[var(--matrix-green)] font-['Orbitron'] text-sm w-16 text-right">5%</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[var(--text-muted)] text-sm font-['Share_Tech_Mono']">
              &gt; Contract renounced. LP burned. No backdoors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
