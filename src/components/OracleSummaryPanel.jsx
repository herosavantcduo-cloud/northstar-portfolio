import { useState } from "react";
import { Loader2, Zap, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const statusColors = {
  pending: "#ffff00",
  generating: "#00ccff",
  complete: "#00ffcc",
  error: "#ff4466",
};

export default function OracleSummaryPanel({ work, onUpdated }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = work.oracle_status || "pending";
  const color = statusColors[status] || "#ffffff";

  const triggerGeneration = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await base44.functions.invoke("generateOracleSummary", { work_id: work.id });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatSummary = (text) => {
    if (!text) return null;
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="font-bold" style={{ color: "#00ffcc" }}>
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className="mt-4 rounded-lg overflow-hidden transition-all duration-300"
      style={{ border: `1px solid ${color}44`, background: `${color}08` }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color }}>
            Global Tech Oracle
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ background: `${color}22`, color }}
          >
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(status === "pending" || status === "error") && (
            <button
              onClick={triggerGeneration}
              disabled={loading}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded font-mono transition-all"
              style={{ border: `1px solid ${color}55`, color, background: `${color}11` }}
            >
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {loading ? "Generating…" : "Generate"}
            </button>
          )}
          {status === "generating" && (
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color }} />
          )}
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-white/30" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && work.oracle_summary && (
        <div
          className="px-4 pb-4 text-sm leading-relaxed text-white/70 whitespace-pre-wrap"
          style={{ borderTop: `1px solid ${color}22` }}
        >
          <div className="pt-3">{formatSummary(work.oracle_summary)}</div>
        </div>
      )}

      {expanded && !work.oracle_summary && status !== "generating" && (
        <div className="px-4 pb-4 pt-3 text-xs text-white/30 font-mono">
          No oracle summary yet. Click "Generate" to run the pipeline.
        </div>
      )}

      {expanded && status === "generating" && (
        <div className="px-4 pb-4 pt-3 text-xs font-mono flex items-center gap-2" style={{ color }}>
          <Loader2 className="w-3 h-3 animate-spin" />
          Generating 7-step analysis… this may take ~30 seconds.
        </div>
      )}
    </div>
  );
}