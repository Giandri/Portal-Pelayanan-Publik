"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FileStack,
    UserCircle,
    ClipboardList,
    LogOut,
    Menu,
    X,
    Star,
    History as HistoryIcon,
    BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import {
    TreeProvider,
    TreeView,
    TreeNode,
    TreeNodeTrigger,
    TreeNodeContent,
    TreeIcon,
    TreeLabel,
    TreeExpander
} from "@/components/kibo-ui/tree";

type NavItem = {
    id: string;
    label: string;
    href?: string;
    icon: any;
    children?: NavItem[];
};

const navItems: NavItem[] = [
    {
        id: "dashboard-folder",
        label: "DASHBOARD",
        icon: LayoutDashboard,
        children: [
            { id: "/dashboard", href: "/dashboard", icon: LayoutDashboard, label: "Ringkasan" },
            { id: "/dashboard/surveys", href: "/dashboard/surveys", icon: Star, label: "Survei Kepuasan" },
            {
                id: "pelayanan-data",
                label: "PELAYANAN & DATA",
                icon: FileStack,
                children: [
                    { id: "/dashboard/perizinan", href: "/dashboard/perizinan", icon: FileStack, label: "Kelola Perizinan" },
                    { id: "/dashboard/data", href: "/dashboard/data", icon: ClipboardList, label: "Kelola File" },
                    { id: "/dashboard/profil", href: "/dashboard/profil", icon: UserCircle, label: "Profil Pemohon Data" },
                    { id: "/dashboard/riwayat", href: "/dashboard/riwayat", icon: HistoryIcon, label: "Riwayat Data" },
                ]
            },
            {
                id: "buku-tamu",
                label: "BUKU TAMU",
                icon: BookOpen,
                children: [
                    { id: "/dashboard/buku-tamu", href: "/dashboard/buku-tamu", icon: BookOpen, label: "Buku Tamu" },
                ]
            },


        ]
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    const activeIds = useMemo(() => {
        const ids: string[] = [];

        const findActive = (items: NavItem[]): boolean => {
            let hasActiveChild = false;
            for (const item of items) {
                if (item.href && isActive(item.href)) {
                    ids.push(item.id);
                    hasActiveChild = true;
                }
                if (item.children) {
                    if (findActive(item.children)) {
                        ids.push(item.id);
                        hasActiveChild = true;
                    }
                }
            }
            return hasActiveChild;
        };

        findActive(navItems);
        return ids;
    }, [pathname]);

    const renderNavItem = (item: NavItem) => {
        if (item.children) {
            return (
                <TreeNode key={item.id} nodeId={item.id}>
                    <TreeNodeTrigger className="mb-1 pointer-events-none hover:bg-transparent">
                        <TreeExpander hasChildren className="pointer-events-auto" />
                        <TreeIcon icon={<item.icon className="w-4 h-4 text-blue-950/40" />} />
                        <TreeLabel className="text-[10px] font-black tracking-widest text-blue-950/40 ml-1">
                            {item.label}
                        </TreeLabel>
                    </TreeNodeTrigger>
                    <TreeNodeContent hasChildren>
                        {item.children.map(renderNavItem)}
                    </TreeNodeContent>
                </TreeNode>
            );
        }

        const active = isActive(item.href!);
        return (
            <TreeNode key={item.id} nodeId={item.id}>
                <TreeNodeTrigger
                    onClick={() => {
                        router.push(item.href!);
                        setIsMobileOpen(false);
                    }}
                    className={cn(
                        "mb-1",
                        active
                            ? "bg-blue-950 text-yellow-400 hover:bg-blue-900"
                            : "text-slate-600 hover:bg-yellow-50 hover:text-blue-950"
                    )}
                >
                    <TreeIcon
                        icon={<item.icon className={cn("w-4 h-4", active ? "text-yellow-400" : "text-slate-400")} />}
                    />
                    <TreeLabel className={cn("text-[13px] font-medium", active && "font-bold text-yellow-400")}>
                        {item.label}
                    </TreeLabel>
                </TreeNodeTrigger>
            </TreeNode>
        );
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-5 right-4 z-50 lg:hidden p-2 rounded-sm bg-white/90 shadow-md border border-gray-200"
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
                    "fixed left-4 top-[88px] bottom-4 w-44 z-40 transition-transform lg:translate-x-0",
                    isMobileOpen ? "translate-x-0" : "-translate-x-[120%]"
                )}
            >
                <div className="h-full flex flex-col bg-white/70 backdrop-blur-xl rounded-lg border border-yellow-200/80 shadow-lg overflow-hidden py-5">
                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                        <TreeProvider
                            defaultExpandedIds={["dashboard-folder", "pelayanan-data"]}
                            selectedIds={activeIds}
                            indent={12}
                            showLines={false}
                        >
                            <TreeView>
                                {navItems.map(renderNavItem)}
                            </TreeView>
                        </TreeProvider>
                    </div>

                    {/* Logout */}
                    <div className="px-4 pt-4 mt-auto border-t border-gray-100">
                        <Link
                            href="/"
                            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
                        >
                            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                            <span className="text-[13px] font-bold tracking-wide">KELUAR</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
