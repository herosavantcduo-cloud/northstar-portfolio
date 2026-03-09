import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", page: "Home" },
  { label: "Portfolio", page: "Portfolio" },
  { label: "Expertise", page: "Expertise" },
];

export default function Layout({ children, currentPageName }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #000008; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #00ffcc44; border-radius: 4px; }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(0,0,8,0.7)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
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

        {/* Desktop */}
        <div className="hidden md:flex gap-8">
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
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-white/50"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
    </div>
  );
}