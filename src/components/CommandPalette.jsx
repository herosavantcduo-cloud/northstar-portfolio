import { useEffect, useState, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Search, X, FileText, FlaskConical, PenLine, Compass, Star } from "lucide-react";

const catIcons = {
  writing: PenLine,
  research: FlaskConical,
  notation: FileText,
  design: Compass,
  other: FileText,
};

const catColors = {
  writing: "#00ffcc",
  research: "#bf00ff",
  notation: "#ff00ff",
  design: "#00ccff",
  other: "#ffff00",
};

function scoreText(work, query) {
  const q = query.toLowerCase();
  let score = 0;
  if (work.title?.toLowerCase().includes(q)) score += 10;
  if ((work.tags || []).some((t) => t.toLowerCase().includes(q))) score += 6;
  if (work.description?.toLowerCase().includes(q)) score += 3;
  return score;
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [works, setWorks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      if (!loaded) {
        base44.entities.Work.list("-value_score", 200).then((d) => {
          setWorks(d);
          setLoaded(true);
        });
      }
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const results = query.trim().length === 0
    ? works.slice(0, 12)
    : works
        .filter((w) => scoreText(w, query) > 0)
        .sort((a, b) => scoreText(b, query) - scoreText(a, query))
        .slice(0, 12);

  const navigate = useCallback((work) => {
    window.location.href = createPageUrl("Portfolio") + `?highlight=${work.id}`;
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setCursor((c) => Math.min(c + 1, results.length - 1));
      if (e.key === "ArrowUp") setCursor((c) => Math.max(c - 1, 0));
      if (e.key === "Enter" && results[cursor]) navigate(results[cursor]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, cursor, navigate, onClose]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  if (!open) return null;

  const highlight = (text, q) => {
    if (!q || !text) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: "#00ffcc33", color: "#00ffcc", borderRadius: 2 }}>
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,8,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "rgba(5,0,20,0.97)",
          border: "1px solid rgba(0,255,204,0.25)",
          boxShadow: "0 0 60px rgba(0,255,204,0.12), 0 30px 80px rgba(0,0,0,0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#00ffcc" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search work titles, descriptions, tags…"
            className="flex-1 bg-transparent outline-none text-sm font-mono text-white placeholder-white/25"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-white/30 hover:text-white/60">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
          {!loaded ? (
            <div className="py-10 text-center text-white/25 font-mono text-xs animate-pulse">Loading corpus…</div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-white/25 font-mono text-xs">No results for "{query}"</div>
          ) : (
            <>
              {query.trim() === "" && (
                <div className="px-5 pt-3 pb-1 text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Recent Work
                </div>
              )}
              {results.map((w, i) => {
                const color = catColors[w.category] || "#fff";
                const Icon = catIcons[w.category] || FileText;
                const active = cursor === i;
                return (
                  <div
                    key={w.id}
                    className="flex items-start gap-3 px-5 py-3 cursor-pointer transition-all duration-150"
                    style={{
                      background: active ? `${color}10` : "transparent",
                      borderLeft: `2px solid ${active ? color : "transparent"}`,
                    }}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => navigate(w)}
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg flex-shrink-0" style={{ background: `${color}18` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {highlight(w.title, query)}
                        </span>
                        {w.value_score && (
                          <span className="flex items-center gap-0.5 text-xs font-mono flex-shrink-0" style={{ color }}>
                            <Star className="w-3 h-3" />{w.value_score}
                          </span>
                        )}
                      </div>
                      {w.description && (
                        <p className="text-xs text-white/35 truncate mt-0.5">{highlight(w.description, query)}</p>
                      )}
                      {w.tags?.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {w.tags.slice(0, 5).map((t, ti) => (
                            <span key={ti} className="text-xs font-mono px-1.5 py-px rounded" style={{ background: `${color}15`, color }}>
                              #{highlight(t, query)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-mono uppercase flex-shrink-0 mt-0.5" style={{ color: `${color}66` }}>
                      {w.category}
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex gap-3">
            {[["↵", "open"], ["↑↓", "navigate"], ["ESC", "close"]].map(([k, l]) => (
              <span key={k} className="flex items-center gap-1 text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
                <kbd className="px-1.5 py-px rounded text-xs" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>{k}</kbd>
                {l}
              </span>
            ))}
          </div>
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}