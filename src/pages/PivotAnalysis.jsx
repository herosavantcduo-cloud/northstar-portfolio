import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import HolographicBackground from "@/components/HolographicBackground";
import GlitchText from "@/components/GlitchText";
import PivotTable from "@/components/pivot/PivotTable";
import PivotControls from "@/components/pivot/PivotControls";
import { Download } from "lucide-react";

export default function PivotAnalysis() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowDim, setRowDim] = useState("oracle_status");
  const [colDim, setColDim] = useState("category");
  const [metric, setMetric] = useState("avg_score");

  useEffect(() => {
    base44.entities.Work.list().then(setWorks).finally(() => setLoading(false));
  }, []);

  const pivotData = useMemo(() => {
    const rowVals = new Set();
    const colVals = new Set();

    works.forEach((w) => {
      const rVal = getVal(w, rowDim);
      const cVal = getVal(w, colDim);
      (Array.isArray(rVal) ? rVal : [rVal]).forEach((r) => rowVals.add(r));
      (Array.isArray(cVal) ? cVal : [cVal]).forEach((c) => colVals.add(c));
    });

    const rows = [...rowVals].sort();
    const cols = [...colVals].sort();

    const cells = {};
    works.forEach((w) => {
      const rVals = Array.isArray(getVal(w, rowDim)) ? getVal(w, rowDim) : [getVal(w, rowDim)];
      const cVals = Array.isArray(getVal(w, colDim)) ? getVal(w, colDim) : [getVal(w, colDim)];
      rVals.forEach((r) => {
        cVals.forEach((c) => {
          const key = `${r}||${c}`;
          if (!cells[key]) cells[key] = [];
          cells[key].push(w);
        });
      });
    });

    return { rows, cols, cells };
  }, [works, rowDim, colDim]);

  const computeMetric = (items) => {
    if (!items || items.length === 0) return null;
    if (metric === "count") return items.length;
    if (metric === "avg_score") {
      const scored = items.filter((w) => w.value_score);
      return scored.length ? Math.round(scored.reduce((s, w) => s + w.value_score, 0) / scored.length) : "—";
    }
    if (metric === "max_score") {
      const scored = items.filter((w) => w.value_score);
      return scored.length ? Math.max(...scored.map((w) => w.value_score)) : "—";
    }
    if (metric === "total_score") {
      return items.reduce((s, w) => s + (w.value_score || 0), 0);
    }
    return items.length;
  };

  const handleExportCSV = () => {
    const { rows, cols, cells } = pivotData;
    const header = [rowDim, ...cols, "Row Total"].join(",");
    const dataRows = rows.map((r) => {
      const rowCells = cols.map((c) => {
        const val = computeMetric(cells[`${r}||${c}`]);
        return val ?? 0;
      });
      const rowTotal = metric === "avg_score"
        ? Math.round(rowCells.filter(v => typeof v === "number").reduce((a, b) => a + b, 0) / rowCells.filter(v => typeof v === "number").length) || 0
        : rowCells.filter(v => typeof v === "number").reduce((a, b) => a + b, 0);
      return [r, ...rowCells, rowTotal].join(",");
    });

    // Column totals row
    const colTotals = cols.map((c) => {
      const allItems = rows.flatMap((r) => cells[`${r}||${c}`] || []);
      return computeMetric(allItems) ?? 0;
    });
    const grandTotal = metric === "avg_score"
      ? Math.round(colTotals.filter(v => typeof v === "number").reduce((a, b) => a + b, 0) / colTotals.filter(v => typeof v === "number").length) || 0
      : colTotals.filter(v => typeof v === "number").reduce((a, b) => a + b, 0);
    const totalsRow = ["TOTAL", ...colTotals, grandTotal].join(",");

    const csv = [header, ...dataRows, totalsRow].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pivot_${rowDim}_vs_${colDim}_${metric}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "#000008" }}>
      <HolographicBackground videoId="HGgQpXDIjsw" />

      <div className="relative z-10 px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono tracking-[0.4em] uppercase mb-2" style={{ color: "#00ccff" }}>
              Strategic Intelligence
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              <GlitchText text="PIVOT ANALYSIS" className="text-white" />
            </h1>
            <p className="text-white/30 text-xs font-mono">Cross-dimensional value mapping · {works.length} entries loaded</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-300"
            style={{ border: "1px solid #00ffcc55", color: "#00ffcc", background: "#00ffcc11" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00ffcc22"; e.currentTarget.style.boxShadow = "0 0 20px #00ffcc44"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#00ffcc11"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white/30 font-mono text-sm animate-pulse">Loading corpus…</div>
          </div>
        ) : (
          <div className="space-y-6">
            <PivotControls
              rowDim={rowDim} setRowDim={setRowDim}
              colDim={colDim} setColDim={setColDim}
              metric={metric} setMetric={setMetric}
            />
            <PivotTable
              pivotData={pivotData}
              computeMetric={computeMetric}
              metric={metric}
              works={works}
              rowDim={rowDim}
              colDim={colDim}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function getVal(work, dim) {
  if (dim === "oracle_status") return work.oracle_status || "none";
  if (dim === "category") return work.category || "other";
  if (dim === "tags") return work.tags?.length ? work.tags : ["untagged"];
  if (dim === "featured") return work.featured ? "featured" : "standard";
  return "—";
}