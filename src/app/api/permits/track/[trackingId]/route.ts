import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PermitStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ trackingId: string }> }
) {
    try {
        const { trackingId } = await params;
        console.log("TRACK_API: Searching for trackingId:", trackingId);

        const permit = await db.permit.findUnique({
            where: { trackingId },
            include: {
                history: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                survey: true,
            }
        });

        if (!permit) {
            console.log("TRACK_API: Permit not found for trackingId:", trackingId);
            return NextResponse.json(
                { error: "Permit not found" },
                { status: 404 }
            );
        }

        console.log("TRACK_API: Found permit:", permit.id);

        // Map to frontend type
        const mappedPermit = {
            id: permit.id,
            trackingId: permit.trackingId,
            type: permit.type,
            applicantName: permit.name,
            applicantEmail: permit.email,
            applicantPhone: permit.phone,
            subject: permit.subject,
            description: permit.description,
            agencyName: permit.agencyName || undefined,
            agencyCategory: permit.agencyCategory || undefined,
            submissionDate: permit.date instanceof Date ? permit.date.toISOString() : new Date(permit.date).toISOString(),
            status: permit.status as PermitStatus,
            createdAt: permit.createdAt,
            updatedAt: permit.updatedAt,
            statusHistory: permit.history.map((h: any) => ({
                status: h.status as PermitStatus,
                date: h.createdAt instanceof Date ? h.createdAt.toISOString() : new Date(h.createdAt).toISOString(),
                note: h.note || undefined,
            })),
            attachments: (((permit as any).attachments as any[]) || []).map((a: any) => ({
                id: a.id,
                name: a.name,
                size: a.size,
                type: a.type,
                url: a.url,
                uploadedAt: a.createdAt || new Date().toISOString(),
                status: 'done',
                progress: 100,
                category: a.category || undefined
            })),
            rejectionReason: permit.rejectionReason || undefined,
            survey: (permit as any).survey ? {
                rating: (permit as any).survey.rating,
                comment: (permit as any).survey.comment,
                createdAt: (permit as any).survey.createdAt
            } : undefined,
        };

        return NextResponse.json(mappedPermit);
    } catch (error: any) {
        console.error("TRACK_API: Error fetching permit for tracking:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
