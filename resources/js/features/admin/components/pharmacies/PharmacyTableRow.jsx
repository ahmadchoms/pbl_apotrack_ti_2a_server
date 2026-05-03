import React from "react";
import { 
    MoreHorizontal, 
    Pencil, 
    Eye, 
    Trash2, 
    Building2,
    Star,
    Phone,
    Pill,
    ShoppingBag
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VERIFICATION_CONFIG } from "@/features/admin/lib/constants";
import { router } from "@inertiajs/react";

export function PharmacyTableRow({ pharmacy, onDelete }) {
    const vCfg = VERIFICATION_CONFIG[pharmacy.verification_status] ?? VERIFICATION_CONFIG.PENDING;

    return (
        <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-100/50">
            <TableCell className="py-5 pl-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50 overflow-hidden">
                        {pharmacy.logo_url ? (
                            <img src={pharmacy.logo_url} alt={pharmacy.name} className="w-full h-full object-cover" />
                        ) : (
                            <Building2 className="w-6 h-6 text-slate-300" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                            {pharmacy.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 max-w-[250px] truncate">
                            {pharmacy.address}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{pharmacy.phone || "—"}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black tracking-[0.1em] ${vCfg.badge}`}>
                    <span className={`w-1 h-1 rounded-full ${vCfg.dot} animate-pulse`} />
                    {vCfg.label.toUpperCase()}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-slate-700">{pharmacy.rating || "—"}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {pharmacy.total_reviews} ULASAN
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-primary">
                            <Pill className="w-3 h-3" />
                            <span className="text-xs font-black">{pharmacy.medicines_count || 0}</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Obat</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-[#0b3b60]">
                            <ShoppingBag className="w-3 h-3" />
                            <span className="text-xs font-black">{pharmacy.orders_count || 0}</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Order</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="pr-10 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-sm p-0"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-xl w-44 p-2">
                        <DropdownMenuItem
                            onClick={() => router.get(`/admin/pharmacies/${pharmacy.id}`)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-slate-600 focus:bg-slate-50"
                        >
                            <Eye className="w-4 h-4" /> Detail Apotek
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.get(`/admin/pharmacies/${pharmacy.id}/edit`)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-slate-600 focus:bg-slate-50"
                        >
                            <Pencil className="w-4 h-4" /> Edit Apotek
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(pharmacy)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-rose-600 focus:bg-rose-50"
                        >
                            <Trash2 className="w-4 h-4" /> Hapus Apotek
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
