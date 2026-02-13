
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to DB...");
        const permit = await prisma.permit.findFirst({
            include: { survey: true } // Check if survey relation is valid in client
        });
        console.log("Permit found:", permit ? permit.trackingId : "None");
        if (permit && permit.survey) {
            console.log("Survey found:", permit.survey);
        } else {
            console.log("No survey found for this permit (expected if not created yet).");
        }

        // Check if we can create a survey (dry run or check model)
        // Actually just checking if 'survey' property exists on permit object is enough proof that Client knows about it?
        // In JS runtime, if relation is included, it should be there (null or object).
        // If Prisma Client was old, it would throw validation error on `include: { survey: true }`.

        console.log("Prisma Client seems to recognize Survey model.");

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
