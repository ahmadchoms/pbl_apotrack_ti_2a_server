import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutGrid,
    Users,
    Building2,
    UserCircle,
    LogOut,
    ChevronRight,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

const NAV_STRUCTURE = [
    {
        id: "dashboard",
        label: "Dasbor Utama",
        icon: LayoutGrid,
        route: "admin.dashboard",
    },
    {
        id: "users",
        label: "Manajemen Pengguna",
        icon: Users,
        route: "admin.users.index",
    },
    {
        id: "pharmacies",
        label: "Daftar Apotek",
        icon: Building2,
        route: "admin.pharmacies.index",
    },
    {
        id: "profile",
        label: "Profil & Keamanan",
        icon: UserCircle,
        route: "admin.profile.index",
    },
];

function isChildActive(children, activeMenu) {
    return children?.some(
        (c) =>
            activeMenu === c.label ||
            activeMenu === c.id ||
            activeMenu?.startsWith(c.id),
    );
}

function SubMenuItem({ item, isActive, onClick }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 },
            }}
        >
            <Link
                href={item.href}
                onClick={onClick}
                className={`group relative flex items-center gap-3 ml-6 mr-3 py-2.5 px-3 rounded-xl transition-all duration-300 ${
                    isActive
                        ? "bg-[#0b3b60]/10 text-[#0b3b60]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
                <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isActive
                            ? "bg-[#0b3b60] scale-100"
                            : "bg-slate-300 scale-50 group-hover:scale-75 group-hover:bg-slate-400"
                    }`}
                />

                <div className="min-w-0 flex-1 ml-1">
                    <span
                        className={`text-xs font-bold leading-none ${isActive ? "text-[#0b3b60]" : "text-slate-600"}`}
                    >
                        {item.label}
                    </span>
                </div>

                {isActive && (
                    <motion.div
                        layoutId="sub-active-indicator"
                        className="absolute left-0 w-1 h-4 bg-[#0b3b60] rounded-r-full"
                    />
                )}
            </Link>
        </motion.div>
    );
}

function NavItem({ item, activeMenu, onNavigate }) {
    const isLeaf = !item.children;
    const hasChildren = !!item.children;
    const childActive = hasChildren && isChildActive(item.children, activeMenu);
    const selfActive =
        isLeaf &&
        (activeMenu === item.id ||
            activeMenu === item.label ||
            activeMenu === item.id.replace("dashboard", "Dasbor Utama"));
    const isGroupActive = selfActive || childActive;

    const [isOpen, setIsOpen] = useState(childActive);
    const Icon = item.icon;

    const toggleOpen = () => {
        if (hasChildren) setIsOpen((prev) => !prev);
    };

    if (isLeaf) {
        return (
            <Link
                href={route(item.route)}
                onClick={() => onNavigate?.(item.id)}
                className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    selfActive
                        ? "bg-[#0b3b60] text-white shadow-lg shadow-[#0b3b60]/20"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#0b3b60]"
                }`}
            >
                <div
                    className={`shrink-0 transition-transform duration-300 ${selfActive ? "scale-110" : "group-hover:scale-110"}`}
                >
                    <Icon
                        className={`w-5 h-5 ${selfActive ? "text-white" : "text-slate-400 group-hover:text-[#0b3b60]"}`}
                    />
                </div>
                <span
                    className={`text-sm tracking-tight flex-1 ${selfActive ? "font-black" : "font-bold"}`}
                >
                    {item.label}
                </span>
                {selfActive && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute -right-3 w-1.5 h-8 bg-[#0b3b60] rounded-l-full"
                    />
                )}
            </Link>
        );
    }

    return (
        <div className="space-y-1">
            <button
                type="button"
                onClick={toggleOpen}
                className={`group w-full relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isGroupActive
                        ? "bg-[#0b3b60]/5 text-[#0b3b60]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#0b3b60]"
                }`}
            >
                <div
                    className={`shrink-0 transition-transform duration-300 ${isGroupActive ? "scale-110" : "group-hover:scale-110"}`}
                >
                    <Icon
                        className={`w-5 h-5 ${isGroupActive ? "text-[#0b3b60]" : "text-slate-400 group-hover:text-[#0b3b60]"}`}
                    />
                </div>

                <span
                    className={`text-sm tracking-tight flex-1 text-left ${isGroupActive ? "font-black" : "font-bold"}`}
                >
                    {item.label}
                </span>

                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="shrink-0"
                >
                    <ChevronRight
                        className={`w-4 h-4 ${isGroupActive ? "text-[#0b3b60]" : "text-slate-300"}`}
                    />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            className="space-y-1 py-1"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: { staggerChildren: 0.05 },
                                },
                            }}
                        >
                            {item.children.map((child) => (
                                <SubMenuItem
                                    key={child.id}
                                    item={child}
                                    isActive={
                                        activeMenu === child.id ||
                                        activeMenu === child.label
                                    }
                                    onClick={() => onNavigate?.(child.id)}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function Sidebar({ activeMenu = "dashboard", onNavigate }) {
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
                                Admin Portal
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-6 custom-scrollbar">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4 mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        Administrator
                    </p>
                    {NAV_STRUCTURE.map((item) => (
                        <NavItem
                            key={item.id}
                            item={item}
                            activeMenu={activeMenu}
                            onNavigate={onNavigate}
                        />
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
