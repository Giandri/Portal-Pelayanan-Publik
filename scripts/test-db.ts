import { PrismaClient } from "@prisma/client";

async function main() {
    const prisma = new PrismaClient();
    try {
        console.log("Connecting to database...");
        await prisma.$connect();
        console.log("Connected successfully!");

        // Test a simple query to ensure tables exist
        const count = await prisma.permit.count();
        console.log("Current permit count:", count);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
