
export type PermitStatus =
    | "diajukan"
    | "proses"
    | "disetujui"
    | "ditolak";

export interface PermitAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: "uploading" | "done" | "error";
    uploadedAt: string;
    category?: string;
    url?: string; // Added to match likely usage
}

export interface StatusHistoryItem {
    status: PermitStatus;
    date: string;
    note?: string;
}

export interface Permit {
    id: string;
    trackingId: string;
    type: string; // broadened from literal to string to match Prisma roughly or kept as string
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    subject: string;
    description: string;
    submissionDate: string;
    status: PermitStatus;
    createdAt: string | Date; // Allow both for easier transition
    updatedAt: string | Date;
    statusHistory: StatusHistoryItem[];
    attachments?: PermitAttachment[];
    rejectionSubject?: string;
    rejectionReason?: string;
    // Add optional prisma fields if needed for compatibility
    // Updated fields
    agencyName?: string;
    agencyCategory?: string;
    phone?: string;
    date?: string | Date;
    survey?: {
        rating: number;
        comment?: string | null;
        createdAt: string | Date;
    };
}
