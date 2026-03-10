"use server";

import { db } from "@/lib/db";

export async function createGuestBookEntry(data: {
    name: string;
    email: string;
    nik: string;
    agencyName: string;
    agencyCategory: string;
    phone: string;
    subject: string;
    description: string;
}) {
    try {
        // Generate tracking ID: BWS-DDMMYY-XXX
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yy = String(today.getFullYear()).slice(-2);
        const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
        const trackingId = `BWS-${dd}${mm}${yy}-${randomStr}`;

        const entry = await db.guestBook.create({
            data: {
                trackingId,
                name: data.name,
                email: data.email,
                nik: data.nik,
                agencyName: data.agencyName || null,
                agencyCategory: data.agencyCategory || null,
                phone: data.phone,
                subject: data.subject,
                description: data.description || null,
            },
        });

        return { success: true, trackingId: entry.trackingId };
    } catch (error) {
        console.error("Failed to create guest book entry:", error);
        return { success: false, error: "Gagal menyimpan data buku tamu." };
    }
}

export async function getGuestBookByTrackingId(trackingId: string) {
    try {
        const entry = await db.guestBook.findUnique({
            where: { trackingId },
        });

        if (!entry) return null;

        return {
            id: entry.id,
            trackingId: entry.trackingId,
            name: entry.name,
            email: entry.email,
            nik: entry.nik,
            agencyName: entry.agencyName,
            agencyCategory: entry.agencyCategory,
            phone: entry.phone,
            subject: entry.subject,
            description: entry.description,
            createdAt: entry.createdAt.toISOString(),
        };
    } catch (error) {
        console.error("Failed to fetch guest book entry:", error);
        return null;
    }
}

export async function markGuestBookScanned(trackingId: string) {
    try {
        await db.guestBook.update({
            where: { trackingId },
            data: { isScanned: true },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to mark guest book as scanned:", error);
        return { success: false };
    }
}
