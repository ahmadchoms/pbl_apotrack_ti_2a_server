import React from "react";
import { motion } from "framer-motion";
import { MoreVertical, Eye, Pencil, Trash2, Package } from "lucide-react";
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
import { CategoryBadge } from "./CategoryBadge";
import {
    getStockStatus,
    getExpiryWarning,
} from "@/features/pharmacy/lib/helpers";

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.055,
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export function MedicineCard({ medicine, index, onView }) {
    const primaryImage =
        medicine.images?.find((img) => img.is_primary) ?? medicine.images?.[0];
    const stockStatus = getStockStatus(medicine);
    const expiryDays = getExpiryWarning(medicine);

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden group flex flex-col"
        >
            <div className="relative aspect-4/3 bg-linear-to-br from-slate-100 to-slate-150 overflow-hidden">
                {primaryImage?.image_url ? (
                    <img
                        src={primaryImage.image_url}
                        alt={medicine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}
                <div className="absolute inset-0 items-center justify-center hidden">
                    <Package className="w-12 h-12 text-slate-300" />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 left-3">
                    <CategoryBadge category={medicine.category} />
                </div>

                <div className="absolute top-2.5 right-2.5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors">
                                <MoreVertical className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl"
                        >
                            <DropdownMenuItem
                                className="text-xs font-semibold rounded-lg cursor-pointer"
                                onClick={() => onView(medicine)}
                            >
                                <Eye className="mr-2 w-3.5 h-3.5" />
                                Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                                className="text-xs font-semibold rounded-lg cursor-pointer"
                            >
                                <Link
                                    href={route(
                                        "pharmacy.medicines.edit",
                                        medicine.id,
                                    )}
                                    className="w-full flex items-center"
                                >
                                    <Pencil className="mr-2 w-3.5 h-3.5" />
                                    Edit Obat
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-xs font-semibold text-red-500 focus:text-red-600 rounded-lg cursor-pointer"
                                    >
                                        <Trash2 className="mr-2 w-3.5 h-3.5" />
                                        Hapus
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>

                                <AlertDialogContent className="rounded-2xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Hapus Obat?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Data obat{" "}
                                            <span className="font-bold">
                                                {medicine.name}
                                            </span>{" "}
                                            akan dihapus secara permanen.
                                            Tindakan ini tidak bisa dibatalkan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-xl">
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600 rounded-xl"
                                            onClick={() =>
                                                router.delete(
                                                    `/pharmacy/medicines/${medicine.id}`,
                                                )
                                            }
                                        >
                                            Ya, Hapus
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {(stockStatus !== "ok" || expiryDays !== null) && (
                    <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                        {stockStatus === "empty" && (
                            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-500 text-white shadow">
                                Stok Habis
                            </span>
                        )}
                        {stockStatus === "low" && (
                            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500 text-white shadow">
                                Hampir Habis
                            </span>
                        )}
                        {expiryDays !== null && (
                            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-500 text-white shadow">
                                Exp {expiryDays}h
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start gap-1.5 mb-1">
                    <h3 className="text-sm font-black text-slate-900 leading-snug flex-1">
                        {medicine.name}
                    </h3>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mb-3">
                    {medicine.form} · {medicine.unit}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">
                            Stok
                        </p>
                        <p
                            className={`text-sm font-black tabular-nums ${stockStatus === "ok" ? "text-[#00346C]" : stockStatus === "low" ? "text-amber-600" : "text-red-500"}`}
                        >
                            {medicine.total_active_stock}{" "}
                            <span className="text-xs font-semibold text-slate-400">
                                Unit
                            </span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">
                            Harga
                        </p>
                        <p className="text-sm font-black text-[#00346C] tabular-nums">
                            {formatRupiah(medicine.price)}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => onView(medicine)}
                    className="mt-3 w-full h-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#00346C] hover:border-[#00346C] hover:text-white text-slate-500 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                    <Eye className="w-3 h-3" />
                    Lihat Detail
                </button>
            </div>
        </motion.div>
    );
}
