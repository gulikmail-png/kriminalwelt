"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: pw }),
    });

    if (!res.ok) {
      setError("Falsches Passwort");
      return;
    }

    window.location.href = "/";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f4f4f4",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: 32,
          borderRadius: 12,
          width: 380,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: 16 }}>Kriminalwelt Login</h1>

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
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "black",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Einloggen
        </button>
      </form>
    </div>
  );
}