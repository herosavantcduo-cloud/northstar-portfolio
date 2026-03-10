import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import HolographicBackground from "../components/HolographicBackground";
import WorkCard from "../components/WorkCard";
import GlitchText from "../components/GlitchText";
import { useFilters } from "@/components/FilterContext";

const CATEGORIES = ["all", "writing", "research", "notation", "design", "other"];

export default function Portfolio() {
  const [works, setWorks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [focusedId, setFocusedId] = useState(null);

  useEffect(() => {
    base44.entities.Work.list("-value_score").then((d) => {
      setWorks(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? works : works.filter((w) => w.category === filter);

  const catColors = {
    all: "#ffffff",
    writing: "#00ffcc",
    research: "#bf00ff",
    notation: "#ff00ff",
    design: "#00ccff",
    other: "#ffff00",
  };

  return (
    <div className="relative min-h-screen text-white">
      <HolographicBackground />
      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div
          className="text-xs font-mono tracking-[0.4em] uppercase mb-4"
          style={{ color: "#ff00ff", textShadow: "0 0 10px #ff00ff" }}
        >
          All Work
        </div>
        <h1
          className="text-4xl md:text-6xl font-bold mb-10"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #ff00ff 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <GlitchText text="PORTFOLIO" cycles={8} />
        </h1>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300"
              style={{
                border: `1px solid ${filter === cat ? catColors[cat] : "rgba(255,255,255,0.1)"}`,
                color: filter === cat ? catColors[cat] : "rgba(255,255,255,0.35)",
                background: filter === cat ? `${catColors[cat]}15` : "transparent",
                boxShadow: filter === cat ? `0 0 12px ${catColors[cat]}44` : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/30 font-mono text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30 font-mono text-sm">
            No work added yet. Add pieces from the Admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((w) => (
              <WorkCard key={w.id} work={w} focused={focusedId === w.id} onFocus={setFocusedId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}