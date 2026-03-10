import { useState } from "react";
import { ExternalLink, Star, Volume2, Loader2, StopCircle } from "lucide-react";

const categoryColors = {
  writing: "#00ffcc",
  research: "#bf00ff",
  notation: "#ff00ff",
  design: "#00ccff",
  other: "#ffff00",
};

export default function WorkCard({ work, onFocus, focused }) {
  const [hovered, setHovered] = useState(false);
  const [listenState, setListenState] = useState("idle"); // idle | loading | playing
  const color = categoryColors[work.category] || "#ffffff";

  const handleListen = async (e) => {
    e.stopPropagation();

    // Stop if already playing
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
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.onstart = () => setListenState("playing");
      utterance.onend = () => {
        setListenState("idle");
        if (onFocus) onFocus(null);
      };
      utterance.onerror = () => {
        setListenState("idle");
        if (onFocus) onFocus(null);
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      setListenState("idle");
      if (onFocus) onFocus(null);
    }
  };

  return (
    <div
      className="relative rounded-xl p-5 cursor-pointer transition-all duration-500 overflow-hidden"
      style={{
        background: focused || hovered
          ? `linear-gradient(135deg, rgba(${hexToRgb(color)},0.16) 0%, rgba(0,0,20,0.95) 100%)`
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? color : hovered ? color : "rgba(255,255,255,0.08)"}`,
        boxShadow: focused
          ? `0 0 60px ${color}55, 0 0 4px ${color}, 0 0 120px ${color}22`
          : hovered ? `0 0 30px ${color}33, 0 0 2px ${color}` : "none",
        transform: focused ? "scale(1.03)" : hovered ? "translateY(-4px) scale(1.01)" : "none",
        zIndex: focused ? 20 : "auto",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Score badge */}
      {work.value_score && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono"
          style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
        >
          <Star className="w-3 h-3" />
          {work.value_score}
        </div>
      )}

      <div className="mb-2">
        <span
          className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded"
          style={{ background: `${color}22`, color }}
        >
          {work.category}
        </span>
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 leading-snug">{work.title}</h3>

      {work.description && (
        <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{work.description}</p>
      )}

      {work.tags && work.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {work.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {work.link && (
        <a
          href={work.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs font-mono transition-opacity"
          style={{ color, opacity: hovered ? 1 : 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          VIEW <ExternalLink className="w-3 h-3" />
        </a>
      )}

      {/* Glow border sweep */}
      {hovered && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${color}15 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}