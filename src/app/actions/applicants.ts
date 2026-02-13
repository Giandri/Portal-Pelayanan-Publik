import { db } from "@/lib/db";

export interface Applicant {
    id: string; // We'll use the email or a unique ID from one of their permits
    name: string;
    email: string;
    phone: string;
    organization: string | null;
    type: string;
    totalPermits: number;
    activePermits: number;
    joinDate: string;
    // Fields not in DB yet, using placeholders/defaults
    nik: string;
    address: string;
    avatar: null;
}

export async function getApplicants(): Promise<Applicant[]> {
    try {
        const permits = await db.permit.findMany({
            orderBy: {
                createdAt: 'desc' // Get recent ones first
            },
            take: 300 // Analyze last 300 permits to build applicant list
        });

        const applicantsMap = new Map<string, Applicant>();

        permits.forEach((permit: any) => {
            const email = permit.email;

            if (!applicantsMap.has(email)) {
                applicantsMap.set(email, {
                    id: permit.id, // Using first permit ID as a proxy for applicant ID since we group by email
                    name: permit.name,
                    email: permit.email,
                    phone: permit.phone,
                    organization: permit.agencyName || null,
                    type: permit.agencyCategory || "Perorangan", // Updated field
                    totalPermits: 0,
                    activePermits: 0,
                    joinDate: permit.createdAt.toISOString(),
                    nik: "-", // Not in DB
                    address: "-", // Not in DB
                    avatar: null
                });
            }

            const applicant = applicantsMap.get(email)!;
            applicant.totalPermits += 1;

            // Check for active status
            // Assuming "diajukan" and "proses" are active statuses
            if (["diajukan", "proses"].includes(permit.status)) {
                applicant.activePermits += 1;
            }

            // Update details from latest permit if needed (e.g. if they changed phone/org)
            // Since we sorted by createdAt ASC, the last one iterating is the latest? 
            // Actually iterating sequentially, so subsequent entries are later.
            // We can update mutable fields.
            applicant.phone = permit.phone;
            if (permit.agencyName) applicant.organization = permit.agencyName;
            if (permit.agencyCategory) applicant.type = permit.agencyCategory;
        });

        return Array.from(applicantsMap.values());
    } catch (error) {
        console.error("Failed to fetch applicants:", error);
        return [];
    }
}
