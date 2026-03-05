import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link003, Link001 } from "@/components/ui/skiper-ui/skiper40";

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
                                        <Link003
                                            href="/"
                                            className="w-fit text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            Beranda
                                        </Link003>
                                    </li>
                                    <li>
                                        <Link003
                                            href="/pengajuan"
                                            className="w-fit text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            Pengajuan
                                        </Link003>
                                    </li>
                                    <li>
                                        <Link003
                                            href="/lacak"
                                            className="w-fit text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            Lacak
                                        </Link003>
                                    </li>
                                </ul>
                            </div>

                            {/* Kontak */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2 text-xs tracking-wider">KONTAK</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                        <Link001 href="https://maps.app.goo.gl/oMYUJHCmTmF7gmN48" className="text-xs text-justify text-gray-500 hover:text-gray-700 transition-colors">
                                            Jln. Mentok Km.4 Pangkalpinang, Kace Timur, Kec. Mendo Barat, Kabupaten Bangka, Kepulauan Bangka Belitung 33173
                                        </Link001>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <Link003 href="https://wa.me/6281171711414" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                                            +62 81171711414 (Pengaduan BWS)
                                        </Link003>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <Link003 href="https://mail.google.com/mail/?view=cm&fs=1&to=ppid.bwsbabel@gmail.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                                            ppid.bwsbabel@gmail.com
                                        </Link003>
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
