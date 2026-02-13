"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Settings } from "lucide-react";

export function FeaturesSection() {
    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {/* Feature 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-yellow-500 rounded-2xl rotate-45 flex items-center justify-center mb-6 shadow-lg">
                            <div className="-rotate-45">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Layanan Terverifikasi</h3>
                        <p className="text-gray-500 text-sm max-w-xs">Proses verifikasi resmi sesuai standar operasional prosedur (SOP) Kementerian PUPR.</p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-yellow-500 rounded-2xl rotate-45 flex items-center justify-center mb-6 shadow-lg">
                            <div className="-rotate-45">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Keamanan Data</h3>
                        <p className="text-gray-500 text-sm max-w-xs">Data pribadi dan kerahasiaan dokumen publik yang diunggah melalui sistem dengan aman.</p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-yellow-500 rounded-2xl rotate-45 flex items-center justify-center mb-6 shadow-lg">
                            <div className="-rotate-45">
                                <Settings className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Sistem Terintegrasi</h3>
                        <p className="text-gray-500 text-sm max-w-xs">Memacu perizinan dilakukan secara efisien & memastikan pelayanan yang lebih cepat.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
