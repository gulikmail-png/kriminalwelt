"use client";

import { useState } from "react";
import styles from "./page.module.css";

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
    <main className={styles.main}>
      <div className={styles.background} />
      <div className={styles.scrim} />

      <div className={styles.layout}>
        <header className={styles.header}>
          <img
            src="/KW_Logo.svg"
            alt="Kriminalwelt"
            className={styles.logo}
          />
        </header>

        <div className={styles.center}>
          <form onSubmit={handleLogin} className={styles.form}>
            <label className={styles.label} htmlFor="password">
              Passwort
            </label>

            <input
              id="password"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
            />

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? "Bitte warten…" : "Bestätigen"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}