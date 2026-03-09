import { useEffect, useState } from "react";

const chars = "!@#$%^&*<>?/\\|~`ΨΩΦΣΔλπ∞≈≡∫∂∇";

export default function GlitchText({ text, className = "", interval = 60, cycles = 8 }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      if (count >= cycles) {
        setDisplay(text);
        clearInterval(id);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((c, i) =>
            Math.random() < 0.3 ? chars[Math.floor(Math.random() * chars.length)] : c
          )
          .join("")
      );
      count++;
    }, interval);
    return () => clearInterval(id);
  }, [text, interval, cycles]);

  return <span className={className}>{display}</span>;
}