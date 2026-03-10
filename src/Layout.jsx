import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import CommandPalette from "@/components/CommandPalette";
import FilterSidebar from "@/components/FilterSidebar";
import { FilterProvider } from "@/components/FilterContext";

const navLinks = [
  { label: "Home", page: "Home" },
  { label: "Portfolio", page: "Portfolio" },
  { label: "Research", page: "Research" },
  { label: "Expertise", page: "Expertise" },
  { label: "Pivot", page: "PivotAnalysis" },
];

const SIDEBAR_PAGES = ["Portfolio", "Research", "PivotAnalysis"];

function AppShell({ children, currentPageName }) {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const showSidebar = SIDEBAR_PAGES.includes(currentPageName);

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        body { background: #000008; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #00ffcc33; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00ffcc66; }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace !important; }
        ::selection { background: rgba(0,255,204,0.2); color: #00ffcc; }
      `}</style>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(0,0,8,0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Link
          to={createPageUrl("Home")}
          className="text-sm font-mono tracking-[0.3em] uppercase font-bold"
          style={{
            background: "linear-gradient(90deg, #00ffcc, #ff00ff, #00ccff)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
          }}
        >
          PRISMATIC
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              className="text-xs font-mono tracking-widest uppercase transition-all duration-300"
              style={{
                color: currentPageName === page ? "#00ffcc" : "rgba(255,255,255,0.35)",
                textShadow: currentPageName === page ? "0 0 10px #00ffcc" : "none",
              }}
            >
              {label}
            </Link>
          ))}

          {/* K-menu trigger */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.04)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#00ffcc55"; e.currentTarget.style.color = "#00ffcc"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
          >
            <Search className="w-3 h-3" />
            Search
            <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px" }}>
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={() => setPaletteOpen(true)} className="text-white/40">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-white/50" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          style={{ background: "rgba(0,0,8,0.97)", backdropFilter: "blur(20px)" }}
        >
          {navLinks.map(({ label, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              onClick={() => setOpen(false)}
              className="text-2xl font-mono tracking-widest uppercase"
              style={{ color: currentPageName === page ? "#00ffcc" : "rgba(255,255,255,0.5)" }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      <main className="pt-16">{children}</main>

      {/* Global Command Palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Persistent filter sidebar — only on dashboard pages */}
      {showSidebar && <FilterSidebar />}
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <FilterProvider>
      <AppShell currentPageName={currentPageName}>{children}</AppShell>
    </FilterProvider>
  );
}