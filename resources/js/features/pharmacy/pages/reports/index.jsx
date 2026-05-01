import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import {
    FileText,
    Download,
    Search,
    Calendar,
    TrendingUp,
    ArrowLeftRight,
    Filter,
    FileSpreadsheet,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";

export default function ReportsPage({ reportData, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");
    const [activeTab, setActiveTab] = useState(filters.type || "sales");

    const handleFilter = () => {
        router.get(
            route("pharmacy.reports.index"),
            {
                type: activeTab,
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleTabChange = (val) => {
        setActiveTab(val);
        router.get(
            route("pharmacy.reports.index"),
            {
                type: val,
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleExport = () => {
        const baseUrl =
            activeTab === "sales"
                ? route("pharmacy.reports.sales.export")
                : route("pharmacy.reports.stock.export");

        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
        }).toString();

        window.location.href = `${baseUrl}?${params}`;
    };

    return (
        <DashboardPharmacyLayout activeMenu="Laporan">
            <div className="pb-20 px-4">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                            Financial & Inventory Insights
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        Laporan &{" "}
                        <span className="text-indigo-600">Keuangan</span>
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium max-w-2xl">
                        Pantau performa penjualan dan mutasi stok apotek Anda.
                        Ekstrak data mentah untuk kebutuhan pembukuan atau audit
                        inventori.
                    </p>
                </div>

                <Tabs
                    defaultValue={activeTab}
                    onValueChange={handleTabChange}
                    className="space-y-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <TabsList className="bg-white p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-sm h-14">
                            <TabsTrigger
                                value="sales"
                                className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />{" "}
                                Penjualan
                            </TabsTrigger>
                            <TabsTrigger
                                value="stock"
                                className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                            >
                                <ArrowLeftRight className="w-4 h-4 mr-2" />{" "}
                                Mutasi Stok
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-[1.5rem] border border-slate-200/60 shadow-sm">
                            <div className="flex items-center gap-2 px-3">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="bg-transparent border-0 text-xs font-bold text-slate-600 focus:ring-0 p-0"
                                />
                            </div>
                            <div className="w-px h-4 bg-slate-200 mx-1" />
                            <div className="flex items-center gap-2 px-3">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent border-0 text-xs font-bold text-slate-600 focus:ring-0 p-0"
                                />
                            </div>
                            <Button
                                onClick={handleFilter}
                                className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                <Filter className="w-3.5 h-3.5 mr-2" /> Terapkan
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="sales" className="mt-0 outline-none">
                        <SalesReportTable
                            data={reportData}
                            onExport={handleExport}
                        />
                    </TabsContent>

                    <TabsContent value="stock" className="mt-0 outline-none">
                        <StockReportTable
                            data={reportData}
                            onExport={handleExport}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardPharmacyLayout>
    );
}

function SalesReportTable({ data, onExport }) {
    return (
        <Card className="rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                            Preview Penjualan
                        </CardTitle>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            Menampilkan {data.data.length} transaksi terakhir
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onExport}
                    className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                >
                    <Download className="w-4 h-4 mr-2" /> Ekspor CSV
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="py-5 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                No. Order
                            </TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Tanggal
                            </TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Pelanggan
                            </TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Metode
                            </TableHead>
                            <TableHead className="text-right pr-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Total
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-64 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <FileSpreadsheet className="w-10 h-10 opacity-20" />
                                        <p className="text-sm font-bold uppercase tracking-widest">
                                            Tidak ada data
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.data.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="hover:bg-slate-50/50 transition-colors border-slate-100"
                                >
                                    <TableCell className="py-5 pl-8">
                                        <span className="text-xs font-black text-primary font-mono">
                                            {order.order_number}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-bold text-slate-600">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString("id-ID")}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-bold text-slate-600">
                                            {order.user?.username}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {order.payment_method?.replace(
                                                "_",
                                                " ",
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <span className="text-sm font-black text-slate-900">
                                            {formatRupiah(order.grand_total)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function StockReportTable({ data, onExport }) {
    return (
        <Card className="rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <ArrowLeftRight className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                            Preview Mutasi
                        </CardTitle>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            Menampilkan {data.data.length} pergerakan terakhir
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onExport}
                    className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                >
                    <Download className="w-4 h-4 mr-2" /> Ekspor CSV
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="py-5 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Tanggal
                            </TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Obat
                            </TableHead>
                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Tipe
                            </TableHead>
                            <TableHead className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Qty
                            </TableHead>
                            <TableHead className="pr-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Catatan
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-64 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <FileSpreadsheet className="w-10 h-10 opacity-20" />
                                        <p className="text-sm font-bold uppercase tracking-widest">
                                            Tidak ada data
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.data.map((movement) => (
                                <TableRow
                                    key={movement.id}
                                    className="hover:bg-slate-50/50 transition-colors border-slate-100"
                                >
                                    <TableCell className="py-5 pl-8">
                                        <span className="text-xs font-bold text-slate-600">
                                            {new Date(
                                                movement.created_at,
                                            ).toLocaleDateString("id-ID")}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-800">
                                                {movement.medicine?.name}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">
                                                Batch:{" "}
                                                {movement.batch?.batch_number}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                                                movement.type === "IN"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : movement.type === "OUT"
                                                      ? "bg-rose-50 text-rose-600 border-rose-100"
                                                      : "bg-slate-50 text-slate-600 border-slate-100"
                                            }`}
                                        >
                                            {movement.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            className={`text-xs font-black ${movement.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}
                                        >
                                            {movement.type === "IN" ? "+" : "-"}
                                            {movement.quantity}
                                        </span>
                                    </TableCell>
                                    <TableCell className="pr-8">
                                        <span className="text-[10px] font-medium text-slate-500 line-clamp-1">
                                            {movement.note || "-"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
