"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string>("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ password: pw }),
      });

      // 401 = wirklich falsches Passwort
      if (res.status === 401) {
        setError("Falsches Passwort.");
        return;
      }

      // andere Fehler (z.B. JSON kaputt, Serverproblem)
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setError(`Login fehlgeschlagen (${res.status}). ${txt ? txt.slice(0, 120) : ""}`.trim());
        return;
      }

      // ok -> weiter (Cookie ist gesetzt)
      window.location.href = "/kriminalwelt";
    } catch (err) {
      setError("Netzwerkfehler. Bitte Seite neu laden und nochmal versuchen.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f4f4f4",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: 32,
          borderRadius: 16,
          width: 520,
          maxWidth: "92vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 1.2, opacity: 0.6, marginBottom: 10 }}>
          KRIMINALWELT
        </div>

        <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, marginBottom: 12 }}>
          Login
        </div>

        <div style={{ opacity: 0.7, marginBottom: 22 }}>Zugang zum Kriminalwelt-Prototypen.</div>

        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
          Passwort
        </label>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            outline: "none",
            fontSize: 16,
          }}
        />

        {error ? (
          <div style={{ color: "#b00020", marginTop: 10, marginBottom: 10, fontSize: 13 }}>
            {error}
          </div>
        ) : (
          <div style={{ height: 33 }} />
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            border: "none",
            background: "black",
            color: "white",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Weiter
        </button>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.55 }}>
          (Provisorischer Login – wird später „richtig“ gemacht.)
        </div>
      </form>
    </div>
  );
}