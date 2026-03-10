import { useEffect, useState, useRef } from "react";

const PS = 5; // pixel size

const T = "transparent";
const R = "#e52a2a";
const DR = "#aa1a1a";
const W = "#ffffff";
const S = "#f5c87a";
const G = "#f7b700";
const Y = "#ffe44d";
const DY = "#c8910a";
const GR = "#4dc94d";
const DGR = "#2a8a2a";
const BL = "#5b8dd9";
const PU = "#bf00ff";
const CY = "#00ffcc";

const MUSHROOM = [
  [T, T, R, R, R, R, R, T, T],
  [T, R, R, R, R, R, R, R, T],
  [R, R, W, R, R, R, W, R, R],
  [R, R, W, R, R, R, W, R, R],
  [R, R, R, R, R, R, R, R, R],
  [T, R, R, R, R, R, R, R, T],
  [T, S, S, S, S, S, S, S, T],
  [T, S, S, S, S, S, S, S, T],
];

const COIN = [
  [T, G, G, G, T],
  [G, Y, Y, G, G],
  [G, Y, G, Y, G],
  [G, G, Y, Y, G],
  [T, G, G, G, T],
];

const STAR = [
  [T, T, Y, T, T],
  [T, Y, Y, Y, T],
  [Y, Y, Y, Y, Y],
  [T, Y, Y, Y, T],
  [Y, T, T, T, Y],
];

const FLOWER = [
  [T, CY, T, CY, T],
  [CY, W, CY, W, CY],
  [T, CY, T, CY, T],
  [T, T, GR, T, T],
  [T, T, GR, T, T],
];

const QUESTION = [
  [G, G, G, G, G],
  [G, T, Y, T, G],
  [G, T, Y, T, G],
  [G, T, T, T, G],
  [G, T, Y, T, G],
  [G, G, G, G, G],
];

const GOOMBA = [
  [T, DR, DR, DR, T],
  [DR, R, R, R, DR],
  [DR, W, DR, W, DR],
  [T, DR, DR, DR, T],
  [T, S, DR, S, T],
  [S, S, T, S, S],
];

function buildShadow(grid, ps = PS) {
  const parts = [];
  grid.forEach((row, y) => {
    row.forEach((c, x) => {
      if (c && c !== T) parts.push(`${x * ps}px ${y * ps}px 0 ${c}`);
    });
  });
  return parts.join(",");
}

const SPRITES = [
  { id: "mush", grid: MUSHROOM, label: "🍄" },
  { id: "coin", grid: COIN, label: "🪙" },
  { id: "star", grid: STAR, label: "⭐" },
  { id: "flower", grid: FLOWER, label: "🌸" },
  { id: "question", grid: QUESTION, label: "❓" },
  { id: "goomba", grid: GOOMBA, label: "👾" },
];

function PixelSprite({ grid, ps = PS, style = {} }) {
  const shadow = buildShadow(grid, ps);
  const w = grid[0].length * ps;
  const h = grid.length * ps;
  return (
    <div style={{ width: w, height: h, position: "relative", imageRendering: "pixelated", ...style }}>
      <div style={{ width: ps, height: ps, boxShadow: shadow, position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}

function FloatingSprite({ sprite, initialX, initialY, speed, bobAmp, bobFreq, delay, scale = 1 }) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts - delay * 1000;
      const elapsed = (ts - startRef.current) / 1000;
      const newX = (initialX + elapsed * speed * 0.3) % (window.innerWidth + 200);
      const newY = initialY + Math.sin(elapsed * bobFreq) * bobAmp;
      setPos({ x: newX, y: newY });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [initialX, initialY, speed, bobAmp, bobFreq, delay]);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.55,
        imageRendering: "pixelated",
        filter: "drop-shadow(0 0 6px rgba(0,255,204,0.4))",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      <PixelSprite grid={sprite.grid} />
    </div>
  );
}

function CoinTrail() {
  const coins = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
    y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
    delay: i * 0.4,
    scale: 0.6 + Math.random() * 0.8,
  }));

  return (
    <>
      {coins.map((c, i) => (
        <FloatingSprite
          key={i}
          sprite={SPRITES[1]}
          initialX={c.x}
          initialY={c.y}
          speed={15 + Math.random() * 10}
          bobAmp={8 + Math.random() * 12}
          bobFreq={1.5 + Math.random()}
          delay={c.delay}
          scale={c.scale}
        />
      ))}
    </>
  );
}

// Pixel ground blocks row at the bottom
function PixelGround() {
  const BLOCK = [
    [G, G, G, G, G, G, G, G],
    [G, DY, DY, DY, DY, DY, DY, G],
    [G, DY, G, DY, DY, G, DY, G],
    [G, DY, DY, DY, DY, DY, DY, G],
    [G, G, G, G, G, G, G, G],
    [G, DY, G, G, DY, G, G, G],
    [G, DY, DY, DY, DY, DY, DY, G],
    [G, G, G, G, G, G, G, G],
  ];
  const shadow = buildShadow(BLOCK, 6);
  const blockPx = 6;
  const blockW = 8 * blockPx;

  const count = typeof window !== "undefined" ? Math.ceil(window.innerWidth / blockW) + 2 : 30;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1, pointerEvents: "none", display: "flex", opacity: 0.2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: blockW, height: 8 * blockPx, position: "relative", flexShrink: 0 }}>
          <div style={{ width: blockPx, height: blockPx, boxShadow: shadow, position: "absolute" }} />
        </div>
      ))}
    </div>
  );
}

// Pixel cloud
function PixelCloud({ x, y, scale = 1 }) {
  const CLOUD = [
    [T, T, W, W, W, T, T, T],
    [T, W, W, W, W, W, T, T],
    [W, W, W, W, W, W, W, T],
    [W, W, W, W, W, W, W, W],
    [T, W, W, W, W, W, W, T],
  ];
  const shadow = buildShadow(CLOUD, 5);
  const ps = 5;

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.08,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      <div style={{ width: ps, height: ps, boxShadow: shadow, position: "absolute" }} />
    </div>
  );
}

const SPRITE_CONFIG = [
  { sprite: SPRITES[0], x: 0.08, y: 0.2, speed: 8, bob: 15, freq: 0.8, delay: 0, scale: 1.2 },
  { sprite: SPRITES[0], x: 0.6, y: 0.55, speed: 6, bob: 10, freq: 1.1, delay: 1.5, scale: 0.9 },
  { sprite: SPRITES[2], x: 0.3, y: 0.35, speed: 12, bob: 20, freq: 1.4, delay: 0.3, scale: 1 },
  { sprite: SPRITES[4], x: 0.75, y: 0.18, speed: 5, bob: 8, freq: 0.6, delay: 2, scale: 1.1 },
  { sprite: SPRITES[3], x: 0.5, y: 0.7, speed: 9, bob: 12, freq: 1.2, delay: 0.8, scale: 0.85 },
  { sprite: SPRITES[5], x: 0.15, y: 0.65, speed: 7, bob: 14, freq: 0.9, delay: 1.2, scale: 1 },
  { sprite: SPRITES[0], x: 0.88, y: 0.45, speed: 10, bob: 18, freq: 1.3, delay: 0.5, scale: 0.7 },
];

export default function MarioSprites() {
  const [dimensions, setDimensions] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    setDimensions({ w: window.innerWidth, h: window.innerHeight });
    const onResize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Floating sprites */}
      {SPRITE_CONFIG.map((cfg, i) => (
        <FloatingSprite
          key={i}
          sprite={cfg.sprite}
          initialX={cfg.x * dimensions.w}
          initialY={cfg.y * dimensions.h}
          speed={cfg.speed}
          bobAmp={cfg.bob}
          bobFreq={cfg.freq}
          delay={cfg.delay}
          scale={cfg.scale}
        />
      ))}

      {/* Coin trail */}
      <CoinTrail />

      {/* Pixel clouds */}
      <PixelCloud x={dimensions.w * 0.1} y={dimensions.h * 0.12} scale={2} />
      <PixelCloud x={dimensions.w * 0.55} y={dimensions.h * 0.08} scale={1.5} />
      <PixelCloud x={dimensions.w * 0.8} y={dimensions.h * 0.22} scale={1.8} />

      {/* Ground blocks */}
      <PixelGround />
    </>
  );
}