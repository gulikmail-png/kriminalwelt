import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const passwordRaw = typeof body?.password === "string" ? body.password : "";
    const password = passwordRaw.trim();

    const expected = (process.env.SITE_PASSWORD ?? "").trim();

    if (!expected) {
      return NextResponse.json(
        { ok: false, error: "Server-Konfiguration fehlt: SITE_PASSWORD ist nicht gesetzt." },
        { status: 500 }
      );
    }

    if (password !== expected) {
      return NextResponse.json({ ok: false, error: "Falsches Passwort." }, { status: 401 });
    }

    const token = await createToken();

    const res = NextResponse.json({ ok: true });

    res.cookies.set("kriminalwelt_auth", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
    });

    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Serverfehler beim Login." }, { status: 500 });
  }
}