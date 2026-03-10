"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, ScanLine } from "lucide-react";

export default function AdminMenuPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background - Blueprint style matching Dashboard */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-white" />
                <Image
                    src="/images/bg-3.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-[0.8] mix-blend-multiply object-bottom"
                />
                {/* Subtle grid pattern overlay */}
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

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-6"
            >
                <div className="bg-white/80 backdrop-blur-md rounded-[24px] shadow-2xl p-8 border border-yellow-200/70">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/images/logo PU.png"
                                alt="Logo PU"
                                width={80}
                                height={80}
                                className="drop-shadow-md"
                            />
                        </div>
                        <h1 className="text-2xl font-extrabold text-blue-950 tracking-wide leading-tight">
                            PILIH MENU
                        </h1>
                        <p className="text-sm font-bold text-blue-950/70 tracking-wider leading-tight mt-1">
                            ADMIN LAYANAN PUBLIK
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link href="/scan" className="block">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-950/20 group"
                            >
                                <ScanLine className="w-12 h-12 text-yellow-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-lg tracking-wide">SCAN BARCODE</span>
                            </motion.div>
                        </Link>
                        
                        <Link href="/dashboard" className="block">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-white hover:bg-yellow-50 text-blue-950 border-2 border-blue-950/10 rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors shadow-md group"
                            >
                                <LayoutDashboard className="w-12 h-12 text-blue-900/70 group-hover:text-blue-950 group-hover:scale-110 transition-all" />
                                <span className="font-bold text-lg tracking-wide">DASHBOARD ADMIN</span>
                            </motion.div>
                        </Link>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-blue-900/40 font-medium">
                            &copy; 2026 Balai Wilayah Sungai Bangka Belitung.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
