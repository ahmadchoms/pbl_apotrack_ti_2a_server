import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    ClipboardList,
    User,
    Phone,
    Package,
    Camera,
    ScanLine,
} from "lucide-react";
import { DashboardApotekLayout } from "@/layouts/apotek-layout";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah, formatTime } from "@/lib/utils";
import { ordersData } from "@/data/orders";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Link } from "@inertiajs/react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const pendingOrders = ordersData.filter(
    (order) => order.order_status === "PENDING",
);
const processingOrders = ordersData.filter(
    (order) => order.order_status === "PROCESSING",
);

const STATUS_CONFIG = {
    COMPLETED: {
        label: "Completed",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    PENDING: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    PROCESSING: {
        label: "Processing",
        className: "bg-blue-50 text-blue-700 border-blue-200",
    },
};

const PAYMENT_STATUS_CONFIG = {
    PAID: { label: "PAID", className: "text-emerald-600" },
    UNPAID: { label: "UNPAID", className: "text-amber-600" },
};

function OrderCard({ order }) {
    const shortId = `#${order.id.substring(0, 8).toUpperCase()}`;
    const statusCfg =
        STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG.PROCESSING;
    const paymentCfg = PAYMENT_STATUS_CONFIG[order.payment_status] ?? {};
    const isDelivery = order.service_type === "DELIVERY";

    return (
        <AccordionItem
            value={order.id}
            className="border border-border/60 rounded-xl bg-card shadow-sm overflow-hidden px-0 data-[state=open]:border-border"
        >
            <AccordionTrigger className="hover:no-underline px-6 py-5 [&>svg]:hidden">
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex flex-col gap-1.5 text-left">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                            {shortId} · {order.user?.full_name}
                        </p>
                        <h3 className="text-[15px] font-semibold text-foreground">
                            Layanan {order.service_type}
                        </h3>
                        <div className="flex items-center gap-2.5 mt-0.5">
                            <Badge
                                variant="outline"
                                className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${statusCfg.className}`}
                            >
                                {statusCfg.label}
                            </Badge>
                            <span className="text-sm font-semibold text-foreground tabular-nums">
                                {formatRupiah(order.total_price)}
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col items-end gap-1.5 text-xs text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {formatTime(order.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CreditCard className="h-3 w-3" />
                            {order.payment_method?.replace("_", " ")}
                        </span>
                    </div>
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-0 pb-0">
                <Separator />
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/40">
                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                                Informasi Pembeli
                            </p>
                            <Card className="shadow-none border-border/50">
                                <CardContent className="p-3 space-y-2">
                                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                        <User className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
                                        <span className="leading-snug font-medium text-foreground">
                                            {order.user?.full_name}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
                                        <span className="leading-snug">
                                            {order.user?.phone}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                                Detail Pengiriman
                            </p>
                            <div className="flex items-start gap-2.5 bg-muted/40 border border-border/40 rounded-lg p-3 text-sm">
                                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                                <div>
                                    <p className="font-semibold text-primary text-xs mb-0.5">
                                        {isDelivery
                                            ? "Kirim ke Alamat"
                                            : "Ambil di Apotek (Pickup)"}
                                    </p>
                                    {isDelivery && order.address ? (
                                        <p className="text-muted-foreground leading-relaxed">
                                            <span className="font-medium text-foreground">
                                                {order.address.label}
                                            </span>
                                            {" — "}
                                            {order.address.address_detail}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            Pasien akan mengambil pesanan
                                            langsung ke gerai.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                                Daftar Pesanan
                            </p>
                            <Card className="shadow-none border-border/50 overflow-hidden">
                                <CardContent className="p-0">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center px-4 py-3 border-b border-border/40 last:border-b-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium text-foreground">
                                                    {item.medicine?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.quantity}{" "}
                                                    {item.medicine?.unit} ×{" "}
                                                    {formatRupiah(item.price)}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-foreground tabular-nums">
                                                {formatRupiah(item.subtotal)}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center px-4 py-3 bg-muted/40">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Total
                                        </p>
                                        <p className="text-base font-bold text-foreground tabular-nums">
                                            {formatRupiah(order.total_price)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                                    Aksi & Verifikasi
                                </p>
                                <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/40 border border-border/40 rounded-lg">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <ClipboardList className="h-3.5 w-3.5" />
                                        Status Bayar
                                    </span>
                                    <span
                                        className={`text-xs font-bold tracking-wide ${paymentCfg.className}`}
                                    >
                                        {paymentCfg.label}
                                    </span>
                                </div>

                                {order.verification_code ? (
                                    <Button
                                        className="w-full gap-2 text-sm"
                                        onClick={() =>
                                            console.log("Scan order:", order.id)
                                        }
                                    >
                                        <Camera className="h-4 w-4" />
                                        Buka Kamera Scanner
                                    </Button>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-1.5 py-5 text-center border border-dashed border-border/60 rounded-lg text-muted-foreground/60">
                                        <Package className="h-6 w-6" />
                                        <p className="text-xs font-medium">
                                            Layanan Delivery
                                        </p>
                                        <p className="text-[11px]">
                                            Verifikasi QR tidak diperlukan
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Separator className="opacity-50" />

                            <div>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                                    Catatan
                                </p>
                                <p className="text-sm text-muted-foreground bg-amber-50/60 border border-amber-100/80 rounded-lg px-3.5 py-3 italic leading-relaxed">
                                    &ldquo;{order.notes || "Tidak ada catatan."}
                                    &rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

export default function OrderManagementPage() {
    const [selectedPendingOrder, setSelectedPendingOrder] = useState(
        pendingOrders.length > 0 ? pendingOrders[0] : null,
    );

    return (
        <DashboardApotekLayout activeMenu="Daftar Pesanan">
            <div className="max-w-350 mx-auto h-full flex flex-col">
                <div className="mb-6 flex justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Manajemen Pesanan
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Tinjau dan verifikasi pesanan yang masuk ke apotek
                            Anda.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <InputGroup className="min-w-sm py-6 rounded-xl">
                            <InputGroupInput placeholder="Search..." />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                        <Link
                            href="/apotek/orders/new"
                            className="flex justify-center w-full items-center gap-2 bg-linear-to-r from-[#00346C] to-[#004B95] text-white px-5 rounded-xl font-bold text-xs shadow-md"
                        >
                            <PlusCircle className="size-5" />
                            Tambah Order
                        </Link>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
                    <div className="lg:col-span-2 flex flex-col min-h-0">
                        <ScrollArea className="flex-1 pr-4 -mr-4">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4 pb-8"
                            >
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full space-y-3"
                                >
                                    {processingOrders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                        />
                                    ))}
                                </Accordion>
                            </motion.div>
                        </ScrollArea>
                    </div>

                    <div className="lg:col-span-1 flex flex-col h-full">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="px-8 pt-8 pb-4 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div className="relative">
                                    <h3 className="text-base font-bold text-[#0b3b60] pb-2">
                                        Menunggu Persetujuan
                                    </h3>
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0b3b60]"></div>
                                </div>
                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 text-xs font-bold px-3 py-1">
                                    11 Request
                                </Badge>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b3b60]">
                                                <ShoppingBag className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-800">
                                                    {selectedPendingOrder.user
                                                        ?.full_name ||
                                                        "Nama Pelanggan"}
                                                </h4>
                                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider line-clamp-1">
                                                    {selectedPendingOrder.id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6 grid grid-cols-2 gap-y-6 gap-x-4 border border-slate-100">
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                                Catatan
                                            </p>
                                            <p className="text-sm font-medium text-slate-700 bg-white p-3 rounded-lg border border-slate-100">
                                                {selectedPendingOrder.notes ||
                                                    "Tidak ada catatan."}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                                Tanggal
                                            </p>
                                            <p className="text-sm font-bold text-slate-700">
                                                {selectedPendingOrder.created_at
                                                    ? new Date(
                                                          selectedPendingOrder.created_at,
                                                      ).toLocaleDateString(
                                                          "id-ID",
                                                          {
                                                              weekday: "long",
                                                              day: "numeric",
                                                              month: "short",
                                                              year: "numeric",
                                                          },
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                                Waktu Pesan
                                            </p>
                                            <p className="text-sm font-bold text-slate-700">
                                                {selectedPendingOrder.created_at
                                                    ? new Date(
                                                          selectedPendingOrder.created_at,
                                                      ).toLocaleTimeString(
                                                          "id-ID",
                                                          {
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          },
                                                      )
                                                    : "-"}{" "}
                                                WIB
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                                Total Tagihan
                                            </p>
                                            <p className="text-sm font-bold text-[#0b3b60]">
                                                Rp{" "}
                                                {Number(
                                                    selectedPendingOrder.total_price ||
                                                        0,
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                                Metode Pembayaran
                                            </p>
                                            <p className="text-sm font-bold text-[#0b3b60]">
                                                {selectedPendingOrder.payment_method?.replace(
                                                    "_",
                                                    " ",
                                                ) || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                                Status Pembayaran
                                            </p>
                                            <p
                                                className={`text-sm font-bold ${selectedPendingOrder.payment_status === "PAID" ? "text-green-600" : "text-amber-500"}`}
                                            >
                                                {selectedPendingOrder.payment_status ===
                                                "PAID"
                                                    ? "Lunas"
                                                    : "Belum Lunas"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                                Tipe Layanan
                                            </p>
                                            <p className="text-sm font-bold text-[#0b3b60]">
                                                {
                                                    selectedPendingOrder.service_type
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-between bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 h-14 rounded-xl px-6"
                                    >
                                        <div className="flex items-center gap-3 font-semibold">
                                            <ReceiptText className="h-5 w-5 text-slate-500" />
                                            Lihat Bukti Resep Dokter
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-slate-400" />
                                    </Button>

                                    <div className="space-y-3 pt-2">
                                        {selectedPendingOrder.order_status ===
                                        "PENDING" ? (
                                            <>
                                                <Button className="w-full bg-[#00a651] hover:bg-[#008c44] text-white h-14 rounded-xl font-bold text-sm shadow-md shadow-[#00a651]/20">
                                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                                    Terima Pesanan (ACC)
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full bg-red-50/50 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-14 rounded-xl font-bold text-sm"
                                                >
                                                    <XCircle className="mr-2 h-5 w-5" />
                                                    Tolak Pesanan
                                                </Button>
                                            </>
                                        ) : selectedPendingOrder.order_status ===
                                          "PROCESSING" ? (
                                            <Button className="w-full bg-[#0b3b60] hover:bg-[#082a45] text-white h-14 rounded-xl font-bold text-sm shadow-md">
                                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                                Selesaikan Pesanan
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            </ScrollArea>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Verifikasi resep dan pembayaran dengan
                                    teliti sebelum menyetujui pesanan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardApotekLayout>
    );
}
