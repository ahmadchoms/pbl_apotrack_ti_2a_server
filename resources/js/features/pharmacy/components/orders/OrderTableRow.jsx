import React from "react";
import { ChevronRight, Package } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatTime } from "@/lib/utils";
import { STATUS_CONFIG } from "@/features/pharmacy/lib/constants";
import { router } from "@inertiajs/react";

export function OrderTableRow({ order }) {
    const status = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.PENDING;

    return (
        <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-100/50">
            <TableCell className="py-6 pl-10">
                <div className="flex flex-col">
                    <span className="text-xs font-black text-primary font-mono tracking-tight group-hover:underline cursor-pointer" onClick={() => router.get('/pharmacy/orders', { id: order.id })}>
                        {order.order_number}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                        {formatTime(order.created_at)}
                    </p>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase border border-white shadow-sm">
                        {order.buyer?.username?.substring(0, 2).toUpperCase() || "GS"}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700">
                            {order.buyer?.username || "Guest User"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {order.buyer?.email || "No Email"}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-500 border-slate-200 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl"
                >
                    {order.service_type}
                </Badge>
            </TableCell>
            <TableCell>
                <span
                    className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${status.badge}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                    {status.label}
                </span>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <span
                        className={`text-[10px] font-black uppercase tracking-widest ${order.payment_status === "PAID" ? "text-emerald-600" : "text-amber-500"}`}
                    >
                        {order.payment_status === "PAID" ? "TERBAYAR" : "MENUNGGU"}
                    </span>
                    <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">
                        {order.payment_method?.replace("_", " ") || "UNKNOWN"}
                    </span>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <span className="text-sm font-black text-slate-900 tabular-nums">
                    {formatRupiah(order.grand_total)}
                </span>
            </TableCell>
            <TableCell className="pr-10 text-right">
                <button
                    onClick={() => router.get("/pharmacy/orders", { id: order.id })}
                    className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-slate-100/50"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </TableCell>
        </TableRow>
    );
}
