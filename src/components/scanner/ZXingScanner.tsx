"use client";

import { useEffect, useRef } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";

interface ZXingScannerProps {
    isScanning: boolean;
    onScanSuccess: (decodedText: string) => void;
    onError: (error: string) => void;
}

export default function ZXingScanner({ isScanning, onScanSuccess, onError }: ZXingScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);

    useEffect(() => {
        let active = true;
        const codeReader = new BrowserQRCodeReader();

        const startScanner = async () => {
            if (!videoRef.current) return;

            await new Promise((r) => setTimeout(r, 300));
            if (!active) return;

            if (!window.isSecureContext) {
                onError(
                    "Kamera hanya bisa diakses melalui HTTPS atau localhost. Akses halaman ini melalui https:// untuk menggunakan kamera."
                );
                return;
            }

            try {
                let selectedDeviceId: string | undefined = undefined;
                try {
                    const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
                    if (videoInputDevices.length === 0) {
                        onError("Tidak ada kamera yang terdeteksi.");
                        return;
                    }
                    const backCam = videoInputDevices.find(
                        (device) =>
                            device.label.toLowerCase().includes("back") ||
                            device.label.toLowerCase().includes("environment")
                    );
                    selectedDeviceId = backCam ? backCam.deviceId : videoInputDevices[0].deviceId;
                } catch (e) {
                    // Ignore error on listing devices, fallback to undefined (auto select)
                }

                if (!active) return;

                const controls = await codeReader.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current,
                    (result, error, ctrls) => {
                        if (ctrls) {
                            controlsRef.current = ctrls;
                        }

                        if (result && active) {
                            active = false;
                            if (controlsRef.current) {
                                controlsRef.current.stop();
                            }
                            onScanSuccess(result.getText());
                        }
                    }
                );

                controlsRef.current = controls;

            } catch (err: any) {
                if (active) {
                    console.error("Camera error:", err);
                    const msg = err?.name === "NotAllowedError"
                        ? "Izin kamera ditolak. Buka pengaturan browser Anda dan izinkan akses kamera untuk situs ini."
                        : err?.name === "NotFoundError"
                            ? "Tidak ada kamera yang tersedia di perangkat ini."
                            : "Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.";
                    onError(msg);
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
            if (typeof (codeReader as any).reset === "function") {
                (codeReader as any).reset();
            }
        };
    }, [isScanning, onScanSuccess, onError]);

    return (
        <div className={`fixed inset-0 z-0 bg-black transition-opacity duration-500 overflow-hidden flex items-center justify-center ${isScanning ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-screen h-dvh object-cover relative pointer-events-none"
            />
        </div>
    );
}
