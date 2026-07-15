import { PrismaClient } from '@prisma/client'

let prismaInstance: PrismaClient | null = null;

export function getPrisma() {
  // Reuse singleton in development to avoid exhausting connections
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}
