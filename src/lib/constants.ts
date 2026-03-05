
import {
    FileText,
    Droplets,
    CloudRain
} from "lucide-react";

import { PermitStatus } from "@/lib/types";

// Permit Type Definitions
export const permitTypes = [
    {
        slug: "informasi-publik",
        title: "Informasi Publik",
        description: "Permohonan informasi data publik terkait sumber daya air dan pengelolaan wilayah sungai.",
        icon: "FileText",
        color: "#3b82f6",
        bgColor: "#dbeafe",
    },
    {
        slug: "hidrologi-kualitas-air",
        title: "Hidrologi & Kualitas Air",
        description: "Perizinan terkait data hidrologi, pemantauan kualitas air, dan izin penggunaan sumber daya air.",
        icon: "Droplets",
        color: "#0ea5e9",
        bgColor: "#e0f2fe",
    },
    {
        slug: "banjir-bencana",
        title: "Banjir & Bencana",
        description: "Akses informasi peringatan dini banjir, data kebencanaan, dan mitigasi risiko bencana.",
        icon: "CloudRain",
        color: "#f59e0b",
        bgColor: "#fef3c7",
    },
] as const;

// Status Definitions
export const statusConfig: Record<PermitStatus, { label: string; color: string; bgColor: string }> = {
    diajukan: { label: "Diajukan", color: "#f59e0b", bgColor: "#fef3c7" },
    proses: { label: "Dalam Proses", color: "#3b82f6", bgColor: "#dbeafe" },
    disetujui: { label: "Disetujui", color: "#22c55e", bgColor: "#dcfce7" },
    ditolak: { label: "Ditolak", color: "#ef4444", bgColor: "#fee2e2" },
};

// Status Flow for Timeline
export const statusFlow: PermitStatus[] = [
    "diajukan",
    "proses",
    "disetujui",
    "ditolak", // Added
];

// Process Steps Pipeline
export const processSteps = [
    {
        id: "diajukan",
        label: "Pengajuan",
        description: "Permohonan anda berhasil diajukan.",
    },
    {
        id: "proses",
        label: "Pemrosesan",
        description: "Permohonan anda sedang diperiksa dan dilakuakn proses verifikasi.",
    },
    {
        id: "disetujui",
        label: "Persetujuan",
        description: "Permohonan anda telah disetujui. Jangan lupa memberikan penilaian untuk meningkatkan kualitas layanan kami.   ",
    },
];
