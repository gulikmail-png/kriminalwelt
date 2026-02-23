"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const password = pw.trim();

    if (!password) {
      setError("Bitte Passwort eingeben.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "accept": "application/json",
          "cache-control": "no-cache",
        },
        cache: "no-store",
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setError(`Login fehlgeschlagen (HTTP ${res.status}).`);
        return;
      }

      // Login ok → auf Startseite
      window.location.href = "/";
    } catch (err) {
      setError("Netzwerkfehler – Request nicht möglich.");
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
          borderRadius: 12,
          width: 420,
          maxWidth: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ letterSpacing: 2, fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
          KRIMINALWELT
        </div>

        <h1 style={{ margin: 0, marginBottom: 8, fontSize: 40 }}>
          Login
        </h1>

        <div style={{ opacity: 0.7, marginBottom: 18 }}>
          Zugang zum Kriminalwelt-Prototypen.
        </div>

        <input
          type="password"
          placeholder="Passwort"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />

        {error && (
          <div style={{ color: "#c00", marginBottom: 12, fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "black",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Weiter
        </button>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.5 }}>
          (Provisorischer Login – wird später „richtig“ gemacht.)
        </div>
      </form>
    </div>
  );
}