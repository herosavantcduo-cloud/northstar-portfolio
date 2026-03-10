const COLORS = ["#00ffcc", "#bf00ff", "#00ccff", "#ff00ff", "#ffff00", "#ff6644", "#44ffaa", "#aa44ff"];

export default function ResearchTagCloud({ works }) {
  const tagCounts = works.flatMap((w) => w.tags || []).reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  if (sorted.length === 0) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ border: "1px solid rgba(255,0,255,0.15)", background: "rgba(255,0,255,0.04)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#ff00ff99" }}>
          Tag Distribution
        </p>
        <div className="h-24 flex items-center justify-center text-white/20 text-xs font-mono">
          No tags found
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ border: "1px solid rgba(255,0,255,0.15)", background: "rgba(255,0,255,0.04)" }}
    >
      <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: "#ff00ff99" }}>
        Tag Distribution · {sorted.length} unique tags
      </p>
      <div className="flex flex-wrap gap-3 items-end">
        {sorted.map(([tag, count], i) => {
          const weight = count / max;
          const size = 10 + weight * 14;
          const opacity = 0.4 + weight * 0.6;
          const color = COLORS[i % COLORS.length];
          return (
            <div
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono transition-all duration-300 cursor-default"
              style={{
                fontSize: size,
                border: `1px solid ${color}${Math.round(opacity * 99).toString(16).padStart(2, "0")}`,
                color,
                background: `${color}${Math.round(opacity * 22).toString(16).padStart(2, "0")}`,
                opacity,
              }}
            >
              <span>#{tag}</span>
              <span
                className="text-xs rounded-full px-1.5 py-0.5"
                style={{ background: `${color}33`, fontSize: 9 }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}