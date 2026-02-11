export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--matrix-green-muted)]">
      {/* CTA Section */}
      <div className="py-16 text-center">
        <div className="w-[92%] max-w-[1400px] mx-auto">
          <div className="section-label mx-auto mb-4">// SYSTEM.JOIN</div>
          <h2 className="headline-matrix text-3xl md:text-4xl lg:text-5xl mb-6 animate-text-flicker">
            JOIN THE MATRIX
          </h2>
          <p className="text-[var(--text-secondary)] font-['Share_Tech_Mono'] text-sm mb-8 max-w-xl mx-auto">
            &gt; The penguin walks toward the mountains. Will you follow?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-matrix-filled">
              Enter the Void
            </button>
            <button className="btn-matrix">
              Read the Docs
            </button>
          </div>
        </div>
      </div>

      {/* Quote Bar */}
      <div className="py-8 bg-[rgba(0,40,0,0.5)] border-t border-b border-[var(--matrix-green-muted)]">
        <div className="w-[92%] max-w-[1400px] mx-auto text-center">
          <p className="text-[var(--matrix-green)] font-['Share_Tech_Mono'] text-sm md:text-base italic">
            &quot;In the face of the overwhelming indifference of the universe, we choose to build.&quot;
          </p>
          <p className="text-[var(--text-muted)] font-['Share_Tech_Mono'] text-xs mt-2">
            — WERNER.PROTOCOL
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6">
        <div className="w-[92%] max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="headline-matrix text-lg">$WERNER</div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--matrix-green)] transition-colors text-xs font-['Share_Tech_Mono']">
                Twitter
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--matrix-green)] transition-colors text-xs font-['Share_Tech_Mono']">
                Telegram
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--matrix-green)] transition-colors text-xs font-['Share_Tech_Mono']">
                Discord
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--matrix-green)] transition-colors text-xs font-['Share_Tech_Mono']">
                Chart
              </a>
            </div>

            {/* Copyright */}
            <div className="text-[var(--text-muted)] text-xs font-['Share_Tech_Mono']">
              © 2026 $WERNER // ALL_RIGHTS_RESERVED
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
