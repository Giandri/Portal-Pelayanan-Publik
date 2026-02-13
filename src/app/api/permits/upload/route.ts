
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const permitId = formData.get("permitId") as string;

        if (!file || !permitId) {
            return NextResponse.json(
                { error: "File and permitId are required" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if exists
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Save to DB
        // 1. Fetch current permit to get existing attachments
        const permit = await db.permit.findUnique({
            where: { id: permitId },
            select: { attachments: true }
        });

        if (!permit) {
            return NextResponse.json(
                { error: "Permit not found" },
                { status: 404 }
            );
        }

        const currentAttachments = (permit.attachments as any[]) || [];

        // 2. Create new attachment object
        const newAttachment = {
            id: `att-${Date.now()}`, // Generate a simple ID
            name: file.name,
            url: `/uploads/${filename}`,
            size: file.size,
            type: file.type,
            category: "output", // Admin output/result
            permitId: permitId,
            createdAt: new Date().toISOString(),
            status: 'done', // Add status field for frontend compatibility
            progress: 100
        };

        // 3. Update permit with new attachment appended
        await db.permit.update({
            where: { id: permitId },
            data: {
                attachments: [...currentAttachments, newAttachment]
            }
        });

        return NextResponse.json(newAttachment);
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { permitId, files } = body;

        if (!permitId || !files || !Array.isArray(files)) {
            return NextResponse.json(
                { error: "PermitId and files array are required" },
                { status: 400 }
            );
        }

        // Fetch current permit
        const permit = await db.permit.findUnique({
            where: { id: permitId },
            select: { attachments: true }
        });

        if (!permit) {
            return NextResponse.json(
                { error: "Permit not found" },
                { status: 404 }
            );
        }

        const currentAttachments = (permit.attachments as any[]) || [];

        // Format new attachments
        const newAttachments = files.map((file: any) => ({
            id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            url: file.url,
            size: file.size,
            type: file.type,
            key: file.key,
            category: "output", // Admin output/result
            permitId: permitId,
            createdAt: new Date().toISOString(),
            status: 'done',
            progress: 100
        }));

        // Update permit
        const updatedPermit = await db.permit.update({
            where: { id: permitId },
            data: {
                attachments: [...currentAttachments, ...newAttachments]
            }
        });

        return NextResponse.json({ success: true, count: newAttachments.length });
    } catch (error: any) {
        console.error("Metadata update error:", error);
        return NextResponse.json(
            { error: "Failed to update permit metadata" },
            { status: 500 }
        );
    }
}
