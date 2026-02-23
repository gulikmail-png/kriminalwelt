"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const HEADER_H = 70;

// Frames
const FRAME_COUNT = 242;
const FRAME_PREFIX = "/kriminalwelt/frames/Halle_Roofslide1_";
const FRAME_SUFFIX = ".jpg";

function frameSrc(i: number) {
  const n = String(i).padStart(6, "0");
  return `${FRAME_PREFIX}${n}${FRAME_SUFFIX}`;
}

export default function HomePage() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [frame, setFrame] = useState(1);
  const targetFrameRef = useRef(1);
  const lastSetRef = useRef(1);

  // ---- Tuning ----
  const SCROLL_PX_PER_FRAME = 18; // wie gestern
  const INITIAL_PRELOAD = 36; // direkt am Anfang (schneller Start)
  const WINDOW_BEHIND = 10; // beim Scrollen nachladen: x Frames hinter current
  const WINDOW_AHEAD = 28; // ... und x Frames voraus
  const MAX_INFLIGHT = 8; // nicht zu viele parallele Downloads
  // ----------------

  // Track already-loaded frames
  const loadedRef = useRef<Set<number>>(new Set());
  const inflightRef = useRef<number>(0);

  const preloadFrame = (i: number) => {
    if (i < 1 || i > FRAME_COUNT) return;
    if (loadedRef.current.has(i)) return;
    if (inflightRef.current >= MAX_INFLIGHT) return;

    inflightRef.current += 1;

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = frameSrc(i);

    img.onload = () => {
      loadedRef.current.add(i);
      inflightRef.current = Math.max(0, inflightRef.current - 1);
    };
    img.onerror = () => {
      inflightRef.current = Math.max(0, inflightRef.current - 1);
    };
  };

  const preloadRange = (from: number, to: number) => {
    const start = Math.max(1, from);
    const end = Math.min(FRAME_COUNT, to);
    for (let i = start; i <= end; i++) preloadFrame(i);
  };

  // 1) Initial preload batch (Frames 1..INITIAL_PRELOAD)
  useEffect(() => {
    preloadRange(1, INITIAL_PRELOAD);
  }, []);

  // 2) While scrolling: preload around current frame
  useEffect(() => {
    preloadRange(frame - WINDOW_BEHIND, frame + WINDOW_AHEAD);
  }, [frame]);

  // Scroll -> compute targetFrame
  useEffect(() => {
    let raf = 0;

    const compute = () => {
      const el = scrollAreaRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      const totalScrollable = rect.height - viewportH;
      if (totalScrollable <= 0) return;

      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = scrolled / totalScrollable; // 0..1

      const idx = 1 + Math.round(progress * (FRAME_COUNT - 1));
      targetFrameRef.current = idx;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Smooth update loop (prevents “jumping” and reduces ruckel)
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const target = targetFrameRef.current;
      const current = lastSetRef.current;

      // if already there, continue looping anyway (cheap)
      if (target === current) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // step size: 1–3 frames per tick (keeps smooth, avoids big jumps)
      const diff = target - current;
      const step = Math.max(-3, Math.min(3, diff));
      const next = current + step;

      // If the next frame isn't loaded yet, try to preload forward quickly
      if (!loadedRef.current.has(next)) {
        preloadRange(next, next + 8);
        // Still move, but at least we push cache; avoid jumping too far
      }

      lastSetRef.current = next;
      setFrame(next);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentSrc = useMemo(() => frameSrc(frame), [frame]);

  return (
    <div style={{ background: "black", minHeight: "100vh" }}>
      {/* Sticky Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          height: HEADER_H,
          zIndex: 9999,
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <img
          src="/KW_Logo.svg"
          alt="KRIMINALWELT"
          style={{ height: 26, width: "auto", display: "block" }}
        />
      </header>

      {/* Scroll area */}
      <div
        ref={scrollAreaRef}
        style={{
          height: `${FRAME_COUNT * SCROLL_PX_PER_FRAME}px`,
          position: "relative",
          background: "black",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: HEADER_H,
            height: `calc(100vh - ${HEADER_H}px)`,
            overflow: "hidden",
            background: "black",
          }}
        >
          <img
            src={currentSrc}
            alt={`Frame ${frame}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* black tail */}
      <section style={{ height: "140vh", background: "black" }} />
    </div>
  );
}