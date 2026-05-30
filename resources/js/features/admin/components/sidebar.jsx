import React from "react";
import { LayoutGrid, Users, Building2, UserCircle, LogOut } from "lucide-react";
import { Link } from "@inertiajs/react";

const NAV_STRUCTURE = [
    {
        label: "Dasbor Utama",
        icon: LayoutGrid,
        route: "admin.dashboard",
        activePattern: "admin.dashboard",
    },
    {
        label: "Manajemen Pengguna",
        icon: Users,
        route: "admin.users.index",
        activePattern: "admin.users.*",
    },
    {
        label: "Daftar Apotek",
        icon: Building2,
        route: "admin.pharmacies.index",
        activePattern: "admin.pharmacies.*",
    },
    {
        label: "Profil & Keamanan",
        icon: UserCircle,
        route: "admin.profile.index",
        activePattern: "admin.profile.*",
    },
];

function NavItem({ item }) {
    const Icon = item.icon;

    const isActive = route().current(item.activePattern || item.route);

    return (
        <Link
            href={route(item.route)}
            className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
            }`}
        >
            <div
                className={`shrink-0 transition-transform duration-300 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                }`}
            >
                <Icon
                    className={`w-5 h-5 ${
                        isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-primary"
                    }`}
                />
            </div>

            <span
                className={`text-sm tracking-tight flex-1 ${
                    isActive ? "font-black" : "font-bold"
                }`}
            >
                {item.label}
            </span>

            {isActive && (
                <div className="absolute -right-3 w-1.5 h-8 bg-primary rounded-l-full" />
            )}
        </Link>
    );
}

export function Sidebar() {
    return (
        <aside className="w-68 bg-white border-r border-slate-200/60 flex flex-col justify-between h-full select-none">
            <div className="flex flex-col min-h-0 flex-1">
                <div className="px-6 pt-8 pb-4 shrink-0">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-primary">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shrink-0 border border-slate-100">
                            <img
                                src="/logo.png"
                                alt="ApoTrack Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h1 className="text-lg font-black text-white tracking-wide leading-none mb-1">
                            Apotrack
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-6 mt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4 mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        menu utama
                    </p>

                    {NAV_STRUCTURE.map((item) => (
                        <NavItem key={item.route} item={item} />
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-100 shrink-0">
                <Link
                    href={route("auth.logout")}
                    method="post"
                    as="button"
                    className="w-full cursor-pointer flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition group"
                >
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center transition group-hover:bg-red-600 group-hover:text-white">
                        <LogOut className="w-4 h-4" />
                    </div>

                    <span className="text-sm font-bold tracking-tight">
                        Log Out
                    </span>
                </Link>
            </div>
        </aside>
    );
}
