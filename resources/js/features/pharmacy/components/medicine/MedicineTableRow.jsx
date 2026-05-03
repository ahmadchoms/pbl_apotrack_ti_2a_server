import React from "react";
import { 
    MoreVertical, 
    Pencil, 
    Eye, 
    Trash2, 
    Package,
    AlertCircle,
    CheckCircle2,
    Clock
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { CATEGORY_COLORS, DEFAULT_COLOR } from "@/features/pharmacy/lib/constants";
import { formatRupiah } from "@/lib/utils";
import { getStockStatus } from "@/features/pharmacy/lib/helpers";
import { Link } from "@inertiajs/react";

export function MedicineTableRow({ medicine, onView, onDelete }) {
    const catCfg = CATEGORY_COLORS[medicine.category] || DEFAULT_COLOR;
    const stockStatus = getStockStatus(medicine);

    return (
        <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-100/50">
            <TableCell className="py-5 pl-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50 overflow-hidden shadow-sm">
                        {medicine.image_url ? (
                            <img src={medicine.image_url} alt={medicine.name} className="w-full h-full object-cover" />
                        ) : (
                            <Package className="w-6 h-6 text-slate-300" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                            {medicine.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {medicine.form} · {medicine.unit}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${catCfg.bg} ${catCfg.text} ${catCfg.border}`}
                >
                    {medicine.category.toUpperCase()}
                </Badge>
            </TableCell>
            <TableCell>
                <span className="text-sm font-black text-slate-700">{formatRupiah(medicine.price)}</span>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${
                            stockStatus === "empty" ? "text-rose-500" : 
                            stockStatus === "low" ? "text-amber-500" : "text-emerald-600"
                        }`}>
                            {medicine.total_active_stock}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase">Unit</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.1em] ${
                        stockStatus === "empty" ? "text-rose-400" : 
                        stockStatus === "low" ? "text-amber-400" : "text-emerald-400"
                    }`}>
                        {stockStatus === "empty" ? "Stok Habis" : stockStatus === "low" ? "Stok Menipis" : "Stok Aman"}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                {medicine.is_active ? (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Aktif</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Non-Aktif</span>
                    </div>
                )}
            </TableCell>
            <TableCell className="pr-10 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-all group-hover:scale-105 shadow-sm p-0"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-xl w-48 p-2">
                        <DropdownMenuItem
                            onClick={() => onView(medicine)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-slate-600 focus:bg-slate-50"
                        >
                            <Eye className="w-4 h-4" /> Detail & Stok
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link 
                                href={route("pharmacy.medicines.edit", medicine.id)}
                                className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-slate-600 focus:bg-slate-50 w-full flex items-center"
                            >
                                <Pencil className="w-4 h-4 mr-2" /> Edit Master
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(medicine)}
                            className="rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer text-rose-600 focus:bg-rose-50"
                        >
                            <Trash2 className="w-4 h-4" /> Hapus Obat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
