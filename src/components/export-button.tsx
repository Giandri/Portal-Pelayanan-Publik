"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { DateRange } from "react-day-picker";
import { Permit } from "@/lib/types"; // Adjust import path as needed
import { statusConfig, permitTypes } from "@/lib/constants";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ExportButtonProps {
    dateRange: DateRange | undefined;
    permits: Permit[];
}

export function ExportButton({ dateRange, permits }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Filter permits based on date range
            const filteredPermits = permits.filter(p => {
                if (!dateRange?.from) return true;
                const permitDate = new Date(p.createdAt);
                const from = dateRange.from;
                const to = dateRange.to || dateRange.from;

                // Set filtering to be inclusive of the day
                const checkDate = new Date(permitDate);
                checkDate.setHours(0, 0, 0, 0);

                const checkFrom = new Date(from);
                checkFrom.setHours(0, 0, 0, 0);

                const checkTo = new Date(to);
                checkTo.setHours(23, 59, 59, 999);

                return checkDate >= checkFrom && checkDate <= checkTo;
            });

            if (filteredPermits.length === 0) {
                alert("Tidak ada data pada rentang tanggal yang dipilih.");
                setIsExporting(false);
                return;
            }

            // Create Workbook and Worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Laporan Perizinan");

            // --- Styling Constants ---
            const dataFont = { name: 'Segoe UI', size: 10 };
            const borderStyle: Partial<ExcelJS.Borders> = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            const statusColors: Record<string, string> = {
                'disetujui': 'FF16A34A', // Green-600
                'ditolak': 'FFDC2626',   // Red-600
                'proses': 'FFCA8A04',    // Yellow-600
                'diajukan': 'FF2563EB',  // Blue-600
            };

            // --- Title Section ---
            worksheet.mergeCells('A1:H1');
            const titleRow = worksheet.getCell('A1');
            titleRow.value = "LAPORAN REKAPITULASI PENGAJUAN PERMOHONAN DATA";
            titleRow.font = { name: 'Arial', size: 16, bold: true };
            titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.mergeCells('A2:H2');
            const subTitleRow = worksheet.getCell('A2');

            // Default: Calculate range from actual data if no filter selected
            let periodStr = "";
            let fileDateStr = "";

            if (dateRange?.from) {
                // User selected a range
                const fromStr = format(dateRange.from, "dd MMMM yyyy", { locale: id });
                const fileFromStr = format(dateRange.from, "ddMMMyyyy", { locale: id });

                if (dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime()) {
                    const toStr = format(dateRange.to, "dd MMMM yyyy", { locale: id });
                    const fileToStr = format(dateRange.to, "ddMMMyyyy", { locale: id });
                    periodStr = `${fromStr} - ${toStr}`;
                    fileDateStr = `${fileFromStr}-${fileToStr}`;
                } else {
                    periodStr = fromStr;
                    fileDateStr = fileFromStr;
                }
            } else {
                // No filter selected: Use data range (Min - Max)
                if (filteredPermits.length > 0) {
                    const dates = filteredPermits.map(p => new Date(p.createdAt).getTime());
                    const minDate = new Date(Math.min(...dates));
                    const maxDate = new Date(Math.max(...dates));

                    const fromStr = format(minDate, "dd MMMM yyyy", { locale: id });
                    const toStr = format(maxDate, "dd MMMM yyyy", { locale: id });

                    const fileFromStr = format(minDate, "ddMMMyyyy", { locale: id });
                    const fileToStr = format(maxDate, "ddMMMyyyy", { locale: id });

                    if (fromStr === toStr) {
                        periodStr = fromStr;
                        fileDateStr = fileFromStr;
                    } else {
                        periodStr = `${fromStr} - ${toStr}`;
                        fileDateStr = `${fileFromStr}-${fileToStr}`;
                    }
                } else {
                    // Fallback if no data
                    periodStr = format(new Date(), "dd MMMM yyyy", { locale: id });
                    fileDateStr = format(new Date(), "yyyyMMdd");
                }
            }

            // Set period value (No "Periode:" prefix)
            subTitleRow.value = periodStr;
            subTitleRow.font = { name: 'Arial', size: 12, italic: true };
            subTitleRow.alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.addRow([]);

            // --- Table Header ---
            const headers = ["No", "Tanggal", "No. Tracking", "Pemohon", "Perihal", "Jenis Izin", "Status", "Link Detail"];
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell: ExcelJS.Cell) => {
                cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0F172A' } // Slate-900 (Modern Dark)
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = borderStyle;
            });

            // Adjust Column Widths
            worksheet.columns = [
                { width: 5 },   // No
                { width: 20 },  // Tanggal
                { width: 25 },  // Tracking
                { width: 30 },  // Pemohon
                { width: 40 },  // Perihal
                { width: 25 },  // Jenis
                { width: 15 },  // Status
                { width: 30 },  // Link
            ];

            // --- Data Rows ---
            filteredPermits.forEach((permit, index) => {
                const statusInfo = statusConfig[permit.status];
                const typeInfo = permitTypes.find(t => t.slug === permit.type);

                const linkUrl = `${window.location.origin}/lacak/${permit.trackingId}`;

                const rowData = [
                    index + 1,
                    format(new Date(permit.createdAt), "dd/MM/yyyy HH:mm"),
                    permit.trackingId,
                    permit.applicantName,
                    permit.subject,
                    typeInfo?.title || permit.type,
                    statusInfo?.label || permit.status,
                ];

                const row = worksheet.addRow([...rowData, { text: "Buka Detail", hyperlink: linkUrl, tooltip: "Klik untuk melihat detail permohonan" }]);

                // Cell Styling
                row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
                    cell.font = dataFont;
                    cell.border = borderStyle;
                    cell.alignment = { vertical: 'top', wrapText: true };

                    if ([1, 2, 7, 8].includes(colNumber)) {
                        cell.alignment = { vertical: 'top', horizontal: 'center', wrapText: true };
                    }

                    if (colNumber === 7) {
                        const color = statusColors[permit.status] || 'FF000000';
                        cell.font = { ...dataFont, bold: true, color: { argb: color } };
                    }

                    if (colNumber === 8) {
                        cell.font = { ...dataFont, color: { argb: 'FF2563EB' }, underline: true };
                    }
                });
            });

            // Generate file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

            const fileName = `Laporan_Perizinan_${fileDateStr}.xlsx`;
            saveAs(blob, fileName);

        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal mengekspor data.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
            className="gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
        >
            {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            Export Excel
        </Button>
    );
}
