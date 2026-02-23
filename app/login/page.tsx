"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: pw }),
      });

      if (!res.ok) {
        setError("Falsches Passwort.");
        setLoading(false);
        return;
      }

      // Wenn Login ok: zurück zur Startseite
      window.location.href = "/";
    } catch (err) {
      setError("Netzwerkfehler. Bitte nochmal versuchen.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f4f4",
        display: "grid",
        placeItems: "center",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: 420,
          background: "white",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 16px 60px rgba(0,0,0,0.10)",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.55 }}>
          KRIMINALWELT
        </div>

        <h1 style={{ marginTop: 10, fontSize: 40, marginBottom: 6 }}>
          Login
        </h1>

        <div style={{ opacity: 0.65, marginBottom: 18 }}>
          Zugang zum Kriminalwelt-Prototypen.
        </div>

        <label style={{ display: "block", fontSize: 12, opacity: 0.75 }}>
          Passwort
        </label>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="••••••••"
          style={{
            marginTop: 8,
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            outline: "none",
          }}
        />

        {error && (
          <div style={{ color: "#c01818", marginTop: 10, fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "black",
            color: "white",
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "…" : "Weiter"}
        </button>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.55 }}>
          (Provisorischer Login – wird später „richtig“ gemacht.)
        </div>
      </form>
    </main>
  );
}