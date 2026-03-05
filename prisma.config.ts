import { defineConfig } from '@prisma/config';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl() {
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

    const envFiles = ['.env', '.env.local'];
    for (const file of envFiles) {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const match = content.match(/DATABASE_URL=['"]?([^'"\r\n]+)['"]?/);
            if (match && match[1]) return match[1];
        }
    }
    return undefined;
}

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: getDatabaseUrl(),
    },
});
