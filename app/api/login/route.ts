import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();

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
}