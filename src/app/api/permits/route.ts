import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTrackingId } from "@/lib/utils";
import { getPermits } from "@/app/actions/permits";
import { sendPermitEmail } from "@/lib/email";
import { permitTypes } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const permits = await getPermits();
        return NextResponse.json(permits);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch permits" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        console.log("POST /api/permits request received");
        const body = await request.json();
        console.log("Request body:", body);

        const {
            name,
            email,
            phone,
            agencyName,
            agencyCategory,
            subject,
            description,
            type,
            date
        } = body;

        console.log("Generating trackingId...");
        const trackingId = generateTrackingId();
        console.log("TrackingId generated:", trackingId);

        console.log("Creating permit in DB...");

        const submissionDate = new Date(date);
        if (isNaN(submissionDate.getTime())) {
            console.error("Invalid date received:", date);
            return NextResponse.json(
                { error: "Tanggal tidak valid" },
                { status: 400 }
            );
        }

        console.log("Creating permit with data:", {
            trackingId,
            type,
            name,
            email,
            date: submissionDate,
        });

        const permit = await db.permit.create({
            data: {
                trackingId,
                type,
                name,
                email,
                phone,
                agencyName,
                agencyCategory,
                subject,
                description,
                date: submissionDate,
                status: "diajukan",
                history: {
                    create: {
                        status: "diajukan",
                        note: "Permohonan baru diajukan",
                    },
                },
            },
        });

        console.log("POST_API: Permit created with trackingId:", permit.trackingId);

        // Send email notification (Fire and forget, don't block response)
        if (email) {
            console.log("Sending email notification to:", email);

            // Find readable permit type title
            const permitTypeInfo = permitTypes.find((t: any) => t.slug === type);
            const readableType = permitTypeInfo ? permitTypeInfo.title : (type || "Permohonan Izin");

            sendPermitEmail({
                to: email,
                trackingId: permit.trackingId,
                name: name || "Pemohon",
                type: readableType
            }).then((res: any) => {
                if (res.success) {
                    console.log("Email notification delivered successfully");
                } else {
                    console.error("Failed to deliver email notification:", res.error);
                }
            }).catch((err: any) => {
                console.error("Unexpected error sending email:", err);
            });
        }

        return NextResponse.json({ trackingId: permit.trackingId, id: permit.id });
    } catch (error: any) {
        console.error("Error creating permit:", error);
        return NextResponse.json(
            { error: "Failed to create permit", details: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
