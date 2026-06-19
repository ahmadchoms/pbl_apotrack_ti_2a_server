import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { PlusCircle } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { FilterBar } from "@/components/shared/FilterBar";
import { OrderDetailModal } from "@/features/pharmacy/components/orders/OrderDetailModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Package } from "lucide-react";
import { formatTime, formatRupiah } from "@/lib/utils";
import { STATUS_CONFIG } from "@/features/pharmacy/lib/constants";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { Pagination } from "@/components/ui/pagination";

const STATUSES = [
    { label: "Semua", value: "ALL" },
    { label: "Menunggu", value: "PENDING" },
    { label: "Diproses", value: "PROCESSING" },
    { label: "Dikirim", value: "SHIPPED" },
    { label: "Pengajuan Batal", value: "CANCEL_REQUESTED" },
    { label: "Selesai", value: "COMPLETED" },
    { label: "Dibatalkan", value: "CANCELLED" },
];

export default function PharmacistOrderManagement({
    orders: paginatedOrders,
    filters: initialFilters,
}) {
    const orders = paginatedOrders?.data || [];

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Pesanan">
            <div className="pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2"
                >
                    <PageHeader
                        title="Manajemen Pesanan Apotek"
                        description="Validasi resep, kelola status pengiriman, dan pantau seluruh transaksi obat apotek Anda."
                    />

                    <Link
                        href={route("pharmacy.orders.pos")}
                        className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/80 text-white font-semibold text-xs tracking-wide px-5 h-11 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-600/10 transition-all duration-200 group shrink-0 active:scale-[0.98]"
                    >
                        <PlusCircle className="w-4 h-4 text-white/90 group-hover:rotate-90 transition-transform duration-300 stroke-[2.2]" />
                        <span>Buat Pesanan Manual</span>
                    </Link>
                </motion.div>

                <FilterBar
                    configs={[
                        {
                            type: "search",
                            key: "search",
                            placeholder:
                                "Cari No. Pesanan atau Nama Pelanggan...",
                        },
                        {
                            type: "select",
                            key: "status",
                            label: "Status Pesanan",
                            options: STATUSES.filter(
                                (s) => s.value !== "ALL",
                            ).map((s) => ({ value: s.value, label: s.label })),
                        },
                    ]}
                    currentFilters={initialFilters || {}}
                    onFilterChange={(updates) => {
                        router.get(
                            route("pharmacy.orders.index"),
                            { ...initialFilters, ...updates, page: 1 },
                            {
                                preserveState: true,
                                replace: true,
                            },
                        );
                    }}
                    onReset={() =>
                        router.get(
                            route("pharmacy.orders.index"),
                            {},
                            { replace: true },
                        )
                    }
                />

                <Card className="pt-0 rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
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
                                            STATUS_CONFIG[order.order_status] ||
                                            STATUS_CONFIG.PENDING;
                                        return (
                                            <TableRow
                                                key={order.id}
                                                className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                                            >
                                                <TableCell className="py-5 pl-8">
                                                    <span className="text-xs font-bold text-primary font-mono tracking-tight">
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
                                                        className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-primary text-slate-400 hover:text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-sm"
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

                <div className="mt-6 flex justify-center">
                    <Pagination
                        links={
                            paginatedOrders?.meta?.links ||
                            paginatedOrders?.links
                        }
                    />
                </div>
            </div>
        </DashboardPharmacyLayout>
    );
}
