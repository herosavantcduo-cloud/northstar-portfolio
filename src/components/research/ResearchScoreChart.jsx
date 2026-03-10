import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const COLORS = ["#00ffcc", "#bf00ff", "#00ccff", "#ff00ff", "#ffff00", "#ff6644"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs font-mono"
      style={{ background: "#0a0020", border: "1px solid #00ffcc44", color: "#00ffcc" }}
    >
      <div>{payload[0]?.payload?.title}</div>
      <div style={{ color: "#fff" }}>Score: {payload[0]?.value}</div>
    </div>
  );
};

export default function ResearchScoreChart({ works }) {
  const data = [...works]
    .filter((w) => w.value_score)
    .sort((a, b) => b.value_score - a.value_score)
    .slice(0, 10)
    .map((w) => ({ title: w.title.length > 18 ? w.title.slice(0, 18) + "…" : w.title, score: w.value_score, full: w.title }));

  return (
    <div
      className="rounded-xl p-5"
      style={{ border: "1px solid rgba(0,255,204,0.15)", background: "rgba(0,255,204,0.04)" }}
    >
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#00ffcc99" }}>
        Value Score Distribution
      </p>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-white/20 text-xs font-mono">
          No scored entries yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 40 }}>
            <XAxis
              dataKey="title"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "monospace" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,255,204,0.05)" }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}