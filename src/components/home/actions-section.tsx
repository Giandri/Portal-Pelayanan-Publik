"use client";

import Link from "next/link";
import Image from "next/image";

export function ActionsSection() {
    return (
        <section className="w-full relative">
            <div className="grid grid-cols-1 md:grid-cols-3 h-[400px] md:h-[500px]">
                {/* Action 1 */}
                <Link href="/pengajuan" className="relative group overflow-hidden block h-full">
                    <Image
                        src="/images/img-1.png"
                        alt="Pengajuan Data"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/30 transition-colors" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-3xl font-bold text-white uppercase tracking-wider text-center px-4 drop-shadow-lg relative z-10 transition-transform group-hover:-translate-y-2">
                            Pengajuan<br />Data
                        </h3>
                    </div>
                </Link>

                {/* Action 2 */}
                <Link href="/lacak" className="relative group overflow-hidden block h-full">
                    <Image
                        src="/images/img-3.png"
                        alt="Cek Status Pengajuan"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-blue-800/40 group-hover:bg-blue-800/30 transition-colors" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-3xl font-bold text-white uppercase tracking-wider text-center px-4 drop-shadow-lg relative z-10 transition-transform group-hover:-translate-y-2">
                            Cek Status<br />Pengajuan
                        </h3>
                    </div>
                </Link>

                {/* Action 3 */}
                <Link href="/hubungi-kami" className="relative group overflow-hidden block h-full">
                    <Image
                        src="/images/bws-babel.jpg"
                        alt="Hubungi Kami"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/30 transition-colors" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-3xl font-bold text-white uppercase tracking-wider text-center px-4 drop-shadow-lg relative z-10 transition-transform group-hover:-translate-y-2">
                            Hubungi<br />Kami
                        </h3>
                    </div>
                </Link>
            </div>
        </section>
    );
}
