import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Permit ID is required" },
                { status: 400 }
            );
        }

        // Check if the permit exists
        const existingPermit = await db.permit.findUnique({
            where: { id },
        });

        if (!existingPermit) {
            return NextResponse.json(
                { error: "Permit not found" },
                { status: 404 }
            );
        }

        // Delete the permit. Associated history and surveys are automatically cascade-deleted by Prisma.
        await db.permit.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Permit deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error deleting permit:", error);
        return NextResponse.json(
            { error: "Failed to delete permit", details: error.message },
            { status: 500 }
        );
    }
}
