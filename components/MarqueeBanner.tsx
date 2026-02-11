export default function MarqueeBanner() {
  const items = [
    "TRACE THE JOURNEY",
    "NO LOOKING BACK", 
    "$WERNER",
    "🐧 $WERNER",
    "THE PENGUIN WALKS",
    "INTO THE VOID",
    "🐧 $WERNER",
    "EMBRACE THE JOURNEY",
  ];

  const content = items.join(" • ");

  return (
    <div className="marquee-matrix py-2 border-b border-[var(--matrix-green-muted)]">
      <div className="marquee-content">
        <span className="text-xs">{content} • {content} • </span>
      </div>
    </div>
  );
}
