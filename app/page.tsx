"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  // Wenn schon "eingeloggt", direkt weiter
  useEffect(() => {
    const ok = localStorage.getItem("kriminalwelt_auth") === "1";
    if (ok) router.replace("/kriminalwelt");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Provisorisches Passwort
    const isOk = pw.trim() === "kriminalwelt";

    if (!isOk) {
      setError("Falsches Passwort.");
      return;
    }

    localStorage.setItem("kriminalwelt_auth", "1");
    router.push("/kriminalwelt");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 520,
          maxWidth: "calc(100vw - 48px)",
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
          padding: 32,
          background: "white",
        }}
      >
        <div style={{ letterSpacing: 2, fontSize: 12, color: "#777" }}>
          KRIMINALWELT
        </div>

        <h1 style={{ marginTop: 10, marginBottom: 6, fontSize: 34 }}>
          Login
        </h1>

        <div style={{ color: "#666", marginBottom: 22 }}>
          Zugang zum Kriminalwelt-Prototypen.
        </div>

        <label style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Passwort
        </label>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="••••••••"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.18)",
            outline: "none",
            fontSize: 16,
          }}
        />

        {error ? (
          <div style={{ marginTop: 10, fontSize: 13, color: "#b00020" }}>
            {error}
          </div>
        ) : (
          <div style={{ height: 18 }} />
        )}

        <button
          type="submit"
          style={{
            marginTop: 14,
            width: "100%",
            padding: "12px 12px",
            borderRadius: 12,
            border: "none",
            background: "black",
            color: "white",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Weiter
        </button>

        <div style={{ marginTop: 12, fontSize: 12, color: "#888" }}>
          (Provisorischer Login – wird später „richtig“ gemacht.)
        </div>
      </form>
    </div>
  );
}