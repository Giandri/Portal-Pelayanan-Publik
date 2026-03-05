"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    UserCircle,
    Search,
    Mail,
    Phone,
    FileText,
    MapPin,
    Calendar,
    MoreHorizontal,
    Building2,
    User,
    Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Applicant } from "@/app/actions/applicants";
const typeColors: Record<string, { bg: string; text: string }> = {
    "badan-usaha": { bg: "bg-amber-100", text: "text-amber-700" },
    "instansi-pemerintah": { bg: "bg-blue-100", text: "text-blue-700" },
    "akademik": { bg: "bg-purple-100", text: "text-purple-700" },
    "individu": { bg: "bg-green-100", text: "text-green-700" },
};

// Default color for unknown types
const defaultTypeColor = { bg: "bg-gray-100", text: "text-gray-700" };

const typeLabels: Record<string, string> = {
    "badan-usaha": "Badan Usaha",
    "instansi-pemerintah": "Instansi Pemerintah",
    "akademik": "Akademisi",
    "individu": "Perorangan",
};

export default function ProfilPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("semua");

    const { data: applicants = [], isLoading } = useQuery<Applicant[]>({
        queryKey: ['applicants'],
        queryFn: async () => {
            const res = await axios.get<Applicant[]>('/api/applicants');
            return res.data;
        }
    });

    const filteredApplicants = useMemo(() => {
        return applicants.filter((a) => {
            const matchesSearch =
                a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (a.nik && a.nik.includes(searchQuery));
            const matchesType = selectedType === "semua" || a.type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [applicants, searchQuery, selectedType]);

    // Dynamic types based on available data
    const types = useMemo(() => {
        const uniqueTypes = new Set(applicants.map(a => a.type));
        return ["semua", ...Array.from(uniqueTypes)];
    }, [applicants]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-xl" />
                                <div>
                                    <Skeleton className="h-8 w-12 mb-1" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                    <div className="flex gap-2">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-24 rounded-xl" />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-11 h-11 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="w-6 h-6 rounded-lg" />
                            </div>
                            <div className="space-y-3 mb-4">
                                <Skeleton className="h-3 w-40" />
                                <Skeleton className="h-3 w-36" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-white/20">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Stats Calculation
    const totalApplicants = applicants.length;
    const badanUsahaCount = applicants.filter(a => a.type === "badan-usaha").length;
    const instansiCount = applicants.filter(a => a.type === "instansi-pemerintah").length;
    const peroranganCount = applicants.filter(a => a.type === "individu").length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-blue-950">Profil Pemohon</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Data pemohon yang terdaftar dalam sistem
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Pemohon", value: totalApplicants, icon: UserCircle, color: "#d97706" },
                    { label: "Badan Usaha", value: badanUsahaCount, icon: Building2, color: "#f59e0b" },
                    { label: "Instansi", value: instansiCount, icon: Building2, color: "#172554" },
                    { label: "Perorangan", value: peroranganCount, icon: User, color: "#22c55e" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${stat.color}20` }}
                            >
                                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-950">{stat.value}</p>
                                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filter & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau NIK..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 placeholder-gray-400 transition-all backdrop-blur-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={cn(
                                "px-3 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap",
                                selectedType === type
                                    ? "bg-blue-950 text-yellow-400 border-blue-950"
                                    : "bg-white/20 backdrop-blur-lg text-gray-600 border-white/30 hover:bg-white/30"
                            )}
                        >
                            {type === "semua" ? "Semua" : (typeLabels[type] || type)}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Applicant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApplicants.map((applicant, index) => {
                    const typeColor = typeColors[applicant.type] || defaultTypeColor;
                    return (
                        <motion.div
                            key={applicant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-5 hover:bg-white/15 hover:shadow-xl transition-all group cursor-pointer"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-blue-950 font-bold text-lg shadow-md">
                                        {applicant.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-950 group-hover:text-blue-900 transition-colors">
                                            {applicant.name}
                                        </h4>
                                        <span className={cn("inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold mt-0.5", typeColor.bg, typeColor.text)}>
                                            {typeLabels[applicant.type] || applicant.type}
                                        </span>
                                    </div>
                                </div>
                                <button title="Opsi lainnya" className="p-1 rounded-lg hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4">
                                {applicant.organization && (
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="truncate">{applicant.organization}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{applicant.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span>{applicant.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{applicant.address || "-"}</span>
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div className="flex items-center justify-between pt-3 border-t border-white/20">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-yellow-500" />
                                        <span className="text-xs font-semibold text-gray-700">{applicant.totalPermits} permohonan</span>
                                    </div>
                                    {applicant.activePermits > 0 && (
                                        <span className="text-xs px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-bold">
                                            {applicant.activePermits} aktif
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(applicant.joinDate).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {!isLoading && filteredApplicants.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                        <UserCircle className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-950 mb-1">
                        Belum ada pemohon
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        {searchQuery
                            ? `Tidak ditemukan pemohon dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
                            : "Belum ada data pemohon yang terdaftar dalam sistem saat ini."}
                    </p>
                </div>
            )}
        </div>
    );
}
