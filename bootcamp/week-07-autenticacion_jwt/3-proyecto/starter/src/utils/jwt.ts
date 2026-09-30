import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// ── Access token (15 minutos) ──────────────────────────────────────────────────
export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
}

// ── Refresh token (7 días) — secreto distinto al del access token ─────────────
// Incluye `jti` (UUID) para que la rotación invalide de verdad al token anterior.
export function signRefreshToken(payload: { sub: string }): string {
  return jwt.sign({ ...payload, jti: randomUUID() }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { sub: string };
}
