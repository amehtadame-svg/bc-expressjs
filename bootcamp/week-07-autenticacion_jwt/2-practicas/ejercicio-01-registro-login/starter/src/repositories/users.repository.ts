import { User, IUser } from '../models/user.model';
import type { RegisterDto } from '../schemas/auth.schema';
import type { Document } from 'mongoose';

// lean() returns a plain object (LeanDocument), not a Mongoose Document
// We define a type for the lean user object (without Document methods like toObject)
type LeanUser = Omit<IUser, keyof Document> & { _id: any };

export async function findByEmail(email: string): Promise<LeanUser | null> {
  return User.findOne({ email }).lean().exec() as Promise<LeanUser | null>;
}

export async function findByEmailWithPassword(email: string): Promise<(LeanUser & { password: string }) | null> {
  return User.findOne({ email }).select('+password').lean().exec() as Promise<(LeanUser & { password: string }) | null>;
}

export async function findById(id: string): Promise<LeanUser | null> {
  return User.findById(id).lean().exec() as Promise<LeanUser | null>;
}

export async function create(dto: RegisterDto & { password: string }): Promise<IUser> {
  const user = await User.create(dto);
  return user;
}

export async function findByIdWithTokens(id: string): Promise<(LeanUser & { refreshToken?: string; password: string }) | null> {
  return User.findById(id).select('+password +refreshToken').lean().exec() as Promise<(LeanUser & { refreshToken?: string; password: string }) | null>;
}

export async function updateRefreshToken(id: string, hashedToken: string | undefined): Promise<void> {
  await User.findByIdAndUpdate(id, { refreshToken: hashedToken ?? null }).exec();
}