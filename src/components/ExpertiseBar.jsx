import { useEffect, useState, useRef } from "react";

export default function ExpertiseBar({ name, score, color = "#00ffff", delay = 0 }) {
  const [width, setWidth] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setWidth(score);
      // Animate counter
      const duration = 1200;
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.round(eased * score));
        if (progress < 1) animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(t);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [score, delay]);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span
          style={{
            fontSize: 12,
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {name}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span
            style={{
              fontSize: 22,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              color,
              lineHeight: 1,
              textShadow: `0 0 20px ${color}66`,
              transition: "all 0.1s ease",
            }}
          >
            {displayScore}
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>/100</span>
        </div>
      </div>

      {/* Track */}
      <div
        style={{
          height: 2,
          width: "100%",
          borderRadius: 2,
          background: "rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}44, ${color})`,
            boxShadow: `0 0 12px ${color}88, 0 0 4px ${color}`,
            transition: `width 1.2s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
            position: "relative",
          }}
        >
          {/* Leading dot */}
          <div
            style={{
              position: "absolute",
              right: -3,
              top: "50%",
              transform: "translateY(-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}88`,
            }}
          />
        </div>
      </div>
    </div>
  );
}