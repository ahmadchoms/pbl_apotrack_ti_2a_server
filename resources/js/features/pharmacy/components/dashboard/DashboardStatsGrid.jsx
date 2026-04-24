import React from "react";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    Pill,
    TrendingUp,
    PackageX,
    Wallet,
    ClipboardList,
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

export function DashboardStatsGrid({
    totalOrders,
    totalMedicines,
    criticalStocksCount,
    prescriptionQueue,
    totalRevenue,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div variants={itemVariants} className="group cursor-default">
                <Card className="border border-white/40 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                            <div className="bg-slate-100/80 w-10 h-10 flex items-center justify-center rounded-xl text-slate-600">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Total Order
                                </p>
                                <h3 className="text-3xl font-extrabold text-slate-800">
                                    {totalOrders.toLocaleString()}
                                </h3>
                            </div>
                            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> +12% dari bulan
                                lalu
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="border border-white/40 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                            <div className="bg-slate-100/80 w-10 h-10 flex items-center justify-center rounded-xl text-slate-600">
                                <Pill className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Total Obat
                                </p>
                                <h3 className="text-3xl font-extrabold text-slate-800">
                                    {totalMedicines.toLocaleString()}
                                </h3>
                            </div>
                            <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                                <PackageX className="h-3 w-3" />{" "}
                                {criticalStocksCount} stok menipis
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="border border-white/40 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                            <div className="bg-orange-50 w-10 h-10 flex items-center justify-center rounded-xl text-orange-500">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Antrean Resep
                                </p>
                                <h3 className="text-3xl font-extrabold text-slate-800">
                                    {prescriptionQueue.toLocaleString()}
                                </h3>
                            </div>
                            <p className="text-xs font-medium text-slate-500">
                                Butuh verifikasi Apoteker
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="bg-linear-to-br from-[#0b3b60] to-[#082a45] text-white shadow-xl shadow-[#0b3b60]/20 hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl overflow-hidden relative">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex flex-col gap-4">
                            <div className="bg-white/10 w-10 h-10 flex items-center justify-center rounded-xl text-blue-100">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                                    Total Revenue
                                </p>
                                <h3 className="text-3xl font-extrabold text-white">
                                    {"Rp " +
                                        (totalRevenue >= 1000000
                                            ? (
                                                  totalRevenue / 1000000
                                              ).toFixed(1) + "M"
                                            : totalRevenue.toLocaleString())}
                                </h3>
                            </div>
                            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Ekspektasi
                                tercapai
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
