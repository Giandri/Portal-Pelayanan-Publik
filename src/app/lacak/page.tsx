"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, FileSearch } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingContact } from "@/components/layout/floating-contact";

export default function LacakPage() {
    const [trackingId, setTrackingId] = useState("");
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!trackingId.trim()) {
            setError("Mohon masukkan nomor tracking");
            return;
        }

        if (trackingId.trim().length < 5) {
            setError("Nomor tracking tidak valid");
            return;
        }

        router.push(`/lacak/${trackingId.trim()}`);
    };

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-8 md:pb-12 relative">
            {/* Parallax Background */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bg-1.png')" }}
            />
            <div className="fixed inset-0 -z-10 bg-white/40" />

            <div className="container mx-auto max-w-2xl px-4">
                <Navbar />

                <div className="mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6 md:p-8">

                                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-[var(--text-primary)] mb-2">
                                    Lacak Pengajuan
                                </h1>
                                <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center mb-8">
                                    Masukkan nomor Lacak untuk melihat status pengajuan Anda
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                                Nomor Lacak
                                            </label>
                                            <div className="relative">
                                                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[var(--text-muted)]" />
                                                <input
                                                    type="text"
                                                    value={trackingId}
                                                    onChange={(e) => {
                                                        setTrackingId(e.target.value.toUpperCase());
                                                        setError("");
                                                    }}
                                                    placeholder={isMobile ? "BWS-YYYYMMDD-xxx" : "Contoh: BWS-YYYYMMDD-xxx"}
                                                    className={`w-full h-12 md:h-14 pl-10 md:pl-12 pr-4 rounded-xl border text-base md:text-lg font-mono
                            bg-white text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                            transition-colors focus:outline-none focus:ring-2
                            ${error
                                                            ? "border-[var(--status-rejected)] focus:ring-[var(--status-rejected-bg)]"
                                                            : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary-bg)]"
                                                        }`}
                                                />
                                            </div>
                                            {error && (
                                                <p className="mt-2 text-sm text-[var(--status-rejected)]">{error}</p>
                                            )}
                                        </div>

                                        <Button type="submit" size="lg" className="w-full">
                                            <Search className="w-5 h-5" />
                                            Lacak Status
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Info */}
                        <div className="mt-8 p-6 bg-[var(--primary-bg)] rounded-xl">
                            <h3 className="font-semibold text-[var(--primary)] mb-3">
                                Cara mendapatkan nomor lacak:
                            </h3>
                            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                                    Nomor lacak diberikan setelah Anda mengirim permohonan perizinan
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                                    Simpan nomor lacak untuk melacak status permohonan
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                                    Anda juga akan menerima nomor lacak via email
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                    <FloatingContact />
                </div>
            </div>

            <Footer />
        </div>
    );
}
