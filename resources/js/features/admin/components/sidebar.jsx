import React from "react";
import { motion } from "framer-motion";
import {
    LayoutGrid,
    Users,
    ShoppingCart,
    Pill,
    UserCircle,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

const MENU_ITEMS = [
    { id: "Dasbor Utama", icon: LayoutGrid, href: "/admin" },
    { id: "Manajemen Pengguna", icon: Users, href: "/admin/users" },
    { id: "Daftar Apotek", icon: ShoppingCart, href: "/admin/pharmacies" },
    { id: "Profil Pengguna", icon: UserCircle, href: "/admin/profile" },
];

export function Sidebar({ activeMenu = "Dasbor Utama" }) {
    return (
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between shadow-sm z-20 shrink-0 h-full">
            <div>
                <div className="p-6">
                    <h1 className="text-2xl font-extrabold text-primary tracking-tight">
                        ApoTrack
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Pharmacy Portal
                    </p>
                </div>
                <nav className="mt-2 flex flex-col gap-1 px-4">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.id;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                                    isActive
                                        ? "bg-slate-50 text-primary font-bold"
                                        : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-700 font-medium"
                                }`}
                            >
                                <Icon
                                    className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-400"}`}
                                />
                                <span className="text-sm">{item.id}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeSidebarTab"
                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-slate-50">
                <Button
                    variant="destructive"
                    className="w-full justify-start gap-3 bg-red-50 hover:bg-red-100 text-red-600 border-0 rounded-xl py-6 transition-colors shadow-none"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="font-bold">Keluar</span>
                </Button>
            </div>
        </aside>
    );
}
