"use server";

import { db } from "@/lib/db";

export async function getSurveys() {
    try {
        const surveys = await db.survey.findMany({
            include: {
                permit: {
                    select: {
                        trackingId: true,
                        name: true,
                        type: true,
                        status: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return surveys.map((survey: any) => ({
            id: survey.id,
            rating: survey.rating,
            comment: survey.comment,
            createdAt: survey.createdAt,
            permit: {
                trackingId: survey.permit.trackingId,
                applicantName: survey.permit.name,
                type: survey.permit.type,
                status: survey.permit.status
            }
        }));
    } catch (error) {
        console.error("Failed to fetch surveys:", error);
        return [];
    }
}

export async function getPublicSurveys() {
    try {
        const surveys = await db.survey.findMany({
            where: {
                rating: {
                    gte: 4
                },
                comment: {
                    not: null,
                },
                AND: {
                    comment: {
                        not: ""
                    }
                }
            },
            include: {
                permit: {
                    select: {
                        name: true,
                        agencyName: true,
                        type: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });


        console.log("Fetched public surveys:", JSON.stringify(surveys, null, 2));

        // Filter out short comments locally if needed, or rely on UI to handle
        return surveys.filter((s: any) => (s.comment?.length || 0) > 5).map((survey: any) => ({
            id: survey.id,
            name: survey.permit.name,
            agency: survey.permit.agencyName,
            text: survey.comment as string,
            rating: survey.rating
        }));
    } catch (error) {
        console.error("Failed to fetch public surveys:", error);
        return [];
    }
}

export async function deleteSurvey(id: string) {
    try {
        await db.survey.delete({
            where: {
                id: id
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete survey:", error);
        return { success: false, error: "Failed to delete survey" };
    }
}
