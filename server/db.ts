// server/db.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
  pool?: Pool;
};

// Buat connection pool
export const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Buat adapter
const adapter = new PrismaPg(pool);

// Inisialisasi Prisma dengan adapter
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [ "info", "warn", "error"], // optional
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.pool = pool;
}