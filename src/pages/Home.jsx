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
import { ArrowRight } from "lucide-react";

const defaultExpertise = [
  { name: "Writing", rank_score: 92, color: "#00ffcc" },
  { name: "Research", rank_score: 88, color: "#bf00ff" },
  { name: "Notation & Value Systems", rank_score: 80, color: "#ff00ff" },
  { name: "Design Thinking", rank_score: 74, color: "#00ccff" },
];

export default function Home() {
  const [works, setWorks] = useState([]);
  const [expertise, setExpertise] = useState([]);

  useEffect(() => {
    base44.entities.Work.list("-value_score", 6).then(setWorks).catch(() => {});
    base44.entities.ExpertiseArea.list("-rank_score").then((d) => {
      setExpertise(d.length ? d : defaultExpertise);
    }).catch(() => setExpertise(defaultExpertise));
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <HolographicBackground />
      <MarioSprites />

      {/* Hero */}
      <section className="relative z-10 min-h-screen" style={{ touchAction: "none" }}>
        {/* Static center title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <div
            className="mb-3 text-xs font-mono tracking-[0.4em] uppercase"
            style={{ color: "#00ffcc", textShadow: "0 0 12px #00ffcc" }}
          >
            Portfolio · Research · Writing
          </div>
          <h1
            className="text-5xl md:text-8xl font-bold leading-none"
            style={{
              background: "linear-gradient(135deg, #fff 0%, #00ffff 40%, #ff00ff 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(0,255,255,0.3))",
            }}
          >
            <GlitchText text="PRISMATIC" interval={50} cycles={12} />
          </h1>
        </div>

        {/* Physics floating elements */}
        <FloatingOrbit
          items={[
            {
              id: "nav-portfolio",
              href: "Portfolio",
              render: () => (
                <div
                  className="px-6 py-2.5 rounded-full font-mono text-sm tracking-widest uppercase"
                  style={{
                    background: "linear-gradient(135deg, #00ffcc22, #bf00ff22)",
                    border: "1px solid #00ffcc",
                    color: "#00ffcc",
                    boxShadow: "0 0 20px #00ffcc44",
                    backdropFilter: "blur(8px)",
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
                  className="px-6 py-2.5 rounded-full font-mono text-sm tracking-widest uppercase"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(191,0,255,0.6)",
                    color: "#bf00ff",
                    boxShadow: "0 0 16px rgba(191,0,255,0.3)",
                    backdropFilter: "blur(8px)",
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
                <div className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(0,255,255,0.3)", color: "rgba(0,255,255,0.7)", background: "rgba(0,255,255,0.05)" }}>
                  Research
                </div>
              ),
            },
            {
              id: "tag-writing",
              render: () => (
                <div className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(255,0,255,0.3)", color: "rgba(255,0,255,0.7)", background: "rgba(255,0,255,0.05)" }}>
                  Writing
                </div>
              ),
            },
            {
              id: "tag-notation",
              render: () => (
                <div className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(0,204,255,0.3)", color: "rgba(0,204,255,0.7)", background: "rgba(0,204,255,0.05)" }}>
                  Notation
                </div>
              ),
            },
            {
              id: "tag-design",
              render: () => (
                <div className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(191,0,255,0.3)", color: "rgba(191,0,255,0.7)", background: "rgba(191,0,255,0.05)" }}>
                  Design
                </div>
              ),
            },
            {
              id: "label-ranked",
              render: () => (
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ color: "#fff" }}>
                  ranked by value
                </div>
              ),
            },
            {
              id: "label-future",
              render: () => (
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40" style={{ color: "#00ffcc" }}>
                  built for the future
                </div>
              ),
            },
            {
              id: "dot-1",
              render: () => (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffcc", boxShadow: "0 0 10px #00ffcc", opacity: 0.7 }} />
              ),
            },
            {
              id: "dot-2",
              render: () => (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#ff00ff", boxShadow: "0 0 8px #ff00ff", opacity: 0.6 }} />
              ),
            },
            {
              id: "dot-3",
              render: () => (
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#bf00ff", boxShadow: "0 0 10px #bf00ff", opacity: 0.5 }} />
              ),
            },
          ]}
        />

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-20 pointer-events-none">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white" />
          <span className="text-xs font-mono tracking-widest">SCROLL</span>
        </div>
      </section>

      {/* Expertise snapshot */}
      <section className="relative z-10 px-6 py-20 max-w-3xl mx-auto">
        <h2
          className="text-xs font-mono tracking-[0.4em] uppercase mb-8"
          style={{ color: "#bf00ff", textShadow: "0 0 10px #bf00ff" }}
        >
          Ranked Expertise
        </h2>
        {expertise.map((e, i) => (
          <ExpertiseBar
            key={e.name}
            name={e.name}
            score={e.rank_score}
            color={e.color}
            delay={i * 150}
          />
        ))}
        <Link
          to={createPageUrl("Expertise")}
          className="mt-6 inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase"
          style={{ color: "#bf00ff" }}
        >
          Full breakdown <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Featured work */}
      {works.length > 0 && (
        <section className="relative z-10 px-6 py-10 max-w-5xl mx-auto">
          <h2
            className="text-xs font-mono tracking-[0.4em] uppercase mb-8"
            style={{ color: "#ff00ff", textShadow: "0 0 10px #ff00ff" }}
          >
            Selected Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((w) => (
              <WorkCard key={w.id} work={w} />
            ))}
          </div>
          <Link
            to={createPageUrl("Portfolio")}
            className="mt-8 inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase"
            style={{ color: "#ff00ff" }}
          >
            All work <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      <div className="h-32" />
    </div>
  );
}