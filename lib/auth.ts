import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SITE_PASSWORD || "dev-secret");

export async function createToken() {
  return await new SignJWT({ loggedIn: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}