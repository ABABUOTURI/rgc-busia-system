import jwt, { type Secret, type SignOptions, type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;

if (!JWT_SECRET) {
  throw new Error("⚠️ Missing JWT_SECRET in .env.local");
}

/**
 * Sign JWT Token
 * @param payload - Data you want inside token (e.g., userId, role)
 * @param expiresIn - Expiry time (default: 1d)
 */
export function signToken(
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = "1d"
): string {
  return jwt.sign(payload, JWT_SECRET as Secret, { expiresIn });
}

/**
 * Verify JWT Token
 * @param token - JWT string
 */
export function verifyToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // Invalid token
  }
}
