import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("kriminalwelt_auth")?.value;

  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isApi = req.nextUrl.pathname.startsWith("/api");

  if (isLoginPage || isApi) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const valid = await verifyToken(token);

  if (!valid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};