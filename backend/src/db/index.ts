// src/db/index.ts
import { PrismaClient } from "@prisma/client"; // Or "../generated" if you used the custom output earlier
import { neonConfig } from '@neondatabase/serverless'; // Notice: 'Pool' is gone
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

// 1. Tell Neon to use the native 'ws' package for WebSocket connections in Node.js
neonConfig.webSocketConstructor = ws;

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Pass the config directly to PrismaNeon (skip creating a Pool instance)
const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaNeon({ connectionString });

// 3. Instantiate PrismaClient using the adapter
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;