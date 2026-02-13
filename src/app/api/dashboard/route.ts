import { NextResponse } from "next/server";
import { getPermits } from "@/app/actions/permits";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Use summary mode for faster dashboard loading
        const permits = await getPermits({ summary: true });
        return NextResponse.json(permits);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch permits" },
            { status: 500 }
        );
    }
}
