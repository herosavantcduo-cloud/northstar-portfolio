const Stat = ({ label, value, color, sub }) => (
  <div
    className="rounded-xl p-5 flex flex-col gap-1"
    style={{ border: `1px solid ${color}33`, background: `${color}08` }}
  >
    <span className="text-xs font-mono uppercase tracking-widest" style={{ color: `${color}99` }}>
      {label}
    </span>
    <span className="text-3xl font-bold" style={{ color }}>
      {value}
    </span>
    {sub && <span className="text-xs text-white/30 font-mono">{sub}</span>}
  </div>
);

export default function ResearchStatCards({ works }) {
  const avg = works.length
    ? Math.round(works.reduce((s, w) => s + (w.value_score || 0), 0) / works.length)
    : 0;
  const complete = works.filter((w) => w.oracle_status === "complete").length;
  const allTags = works.flatMap((w) => w.tags || []);
  const uniqueTags = new Set(allTags).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label="Total Papers" value={works.length} color="#00ffcc" sub="research category" />
      <Stat label="Avg Score" value={avg || "—"} color="#bf00ff" sub="value_score mean" />
      <Stat label="Oracle Complete" value={complete} color="#00ccff" sub={`of ${works.length} entries`} />
      <Stat label="Unique Tags" value={uniqueTags} color="#ff00ff" sub="across corpus" />
    </div>
  );
}