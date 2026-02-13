import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import { expand } from "dotenv-expand";
import * as fs from "fs";
import * as path from "path";

// Explicitly load .env and .env.local
const envPath = path.resolve(process.cwd(), ".env");
const envLocalPath = path.resolve(process.cwd(), ".env.local");

if (fs.existsSync(envPath)) {
    const config = dotenv.config({ path: envPath });
    expand(config);
}
if (fs.existsSync(envLocalPath)) {
    const config = dotenv.config({ path: envLocalPath, override: true });
    expand(config);
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const connectionString = `${process.env.DATABASE_URL}`;
console.log("DB_INIT: Initializing with PrismaPg adapter. URL present:", !!connectionString);

function createPrismaClient() {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

let db: PrismaClient;

try {
    db = globalForPrisma.prisma ?? createPrismaClient();
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
} catch (error: any) {
    console.error("CRITICAL: Failed to initialize PrismaClient with adapter:", error);
    throw error;
}

export { db };
