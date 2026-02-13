import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, status, rejectionReason } = body;

        // Update the permit status
        // Check if history already exists for this status - wait, simple approach:
        // Always create a NEW history entry for major status changes to track timeline accurately

        const updateData: any = {
            status,
            history: {
                create: {
                    status,
                    note: rejectionReason || `Status updated to ${status}`,
                },
            },
        };

        if (rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const updatedPermit = await db.permit.update({
            where: { id },
            data: updateData,
        });

        // Revalidate the dashboard page to show updated data
        revalidatePath("/dashboard/perizinan");

        return NextResponse.json(updatedPermit);
    } catch (error) {
        console.error("Error updating permit status:", error);
        return NextResponse.json(
            { error: "Failed to update permit status" },
            { status: 500 }
        );
    }
}
