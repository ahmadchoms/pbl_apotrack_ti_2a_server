import React from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    ShoppingCart,
    Pill,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export function DashboardKpiCards({ kpi = {}, revenueTrend = [] }) {
    const sparklineData =
        revenueTrend.length >= 5
            ? revenueTrend.slice(-7).map((item) => ({ value: item.revenue }))
            : [
                  { value: 1200000 },
                  { value: 1500000 },
                  { value: 1300000 },
                  { value: 1800000 },
                  { value: 2100000 },
                  { value: 1900000 },
                  { value: 2400000 },
              ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <motion.div
                variants={itemVariants}
                className="md:col-span-2 lg:col-span-2"
            >
                <Card className="h-full border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-primary text-white relative group transition-all duration-300 hover:scale-[1.01]">
                    <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                                    Total Pendapatan
                                </span>
                                <p className="text-xs text-slate-300">
                                    Bulan Ini
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-white">
                                <Wallet className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mt-6">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black tracking-tight text-white leading-none">
                                    {formatCurrency(
                                        kpi.total_revenue_month || 0,
                                    )}
                                </h3>
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-full">
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                    <span>+8.2% vs Bln Lalu</span>
                                </div>
                            </div>

                            <div className="h-16 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sparklineData}>
                                        <defs>
                                            <linearlinear
                                                id="colorSparkline"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#38bdf8"
                                                    stopOpacity={0.4}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#38bdf8"
                                                    stopOpacity={0}
                                                />
                                            </linearlinear>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#38bdf8"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorSparkline)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-1">
                <Card className="h-full border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.015)] rounded-[1.5rem] bg-linear-to-b from-white to-slate-50/50 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] hover:scale-[1.01] group">
                    <CardContent className="p-6 flex flex-col justify-between h-full min-h-40">
                        <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                                    Pesanan Aktif
                                </span>
                                <span className="text-[10px] font-medium text-slate-400/80">
                                    Pending & Proses
                                </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-amber-500/6 text-amber-600 border border-amber-500/10 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.2)]">
                                <ShoppingCart className="h-4 w-4 stroke-[2.2]" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-baseline justify-between">
                            <h3 className="text-3xl font-bold tracking-tight text-slate-800 font-sans">
                                {(
                                    kpi.active_orders_count || 0
                                ).toLocaleString()}
                            </h3>

                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${kpi.active_orders_count ? "bg-amber-500 animate-pulse" : "bg-slate-300"}`}
                                />
                                <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                                    {kpi.active_orders_count
                                        ? `${kpi.active_orders_count} Baru`
                                        : "Clear"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-1">
                <Card className="h-full border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.015)] rounded-[1.5rem] bg-linear-to-b from-white to-slate-50/50 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] hover:scale-[1.01] group">
                    <CardContent className="p-6 flex flex-col justify-between h-full min-h-40">
                        <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                                    Katalog Obat
                                </span>
                                <span className="text-[10px] font-medium text-slate-400/80">
                                    Tersimpan di Sistem
                                </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-indigo-500/6 text-indigo-600 border border-indigo-500/10 transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(99,102,241,0.2)]">
                                <Pill className="h-4 w-4 stroke-[2.2]" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-baseline justify-between">
                            <h3 className="text-3xl font-bold tracking-tight text-slate-800 font-sans">
                                {(
                                    kpi.total_medicines_count || 0
                                ).toLocaleString()}
                            </h3>

                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                                    Aman
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-1">
                <Card className="h-full border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.015)] rounded-[1.5rem] bg-linear-to-b from-white to-slate-50/50 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(15,23,42,0.04)] hover:scale-[1.01] group">
                    <CardContent className="p-6 flex flex-col justify-between h-full min-h-40">
                        <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                                    Tim Apotek
                                </span>
                                <span className="text-[10px] font-medium text-slate-400/80">
                                    Staff Aktif
                                </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-emerald-500/6 text-emerald-600 border border-emerald-500/10 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]">
                                <Users className="h-4 w-4 stroke-[2.2]" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-baseline justify-between">
                            <h3 className="text-3xl font-bold tracking-tight text-slate-800 font-sans">
                                {(kpi.total_staff_count || 0).toLocaleString()}
                            </h3>

                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                                    Hadir
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
