import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { PlusCircle } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { OrderFilter } from "@/features/pharmacy/components/orders/OrderFilter";
import { OrderDetailModal } from "@/features/pharmacy/components/orders/OrderDetailModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Package } from "lucide-react";
import { formatTime, formatRupiah } from "@/lib/utils";
import { STATUS_CONFIG } from "@/features/pharmacy/lib/constants";

const STATUSES = [
    { label: "Semua", value: "ALL" },
    { label: "Menunggu", value: "PENDING" },
    { label: "Diproses", value: "PROCESSING" },
    { label: "Dikirim", value: "SHIPPED" },
    { label: "Selesai", value: "COMPLETED" },
    { label: "Dibatalkan", value: "CANCELLED" },
];

export default function PharmacistOrderManagement({
    orders: paginatedOrders,
    filters: initialFilters,
}) {
    const orders = paginatedOrders?.data || [];
    const [search, setSearch] = useState(initialFilters?.search || "");
    const [selectedStatuses, setSelectedStatuses] = useState(
        initialFilters?.status ? initialFilters.status.split(",") : [],
    );

    const handleStatusToggle = (statusId) => {
        setSelectedStatuses((prev) =>
            prev.includes(statusId)
                ? prev.filter((s) => s !== statusId)
                : [...prev, statusId],
        );
    };

    const handleStatusChange = (status) => {
        router.get(
            "/pharmacy/orders/list",
            { status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleClearFilters = () => {
        setSearch("");
        setSelectedStatuses([]);
    };

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Pesanan">
            <div className="pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 bg-blue-50 text-[#00346C] text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                Apothecary Hub
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Manajemen{" "}
                            <span className="text-[#00346C]">Pesanan</span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-xl">
                            Validasi resep, kelola status pengiriman, dan pantau
                            seluruh transaksi obat apotek Anda dalam satu
                            dashboard terintegrasi.
                        </p>
                    </div>

                    <Link
                        href={route("pharmacy.orders.pos")}
                        className="inline-flex items-center gap-3 bg-linear-to-r from-[#00346C] to-[#0055a5] text-white px-8 h-14 rounded-[1.25rem] font-bold text-sm shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Buat Pesanan Manual (POS)
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <OrderFilter
                        search={search}
                        onSearchChange={setSearch}
                        selectedStatuses={selectedStatuses}
                        onStatusChange={handleStatusToggle}
                        onClearFilters={handleClearFilters}
                    />
                </motion.div>

                <Tabs
                    defaultValue="ALL"
                    onValueChange={handleStatusChange}
                    className="w-full"
                >
                    <div className="bg-white p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-sm inline-flex mb-8">
                        <TabsList className="bg-transparent h-10 gap-1">
                            {STATUSES.map((s) => (
                                <TabsTrigger
                                    key={s.value}
                                    value={s.value}
                                    className="rounded-xl px-5 text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-[#00346C] data-[state=active]:text-white transition-all"
                                >
                                    {s.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <Card className="rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="py-5 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            No. Order
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Pasien
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Layanan
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Pembayaran
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="pr-8"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-64 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Package className="w-10 h-10 mb-3 opacity-20" />
                                                    <p className="text-sm font-bold">
                                                        Tidak ada data pesanan
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order) => {
                                            const status =
                                                STATUS_CONFIG[
                                                    order.order_status
                                                ] || STATUS_CONFIG.PENDING;
                                            return (
                                                <TableRow
                                                    key={order.id}
                                                    className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                                                >
                                                    <TableCell className="py-5 pl-8">
                                                        <span className="text-xs font-bold text-[#00346C] font-mono tracking-tight">
                                                            {order.order_number}
                                                        </span>
                                                        <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                                                            {formatTime(
                                                                order.created_at,
                                                            )}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                                                {order.buyer?.username?.substring(
                                                                    0,
                                                                    2,
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-700">
                                                                {order.buyer
                                                                    ?.username ||
                                                                    "Guest"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-slate-100 text-slate-500 border-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5"
                                                        >
                                                            {order.service_type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${status.badge}`}
                                                        >
                                                            <span
                                                                className={`w-1 h-1 rounded-full ${status.dot}`}
                                                            />
                                                            {status.label}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <span
                                                                className={`text-[10px] font-black uppercase tracking-widest ${order.payment_status === "PAID" ? "text-emerald-600" : "text-amber-500"}`}
                                                            >
                                                                {order.payment_status ===
                                                                "PAID"
                                                                    ? "Lunas"
                                                                    : "Belum Lunas"}
                                                            </span>
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                                {order.payment_method?.replace(
                                                                    "_",
                                                                    " ",
                                                                )}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="text-sm font-black text-slate-900 tabular-nums">
                                                            {formatRupiah(
                                                                order.grand_total,
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-8 text-right">
                                                        <Link
                                                            href={route(
                                                                "pharmacy.orders.show",
                                                                order.id,
                                                            )}
                                                            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#00346C] text-slate-400 hover:text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-sm"
                                                        >
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </DashboardPharmacyLayout>
    );
}
