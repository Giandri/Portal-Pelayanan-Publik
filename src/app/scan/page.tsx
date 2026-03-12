"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ScanLine, CheckCircle2, Camera, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { markGuestBookScanned, getGuestBookByTrackingId } from "@/app/actions/guest-book";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { DecodeHintType, BarcodeFormat } from "@zxing/library";

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<any | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const router = useRouter();

    useEffect(() => {
        let active = true;

        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
        hints.set(DecodeHintType.TRY_HARDER, true);

        const codeReader = new BrowserQRCodeReader(hints, {
            delayBetweenScanAttempts: 300,
            delayBetweenScanSuccess: 1000,
        });

        const startScanner = async () => {
            if (!videoRef.current) return;

            // Wait a bit to ensure DOM elements are fully rendered
            await new Promise((r) => setTimeout(r, 500));
            if (!active) return;

            if (!window.isSecureContext && window.location.hostname !== "localhost") {
                setCameraError(
                    "Kamera hanya bisa diakses melalui HTTPS (atau localhost)."
                );
                return;
            }

            try {
                // List all video devices to find the back camera
                const videoDevices = await BrowserQRCodeReader.listVideoInputDevices();
                
                if (videoDevices.length === 0) {
                    setCameraError("Tidak ada kamera yang ditemukan pada perangkat ini.");
                    return;
                }

                // Try to find the back camera by label, otherwise fallback to first device
                const backCamera = videoDevices.find(device => 
                    /back|rear|environment/i.test(device.label)
                ) || videoDevices[videoDevices.length - 1]; // Often the last one is the primary back camera

                const deviceId = backCamera.deviceId;

                // We use decodeFromVideoDevice instead of stream for internal ZXing management
                const controls = await codeReader.decodeFromVideoDevice(
                    deviceId,
                    videoRef.current,
                    (result, error, ctrls) => {
                        if (ctrls) {
                            controlsRef.current = ctrls;
                        }

                        if (error && error.name !== 'NotFoundException') {
                            // Only warn if it's a real decoding error, not just "QR not found yet"
                            if (error.name !== 'ChecksumException' && error.name !== 'FormatException') {
                                console.debug("Scan status:", error.name);
                            }
                        }

                        if (result && active) {
                            // Found a QR!
                            active = false;
                            
                            // Immediate UI feedback
                            setIsLoading(true);

                            const decodedText = result.getText();
                            let parsedId = decodedText;
                            const lacakMatch = decodedText.match(/\/lacak\/([A-Z0-9-]+)/i);
                            if (lacakMatch) {
                                parsedId = lacakMatch[1];
                            }

                            // Cleanup camera immediately
                            if (controlsRef.current) {
                                controlsRef.current.stop();
                            }

                            // Fetch data
                            getGuestBookByTrackingId(parsedId)
                                .then((guestData) => {
                                    setScanResult(guestData || { trackingId: parsedId });
                                    setIsScanning(false);
                                    setIsLoading(false);
                                    toast.success("QR Code berhasil dipindai!");

                                    if (parsedId.startsWith("BWS-")) {
                                        markGuestBookScanned(parsedId).catch(() => {});
                                    }
                                })
                                .catch((err) => {
                                    console.error("Fetch error:", err);
                                    setScanResult({ trackingId: parsedId });
                                    setIsScanning(false);
                                    setIsLoading(false);
                                    toast.success("QR terdeteksi, tetapi gagal sinkronisasi server.");
                                });
                        }
                    }
                );

                controlsRef.current = controls;

            } catch (err: any) {
                if (active) {
                    console.error("Camera access error:", err);
                    const msg = err?.name === "NotAllowedError" || err?.message?.includes("Permission denied")
                        ? "Izin kamera ditolak. Berikan izin di pengaturan browser Anda."
                        : "Gagal mengakses kamera. Pastikan browser mendukung kamera dan izin telah diberikan.";
                    setCameraError(msg);
                }
            }
        };

        if (isScanning) {
            startScanner();
        }

        return () => {
            active = false;
            if (controlsRef.current) {
                controlsRef.current.stop();
            }
        };
    }, [isScanning]);

    const resetScanner = () => {
        window.location.reload();
    };

    return (
        <div className="h-screen max-h-screen relative overflow-hidden flex flex-col">
            <Toaster position="top-center" richColors />

            {/* Full Screen Camera Background - Universal Responsive */}
            <div className={`fixed inset-0 z-0 bg-black transition-opacity duration-500 overflow-hidden flex items-center justify-center ${isScanning ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-screen h-dvh object-cover absolute top-0 left-0 m-0 p-0 pointer-events-none"
                />
            </div>

            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScanning ? "bg-white/10 backdrop-blur-sm border-b border-white/10" : "bg-white/70 backdrop-blur-md border-b border-yellow-200/70"} px-4 py-4 flex items-center shadow-sm`}>
                <Link
                    href="/admin-menu"
                    className={`p-2 -ml-2 rounded-full transition-colors mr-3 ${isScanning ? "hover:bg-white/20 text-white" : "hover:bg-blue-50 text-blue-950"}`}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className={`text-base font-extrabold tracking-wide ${isScanning ? "text-white" : "text-blue-950"}`}>SCAN QR CODE</h1>
                    <p className={`text-xs font-bold tracking-wider ${isScanning ? "text-white/70" : "text-blue-950/50"}`}>PINDAI QR CODE TAMU   </p>
                </div>
            </header>

            {/* Scanning UI (Fixed Overlay) */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
                    >
                        <div className="relative w-[70vw] h-[70vw] max-w-[280px] max-h-[280px] min-w-[200px] min-h-[200px] flex items-center justify-center">
                            {/* Scanning Box Interior */}
                            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/20">
                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-10 h-10 border-t-[5px] border-l-[5px] border-yellow-400 rounded-tl-2xl" />
                                <div className="absolute top-0 right-0 w-10 h-10 border-t-[5px] border-r-[5px] border-yellow-400 rounded-tr-2xl" />
                                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[5px] border-l-[5px] border-yellow-400 rounded-bl-2xl" />
                                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[5px] border-r-[5px] border-yellow-400 rounded-br-2xl" />

                                {/* Scanning Animation Line */}
                                {!cameraError && (
                                    <motion.div
                                        className="absolute left-0 right-0 h-[1px] bg-yellow-400/80 shadow-[0_0_20px_4px_rgba(250,204,21,0.6)]"
                                        initial={{ top: "0%" }}
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{
                                            duration: 2.5,
                                            ease: "linear",
                                            repeat: Infinity,
                                        }}
                                    />
                                )}

                                {/* Camera Error (Centered in box) */}
                                {cameraError && (
                                    <div className="absolute inset-0 z-30 bg-white/95 flex flex-col items-center justify-center px-6 text-center pointer-events-auto">
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

                            {/* Floating Labels (Inside/Near the box area) */}
                            {(!cameraError) && (
                                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-max flex flex-col items-center gap-4">
                                    <p className="text-white/60 text-xs font-medium bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full border border-white/5">
                                        Arahkan kode ke dalam kotak scan
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content (Results & Loading) */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-20">
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white/80 backdrop-blur-md rounded-[24px] border border-yellow-200/70 p-8 text-center shadow-2xl flex flex-col items-center"
                        >
                            <div className="w-12 h-12 border-4 border-blue-950/20 border-t-blue-950 rounded-full animate-spin mb-4" />
                            <p className="text-blue-950 font-bold">Mengambil data...</p>
                        </motion.div>
                    )}

                    {!isScanning && !isLoading && (
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
                                    Detail kunjungan tamu:
                                </p>

                                <div className="space-y-4 mb-8">
                                    {/* Name Result */}
                                    <div className="bg-blue-950/5 border border-blue-950/10 rounded-2xl p-4 text-left">
                                        <p className="text-[10px] text-blue-950/40 font-bold uppercase tracking-wider mb-1">Nama Tamu</p>
                                        <p className="font-bold text-blue-950">
                                            {scanResult?.name || "-"}
                                        </p>
                                    </div>

                                    {/* Agency Result */}
                                    <div className="bg-blue-950/5 border border-blue-950/10 rounded-2xl p-4 text-left">
                                        <p className="text-[10px] text-blue-950/40 font-bold uppercase tracking-wider mb-1">Instansi</p>
                                        <p className="font-bold text-blue-950">
                                            {scanResult?.agencyName || "-"}
                                        </p>
                                    </div>

                                    {/* Subject/Target Result */}
                                    <div className="bg-blue-950/5 border border-blue-950/10 rounded-2xl p-4 text-left">
                                        <p className="text-[10px] text-blue-950/40 font-bold uppercase tracking-wider mb-1">Tujuan / Subjek</p>
                                        <p className="font-bold text-blue-950">
                                            {scanResult?.subject || "-"}
                                        </p>
                                    </div>

                                    {/* Tracking ID (Small) */}
                                    <div className="bg-blue-950/5 border border-blue-950/10 rounded-xl p-3 flex justify-between items-center">
                                        <p className="text-[10px] text-blue-950/40 font-bold uppercase">ID Tracking</p>
                                        <p className="font-mono text-xs font-bold text-blue-950/60">
                                            {scanResult?.trackingId}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            if (scanResult?.trackingId) {
                                                router.push(`/dashboard?search=${scanResult.trackingId}`);
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
            <footer className="fixed bottom-0 left-0 right-0 z-50 text-center pb-4 pointer-events-none">
                <p className={`text-xs font-medium transition-colors duration-500 ${isScanning ? "text-white/40" : "text-blue-900/40"}`}>
                    &copy; 2026 Balai Wilayah Sungai Bangka Belitung.
                </p>
            </footer>
        </div>
    );
}
