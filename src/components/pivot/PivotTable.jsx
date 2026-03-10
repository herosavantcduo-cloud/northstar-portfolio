function getColor(val, metric) {
  if (val === null || val === "—" || typeof val !== "number") return null;
  if (metric === "count") {
    if (val >= 5) return "#00ffcc";
    if (val >= 3) return "#bf00ff";
    if (val >= 1) return "#00ccff";
    return null;
  }
  if (val >= 90) return "#00ffcc";
  if (val >= 75) return "#bf00ff";
  if (val >= 50) return "#00ccff";
  if (val >= 1) return "#ff00ff";
  return null;
}

export default function PivotTable({ pivotData, computeMetric, metric, works, rowDim, colDim }) {
  const { rows, cols, cells } = pivotData;

  const rowTotals = rows.map((r) => {
    const allItems = cols.flatMap((c) => cells[`${r}||${c}`] || []);
    return computeMetric(allItems);
  });

  const colTotals = cols.map((c) => {
    const allItems = rows.flatMap((r) => cells[`${r}||${c}`] || []);
    return computeMetric(allItems);
  });

  const grandTotal = computeMetric(works);

  const Cell = ({ val, highlight }) => {
    const color = getColor(val, metric);
    const isEmpty = val === null || val === 0 || val === "—";
    return (
      <td
        className="px-4 py-3 text-center text-sm font-mono transition-all duration-200"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          color: isEmpty ? "rgba(255,255,255,0.1)" : color || "rgba(255,255,255,0.6)",
          background: color && !isEmpty ? `${color}0d` : highlight ? "rgba(255,255,255,0.02)" : "transparent",
          fontWeight: color ? 600 : 400,
        }}
      >
        {isEmpty ? "·" : val}
      </td>
    );
  };

  return (
    <div
      className="rounded-xl overflow-auto"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,8,0.6)" }}
    >
      <table className="w-full min-w-max border-collapse">
        <thead>
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-mono uppercase tracking-widest"
              style={{ color: "#bf00ff99", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(191,0,255,0.06)" }}
            >
              {rowDim.replace("_", " ")} ↓ / {colDim.replace("_", " ")} →
            </th>
            {cols.map((c) => (
              <th
                key={c}
                className="px-4 py-3 text-center text-xs font-mono uppercase tracking-wider"
                style={{ color: "#00ccff99", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,204,255,0.04)" }}
              >
                {c}
              </th>
            ))}
            <th
              className="px-4 py-3 text-center text-xs font-mono uppercase tracking-wider"
              style={{ color: "#00ffcc99", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,255,204,0.06)" }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r} style={{ background: ri % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <td
                className="px-4 py-3 text-xs font-mono uppercase tracking-wider"
                style={{ color: "#bf00ff", borderBottom: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
              >
                {r}
              </td>
              {cols.map((c) => (
                <Cell key={c} val={computeMetric(cells[`${r}||${c}`])} />
              ))}
              <Cell val={rowTotals[ri]} highlight />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: "rgba(0,255,204,0.04)" }}>
            <td
              className="px-4 py-3 text-xs font-mono uppercase tracking-wider"
              style={{ color: "#00ffcc", borderTop: "1px solid rgba(0,255,204,0.2)" }}
            >
              Total
            </td>
            {colTotals.map((val, i) => (
              <td
                key={i}
                className="px-4 py-3 text-center text-sm font-mono font-semibold"
                style={{ color: "#00ffcc", borderTop: "1px solid rgba(0,255,204,0.2)" }}
              >
                {val ?? "·"}
              </td>
            ))}
            <td
              className="px-4 py-3 text-center text-sm font-mono font-bold"
              style={{ color: "#00ffcc", borderTop: "1px solid rgba(0,255,204,0.2)", textShadow: "0 0 10px #00ffcc" }}
            >
              {grandTotal ?? "·"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}