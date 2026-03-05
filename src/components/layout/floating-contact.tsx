"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function FloatingContact() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100, rotate: -20 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1
            }}
            className="fixed bottom-5 right-10 md:bottom-8 md:right-10 z-60"
        >
            <Link
                href="https://wa.me/6281171711414"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
            >
                {/* Tooltip with modern animation */}
                <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-950/90 backdrop-blur-md text-white text-[10px] font-black rounded-full opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300 whitespace-nowrap shadow-2xl border border-white/20 pointer-events-none uppercase tracking-widest leading-none">
                    Hubungi Admin
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-blue-950/90 rotate-45 border-r border-t border-white/20" />
                </span>

                {/* Modern Floating & Breathing Container */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-12 h-12 md:w-20 md:h-20 flex items-center justify-center cursor-pointer"
                >
                    {/* Butuh Bantuan Pop-up Bubble (Now inside the breathing container) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="absolute bottom-full mb-2 md:mb-4 px-2.5 py-1.5 md:px-4 md:py-2 bg-blue-950 border border-white/20 rounded-full shadow-2xl flex items-center justify-center whitespace-nowrap"
                    >
                        <span className="text-[8px] md:text-[10px] font-black text-yellow-400 uppercase tracking-widest leading-none">
                            Butuh bantuan?
                        </span>
                        {/* Bubble Tail */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-950 rotate-45 border-r border-b border-white/20" />
                    </motion.div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl md:blur-2xl group-hover:bg-yellow-400/50 transition-colors duration-500 animate-pulse" />

                    <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative z-10 w-full h-full drop-shadow-[0_10px_15px_rgba(251,176,59,0.3)] filter brightness-110"
                    >
                        <Image
                            src="/images/bws icon.png"
                            alt="Contact Admin"
                            width={100}
                            height={100}
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                </motion.div>
            </Link>
        </motion.div>
    );
}
