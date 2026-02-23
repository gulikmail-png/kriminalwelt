export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#111",
        color: "white",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ opacity: 0.5, letterSpacing: 3, marginBottom: 10 }}>
          KRIMINALWELT
        </div>

        <h1 style={{ fontSize: 48, margin: 0 }}>
          Zugriff gewährt
        </h1>

        <p style={{ opacity: 0.7, marginTop: 12 }}>
          Du bist eingeloggt.
        </p>
      </div>
    </main>
  );
}