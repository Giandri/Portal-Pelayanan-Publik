"use client";

import { useState, useEffect, useCallback } from "react";
import { createGuestBookEntry } from "@/app/actions/guest-book";
import { Rating, RatingButton } from "@/components/kibo-ui/rating";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/animate-ui/primitives/radix/accordion";
import { RichSelect } from "@/components/ui/rich-select";
import { AgencyGridSelector } from "@/components/tracking/AgencyGridSelector";
import { Check, ChevronRight, ChevronLeft, User, MessageSquare, Send, CheckCircle, Info, ChevronDown, Building2, Landmark, GraduationCap, Star } from "lucide-react";
import QRCode from "react-qr-code";

const steps = [
    { id: 1, title: "Tata Cara", icon: Info },
    { id: 2, title: "Form Kunjungan", icon: User },
    { id: 3, title: "Selesai", icon: CheckCircle },
];

export default function GuestBookPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [agencyCategory, setAgencyCategory] = useState<string>("");
    const [trackingId, setTrackingId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [surveyRating, setSurveyRating] = useState(0);
    const [surveyComment, setSurveyComment] = useState("");
    const [surveySubmitted, setSurveySubmitted] = useState(false);
    const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);
    const [isScanned, setIsScanned] = useState(false);

    // Poll for scan status when on step 3
    useEffect(() => {
        if (currentStep !== 3 || !trackingId || isScanned) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/guest-book/${trackingId}`);
                const data = await res.json();
                if (data.isScanned) {
                    setIsScanned(true);
                    toast.success("QR Code berhasil di-scan oleh petugas!");
                    clearInterval(interval);
                }
            } catch { }
        }, 2000);

        return () => clearInterval(interval);
    }, [currentStep, trackingId, isScanned]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        nik: "",
        agencyName: "",
        phone: "",
        subject: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (currentStep < 3) setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createGuestBookEntry({
                ...formData,
                agencyCategory,
            });

            if (result.success && result.trackingId) {
                setTrackingId(result.trackingId);
                handleNext();
            } else {
                alert(result.error || "Gagal menyimpan data. Silakan coba lagi.");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-8 md:pb-12 relative font-sans text-gray-900">
            {/* Parallax Background */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg-2.png')" }}
            />
            <div className="fixed inset-0 -z-10 bg-white/40" />

            <div className="container mx-auto max-w-3xl px-4">
                <Navbar />

                <div className="space-y-6 mt-10">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-center">
                                <h1 className="text-xl md:text-2xl font-bold text-black mb-1 drop-shadow-sm">Buku Tamu Digital</h1>
                                <p className="text-gray-800 text-sm max-w-xl mx-auto font-medium">
                                    Selamat datang di Balai Wilayah Sungai Bangka Belitung. Silakan isi buku tamu di bawah ini sebagai pencatatan kunjungan Anda.
                                </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-0 md:p-0">
                            {/* Stepper Header Component */}
                            <div className="px-6 py-6 md:px-10 md:py-8 rounded-t-xl">
                                <div className="flex items-center justify-between relative">
                                    <div className="absolute left-0 md:top-1/3 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0">
                                        <motion.div
                                            className="h-full bg-blue-600 rounded-full"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>

                                    {steps.map((step) => {
                                        const Icon = step.icon;
                                        const isActive = currentStep === step.id;
                                        const isCompleted = currentStep > step.id;

                                        return (
                                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2  px-2 sm:px-4">
                                                <motion.div
                                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive
                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                        : isCompleted
                                                            ? "border-blue-600 bg-white text-blue-600"
                                                            : "border-gray-300 bg-white text-gray-400"
                                                        }`}
                                                    animate={{
                                                        scale: isActive ? 1.1 : 1,
                                                    }}
                                                >
                                                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                                </motion.div>
                                                <span
                                                    className={`text-xs md:text-sm font-semibold hidden sm:block ${isActive || isCompleted ? "text-blue-950" : "text-gray-400"
                                                        }`}
                                                >
                                                    {step.title}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-6 md:p-10 min-h-[400px]">
                                <AnimatePresence mode="wait">
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <h2 className="text-xl font-bold text-gray-800 mb-0">Tata Cara & FAQ</h2>
                                            <div className="text-gray-600 mb-2 text-sm">
                                                Berikut adalah panduan singkat tentang pengisian buku tamu digital Balai Wilayah Sungai Bangka Belitung:
                                            </div>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="item-1" className="border-b">
                                                    <AccordionTrigger className="w-full flex justify-between text-start py-4 font-semibold text-sm hover:underline [&[data-state=open]>svg]:rotate-180">
                                                        Siapa saja yang wajib mengisi form ini?
                                                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-gray-600 text-sm text-justify leading-relaxed pb-4">
                                                        Semua tamu yang datang berkunjung wajib mengisi buku tamu digital ini sebagai pendataan resmi kunjungan. Form ini menggantikan buku tamu fisik konvensional.
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-2" className="border-b">
                                                    <AccordionTrigger className="w-full flex justify-between text-start py-4 font-semibold text-sm hover:underline [&[data-state=open]>svg]:rotate-180">
                                                        Dokumen apa yang perlu disiapkan?
                                                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-gray-600 text-sm text-justify leading-relaxed pb-4">
                                                        Anda hanya perlu menyiapkan identitas diri (KTP/SIM/ID Card) untuk ditunjukkan kepada petugas resepsionis jika diminta. Pengisian form ini sendiri tidak mewajibkan upload dokumen untuk memudahkan para tamu.
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="item-3" className="border-b">
                                                    <AccordionTrigger className="w-full flex justify-between text-start py-4 font-semibold text-sm hover:underline [&[data-state=open]>svg]:rotate-180">
                                                        Bagaimana jika lupa/tidak memiliki nama instansi?
                                                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-gray-600 text-sm text-justify leading-relaxed pb-4">
                                                        Anda dapat mengisi instansi dengan format "- / Pribadi / Masyarakat Umum" jika kunjungan dilakukan atas nama perorangan atau tidak mewakili lembaga/perusahaan tertentu.
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </motion.div>
                                    )}

                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <h2 className="text-xl font-bold text-gray-800 mb-6">Informasi Kunjungan</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                                                    <Input
                                                        name="name"
                                                        placeholder="Nama Lengkap"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="h-11"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                                                    <Input
                                                        name="email"
                                                        type="email"
                                                        placeholder="Email Aktif"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="h-11"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                <label className="text-sm font-medium text-gray-700">NIK <span className="text-red-500">*</span></label>
                                                <Input
                                                    name="nik"
                                                    placeholder="16 Digit NIK KTP"
                                                    value={formData.nik}
                                                    onChange={handleChange}
                                                    className="h-11"
                                                />
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                <label className="text-sm font-medium text-gray-700">Kategori Instansi / Pemohon <span className="text-red-500">*</span></label>
                                                <RichSelect
                                                    className="h-11"
                                                    customDropdown
                                                    placeholder="Pilih Kategori"
                                                    value={agencyCategory}
                                                    onValueChange={(val) => {
                                                        setAgencyCategory(val);
                                                        setFormData(prev => ({ ...prev, agencyName: "" }));
                                                    }}
                                                    options={[
                                                        { value: "badan-usaha", label: "Badan Usaha", icon: <Building2 className="w-4 h-4 text-gray-500" /> },
                                                        { value: "instansi-pemerintah", label: "Instansi Pemerintah", icon: <Landmark className="w-4 h-4 text-gray-500" /> },
                                                        { value: "individu", label: "Individu", icon: <User className="w-4 h-4 text-gray-500" /> },
                                                        { value: "akademik", label: "Akademik", icon: <GraduationCap className="w-4 h-4 text-gray-500" /> },
                                                    ]}
                                                />
                                            </div>

                                            <AgencyGridSelector
                                                label="Nama Instansi / Universitas"
                                                placeholder={agencyCategory ? `Ketik nama instansi / perorangan...` : "Pilih kategori dulu..."}
                                                category={agencyCategory}
                                                value={formData.agencyName}
                                                onChange={(val) => setFormData(prev => ({ ...prev, agencyName: val }))}
                                            />

                                            <div className="space-y-2 mt-4">
                                                <label className="text-sm font-medium text-gray-700">Nomor Telepon <span className="text-red-500">*</span></label>
                                                <Input
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="Nomor Telepon Aktif (WA)"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="h-11"
                                                />
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                <label className="text-sm font-medium text-gray-700">Tujuan Bertemu <span className="text-red-500">*</span></label>
                                                <Input
                                                    name="subject"
                                                    placeholder="Tujuan kunjungan"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="h-11"
                                                />
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                <label className="text-sm font-medium text-gray-700">Deskripsi / Perihal</label>
                                                <Textarea
                                                    name="description"
                                                    placeholder="Deskripsi lebih rinci mengenai kunjungan Anda"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    rows={4}
                                                    className="resize-none"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4 }}
                                            className="flex flex-col items-center justify-center text-center py-8"
                                        >
                                            <AnimatePresence mode="wait">
                                                {isScanned ? (
                                                    <motion.div
                                                        key="scanned"
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                        className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-200 mb-6 inline-flex flex-col items-center gap-3"
                                                    >
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                                                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                                                        >
                                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                                        </motion.div>
                                                        <p className="text-sm font-semibold text-green-700">Terverifikasi oleh Petugas</p>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="qrcode"
                                                        exit={{ scale: 0.5, opacity: 0 }}
                                                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 inline-block relative"
                                                    >
                                                        <QRCode
                                                            value={trackingId ? `https://bwscalendar.com/lacak/${trackingId}` : "https://bwscalendar.com/"}
                                                            size={160}
                                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                            viewBox={`0 0 160 160`}
                                                        />
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                                            <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                                                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                                                                Menunggu scan petugas...
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                                {isScanned ? "Kunjungan Terverifikasi!" : "Buku Tamu Berhasil Diisi!"}
                                            </h2>
                                            <p className="text-gray-600 max-w-sm mb-6 mx-auto">
                                                {isScanned
                                                    ? "QR Code Anda sudah berhasil di-scan oleh petugas. Selamat datang!"
                                                    : "Tunjukkan QR Code ini kepada petugas atau satpam di lokasi sebagai bukti pengisian buku tamu digital."
                                                }
                                            </p>
                                            <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 mb-6">
                                                <p className="text-xs text-gray-500 mb-1">ID Kunjungan</p>
                                                <p className="font-mono font-bold text-gray-800 tracking-wider">{trackingId || "BWS-DDMMYY-XXX"}</p>
                                            </div>

                                            {/* Survey Section - only shows after QR is scanned */}
                                            {isScanned && (<div className={cn(
                                                "w-full border-2 rounded-2xl p-6 mb-6 transition-all duration-500 relative overflow-hidden",
                                                surveySubmitted ? "border-green-100 bg-green-50/30" : "border-blue-100 bg-gradient-to-br from-white to-blue-50/50"
                                            )}>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                                {surveySubmitted ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-center gap-2 mb-2">
                                                            <div className={cn(
                                                                "p-1.5 rounded-full",
                                                                surveyRating < 3 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                                                            )}>
                                                                <CheckCircle className="w-4 h-4" />
                                                            </div>
                                                            <h3 className="font-bold text-gray-800">
                                                                {surveyRating < 3 ? "Mohon Maaf" : "Terima Kasih!"}
                                                            </h3>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            {surveyRating < 3
                                                                ? "Mohon maaf atas ketidaknyamanan Anda. Masukan Anda akan kami jadikan bahan evaluasi perbaikan layanan."
                                                                : "Terima kasih atas penilaian dan kepercayaan Anda menggunakan layanan kami."
                                                            }
                                                        </p>
                                                        <div className="flex flex-col gap-1 bg-white/60 p-3 rounded-lg border border-black/5 mt-3">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={cn(
                                                                            "w-4 h-4",
                                                                            star <= surveyRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                            {surveyComment && (
                                                                <p className="text-sm text-gray-700 italic mt-1">
                                                                    "{surveyComment}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="p-1.5 bg-blue-100 rounded-full text-blue-600">
                                                                <Star className="w-4 h-4" />
                                                            </div>
                                                            <h3 className="font-bold text-gray-800">Survei Kepuasan</h3>
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            Bagaimana pengalaman Anda?
                                                        </p>

                                                        <div className="flex flex-col items-center gap-2 py-2">
                                                            <Rating
                                                                value={surveyRating}
                                                                onValueChange={setSurveyRating}
                                                                className="gap-2"
                                                            >
                                                                {[1, 2, 3, 4, 5].map((index) => (
                                                                    <RatingButton
                                                                        key={index}
                                                                        index={index}
                                                                        className={cn(
                                                                            "w-8 h-8 transition-all hover:scale-110",
                                                                            index + 1 <= surveyRating ? "text-yellow-400 fill-yellow-300" : "text-yellow-300"
                                                                        )}
                                                                    />
                                                                ))}
                                                            </Rating>
                                                            <span className="text-xs font-medium text-gray-400">
                                                                {surveyRating === 0 ? "Pilih bintang" :
                                                                    surveyRating === 5 ? "Sangat Puas! 😍" :
                                                                        surveyRating === 4 ? "Puas 😊" :
                                                                            surveyRating === 3 ? "Cukup 🙂" :
                                                                                surveyRating === 2 ? "Kurang 😐" : "Sangat Kurang 😞"
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Textarea
                                                                placeholder="Berikan komentar dan masukan Anda . . ."
                                                                value={surveyComment}
                                                                onChange={(e) => setSurveyComment(e.target.value)}
                                                                className="resize-none bg-white/80 min-h-[80px] text-sm"
                                                            />
                                                        </div>

                                                        <Button
                                                            onClick={async () => {
                                                                if (surveyRating === 0) {
                                                                    toast.error("Mohon berikan penilaian bintang");
                                                                    return;
                                                                }
                                                                setIsSubmittingSurvey(true);
                                                                try {
                                                                    const response = await fetch("/api/surveys", {
                                                                        method: "POST",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({
                                                                            trackingId,
                                                                            rating: surveyRating,
                                                                            comment: surveyComment
                                                                        })
                                                                    });
                                                                    const data = await response.json();
                                                                    if (!response.ok) throw new Error(data.error || "Gagal mengirim survei");

                                                                    toast.success(surveyRating < 3
                                                                        ? "Mohon maaf atas ketidaknyamanan Anda. Masukan Anda akan kami jadikan bahan evaluasi."
                                                                        : "Terima kasih atas penilaian Anda!"
                                                                    );
                                                                    setSurveySubmitted(true);
                                                                } catch (err: any) {
                                                                    toast.error(err.message);
                                                                } finally {
                                                                    setIsSubmittingSurvey(false);
                                                                }
                                                            }}
                                                            disabled={surveyRating === 0 || isSubmittingSurvey}
                                                            className="w-full relative overflow-hidden group h-9"
                                                            size="sm"
                                                        >
                                                            <span className={cn(
                                                                "flex items-center gap-2 transition-all",
                                                                isSubmittingSurvey ? "opacity-0" : "opacity-100"
                                                            )}>
                                                                <Send className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                                Kirim Survei
                                                            </span>
                                                            {isSubmittingSurvey && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                </div>
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>)}


                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Buttons */}
                            {currentStep < 3 && (
                                <div className="px-6 py-2 md:px-4 flex items-center justify-between rounded-b-xl">
                                    <Button
                                        variant="outline"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        className="h-11 px-6 shadow-sm disabled:opacity-50 font-medium"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Button>

                                    {currentStep === 1 ? (
                                        <Button
                                            onClick={handleNext}
                                            className="h-11 px-6 shadow-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                        >
                                            Mulai Isi Form
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            className="h-11 px-6 shadow-sm bg-green-600 hover:bg-green-700 text-white font-medium"
                                            disabled={isSubmitting || !formData.name || !formData.email || !formData.nik || !agencyCategory || !formData.phone || !formData.subject}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            {isSubmitting ? "Menyimpan..." : "Kirim Data"}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}
