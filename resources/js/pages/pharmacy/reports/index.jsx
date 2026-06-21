import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Package, DollarSign, ShoppingBag, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { router } from "@inertiajs/react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { FilterBar } from "@/components/shared/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function ReportsPage({ reportData, summary, filters }) {
    const handleFilterChange = (newFilters) => {
        router.get(
            route("pharmacy.reports.index"),
            { ...filters, ...newFilters },
            { preserveState: true },
        );
    };

    const handleReset = () => {
        router.get(route("pharmacy.reports.index"));
    };

    const handleExport = () => {
        const exportRoute =
            filters.type === "stock"
                ? "pharmacy.reports.stock.export"
                : "pharmacy.reports.sales.export";

        window.location.href = route(exportRoute, filters);
    };

    const filterConfigs = [
        {
            key: "type",
            type: "select",
            placeholder: "Tipe Laporan",
            options: [
                { label: "Laporan Penjualan", value: "sales" },
                { label: "Mutasi Stok", value: "stock" },
            ],
        },
        {
            key: "start_date",
            type: "date",
            placeholder: "Tanggal Mulai",
        },
        {
            key: "end_date",
            type: "date",
            placeholder: "Tanggal Akhir",
        },
    ];

    return (
        <DashboardPharmacyLayout activeMenu="Laporan">
            <div className="space-y-10 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <PageHeader
                        title={`Laporan 
                            ${
                                filters.type === "stock"
                                    ? "Mutasi Stok"
                                    : "Penjualan"
                            }`}
                        description="Pantau performa bisnis dan pergerakan inventaris
                            Anda."
                    />

                    <Button
                        onClick={handleExport}
                        className="h-12 px-8 rounded-2xl bg-primary hover:bg-[#082a45] text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filters.type === "stock" ? (
                        <>
                            <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            Total Barang Masuk
                                        </p>
                                        <h3 className="text-lg font-black text-slate-800 mt-1 truncate">
                                            {(summary?.total_in || 0).toLocaleString()} Unit
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                        <ArrowDownRight className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            Total Barang Keluar
                                        </p>
                                        <h3 className="text-lg font-black text-slate-800 mt-1 truncate">
                                            {(summary?.total_out || 0).toLocaleString()} Unit
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            Obat Stok Kritis
                                        </p>
                                        <h3 className="text-lg font-black text-slate-800 mt-1 truncate">
                                            {summary?.low_stock_count || 0} Item
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            Batch Hampir Expired
                                        </p>
                                        <h3 className="text-lg font-black text-slate-800 mt-1 truncate">
                                            {summary?.expiring_count || 0} Batch
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            Total Omset
                                        </p>
                                        <h3 className="text-lg font-black text-slate-800 mt-1 truncate">
                                            Rp {(summary?.total_revenue || 0).toLocaleString("id-ID")}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            Transaksi Selesai
                                        </p>
                                        <h3 className="text-lg font-black text-slate-800 mt-1 truncate">
                                            {summary?.total_transactions || 0} Transaksi
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            Total Item Terjual
                                        </p>
                                        <h3 className="text-lg font-black text-slate-800 mt-1 truncate">
                                            {(summary?.total_items_sold || 0).toLocaleString()} Pcs
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                            Pesanan dengan Resep
                                        </p>
                                        <h3 className="text-lg font-black text-slate-800 mt-1 truncate">
                                            {summary?.prescription_transactions || 0} Resep
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <FilterBar
                    configs={filterConfigs}
                    currentFilters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                                {filters.type === "stock" ? (
                                    <Package className="w-5 h-5 text-indigo-500" />
                                ) : (
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                )}
                                Data Detail Laporan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        {filters.type === "stock" ? (
                                            <>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Waktu
                                                </TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Obat
                                                </TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Tipe
                                                </TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Jumlah
                                                </TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                                    Sisa Stok
                                                </TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    ID Pesanan
                                                </TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Waktu
                                                </TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Pelanggan
                                                </TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Metode
                                                </TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                                    Total
                                                </TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.data && reportData.data.length > 0 ? (
                                        reportData.data.map((row, idx) => (
                                            <TableRow
                                                key={idx}
                                                className="hover:bg-slate-50/50 border-slate-50 transition-colors"
                                            >
                                                {filters.type === "stock" ? (
                                                    <>
                                                        <TableCell className="px-8 py-5 text-xs font-bold text-slate-500">
                                                            {row.date}
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-slate-700">
                                                            {row.medicine_name}
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5">
                                                            <span
                                                                className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${row.type === "IN" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                                                            >
                                                                {row.type}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-bold text-slate-600">
                                                            {row.quantity}
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-slate-800 text-right">
                                                            {
                                                                row.remaining_stock
                                                            }
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-indigo-600">
                                                            #
                                                            {row.order_id.substring(
                                                                0,
                                                                8,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-bold text-slate-500">
                                                            {row.date}
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-slate-700">
                                                            {row.customer_name}
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase">
                                                            {row.payment_method}
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-slate-800 text-right">
                                                            Rp{" "}
                                                            {row.total.toLocaleString()}
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-40 text-center text-slate-400 font-bold italic"
                                            >
                                                Tidak ada data untuk periode
                                                ini.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    {reportData.data && reportData.data.length > 0 && (
                        <AdminPagination
                            pagination={reportData}
                            itemLabel="data"
                        />
                    )}
                </motion.div>
            </div>
        </DashboardPharmacyLayout>
    );
}
