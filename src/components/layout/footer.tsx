import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="py-8 md:py-10 relative">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
                    {/* Brand - 1 column */}
                    <div className="bg-gray-200 rounded-2xl p-5">
                        <Link href="/" className="flex items-center gap-3 mb-3">
                            <Image
                                src="/images/logo PU.png"
                                alt="Portal Pelayanan Publik"
                                width={140}
                                height={40}
                                className="h-9 w-auto object-contain"
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-700">PORTAL</p>
                                <p className="text-xs font-semibold text-gray-600">PELAYANAN PUBLIK</p>
                            </div>
                        </Link>
                        <p className="text-xs text-gray-500 text-justify leading-relaxed">
                            Melayani masyarakat dengan integritas, transparansi, dan profesionalisme untuk pengelolaan sumber daya air yang berkelanjutan.
                        </p>
                    </div>

                    {/* Layanan Kami & Kontak - 3 columns */}
                    <div className="md:col-span-3 bg-gray-200 rounded-2xl p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Layanan Kami */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2 text-xs tracking-wider">PINTASAN</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href="/"
                                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            Beranda
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/pengajuan"
                                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            Pengajuan
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/lacak"
                                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            Lacak
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Kontak */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2 text-xs tracking-wider">KONTAK</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                        <span className="text-xs text-gray-500 leading-relaxed">
                                            Jln. Mentok Km.4 Pangkalpinang, Kota Timur, Merudu, Barat, Kabupaten Bangka, Kepulauan Bangka Belitung 33215
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <a href="tel:+627174243534" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                                            +62 (717) 4243534
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <a href="mailto:bbws.babelbb@gmail.com" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                                            bbws.babelbb@gmail.com
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
