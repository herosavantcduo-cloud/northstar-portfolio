import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useFilters } from "@/components/FilterContext";
import { X, RotateCcw, SlidersHorizontal, Tag, Calendar, Star } from "lucide-react";

export default function FilterSidebar() {
  const { filters, updateFilter, resetFilters, hasActiveFilters, sidebarOpen, setSidebarOpen } = useFilters();
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    base44.entities.Work.list().then((works) => {
      const tagSet = new Set();
      works.forEach((w) => (w.tags || []).forEach((t) => tagSet.add(t)));
      setAllTags([...tagSet].sort());
    });
  }, []);

  const toggleTag = (tag) => {
    const cur = filters.tags;
    updateFilter("tags", cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed right-4 top-20 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300"
        style={{
          border: `1px solid ${hasActiveFilters ? "#00ffcc" : "rgba(255,255,255,0.12)"}`,
          color: hasActiveFilters ? "#00ffcc" : "rgba(255,255,255,0.4)",
          background: hasActiveFilters ? "rgba(0,255,204,0.08)" : "rgba(0,0,8,0.8)",
          boxShadow: hasActiveFilters ? "0 0 16px rgba(0,255,204,0.3)" : "none",
          backdropFilter: "blur(8px)",
        }}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filters
        {hasActiveFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
        )}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,8,0.4)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 w-80 flex flex-col overflow-hidden transition-transform duration-300"
        style={{
          background: "rgba(3,0,15,0.98)",
          borderLeft: "1px solid rgba(0,255,204,0.15)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <h3 className="text-sm font-mono uppercase tracking-widest" style={{ color: "#00ffcc" }}>Filters</h3>
            <p className="text-xs text-white/25 font-mono mt-0.5">Applied globally across all views</p>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded transition-all"
                style={{ color: "#ff4466", border: "1px solid #ff446633", background: "#ff44660d" }}
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            <button onClick={() => setSidebarOpen(false)} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          {/* Date Range */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5" style={{ color: "#00ccff" }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#00ccff99" }}>Date Range</span>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-white/30 font-mono block mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs font-mono text-white/70 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,204,255,0.2)", colorScheme: "dark" }}
                />
              </div>
              <div>
                <label className="text-xs text-white/30 font-mono block mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs font-mono text-white/70 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,204,255,0.2)", colorScheme: "dark" }}
                />
              </div>
            </div>
          </section>

          {/* Value Score */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-3.5 h-3.5" style={{ color: "#bf00ff" }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#bf00ff99" }}>Value Score</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-white/30 w-8">{filters.scoreMin}</span>
              <span className="text-xs text-white/20">—</span>
              <span className="text-xs font-mono text-white/30 flex-1 text-right">{filters.scoreMax}</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/30 font-mono block mb-1">Min score</label>
                <input
                  type="range" min={0} max={100} value={filters.scoreMin}
                  onChange={(e) => updateFilter("scoreMin", +e.target.value)}
                  className="w-full accent-purple-500"
                  style={{ accentColor: "#bf00ff" }}
                />
              </div>
              <div>
                <label className="text-xs text-white/30 font-mono block mb-1">Max score</label>
                <input
                  type="range" min={0} max={100} value={filters.scoreMax}
                  onChange={(e) => updateFilter("scoreMax", +e.target.value)}
                  className="w-full"
                  style={{ accentColor: "#bf00ff" }}
                />
              </div>
            </div>
            {/* Quick presets */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {[["Top tier", 80, 100], ["Mid", 50, 79], ["Any", 0, 100]].map(([label, min, max]) => (
                <button
                  key={label}
                  onClick={() => { updateFilter("scoreMin", min); updateFilter("scoreMax", max); }}
                  className="text-xs font-mono px-2.5 py-1 rounded-full transition-all"
                  style={{
                    border: `1px solid ${filters.scoreMin === min && filters.scoreMax === max ? "#bf00ff" : "rgba(191,0,255,0.2)"}`,
                    color: filters.scoreMin === min && filters.scoreMax === max ? "#bf00ff" : "rgba(255,255,255,0.3)",
                    background: filters.scoreMin === min && filters.scoreMax === max ? "rgba(191,0,255,0.1)" : "transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Tags */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-3.5 h-3.5" style={{ color: "#ff00ff" }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#ff00ff99" }}>Tags</span>
              {filters.tags.length > 0 && (
                <span className="text-xs font-mono px-1.5 py-px rounded-full" style={{ background: "#ff00ff22", color: "#ff00ff" }}>
                  {filters.tags.length}
                </span>
              )}
            </div>
            <p className="text-xs text-white/25 font-mono mb-3">AND logic — all selected tags must match</p>
            <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto pr-1">
              {allTags.length === 0 ? (
                <span className="text-xs text-white/20 font-mono">No tags found</span>
              ) : allTags.map((tag) => {
                const active = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="text-xs font-mono px-2.5 py-1 rounded-full transition-all duration-200"
                    style={{
                      border: `1px solid ${active ? "#ff00ff" : "rgba(255,0,255,0.15)"}`,
                      color: active ? "#ff00ff" : "rgba(255,255,255,0.35)",
                      background: active ? "rgba(255,0,255,0.12)" : "transparent",
                      boxShadow: active ? "0 0 8px rgba(255,0,255,0.3)" : "none",
                    }}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Active filter summary */}
        {hasActiveFilters && (
          <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(0,255,204,0.1)", background: "rgba(0,255,204,0.04)" }}>
            <p className="text-xs font-mono" style={{ color: "#00ffcc99" }}>
              Filters active — results narrowed across all pages
            </p>
          </div>
        )}
      </div>
    </>
  );
}