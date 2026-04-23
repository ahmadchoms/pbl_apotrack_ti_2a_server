import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Clock,
    ExternalLink,
    CheckCircle2,
    XCircle,
    ShoppingBag,
    Search,
    PlusCircle,
    ReceiptText,
    CreditCard,
    MapPin,
    User,
    Package,
    Truck,
    Hash,
    ChevronDown,
    ChevronUp,
    FileText,
    AlertCircle,
    Pill,
    ScanLine,
    ArrowRight,
} from "lucide-react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { formatRupiah, formatTime } from "@/lib/utils";
import { orders } from "@/data/orders";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Link } from "@inertiajs/react";

const STATUS_CONFIG = {
    COMPLETED: {
        label: "Selesai",
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-300/30",
    },
    PENDING: {
        label: "Menunggu",
        dot: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-300/30",
    },
    PROCESSING: {
        label: "Diproses",
        dot: "bg-blue-500",
        badge: "bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-300/30",
    },
    SHIPPED: {
        label: "Dikirim",
        dot: "bg-indigo-500",
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200/80 ring-1 ring-indigo-300/30",
    },
    DELIVERED: {
        label: "Terkirim",
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-300/30",
    },
};

const SERVICE_ICON = {
    DELIVERY: Truck,
    PICKUP: Package,
};

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.07,
            duration: 0.38,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
};

const detailVariants = {
    hidden: { opacity: 0, x: 18 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
};

function SectionLabel({ children }) {
    return (
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
            <span className="inline-block w-3 h-px bg-slate-300" />
            {children}
        </p>
    );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mb-1">
                    {label}
                </p>
                <p
                    className={`text-sm font-semibold ${highlight ? "text-[#00346C]" : "text-slate-700"}`}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

function OrderCard({ order, index, isSelected, onSelect }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const statusCfg =
        STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG.PENDING;
    const ServiceIcon = SERVICE_ICON[order.service_type] ?? Package;
    const shortNum = order.order_number;
    const isDelivery = order.service_type === "DELIVERY";
    const hasPrescription = !!order.prescription;

    const handleSelect = () => {
        onSelect(order);
        setIsExpanded((prev) => !prev);
    };

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            layout
            className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group ${
                isSelected
                    ? "border-[#00346C]/30 shadow-lg shadow-[#00346C]/8 ring-1 ring-[#00346C]/15"
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md shadow-sm"
            } bg-white`}
            onClick={handleSelect}
        >
            <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                    ? "bg-[#00346C] text-white"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                            }`}
                        >
                            <ServiceIcon className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                    {shortNum}
                                </span>
                                {hasPrescription && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-violet-600 bg-violet-50 border border-violet-200/80 px-1.5 py-0.5 rounded-full">
                                        <FileText className="w-2.5 h-2.5" />
                                        Resep
                                    </span>
                                )}
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 mb-1">
                                {order.buyer?.username}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span
                                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusCfg.badge}`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}
                                    />
                                    {statusCfg.label}
                                </span>
                                <span className="text-xs text-slate-400">
                                    ·
                                </span>
                                <span className="text-xs font-semibold text-slate-500">
                                    {order.service_type === "DELIVERY"
                                        ? "Antar"
                                        : "Ambil"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <p className="text-sm font-black text-[#00346C] tabular-nums">
                            {formatRupiah(order.grand_total)}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTime(order.created_at)}
                        </div>
                        <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isExpanded ? "bg-[#00346C] text-white rotate-0" : "bg-slate-100 text-slate-400"}`}
                        >
                            {isExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                            ) : (
                                <ChevronDown className="w-3 h-3" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.28,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-slate-100 bg-slate-50/60">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100/80">
                                <div className="p-5 space-y-4">
                                    <SectionLabel>Pembeli</SectionLabel>
                                    <InfoRow
                                        icon={User}
                                        label="Nama"
                                        value={order.buyer?.username || "—"}
                                    />
                                    <InfoRow
                                        icon={CreditCard}
                                        label="Email"
                                        value={order.buyer?.email || "—"}
                                    />
                                    <InfoRow
                                        icon={isDelivery ? Truck : Package}
                                        label="Layanan"
                                        value={
                                            isDelivery
                                                ? "Delivery ke Alamat"
                                                : "Pickup di Apotek"
                                        }
                                        highlight
                                    />
                                </div>

                                <div className="p-5 space-y-4">
                                    <SectionLabel>Daftar Obat</SectionLabel>
                                    <div className="space-y-2">
                                        {order.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-start justify-between gap-2 bg-white rounded-xl border border-slate-100 px-3.5 py-3"
                                            >
                                                <div className="flex items-start gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-[#00346C]/8 flex items-center justify-center shrink-0 mt-0.5">
                                                        <Pill className="w-3.5 h-3.5 text-[#00346C]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-800 leading-snug">
                                                            {item.medicine_name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                                            {item.quantity}{" "}
                                                            {item.unit_name} ×{" "}
                                                            {formatRupiah(
                                                                item.price,
                                                            )}
                                                        </p>
                                                        {item.requires_prescription && (
                                                            <span className="text-[9px] font-bold text-violet-500 uppercase tracking-wide">
                                                                Perlu Resep
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 tabular-nums shrink-0">
                                                    {formatRupiah(
                                                        item.subtotal,
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center px-3.5 py-2.5 bg-[#00346C]/5 border border-[#00346C]/10 rounded-xl">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#00346C]/60">
                                            Total
                                        </span>
                                        <span className="text-sm font-black text-[#00346C]">
                                            {formatRupiah(order.grand_total)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    <SectionLabel>Aksi & Status</SectionLabel>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                Pembayaran
                                            </span>
                                            <span
                                                className={`text-xs font-black tracking-wide ${order.payment_status === "PAID" ? "text-emerald-600" : "text-amber-500"}`}
                                            >
                                                {order.payment_status === "PAID"
                                                    ? "Lunas"
                                                    : "Belum Lunas"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                Metode
                                            </span>
                                            <span className="text-xs font-bold text-slate-700">
                                                {order.payment_method?.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </span>
                                        </div>
                                        {order.tracking && (
                                            <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl">
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                    Kurir
                                                </span>
                                                <span className="text-xs font-bold text-slate-700">
                                                    {
                                                        order.tracking
                                                            .courier_name
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {order.tracking?.tracking_number && (
                                            <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl">
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                    No. Resi
                                                </span>
                                                <span className="text-xs font-bold text-slate-700 font-mono">
                                                    {
                                                        order.tracking
                                                            .tracking_number
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {order.notes && (
                                        <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3 italic leading-relaxed">
                                            "{order.notes}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function DetailPanel({ order }) {
    const statusCfg =
        STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG.PENDING;
    const isDelivery = order.service_type === "DELIVERY";
    const isPending = order.order_status === "PENDING";
    const isProcessingOrShipped =
        order.order_status === "PROCESSING" || order.order_status === "SHIPPED";

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

            {(isPending || isProcessingOrShipped) && (
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
                    {isProcessingOrShipped && (
                        <Button className="w-full bg-linear-to-r from-[#00346C] to-[#0055a5] hover:from-[#002a58] hover:to-[#00469a] text-white h-11 rounded-xl font-bold text-sm shadow-md shadow-[#00346C]/20">
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

export default function OrderManagementPage() {
    const [selectedOrder, setSelectedOrder] = useState(
        orders.length > 0 ? orders[0] : null,
    );
    const [search, setSearch] = useState("");

    const pendingCount = orders.filter(
        (o) => o.order_status === "PENDING",
    ).length;
    const filteredOrders = orders.filter(
        (o) =>
            !search ||
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.buyer?.username?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Pesanan">
            <div className="max-w-350 mx-auto h-full flex flex-col">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Manajemen Pesanan
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5 font-medium">
                            Tinjau dan kelola pesanan masuk dari pasien
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <InputGroup className="rounded-xl min-w-[200px]">
                            <InputGroupInput
                                placeholder="Cari pesanan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 text-sm"
                            />
                            <InputGroupAddon>
                                <Search className="w-4 h-4 text-slate-400" />
                            </InputGroupAddon>
                        </InputGroup>
                        <Link
                            href="/pharmacy/orders/create"
                            className="inline-flex items-center gap-2 bg-linear-to-r from-[#00346C] to-[#0055a5] text-white px-4 h-10 rounded-xl font-bold text-xs shadow-md shadow-[#00346C]/25 hover:from-[#002a58] hover:to-[#00469a] transition-all whitespace-nowrap"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Tambah Order
                        </Link>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                    <div className="lg:col-span-2 flex flex-col min-h-0">
                        <ScrollArea className="flex-1 pr-3 -mr-3">
                            <div className="space-y-3 pb-8">
                                {filteredOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                        <Package className="w-10 h-10 mb-3 opacity-40" />
                                        <p className="text-sm font-semibold">
                                            Tidak ada pesanan ditemukan
                                        </p>
                                    </div>
                                ) : (
                                    filteredOrders.map((order, index) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            index={index}
                                            isSelected={
                                                selectedOrder?.id === order.id
                                            }
                                            onSelect={setSelectedOrder}
                                        />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="lg:col-span-1 flex flex-col h-full">
                        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">
                                        Detail Pesanan
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                        Klik kartu untuk melihat detail
                                    </p>
                                </div>
                                {pendingCount > 0 && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 px-2.5 py-1.5 rounded-full"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-wide">
                                            {pendingCount} Baru
                                        </span>
                                    </motion.div>
                                )}
                            </div>

                            <ScrollArea className="flex-1">
                                <AnimatePresence mode="wait">
                                    {selectedOrder ? (
                                        <DetailPanel
                                            key={selectedOrder.id}
                                            order={selectedOrder}
                                        />
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center h-72 text-slate-400 p-8 text-center"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                                <ScanLine className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500">
                                                Pilih pesanan
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Klik kartu pesanan di kiri untuk
                                                melihat detail lengkapnya
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardPharmacyLayout>
    );
}
