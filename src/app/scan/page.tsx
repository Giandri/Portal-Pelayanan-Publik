"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ScanLine, CheckCircle2, Camera, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { markGuestBookScanned } from "@/app/actions/guest-book";

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        const startScanner = async () => {
            await new Promise((r) => setTimeout(r, 300));
            if (cancelled) return;

            if (!window.isSecureContext) {
                setCameraError(
                    "Kamera hanya bisa diakses melalui HTTPS atau localhost. Akses halaman ini melalui https:// untuk menggunakan kamera."
                );
                return;
            }

            try {

                let stream: MediaStream;
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: { ideal: "environment" } },
                    });
                } catch {

                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                }

                stream.getTracks().forEach((track) => track.stop());

                if (cancelled) return;

                scannerRef.current = new Html5Qrcode("qr-reader");

                const cameras = await Html5Qrcode.getCameras();

                if (!cameras || cameras.length === 0) {
                    setCameraError("Tidak ada kamera yang terdeteksi.");
                    return;
                }

                const backCam = cameras.find(
                    (c) =>
                        c.label.toLowerCase().includes("back") ||
                        c.label.toLowerCase().includes("environment")
                );

                if (cancelled) return;

                await scannerRef.current.start(
                    backCam ? backCam.id : cameras[0].id,
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText: string) => {
                        if (cancelled) return;

                        // Parse QR code - extract tracking ID from buku tamu URL
                        let parsedId = decodedText;
                        const lacakMatch = decodedText.match(/\/lacak\/([A-Z0-9-]+)/i);
                        if (lacakMatch) {
                            parsedId = lacakMatch[1];
                        }

                        setScanResult(parsedId);
                        setIsScanning(false);
                        toast.success("QR Code buku tamu berhasil dipindai!");

                        // Mark as scanned in database if it's a BWS tracking ID
                        if (parsedId.startsWith("BWS-")) {
                            markGuestBookScanned(parsedId).catch(() => { });
                        }

                        if (scannerRef.current?.isScanning) {
                            scannerRef.current
                                .stop()
                                .then(() => scannerRef.current?.clear())
                                .catch(() => { });
                        }
                    },
                    () => { }
                );
            } catch (err: any) {
                if (!cancelled) {
                    console.error("Camera error:", err);
                    const msg = err?.name === "NotAllowedError"
                        ? "Izin kamera ditolak. Buka pengaturan browser Anda dan izinkan akses kamera untuk situs ini."
                        : err?.name === "NotFoundError"
                            ? "Tidak ada kamera yang tersedia di perangkat ini."
                            : "Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.";
                    setCameraError(msg);
                }
            }
        };

        if (isScanning) {
            startScanner();
        }

        return () => {
            cancelled = true;
            if (scannerRef.current?.isScanning) {
                scannerRef.current
                    .stop()
                    .then(() => scannerRef.current?.clear())
                    .catch(() => { });
            }
        };
    }, [isScanning]);

    const resetScanner = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            <Toaster position="top-center" richColors />

            {/* Background matching portal-admin / admin-menu */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-white" />
                <Image
                    src="/images/bg-3.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-[0.8] mix-blend-multiply object-bottom"
                />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(250,204,21,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(250,204,21,0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-20 bg-white/70 backdrop-blur-md border-b border-yellow-200/70 px-4 py-4 flex items-center shadow-sm">
                <Link
                    href="/admin-menu"
                    className="p-2 -ml-2 hover:bg-blue-50 rounded-full transition-colors mr-3"
                >
                    <ArrowLeft className="w-5 h-5 text-blue-950" />
                </Link>
                <div>
                    <h1 className="text-base font-extrabold text-blue-950 tracking-wide">SCAN QR CODE</h1>
                    <p className="text-xs text-blue-950/50 font-bold tracking-wider">PINDAI QR CODE TAMU   </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                <AnimatePresence mode="wait">
                    {isScanning ? (
                        <motion.div
                            key="scanner"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-sm flex flex-col items-center"
                        >
                            {/* Scanner Container */}
                            <div className="w-full aspect-square rounded-[24px] overflow-hidden relative bg-black shadow-2xl border border-yellow-200/70">
                                {/* Camera Feed Area */}
                                <div id="qr-reader" className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full"></div>

                                {/* Custom Scan Overlay */}
                                <div className="absolute inset-0 pointer-events-none z-10">


                                    {/* Animated Scan Line */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-[250px] h-[250px] overflow-hidden relative">
                                            <motion.div
                                                initial={{ y: 0 }}
                                                animate={{ y: [0, 244, 0] }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                                className="w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_20px_rgba(250,204,21,0.6)]"
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Camera Error Overlay */}
                                {cameraError && (
                                    <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center px-6 text-center">
                                        <Camera className="w-12 h-12 text-blue-950/30 mb-4" />
                                        <p className="text-sm text-blue-950/70 font-medium mb-4">{cameraError}</p>
                                        <button
                                            onClick={resetScanner}
                                            className="flex items-center gap-2 bg-blue-950 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-900 transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Coba Lagi
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-blue-950/60">
                                <ScanLine className="w-4 h-4 text-yellow-500" />
                                <p className="text-sm font-medium">Arahkan kamera ke barcode / QR Code</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-sm"
                        >
                            <div className="bg-white/80 backdrop-blur-md rounded-[24px] border border-yellow-200/70 p-8 text-center shadow-2xl">
                                {/* Success Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </motion.div>

                                <h2 className="text-xl font-extrabold text-blue-950 mb-1">Scan Berhasil!</h2>
                                <p className="text-sm text-blue-950/50 mb-6">
                                    ID kunjungan buku tamu terdeteksi:
                                </p>

                                <div className="bg-blue-950/5 border border-blue-950/10 rounded-2xl p-4 mb-8">
                                    <p className="text-xs text-blue-950/40 font-medium mb-1">ID Kunjungan</p>
                                    <p className="font-mono font-bold text-lg text-blue-950 break-all">
                                        {scanResult}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            if (scanResult) {
                                                router.push(`/dashboard?search=${scanResult}`);
                                            }
                                        }}
                                        className="w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2"
                                    >
                                        <Search className="w-5 h-5" />
                                        Lacak di Dashboard
                                    </button>

                                    <button
                                        onClick={resetScanner}
                                        className="w-full bg-white hover:bg-yellow-50 text-blue-950 font-semibold py-3 px-4 rounded-xl border-2 border-blue-950/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Scan Ulang
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <div className="relative z-10 text-center pb-4">
                <p className="text-xs text-blue-900/40 font-medium">
                    &copy; 2026 Balai Wilayah Sungai Bangka Belitung.
                </p>
            </div>
        </div>
    );
}
