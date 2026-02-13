
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const permitCount = await prisma.permit.count();
        console.log(`Successfully connected! Found ${permitCount} permits.`);

        const permits = await prisma.permit.findMany({ take: 1 });
        console.log('Sample permit:', permits[0]);
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
