import { useState } from "react";
import { ExternalLink, Star, Volume2, Loader2, StopCircle, ArrowUpRight } from "lucide-react";
import OracleSummaryPanel from "@/components/OracleSummaryPanel";

const categoryColors = {
  writing: "#00ffcc",
  research: "#bf00ff",
  notation: "#ff00ff",
  design: "#00ccff",
  other: "#ffff00",
};

const categoryGradients = {
  writing: "linear-gradient(135deg, rgba(0,255,204,0.08) 0%, transparent 70%)",
  research: "linear-gradient(135deg, rgba(191,0,255,0.08) 0%, transparent 70%)",
  notation: "linear-gradient(135deg, rgba(255,0,255,0.08) 0%, transparent 70%)",
  design: "linear-gradient(135deg, rgba(0,204,255,0.08) 0%, transparent 70%)",
  other: "linear-gradient(135deg, rgba(255,255,0,0.08) 0%, transparent 70%)",
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function WorkCard({ work, onFocus, focused, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [listenState, setListenState] = useState("idle");
  const color = categoryColors[work.category] || "#ffffff";
  const isActive = focused || hovered;

  const handleListen = async (e) => {
    e.stopPropagation();
    if (listenState === "playing") {
      window.speechSynthesis.cancel();
      setListenState("idle");
      if (onFocus) onFocus(null);
      return;
    }
    setListenState("loading");
    if (onFocus) onFocus(work.id);
    try {
      const { InvokeLLM } = (await import("@/api/base44Client")).base44.integrations.Core;
      const text = await InvokeLLM({
        prompt: `Write a short, engaging 2-3 sentence audio summary of this work for a portfolio visitor. Be compelling and specific. Title: "${work.title}". Category: ${work.category}. Description: "${work.description || "No description provided."}". Tags: ${(work.tags || []).join(", ") || "none"}. Do NOT use markdown or special characters.`,
      });
      const utterance = new SpeechSynthesisUtterance(text);
      const pickVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferred = ["Samantha", "Karen", "Moira", "Daniel", "Google UK English Female", "Google US English"];
        for (const name of preferred) {
          const v = voices.find(v => v.name.includes(name));
          if (v) return v;
        }
        return voices.find(v => v.lang.startsWith("en")) || voices[0];
      };
      const setVoice = () => { utterance.voice = pickVoice(); };
      if (window.speechSynthesis.getVoices().length) setVoice();
      else window.speechSynthesis.addEventListener("voiceschanged", setVoice, { once: true });
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.onstart = () => setListenState("playing");
      utterance.onend = () => { setListenState("idle"); if (onFocus) onFocus(null); };
      utterance.onerror = () => { setListenState("idle"); if (onFocus) onFocus(null); };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      setListenState("idle");
      if (onFocus) onFocus(null);
    }
  };

  return (
    <div
      className="relative rounded-2xl cursor-pointer overflow-hidden group"
      style={{
        background: isActive
          ? `linear-gradient(145deg, rgba(${hexToRgb(color)},0.1) 0%, rgba(0,0,15,0.97) 100%)`
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? `rgba(${hexToRgb(color)},0.5)` : "rgba(255,255,255,0.06)"}`,
        boxShadow: focused
          ? `0 0 80px rgba(${hexToRgb(color)},0.2), 0 0 160px rgba(${hexToRgb(color)},0.06), inset 0 1px 0 rgba(${hexToRgb(color)},0.15)`
          : hovered
          ? `0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(${hexToRgb(color)},0.1), inset 0 1px 0 rgba(${hexToRgb(color)},0.08)`
          : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
        transform: focused ? "scale(1.02) translateY(-4px)" : hovered ? "translateY(-6px)" : "none",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        zIndex: focused ? 20 : "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color}${isActive ? "cc" : "33"}, transparent)`,
          transition: "all 0.4s ease",
        }}
      />

      {/* Index number — top left */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 18,
          fontSize: 10,
          fontFamily: "'Space Mono', monospace",
          color: `rgba(${hexToRgb(color)},0.3)`,
          letterSpacing: "0.15em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Score — top right */}
      {work.value_score && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 8px",
            borderRadius: 20,
            background: `rgba(${hexToRgb(color)},0.1)`,
            border: `1px solid rgba(${hexToRgb(color)},0.25)`,
            color,
            fontSize: 10,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          <Star className="w-2.5 h-2.5" />
          {work.value_score}
        </div>
      )}

      <div style={{ padding: "20px 20px 20px 20px", paddingTop: 36 }}>
        {/* Category badge */}
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontSize: 9,
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color,
              opacity: 0.7,
            }}
          >
            {work.category}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            color: "#fff",
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1.35,
            marginBottom: 10,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {work.title}
        </h3>

        {/* Description */}
        {work.description && (
          <p
            style={{
              color: "rgba(255,255,255,0.42)",
              fontSize: 13,
              lineHeight: 1.65,
              marginBottom: 14,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {work.description}
          </p>
        )}

        {/* Tags */}
        {work.tags && work.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
            {work.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: 10,
                  fontFamily: "'Space Mono', monospace",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  letterSpacing: "0.05em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={handleListen}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              border: `1px solid ${listenState === "playing" ? "#ff4466" : `rgba(${hexToRgb(color)},0.3)`}`,
              color: listenState === "playing" ? "#ff4466" : `rgba(${hexToRgb(color)},0.8)`,
              background: listenState === "playing" ? "rgba(255,68,102,0.08)" : `rgba(${hexToRgb(color)},0.06)`,
              cursor: "pointer",
              fontSize: 10,
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}
          >
            {listenState === "loading" ? <Loader2 className="w-3 h-3 animate-spin" /> :
             listenState === "playing" ? <StopCircle className="w-3 h-3" /> :
             <Volume2 className="w-3 h-3" />}
            {listenState === "loading" ? "Loading…" : listenState === "playing" ? "Stop" : "Listen"}
          </button>

          {work.link && (
            <a
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color,
                fontSize: 10,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.3s ease",
                textDecoration: "none",
              }}
            >
              View <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Oracle */}
      {work.category === "research" && <OracleSummaryPanel work={work} />}

      {/* Radial glow on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          background: isActive
            ? `radial-gradient(circle at 30% 0%, rgba(${hexToRgb(color)},0.08) 0%, transparent 60%)`
            : "none",
          transition: "all 0.4s ease",
        }}
      />
    </div>
  );
}