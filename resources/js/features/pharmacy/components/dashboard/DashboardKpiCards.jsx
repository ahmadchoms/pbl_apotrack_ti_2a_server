import React from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    ShoppingCart,
    Pill,
    Users,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export function DashboardKpiCards({ kpi = {} }) {
    const stats = [
        {
            title: "Total Pendapatan",
            subtitle: "Bulan Ini",
            value: kpi.total_revenue_month || 0,
            icon: Wallet,
            color: "bg-emerald-50 text-emerald-600",
            isCurrency: true,
            trend: "+8.2%",
        },
        {
            title: "Pesanan Aktif",
            subtitle: "Pending & Proses",
            value: kpi.active_orders_count || 0,
            icon: ShoppingCart,
            color: "bg-blue-50 text-blue-600",
            trend: "5 baru",
        },
        {
            title: "Total Obat",
            subtitle: "Status Aktif",
            value: kpi.total_medicines_count || 0,
            icon: Pill,
            color: "bg-indigo-50 text-indigo-600",
            trend: "Stok aman",
        },
        {
            title: "Total Staff",
            subtitle: "Status Aktif",
            value: kpi.total_staff_count || 0,
            icon: Users,
            color: "bg-orange-50 text-orange-600",
            trend: "Semua hadir",
        },
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                    <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${item.color} transition-colors duration-300`}>
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    <ArrowUpRight className="h-3 w-3" />
                                    {item.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
                                    {item.title}
                                </p>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-3">
                                    {item.subtitle}
                                </p>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                                    {item.isCurrency ? formatCurrency(item.value) : item.value.toLocaleString()}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
