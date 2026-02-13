"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FileText, Droplets, CloudRain, Send, CheckCircle, Building2, Landmark, User, GraduationCap, UserCheck, Map, Leaf, FilePlus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichSelect } from "@/components/ui/rich-select";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/kibo-ui/dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgencyGridSelector } from "@/components/tracking/AgencyGridSelector";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { permitTypes } from "@/lib/constants";
import { generateTrackingId } from "@/lib/utils";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import { cn } from "@/lib/utils";



const iconMap: Record<string, React.ReactNode> = {
    FileText: <FileText className="w-4 h-4" />,
    Droplets: <Droplets className="w-4 h-4" />,
    CloudRain: <CloudRain className="w-4 h-4" />,
};


export default function LayananPage() {
    const [selectedType, setSelectedType] = useState<string>("");
    const [agencyCategory, setAgencyCategory] = useState<string>("");
    const [attachmentType, setAttachmentType] = useState<string>("");
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [trackingId, setTrackingId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        description: "",
        date: "",
        agencyName: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedType) {
            toast.error("Pilih jenis pengajuan terlebih dahulu");
            return;
        }

        if (!agencyCategory) {
            toast.error("Pilih kategori instansi terlebih dahulu");
            return;
        }

        setIsSubmitting(true);
        toast.loading("Mengirim permohonan...", { id: "submit" });

        try {
            const response = await fetch("/api/permits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    type: selectedType,
                    agencyCategory,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || errorData.error || "Failed to submit");
            }

            const data = await response.json();
            const newTrackingId = data.trackingId;

            setTrackingId(newTrackingId);
            setIsSuccess(true);
            toast.success("Permohonan berhasil diajukan!", {
                id: "submit",
                description: `Nomor tracking: ${newTrackingId}`,
            });
        } catch (error: any) {
            toast.error("Gagal mengirim permohonan", {
                id: "submit",
                description: error.message || "Silakan coba lagi nanti.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    if (isSuccess) {
        return (
            <div className="min-h-screen pt-20 md:pt-24 pb-8 md:pb-12 px-4">
                <div className="container mx-auto max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <Card>
                            <CardContent className="pt-8 pb-8">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                    Permohonan Berhasil Diajukan!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Simpan nomor tracking berikut untuk melacak status permohonan Anda
                                </p>
                                <div className="bg-gray-100 rounded-xl p-3 md:p-4 mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Nomor Tracking</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <p className="text-lg md:text-2xl font-mono font-bold text-gray-800 break-all">
                                            {trackingId}
                                        </p>
                                        <CopyButton
                                            content={trackingId}
                                            variant="ghost"
                                            size="sm"
                                            onCopiedChange={(copied) => {
                                                if (copied) toast.success("Nomor tracking berhasil disalin!");
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link href="/lacak">
                                        <Button>Lacak Status</Button>
                                    </Link>
                                    <Link href="/">
                                        <Button variant="outline">Kembali ke Beranda</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-8 md:pb-12 relative">
            {/* Parallax Background */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg-2.png')" }}
            />
            <div className="fixed inset-0 -z-10 bg-white/40" />
            <div className="container mx-auto max-w-3xl px-4">
                {/* Header */}
                <Navbar />

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Formulir Pengajuan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Permit Type Selection */}
                            <RichSelect
                                label="Jenis Pengajuan"
                                customDropdown
                                placeholder="Pilih Jenis Pengajuan"
                                value={selectedType}
                                onValueChange={(val) => setSelectedType(val)}
                                options={permitTypes.map((p) => ({
                                    value: p.slug,
                                    label: p.title,
                                    description: p.description,
                                    icon: (
                                        <span
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px]"
                                            style={{ backgroundColor: p.bgColor, color: p.color }}
                                        >
                                            {iconMap[p.icon]}
                                        </span>
                                    ),
                                }))}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <Input
                                        name="name"
                                        placeholder="Nama Lengkap"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Agency Category Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Kategori Instansi / Pemohon</label>
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
                                        {
                                            value: "badan-usaha",
                                            label: "Badan Usaha",
                                            icon: <Building2 className="w-4 h-4 text-gray-500" />
                                        },
                                        {
                                            value: "instansi-pemerintah",
                                            label: "Instansi Pemerintah",
                                            icon: <Landmark className="w-4 h-4 text-gray-500" />
                                        },
                                        {
                                            value: "individu",
                                            label: "Individu",
                                            icon: <User className="w-4 h-4 text-gray-500" />
                                        },
                                        {
                                            value: "akademik",
                                            label: "Akademik",
                                            icon: <GraduationCap className="w-4 h-4 text-gray-500" />
                                        },
                                    ]}
                                />
                            </div>

                            {/* Agency Name Selection (Visual Grid Selector) */}
                            <AgencyGridSelector
                                label="Nama Instansi / Universitas"
                                placeholder={agencyCategory ? `Ketik nama ${agencyCategory.replace('-', ' ')}...` : "Pilih kategori dulu..."}
                                category={agencyCategory}
                                value={formData.agencyName}
                                onChange={(val) => {
                                    setFormData(prev => ({ ...prev, agencyName: val }));
                                }}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                                <Input
                                    name="phone"
                                    type="tel"
                                    placeholder="Nomor Telepon"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Perihal</label>
                                <Input
                                    name="subject"
                                    placeholder="Perihal Permohonan"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tanggal Pengajuan</label>
                                <Input
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>


                            {/* Attachment File Upload */}
                            {attachmentType && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-medium text-gray-700">Upload Dokumen ({attachmentType === "lainnya" ? "Dokumen Lainnya" : "Dokumen Pendukung"})</label>
                                    <Dropzone
                                        onDrop={(acceptedFiles) => setAttachmentFiles(acceptedFiles)}
                                        src={attachmentFiles}
                                        maxFiles={1}
                                        accept={{
                                            'application/pdf': ['.pdf'],
                                            'image/png': ['.png'],
                                            'image/jpeg': ['.jpg', '.jpeg']
                                        }}
                                    >
                                        <DropzoneEmptyState />
                                        <DropzoneContent />
                                    </Dropzone>
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                                <Textarea
                                    name="description"
                                    placeholder="Deskripsi lengkap permohonan Anda..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-4"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Ajukan Permohonan
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
                <Footer />
            </div>
        </div >
    );
}
