import { NextResponse } from "next/server";
import { getApplicants } from "@/app/actions/applicants";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const applicants = await getApplicants();
        return NextResponse.json(applicants);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch applicants" },
            { status: 500 }
        );
    }
}
