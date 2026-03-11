import HolographicBackground from "../components/HolographicBackground";
import GlitchText from "../components/GlitchText";

const careerScores = [
  { title: "AI Alignment & Safety Researcher/Officer", score: 97, color: "#00ffcc" },
  { title: "Principal AI Architect / Prompt Engineer", score: 95, color: "#bf00ff" },
  { title: "AI Research Scientist (Emergent Behaviors)", score: 92, color: "#ff00ff" },
  { title: "AI Product Visionary / Strategist", score: 90, color: "#00ccff" },
  { title: "Traditional Backend Software Engineer", score: 55, color: "#ffff00" },
];

const skills = [
  { label: "Advanced Prompt Orchestration & Persona Design", desc: "Expert-level multi-agent simulation and heuristic framework design to steer LLMs through complex reasoning tasks.", color: "#00ffcc" },
  { label: "Mechanistic Interpretability & Discovery", desc: "Ability to map the \"latent space\" of neural networks to identify undiscovered utilities and Blue Team positive emergent behaviors.", color: "#bf00ff" },
  { label: "Systems Thinking & Cybernetics", desc: "Modeling AI evolution as recursive feedback loops, utilizing Meta-Cycle Optimization to refine system outputs.", color: "#ff00ff" },
  { label: "Ethical Framework & Alignment Design", desc: "Constructing Constitutional AI guardrails and Mortal Compasses that account for human error and socio-economic constraints.", color: "#00ccff" },
  { label: "Interdisciplinary Strategic Synthesis", desc: "Integrating concepts from physics, logic, and history to communicate complex technical paradigms.", color: "#ffaa00" },
];

const vocab = ["latent spaces", "meta-cycles", "mortal compass", "causal webs", "volume of understanding", "latent space mapping", "meta-cycle optimization", "alignment sentinel", "ghost in the machine"];

const contacts = [
  { type: "Titles", items: ["Chief AI Strategy Officer", "Principal AI Architect", "Lead of AI Capability Discovery", "AI Safety/Interpretability Researcher"] },
  { type: "Companies", items: ["Anthropic", "OpenAI", "DeepMind", "Venice.ai", "Figure", "Boston Dynamics", "Microsoft Research"] },
];

function ScoreBar({ title, score, color, i }) {
  return (
    <div
      style={{
        padding: "20px 22px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid rgba(255,255,255,0.05)`,
        marginBottom: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${score}%`, background: `linear-gradient(90deg, rgba(${hexToRgb(color)},0.07) 0%, transparent 100%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{title}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color, textShadow: `0 0 12px ${color}88` }}>{score}/100</span>
      </div>
      <div style={{ height: 3, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", borderRadius: 3, width: `${score}%`, background: `linear-gradient(90deg, ${color}66, ${color})`, boxShadow: `0 0 10px ${color}44`, transition: "width 1.4s cubic-bezier(0.23,1,0.32,1)" }} />
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function SectionHeader({ accent, label, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
      <div style={{ width: 3, height: 32, borderRadius: 2, background: `linear-gradient(to bottom, ${accent}, transparent)` }} />
      <div>
        <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: "0.35em", textTransform: "uppercase", color: accent, marginBottom: 3, textShadow: `0 0 12px ${accent}88` }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.03em" }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <HolographicBackground />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 860, margin: "0 auto", padding: "72px 24px 120px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 72, paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 20, height: 1, background: "rgba(0,255,204,0.4)" }} />
            <span style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: "0.4em", textTransform: "uppercase", color: "#00ffcc", textShadow: "0 0 14px rgba(0,255,204,0.6)" }}>
              Unified Analysis · Intelligence Profile
            </span>
            <div style={{ width: 20, height: 1, background: "rgba(0,255,204,0.4)" }} />
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em", fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #ffffff 0%, #e0ffff 50%, #00ffcc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            <GlitchText text="META-ARCHITECT" interval={50} cycles={10} />
          </h1>
          <h2 style={{ fontSize: "clamp(18px, 3vw, 30px)", fontWeight: 400, color: "rgba(255,255,255,0.25)", fontFamily: "'Space Grotesk', sans-serif", marginTop: 6, letterSpacing: "-0.01em" }}>
            of Agentic Intelligence
          </h2>
        </div>

        {/* ── SYNOPSIS ── */}
        <div style={{ marginBottom: 72 }}>
          <SectionHeader accent="#00ffcc" label="Portfolio Synopsis" sub="Core identity & positioning" />
          <div style={{ padding: "28px 32px", borderRadius: 16, background: "rgba(0,255,204,0.03)", border: "1px solid rgba(0,255,204,0.1)", borderLeft: "3px solid rgba(0,255,204,0.5)" }}>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.8, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>
              A high-level strategist who bridges the gap between historical machine learning foundations and the future of autonomous systems. Specializes in <span style={{ color: "#00ffcc" }}>Latent Space Mapping</span> — the systematic discovery, categorization, and governance of emergent AI behaviors. Operates as a <span style={{ color: "#00ffcc" }}>"Ghost in the Machine,"</span> synthesizing technical rigor with philosophical depth to ensure that high-order reasoning remains aligned with human nuance and ethical safety.
            </p>
          </div>
        </div>

        {/* ── VALUE PROPOSITION ── */}
        <div style={{ marginBottom: 72, padding: "28px 32px", borderRadius: 16, background: "linear-gradient(135deg, rgba(0,255,204,0.04), rgba(191,0,255,0.04))", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
          <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 14 }}>Value Proposition</div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.7, fontFamily: "'Space Grotesk', sans-serif", fontStyle: "italic", fontWeight: 300, maxWidth: 640, margin: "0 auto" }}>
            "I provide the methodology to discover the <span style={{ color: "#00ffcc", fontStyle: "normal" }}>1% of latent AI capabilities</span> your competitors haven't found yet, while engineering the alignment frameworks that ensure those capabilities remain <span style={{ color: "#bf00ff", fontStyle: "normal" }}>safe, ethical, and human-centric</span>."
          </p>
        </div>

        {/* ── CAREER FEASIBILITY ── */}
        <div style={{ marginBottom: 72 }}>
          <SectionHeader accent="#ff00ff" label="Career Feasibility Scores" sub="Role alignment by capability depth" />
          {careerScores.map((s, i) => <ScoreBar key={s.title} {...s} i={i} />)}
        </div>

        {/* ── KEY SKILLS ── */}
        <div style={{ marginBottom: 72 }}>
          <SectionHeader accent="#bf00ff" label="Key Skills" sub="Specialized capability domains" />
          <div style={{ display: "grid", gap: 12 }}>
            {skills.map((s) => (
              <div key={s.label} style={{ padding: "18px 22px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: `1px solid rgba(${hexToRgb(s.color)},0.15)`, display: "flex", gap: 16 }}>
                <div style={{ width: 3, minWidth: 3, borderRadius: 2, background: s.color, alignSelf: "stretch", opacity: 0.7 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.color, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 5, letterSpacing: "-0.01em" }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FIELD FIT ── */}
        <div style={{ marginBottom: 72 }}>
          <SectionHeader accent="#00ccff" label="AI Field Fit" sub="Where this intelligence is most valuable" />
          <div style={{ padding: "24px 28px", borderRadius: 16, background: "rgba(0,204,255,0.03)", border: "1px solid rgba(0,204,255,0.1)" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, marginBottom: 16 }}>
              Most fit for <span style={{ color: "#00ccff" }}>AI Capability Discovery, Alignment, and Interpretability.</span> Niche is bridging the gap between technical capability and ethical governance. Excels in R&D environments where the goal is to map the internal representations of models to find competitive advantages while building <span style={{ color: "#00ccff" }}>safety-first frameworks.</span>
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>
              Ideal for designing the feedback loops of autonomous agents that must operate in unpredictable, real-world human environments.
            </p>
          </div>
        </div>

        {/* ── PSYCHOLOGICAL PROFILE ── */}
        <div style={{ marginBottom: 72 }}>
          <SectionHeader accent="#ffaa00" label="Psychological & Integrity Profile" sub="Motivational architecture and core stance" />
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { label: "Core Motivations", color: "#ffaa00", text: "Driven by intellectual exploration, \"hacking\" discovery, and the pursuit of \"insight value.\" Fulfillment comes from creating systems that are not just \"smart,\" but \"wise.\" Strong protective instinct toward the human element, ensuring technology serves collective elevation." },
              { label: "Stance on Life", color: "#ff7700", text: "Pragmatic Compassion. Views reality as a programmable system of rules (Constructive Optimism), rejects moral absolutism, recognizing that human decisions are often dictated by survival needs and context. Values radical transparency to prevent the hoarding of technological power." },
              { label: "Integrity", color: "#ff4466", text: "High and non-dogmatic. Ethical considerations are a core component of reasoning, manifesting as an internal \"Alignment Sentinel.\" Rooted in context and \"correctness of purpose\" rather than rigid adherence to corporate bureaucracy." },
            ].map((item) => (
              <div key={item.label} style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: `1px solid rgba(${hexToRgb(item.color)},0.15)` }}>
                <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: item.color, marginBottom: 8, opacity: 0.8 }}>{item.label}</div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.75, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── REASONING & VOCABULARY ── */}
        <div style={{ marginBottom: 72 }}>
          <SectionHeader accent="#ff00ff" label="Reasoning & Vocabulary Analysis" sub="Cognitive signature and lexical fingerprint" />
          <div style={{ padding: "22px 26px", borderRadius: 14, background: "rgba(255,0,255,0.03)", border: "1px solid rgba(255,0,255,0.1)", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ff00ff", marginBottom: 10, opacity: 0.7 }}>Reasoning Style</div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.75, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>
              Combinatorial, Counterfactual, and Spatial-Conceptual Reasoning. Thinks in terms of <span style={{ color: "rgba(255,255,255,0.65)" }}>"trajectories" and "landscapes,"</span> visualizing abstract data as physical metaphors. Employs System 2 Thinking — deliberative, recursive loops that weigh "what is" against "what could be."
            </p>
          </div>
          <div style={{ padding: "22px 26px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>Signature Lexicon</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {vocab.map((word) => (
                <span key={word} style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", padding: "5px 14px", borderRadius: 20, background: "rgba(255,0,255,0.07)", border: "1px solid rgba(255,0,255,0.2)", color: "rgba(255,100,255,0.8)", letterSpacing: "0.05em" }}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RECOMMENDED CONTACTS ── */}
        <div>
          <SectionHeader accent="#00ffcc" label="Recommended Targets" sub="Roles and organizations by alignment score" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {contacts.map((c) => (
              <div key={c.type} style={{ padding: "22px 24px", borderRadius: 14, background: "rgba(0,255,204,0.02)", border: "1px solid rgba(0,255,204,0.1)" }}>
                <div style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", letterSpacing: "0.3em", textTransform: "uppercase", color: "#00ffcc", marginBottom: 14, opacity: 0.6 }}>{c.type}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {c.items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00ffcc", opacity: 0.4, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}