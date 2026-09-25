import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'campuspilot-enterprise-secret-jwt-key-capacity-connect-998877';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'TRAINEE' | 'TRAINER' | 'ADMIN';
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  return prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      traineeProfile: true,
      trainerProfile: true,
    },
  });
}
