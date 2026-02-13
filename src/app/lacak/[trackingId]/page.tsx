"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Clock,
    Search,
    FileText,
    User,
    Calendar,
    AlertCircle,
    ArrowLeft,
    Check,
    Package,
    ShieldCheck,
    Truck,
    XCircle,
    ExternalLink,
    Download,
    Droplets,
    CloudRain,
    Star,
    MessageSquare,
    Send
} from "lucide-react";
import { Rating, RatingButton } from "@/components/kibo-ui/rating";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusConfig, processSteps, permitTypes } from "@/lib/constants";
import { Permit } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
    FileText,
    Droplets,
    CloudRain
};

export default function LacakDetail() {
    const params = useParams();
    const trackingId = params.trackingId as string;
    const [permit, setPermit] = useState<Permit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Survey State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);

    const handleSubmitSurvey = async () => {
        if (rating === 0) {
            toast.error("Mohon berikan penilaian bintang");
            return;
        }

        setIsSubmittingSurvey(true);
        try {
            const response = await fetch("/api/surveys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    trackingId: permit?.trackingId,
                    rating,
                    comment
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gagal mengirim survei");
            }

            toast.success("Terima kasih atas penilaian Anda!");

            // Update local permit state to show submitted state immediately
            if (permit) {
                setPermit({
                    ...permit,
                    survey: {
                        rating,
                        comment,
                        createdAt: new Date().toISOString()
                    }
                });
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSubmittingSurvey(false);
        }
    };

    useEffect(() => {
        const fetchPermit = async () => {
            try {
                const response = await fetch(`/api/permits/track/${trackingId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Nomor tracking tidak ditemukan");
                    }
                    throw new Error("Gagal mengambil data");
                }
                const data = await response.json();
                setPermit(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (trackingId) {
            fetchPermit();
        }
    }, [trackingId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !permit) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 container mx-auto max-w-2xl px-4 py-32 text-center">
                    <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Oops! Ada Masalah</h2>
                        <p className="mb-6">{error || "Data permohonan tidak ditemukan"}</p>
                        <Link href="/lacak">
                            <Button variant="outline">Kembali ke Pencarian</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-8 md:pb-12 relative">
            {/* Parallax Background */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg-1.png')" }}
            />
            <div className="fixed inset-0 -z-10 bg-white/40" />

            <div className="container mx-auto max-w-4xl px-4">
                <Navbar />

                <div className="mt-8">
                    <Link href="/lacak" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Pelacakan
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card>
                                    <CardHeader className="border-b bg-muted/30">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <Badge variant="outline" className="mb-2 font-mono">
                                                    {permit.trackingId}
                                                </Badge>
                                                {(() => {
                                                    const permitType = permitTypes.find(p => p.slug === permit.type);
                                                    const Icon = permitType && iconMap[permitType.icon] ? iconMap[permitType.icon] : FileText;

                                                    return (
                                                        <CardTitle className="text-xl md:text-2xl flex items-center gap-3">
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border border-black/5"
                                                                style={{
                                                                    backgroundColor: permitType?.bgColor || "#f3f4f6",
                                                                    color: permitType?.color || "#6b7280"
                                                                }}
                                                            >
                                                                <Icon className="w-6 h-6" />
                                                            </div>
                                                            {permitType?.title || permit.type}
                                                        </CardTitle>
                                                    );
                                                })()}
                                            </div>
                                            <div
                                                className="px-4 py-2 rounded-full text-sm font-semibold text-center"
                                                style={{
                                                    backgroundColor: statusConfig[permit.status].bgColor,
                                                    color: statusConfig[permit.status].color
                                                }}
                                            >
                                                {statusConfig[permit.status].label}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" /> Deskripsi Permohonan
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed bg-muted/20 font-bold rounded-xl">
                                                    {permit.subject}
                                                </p>
                                                <p className="text-gray-700 leading-relaxed bg-muted/20 rounded-xl">
                                                    {permit.description}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pemohon</h4>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-primary" />
                                                        <span className="font-medium">{permit.applicantName}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tanggal Masuk</h4>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-primary" />
                                                        <span className="font-medium">{formatDate(permit.submissionDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Timeline - TikTok Shop Style */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-gray-100">
                                    <CardHeader className="bg-white pb-2">
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-primary" />
                                            </div>
                                            Status Perjalanan Dokumen
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 bg-white">
                                        <div className="relative space-y-0">
                                            {/* Vertical Line */}
                                            <div className="absolute left-4 top-2 bottom-10 w-[2px] bg-gray-100" />
                                            <div
                                                className="absolute left-4 top-2 bottom-10 w-[2px] bg-primary transition-all duration-1000 origin-top"
                                                style={{
                                                    height: `${permit.status === 'disetujui' || permit.status === 'ditolak' ? '100%' :
                                                        permit.status === 'proses' ? '50%' : '0%'
                                                        }`
                                                }}
                                            />

                                            {processSteps.map((step, idx) => {
                                                // Determine status state
                                                let state: 'completed' | 'current' | 'pending' = 'pending';

                                                // Step 1: Pengajuan (Always completed or current)
                                                if (step.id === 'diajukan') {
                                                    state = 'completed';
                                                }

                                                // Step 2: Proses
                                                if (step.id === 'proses') {
                                                    if (permit.status === 'proses') state = 'current';
                                                    else if (['disetujui', 'ditolak'].includes(permit.status)) state = 'completed';
                                                }

                                                // Step 3: Keputusan
                                                if (step.id === 'disetujui') { // Target ID in constants is 'disetujui' for the last step
                                                    if (['disetujui', 'ditolak'].includes(permit.status)) state = 'completed';
                                                    else if (permit.status === 'proses') state = 'pending';
                                                }

                                                // Special handling for rejection
                                                const isRejected = step.id === 'disetujui' && permit.status === 'ditolak';

                                                // Find matching history for date if available
                                                // We try to find the *latest* log that matches this step's intent
                                                const historyLog = permit.statusHistory.find(h => {
                                                    if (step.id === 'diajukan') return h.status === 'diajukan';
                                                    if (step.id === 'proses') return h.status === 'proses';
                                                    if (step.id === 'disetujui') return ['disetujui', 'ditolak'].includes(h.status);
                                                    return false;
                                                });

                                                return (
                                                    <div key={step.id} className="relative pl-12 pb-10 last:pb-0">
                                                        {/* Node Icon */}
                                                        <div
                                                            className={cn(
                                                                "absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4 transition-all duration-300",
                                                                state === 'completed' ? (isRejected ? "bg-red-500 border-red-100" : "bg-primary border-primary/20") :
                                                                    state === 'current' ? "bg-white border-primary animate-pulse" :
                                                                        "bg-gray-100 border-white"
                                                            )}
                                                        >
                                                            {state === 'completed' ? (
                                                                isRejected ? <XCircle className="w-4 h-4 text-white" /> : <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                                            ) : state === 'current' ? (
                                                                <div className="w-3 h-3 bg-primary rounded-full" />
                                                            ) : (
                                                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div className={cn(
                                                            "flex flex-col gap-1 transition-all duration-500",
                                                            state === 'pending' ? "opacity-50 grayscale" : "opacity-100"
                                                        )}>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <h4 className={cn(
                                                                    "text-sm md:text-base font-bold tracking-tight",
                                                                    isRejected ? "text-red-600" : "text-gray-900"
                                                                )}>
                                                                    {step.id === 'disetujui' && isRejected ? "Ditolak" : step.label}
                                                                </h4>
                                                                {historyLog && (
                                                                    <span className="text-[10px] md:text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 whitespace-nowrap">
                                                                        {formatDate(historyLog.date)}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="text-xs text-muted-foreground">
                                                                {step.description}
                                                            </p>

                                                            {/* Show rejection reason only on the final step if rejected */}
                                                            {isRejected && permit.rejectionReason && (
                                                                <div className="mt-2 text-xs bg-red-50 text-red-600 p-2 rounded-md border border-red-100">
                                                                    Alasan: {permit.rejectionReason}
                                                                </div>
                                                            )}

                                                            {/* Show output files if approved */}
                                                            {step.id === 'disetujui' && permit.status === 'disetujui' && (
                                                                (() => {
                                                                    const outputFiles = permit.attachments?.filter(a => a.category === 'output');
                                                                    if (!outputFiles || outputFiles.length === 0) return null;

                                                                    return (
                                                                        <div className="mt-4 space-y-3">
                                                                            {outputFiles.map((file, fIdx) => (
                                                                                <div key={file.id || fIdx} className="bg-white border text-left border-gray-200 shadow-sm rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 transition-all hover:border-primary/30 hover:shadow-md">
                                                                                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                                                                        <FileText className="w-5 h-5 text-green-600" />
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                                                            {file.name}
                                                                                        </p>
                                                                                        <p className="text-xs text-muted-foreground">
                                                                                            Dokumen Resmi • {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 pt-2 sm:pt-0">
                                                                                        {file.url && (
                                                                                            <>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="ghost"
                                                                                                    className="h-8 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5"
                                                                                                    onClick={() => window.open(file.url, '_blank')}
                                                                                                >
                                                                                                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                                                                                    Preview
                                                                                                </Button>
                                                                                                <a
                                                                                                    href={`/api/download?url=${encodeURIComponent(file.url)}&filename=${encodeURIComponent(`${permitTypes.find(t => t.slug === permit.type)?.title || 'Dokumen'} - ${file.name}`)}`}
                                                                                                    download
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                >
                                                                                                    <Button
                                                                                                        size="sm"
                                                                                                        className="h-8 text-xs font-medium bg-primary text-white shadow-sm hover:bg-primary/90"
                                                                                                    >
                                                                                                        <Download className="w-3.5 h-3.5 mr-1.5" />
                                                                                                        Download
                                                                                                    </Button>
                                                                                                </a>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    );
                                                                })()
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Sidebar Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Survey Section */}
                            {permit.status === 'disetujui' || permit.status === 'ditolak' ? (
                                <Card className={cn(
                                    "border-2 transition-all duration-500 overflow-hidden relative",
                                    permit.survey ? "border-green-100 bg-green-50/30" : "border-primary/10 bg-linear-to-br from-white to-blue-50/50"
                                )}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            {permit.survey ? (
                                                <>
                                                    <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </div>
                                                    Terima Kasih!
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                                                        <Star className="w-4 h-4" />
                                                    </div>
                                                    Survei Kepuasan
                                                </>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2 space-y-4">
                                        {permit.survey ? (
                                            <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">
                                                    Anda telah memberikan penilaian pada tanggal {formatDate(permit.survey.createdAt)}.
                                                </p>
                                                <div className="flex flex-col gap-1 bg-white/60 p-3 rounded-lg border border-black/5">
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    star <= (permit.survey?.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    {permit.survey.comment && (
                                                        <p className="text-sm text-gray-700 italic mt-1">
                                                            "{permit.survey.comment}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Bagaimana pengalaman Anda?
                                                </p>

                                                <div className="flex flex-col items-center gap-2 py-2">
                                                    <Rating
                                                        value={rating}
                                                        onValueChange={setRating}
                                                        className="gap-2"
                                                    >
                                                        {[1, 2, 3, 4, 5].map((index) => (
                                                            <RatingButton
                                                                key={index}
                                                                index={index}
                                                                className={cn(
                                                                    "w-8 h-8 transition-all hover:scale-110",
                                                                    index + 1 <= rating ? "text-yellow-400 fill-yellow-300" : "text-yellow-300"
                                                                )}
                                                            />
                                                        ))}
                                                    </Rating>
                                                    <span className="text-xs font-medium text-muted-foreground">
                                                        {rating === 0 ? "Pilih bintang" :
                                                            rating === 5 ? "Sangat Puas! 😍" :
                                                                rating === 4 ? "Puas 😊" :
                                                                    rating === 3 ? "Cukup 🙂" :
                                                                        rating === 2 ? "Kurang 😐" : "Sangat Kurang 😞"
                                                        }
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <Textarea
                                                        placeholder="Berikan komentar dan masukan Anda . . ."
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                        className="resize-none bg-white/80 min-h-[80px] text-sm"
                                                    />
                                                </div>

                                                <Button
                                                    onClick={handleSubmitSurvey}
                                                    disabled={rating === 0 || isSubmittingSurvey}
                                                    className="w-full relative overflow-hidden group h-9"
                                                    size="sm"
                                                >
                                                    <span className={cn(
                                                        "flex items-center gap-2 transition-all",
                                                        isSubmittingSurvey ? "opacity-0" : "opacity-100"
                                                    )}>
                                                        <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                        Kirim
                                                    </span>
                                                    {isSubmittingSurvey && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : null}

                            <Card>
                                <CardHeader className="pb-3 border-b">
                                    <CardTitle className="text-base">Butuh Informasi?</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Jika Anda memiliki pertanyaan terkait status permohonan, silakan hubungi layanan pelanggan kami dengan menyebutkan nomor lacak.
                                    </p>
                                    <Button className="w-full" variant="outline">
                                        Hubungi CS
                                    </Button>
                                </CardContent>
                            </Card>

                            {permit.status === 'ditolak' && permit.rejectionReason && (
                                <Card className="border-red-100 bg-red-50/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-red-800 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> Alasan Penolakan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-red-700 italic">
                                            "{permit.rejectionReason}"
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
