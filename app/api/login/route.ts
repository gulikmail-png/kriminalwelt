import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const body = await req.json().catch(() => null);
    const password = body?.password;

    if (typeof password !== "string") {
      return NextResponse.json(
        { ok: false, error: "Missing password" },
        { status: 400 }
      );
    }

    if (password !== process.env.SITE_PASSWORD) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const token = await createToken();

    const res = NextResponse.json({ ok: true });
    res.cookies.set("kriminalwelt_auth", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}