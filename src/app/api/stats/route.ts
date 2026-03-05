import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { permitTypes } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Count total permits
        const totalPermits = await db.permit.count();

        // Count unique applicants by distinct email
        const uniqueApplicants = await db.permit.groupBy({
            by: ["email"],
        });
        const totalApplicants = uniqueApplicants.length;

        // Total categories from constants
        const totalCategories = permitTypes.length;

        // Average satisfaction from surveys (rating 1-5 → percentage)
        const surveyAgg = await db.survey.aggregate({
            _avg: { rating: true },
            _count: true,
        });
        const avgRating = surveyAgg._avg.rating ?? 0;
        const avgSatisfaction = surveyAgg._count > 0 ? Math.round((avgRating / 5) * 100) : 0;

        return NextResponse.json({
            totalPermits,
            totalApplicants,
            totalCategories,
            avgSatisfaction,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { totalPermits: 0, totalApplicants: 0, totalCategories: 3, avgSatisfaction: 0 },
            { status: 200 }
        );
    }
}
