import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface GuestBookEntry {
    id: string;
    trackingId: string;
    name: string;
    email: string;
    nik: string;
    agencyName: string | null;
    agencyCategory: string | null;
    phone: string;
    subject: string;
    description: string | null;
    isScanned: boolean;
    createdAt: Date;
    survey: {
        rating: number;
        comment: string | null;
    } | null;
}

export const exportGuestBookToExcel = async (data: GuestBookEntry[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rekap Buku Tamu");

    // Add headers
    worksheet.columns = [
        { header: "Tanggal", key: "createdAt", width: 20 },
        { header: "ID Tracking", key: "trackingId", width: 20 },
        { header: "Nama", key: "name", width: 25 },
        { header: "Email", key: "email", width: 25 },
        { header: "NIK", key: "nik", width: 20 },
        { header: "Instansi", key: "agencyName", width: 25 },
        { header: "Telepon", key: "phone", width: 15 },
        { header: "Tujuan", key: "subject", width: 30 },
        { header: "Status", key: "status", width: 15 },
        { header: "Rating", key: "rating", width: 10 },
        { header: "Komentar", key: "comment", width: 30 },
    ];

    // Add data
    data.forEach((entry) => {
        worksheet.addRow({
            createdAt: new Date(entry.createdAt).toLocaleString("id-ID"),
            trackingId: entry.trackingId,
            name: entry.name,
            email: entry.email,
            nik: entry.nik,
            agencyName: entry.agencyName || "Individu",
            phone: entry.phone,
            subject: entry.subject,
            status: entry.isScanned ? "Verified" : "Menunggu",
            rating: entry.survey?.rating || "-",
            comment: entry.survey?.comment || "-",
        });
    });

    // Styling headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
    };

    // Auto-filter
    worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: 11 },
    };

    // Save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Rekap_Buku_Tamu_${new Date().toISOString().split("T")[0]}.xlsx`);
};
