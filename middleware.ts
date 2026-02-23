import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // öffentlich:
  if (pathname.startsWith("/login") || pathname.startsWith("/api/login") || pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // alles unter /kriminalwelt schützen
  if (pathname.startsWith("/kriminalwelt")) {
    const token = req.cookies.get("kriminalwelt_auth")?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const ok = await verifyToken(token);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/kriminalwelt/:path*"],
};