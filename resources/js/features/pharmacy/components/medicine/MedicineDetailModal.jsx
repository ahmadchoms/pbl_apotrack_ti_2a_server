import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    History,
    Plus,
    ChevronRight,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    User,
    Clock,
} from "lucide-react";
import { router, useForm } from "@inertiajs/react";
import { formatRupiah } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";
import { getDaysUntilExpiry } from "@/features/pharmacy/lib/helpers";
import { TextInput } from "@/components/shared/TextInput";
import { toast } from "sonner";
import axios from "axios";

export function MedicineDetailModal({
    medicine: initialMedicine,
    open,
    onClose,
}) {
    const [activeTab, setActiveTab] = useState("detail");
    const [medicine, setMedicine] = useState(initialMedicine);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdjusting, setIsAdjusting] = useState(null); // batchId if adjusting

    useEffect(() => {
        if (open && initialMedicine) {
            fetchDetail();
        } else {
            setMedicine(initialMedicine);
            setActiveTab("detail");
        }
    }, [open, initialMedicine]);

    const fetchDetail = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `/pharmacy/medicines/${initialMedicine.id}`,
            );
            setMedicine(response.data.medicine);
            setHistory(response.data.history.data);
        } catch (error) {
            console.error("Failed to fetch medicine detail", error);
        } finally {
            setIsLoading(false);
        }
    };

    const {
        data: batchData,
        setData: setBatchData,
        post: postBatch,
        processing: processingBatch,
        reset: resetBatch,
    } = useForm({
        batch_number: "",
        expired_date: "",
        stock: "",
        note: "",
    });

    const {
        data: adjustData,
        setData: setAdjustData,
        patch: patchAdjust,
        processing: processingAdjust,
        reset: resetAdjust,
    } = useForm({
        new_stock: "",
        note: "",
    });

    const handleAddBatch = (e) => {
        e.preventDefault();
        router.post(`/pharmacy/medicines/${medicine.id}/batches`, batchData, {
            onSuccess: () => {
                resetBatch();
                fetchDetail();
                toast.success("Batch berhasil ditambahkan");
            },
            preserveScroll: true,
        });
    };

    const handleAdjustStock = (e) => {
        e.preventDefault();
        router.patch(
            `/pharmacy/medicines/batches/${isAdjusting}/adjust`,
            adjustData,
            {
                onSuccess: () => {
                    setIsAdjusting(null);
                    resetAdjust();
                    fetchDetail();
                    toast.success("Stok berhasil disesuaikan");
                },
                preserveScroll: true,
            },
        );
    };

    if (!medicine) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-2xl max-h-[90vh] rounded-[2.5rem] border-slate-100 p-0 overflow-hidden shadow-2xl flex flex-col"
                aria-describedby={undefined}
            >
                <DialogTitle className="hidden" />

                <div className="relative h-60 bg-linear-to-br from-slate-100 to-slate-200 overflow-hidden shrink-0">
                    {medicine.image_url ? (
                        <img
                            src={medicine.image_url}
                            alt={medicine.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-20 h-20 text-slate-300" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-8 right-8">
                        <CategoryBadge category={medicine.category} />
                        <h2 className="text-3xl font-black text-white mt-2 leading-tight drop-shadow-lg">
                            {medicine.name}
                        </h2>
                        <p className="text-sm text-white/80 font-bold mt-1 uppercase tracking-widest">
                            {medicine.generic_name ||
                                "Nama Generik Tidak Tersedia"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="flex-1 flex flex-col"
                    >
                        <div className="px-8 pt-4 bg-white border-b border-slate-50">
                            <TabsList className="bg-slate-100/50 p-1 rounded-2xl w-full max-w-sm mb-4">
                                <TabsTrigger
                                    value="detail"
                                    className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#00346C] data-[state=active]:text-white"
                                >
                                    Detail
                                </TabsTrigger>
                                <TabsTrigger
                                    value="batches"
                                    className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#00346C] data-[state=active]:text-white"
                                >
                                    Batch & Stok
                                </TabsTrigger>
                                <TabsTrigger
                                    value="history"
                                    className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#00346C] data-[state=active]:text-white"
                                >
                                    Riwayat
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                            <AnimatePresence mode="wait">
                                <TabsContent
                                    key="detail"
                                    value="detail"
                                    className="m-0 space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-3xl font-black text-[#00346C] tabular-nums">
                                            {formatRupiah(medicine.price)}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {medicine.requires_prescription && (
                                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                                                    Wajib Resep
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                                                {medicine.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
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
                                        ].map(
                                            ({ icon: Icon, label, value }) => (
                                                <div
                                                    key={label}
                                                    className="bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                                        <Icon className="w-5 h-5 text-[#00346C]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">
                                                            {label}
                                                        </p>
                                                        <p className="text-sm font-black text-slate-800 tracking-tight">
                                                            {value || "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-6 rounded-2xl bg-blue-50/40 border border-blue-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Info className="w-4 h-4 text-[#00346C]" />
                                                <p className="text-[10px] text-[#00346C] font-black uppercase tracking-widest">
                                                    Deskripsi
                                                </p>
                                            </div>
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                                                {medicine.description ||
                                                    "Tidak ada deskripsi tersedia."}
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-amber-50/40 border border-amber-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Hash className="w-4 h-4 text-amber-500" />
                                                <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest">
                                                    Petunjuk Dosis
                                                </p>
                                            </div>
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                                                {medicine.dosage_info ||
                                                    "Tidak ada informasi dosis tersedia."}
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    key="batches"
                                    value="batches"
                                    className="m-0 space-y-8"
                                >
                                    <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-8">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-3">
                                            <Plus className="w-5 h-5 text-emerald-500" />
                                            Tambah Batch Baru
                                        </h4>
                                        <form
                                            onSubmit={handleAddBatch}
                                            className="grid grid-cols-2 gap-4"
                                        >
                                            <TextInput
                                                label="No. Batch"
                                                required
                                                placeholder="B-2024..."
                                                value={batchData.batch_number}
                                                onChange={(e) =>
                                                    setBatchData(
                                                        "batch_number",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                label="Tgl. Kedaluwarsa"
                                                type="date"
                                                required
                                                value={batchData.expired_date}
                                                onChange={(e) =>
                                                    setBatchData(
                                                        "expired_date",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <div className="col-span-2">
                                                <TextInput
                                                    label="Stok Awal"
                                                    type="number"
                                                    required
                                                    placeholder="0"
                                                    value={batchData.stock}
                                                    onChange={(e) =>
                                                        setBatchData(
                                                            "stock",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="col-span-2 flex justify-end mt-2">
                                                <Button
                                                    disabled={processingBatch}
                                                    className="h-12 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200"
                                                >
                                                    Tambah Batch
                                                </Button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                                            Daftar Batch Aktif
                                        </h4>
                                        {medicine.batches?.map((batch) => {
                                            const days = getDaysUntilExpiry(
                                                batch.expired_date,
                                            );
                                            const isExpiring = days <= 90;
                                            const isEditing =
                                                isAdjusting === batch.id;

                                            return (
                                                <div
                                                    key={batch.id}
                                                    className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-mono text-[10px] font-black text-[#00346C]">
                                                                {batch.batch_number.substring(
                                                                    0,
                                                                    2,
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-800 font-mono tracking-tighter uppercase">
                                                                    {
                                                                        batch.batch_number
                                                                    }
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <CalendarClock
                                                                        className={`w-3 h-3 ${isExpiring ? "text-rose-500" : "text-slate-400"}`}
                                                                    />
                                                                    <p
                                                                        className={`text-[10px] font-bold ${isExpiring ? "text-rose-500" : "text-slate-400 uppercase tracking-widest"}`}
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
                                                                        {isExpiring && (
                                                                            <span className="ml-1 font-black">
                                                                                (
                                                                                {
                                                                                    days
                                                                                }{" "}
                                                                                hari
                                                                                lagi)
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-black text-[#00346C] tabular-nums">
                                                                {batch.stock}
                                                            </p>
                                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                                Sisa Unit
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {!isEditing ? (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setIsAdjusting(
                                                                    batch.id,
                                                                );
                                                                setAdjustData(
                                                                    "new_stock",
                                                                    batch.stock,
                                                                );
                                                            }}
                                                            className="w-full h-10 rounded-xl bg-slate-50 hover:bg-blue-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00346C] transition-all"
                                                        >
                                                            Penyesuaian Stok
                                                            Manual
                                                        </Button>
                                                    ) : (
                                                        <form
                                                            onSubmit={
                                                                handleAdjustStock
                                                            }
                                                            className="mt-4 pt-4 border-t border-slate-50 space-y-3"
                                                        >
                                                            <div className="flex items-end gap-3">
                                                                <div className="flex-1">
                                                                    <TextInput
                                                                        label="Stok Baru"
                                                                        type="number"
                                                                        required
                                                                        value={
                                                                            adjustData.new_stock
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setAdjustData(
                                                                                "new_stock",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <Button
                                                                    size="icon"
                                                                    className="h-10 w-10 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 shrink-0"
                                                                    onClick={() =>
                                                                        setIsAdjusting(
                                                                            null,
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                            <TextInput
                                                                label="Alasan Penyesuaian"
                                                                placeholder="Opname, Kerusakan, dsb..."
                                                                value={
                                                                    adjustData.note
                                                                }
                                                                onChange={(e) =>
                                                                    setAdjustData(
                                                                        "note",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <Button
                                                                disabled={
                                                                    processingAdjust
                                                                }
                                                                className="w-full h-11 rounded-xl bg-[#00346C] text-white font-black text-[10px] uppercase tracking-widest"
                                                            >
                                                                Simpan Perubahan
                                                            </Button>
                                                        </form>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    key="history"
                                    value="history"
                                    className="m-0 space-y-6"
                                >
                                    <div className="space-y-4">
                                        {history.length > 0 ? (
                                            history.map((log, idx) => (
                                                <div
                                                    key={log.id}
                                                    className="relative pl-10 pb-8 last:pb-0"
                                                >
                                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100 last:hidden" />
                                                    <div
                                                        className={`absolute left-0 top-1 w-8 h-8 rounded-xl flex items-center justify-center border-2 border-white shadow-md z-10 
                                                    ${
                                                        log.type === "IN"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : log.type === "OUT"
                                                              ? "bg-rose-50 text-rose-600"
                                                              : "bg-blue-50 text-[#00346C]"
                                                    }`}
                                                    >
                                                        {log.type === "IN" ? (
                                                            <TrendingUp className="w-4 h-4" />
                                                        ) : log.type ===
                                                          "OUT" ? (
                                                            <TrendingDown className="w-4 h-4" />
                                                        ) : (
                                                            <History className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 group hover:border-slate-200 transition-all">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                                                    Perubahan:{" "}
                                                                    <span
                                                                        className={
                                                                            log.type ===
                                                                            "IN"
                                                                                ? "text-emerald-600"
                                                                                : "text-rose-600"
                                                                        }
                                                                    >
                                                                        {log.type ===
                                                                        "IN"
                                                                            ? "+"
                                                                            : "-"}
                                                                        {
                                                                            log.quantity
                                                                        }{" "}
                                                                        Unit
                                                                    </span>
                                                                </p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                                                                    {log.type} ·
                                                                    BATCH:{" "}
                                                                    {
                                                                        log
                                                                            .batch
                                                                            ?.batch_number
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                                <Clock className="w-3 h-3" />
                                                                <p className="text-[9px] font-bold uppercase">
                                                                    {log.time ||
                                                                        new Date(
                                                                            log.created_at,
                                                                        ).toLocaleTimeString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 font-medium italic mt-2 leading-relaxed">
                                                            "
                                                            {log.note ||
                                                                "Tanpa catatan."}
                                                            "
                                                        </p>
                                                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                                                            <User className="w-3 h-3 text-slate-300" />
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                                {log.creator
                                                                    ?.username ||
                                                                    "System"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                                                <History className="w-12 h-12 text-slate-200 mb-4" />
                                                <p className="text-xs font-black uppercase tracking-widest">
                                                    Belum ada riwayat pergerakan
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </AnimatePresence>
                        </div>
                    </Tabs>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
                    <Button
                        onClick={() =>
                            router.visit(
                                route("pharmacy.medicines.edit", medicine.id),
                            )
                        }
                        className="flex-1 bg-[#00346C] hover:bg-[#002a58] text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/20"
                    >
                        <Pencil className="mr-3 w-4 h-4" />
                        Edit Master Data
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (confirm("Hapus obat ini secara permanen?")) {
                                router.delete(
                                    `/pharmacy/medicines/${medicine.id}`,
                                );
                            }
                        }}
                        className="h-14 w-14 rounded-2xl border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
