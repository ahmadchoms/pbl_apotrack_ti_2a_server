import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingBag,
    Truck,
    ReceiptText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Pill,
    Clock,
    User,
    MapPin,
    ZoomIn,
    ChevronRight,
    ArrowRight,
    Package,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { STATUS_CONFIG } from "@/features/pharmacy/lib/constants";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export function OrderDetailModal({ order, open, onClose }) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectionInput, setShowRejectionInput] = useState(false);

    if (!order) return null;

    const statusCfg =
        STATUS_CONFIG[order.order_status] || STATUS_CONFIG.PENDING;
    const isDelivery = order.service_type === "DELIVERY";
    const needsPrescription = order.requires_prescription;

    const handleUpdateStatus = (status, note = null) => {
        router.patch(
            route("pharmacy.orders.status.update", order.id),
            {
                status,
                note,
            },
            {
                onSuccess: () => {
                    toast.success(
                        `Status pesanan berhasil diupdate ke ${status}`,
                    );
                    onClose();
                },
            },
        );
    };

    const handleReject = () => {
        if (!rejectionReason) {
            toast.error("Alasan penolakan wajib diisi");
            return;
        }
        router.patch(
            route("pharmacy.orders.reject", order.id),
            {
                reason: rejectionReason,
            },
            {
                onSuccess: () => {
                    toast.success("Pesanan berhasil ditolak");
                    onClose();
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="min-w-sm md:min-w-4xl overflow-y-auto md:overflow-hidden p-0 rounded-[2.5rem] border-slate-100 flex flex-col md:flex-row shadow-2xl">
                <div className="flex-1 overflow-y-auto p-8 bg-white no-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#00346C] to-[#0055a5] flex items-center justify-center shadow-lg shadow-[#00346C]/20">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    Detail Pesanan
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                                    {order.order_number}
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border ${statusCfg.badge}`}
                        >
                            {statusCfg.label}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" /> Informasi
                                    Pelanggan
                                </h3>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-sm font-bold text-slate-800">
                                        {order.buyer?.username}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {order.buyer?.email}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 font-mono">
                                        {order.buyer?.phone}
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" /> Metode
                                    Pengiriman
                                </h3>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                            {isDelivery ? (
                                                <Truck className="w-5 h-5 text-indigo-500" />
                                            ) : (
                                                <Package className="w-5 h-5 text-amber-500" />
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-slate-700">
                                            {isDelivery
                                                ? "Kurir (Delivery)"
                                                : "Ambil Sendiri (Pickup)"}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ReceiptText className="w-3.5 h-3.5" /> Rincian
                                Item
                            </h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                                {order.items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Pill className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold text-slate-800 truncate">
                                                {item.medicine_name}
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-medium">
                                                {item.quantity} {item.unit_name}{" "}
                                                x {formatRupiah(item.price)}
                                            </p>
                                        </div>
                                        <p className="text-[11px] font-black text-[#00346C]">
                                            {formatRupiah(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-4 bg-[#00346C]/5 rounded-2xl border border-[#00346C]/10 flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#00346C]/60 uppercase tracking-widest">
                                    Total Pembayaran
                                </span>
                                <span className="text-base font-black text-[#00346C]">
                                    {formatRupiah(order.grand_total)}
                                </span>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="w-full md:w-80 bg-slate-50 border-l border-slate-100 p-8 flex flex-col gap-8">
                    {needsPrescription ? (
                        <section className="flex-1 min-h-0 flex flex-col">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ReceiptText className="w-3.5 h-3.5" /> Validasi
                                Resep
                            </h3>
                            <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200 bg-white group shadow-inner">
                                {order.prescription?.image_url ? (
                                    <>
                                        <img
                                            src={order.prescription.image_url}
                                            alt="Resep"
                                            className="w-full h-full object-cover cursor-zoom-in"
                                        />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                        <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">
                                            Resep Belum Diunggah
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Otomatis Valid
                            </p>
                            <p className="text-xs text-slate-500 mt-2 font-medium italic">
                                "Tidak mengandung obat resep keras"
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> Perbarui Status
                        </h3>

                        <div className="space-y-2.5">
                            {order.order_status === "PENDING" &&
                                !showRejectionInput && (
                                    <>
                                        <Button
                                            className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20"
                                            onClick={() =>
                                                handleUpdateStatus("PROCESSING")
                                            }
                                        >
                                            Setujui & Proses{" "}
                                            <CheckCircle2 className="ml-2 w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full h-11 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 font-black text-[10px] uppercase tracking-[0.2em]"
                                            onClick={() =>
                                                setShowRejectionInput(true)
                                            }
                                        >
                                            Tolak Pesanan{" "}
                                            <XCircle className="ml-2 w-4 h-4" />
                                        </Button>
                                    </>
                                )}

                            {showRejectionInput && (
                                <div className="space-y-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                    <textarea
                                        className="w-full h-24 rounded-xl border-rose-100 text-xs p-3 focus:ring-rose-200 focus:border-rose-300 placeholder:text-rose-300"
                                        placeholder="Alasan penolakan..."
                                        value={rejectionReason}
                                        onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                        }
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 h-9 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase rounded-lg"
                                            onClick={handleReject}
                                        >
                                            Kirim
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-9 font-bold text-[10px] uppercase text-rose-400 rounded-lg"
                                            onClick={() =>
                                                setShowRejectionInput(false)
                                            }
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {order.order_status === "PROCESSING" && (
                                <Button
                                    className="w-full h-12 rounded-xl bg-[#00346C] hover:bg-[#002a58] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20"
                                    onClick={() =>
                                        handleUpdateStatus(
                                            isDelivery
                                                ? "SHIPPED"
                                                : "READY_FOR_PICKUP",
                                        )
                                    }
                                >
                                    {isDelivery
                                        ? "Kirim Pesanan"
                                        : "Tandai Siap Diambil"}{" "}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            )}

                            {[
                                "READY_FOR_PICKUP",
                                "SHIPPED",
                                "DELIVERED",
                            ].includes(order.order_status) && (
                                <Button
                                    className="w-full h-12 rounded-xl bg-slate-800 hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.2em]"
                                    onClick={() =>
                                        handleUpdateStatus("COMPLETED")
                                    }
                                >
                                    Selesaikan (Override){" "}
                                    <CheckCircle2 className="ml-2 w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
