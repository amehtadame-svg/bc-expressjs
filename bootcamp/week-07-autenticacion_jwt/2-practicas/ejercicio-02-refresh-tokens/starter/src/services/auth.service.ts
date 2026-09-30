// ============================================
// PASO 3: Service de Auth con Refresh Tokens
// ============================================
// Implementación completa: register, login, refresh (rotación), logout, getMe

import bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import * as usersRepository from '../repositories/users.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema';

const SALT_ROUNDS = 10;

// bcrypt trunca la entrada a 72 bytes y los JWT comparten un prefijo muy largo,
// así que hashear el token directo haría que dos tokens distintos (mismo header
// y mismo inicio de payload) fueran equivalentes. Se hashea primero un digest
// SHA-256 (determinista) y sobre ese digest se aplica bcrypt.
function digestToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

// ── Register ──────────────────────────────────────────────────────────────────
export async function register(dto: RegisterDto) {
  const existing = await usersRepository.findByEmail(dto.email);
  if (existing) throw new AppError(409, 'El email ya está registrado');

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const user = await usersRepository.create({ ...dto, password: hashedPassword });

  const userObj = user.toObject() as unknown as Record<string, unknown>;
  delete userObj['password'];
  return userObj;
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function login(dto: LoginDto): Promise<TokenPair> {
  const user = await usersRepository.findByEmailWithPassword(dto.email);
  if (!user) throw new AppError(401, 'Credenciales inválidas');

  const isValid = await bcrypt.compare(dto.password, user.password as string);
  if (!isValid) throw new AppError(401, 'Credenciales inválidas');

  const userId = user._id.toString();

  // Access token (15 min)
  const accessToken = signAccessToken({
    sub: userId,
    email: user.email as string,
    role: (user.role as string) ?? 'user',
  });

  // Refresh token (7 días) - guardar hash en DB
  const refreshToken = signRefreshToken({ sub: userId });
  const hashedRefresh = await bcrypt.hash(digestToken(refreshToken), SALT_ROUNDS);
  await usersRepository.updateRefreshToken(userId, hashedRefresh);

  return {
    accessToken,
    refreshToken,
    user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
  };
}

// ── Refresh ────────────────────────────────────────────────────────────────────
export async function refresh(incomingRefreshToken: string): Promise<RefreshResult> {
  // 1. Verificar firma y expiración del refresh token
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(incomingRefreshToken) as { sub: string };
  } catch {
    throw new AppError(401, 'Refresh token inválido o expirado');
  }

  // 2. Cargar usuario con su hash de refresh token
  const user = await usersRepository.findByIdWithTokens(payload.sub);
  if (!user || !user.refreshToken) {
    throw new AppError(401, 'Sesión no válida');
  }

  // 3. Comparar token recibido con hash almacenado
  const isMatch = await bcrypt.compare(digestToken(incomingRefreshToken), user.refreshToken as string);
  if (!isMatch) throw new AppError(401, 'Refresh token no coincide o ya fue rotado');

  // 4. Rotar: generar nuevos tokens
  const userId = user._id.toString();
  const newAccessToken = signAccessToken({
    sub: userId,
    email: user.email as string,
    role: (user.role as string) ?? 'user',
  });
  const newRefreshToken = signRefreshToken({ sub: userId });

  // 5. Guardar nuevo hash, invalidar el anterior
  const newHashedRefresh = await bcrypt.hash(digestToken(newRefreshToken), SALT_ROUNDS);
  await usersRepository.updateRefreshToken(userId, newHashedRefresh);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout(userId: string): Promise<void> {
  // Invalidar refresh token en la base de datos
  await usersRepository.updateRefreshToken(userId, undefined);
}

// ── Me ────────────────────────────────────────────────────────────────────────
export async function getMe(userId: string) {
  const user = await usersRepository.findById(userId);
  if (!user) throw new AppError(404, 'Usuario no encontrado');
  return user;
}