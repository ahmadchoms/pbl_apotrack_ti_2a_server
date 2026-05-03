import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PharmacyHero({ data, getStatusBadge }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
                <Link
                    href={route("admin.pharmacies.index")}
                    className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-4 group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
                    Kembali ke Daftar
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {data.name}
                    </h1>
                    {getStatusBadge(data.verification_status)}
                </div>
                <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />{" "}
                    {data.address}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href={route("admin.pharmacies.edit", data.id)}
                    className="inline-flex items-center justify-center rounded-2xl h-12 px-6 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                    Edit Profil
                </Link>
                <Link
                    href={route("admin.profile.audit-history", {
                        search: data.name,
                    })}
                    className="inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-[#00346C] hover:bg-[#002a58] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all"
                >
                    Log Aktivitas
                </Link>
            </div>
        </div>
    );
}
