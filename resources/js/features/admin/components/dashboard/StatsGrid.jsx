import React from "react";
import { motion } from "framer-motion";
import { Users, Building2, TrendingUp, CheckCircle2, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { itemVariants } from "@/features/admin/lib/constants";

export function StatsGrid({ stats = {} }) {
    return (
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="w-24 h-24 text-[#0b3b60]" />
                    </div>
                    <CardContent className="p-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                            <Users className="h-6 w-6 text-[#0b3b60]" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pengguna</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-slate-900">{(stats.totalUsers || 0).toLocaleString()}</h3>
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" />+{stats.userGrowth}%
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Building2 className="w-24 h-24 text-emerald-600" />
                    </div>
                    <CardContent className="p-8">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                            <Building2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Node Terintegrasi</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-slate-900">{(stats.totalPharmacies || 0).toLocaleString()}</h3>
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" />{stats.activePharmacyPercentage}%
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div variants={itemVariants} className="md:col-span-2">
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-linear-to-br from-[#0b3b60] to-[#0055a5] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Status Ekosistem</p>
                                <h3 className="text-2xl font-black text-white">Sistem Optimal</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="mt-8 flex gap-8">
                            <div>
                                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Latensi</p>
                                <p className="text-lg font-black text-white">24ms</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Uptime</p>
                                <p className="text-lg font-black text-white">99.9%</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Node Aktif</p>
                                <p className="text-lg font-black text-white">{stats.activePharmacies}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
