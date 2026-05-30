import React from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    History,
    PackageSearch,
    XCircle,
    ShieldAlert,
    ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { STATUS_CONFIG } from "../../lib/constants";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const listItemVariants = {
    hidden: { opacity: 0, y: 10 },
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

    const avatarGradients = [
        "from-blue-500 to-indigo-500",
        "from-purple-500 to-pink-500",
        "from-emerald-500 to-teal-500",
        "from-amber-500 to-orange-500",
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-5">
                <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white h-full flex flex-col">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold text-slate-800">
                                    Peringatan Inventori
                                </CardTitle>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Daftar obat kritis butuh restock segera
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route("pharmacy.medicines.index")}
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            Kelola Stok
                        </Link>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 flex-1 flex flex-col justify-between">
                        <div className="max-h-96 overflow-y-auto pr-2 space-y-4 no-scrollbar flex-1">
                            {stockAlerts.length > 0 ? (
                                stockAlerts.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={listItemVariants}
                                        className="flex items-center justify-between p-4.5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-[0_12px_24px_rgba(15,23,42,0.04)] hover:border-slate-200/80 hover:-translate-y-0.5 transition-all duration-300 relative group overflow-hidden"
                                    >
                                        <div
                                            className={`absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none bg-gradient-to-r ${
                                                item.status === "Critical"
                                                    ? "from-rose-500 to-transparent"
                                                    : "from-amber-500 to-transparent"
                                            }`}
                                        />

                                        <div className="flex items-center gap-4 relative z-10">
                                            <div
                                                className={`p-3 rounded-xl border transition-all duration-300 relative ${
                                                    item.status === "Critical"
                                                        ? "bg-rose-50/40 border-rose-100 text-rose-500 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500"
                                                        : "bg-amber-50/40 border-amber-100 text-amber-500 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500"
                                                }`}
                                            >
                                                <PackageSearch className="h-4.5 w-4.5 stroke-[2.2]" />

                                                <span
                                                    className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white ${
                                                        item.status ===
                                                        "Critical"
                                                            ? "bg-rose-500 animate-pulse"
                                                            : "bg-amber-500"
                                                    }`}
                                                />
                                            </div>

                                            <div className="space-y-0.5">
                                                <h4 className="text-sm font-semibold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">
                                                    {item.medicine_name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold tracking-wider text-slate-400 font-mono bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md uppercase">
                                                        ID: {item.batch_number}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right relative z-10 space-y-1">
                                            <div
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase transition-all duration-300 ${
                                                    item.status === "Critical"
                                                        ? "bg-rose-50/60 border-rose-100 text-rose-600 group-hover:bg-rose-100"
                                                        : "bg-amber-50/60 border-amber-100 text-amber-600 group-hover:bg-amber-100"
                                                }`}
                                            >
                                                {item.status === "Critical" ? (
                                                    <XCircle className="h-3 w-3" />
                                                ) : (
                                                    <AlertTriangle className="h-3 w-3" />
                                                )}
                                                {item.status}
                                            </div>

                                            <p className="text-xs font-medium text-slate-400">
                                                Sisa{" "}
                                                <span
                                                    className={`text-sm font-bold font-mono ${
                                                        item.status ===
                                                        "Critical"
                                                            ? "text-rose-600"
                                                            : "text-amber-600"
                                                    }`}
                                                >
                                                    {item.stock}
                                                </span>{" "}
                                                Unit
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-350">
                                    <PackageSearch className="w-12 h-12 mb-2 opacity-30" />
                                    <p className="text-xs font-semibold italic text-slate-400">
                                        Seluruh stok terpantau aman dan prima.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-7">
                <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white h-full flex flex-col">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                <History className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold text-slate-800">
                                    Transaksi Terkini
                                </CardTitle>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Aktivitas riwayat penjualan teranyar
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route("pharmacy.orders.index")}
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            Selengkapnya
                        </Link>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 flex-1 flex flex-col justify-between">
                        <div className="max-h-96 overflow-y-auto pr-2 space-y-4 no-scrollbar flex-1">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order, idx) => {
                                    const status = getStatusConfig(
                                        order.status,
                                    );
                                    const gradient =
                                        avatarGradients[
                                            idx % avatarGradients.length
                                        ];
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200/60 hover:bg-white hover:shadow-sm transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm`}
                                                >
                                                    {order.customer.substring(
                                                        0,
                                                        2,
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">
                                                        {order.customer}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                                                        <span>
                                                            {order.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5">
                                                <p className="text-sm font-bold text-slate-800">
                                                    Rp{" "}
                                                    {order.amount.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                </p>
                                                <div
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${status.badge}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                                    />
                                                    <span>{status.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-350">
                                    <ShoppingBag className="w-12 h-12 mb-2 opacity-30" />
                                    <p className="text-xs font-semibold italic text-slate-400">
                                        Belum ada pesanan masuk hari ini.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
