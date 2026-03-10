import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const STATUS_COLORS = {
  complete: "#00ffcc",
  generating: "#00ccff",
  pending: "#ffff00",
  error: "#ff4466",
  none: "#ffffff22",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs font-mono"
      style={{ background: "#0a0020", border: "1px solid #bf00ff44", color: "#bf00ff" }}
    >
      {payload[0]?.name}: {payload[0]?.value}
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-3 mt-2">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
        <span className="text-xs font-mono text-white/40 uppercase">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function ResearchOracleStatus({ works }) {
  const counts = works.reduce((acc, w) => {
    const s = w.oracle_status || "none";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <div
      className="rounded-xl p-5"
      style={{ border: "1px solid rgba(191,0,255,0.15)", background: "rgba(191,0,255,0.04)" }}
    >
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#bf00ff99" }}>
        Oracle Pipeline Status
      </p>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-white/20 text-xs font-mono">
          No entries yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={STATUS_COLORS[entry.name] || "#ffffff33"}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}