export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        display: "grid",
        placeItems: "center",
        color: "white",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <div style={{ textAlign: "center", opacity: 0.95 }}>
        <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.6 }}>
          KRIMINALWELT
        </div>
        <h1 style={{ marginTop: 10, fontSize: 44, marginBottom: 8 }}>
          Zugriff gewährt
        </h1>
        <div style={{ opacity: 0.7 }}>Du bist eingeloggt.</div>

        <div style={{ marginTop: 26, opacity: 0.55, fontSize: 12 }}>
          (Diese Seite ist absichtlich schlicht. Später kommt hier die echte Startseite.)
        </div>
      </div>
    </main>
  );
}