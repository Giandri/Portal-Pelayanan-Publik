"use client";

import { useState } from "react";
import { createGuestBookEntry } from "@/app/actions/guest-book";
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
import { Check, ChevronRight, ChevronLeft, User, MessageSquare, Send, CheckCircle, Info, ChevronDown, Building2, Landmark, GraduationCap } from "lucide-react";
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
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 inline-block">
                                                <QRCode
                                                    value={trackingId ? `https://bwscalendar.com/lacak/${trackingId}` : "https://bwscalendar.com/"}
                                                    size={160}
                                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                    viewBox={`0 0 160 160`}
                                                />
                                            </div>

                                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Buku Tamu Berhasil Diisi!</h2>
                                            <p className="text-gray-600 max-w-sm mb-6 mx-auto">
                                                Tunjukkan QR Code ini kepada petugas atau satpam di lokasi sebagai bukti pengisian buku tamu digital.
                                            </p>
                                            <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 mb-8">
                                                <p className="text-xs text-gray-500 mb-1">ID Kunjungan</p>
                                                <p className="font-mono font-bold text-gray-800 tracking-wider">{trackingId || "BWS-DDMMYY-XXX"}</p>
                                            </div>

                                            <Button
                                                onClick={() => {
                                                    setFormData({ name: "", email: "", nik: "", agencyName: "", phone: "", subject: "", description: "" });
                                                    setAgencyCategory("");
                                                    setTrackingId("");
                                                    setCurrentStep(1);
                                                }}
                                                className="h-11 px-8 rounded-md"
                                            >
                                                Isi Form Baru
                                            </Button>
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
