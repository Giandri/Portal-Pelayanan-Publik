"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link000, Link001, Link002, Link003, Link004, Link005 } from "../ui/skiper-ui/skiper40";

import Marquee from "@/components/ui/marquee";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }

        setIsAtTop(latest <= 50);
    });

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center gap-2">

            {/* Running Text / Marquee */}
            <div className="w-full bg-yellow-500/90 backdrop-blur-sm text-blue-950 text-[12px] font-bold py-[1px] shadow-sm border-b border-yellow-600/20">
                <Marquee pauseOnHover className="[--duration:40s] [--gap:1.5rem]">
                    <span className="mx-2">Selamat Datang di Website Resmi Balai Wilayah Sungai Bangka Belitung</span>
                    <span className="mx-2">●</span>
                    <span className="mx-2">Layanan Perizinan Online Terpadu</span>
                    <span className="mx-2">●</span>
                    <span className="mx-2">Informasi Terkini Sumber Daya Air</span>
                    <span className="mx-2">●</span>
                    <span className="mx-2">Sigap Membangun Negeri Untuk Rakyat</span>
                    <span className="mx-2">●</span>
                </Marquee>
            </div>

            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-200%" },
                }}
                animate={isHidden ? "hidden" : "visible"}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                    "w-full mx-auto bg-white/90 backdrop-blur-md rounded-[12px] px-4 md:px-6 shadow-sm border border-white/50 z-40 transition-all duration-300",
                    isAtTop ? "max-w-380" : "max-w-6xl"
                )}
            >
                <div className="flex items-center justify-between h-14">
                    {/* Logo + Institution Name */}
                    {/* Logo + Institution Name */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3">
                        <Image
                            src="/images/logo PU.png"
                            alt="Kementerian PU"
                            width={100}
                            height={100}
                            className="h-8 md:h-10 w-auto object-contain"
                            priority
                        />
                        <div className="flex flex-col -space-y-0.5">
                            <h1 className="text-xs md:text-sm font-bold uppercase text-blue-950 leading-none">
                                Balai Wilayah Sungai Bangka Belitung
                            </h1>
                            <span className="text-[9px] md:text-[11px] text-blue-950 leading-tight block">Kementerian Pekerjaan Umum</span>
                            <span className="text-[9px] md:text-[11px] text-blue-950 leading-tight block">Direktorat Jenderal Sumber Daya Air</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link005
                            href="/"
                            className="w-fit text-sm font-medium text-gray-500 hover:text-black transition-colors"
                        >
                            BERANDA
                        </Link005>

                        <Link005
                            href="/pengajuan"
                            className="w-fit text-sm font-medium text-gray-500 hover:text-black transition-colors"
                        >
                            PENGAJUAN
                        </Link005>

                        <Link005
                            href="/lacak"
                            className="w-fit text-sm font-medium text-gray-500 hover:text-black transition-colors"
                        >
                            CEK STATUS
                        </Link005>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden border-t border-gray-100"
                        >
                            <div className="py-3">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                    BERANDA
                                </Link>
                                <Link
                                    href="/pengajuan"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                    PENGAJUAN
                                </Link>
                                <Link
                                    href="/lacak"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                    CEK STATUS
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    );
}
