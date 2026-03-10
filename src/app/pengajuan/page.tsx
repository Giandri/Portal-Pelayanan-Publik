"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FileText, Droplets, CloudRain, Send, CheckCircle, Building2, Landmark, User, GraduationCap, UserCheck, Map, Leaf, FilePlus, Upload, Camera, ImageIcon, X, Paperclip, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUploadThing } from "@/lib/uploadthing";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichSelect } from "@/components/ui/rich-select";
import { DatePicker } from "@/components/ui/date-picker";
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
    const [ktpFile, setKtpFile] = useState<File | null>(null);
    const [ktpPreview, setKtpPreview] = useState<string | null>(null);
    const [suratFiles, setSuratFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [trackingId, setTrackingId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        nik: "",
        email: "",
        phone: "",
        subject: "",
        description: "",
        date: "",
        agencyName: "",
    });

    const { startUpload: uploadKtp, isUploading: isUploadingKtp } = useUploadThing("ktpUpload");
    const { startUpload: uploadLampiran, isUploading: isUploadingLampiran } = useUploadThing("lampiranUpload");

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
            // 1. Create permit
            const response = await fetch("/api/permits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            const permitId = data.id;

            // 2. Upload KTP via UploadThing
            const allFiles: any[] = [];

            if (ktpFile) {
                toast.loading("Mengupload foto KTP...", { id: "submit" });
                const ktpResult = await uploadKtp([ktpFile]);
                if (ktpResult) {
                    ktpResult.forEach(f => {
                        allFiles.push({
                            name: f.name,
                            url: f.url,
                            size: f.size,
                            type: f.type,
                            key: f.key,
                            category: "ktp",
                        });
                    });
                }
            }

            // 3. Upload lampiran via UploadThing
            if (suratFiles.length > 0) {
                toast.loading("Mengupload surat lampiran...", { id: "submit" });
                const lampiranResult = await uploadLampiran(suratFiles);
                if (lampiranResult) {
                    lampiranResult.forEach(f => {
                        allFiles.push({
                            name: f.name,
                            url: f.url,
                            size: f.size,
                            type: f.type,
                            key: f.key,
                            category: "lampiran",
                        });
                    });
                }
            }

            // 4. Save file metadata to permit
            if (allFiles.length > 0 && permitId) {
                await fetch("/api/permits/upload", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        permitId,
                        files: allFiles,
                    }),
                });
            }

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

                <form onSubmit={handleSubmit} className="space-y-6 mt-10">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">
                                <h1 className="text-xl md:text-2xl font-bold text-black mb-1 drop-shadow-sm">Formulir Pengajuan</h1>
                                <p className="text-gray-800 text-sm max-w-xl mx-auto font-medium">
                                    Silakan isi formulir pengajuan di bawah ini.
                                </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 -mt-6">

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
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">NIK</label>
                                <Input
                                    name="nik"
                                    placeholder="NIK KTP"
                                    value={formData.nik}
                                    onChange={handleInputChange}
                                    required
                                />
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
                                <DatePicker
                                    date={formData.date ? new Date(formData.date) : undefined}
                                    setDate={(date) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            date: date ? format(date, "yyyy-MM-dd") : "",
                                        }));
                                    }}
                                />
                            </div>

                            {/* KTP Photo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Foto KTP</label>
                                {ktpPreview ? (
                                    <div className="relative rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-3">
                                        <img
                                            src={ktpPreview}
                                            alt="Preview KTP"
                                            className="w-full max-h-24 md:max-h-24 object-contain rounded-md"
                                        />
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[10px] text-green-700 font-medium truncate flex-1">
                                                {ktpFile?.name}
                                            </p>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => {
                                                    setKtpFile(null);
                                                    setKtpPreview(null);
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                    <Camera className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-medium max-w-[120px] leading-tight">
                                                    Ambil foto atau pilih dari galeri
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1.5 shrink-0">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-[10px] px-2 gap-1"
                                                    onClick={() => {
                                                        const input = document.createElement('input');
                                                        input.type = 'file';
                                                        input.accept = 'image/*';
                                                        input.capture = 'environment';
                                                        input.onchange = (e) => {
                                                            const file = (e.target as HTMLInputElement).files?.[0];
                                                            if (file) {
                                                                setKtpFile(file);
                                                                setKtpPreview(URL.createObjectURL(file));

                                                            }
                                                        };
                                                        input.click();
                                                    }}
                                                >
                                                    <Camera className="w-3 h-3" />
                                                    Kamera
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-[10px] px-2 gap-1"
                                                    onClick={() => {
                                                        const input = document.createElement('input');
                                                        input.type = 'file';
                                                        input.accept = 'image/*';
                                                        input.onchange = (e) => {
                                                            const file = (e.target as HTMLInputElement).files?.[0];
                                                            if (file) {
                                                                setKtpFile(file);
                                                                setKtpPreview(URL.createObjectURL(file));

                                                            }
                                                        };
                                                        input.click();
                                                    }}
                                                >
                                                    <ImageIcon className="w-3 h-3" />
                                                    Galeri
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Surat Lampiran</label>
                                <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                                <Paperclip className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-medium max-w-[120px] leading-tight">
                                                {suratFiles.length > 0
                                                    ? `${suratFiles.length} file terpilih`
                                                    : "Format: PDF, DOC, DOCX (Maks 5)"}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1.5 shrink-0">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-[10px] px-2 gap-1"
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.multiple = true;
                                                    input.accept = 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                                                    input.onchange = (e) => {
                                                        const files = Array.from((e.target as HTMLInputElement).files || []);
                                                        if (files.length > 5) {
                                                            toast.error("Maksimal 5 file lampiran");
                                                            setSuratFiles(files.slice(0, 5));
                                                        } else {
                                                            setSuratFiles(files);
                                                        }
                                                    };
                                                    input.click();
                                                }}
                                            >
                                                <FilePlus className="w-3 h-3" />
                                                Pilih File
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Preview List for Lampiran (Inline to save space) */}
                                    {suratFiles.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {suratFiles.map((file, i) => (
                                                <div key={i} className="flex flex-row justify-between items-center text-[10px] text-gray-600 bg-white border border-gray-100 p-1.5 rounded pr-2">
                                                    <div className="truncate flex-1 max-w-[90%]">{file.name}</div>
                                                    <X className="w-3 h-3 text-red-500 cursor-pointer ml-2" onClick={() => {
                                                        setSuratFiles(prev => prev.filter((_, idx) => idx !== i));
                                                    }} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

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
            </div>
            <Footer />
        </div >
    );
}
