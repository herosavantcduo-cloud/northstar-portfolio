import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useFilters } from "@/components/FilterContext";
import HolographicBackground from "@/components/HolographicBackground";
import GlitchText from "@/components/GlitchText";
import ResearchTagCloud from "@/components/research/ResearchTagCloud";
import ResearchScoreChart from "@/components/research/ResearchScoreChart";
import ResearchOracleStatus from "@/components/research/ResearchOracleStatus";
import ResearchStatCards from "@/components/research/ResearchStatCards";

export default function Research() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { applyFilters } = useFilters();

  useEffect(() => {
    base44.entities.Work.filter({ category: "research" })
      .then(setWorks)
      .finally(() => setLoading(false));
  }, []);

  const filteredWorks = applyFilters(works);

  return (
    <div className="min-h-screen relative" style={{ background: "#000008" }}>
      <HolographicBackground videoId="HGgQpXDIjsw" />

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono tracking-[0.4em] uppercase mb-2" style={{ color: "#bf00ff" }}>
            Research Intelligence
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <GlitchText text="RESEARCH LAB" className="text-white" />
          </h1>
          <p className="text-white/40 text-sm font-mono">
            Distribution analysis · Oracle pipeline status · Value mapping
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white/30 font-mono text-sm animate-pulse">Loading research corpus…</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stat cards row */}
            <ResearchStatCards works={works} />

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResearchScoreChart works={works} />
              <ResearchOracleStatus works={works} />
            </div>

            {/* Tag cloud full width */}
            <ResearchTagCloud works={works} />
          </div>
        )}
      </div>
    </div>
  );
}