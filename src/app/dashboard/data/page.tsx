"use client";

import { useState, useEffect } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ExternalLink, Trash2, Copy, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface UploadedFile {
    id: string; // or key
    key: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: number | string | Date;
    status: string;
    permitTitle?: string;
    applicantName?: string;
}

export default function KelolaDataPage() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/uploadthing/manage');
            const data = await response.json();

            if (data.files) {
                setUploadedFiles(data.files.map((f: any) => ({
                    ...f,
                    url: f.url || `https://utfs.io/f/${f.key}`,
                    name: f.name || f.key
                })));
            } else if (Array.isArray(data)) {
                setUploadedFiles(data.map((f: any) => ({
                    ...f,
                    url: f.url || `https://utfs.io/f/${f.key}`,
                    name: f.name || f.key
                })));
            }
        } catch (error) {
            console.error("Failed to fetch files:", error);
            toast.error("Gagal memuat daftar file");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUploadComplete = (res: any[]) => {
        toast.success("File berhasil diupload!");
        fetchFiles(); // Refresh list
    };

    const handleUploadError = (error: Error) => {
        toast.error(`Gagal upload: ${error.message}`);
    };

    const handleDelete = async (fileKey: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus file ini?")) return;

        setIsDeleting(fileKey);
        try {
            const response = await fetch('/api/uploadthing/manage', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileKey })
            });

            if (!response.ok) throw new Error("Gagal menghapus");

            toast.success("File berhasil dihapus");
            setUploadedFiles(prev => prev.filter(f => f.key !== fileKey));
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Gagal menghapus file");
        } finally {
            setIsDeleting(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("URL disalin ke clipboard");
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-4 md:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Kelola Data & File</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Kelola file dokumen.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchFiles} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">


                        {/* File List Section */}
                        <div className="lg:col-span-1">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Daftar File</span>
                                        <span className="text-sm font-normal text-muted-foreground">Total: {uploadedFiles.length} file</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Mengelola semua file yang tersimpan.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="space-y-4">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="flex items-start justify-between p-4 bg-white border rounded-xl shadow-sm">
                                                    <div className="flex gap-4 items-center w-full">
                                                        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                                                        <div className="space-y-2 flex-1">
                                                            <Skeleton className="h-4 w-48" />
                                                            <Skeleton className="h-3 w-32" />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 pl-4">
                                                        <Skeleton className="h-8 w-8 rounded-md" />
                                                        <Skeleton className="h-8 w-8 rounded-md" />
                                                        <Skeleton className="h-8 w-8 rounded-md" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : uploadedFiles.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Belum ada file yang tersimpan.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {uploadedFiles.map((file, idx) => (
                                                <div key={file.key || idx} className="flex items-start justify-between p-4 bg-white border rounded-xl shadow-sm hover:border-primary/50 transition-colors group">
                                                    <div className="flex gap-4 items-center overflow-hidden">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                            <FileText className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <div className="space-y-1 min-w-0">
                                                            <p className="font-medium text-sm truncate pr-4" title={file.name}>
                                                                {file.name}
                                                            </p>
                                                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                                                <div className="flex items-center gap-2">
                                                                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                                    <span>•</span>
                                                                    <span>
                                                                        {file.uploadedAt
                                                                            ? format(new Date(file.uploadedAt), "dd MMM yyyy HH:mm", { locale: id })
                                                                            : "-"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-0.5 mt-1 border-l-2 border-gray-200 pl-2">
                                                                    <span className="font-medium text-gray-700">Tujuan: {file.permitTitle || "-"}</span>
                                                                    <span>Pemohon: {file.applicantName || "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                            onClick={() => copyToClipboard(file.url)}
                                                            title="Salin URL"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </Button>
                                                        <Link href={file.url} target="_blank">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Buka File">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                            title="Hapus File"
                                                            onClick={() => handleDelete(file.key)}
                                                            disabled={isDeleting === file.key}
                                                        >
                                                            {isDeleting === file.key ? (
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
