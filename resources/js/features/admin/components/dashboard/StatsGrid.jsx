import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    Building2,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    Activity,
    Server,
    Radio,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, ease: "easeOut" },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
};

export function StatsGrid({ stats = {} }) {
    const totalUsers = stats.totalUsers || 0;
    const userGrowth = stats.userGrowth || 0;
    const totalPharmacies = stats.totalPharmacies || 0;
    const activePharmacies = stats.activePharmacies || 0;
    const activePharmacyPercentage = stats.activePharmacyPercentage || 0;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
        >
            <motion.div variants={itemVariants} className="col-span-1">
                <Card className="border border-slate-200/60 shadow-xl shadow-slate-100/80 rounded-[2rem] bg-white relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 hover:scale-[1.015]">
                    <CardContent className="p-7 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-linear-to-b from-blue-50 to-blue-100/50 border border-blue-100 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs">
                                <Users className="h-5 w-5 text-primary" />
                            </div>

                            <div
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    userGrowth >= 0
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        : "bg-rose-50 text-rose-600 border border-rose-100"
                                }`}
                            >
                                {userGrowth >= 0 ? (
                                    <TrendingUp className="w-3.5 h-3.5" />
                                ) : (
                                    <TrendingDown className="w-3.5 h-3.5" />
                                )}
                                <span>
                                    {userGrowth >= 0
                                        ? `+${userGrowth}`
                                        : userGrowth}
                                    %
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                                Total Pengguna Sistem
                            </span>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1.5 font-mono">
                                {totalUsers.toLocaleString("id-ID")}
                            </h3>
                            <p className="text-xs text-slate-400 mt-2 font-medium">
                                Akun terdaftar aktif di platform
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-1">
                <Card className="border border-slate-200/60 shadow-xl shadow-slate-100/80 rounded-[2rem] bg-white relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 hover:scale-[1.015]">
                    <CardContent className="p-7 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-linear-to-b from-emerald-50 to-emerald-100/50 border border-emerald-100 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs">
                                <Building2 className="h-5 w-5 text-emerald-600" />
                            </div>

                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{activePharmacyPercentage}% Aktif</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                                Apotek Terintegrasi
                            </span>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1.5 font-mono">
                                {totalPharmacies.toLocaleString("id-ID")}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2 font-medium">
                                Terdiri dari{" "}
                                <span className="text-emerald-600 font-bold">
                                    {activePharmacies}
                                </span>{" "}
                                apotek operasional
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="md:col-span-1 lg:col-span-2"
            >
                <Card className="border border-slate-200/60 shadow-xl shadow-slate-100/80 rounded-[2rem] bg-white relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 hover:scale-[1.015]">
                    <CardContent className="p-7 relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-linear-to-b from-indigo-50 to-indigo-100/50 border border-indigo-100 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs">
                                    <Radio className="h-5 w-5 text-indigo-600 animate-pulse" />
                                </div>

                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span>Sistem Lancar</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                                    Apotek Aktif Saat Ini
                                </span>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1.5 font-mono">
                                    {activePharmacies.toLocaleString("id-ID")}
                                </h3>
                                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                                    Sebanyak{" "}
                                    <span className="text-indigo-600 font-bold">
                                        {activePharmacyPercentage}%
                                    </span>{" "}
                                    dari seluruh mitra sedang online.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
