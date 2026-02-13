
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

import { db } from "@/lib/db";

const utapi = new UTApi();

export async function GET() {
    try {
        const [filesResponse, permits] = await Promise.all([
            utapi.listFiles(),
            db.permit.findMany({
                select: {
                    id: true,
                    subject: true,
                    name: true,
                    attachments: true
                }
            })
        ]);

        // Create a map of fileUrl -> Permit Info
        const fileMap = new Map();

        permits.forEach((permit: any) => {
            if (Array.isArray(permit.attachments)) {
                (permit.attachments as any[]).forEach((att: any) => {
                    // Extract key from URL or use stored key if available
                    // UT URL format: https://utfs.io/f/KEY
                    const key = att.key || att.url.split('/').pop();
                    if (key) {
                        fileMap.set(key, {
                            permitTitle: permit.subject,
                            applicantName: permit.name
                        });
                    }
                });
            }
        });

        const files = filesResponse.files.map((file: any) => {
            const permitInfo = fileMap.get(file.key);
            return {
                ...file,
                permitTitle: permitInfo?.permitTitle || "Upload Manual (Tanpa Lampiran)",
                applicantName: permitInfo?.applicantName || "-"
            };
        });

        return NextResponse.json({ files });
    } catch (error) {
        console.error("List files error:", error);
        return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { fileKey } = await request.json();

        if (!fileKey) {
            return NextResponse.json({ error: "File key is required" }, { status: 400 });
        }

        const response = await utapi.deleteFiles(fileKey);

        if (!response.success) {
            return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete file error:", error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}
