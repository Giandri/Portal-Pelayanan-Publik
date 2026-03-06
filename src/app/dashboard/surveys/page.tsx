"use client";

import { useEffect, useState } from "react";
import { getSurveys, deleteSurvey } from "@/app/actions/surveys";
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
import { Star, Search, Filter, MessageSquare, ExternalLink, Trash2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { permitTypes } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface SurveyData {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    permit: {
        trackingId: string;
        applicantName: string;
        type: string;
        status: string;
    };
}

export default function SurveyPage() {
    const [surveys, setSurveys] = useState<SurveyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [ratingFilter, setRatingFilter] = useState<string>("all");
    const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const data = await getSurveys();
                setSurveys(data);
            } catch (error) {
                console.error("Failed to fetch surveys:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSurveys();
    }, []);

    const handleDelete = async () => {
        if (!surveyToDelete) return;

        setIsDeleting(true);
        try {
            const result = await deleteSurvey(surveyToDelete);
            if (result.success) {
                setSurveys((prev) => prev.filter((s) => s.id !== surveyToDelete));
                setSurveyToDelete(null);
            } else {
                alert("Gagal menghapus survei");
            }
        } catch (error) {
            console.error("Failed to delete survey:", error);
            alert("Terjadi kesalahan saat menghapus");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredSurveys = surveys.filter((survey) => {
        const matchesSearch =
            survey.permit.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            survey.permit.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (survey.comment && survey.comment.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRating = ratingFilter === "all" || survey.rating.toString() === ratingFilter;

        return matchesSearch && matchesRating;
    });

    const averageRating = surveys.length > 0
        ? surveys.reduce((acc, curr) => acc + curr.rating, 0) / surveys.length
        : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-950">Survei Kepuasan Masyarakat</h2>
                <p className="text-muted-foreground">Monitor dan kelola ulasan pengguna layanan.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Responden</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{surveys.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Ulasan masuk</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rata-rata Rating</CardTitle>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground mt-1">dari 5.0 skala</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating Sempurna (5)</CardTitle>
                        <Star className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {surveys.filter(s => s.rating === 5).length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {surveys.length > 0 ? ((surveys.filter(s => s.rating === 5).length / surveys.length) * 100).toFixed(0) : 0}% dari total
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Ulasan</CardTitle>
                            <CardDescription>
                                Berikut adalah daftar survei yang telah diisi oleh pemohon.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari ID, Nama, Komentar..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-[180px]">
                                <Select
                                    value={ratingFilter}
                                    onValueChange={setRatingFilter}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter Rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4" />
                                                <span>Semua Rating</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="5">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span>5 Bintang</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="4">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span>4 Bintang</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="3">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span>3 Bintang</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="2">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span>2 Bintang</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="1">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span>1 Bintang</span>
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
                                    <TableHead className="w-[100px]">Rating</TableHead>
                                    <TableHead>Komentar</TableHead>
                                    <TableHead>Info Pemohon</TableHead>
                                    <TableHead>Layanan</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredSurveys.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Tidak ada data ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSurveys.map((survey) => (
                                        <TableRow key={survey.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-1 font-medium">
                                                    <span className={survey.rating >= 4 ? "text-green-600" : "text-orange-600"}>
                                                        {survey.rating}
                                                    </span>
                                                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                {survey.comment ? (
                                                    <p className="truncate text-sm" title={survey.comment}>
                                                        "{survey.comment}"
                                                    </p>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic">- Tidak ada komentar -</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{survey.permit.applicantName}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">{survey.permit.trackingId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {permitTypes.find(t => t.slug === survey.permit.type)?.title || survey.permit.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(survey.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/lacak/${survey.permit.trackingId}`} target="_blank">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <ExternalLink className="w-4 h-4" />
                                                            <span className="sr-only">Lihat Detail</span>
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => setSurveyToDelete(survey.id)}
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

            <Dialog open={!!surveyToDelete} onOpenChange={(open) => !open && setSurveyToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Konfirmasi Hapus
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus ulasan ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSurveyToDelete(null)} disabled={isDeleting}>
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
