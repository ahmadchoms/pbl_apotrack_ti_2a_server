import React from "react";
import { motion } from "framer-motion";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { formatRupiah, formatTime } from "@/lib/utils";
import { STATUS_CONFIG } from "@/features/pharmacy/lib/constants";
import { router } from "@inertiajs/react";
import { ChevronRight, Filter, Search, Package } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

const STATUSES = [
    { label: "Semua", value: "ALL" },
    { label: "Menunggu", value: "PENDING" },
    { label: "Diproses", value: "PROCESSING" },
    { label: "Dikirim", value: "SHIPPED" },
    { label: "Selesai", value: "COMPLETED" },
    { label: "Dibatalkan", value: "CANCELLED" },
];

export default function OrdersList({ orders, currentStatus }) {
    const ordersData = orders?.data || [];

    const handleStatusChange = (status) => {
        router.get("/pharmacy/orders/list", { status }, { 
            preserveState: true,
            replace: true 
        });
    };

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Pesanan">
            <div className="max-w-350 mx-auto space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black text-[#00346C] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            <span className="w-8 h-px bg-[#00346C]/30" />
                            Arsip Transaksi
                        </p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Riwayat Pesanan
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <InputGroup className="rounded-2xl min-w-64 bg-white shadow-sm border-slate-200">
                            <InputGroupInput placeholder="Cari nomor order..." className="h-10 text-sm border-0 focus:ring-0" />
                            <InputGroupAddon className="pr-4">
                                <Search className="w-4 h-4 text-slate-400" />
                            </InputGroupAddon>
                        </InputGroup>
                        <Badge variant="outline" className="h-10 px-4 rounded-2xl bg-white text-slate-500 border-slate-200 font-bold text-[10px] uppercase tracking-widest gap-2">
                            <Filter className="w-3 h-3" /> Filter
                        </Badge>
                    </div>
                </div>

                <Tabs defaultValue={currentStatus} onValueChange={handleStatusChange} className="w-full">
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
                                        <TableHead className="py-5 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Order</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasien</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layanan</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pembayaran</TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</TableHead>
                                        <TableHead className="pr-8"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ordersData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Package className="w-10 h-10 mb-3 opacity-20" />
                                                    <p className="text-sm font-bold">Tidak ada data pesanan</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        ordersData.map((order) => {
                                            const status = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.PENDING;
                                            return (
                                                <TableRow key={order.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                                                    <TableCell className="py-5 pl-8">
                                                        <span className="text-xs font-bold text-[#00346C] font-mono tracking-tight">
                                                            {order.order_number}
                                                        </span>
                                                        <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                                                            {formatTime(order.created_at)}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                                                {order.buyer?.username?.substring(0, 2)}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-700">
                                                                {order.buyer?.username || "Guest"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                                                            {order.service_type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${status.badge}`}>
                                                            <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                                                            {status.label}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${order.payment_status === 'PAID' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                                {order.payment_status === 'PAID' ? 'Lunas' : 'Belum Lunas'}
                                                            </span>
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                                {order.payment_method?.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="text-sm font-black text-slate-900 tabular-nums">
                                                            {formatRupiah(order.grand_total)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-8 text-right">
                                                        <button 
                                                            onClick={() => router.get('/pharmacy/orders', { id: order.id })}
                                                            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#00346C] text-slate-400 hover:text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-sm"
                                                        >
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
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
