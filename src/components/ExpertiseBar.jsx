import { useEffect, useState } from "react";

export default function ExpertiseBar({ name, score, color = "#00ffff", delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div className="mb-5">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-mono tracking-widest uppercase" style={{ color }}>
          {name}
        </span>
        <span className="text-sm font-mono" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div
          className="h-1.5 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}