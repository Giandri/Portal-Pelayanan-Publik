
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

        // Try to find a Permit first
        const permit = await db.permit.findUnique({
            where: { trackingId },
        });

        if (permit) {
            const survey = await db.survey.create({
                data: {
                    rating,
                    comment,
                    permitId: permit.id,
                },
            });
            console.log("Survey created for permit:", survey);
            return NextResponse.json(survey);
        }

        // If no permit found, try GuestBook
        const guestBook = await db.guestBook.findUnique({
            where: { trackingId },
        });

        if (guestBook) {
            const survey = await db.survey.create({
                data: {
                    rating,
                    comment,
                    guestBookId: guestBook.id,
                },
            });
            console.log("Survey created for guest book:", survey);
            return NextResponse.json(survey);
        }

        return NextResponse.json(
            { error: "Data tidak ditemukan" },
            { status: 404 }
        );
    } catch (error: any) {
        console.error("Error creating survey:", error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Anda sudah mengisi survei" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Gagal menyimpan survei", details: error.message },
            { status: 500 }
        );
    }
}
