import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ trackingId: string }> }
) {
    try {
        const { trackingId } = await params;

        const entry = await db.guestBook.findUnique({
            where: { trackingId },
            select: { isScanned: true },
        });

        if (!entry) {
            return NextResponse.json({ isScanned: false });
        }

        return NextResponse.json({ isScanned: entry.isScanned });
    } catch (error) {
        console.error("Failed to check scan status:", error);
        return NextResponse.json({ isScanned: false });
    }
}
