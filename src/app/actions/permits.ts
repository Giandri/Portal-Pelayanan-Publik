"use server";

import { db } from "@/lib/db";
import { Permit, PermitStatus } from "@/lib/types";


export async function getPermits(options: { summary?: boolean } = {}): Promise<Permit[]> {
    try {
        const include = options.summary ? undefined : {
            history: true,
            survey: true,
        };

        // Debug log
        console.log(`Fetching permits with options:`, options);


        const permits = await db.permit.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 100, // Limit to 100 most recent permits for performance
            include: include,
        });

        console.log(`Fetched ${permits.length} permits`);

        // Map Prisma result to our frontend Permit type
        return permits.map((permit: any) => {
            try {
                return {
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
                    submissionDate: permit.date ? permit.date.toISOString() : new Date().toISOString(), // Fallback if date is missing
                    status: permit.status as PermitStatus,
                    createdAt: permit.createdAt,
                    updatedAt: permit.updatedAt,
                    // Only map relations if they exist
                    statusHistory: (permit as any).history?.map((h: any) => ({
                        status: h.status as PermitStatus,
                        date: h.createdAt ? h.createdAt.toISOString() : new Date().toISOString(),
                        note: h.note || undefined,
                    })) || [],
                    attachments: (((permit as any).attachments as any[]) || []).map((a: any) => ({
                        id: a.id,
                        name: a.name,
                        size: a.size,
                        type: a.type,
                        category: a.category || undefined,
                        progress: 100, // stored files are complete
                        status: "done",
                        uploadedAt: a.createdAt || new Date().toISOString(),
                        url: a.url,
                    })),
                    rejectionReason: permit.rejectionReason || undefined,
                    survey: permit.survey ? {
                        rating: permit.survey.rating,
                        comment: permit.survey.comment,
                        createdAt: permit.survey.createdAt.toISOString()
                    } : undefined,
                };
            } catch (err) {
                console.error(`Error mapping permit ${permit.id}:`, err);
                throw err;
            }
        });
    } catch (error) {
        console.error("Failed to fetch permits:", error);
        // Return empty array instead of crashing, but let the caller handle empty if needed. 
        // For API routes, returning empty array is better than 500.
        return [];
    }
}
