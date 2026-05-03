import React from "react";
import { USER_ROLE } from "@/lib/enums";
import {
    LayoutGrid,
    Users,
    UserCircle,
    LogOut,
    ShieldCheck,
    ShoppingCart,
    Pill,
    FileText,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

const NAV_STRUCTURE = [
    {
        label: "Dashboard",
        icon: LayoutGrid,
        route: "pharmacy.dashboard",
        activePattern: "pharmacy.dashboard",
    },
    {
        label: "Pesanan",
        icon: ShoppingCart,
        route: "pharmacy.orders.index",
        activePattern: "pharmacy.orders.*",
    },
    {
        label: "Inventori",
        icon: Pill,
        route: "pharmacy.medicines.index",
        activePattern: "pharmacy.medicines.*",
    },
    {
        label: "Tim Apotek",
        icon: Users,
        route: "pharmacy.staff.index",
        activePattern: "pharmacy.staff.*",
    },
    {
        label: "Laporan",
        icon: FileText,
        route: "pharmacy.reports.index",
        activePattern: "pharmacy.reports.*",
    },
    {
        label: "Profil Saya",
        icon: UserCircle,
        route: "pharmacy.profile.index",
        activePattern: "pharmacy.profile.*",
    },
];

function NavItem({ item }) {
    const Icon = item.icon;

    const isActive = route().current(item.activePattern || item.route);

    return (
        <Link
            href={route(item.route)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition ${
                isActive
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
            }`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-bold">{item.label}</span>
        </Link>
    );
}

export function Sidebar() {
    const page = usePage();
    const auth = page.props?.auth;

    const userRole = auth?.user?.pharmacy_staff?.role;
    const isApoteker = userRole === USER_ROLE.APOTEKER;

    const filteredNav = NAV_STRUCTURE.filter((item) => {
        if (
            item.route === "pharmacy.staff.index" ||
            item.route === "pharmacy.reports.index"
        ) {
            return isApoteker;
        }
        return true;
    });

    return (
        <aside className="w-68 bg-white border-r border-slate-200/60 flex flex-col justify-between h-full select-none">
            <div className="flex flex-col min-h-0 flex-1">
                <div className="px-6 py-8 shrink-0">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#0b3b60] to-[#0055a5] flex items-center justify-center shadow-lg shrink-0 -rotate-3">
                            <ShieldCheck className="w-5 h-5 text-white rotate-3" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                                ApoTrack
                            </h1>
                            <p className="text-[9px] font-black text-[#0b3b60] uppercase tracking-[0.25em] mt-1 opacity-60">
                                Apotek Portal
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 pb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4 mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        Apotek
                    </p>

                    {filteredNav.map((item) => (
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
                        Keluar Panel
                    </span>
                </Link>
            </div>
        </aside>
    );
}
