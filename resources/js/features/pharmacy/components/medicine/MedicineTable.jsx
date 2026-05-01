import React from "react";
import { motion } from "framer-motion";
import { 
    MoreVertical, 
    Eye, 
    Pencil, 
    Trash2, 
    Package, 
    AlertCircle,
    CheckCircle2,
    XCircle,
    Info
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatRupiah } from "@/lib/utils";
import { getStockStatus } from "@/features/pharmacy/lib/helpers";

export function MedicineTable({ medicines, onView }) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Obat & Info</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Harga</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stok Aktif</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {medicines.map((medicine, idx) => {
                            const stockStatus = getStockStatus(medicine);
                            return (
                                <motion.tr 
                                    key={medicine.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="group hover:bg-slate-50/80 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200/50">
                                                {medicine.image_url ? (
                                                    <img src={medicine.image_url} alt={medicine.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-5 h-5 text-slate-300" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-tight mb-0.5">{medicine.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{medicine.form} · {medicine.unit}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-[#00346C] text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                            {medicine.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-black text-slate-700">{formatRupiah(medicine.price)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <p className={`text-sm font-black tabular-nums ${stockStatus === 'empty' ? 'text-red-500' : stockStatus === 'low' ? 'text-amber-500' : 'text-[#00346C]'}`}>
                                                {medicine.total_active_stock}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Unit Aktif</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {medicine.is_active ? (
                                            <div className="flex items-center gap-1.5 text-emerald-600">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Aktif</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <XCircle className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Non-Aktif</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 flex items-center justify-center transition-all">
                                                    <MoreVertical className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-slate-100">
                                                <DropdownMenuItem 
                                                    className="rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-blue-50 focus:text-[#00346C] cursor-pointer"
                                                    onClick={() => onView(medicine)}
                                                >
                                                    <Eye className="mr-3 w-4 h-4" />
                                                    Detail & Stok
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-blue-50 focus:text-[#00346C] cursor-pointer"
                                                    asChild
                                                >
                                                    <Link href={route('pharmacy.medicines.edit', medicine.id)}>
                                                        <Pencil className="mr-3 w-4 h-4" />
                                                        Edit Master
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-50 my-1" />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem 
                                                            onSelect={(e) => e.preventDefault()}
                                                            className="rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                                        >
                                                            <Trash2 className="mr-3 w-4 h-4" />
                                                            Hapus Obat
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-3xl p-8 border-slate-100 shadow-2xl">
                                                        <AlertDialogHeader>
                                                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                                                                <AlertCircle className="w-7 h-7 text-red-500" />
                                                            </div>
                                                            <AlertDialogTitle className="text-xl font-black text-slate-900">Hapus Data Obat?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-sm font-medium text-slate-500 leading-relaxed">
                                                                Obat <span className="text-slate-900 font-bold">{medicine.name}</span> akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi data riwayat stok.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="mt-8 gap-3">
                                                            <AlertDialogCancel className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border-slate-200">Batal</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 transition-all active:scale-95"
                                                                onClick={() => router.delete(`/pharmacy/medicines/${medicine.id}`)}
                                                            >
                                                                Ya, Hapus Data
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {medicines.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <Package className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">Tidak ada data obat</p>
                </div>
            )}
        </div>
    );
}
