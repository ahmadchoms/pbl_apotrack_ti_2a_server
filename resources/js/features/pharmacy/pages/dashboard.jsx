import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, RefreshCw } from "lucide-react";
import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { DashboardKpiCards } from "@/features/pharmacy/components/dashboard/DashboardKpiCards";
import { DashboardCharts } from "@/features/pharmacy/components/dashboard/DashboardCharts";
import { DashboardTables } from "@/features/pharmacy/components/dashboard/DashboardTables";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function PharmacistDashboard({
    kpi = {},
    charts = {},
    widgets = {},
}) {
    const [isSpinning, setIsSpinning] = useState(false);
    const handleRefresh = () => {
        setIsSpinning(true);
        router.reload({ only: ["kpi", "charts", "widgets"] });
        setTimeout(() => {
            setIsSpinning(false);
        }, 1000);
    };

    return (
        <DashboardPharmacyLayout activeMenu="Dasbor Utama">
            <div className="space-y-10 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0b3b60] text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                Real-time Analysis
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            Dasbor Utama Apotek
                        </h2>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wide">
                            Ringkasan Kinerja & Operasional Apotek Anda
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            className="rounded-2xl border-slate-200 bg-white hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <motion.div
                                animate={{ rotate: isSpinning ? 360 : 0 }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeInOut",
                                }}
                            >
                                <RefreshCw className="h-5 w-5 text-slate-400" />
                            </motion.div>
                        </Button>

                        <Select defaultValue="month">
                            <SelectTrigger className="w-56 h-12 rounded-2xl bg-white border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest focus:ring-[#0b3b60]/20 shadow-sm transition-all">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <SelectValue placeholder="Pilih Periode" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                                <SelectItem
                                    value="week"
                                    className="rounded-xl text-[10px] font-black uppercase tracking-widest py-3"
                                >
                                    Minggu Ini
                                </SelectItem>
                                <SelectItem
                                    value="30days"
                                    className="rounded-xl text-[10px] font-black uppercase tracking-widest py-3"
                                >
                                    30 Hari Terakhir
                                </SelectItem>
                                <SelectItem
                                    value="month"
                                    className="rounded-xl text-[10px] font-black uppercase tracking-widest py-3"
                                >
                                    Bulan Ini
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    <DashboardKpiCards kpi={kpi} />

                    <div className="space-y-8">
                        <div className="flex items-center gap-4 px-2">
                            <div className="h-px flex-1 bg-slate-100" />
                            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">
                                Visualisasi Data
                            </h3>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <DashboardCharts charts={charts} />
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4 px-2">
                            <div className="h-px flex-1 bg-slate-100" />
                            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">
                                Kontrol Operasional
                            </h3>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <DashboardTables widgets={widgets} />
                    </div>
                </motion.div>
            </div>
        </DashboardPharmacyLayout>
    );
}
