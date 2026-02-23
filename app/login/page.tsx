"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string>("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const password = pw.trim(); // <- wichtig (Leerzeichen killen sonst alles)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        // versuch JSON zu lesen, falls vorhanden
        let msg = `Login fehlgeschlagen (HTTP ${res.status}).`;
        try {
          const data = await res.json();
          if (data?.error) msg = `${msg} ${data.error}`;
        } catch {
          // ignore
        }
        setError(msg);
        return;
      }

      // Erfolg -> jetzt auf geschützte Startseite
      window.location.href = "/kriminalwelt";
    } catch (err) {
      setError("Netzwerkfehler: Login-Request konnte nicht gesendet werden.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "white",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: 520,
          maxWidth: "100%",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          padding: 32,
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 2, color: "#777", marginBottom: 8 }}>
          KRIMINALWELT
        </div>

        <div style={{ fontSize: 42, fontWeight: 750, marginBottom: 6 }}>Login</div>
        <div style={{ color: "#666", marginBottom: 22 }}>Zugang zum Kriminalwelt-Prototypen.</div>

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
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
            padding: "14px 14px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.18)",
            outline: "none",
            fontSize: 16,
            marginBottom: 10,
          }}
        />

        {error ? (
          <div style={{ color: "#c62828", marginBottom: 12, fontSize: 13, lineHeight: 1.4 }}>
            {error}
          </div>
        ) : (
          <div style={{ height: 18 }} />
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            background: "black",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Weiter
        </button>

        <div style={{ marginTop: 12, color: "#888", fontSize: 12 }}>
          (Provisorischer Login – wird später „richtig“ gemacht.)
        </div>
      </form>
    </div>
  );
}