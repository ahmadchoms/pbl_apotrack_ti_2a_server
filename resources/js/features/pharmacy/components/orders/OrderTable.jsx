import React from "react";
import { motion } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, User, Package, ChevronRight, Eye } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const STATUS_MAP = {
    PENDING: {
        label: "Menunggu",
        color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    PROCESSING: {
        label: "Diproses",
        color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    READY_FOR_PICKUP: {
        label: "Siap Diambil",
        color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    SHIPPED: {
        label: "Dikirim",
        color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    DELIVERED: {
        label: "Sampai",
        color: "bg-teal-100 text-teal-700 border-teal-200",
    },
    COMPLETED: {
        label: "Selesai",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    CANCELLED: {
        label: "Dibatalkan",
        color: "bg-rose-100 text-rose-700 border-rose-200",
    },
};

export function OrderTable({ orders, onSelect }) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-xl shadow-slate-200/40 overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[180px] h-14 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            ID Pesanan
                        </TableHead>
                        <TableHead className="h-14 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Pelanggan
                        </TableHead>
                        <TableHead className="h-14 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Waktu & Tipe
                        </TableHead>
                        <TableHead className="h-14 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                            Total Harga
                        </TableHead>
                        <TableHead className="h-14 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                            Status
                        </TableHead>
                        <TableHead className="h-14 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                            Resep
                        </TableHead>
                        <TableHead className="w-[80px] h-14 px-8" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-64 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <Package className="w-12 h-12 text-slate-200 mb-4" />
                                    <p className="text-sm font-bold">
                                        Tidak ada pesanan ditemukan
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order, idx) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group hover:bg-slate-50/50 border-slate-50 cursor-pointer transition-colors"
                                onClick={() => onSelect(order)}
                            >
                                <TableCell className="px-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-slate-900 font-mono tracking-tighter uppercase">
                                            {order.order_number}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {order.id.substring(0, 8)}...
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                            <User className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">
                                                {order.buyer?.username ||
                                                    "Guest"}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium truncate">
                                                {order.buyer?.phone ||
                                                    "No Phone"}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                {order.created_at}
                                            </span>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-[8px] font-black uppercase tracking-[0.15em] border-slate-200 text-slate-500"
                                        >
                                            {order.service_type}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 text-right">
                                    <p className="text-sm font-black text-primary">
                                        {formatRupiah(order.grand_total)}
                                    </p>
                                </TableCell>
                                <TableCell className="px-4 text-center">
                                    <Badge
                                        className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${STATUS_MAP[order.order_status]?.color || "bg-slate-100"}`}
                                    >
                                        {STATUS_MAP[order.order_status]
                                            ?.label || order.order_status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 text-center">
                                    {order.requires_prescription ? (
                                        <div className="flex items-center justify-center">
                                            <div
                                                className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm"
                                                title="Membutuhkan Resep"
                                            >
                                                <Pill className="w-4 h-4" />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                            Tidak Ada
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-primary flex items-center justify-center text-slate-400 group-hover:text-white transition-all ml-auto">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                </TableCell>
                            </motion.tr>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
