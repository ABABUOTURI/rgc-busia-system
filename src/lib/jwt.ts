import jwt, { type Secret, type SignOptions, type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;

if (!JWT_SECRET) {
  throw new Error("⚠️ Missing JWT_SECRET in .env.local");
}

export function signToken(
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = "1d"
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
