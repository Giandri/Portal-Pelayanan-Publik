
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { trackingId, rating, comment } = body;

        console.log("POST /api/surveys - Received:", { trackingId, rating, comment });

        if (!trackingId || !rating) {
            return NextResponse.json(
                { error: "Tracking ID dan Rating wajib diisi" },
                { status: 400 }
            );
        }

        // Find permit first to get ID
        const permit = await db.permit.findUnique({
            where: { trackingId },
        });

        if (!permit) {
            return NextResponse.json(
                { error: "Permohonan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Create survey
        const survey = await db.survey.create({
            data: {
                rating,
                comment,
                permitId: permit.id,
            },
        });

        console.log("Survey created:", survey);

        return NextResponse.json(survey);
    } catch (error: any) {
        console.error("Error creating survey:", error);

        // Handle unique constraint violation (already submitted)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Anda sudah mengisi survei untuk permohonan ini" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Gagal menyimpan survei", details: error.message },
            { status: 500 }
        );
    }
}
