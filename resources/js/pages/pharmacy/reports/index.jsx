import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Package } from "lucide-react";
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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function ReportsPage({ reportData, filters }) {
    const handleFilterChange = (newFilters) => {
        router.get(route("pharmacy.reports.index"), { ...filters, ...newFilters }, { preserveState: true });
    };

    const handleReset = () => {
        router.get(route("pharmacy.reports.index"));
    };

    const handleExport = () => {
        const exportRoute = filters.type === 'stock' 
            ? 'pharmacy.reports.stock.export' 
            : 'pharmacy.reports.sales.export';
        
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
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                Analytics & Reporting
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            Laporan {filters.type === 'stock' ? 'Mutasi Stok' : 'Penjualan'}
                        </h2>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wide">
                            Pantau performa bisnis dan pergerakan inventaris Anda
                        </p>
                    </div>

                    <Button
                        onClick={handleExport}
                        className="h-12 px-8 rounded-2xl bg-[#0b3b60] hover:bg-[#082a45] text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
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
                    <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                                {filters.type === 'stock' ? <Package className="w-5 h-5 text-indigo-500" /> : <TrendingUp className="w-5 h-5 text-emerald-500" />}
                                Data Detail Laporan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        {filters.type === 'stock' ? (
                                            <>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Obat</TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe</TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah</TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Sisa Stok</TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Pesanan</TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode</TableHead>
                                                <TableHead className="h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.length > 0 ? (
                                        reportData.map((row, idx) => (
                                            <TableRow key={idx} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                                                {filters.type === 'stock' ? (
                                                    <>
                                                        <TableCell className="px-8 py-5 text-xs font-bold text-slate-500">{row.date}</TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-slate-700">{row.medicine_name}</TableCell>
                                                        <TableCell className="px-8 py-5">
                                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${row.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                                {row.type}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-bold text-slate-600">{row.quantity}</TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-slate-800 text-right">{row.remaining_stock}</TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-indigo-600">#{row.order_id.substring(0, 8)}</TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-bold text-slate-500">{row.date}</TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-slate-700">{row.customer_name}</TableCell>
                                                        <TableCell className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase">{row.payment_method}</TableCell>
                                                        <TableCell className="px-8 py-5 text-xs font-black text-slate-800 text-right">Rp {row.total.toLocaleString()}</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-bold italic">
                                                Tidak ada data untuk periode ini.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardPharmacyLayout>
    );
}
