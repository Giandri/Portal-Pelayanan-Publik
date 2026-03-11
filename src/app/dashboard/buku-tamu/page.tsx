"use client";

import { useEffect, useState } from "react";
import { getGuestBooks, deleteGuestBook } from "@/app/actions/guest-book";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Search,
    Filter,
    BookOpen,
    Users,
    ScanLine,
    Star,
    Trash2,
    AlertCircle,
    Eye,
    X,
    Mail,
    Phone,
    Building2,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

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

export default function BukuTamuDashboardPage() {
    const [entries, setEntries] = useState<GuestBookEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [scanFilter, setScanFilter] = useState<string>("all");
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [detailEntry, setDetailEntry] = useState<GuestBookEntry | null>(null);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const data = await getGuestBooks();
                setEntries(data);
            } catch (error) {
                console.error("Failed to fetch guest books:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEntries();
    }, []);

    const handleDelete = async () => {
        if (!entryToDelete) return;
        setIsDeleting(true);
        try {
            const result = await deleteGuestBook(entryToDelete);
            if (result.success) {
                setEntries((prev) => prev.filter((e) => e.id !== entryToDelete));
                setEntryToDelete(null);
            } else {
                alert("Gagal menghapus data buku tamu");
            }
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("Terjadi kesalahan saat menghapus");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredEntries = entries.filter((entry) => {
        const matchesSearch =
            entry.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.subject.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesScan =
            scanFilter === "all" ||
            (scanFilter === "scanned" && entry.isScanned) ||
            (scanFilter === "unscanned" && !entry.isScanned);

        return matchesSearch && matchesScan;
    });

    const scannedCount = entries.filter((e) => e.isScanned).length;
    const surveyCount = entries.filter((e) => e.survey).length;
    const todayCount = entries.filter((e) => {
        const today = new Date();
        const entryDate = new Date(e.createdAt);
        return entryDate.toDateString() === today.toDateString();
    }).length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-950">Monitoring Buku Tamu</h2>
                <p className="text-muted-foreground">Kelola dan pantau data kunjungan tamu.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Kunjungan</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{entries.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Semua data tamu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Kunjungan hari ini</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sudah Di-scan</CardTitle>
                        <ScanLine className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{scannedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {entries.length > 0 ? ((scannedCount / entries.length) * 100).toFixed(0) : 0}% terverifikasi
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mengisi Survei</CardTitle>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{surveyCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {entries.length > 0 ? ((surveyCount / entries.length) * 100).toFixed(0) : 0}% memberikan ulasan
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Kunjungan Tamu</CardTitle>
                            <CardDescription>
                                Daftar semua pengunjung yang telah mengisi buku tamu digital.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, ID, email..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-[180px]">
                                <Select value={scanFilter} onValueChange={setScanFilter}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4" />
                                                <span>Semua</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="scanned">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                <span>Sudah Scan</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="unscanned">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-orange-500" />
                                                <span>Belum Scan</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[140px]">ID Kunjungan</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Tujuan</TableHead>
                                    <TableHead>Instansi</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-center">Survei</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto" /></TableCell>
                                            <TableCell><div className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto" /></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-8 w-16 bg-gray-200 rounded animate-pulse ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredEntries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            Tidak ada data ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEntries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                <span className="font-mono text-xs font-semibold text-blue-700">{entry.trackingId}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{entry.name}</span>
                                                    <span className="text-xs text-muted-foreground">{entry.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm truncate max-w-[150px] block" title={entry.subject}>{entry.subject}</span>
                                            </TableCell>
                                            <TableCell>
                                                {entry.agencyName ? (
                                                    <Badge variant="outline" className="text-xs font-normal">{entry.agencyName}</Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Individu</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {entry.isScanned ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Menunggu
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {entry.survey ? (
                                                    <div className="flex items-center justify-center gap-0.5">
                                                        <span className="text-sm font-semibold">{entry.survey.rating}</span>
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(entry.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setDetailEntry(entry)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className="sr-only">Detail</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => setEntryToDelete(entry.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="sr-only">Hapus</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!detailEntry} onOpenChange={(open) => !open && setDetailEntry(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Detail Kunjungan
                        </DialogTitle>
                        <DialogDescription>
                            {detailEntry?.trackingId}
                        </DialogDescription>
                    </DialogHeader>
                    {detailEntry && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> Nama</p>
                                    <p className="text-sm font-medium">{detailEntry.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                                    <p className="text-sm font-medium">{detailEntry.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> Telepon</p>
                                    <p className="text-sm font-medium">{detailEntry.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">NIK</p>
                                    <p className="text-sm font-medium font-mono">{detailEntry.nik}</p>
                                </div>
                                {detailEntry.agencyName && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="w-3 h-3" /> Instansi</p>
                                        <p className="text-sm font-medium">{detailEntry.agencyName}</p>
                                    </div>
                                )}
                                {detailEntry.agencyCategory && (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Kategori</p>
                                        <p className="text-sm font-medium">{detailEntry.agencyCategory}</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-3 space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="w-3 h-3" /> Tujuan</p>
                                <p className="text-sm font-medium">{detailEntry.subject}</p>
                                {detailEntry.description && (
                                    <p className="text-sm text-gray-600 mt-1">{detailEntry.description}</p>
                                )}
                            </div>

                            <div className="border-t pt-3 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Status Verifikasi</p>
                                    {detailEntry.isScanned ? (
                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Terverifikasi
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                            <Clock className="w-3 h-3 mr-1" /> Menunggu Scan
                                        </Badge>
                                    )}
                                </div>
                                {detailEntry.survey && (
                                    <div className="space-y-1 text-right">
                                        <p className="text-xs text-muted-foreground">Survei Kepuasan</p>
                                        <div className="flex items-center gap-1 justify-end">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i <= detailEntry.survey!.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                        {detailEntry.survey.comment && (
                                            <p className="text-xs text-gray-600 italic max-w-[200px]">"{detailEntry.survey.comment}"</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Waktu Kunjungan</p>
                                <p className="text-sm font-medium">{formatDate(detailEntry.createdAt)}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Konfirmasi Hapus
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data kunjungan ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEntryToDelete(null)} disabled={isDeleting}>
                            Batal
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
