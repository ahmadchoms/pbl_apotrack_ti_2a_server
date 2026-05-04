import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, History, PackageSearch, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { STATUS_CONFIG } from "../../lib/constants";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export const getStatusConfig = (status) => {
    return (
        STATUS_CONFIG[status] ?? {
            label: status,
            badge: "bg-slate-100 text-slate-600 border-slate-200",
            dot: "bg-slate-400",
        }
    );
};

export function DashboardTables({ widgets = {} }) {
    const stockAlerts = widgets.stock_alerts || [];
    const recentOrders = widgets.recent_orders || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">
                                        Peringatan Stok
                                    </CardTitle>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        Butuh Restock Segera
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route("pharmacy.medicines.index")}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0b3b60]"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                    </CardHeader>
                    {/* ... content ... */}
                    <CardContent className="p-10 pt-4">
                        <div className="max-h-105 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                            {stockAlerts.length > 0 ? (
                                stockAlerts.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-white text-slate-400">
                                                <PackageSearch className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-700">
                                                    {item.medicine_name}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    Batch: {item.batch_number}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`text-sm font-black ${item.status === "Critical" ? "text-rose-600" : "text-orange-600"}`}
                                            >
                                                {item.stock} Unit
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-0.5">
                                                {item.status}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-slate-400 font-bold italic">
                                    Semua stok terpantau aman.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                    <History className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">
                                        Pesanan Terbaru
                                    </CardTitle>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        Aktivitas Terkini
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route("pharmacy.orders.index")}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0b3b60]"
                            >
                                Riwayat Pesanan
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-4">
                        <div className="max-h-105 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order, idx) => {
                                    const status = getStatusConfig(
                                        order.status,
                                    );
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#0b3b60] to-[#1a6fad] flex items-center justify-center text-white text-[10px] font-black uppercase">
                                                    {order.customer.substring(
                                                        0,
                                                        2,
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-700">
                                                        {order.customer}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                        {order.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <p className="text-sm font-black text-slate-800">
                                                    Rp{" "}
                                                    {order.amount.toLocaleString()}
                                                </p>
                                                <div
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${status.badge}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                                    />
                                                    {status.label}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center py-10 text-slate-400 font-bold italic">
                                    Belum ada pesanan masuk.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
