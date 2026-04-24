import React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    ShoppingBag,
    Truck,
    ReceiptText,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Pill,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import {
    STATUS_CONFIG,
    detailVariants,
} from "@/features/pharmacy/lib/constants";

function SectionLabel({ children }) {
    return (
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
            <span className="inline-block w-3 h-px bg-slate-300" />
            {children}
        </p>
    );
}

export function OrderDetailPanel({ order }) {
    const statusCfg =
        STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG.PENDING;
    const isDelivery = order.service_type === "DELIVERY";
    const isPending = order.order_status === "PENDING";
    const isProcessing = order.order_status === "PROCESSING";
    const isReady = order.order_status === "READY_FOR_PICKUP";
    const isShipped = order.order_status === "SHIPPED";
    const isDelivered = order.order_status === "DELIVERED";

    return (
        <motion.div
            key={order.id}
            variants={detailVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col h-full"
        >
            <div className="p-6 space-y-6 flex-1">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#00346C] to-[#0055a5] flex items-center justify-center shadow-lg shadow-[#00346C]/20">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-base font-black text-slate-900 leading-tight">
                            {order.buyer?.username}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 font-mono">
                            {order.order_number}
                        </p>
                        <div className="mt-1.5">
                            <span
                                className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusCfg.badge}`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                                />
                                {statusCfg.label}
                            </span>
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="space-y-3">
                    <SectionLabel>Ringkasan Pesanan</SectionLabel>
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                        {[
                            {
                                label: "Tanggal",
                                value: order.created_at
                                    ? new Date(
                                          order.created_at,
                                      ).toLocaleDateString("id-ID", {
                                          weekday: "long",
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                      })
                                    : "—",
                            },
                            {
                                label: "Pukul",
                                value: order.created_at
                                    ? new Date(
                                          order.created_at,
                                      ).toLocaleTimeString("id-ID", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      }) + " WIB"
                                    : "—",
                            },
                            {
                                label: "Layanan",
                                value: isDelivery ? "Delivery" : "Pickup",
                            },
                            {
                                label: "Metode Bayar",
                                value:
                                    order.payment_method?.replace("_", " ") ||
                                    "—",
                            },
                            {
                                label: "Status Bayar",
                                value:
                                    order.payment_status === "PAID"
                                        ? "Lunas"
                                        : "Belum Lunas",
                                colored:
                                    order.payment_status === "PAID"
                                        ? "text-emerald-600"
                                        : "text-amber-500",
                            },
                        ].map(({ label, value, colored }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between px-4 py-2.5"
                            >
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                    {label}
                                </span>
                                <span
                                    className={`text-xs font-bold ${colored ?? "text-slate-700"}`}
                                >
                                    {value}
                                </span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#00346C]/5">
                            <span className="text-[10px] font-black text-[#00346C]/60 uppercase tracking-widest">
                                Total Tagihan
                            </span>
                            <span className="text-sm font-black text-[#00346C]">
                                {formatRupiah(order.grand_total)}
                            </span>
                        </div>
                    </div>
                </div>

                {order.items?.length > 0 && (
                    <div className="space-y-3">
                        <SectionLabel>Obat yang Dipesan</SectionLabel>
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 px-3.5 py-3"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-[#00346C]/8 flex items-center justify-center shrink-0">
                                        <Pill className="w-4 h-4 text-[#00346C]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-800 truncate">
                                            {item.medicine_name}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {item.quantity} {item.unit_name}
                                        </p>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 tabular-nums">
                                        {formatRupiah(item.subtotal)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {order.tracking && (
                    <div className="space-y-3">
                        <SectionLabel>Info Pengiriman</SectionLabel>
                        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl px-4 py-3.5 space-y-2">
                            <div className="flex items-center gap-2.5">
                                <Truck className="w-4 h-4 text-indigo-500" />
                                <div>
                                    <p className="text-xs font-bold text-indigo-800">
                                        {order.tracking.courier_name}
                                    </p>
                                    <p className="text-[10px] text-indigo-500 font-mono font-semibold">
                                        {order.tracking.tracking_number}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {order.prescription && (
                    <div className="space-y-3">
                        <SectionLabel>Resep Dokter</SectionLabel>
                        <div className="bg-violet-50/60 border border-violet-100 rounded-2xl px-4 py-3.5 space-y-3">
                            <div className="space-y-1.5">
                                {[
                                    {
                                        label: "Dokter",
                                        value: order.prescription.doctor_name,
                                    },
                                    {
                                        label: "Pasien",
                                        value: order.prescription.patient_name,
                                    },
                                    {
                                        label: "Status",
                                        value:
                                            order.prescription.status ===
                                            "VERIFIED"
                                                ? "Terverifikasi ✓"
                                                : order.prescription.status,
                                        colored:
                                            order.prescription.status ===
                                            "VERIFIED"
                                                ? "text-emerald-600"
                                                : "text-amber-500",
                                    },
                                ].map(({ label, value, colored }) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
                                            {label}
                                        </span>
                                        <span
                                            className={`text-xs font-bold ${colored ?? "text-violet-800"}`}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-violet-200 text-violet-600 hover:bg-violet-100 hover:text-violet-700 bg-white text-xs font-bold h-9 rounded-xl"
                                onClick={() =>
                                    window.open(
                                        order.prescription.image_url,
                                        "_blank",
                                    )
                                }
                            >
                                <ReceiptText className="w-3.5 h-3.5 mr-2" />
                                Lihat Foto Resep
                                <ExternalLink className="w-3 h-3 ml-auto text-violet-400" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {(isPending ||
                isProcessing ||
                isShipped ||
                isReady ||
                isDelivered) && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-2.5">
                    {isPending && (
                        <>
                            <Button className="w-full flex bg-emerald-500 hover:bg-emerald-600 text-white h-11 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all">
                                <CheckCircle2 className="h-4 w-4" />
                                Terima Pesanan
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 bg-white h-10 rounded-xl font-bold text-sm"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Tolak Pesanan
                            </Button>
                        </>
                    )}
                    {isProcessing && (
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-xl font-bold text-sm shadow-md shadow-[#00346C]/20">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Tandai Siap Diambil
                        </Button>
                    )}
                    {isReady && (
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-xl font-bold text-sm shadow-md shadow-[#00346C]/20">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {order.service_type === "DELIVERY"
                                ? "Tandai Sudah Dikirim"
                                : "Tandai Sudah Diambil"}
                        </Button>
                    )}
                    {isShipped && (
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-xl font-bold text-sm shadow-md shadow-[#00346C]/20">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Tandai Sudah Diterima
                        </Button>
                    )}
                    {isDelivered && (
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-xl font-bold text-sm shadow-md shadow-[#00346C]/20">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Selesaikan Pesanan
                        </Button>
                    )}
                </div>
            )}

            <div className="px-5 pb-5">
                <div className="flex items-start gap-2.5 bg-amber-50/70 border border-amber-100 rounded-xl px-4 py-3">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-600 font-semibold leading-relaxed">
                        Verifikasi resep dan pembayaran dengan teliti sebelum
                        menyetujui pesanan.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
