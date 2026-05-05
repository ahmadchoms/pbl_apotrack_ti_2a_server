import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, Calendar, ShieldCheck } from "lucide-react";

export function PharmacyStats({ data, formatCurrency }) {
    const stats = [
        {
            label: "Total Omset",
            value: formatCurrency(data.stats.total_revenue),
            icon: TrendingUp,
            color: "text-indigo-600",
            sub: "Transaksi Berhasil",
            subColor: "text-emerald-600",
            dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        },
        {
            label: "Total Pesanan",
            value: data.stats.total_orders,
            icon: ShoppingBag,
            color: "text-amber-600",
            sub: "Pesanan Selesai",
            subColor: "text-slate-500",
        },
        {
            label: "Bergabung Sejak",
            value: new Date(data.stats.joined_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            icon: Calendar,
            color: "text-emerald-600",
            sub: "Mitra ApoTrack",
            subColor: "text-slate-500",
        },
        {
            label: "Rating Platform",
            value: data.rating || "0.0",
            icon: ShieldCheck,
            color: "text-indigo-600",
            sub: `${data.total_reviews} Ulasan Pelanggan`,
            subColor: "text-slate-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (i + 1) }}
                >
                    <Card className="py-0 gap-0 rounded-[2rem] border-none shadow-2xl shadow-slate-200/50 bg-linear-to-br from-white to-slate-50/50 overflow-hidden group">
                        <CardContent className="p-8 relative">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <stat.icon
                                    className={`w-20 h-20 ${stat.color}`}
                                />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                                {stat.label}
                            </p>
                            <h3 className="text-xl font-black text-slate-900">
                                {stat.value}
                            </h3>
                            <div className="mt-4 flex items-center gap-2">
                                {stat.dot && (
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full ${stat.dot}`}
                                    />
                                )}
                                <p
                                    className={`text-[10px] font-bold ${stat.subColor} uppercase tracking-widest`}
                                >
                                    {stat.sub}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
