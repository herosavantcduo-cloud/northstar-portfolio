const dims = [
  { value: "oracle_status", label: "Oracle Status" },
  { value: "category", label: "Category" },
  { value: "tags", label: "Tags" },
  { value: "featured", label: "Featured" },
];

const metrics = [
  { value: "count", label: "Count" },
  { value: "avg_score", label: "Avg Score" },
  { value: "max_score", label: "Max Score" },
  { value: "total_score", label: "Total Score" },
];

const Selector = ({ label, value, onChange, options, color }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-mono uppercase tracking-widest" style={{ color: `${color}99` }}>
      {label}
    </span>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200"
          style={{
            border: `1px solid ${value === o.value ? color : color + "33"}`,
            color: value === o.value ? color : "rgba(255,255,255,0.3)",
            background: value === o.value ? `${color}18` : "transparent",
            boxShadow: value === o.value ? `0 0 12px ${color}44` : "none",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

export default function PivotControls({ rowDim, setRowDim, colDim, setColDim, metric, setMetric }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col md:flex-row gap-6"
      style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
    >
      <Selector label="Row Dimension" value={rowDim} onChange={setRowDim} options={dims} color="#bf00ff" />
      <Selector label="Column Dimension" value={colDim} onChange={setColDim} options={dims} color="#00ccff" />
      <Selector label="Metric" value={metric} onChange={setMetric} options={metrics} color="#00ffcc" />
    </div>
  );
}