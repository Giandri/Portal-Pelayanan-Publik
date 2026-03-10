"use client";

import { motion } from "framer-motion";
import { Search, FileText, Home } from "lucide-react";
import Image from "next/image";
import { Dock, DockLink } from "@/components/dock";

export function IntroductionSection() {
    return (
        <section className="py-6 bg-white relative overflow-hidden">
            {/* Parallax Background */}
            <div
                className="absolute inset-0 z-0 bg-fixed bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('/images/bg-1.png')" }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex justify-center mb-4 ">
                    <Dock>
                        <DockLink
                            href="/"
                            label="BERANDA"
                            icon={<Home size={10} />}
                        />
                        <DockLink
                            href="/buku-tamu"
                            label="BUKU TAMU"
                            icon={<FileText size={10} />}
                        />
                        <DockLink
                            href="/pengajuan"
                            label="PENGAJUAN"
                            icon={<FileText size={10} />}
                        />
                        <DockLink
                            href="/lacak"
                            label="CEK STATUS"
                            icon={<Search size={10} />}
                        />
                    </Dock>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Image Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-3/12 flex justify-center"
                    >
                        <div className="relative w-64 h-64 md:w-72 md:h-72">
                            <div className="w-full h-full overflow-hidden shadow-2xl relative rounded-[2.5rem]">
                                <Image
                                    src="/images/bg/bg-3.png"
                                    alt="Pembangunan Bendungan"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/10" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-9/12 flex flex-col items-center text-center"
                    >
                        <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-700 border border-blue-200 rounded-full font-bold font-mono text-sm mb-6 tracking-wide">
                            #MengelolaAirUntukNegeri
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-[#FBB03B] mb-3 leading-tight uppercase tracking-wide">
                            SIGAP MEMBANGUN NEGERI UNTUK RAKYAT
                        </h2>
                        <p className="text-slate-700 text-sm md:text-lg leading-relaxed font-mono max-w-4xl">
                            "Transformasi digital untuk pengelolaan sumber daya air yang lebih transparan, akuntabel, dan mudah diakses bagi seluruh masyarakat Kepulauan Bangka Belitung."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
