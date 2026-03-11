"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { History, Search, Calendar, ExternalLink, Trash2 } from "lucide-react";
import { Permit } from "@/lib/types";
import { statusConfig, permitTypes } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Expandable, ExpandableTrigger, ExpandableContent } from "@/components/ui/expandable";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";

export default function RiwayatPage() {
    const queryClient = useQueryClient();


    const { data: permits = [], isLoading } = useQuery<Permit[]>({
        queryKey: ['permits', 'history'],
        queryFn: async () => {
            const response = await fetch("/api/permits?isKanban=false");
            if (!response.ok) throw new Error("Failed to fetch");
            return response.json();
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/permits/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete permit");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permits"] });
            toast.success("Riwayat berhasil dihapus");
        },
        onError: () => {
            toast.error("Gagal menghapus riwayat permohonan");
        },
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Filter permits based on search and status
    const filteredPermits = permits.filter((permit) => {
        const matchesSearch =
            permit.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            permit.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            permit.subject?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || permit.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <History className="w-8 h-8 text-primary" />
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-full rounded-md" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-xl" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-blue-950">Riwayat Permohonan</h1>
                        <p className="text-muted-foreground text-sm">Lihat semua daftar riwayat rekam jejak permohonan.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cari tracking ID, nama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm border border-border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                    </div>
                    <select
                        aria-label="Filter Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="py-2 pl-3 pr-8 text-sm border border-border bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <option value="all">Semua Status</option>
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <div className="w-full min-w-[1100px] flex flex-col">
                        {/* Header */}
                        <div className="flex bg-blue-950/5 border-b border-gray-100">
                            <div className="w-[50px] shrink-0 text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-2 py-4 text-center">No.</div>
                            <div className="w-[180px] shrink-0 text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-2 py-4">No. Lacak</div>
                            <div className="w-[240px] shrink-0 text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-4 py-4">Pemohon</div>
                            <div className="w-[190px] shrink-0 text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-4 py-4">Jenis</div>
                            <div className="w-[180px] shrink-0 text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-4 py-4">Tanggal</div>
                            <div className="w-[180px] shrink-0 text-left text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-4 py-4">Status</div>
                            <div className="w-[140px] shrink-0 text-xs font-semibold text-blue-950/60 uppercase tracking-wider px-4 py-4 text-left">Aksi</div>
                            {/* Sisa ruang kosong biarkan fill ke kanan tanpa menggeser aksi */}
                            <div className="flex-1"></div>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col">
                            {filteredPermits.length === 0 ? (
                                <div className="px-5 py-12 text-center text-muted-foreground border-b border-gray-50">
                                    Tidak ada data yang ditemukan.
                                </div>
                            ) : (
                                filteredPermits.map((permit, index) => {
                                    const pType = permitTypes.find(t => t.slug === permit.type);

                                    return (
                                        <Expandable key={permit.id} expandDirection="vertical" className="border-b border-gray-100 last:border-0 hover:bg-blue-50/20 transition-colors w-full">
                                            <ExpandableTrigger className="w-full block! text-left relative focus:outline-none focus:bg-blue-50/40">
                                                <div className="flex items-center w-full min-h-[72px]">
                                                    <div className="w-[50px] shrink-0 px-2 py-4 text-center h-full flex items-center justify-center">
                                                        <span className="text-sm text-gray-500 font-medium">{index + 1}</span>
                                                    </div>
                                                    <div className="w-[180px] shrink-0 px-2 py-4 h-full flex items-center">
                                                        <span className="font-mono text-xs font-semibold text-gray-500">{permit.trackingId}</span>
                                                    </div>
                                                    <div className="w-[240px] shrink-0 px-4 py-4 h-full flex items-center">
                                                        <div className="w-full overflow-hidden">
                                                            <p className="text-sm font-medium text-gray-800 truncate">{permit.applicantName}</p>
                                                            <p className="text-xs text-gray-400 truncate mt-0.5">{permit.applicantEmail}</p>
                                                            {permit.applicantPhone && (
                                                                <p className="text-xs text-gray-400 truncate">{permit.applicantPhone}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="w-[190px] shrink-0 px-4 py-4 h-full flex items-center">
                                                        <span
                                                            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full truncate max-w-[140px]"
                                                            style={{ backgroundColor: pType?.bgColor, color: pType?.color }}
                                                        >
                                                            {pType?.title || permit.type}
                                                        </span>
                                                    </div>
                                                    <div className="w-[180px] shrink-0 px-4 py-4 h-full flex items-center">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="truncate">{formatDate(permit.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-[180px] shrink-0 px-4 py-4 h-full flex items-center">
                                                        <span
                                                            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
                                                            style={{ backgroundColor: statusConfig[permit.status].bgColor, color: statusConfig[permit.status].color }}
                                                        >
                                                            {statusConfig[permit.status].label}
                                                        </span>
                                                    </div>
                                                    <div className="w-[140px] shrink-0 px-2.5 py-4 text-left h-full flex items-center justify-start gap-1">
                                                        <div onClick={(e) => { e.stopPropagation(); }}>
                                                            <Link href={`/lacak/${permit.trackingId}`}>
                                                                <Button variant="outline" size="sm" className="gap-1.5 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all border-gray-200  bg-white font-medium text-[11px]">
                                                                    <ExternalLink className="w-3.5 h-3.5" />

                                                                </Button>
                                                            </Link>
                                                        </div>
                                                        <div onClick={(e) => { e.stopPropagation(); }}>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="gap-1.5 hover:bg-red-50 hover:text-red-600 transition-all border-gray-200 bg-white font-medium text-[11px] text-red-500"
                                                                        disabled={deleteMutation.isPending}
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent onClick={(e) => e.stopPropagation()}>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
                                                                        <DialogDescription>
                                                                            Apakah Anda yakin ingin menghapus data riwayat ini secara permanen? Data yang telah dihapus tidak dapat dikembalikan.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <DialogClose asChild>
                                                                            <Button variant="outline">Batal</Button>
                                                                        </DialogClose>
                                                                        <Button
                                                                            onClick={() => {
                                                                                deleteMutation.mutate(permit.id);
                                                                            }}
                                                                            disabled={deleteMutation.isPending}
                                                                            className="bg-red-600 hover:bg-red-700 text-white"
                                                                        >
                                                                            {deleteMutation.isPending ? "Menghapus..." : "Hapus Riwayat"}
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </div>
                                                    {/* Sisa spacer di dalam Trigger */}
                                                    <div className="flex-1 min-w-4 items-center"></div>
                                                </div>
                                            </ExpandableTrigger>

                                            <ExpandableContent preset="fade" className="bg-blue-50/20 border-t border-gray-100">
                                                <div className="py-3 px-10 text-[13px] text-gray-700">
                                                    <div className="flex flex-col gap-3 w-full">
                                                        {/* Info Pemohon */}
                                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-x-12 w-full">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400 font-medium">Nama:</span>
                                                                <span className="font-semibold">{permit.applicantName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400 font-medium">NIK:</span>
                                                                <span className="font-semibold">{permit.applicantNIK || '-'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400 font-medium">Instansi:</span>
                                                                <span className="font-semibold truncate max-w-[200px]" title={permit.agencyName || ''}>
                                                                    {permit.agencyName || '-'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-400 font-medium">Telepon:</span>
                                                                <span className="font-semibold">{permit.applicantPhone || '-'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="hidden md:block w-full h-px bg-gray-200/60"></div>

                                                        {/* Info Perihal & Catatan */}
                                                        <div className="flex flex-col md:flex-row gap-3 md:gap-x-12 w-full">
                                                            <div className="flex flex-1 min-w-0">
                                                                <span className="text-gray-400 font-medium shrink-0 mr-2">Perihal:</span>
                                                                <span className="font-semibold text-gray-800" title={permit.subject || ''}>
                                                                    {permit.subject || '-'}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-1 min-w-0">
                                                                <span className="text-gray-400 font-medium shrink-0 mr-2">Catatan:</span>
                                                                <span className="italic" title={permit.description || ''}>
                                                                    {permit.description || 'Tidak ada catatan.'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ExpandableContent>
                                        </Expandable>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
