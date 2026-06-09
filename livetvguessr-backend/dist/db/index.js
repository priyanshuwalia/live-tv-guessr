"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/db/index.ts
const client_1 = require("@prisma/client"); // Or "../generated" if you used the custom output earlier
const serverless_1 = require("@neondatabase/serverless"); // Notice: 'Pool' is gone
const adapter_neon_1 = require("@prisma/adapter-neon");
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 1. Tell Neon to use the native 'ws' package for WebSocket connections in Node.js
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global;
// 2. Pass the config directly to PrismaNeon (skip creating a Pool instance)
const connectionString = process.env.DATABASE_URL;
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
// 3. Instantiate PrismaClient using the adapter
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        adapter,
        log: ['query', 'error', 'warn'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
