import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutGrid,
    Users,
    UserCircle,
    LogOut,
    ChevronRight,
    ShieldCheck,
    ShoppingCart,
    ClipboardList,
    ListOrdered,
    Scan,
    Pill,
    ShoppingBag,
    PackagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, usePage } from "@inertiajs/react";

const NAV_STRUCTURE = [
    {
        label: "Dashboard",
        icon: LayoutGrid,
        route: "pharmacy.dashboard",
    },
    {
        label: "Tim Apotek",
        icon: Users,
        route: "pharmacy.staff",
    },
    {
        label: "Pesanan",
        icon: ShoppingCart,
        children: [
            {
                label: "Manajemen",
                icon: ClipboardList,
                route: "pharmacy.orders.index",
            },
            {
                label: "Riwayat",
                icon: ListOrdered,
                route: "pharmacy.orders.list",
            },
            {
                label: "Kasir POS",
                icon: Scan,
                route: "pharmacy.orders.pos",
                badge: "POS",
            },
        ],
    },
    {
        label: "Inventaris",
        icon: Pill,
        children: [
            {
                label: "Katalog Obat",
                icon: ShoppingBag,
                route: "pharmacy.medicines.index",
            },
            {
                label: "Tambah Stok",
                icon: PackagePlus,
                route: "pharmacy.medicines.create",
            },
        ],
    },
    {
        label: "Profil Saya",
        icon: UserCircle,
        route: "pharmacy.profile",
    },
];

function SubMenuItem({ item }) {
    const isActive = route().current(item.route);
    const Icon = item.icon;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 },
            }}
        >
            <Link
                href={route(item.route)}
                className={`group flex items-center gap-3 ml-6 mr-3 py-2.5 px-3 rounded-xl transition ${
                    isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
                <div
                    className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-primary" : "bg-slate-300"
                    }`}
                />

                <span
                    className={`text-xs font-bold ${
                        isActive ? "text-primary" : "text-slate-600"
                    }`}
                >
                    {item.label}
                </span>

                {item.badge && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-primary text-white ml-auto">
                        {item.badge}
                    </span>
                )}
            </Link>
        </motion.div>
    );
}

function NavItem({ item }) {
    const isLeaf = !item.children;
    const hasChildren = !!item.children;
    const Icon = item.icon;

    const selfActive = isLeaf && route().current(item.route);

    const childActive =
        hasChildren &&
        item.children.some((child) => route().current(child.route));

    const isGroupActive = selfActive || childActive;

    const [isOpen, setIsOpen] = useState(false);

    // 🔥 auto open kalau child active
    useEffect(() => {
        if (childActive) setIsOpen(true);
    }, [childActive]);

    if (isLeaf) {
        return (
            <Link
                href={route(item.route)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition ${
                    selfActive
                        ? "bg-primary text-white"
                        : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                }`}
            >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-bold">{item.label}</span>
            </Link>
        );
    }

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl ${
                    isGroupActive
                        ? "bg-primary/5 text-primary"
                        : "text-slate-500 hover:bg-slate-50"
                }`}
            >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left text-sm font-bold">
                    {item.label}
                </span>
                <ChevronRight
                    className={`w-4 h-4 transition ${
                        isOpen ? "rotate-90" : ""
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-1 py-1">
                            {item.children.map((child) => (
                                <SubMenuItem key={child.route} item={child} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function Sidebar() {
    const page = usePage();
    const auth = page.props?.auth;

    const userRole = auth?.user?.pharmacy_staff?.role;
    const isApoteker = userRole === "APOTEKER";

    const filteredNav = NAV_STRUCTURE.filter((item) => {
        if (item.route === "pharmacy.staff") {
            return isApoteker;
        }
        return true;
    });

    return (
        <aside className="w-68 bg-white border-r border-slate-200/60 flex flex-col justify-between z-20 shrink-0 h-full select-none">
            <div className="flex flex-col min-h-0 flex-1">
                <div className="px-6 py-8 shrink-0">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#0b3b60] to-[#0055a5] flex items-center justify-center shadow-lg shadow-[#0b3b60]/30 shrink-0 transform -rotate-3">
                            <ShieldCheck className="w-5 h-5 text-white transform rotate-3" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                                ApoTrack
                            </h1>
                            <p className="text-[9px] font-black text-[#0b3b60] uppercase tracking-[0.25em] mt-1 leading-none opacity-60">
                                Apotek Portal
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-6 custom-scrollbar">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4 mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        Apotek
                    </p>
                    {filteredNav.map((item, idx) => (
                        <NavItem key={idx} item={item} />
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-100 shrink-0">
                <Link
                    href={route("auth.logout")}
                    method="post"
                    className="w-full cursor-pointer"
                >
                    <div className="group w-full gap-3.5 h-12 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <span>Keluar Panel</span>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
