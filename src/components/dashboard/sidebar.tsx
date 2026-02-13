"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileStack,
    UserCircle,
    ClipboardList,
    LogOut,
    Menu,
    X,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "RINGKASAN" },
    { href: "/dashboard/perizinan", icon: FileStack, label: "KELOLA\nPERIZINAN" },
    { href: "/dashboard/data", icon: ClipboardList, label: "KELOLA\nDATA" },
    { href: "/dashboard/profil", icon: UserCircle, label: "PROFIL\nPEMOHON" },
    { href: "/dashboard/surveys", icon: Star, label: "SURVEI\nKEPUASAN" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-5 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/90 shadow-md border border-gray-200"
            >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-4 top-[88px] bottom-4 w-[88px] z-40 transition-transform lg:translate-x-0",
                    isMobileOpen ? "translate-x-0" : "-translate-x-[120%]"
                )}
            >
                <div className="h-full flex flex-col bg-white/70 backdrop-blur-xl rounded-[28px] border border-yellow-200/80 shadow-lg overflow-hidden">
                    {/* Navigation */}
                    <nav className="flex-1 flex flex-col items-center pt-3 pb-2 gap-1 px-2">
                        {sidebarLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "w-full flex flex-col items-center gap-1 py-3 px-1 rounded-2xl text-center transition-all duration-200",
                                        active
                                            ? "bg-blue-950 text-yellow-400 shadow-md"
                                            : "text-gray-500 hover:bg-yellow-50 hover:text-blue-950"
                                    )}
                                >
                                    <link.icon className={cn("w-6 h-6", active ? "text-yellow-400" : "text-gray-500")} />
                                    <span className="text-[9px] font-bold leading-tight whitespace-pre-line tracking-wide">
                                        {link.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="px-2 pb-4">
                        <Link
                            href="/"
                            className="w-full flex flex-col items-center gap-1 py-3 px-1 rounded-2xl text-center text-red-500 hover:bg-red-50 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-[9px] font-bold tracking-wide">KELUAR</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
