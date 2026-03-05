"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Calendar,
    Search,
    Filter,
    Star,
    MessageSquare,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { ExportButton } from "@/components/export-button";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { permitTypes, statusConfig } from "@/lib/constants";
import { type Permit, type PermitStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
// import axios from "axios";


// Stats Cards Configuration
const statsCards = [
    {
        label: "Total Permohonan",
        icon: FileText,
        color: "#d97706",
        bgColor: "#fef3c7",
        getValue: (permits: Permit[]) => permits.length,
    },
    {
        label: "Dalam Proses",
        icon: Clock,
        color: "#f59e0b",
        bgColor: "#fef3c7",
        getValue: (permits: Permit[]) =>
            permits.filter((p) => ["diajukan", "proses"].includes(p.status)).length,
    },
    {
        label: "Disetujui",
        icon: CheckCircle2,
        color: "#22c55e",
        bgColor: "#dcfce7",
        getValue: (permits: Permit[]) => permits.filter((p) => p.status === "disetujui").length,
    },
    {
        label: "Ditolak",
        icon: XCircle,
        color: "#ef4444",
        bgColor: "#fee2e2",
        getValue: (permits: Permit[]) => permits.filter((p) => p.status === "ditolak").length,
    },
];

export default function DashboardClient() {
    const { data: initialPermits = [], isLoading, error } = useQuery<Permit[]>({
        queryKey: ['permits'],
        queryFn: async () => {
            const response = await fetch('/api/permits');
            if (!response.ok) throw new Error('Failed to fetch permits');
            return response.json();
        }
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Page Title Skeleton */}
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-5">
                            <div className="flex items-center justify-between mb-3">
                                <Skeleton className="w-11 h-11 rounded-xl" />
                                <Skeleton className="w-4 h-4 rounded" />
                            </div>
                            <Skeleton className="h-9 w-16 mb-2" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-8 w-12" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-64 rounded-xl" />
                                <Skeleton className="h-10 w-10 rounded-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between gap-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
                <XCircle className="w-10 h-10 mb-2" />
                <p>Gagal memuat data permohonan</p>
            </div>
        );
    }

    const permits: Permit[] = initialPermits.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        date: new Date(p.submissionDate || p.createdAt),
        status: p.status as PermitStatus,
        statusHistory: p.statusHistory?.map((h: any) => ({
            ...h,
            status: h.status as PermitStatus,
            date: h.date
        })) || []
    }));

    // Filter by Date Range
    const dateFilteredPermits = permits.filter((p) => {
        if (!dateRange?.from) return true;
        const permitDate = new Date(p.createdAt);
        const from = dateRange.from;
        const to = dateRange.to || dateRange.from;

        // Reset hours for accurate date comparison
        const checkDate = new Date(permitDate);
        checkDate.setHours(0, 0, 0, 0);

        const checkFrom = new Date(from);
        checkFrom.setHours(0, 0, 0, 0);

        const checkTo = new Date(to);
        checkTo.setHours(23, 59, 59, 999);

        return checkDate >= checkFrom && checkDate <= checkTo;
    });

    const filteredPermits = dateFilteredPermits.filter(
        (p) =>
            p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.trackingId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Dynamic stats based on permits
    const statusCounts = {
        diajukan: dateFilteredPermits.filter(p => p.status === "diajukan").length,
        proses: dateFilteredPermits.filter(p => p.status === "proses").length,
        disetujui: dateFilteredPermits.filter(p => p.status === "disetujui").length,
        ditolak: dateFilteredPermits.filter(p => p.status === "ditolak").length,
    };

    // Calculate total for pie chart percentages if needed
    const total = dateFilteredPermits.length || 1;
    const statusPieData = [
        { name: "Diajukan", value: Math.round((statusCounts.diajukan / total) * 100), color: "#f59e0b" },
        { name: "Dalam Proses", value: Math.round((statusCounts.proses / total) * 100), color: "#3b82f6" },
        { name: "Disetujui", value: Math.round((statusCounts.disetujui / total) * 100), color: "#22c55e" },
        { name: "Ditolak", value: Math.round((statusCounts.ditolak / total) * 100), color: "#ef4444" },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6">
            {/* Page Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-950">Ringkasan</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Selamat datang di Dashboard Layanan Publik
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                    <ExportButton dateRange={dateRange} permits={permits} />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => {
                    const value = stat.getValue(dateFilteredPermits);
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-5 hover:shadow-xl hover:bg-white/25 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: stat.bgColor }}
                                >
                                    <stat.icon
                                        className="w-5 h-5"
                                        style={{ color: stat.color }}
                                    />
                                </div>
                                <TrendingUp className="w-4 h-4 text-gray-300" />
                            </div>
                            <p className="text-3xl font-bold text-blue-950">{value}</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">
                                {stat.label}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Survey Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(() => {
                    const surveyPermits = dateFilteredPermits.filter(p => p.survey);
                    const totalSurveys = surveyPermits.length;
                    const averageRating = totalSurveys > 0
                        ? surveyPermits.reduce((acc, p) => acc + (p.survey?.rating || 0), 0) / totalSurveys
                        : 0;

                    const satisfactionLabel = averageRating >= 4.5 ? "Sangat Baik" :
                        averageRating >= 4.0 ? "Baik" :
                            averageRating >= 3.0 ? "Cukup" :
                                averageRating > 0 ? "Kurang" : "-";

                    return (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2 text-blue-100">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">Indeks Kepuasan (IKM)</span>
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
                                        <div className="mb-1">
                                            <p className="font-semibold text-lg leading-none">{satisfactionLabel}</p>
                                            <p className="text-xs text-blue-200">dari 5.0</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-5 flex flex-col justify-center"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <span className="text-gray-500 font-medium">Total Responden</span>
                                </div>
                                <p className="text-3xl font-bold text-blue-950 pl-1">{totalSurveys}</p>
                                <p className="text-xs text-gray-400 pl-1 mt-1">Pengguna mengisi survei</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-5"
                            >
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Distribusi Penilaian</h4>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map(stars => {
                                        const count = surveyPermits.filter(p => p.survey?.rating === stars).length;
                                        const percentage = totalSurveys > 0 ? (count / totalSurveys) * 100 : 0;
                                        return (
                                            <div key={stars} className="flex items-center gap-2 text-xs">
                                                <div className="flex items-center gap-1 w-12 shrink-0">
                                                    <span className="font-mono font-medium">{stars}</span>
                                                    <Star className="w-3 h-3 text-gray-400" />
                                                </div>
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right text-gray-500 tabular-nums">{count}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </>
                    );
                })()}
            </div>

            {/* Recent Permits Table */}

            {/* Recent Permits Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden"
            >
                {/* Table Header */}
                <div className="p-5 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-blue-950">
                                Daftar Permohonan
                            </h3>
                            <div className="text-2xl font-bold mt-1">
                                {permits.filter((p) => ["diajukan", "proses"].includes(p.status)).length}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari permohonan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300 w-full sm:w-64 transition-all"
                                />
                            </div>
                            <button title="Filter" className="p-2 bg-gray-50/80 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                                <Filter className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-blue-950/5">
                                <th className="text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-5 py-3">
                                    No. Tracking
                                </th>
                                <th className="text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-5 py-3">
                                    Pemohon
                                </th>
                                <th className="text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-5 py-3">
                                    Perihal
                                </th>
                                <th className="text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-5 py-3">
                                    Jenis
                                </th>
                                <th className="text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-5 py-3">
                                    Tanggal
                                </th>
                                <th className="text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-5 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPermits.map((permit, index) => {
                                const statusInfo = statusConfig[permit.status];
                                const permitType = permitTypes.find(
                                    (p) => p.slug === permit.type
                                );
                                return (
                                    <motion.tr
                                        key={permit.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.0 + index * 0.05 }}
                                        className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-sm font-semibold text-gray-700">
                                                {permit.trackingId}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {permit.applicantName}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {permit.applicantEmail}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-gray-700 max-w-[200px] truncate">
                                                {permit.subject}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: permitType?.bgColor,
                                                    color: permitType?.color,
                                                }}
                                            >
                                                {permitType?.title}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(permit.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full"
                                                style={{
                                                    backgroundColor: statusInfo.bgColor,
                                                    color: statusInfo.color,
                                                }}
                                            >
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredPermits.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">
                            Tidak ada permohonan yang ditemukan
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
