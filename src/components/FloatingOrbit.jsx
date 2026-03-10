import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FloatingOrbit({ items }) {
  const containerRef = useRef(null);
  const physicsRef = useRef([]);
  const dragRef = useRef(null);
  const rafRef = useRef(null);
  const posCache = useRef({});
  const [tick, setTick] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const container = containerRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;
    const cx = W / 2;
    const cy = H / 2;

    physicsRef.current = items.map((item, i) => {
      const angle = (i / items.length) * Math.PI * 2 + 0.3;
      const radius = 110 + (i % 3) * 90 + Math.random() * 50;
      return {
        id: item.id,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: Math.sin(angle) * 0.9,
        vy: -Math.cos(angle) * 0.9,
        targetRadius: radius,
      };
    });

    let frame = 0;
    const animate = () => {
      frame++;
      const W = container.clientWidth;
      const H = container.clientHeight;
      const cx = W / 2;
      const cy = H / 2;

      physicsRef.current.forEach((p) => {
        if (dragRef.current?.id === p.id) return;

        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        // Spring toward orbit radius
        const err = dist - p.targetRadius;
        const radAx = (dx / dist) * err * 0.0025;
        const radAy = (dy / dist) * err * 0.0025;

        // Orbital tangential nudge
        const tanAx = (-dy / dist) * 0.007;
        const tanAy = (dx / dist) * 0.007;

        p.vx = (p.vx + radAx + tanAx) * 0.983;
        p.vy = (p.vy + radAy + tanAy) * 0.983;
        p.x += p.vx;
        p.y += p.vy;

        posCache.current[p.id] = { x: p.x, y: p.y };
      });

      if (frame % 2 === 0) setTick((n) => n + 1);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handlePointerDown = useCallback((e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current.getBoundingClientRect();

    dragRef.current = {
      id: item.id,
      startX: clientX,
      startY: clientY,
      startTime: Date.now(),
      lastX: clientX,
      lastY: clientY,
      lastVx: 0,
      lastVy: 0,
    };

    const onMove = (ev) => {
      const mx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const my = ev.touches ? ev.touches[0].clientY : ev.clientY;
      if (!dragRef.current) return;
      dragRef.current.lastVx = mx - dragRef.current.lastX;
      dragRef.current.lastVy = my - dragRef.current.lastY;
      dragRef.current.lastX = mx;
      dragRef.current.lastY = my;

      const phys = physicsRef.current.find((p) => p.id === item.id);
      if (phys) {
        phys.x = mx - rect.left;
        phys.y = my - rect.top;
        posCache.current[item.id] = { x: phys.x, y: phys.y };
      }
    };

    const onUp = (ev) => {
      if (!dragRef.current) return;
      const ex = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
      const ey = ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;
      const moveDist = Math.sqrt(
        Math.pow(ex - dragRef.current.startX, 2) + Math.pow(ey - dragRef.current.startY, 2)
      );
      const elapsed = Date.now() - dragRef.current.startTime;

      const phys = physicsRef.current.find((p) => p.id === item.id);
      if (phys) {
        phys.vx = dragRef.current.lastVx * 0.85;
        phys.vy = dragRef.current.lastVy * 0.85;
      }

      if (moveDist < 8 && elapsed < 280 && item.href) {
        navigate(createPageUrl(item.href));
      }

      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  }, [navigate]);

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 10 }}>
      {items.map((item) => {
        const pos = posCache.current[item.id] || { x: -9999, y: -9999 };
        return (
          <div
            key={item.id}
            className="absolute select-none"
            style={{
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              cursor: item.href ? "grab" : "default",
              willChange: "left, top",
            }}
            onMouseDown={(e) => handlePointerDown(e, item)}
            onTouchStart={(e) => handlePointerDown(e, item)}
          >
            {item.render()}
          </div>
        );
      })}
    </div>
  );
}