import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "Permit ID is required" }, { status: 400 });
        }

        const updatedPermit = await db.permit.update({
            where: { id },
            data: {
                isArchived: true,
                history: {
                    create: {
                        status: "diarsipkan",
                        note: "Permohonan disembunyikan dari papan Kanban",
                    },
                },
            },
        });

        // Revalidate the dashboard page to show updated data
        revalidatePath("/dashboard/perizinan");
        revalidatePath("/dashboard/riwayat");

        return NextResponse.json(updatedPermit);
    } catch (error) {
        console.error("Error archiving permit:", error);
        return NextResponse.json(
            { error: "Failed to archive permit" },
            { status: 500 }
        );
    }
}
