"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSession } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("password", password);

            const result = await setSession(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Login berhasil");
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat login");
        } finally {
            setIsLoading(false);
        }
    };

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
                            ADMIN DASHBOARD
                        </h1>
                        <p className="text-sm font-bold text-blue-950/70 tracking-wider leading-tight mt-1">
                            LAYANAN PUBLIK BWS BABEL
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-blue-900 ml-1">Password Akses</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-900/40" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password admin..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 py-6 bg-white/50 border-blue-900/10 focus:ring-yellow-400 focus:border-yellow-400 rounded-xl text-blue-950 placeholder:text-blue-900/30"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-900/40 hover:text-blue-900/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-950/20 text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Memverifikasi...
                                </>
                            ) : (
                                "Masuk Dashboard"
                            )}
                        </Button>
                    </form>

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
