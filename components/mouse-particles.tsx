"use client";

import { useEffect, useRef } from "react";

import type { Market } from "@/components/market-provider";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  kind: "dot" | "leaf" | "trail" | "dust";
  rotation: number;
  spin: number;
};

const palettes: Record<
  Market,
  {
    halo: [string, string];
    dot: string;
    shadow: string;
    line: string;
  }
> = {
  china: {
    halo: ["rgba(168, 32, 26, 0.075)", "rgba(234, 179, 8, 0.032)"],
    dot: "rgba(234, 179, 8, ALPHA)",
    shadow: "rgba(168, 32, 26, 0.78)",
    line: "rgba(234, 179, 8, ALPHA)",
  },
  usa: {
    halo: ["rgba(96, 165, 250, 0.08)", "rgba(168, 85, 247, 0.035)"],
    dot: "rgba(96, 165, 250, ALPHA)",
    shadow: "rgba(59, 130, 246, 0.8)",
    line: "rgba(192, 132, 252, ALPHA)",
  },
  europe: {
    halo: ["rgba(245, 158, 11, 0.075)", "rgba(16, 185, 129, 0.035)"],
    dot: "rgba(251, 191, 36, ALPHA)",
    shadow: "rgba(245, 158, 11, 0.76)",
    line: "rgba(52, 211, 153, ALPHA)",
  },
};

function getMarket(): Market {
  const market = document.documentElement.dataset.market;

  if (market === "china" || market === "usa" || market === "europe") {
    return market;
  }

  return "usa";
}

export function MouseParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastSpawn = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let market = getMarket();
    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, count = 2) => {
      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = market === "usa" ? 0.9 + Math.random() * 1.5 : 0.18 + Math.random() * 0.9;
        const kind =
          market === "china"
            ? Math.random() > 0.72
              ? "leaf"
              : "dot"
            : market === "usa"
                ? "trail"
                : Math.random() > 0.38
                  ? "dust"
                  : "dot";

        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: market === "usa" ? speed : Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.12,
          life: 0,
          maxLife: market === "usa" ? 24 + Math.random() * 18 : 38 + Math.random() * 28,
          size: 0.55 + Math.random() * (kind === "trail" ? 0.9 : 1.25),
          kind,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.045,
        });
      }

      if (particles.length > 54) {
        particles.splice(0, particles.length - 54);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      const now = performance.now();
      if (now - lastSpawn > 48) {
        spawn(mouseX, mouseY, 1);
        lastSpawn = now;
      }
    };

    const animate = () => {
      market = getMarket();
      const palette = palettes[market];

      context.clearRect(0, 0, width, height);

      const halo = context.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120);
      halo.addColorStop(0, palette.halo[0]);
      halo.addColorStop(0.45, palette.halo[1]);
      halo.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = halo;
      context.fillRect(mouseX - 120, mouseY - 120, 240, 240);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.spin;
        particle.vx *= 0.985;
        particle.vy *= 0.985;

        const progress = particle.life / particle.maxLife;
        const alpha = Math.max(0, 1 - progress);

        if (alpha <= 0) {
          particles.splice(index, 1);
          continue;
        }

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = palette.dot.replace("ALPHA", String(alpha * 0.45));
        context.strokeStyle = palette.line.replace("ALPHA", String(alpha * 0.2));
        context.shadowBlur = 7;
        context.shadowColor = palette.shadow;

        if (particle.kind === "trail") {
          context.beginPath();
          context.moveTo(-particle.size * 10, 0);
          context.lineTo(particle.size * 6, 0);
          context.lineWidth = Math.max(1, particle.size);
          context.stroke();
        } else if (particle.kind === "leaf") {
          context.beginPath();
          context.moveTo(0, -particle.size * 3);
          context.quadraticCurveTo(particle.size * 2.5, 0, 0, particle.size * 3);
          context.quadraticCurveTo(-particle.size * 1.4, 0, 0, -particle.size * 3);
          context.fill();
        } else if (particle.kind === "dust") {
          context.beginPath();
          context.arc(0, 0, particle.size * 0.85, 0, Math.PI * 2);
          context.fill();
        } else {
          context.beginPath();
          context.arc(0, 0, particle.size, 0, Math.PI * 2);
          context.fill();
        }

        context.shadowBlur = 0;
        context.restore();

        for (let nextIndex = index - 1; nextIndex >= 0; nextIndex -= 1) {
          const next = particles[nextIndex];
          const distance = Math.hypot(particle.x - next.x, particle.y - next.y);

          if (distance < 82) {
            context.beginPath();
            context.strokeStyle = palette.line.replace("ALPHA", String(alpha * (1 - distance / 82) * 0.08));
            context.lineWidth = 1;
            context.moveTo(particle.x, particle.y);
            context.lineTo(next.x, next.y);
            context.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 opacity-80 mix-blend-screen"
    />
  );
}
