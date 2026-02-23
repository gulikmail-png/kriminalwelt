"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const FRAME_COUNT = 242;
const FRAME_PREFIX = "/kriminalwelt/frames/Halle_Roofslide1_";
const FRAME_EXT = ".jpg";
const FRAME_PAD = 6;

const SCROLL_PX_PER_FRAME = 10;
const HEADER_H = 88;

// Preload wie viele Frames sofort
const PRELOAD_FIRST = 80;

function pad(num: number, size: number) {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}

function useRevealOnScroll() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        }
      },
      { threshold: 0.18 }
    );

    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);
}

export default function KriminalweltPage() {
  useRevealOnScroll();

  const frames = useMemo(() => {
    const arr: string[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      arr.push(`${FRAME_PREFIX}${pad(i, FRAME_PAD)}${FRAME_EXT}`);
    }
    return arr;
  }, []);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [viewportH, setViewportH] = useState<number>(0);
  const [pinScroll, setPinScroll] = useState<number>(0);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [visibleFrame, setVisibleFrame] = useState(1);

  const loadedRef = useRef<Set<number>>(new Set([1]));

  // Viewport / PinScroll berechnen
  useEffect(() => {
    const compute = () => {
      const vh = Math.max(1, window.innerHeight - HEADER_H);
      setViewportH(vh);
      setPinScroll((FRAME_COUNT - 1) * SCROLL_PX_PER_FRAME);
    };
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Preload Frames
  useEffect(() => {
    let cancelled = false;

    const preloadIndex = async (i: number) => {
      if (loadedRef.current.has(i)) return;
      const src = frames[i - 1];
      const img = new Image();
      img.src = src;

      try {
        // @ts-ignore
        if (img.decode) await img.decode();
      } catch {
        // ignore
      }

      if (!cancelled) loadedRef.current.add(i);
    };

    (async () => {
      const n = Math.min(PRELOAD_FIRST, FRAME_COUNT);
      for (let i = 1; i <= n; i++) preloadIndex(i);
    })();

    const t = window.setTimeout(() => {
      if (cancelled) return;
      for (let i = PRELOAD_FIRST + 1; i <= FRAME_COUNT; i++) preloadIndex(i);
    }, 800);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [frames]);

  // Scroll -> Frame
  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) return;

      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const wrapper = wrapperRef.current!;
        const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;

        const start = wrapperTop;
        const end = start + pinScroll;
        const y = window.scrollY;

        const progress = Math.max(0, Math.min(y - start, pinScroll));
        const idx = Math.round(progress / SCROLL_PX_PER_FRAME);
        const f = Math.max(1, Math.min(FRAME_COUNT, 1 + idx));

        setCurrentFrame(f);

        if (loadedRef.current.has(f)) {
          setVisibleFrame(f);
        } else {
          const src = frames[f - 1];
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loadedRef.current.add(f);
            setVisibleFrame((prev) => (prev === f ? prev : f));
          };
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [pinScroll, frames]);

  // Wrapper-Höhe
  const wrapperHeight = viewportH + pinScroll;

  // Fixed Viewport nur anzeigen, wenn Wrapper im Umfeld ist
  const showFixed =
    wrapperRef.current
      ? (() => {
          const rect = wrapperRef.current.getBoundingClientRect();
          return rect.bottom > HEADER_H && rect.top < window.innerHeight;
        })()
      : true;

  const src = frames[visibleFrame - 1];

  return (
    <div style={{ background: "black", minHeight: "100vh" }}>
      {/* Inline Styles für Reveal Animationen */}
      <style>{`
        .reveal-row {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 42px;
          align-items: start;
          padding: 80px 0;
          border-top: 1px solid rgba(255,255,255,0.10);
        }
        @media (max-width: 900px) {
          .reveal-row { grid-template-columns: 1fr; gap: 18px; padding: 56px 0; }
        }

        .reveal-left, .reveal-right {
          opacity: 0;
          filter: blur(6px);
          transform: translateX(0);
          transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
          will-change: opacity, transform, filter;
        }
        .reveal-left { transform: translateX(-28px); }
        .reveal-right { transform: translateX(28px); }

        .is-visible .reveal-left,
        .is-visible .reveal-right {
          opacity: 1;
          filter: blur(0);
          transform: translateX(0);
        }

        .chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .chip {
          font-size: 12px;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.92);
        }

        .footer-block {
          margin-top: 56px;
          border-top: 1px solid rgba(255,255,255,0.10);
          padding: 64px 0 120px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 42px;
        }
        @media (max-width: 900px) {
          .footer-block { grid-template-columns: 1fr; gap: 18px; }
        }
      `}</style>

      {/* FIXED HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_H,
          zIndex: 9999,
          background: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          boxSizing: "border-box",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div style={{ width: "100%" }}>
          <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}>
            Kriminalwelt – Prototype
          </div>
          <div style={{ opacity: 0.85, marginTop: 6, fontSize: 16 }}>
            Scroll down – Header fix, Bild gepinnt, Frames scrubben. (Frame{" "}
            {visibleFrame}/{FRAME_COUNT})
          </div>
        </div>
      </header>

      {/* Spacer unter Header */}
      <div style={{ height: HEADER_H }} />

      {/* SCRUB SECTION (nur Scrollfläche) */}
      <section
        ref={wrapperRef}
        style={{
          position: "relative",
          height: wrapperHeight || undefined,
          background: "black",
        }}
      >
        {/* Platzhalter: reserviert die Viewport-Höhe unter Header */}
        <div style={{ height: `calc(100vh - ${HEADER_H}px)` }} />
      </section>

      {/* FIXED FRAME VIEWPORT */}
      <div
        style={{
          position: "fixed",
          top: HEADER_H,
          left: 0,
          width: "100vw",
          height: `calc(100vh - ${HEADER_H}px)`,
          zIndex: 10,
          overflow: "hidden",
          background: "black",
          pointerEvents: "none",
          opacity: showFixed ? 1 : 0,
          transition: "opacity 140ms linear",
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
            transform: "translateZ(0)",
          }}
        />

        {/* Frame Badge */}
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 18,
            padding: "8px 10px",
            background: "rgba(0,0,0,0.55)",
            borderRadius: 10,
            fontSize: 13,
            color: "white",
            backdropFilter: "blur(6px)",
          }}
        >
          Frame {visibleFrame}/{FRAME_COUNT}
          {!loadedRef.current.has(currentFrame) ? " (loading…)" : ""}
        </div>
      </div>

      {/* CONTENT AFTER SCRUB (hier soll normal weitergescrollt werden) */}
      <section
        style={{
          background: "black",
          color: "white",
          padding: "72px 28px 0",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ paddingBottom: 18 }}>
            <div
              style={{
                fontSize: 14,
                letterSpacing: 2,
                opacity: 0.65,
                textTransform: "uppercase",
              }}
            >
              Nach dem Video
            </div>
            <h2 style={{ fontSize: 54, margin: "10px 0 12px", lineHeight: 1.05 }}>
              Jetzt geht’s in den Content
            </h2>
            <p style={{ opacity: 0.85, fontSize: 18, maxWidth: 860, lineHeight: 1.6 }}>
              Das hier simuliert den Bereich “unter” der Scroll-Animation: Headlines fliegen von
              links rein, erklärender Text von rechts. Genau so kannst du später echte Kriminalwelt
              Inhalte andocken.
            </p>
            <div className="chips">
              <span className="chip">Sticky Scrub abgeschlossen</span>
              <span className="chip">Scroll läuft normal weiter</span>
              <span className="chip">Reveal-Animationen</span>
            </div>
          </div>

          {/* Block 1 */}
          <div className="reveal-row" data-reveal>
            <div className="reveal-left">
              <h3 style={{ fontSize: 44, margin: 0, lineHeight: 1.08 }}>
                Die Halle als Bühne.
              </h3>
              <p style={{ marginTop: 14, opacity: 0.88, fontSize: 18, lineHeight: 1.65 }}>
                Kurzer Text, der die Idee erklärt: oben die Animation, darunter geht’s wie auf einer
                “normalen” Seite weiter. Genau das brauchen wir später für Investor- oder
                Besucherkommunikation.
              </p>
            </div>
            <div className="reveal-right">
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  padding: 18,
                }}
              >
                <div style={{ opacity: 0.8, fontSize: 14, marginBottom: 10 }}>
                  Notiz / Subtext
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.92 }}>
                  Die Reveal-Animationen sind bewusst subtil: kein “Hollywood”, eher deutsches
                  sachliches “Aktenzeichen XY”-Feeling. Später können wir das noch bräunlich/grünlich
                  einfärben und typografisch stasi-amtlich machen.
                </div>
              </div>
            </div>
          </div>

          {/* Block 2 */}
          <div className="reveal-row" data-reveal>
            <div className="reveal-left">
              <h3 style={{ fontSize: 44, margin: 0, lineHeight: 1.08 }}>
                Szenarienräume als Kernformat.
              </h3>
              <p style={{ marginTop: 14, opacity: 0.88, fontSize: 18, lineHeight: 1.65 }}>
                Hier könnte später z.B. eine kurze Erklärung rein: “3 Räume, 1 sichtbarer, Bühne
                verschiebt sich.” Und darunter CTA: “Nächster Fall” oder “Weiter zur Capsule”.
              </p>
            </div>
            <div className="reveal-right">
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  padding: 18,
                }}
              >
                <div style={{ opacity: 0.8, fontSize: 14, marginBottom: 10 }}>
                  Beispiel-Details
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75, opacity: 0.92 }}>
                  <li>Smartglass: erst Spiegel, dann Reveal</li>
                  <li>Sound Intro: Notruf / Funk / Kommissar</li>
                  <li>Spurenmarker klappen automatisch hoch</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Block 3 */}
          <div className="reveal-row" data-reveal>
            <div className="reveal-left">
              <h3 style={{ fontSize: 44, margin: 0, lineHeight: 1.08 }}>
                “Echo Wall” / Discovery Strecke.
              </h3>
              <p style={{ marginTop: 14, opacity: 0.88, fontSize: 18, lineHeight: 1.65 }}>
                Auch nice: nach der Animation direkt in den Discovery-Bereich überleiten. Dann hat
                man den “Wow”-Moment oben und die aktive Exploration unten.
              </p>
            </div>
            <div className="reveal-right">
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  padding: 18,
                }}
              >
                <div style={{ opacity: 0.8, fontSize: 14, marginBottom: 10 }}>
                  Mikro-Interaktion
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.92 }}>
                  Scan → haptisches Feedback → O-Ton abspielen. Passt perfekt als nächste “Ebene”
                  nach dem Scroll-Scrub.
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Futter */}
          <div className="footer-block" data-reveal>
            <div className="reveal-left">
              <h3 style={{ fontSize: 40, margin: 0, lineHeight: 1.08 }}>
                Ende der Seite (Futter)
              </h3>
              <p style={{ marginTop: 14, opacity: 0.88, fontSize: 18, lineHeight: 1.65 }}>
                Damit du wirklich siehst: nach der pinned Scrub-Strecke kommt ein normaler Scroll
                mit genug Länge. Hier kannst du später Footer, Kontakt, Investor-Infos etc.
                andocken.
              </p>
            </div>
            <div className="reveal-right">
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  padding: 18,
                }}
              >
                <div style={{ opacity: 0.8, fontSize: 14, marginBottom: 10 }}>
                  Next Steps
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.92 }}>
                  Als nächstes können wir:
                  <br />• die Scrub-Zone “sauber” in eine richtige Landingpage einbetten
                  <br />• Typo/Look auf “amtlich/70er” drehen
                  <br />• mehrere Scroll-Videos als Kapitel
                </div>
              </div>
            </div>
          </div>

          {/* Extra Spacer unten */}
          <div style={{ height: 140 }} />
        </div>
      </section>
    </div>
  );
}