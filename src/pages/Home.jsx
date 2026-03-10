import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import HolographicBackground from "../components/HolographicBackground";
import GlitchText from "../components/GlitchText";
import ExpertiseBar from "../components/ExpertiseBar";
import WorkCard from "../components/WorkCard";
import FloatingOrbit from "../components/FloatingOrbit";
import MarioSprites from "../components/MarioSprites";
import MusicPlayer from "../components/MusicPlayer";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const defaultExpertise = [
  { name: "Writing", rank_score: 92, color: "#00ffcc" },
  { name: "Research", rank_score: 88, color: "#bf00ff" },
  { name: "Notation & Value Systems", rank_score: 80, color: "#ff00ff" },
  { name: "Design Thinking", rank_score: 74, color: "#00ccff" },
];

export default function Home() {
  const [works, setWorks] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [focusedCard, setFocusedCard] = useState(null);

  useEffect(() => {
    setMounted(true);
    base44.entities.Work.list("-value_score", 6).then(setWorks).catch(() => {});
    base44.entities.ExpertiseArea.list("-rank_score").then((d) => {
      setExpertise(d.length ? d : defaultExpertise);
    }).catch(() => setExpertise(defaultExpertise));
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <HolographicBackground />
      <MarioSprites />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen" style={{ touchAction: "none" }}>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          {/* Eyebrow */}
          <div
            className="mb-5 flex items-center gap-3"
            style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}
          >
            <div style={{ width: 24, height: 1, background: "rgba(0,255,204,0.4)" }} />
            <span
              style={{
                color: "#00ffcc",
                fontSize: 10,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                textShadow: "0 0 16px rgba(0,255,204,0.6)",
              }}
            >
              Portfolio · Research · Writing
            </span>
            <div style={{ width: 24, height: 1, background: "rgba(0,255,204,0.4)" }} />
          </div>

          {/* Main title */}
          <h1
            style={{
              fontSize: "clamp(52px, 10vw, 110px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, #e0ffff 35%, #00ffcc 65%, #ff00ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(0,255,255,0.25))",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "none" : "translateY(12px)",
              transition: "opacity 1s ease 0.4s, transform 1s cubic-bezier(0.23,1,0.32,1) 0.4s",
            }}
          >
            <GlitchText text="PRISMATIC" interval={50} cycles={12} />
          </h1>

          {/* Subtitle */}
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.05em",
              maxWidth: 360,
              textAlign: "center",
              lineHeight: 1.7,
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.8s ease 0.7s",
            }}
          >
            A decision-intelligence research ecosystem.<br />Built for the future of meaning.
          </p>
        </div>

        {/* Physics floating elements */}
        <FloatingOrbit
          items={[
            {
              id: "nav-portfolio",
              href: "Portfolio",
              render: () => (
                <div
                  style={{
                    padding: "10px 24px",
                    borderRadius: 40,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: "linear-gradient(135deg, rgba(0,255,204,0.15), rgba(191,0,255,0.1))",
                    border: "1px solid rgba(0,255,204,0.5)",
                    color: "#00ffcc",
                    boxShadow: "0 0 30px rgba(0,255,204,0.2), inset 0 1px 0 rgba(0,255,204,0.1)",
                    backdropFilter: "blur(12px)",
                    whiteSpace: "nowrap",
                  }}
                >
                  View Work
                </div>
              ),
            },
            {
              id: "nav-expertise",
              href: "Expertise",
              render: () => (
                <div
                  style={{
                    padding: "10px 24px",
                    borderRadius: 40,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: "rgba(191,0,255,0.1)",
                    border: "1px solid rgba(191,0,255,0.5)",
                    color: "#bf00ff",
                    boxShadow: "0 0 24px rgba(191,0,255,0.2)",
                    backdropFilter: "blur(12px)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Expertise
                </div>
              ),
            },
            {
              id: "tag-research",
              render: () => (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(0,255,255,0.2)", color: "rgba(0,255,255,0.6)", background: "rgba(0,255,255,0.04)" }}>
                  Research
                </div>
              ),
            },
            {
              id: "tag-writing",
              render: () => (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(255,0,255,0.2)", color: "rgba(255,0,255,0.6)", background: "rgba(255,0,255,0.04)" }}>
                  Writing
                </div>
              ),
            },
            {
              id: "tag-notation",
              render: () => (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(0,204,255,0.2)", color: "rgba(0,204,255,0.6)", background: "rgba(0,204,255,0.04)" }}>
                  Notation
                </div>
              ),
            },
            {
              id: "tag-design",
              render: () => (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(191,0,255,0.2)", color: "rgba(191,0,255,0.6)", background: "rgba(191,0,255,0.04)" }}>
                  Design
                </div>
              ),
            },
            {
              id: "label-ranked",
              render: () => (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                  ranked by value
                </div>
              ),
            },
            {
              id: "label-future",
              render: () => (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(0,255,204,0.3)" }}>
                  built for the future
                </div>
              ),
            },
            {
              id: "dot-1",
              render: () => <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00ffcc", boxShadow: "0 0 12px #00ffcc", opacity: 0.6 }} />,
            },
            {
              id: "dot-2",
              render: () => <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#ff00ff", boxShadow: "0 0 10px #ff00ff", opacity: 0.5 }} />,
            },
            {
              id: "dot-3",
              render: () => <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#bf00ff", boxShadow: "0 0 10px #bf00ff", opacity: 0.45 }} />,
            },
          ]}
        />

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none"
          style={{ opacity: 0.3 }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(0,255,204,0.6))" }} />
          <span style={{ fontSize: 8, fontFamily: "'Space Mono', monospace", letterSpacing: "0.4em", color: "#00ffcc", textTransform: "uppercase" }}>scroll</span>
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
      </div>

      {/* ── EXPERTISE ─────────────────────────── */}
      <section style={{ position: "relative", zIndex: 10, padding: "80px 24px", maxWidth: 680, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div style={{ width: 3, height: 32, borderRadius: 2, background: "linear-gradient(to bottom, #bf00ff, transparent)" }} />
          <div>
            <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: "0.35em", textTransform: "uppercase", color: "#bf00ff", marginBottom: 3, textShadow: "0 0 12px rgba(191,0,255,0.6)" }}>
              Ranked Expertise
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.03em" }}>
              Scored by depth, application, and originality
            </div>
          </div>
        </div>

        {expertise.map((e, i) => (
          <ExpertiseBar
            key={e.name}
            name={e.name}
            score={e.rank_score}
            color={e.color}
            delay={i * 180}
          />
        ))}

        <Link
          to={createPageUrl("Expertise")}
          style={{
            marginTop: 32,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 10,
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#bf00ff",
            textDecoration: "none",
            opacity: 0.7,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
        >
          Full breakdown <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* ── DIVIDER ─────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
      </div>

      {/* ── SELECTED WORK ─────────────────────────── */}
      {works.length > 0 && (
        <section style={{ position: "relative", zIndex: 10, padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 3, height: 32, borderRadius: 2, background: "linear-gradient(to bottom, #ff00ff, transparent)" }} />
              <div>
                <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: "0.35em", textTransform: "uppercase", color: "#ff00ff", marginBottom: 3, textShadow: "0 0 12px rgba(255,0,255,0.6)" }}>
                  Selected Work
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.03em" }}>
                  Ranked by value score
                </div>
              </div>
            </div>
            <Link
              to={createPageUrl("Portfolio")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,0,255,0.6)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#ff00ff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,0,255,0.6)"}
            >
              All work <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {works.map((w, i) => (
              <WorkCard 
                key={w.id} 
                work={w} 
                index={i}
                onFocus={setFocusedCard}
                focused={focusedCard === w.id}
              />
            ))}
          </div>
        </section>
      )}

      <div style={{ height: 100 }} />
      <MusicPlayer />
    </div>
  );
}