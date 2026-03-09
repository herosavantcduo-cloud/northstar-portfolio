import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import HolographicBackground from "../components/HolographicBackground";
import GlitchText from "../components/GlitchText";
import ExpertiseBar from "../components/ExpertiseBar";
import WorkCard from "../components/WorkCard";
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

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div
          className="mb-4 text-xs font-mono tracking-[0.4em] uppercase"
          style={{ color: "#00ffcc", textShadow: "0 0 12px #00ffcc" }}
        >
          Portfolio · Research · Writing
        </div>
        <h1
          className="text-5xl md:text-8xl font-bold mb-6 leading-none"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #00ffff 40%, #ff00ff 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 30px rgba(0,255,255,0.3))",
          }}
        >
          <GlitchText text="PRISMATIC" interval={50} cycles={12} />
        </h1>
        <p className="text-white/50 max-w-xl text-lg mb-10 leading-relaxed font-light">
          A living portfolio of research, writing &amp; creative work — ranked by value, built for the future.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to={createPageUrl("Portfolio")}
            className="px-8 py-3 rounded-full font-mono text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #00ffcc22, #bf00ff22)",
              border: "1px solid #00ffcc",
              color: "#00ffcc",
              boxShadow: "0 0 20px #00ffcc33",
            }}
          >
            View Work
          </Link>
          <Link
            to={createPageUrl("Expertise")}
            className="px-8 py-3 rounded-full font-mono text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Expertise
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
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