import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Package,
    X,
    FlaskConical,
    Layers,
    Factory,
    Tag,
    Info,
    Hash,
    CalendarClock,
    Pencil,
    Trash2,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { formatRupiah } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";
import { getDaysUntilExpiry } from "@/features/pharmacy/lib/helpers";
import {
    TYPE_CONFIG,
    LOW_STOCK_THRESHOLD,
    EXPIRY_WARN_DAYS,
} from "@/features/pharmacy/lib/constants";

export function MedicineDetailModal({ medicine, open, onClose }) {
    if (!medicine) return null;
    const typeConfig = TYPE_CONFIG[medicine.type] ?? TYPE_CONFIG["Obat Bebas"];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-sm md:max-w-lg max-h-[90vh] rounded-3xl border-black p-0 overflow-y-scroll no-scrollbar shadow-2xl"
                aria-describedby={undefined}
            >
                <DialogTitle className="hidden" />
                <div className="relative h-52 bg-linear-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {medicine.images?.[0]?.image_url ? (
                        <img
                            src={medicine.images[0].image_url}
                            alt={medicine.name}
                            className="w-full h-full object-cover opacity-80"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-slate-300" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                        <CategoryBadge category={medicine.category} />
                        <h2 className="text-xl font-black text-white mt-1.5 leading-tight drop-shadow">
                            {medicine.name}
                        </h2>
                        <p className="text-xs text-white/70 font-medium mt-0.5">
                            {medicine.generic_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-[#00346C]">
                            {formatRupiah(medicine.price)}
                        </p>
                        <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${typeConfig.badge}`}
                        >
                            <typeConfig.icon className="w-3 h-3" />
                            {medicine.type}
                        </span>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {
                                icon: FlaskConical,
                                label: "Bentuk",
                                value: medicine.form,
                            },
                            {
                                icon: Layers,
                                label: "Satuan",
                                value: medicine.unit,
                            },
                            {
                                icon: Factory,
                                label: "Produsen",
                                value: medicine.manufacturer,
                            },
                            {
                                icon: Tag,
                                label: "Kategori",
                                value: medicine.category,
                            },
                        ].map(({ icon: Icon, label, value }) => (
                            <div
                                key={label}
                                className="bg-slate-50 rounded-2xl px-3.5 py-3 flex items-start gap-2.5"
                            >
                                <div className="w-7 h-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                        {label}
                                    </p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {medicine.description && (
                        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl px-4 py-3.5 flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-1">
                                    Deskripsi
                                </p>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    {medicine.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {medicine.dosage_info && (
                        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-2.5">
                            <Hash className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mb-1">
                                    Dosis
                                </p>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    {medicine.dosage_info}
                                </p>
                            </div>
                        </div>
                    )}

                    <Separator className="bg-slate-100" />

                    <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                            <span className="inline-block w-3 h-px bg-slate-300" />
                            Stok & Batch
                        </p>
                        <div className="space-y-2">
                            {medicine.batches?.map((batch) => {
                                const days = getDaysUntilExpiry(
                                    batch.expired_date,
                                );
                                const expiring = days <= EXPIRY_WARN_DAYS;
                                return (
                                    <div
                                        key={batch.id}
                                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl border ${expiring ? "bg-amber-50/60 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                                    >
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 font-mono">
                                                {batch.batch_number}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <CalendarClock
                                                    className={`w-3 h-3 ${expiring ? "text-amber-500" : "text-slate-400"}`}
                                                />
                                                <p
                                                    className={`text-[10px] font-semibold ${expiring ? "text-amber-600" : "text-slate-400"}`}
                                                >
                                                    Exp:{" "}
                                                    {new Date(
                                                        batch.expired_date,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                    {expiring && (
                                                        <span className="ml-1 font-black">
                                                            ({days} hari)
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`text-sm font-black tabular-nums ${batch.stock <= LOW_STOCK_THRESHOLD ? "text-red-500" : "text-[#00346C]"}`}
                                            >
                                                {batch.stock}
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
                                                unit
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <Button
                            onClick={() =>
                                router.visit(`/pharmacy/medicines/${medicine.id}/edit`)
                            }
                            className="flex-1 bg-linear-to-r from-[#00346C] to-[#0055a5] hover:from-[#002a58] hover:to-[#00469a] text-white h-11 rounded-xl font-bold text-sm shadow-md shadow-[#00346C]/20"
                        >
                            <Pencil className="mr-2 w-4 h-4" />
                            Edit Obat
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (confirm("Apakah Anda yakin ingin menghapus obat ini?")) {
                                    router.delete(`/pharmacy/medicines/${medicine.id}`);
                                }
                            }}
                            className="h-11 rounded-xl border-red-200 text-red-500 hover:bg-red-50 px-4"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
