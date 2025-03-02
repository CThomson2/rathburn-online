import { PrismaClient } from "@prisma/client";
import { User } from "@/types/api/auth";

const prisma = new PrismaClient();

export type UserInput = {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role?: string;
};

export type UserWithoutPassword = Omit<User, "password">;

export async function findUserByEmail(
  email: string
): Promise<UserWithoutPassword | null> {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role as "ADMIN" | "USER",
    createdAt: user.created_at.getTime(),
  };
}

export async function findUserById(
  id: string
): Promise<UserWithoutPassword | null> {
  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role as "ADMIN" | "USER",
    createdAt: user.created_at.getTime(),
  };
}

export async function findUserWithPasswordByEmail(email: string): Promise<{
  id: string;
  email: string;
  password_hash: string;
  role: string;
} | null> {
  return prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password_hash: true,
      role: true,
    },
  });
}

export async function createUser(
  userData: UserInput
): Promise<UserWithoutPassword> {
  const user = await prisma.users.create({
    data: {
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      password_hash: userData.passwordHash,
      role: userData.role || "USER",
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      created_at: true,
    },
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role as "ADMIN" | "USER",
    createdAt: user.created_at.getTime(),
  };
}

export async function getUserCount(): Promise<number> {
  return prisma.users.count();
}

export async function createSession(
  userId: string,
  token: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await prisma.sessions.create({
    data: {
      user_id: userId,
      token,
      expires_at: expiresAt,
      user_agent: userAgent,
      ip_address: ipAddress,
    },
  });
}

export async function invalidateSession(token: string): Promise<void> {
  await prisma.sessions.deleteMany({
    where: { token },
  });
}

export async function findSessionByToken(
  token: string
): Promise<{ user_id: string; expires_at: Date } | null> {
  const session = await prisma.sessions.findFirst({
    where: {
      token,
      expires_at: { gt: new Date() },
    },
    select: {
      user_id: true,
      expires_at: true,
    },
  });

  return session;
}

export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.sessions.deleteMany({
    where: {
      expires_at: { lt: new Date() },
    },
  });
  return result.count;
}
