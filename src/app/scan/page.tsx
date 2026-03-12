"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Camera, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { markGuestBookScanned, getGuestBookByTrackingId } from "@/app/actions/guest-book";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";


export default function ScanPage() {
    const [scanResult, setScanResult] = useState<any | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [devices, setDevices] = useState<any[]>([]);
    const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isInitializing = useRef(false);
    const [manualId, setManualId] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);
    const router = useRouter();

    const safeStop = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
            } catch (e: any) {
                const msg = e?.message || e?.toString() || "";
                if (!msg.includes("not running") && !msg.includes("paused")) {
                    console.warn("Scanner safeStop error:", e);
                }
            }
        }
    };

    useEffect(() => {
        let active = true;

        const startScanner = async () => {
            if (isInitializing.current) return;
            isInitializing.current = true;

            const scannerContainer = document.getElementById("qr-reader");
            if (!scannerContainer) {
                isInitializing.current = false;
                return;
            }

            setCameraError(null);

            try {
                const videoDevices = await Html5Qrcode.getCameras();
                if (!active) {
                    isInitializing.current = false;
                    return;
                }

                setDevices(videoDevices);

                if (videoDevices.length === 0) {
                    setCameraError("Kamera tidak ditemukan.");
                    isInitializing.current = false;
                    return;
                }

                let targetIndex = currentDeviceIndex;
                if (targetIndex === null) {
                    const backCamera = videoDevices.find(d => /back|rear|environment/i.test(d.label));
                    targetIndex = backCamera ? videoDevices.findIndex(d => d.id === backCamera.id) : 0;
                    setCurrentDeviceIndex(targetIndex);
                }

                await safeStop();

                const html5QrCode = new Html5Qrcode("qr-reader");
                scannerRef.current = html5QrCode;

                const deviceId = videoDevices[targetIndex]?.id || videoDevices[0].id;

                // Hitung qrbox sesuai ukuran kotak visual di UI (70vw, max 280px)
                const qrboxSize = Math.min(
                    Math.floor(window.innerWidth * 0.7),
                    280
                );

                await html5QrCode.start(

                    {
                        deviceId: { exact: deviceId },
                        width: { min: 640, ideal: 1280, max: 1920 },
                        height: { min: 480, ideal: 720, max: 1080 },
                    },
                    {
                        fps: 20,
                        qrbox: { width: qrboxSize, height: qrboxSize },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        if (active) {
                            active = false;
                            setIsLoading(true);
                            toast.loading("Memproses kode...", { id: "scan-process" });

                            let parsedId = decodedText;
                            const lacakMatch = decodedText.match(/\/lacak\/([A-Z0-9-]+)/i);
                            if (lacakMatch) parsedId = lacakMatch[1];

                            safeStop();

                            getGuestBookByTrackingId(parsedId)
                                .then((guestData) => {
                                    toast.dismiss("scan-process");
                                    setScanResult(guestData || { trackingId: parsedId });
                                    setIsScanning(false);
                                    setIsLoading(false);
                                    toast.success("Berhasil!");
                                    if (parsedId.startsWith("BWS-")) {
                                        markGuestBookScanned(parsedId).catch(() => { });
                                    }
                                })
                                .catch(() => {
                                    toast.dismiss("scan-process");
                                    setScanResult({ trackingId: parsedId });
                                    setIsScanning(false);
                                    setIsLoading(false);
                                    toast.success("Offline Mode.");
                                });
                        }
                    },
                    () => {
                        // ignore frame failures
                    }
                );
            } catch (err) {
                if (active) {
                    console.error("Scanner Error:", err);
                    setCameraError("Gagal akses kamera. Periksa izin atau coba lagi.");
                }
            } finally {
                isInitializing.current = false;
            }
        };

        if (isScanning) {
            startScanner();
        }

        return () => {
            active = false;
            safeStop();
        };
    }, [isScanning, currentDeviceIndex]);

    const switchCamera = () => {
        if (devices.length > 1 && !isInitializing.current) {
            setCurrentDeviceIndex((prev) => ((prev ?? 0) + 1) % devices.length);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualId.trim() || isLoading) return;

        setIsLoading(true);
        toast.loading("Mencari data...", { id: "manual-process" });

        getGuestBookByTrackingId(manualId.trim())
            .then((guestData) => {
                toast.dismiss("manual-process");
                setScanResult(guestData || { trackingId: manualId.trim() });
                setIsScanning(false);
                setIsLoading(false);
                toast.success("Berhasil ditemukan!");
                safeStop();
                if (manualId.trim().startsWith("BWS-")) {
                    markGuestBookScanned(manualId.trim()).catch(() => { });
                }
            })
            .catch(() => {
                toast.dismiss("manual-process");
                toast.error("Data tidak ditemukan.");
                setIsLoading(false);
            });
    };

    const resetScanner = () => {
        window.location.reload();
    };

    return (
        <div className="h-screen max-h-screen relative overflow-hidden flex flex-col bg-black">
            <Toaster position="top-center" richColors />

            {/* Background Feed */}
            <div className={`fixed inset-0 z-0 bg-black transition-opacity duration-300 overflow-hidden ${isScanning ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div id="qr-reader" className="w-full h-full [&>video]:object-cover [&>video]:absolute [&>video]:inset-0 [&>video]:w-full [&>video]:h-full" />
            </div>

            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScanning ? "bg-black/20 backdrop-blur-md border-b border-white/10" : "bg-white/70 backdrop-blur-md border-b border-yellow-200/70"} px-4 py-4 flex items-center shadow-sm`}>
                <Link
                    href="/admin-menu"
                    className={`p-2 -ml-2 rounded-full transition-colors mr-3 active:scale-95 ${isScanning ? "hover:bg-white/20 text-white" : "hover:bg-blue-50 text-blue-950"}`}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className={`text-sm font-extrabold tracking-widest uppercase ${isScanning ? "text-white" : "text-blue-950"}`}>Monitor Pindaian</h1>
                    <p className={`text-[10px] font-bold tracking-wider opacity-60 uppercase ${isScanning ? "text-white" : "text-blue-950"}`}>Verifikasi Tamu</p>
                </div>

            </header>

            {/* Viewfinder Overlay */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
                    >
                        <div className="relative w-[70vw] h-[70vw] max-w-[280px] max-h-[280px] min-w-[200px] min-h-[200px] flex items-center justify-center">
                            {/* Mask Overlay */}
                            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_0_2000px_rgba(0,0,0,0.6)]">
                                <div className="absolute top-0 left-0 w-10 h-10 border-t-[5px] border-l-[5px] border-yellow-400 rounded-tl-2xl" />
                                <div className="absolute top-0 right-0 w-10 h-10 border-t-[5px] border-r-[5px] border-yellow-400 rounded-tr-2xl" />
                                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[5px] border-l-[5px] border-yellow-400 rounded-bl-2xl" />
                                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[5px] border-r-[5px] border-yellow-400 rounded-br-2xl" />

                                {!cameraError && (
                                    <motion.div
                                        className="absolute left-0 right-0 h-px bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)]"
                                        animate={{ top: ["5%", "95%", "5%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                )}

                                {cameraError && (
                                    <div className="absolute inset-0 z-30 bg-white/95 flex flex-col items-center justify-center px-6 text-center pointer-events-auto">
                                        <Camera className="w-12 h-12 text-blue-950/30 mb-4" />
                                        <p className="text-sm text-blue-950/70 font-medium mb-4">{cameraError}</p>
                                        <button
                                            onClick={resetScanner}
                                            className="flex items-center gap-2 bg-blue-950 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-black transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Coba Lagi
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!cameraError && (
                                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-max text-center">
                                    <p className="text-white/60 text-[11px] font-medium bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full border border-white/5 uppercase tracking-[0.15em]">
                                        Pusatkan QR dalam kotak
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Layer */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-[100]">
                <AnimatePresence mode="wait">
                    {isLoading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white/90 backdrop-blur-md rounded-[24px] border border-yellow-200/70 p-8 text-center shadow-2xl flex flex-col items-center"
                        >
                            <div className="w-12 h-12 border-4 border-blue-950/20 border-t-blue-950 rounded-full animate-spin mb-4" />
                            <p className="text-blue-950 font-bold">Mengambil data...</p>
                        </motion.div>
                    )}

                    {!isScanning && !isLoading && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="fixed inset-0 z-50 w-full h-full bg-white"
                        >
                            <div className="bg-white/95  text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 mt-5 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </motion.div>

                                <h2 className="text-xl font-extrabold text-blue-950 mb-3">Berhasil!</h2>
                                <div className="space-y-4 px-4  mb-8">
                                    <div className="bg-blue-950/5 border border-blue-950/10 rounded-2xl p-4 text-left">
                                        <p className="text-[10px] text-blue-950/40 font-bold uppercase tracking-wider mb-1">Nama Tamu</p>
                                        <p className="font-bold text-blue-950">{scanResult?.name || "-"}</p>
                                    </div>
                                    <div className="bg-blue-950/5 border border-blue-950/10 rounded-2xl p-4 text-left">
                                        <p className="text-[10px] text-blue-950/40 font-bold uppercase tracking-wider mb-1">Instansi</p>
                                        <p className="font-bold text-blue-950">{scanResult?.agencyName || "-"}</p>
                                    </div>
                                    <div className="bg-blue-950/5 border border-blue-950/10 rounded-2xl p-4 text-left">
                                        <p className="text-[10px] text-blue-950/40 font-bold uppercase tracking-wider mb-1">Tujuan Bertemu</p>
                                        <p className="font-bold text-blue-950">{scanResult?.subject || "-"}</p>
                                    </div>
                                    <div className="bg-blue-950/5 border border-blue-950/10 rounded-xl p-3 flex justify-between items-center">
                                        <p className="text-[10px] text-blue-950/40 font-bold uppercase">ID</p>
                                        <p className="font-mono text-xs font-bold text-blue-950/60">{scanResult?.trackingId}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col px-4 gap-3">
                                    <button
                                        onClick={resetScanner}
                                        className="w-full bg-white hover:bg-gray-50 text-blue-950 font-semibold py-2 rounded-xl border-2 border-blue-950/10"
                                    >
                                        SCAN ULANG
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Manual Input Layer - Fixed at bottom */}
            {isScanning && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-12 left-0 right-0 z-100 px-6 pointer-events-none"
                >
                    <form
                        onSubmit={handleManualSubmit}
                        className="max-w-xs mx-auto pointer-events-auto"
                    >
                        <div className={`relative transition-all duration-300`}>
                            <input
                                type="text"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value.toUpperCase())}
                                placeholder="Gunakan ID Manual..."
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg py-3.5 pl-5 pr-12 text-white placeholder:text-white/40 text-sm font-bold  focus:ring-yellow-400/50 transition-all uppercase"
                            />
                            <Button
                                type="submit"
                                className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-yellow-400 hover:bg-yellow-300 text-blue-950 rounded-full transition-colors flex items-center justify-center active:scale-90"
                            >
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 text-center pb-4 pointer-events-none">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isScanning ? "text-white/30" : "text-blue-950/30"}`}>
                    &copy; 2026 Balai Wilayah Sungai Bangka Belitung
                </p>
            </footer>
        </div>
    );
}