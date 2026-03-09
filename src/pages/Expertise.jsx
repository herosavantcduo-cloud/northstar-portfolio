import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import HolographicBackground from "../components/HolographicBackground";
import ExpertiseBar from "../components/ExpertiseBar";
import GlitchText from "../components/GlitchText";

const defaultExpertise = [
  { id: "1", name: "Writing", rank_score: 92, color: "#00ffcc", description: "Long-form essays, technical writing, narrative research." },
  { id: "2", name: "Research", rank_score: 88, color: "#bf00ff", description: "Deep investigative and academic research across disciplines." },
  { id: "3", name: "Notation & Value Systems", rank_score: 80, color: "#ff00ff", description: "Developing personal scoring and notation frameworks for evaluating work." },
  { id: "4", name: "Design Thinking", rank_score: 74, color: "#00ccff", description: "Holistic problem framing, systems design, visual communication." },
];

export default function Expertise() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    base44.entities.ExpertiseArea.list("-rank_score").then((d) => {
      setAreas(d.length ? d : defaultExpertise);
    }).catch(() => setAreas(defaultExpertise));
  }, []);

  const sorted = [...areas].sort((a, b) => b.rank_score - a.rank_score);

  return (
    <div className="relative min-h-screen text-white">
      <HolographicBackground />
      <div className="relative z-10 px-6 py-20 max-w-3xl mx-auto">
        <div
          className="text-xs font-mono tracking-[0.4em] uppercase mb-4"
          style={{ color: "#bf00ff", textShadow: "0 0 10px #bf00ff" }}
        >
          Skills · Ranked by Value
        </div>
        <h1
          className="text-4xl md:text-6xl font-bold mb-14"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #bf00ff 60%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <GlitchText text="EXPERTISE" cycles={8} />
        </h1>

        <div className="space-y-10">
          {sorted.map((area, i) => (
            <div key={area.id || i}>
              <ExpertiseBar
                name={area.name}
                score={area.rank_score}
                color={area.color || "#00ffcc"}
                delay={i * 100}
              />
              {area.description && (
                <p className="text-white/40 text-sm mt-2 ml-1 leading-relaxed font-light">
                  {area.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-20 p-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            className="text-xs font-mono tracking-[0.3em] uppercase mb-3"
            style={{ color: "#00ffcc" }}
          >
            Notation System
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            Scores reflect a personal notation framework that evaluates depth, originality, real-world impact, and consistency of output. Each area is ranked against itself over time — not against others. A 92 in Writing means writing is where the most refined and consistent value has been generated.
          </p>
        </div>
      </div>
    </div>
  );
}