"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const HEADER_H = 70;

// Passe das hier an, falls dein Naming minimal anders ist
const FRAME_COUNT = 242;
const FRAME_PREFIX = "/kriminalwelt/frames/Halle_Roofslide1_";
const FRAME_SUFFIX = ".jpg";

// 000001 … 000242
function frameSrc(i: number) {
  const n = String(i).padStart(6, "0");
  return `${FRAME_PREFIX}${n}${FRAME_SUFFIX}`;
}

export default function HomePage() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState(1);

  // Optional: etwas Preload (macht’s smoother)
  const preloadList = useMemo(() => {
    // preload z.B. die ersten 12 Frames
    return Array.from({ length: Math.min(12, FRAME_COUNT) }, (_, idx) => frameSrc(idx + 1));
  }, []);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (!scrollAreaRef.current) return;

      // Scrollbereich Position/Progress berechnen
      const rect = scrollAreaRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Startpunkt: wenn obere Kante oben im Viewport ist
      // Endpunkt: wenn untere Kante unten raus ist
      const totalScrollable = rect.height - viewportH;
      if (totalScrollable <= 0) return;

      // Wie weit sind wir in den Scrollbereich rein?
      // rect.top ist negativ, wenn wir reingescrollt sind
      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = scrolled / totalScrollable; // 0..1

      const nextFrame = 1 + Math.round(progress * (FRAME_COUNT - 1));
      setFrame(nextFrame);
    };

    const onScrollRaf = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", onScrollRaf, { passive: true });
    // initial berechnen
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScrollRaf);
      cancelAnimationFrame(raf);
    };
  }, []);

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
        {/* Logo: lege KW_Logo.svg in /public und nutze es hier */}
        <img
          src="/KW_Logo.svg"
          alt="KRIMINALWELT"
          style={{
            height: 26,
            width: "auto",
            display: "block",
          }}
        />
      </header>

      {/* Scrollstrecke / Frames */}
      <div
        ref={scrollAreaRef}
        style={{
          // Je größer, desto langsamer läuft die Sequenz.
          // 242 Frames -> z.B. 242 * 10px = 2420px Scrollfläche
          // Ich nehme lieber etwas "cineastischer": 242 * 18px = 4356px
          height: `${FRAME_COUNT * 18}px`,
          position: "relative",
          background: "black",
        }}
      >
        {/* Das Bild selbst bleibt sticky unter dem Header */}
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
            src={frameSrc(frame)}
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

      {/* Danach: einfach Schwarz zum “weiter scrollen” */}
      <section style={{ height: "140vh", background: "black" }} />

      {/* Optional Preload */}
      <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        {preloadList.map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>
    </div>
  );
}