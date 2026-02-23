import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

const PUBLIC_PATHS = [
  "/login",
  "/api/login",
  "/favicon.ico",
];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/assets")) return true;
  if (pathname.startsWith("/static")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public stuff: allow through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check auth cookie
  const token = req.cookies.get("kriminalwelt_auth")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const ok = await verifyToken(token);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    const res = NextResponse.redirect(url);
    res.cookies.delete("kriminalwelt_auth");
    return res;
  }

  return NextResponse.next();
}

/**
 * EXTREM WICHTIG:
 * Hier muss "/" drin sein, sonst wird die Startseite nicht geschützt.
 */
export const config = {
  matcher: ["/", "/((?!_next/static|_next/image|favicon.ico).*)"],
};