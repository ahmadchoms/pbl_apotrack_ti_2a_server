import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    RefreshCw,
    Sun,
    Clock,
    Sparkles,
    Activity,
    DollarSign,
} from "lucide-react";
import { router, usePage } from "@inertiajs/react";
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
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function PharmacistDashboard({
    kpi = {},
    charts = {},
    widgets = {},
    filters = {},
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [isSpinning, setIsSpinning] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }) + " WIB",
            );
            setCurrentDate(
                now.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsSpinning(true);
        router.reload({ only: ["kpi", "charts", "widgets"] });
        setTimeout(() => {
            setIsSpinning(false);
        }, 1000);
    };

    function getGreeting() {
        const hours = new Date().getHours();

        if (hours >= 4 && hours < 11) {
            return "Selamat Pagi";
        } else if (hours >= 11 && hours < 15) {
            return "Selamat Siang";
        } else if (hours >= 15 && hours < 18) {
            return "Selamat Sore";
        } else {
            return "Selamat Malam";
        }
    }

    return (
        <DashboardPharmacyLayout activeMenu="Dashboard">
            <div className="space-y-8 pb-20 max-w-7xl mx-auto font-sans">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-primary text-white p-5 sm:p-8 md:p-10 shadow-2xl shadow-blue-900/10 border border-blue-900/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 sm:gap-8"
                >
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(white 1.5px, transparent 1.5px)`,
                            backgroundSize: "24px 24px",
                        }}
                    />
                    <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-blue-500/10 filter blur-[80px] pointer-events-none" />

                    <div className="space-y-3 sm:space-y-4 relative z-10 w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-blue-200">
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            <span className="truncate">
                                {getGreeting()}, {user?.username || "Apoteker"}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
                                Dasbor Utama Apotek
                            </h2>
                            <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-lg leading-relaxed">
                                Evaluasi performa penjualan obat dan koordinasi
                                stok real-time dalam satu halaman modular
                                terpusat.
                            </p>
                        </div>

                        <div className="text-[10px] sm:text-xs font-medium text-slate-300 w-fit flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl">
                            <DollarSign className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-indigo-300" />
                            <span>
                                Total Penjualan Bulan Ini:{" "}
                                <strong className="text-white">
                                    Rp{" "}
                                    {(
                                        kpi.total_revenue_month || 0
                                    ).toLocaleString("id-ID")}
                                </strong>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 sm:gap-6 shrink-0 relative z-10 w-full sm:w-auto">
                        <div className="text-left sm:text-right lg:text-right space-y-0.5 sm:space-y-1">
                            <div className="flex items-center gap-2 sm:justify-end text-xs sm:text-sm text-blue-200 font-semibold">
                                <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-300" />
                                <span>{currentTime}</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                {currentDate}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRefresh}
                                className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-300 active:scale-95 shrink-0 w-9 h-9 sm:w-11 sm:h-11"
                            >
                                <motion.div
                                    animate={{ rotate: isSpinning ? 360 : 0 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
                                </motion.div>
                            </Button>

                            <div className="flex items-center gap-2 flex-1 sm:flex-none">
                                <Select
                                    value={
                                        filters.month ||
                                        String(new Date().getMonth() + 1)
                                    }
                                    onValueChange={(val) =>
                                        router.get(
                                            route("pharmacy.dashboard"),
                                            { ...filters, month: val },
                                            { preserveState: true },
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border-white/10 text-white font-semibold text-[10px] sm:text-xs tracking-wider focus:ring-blue-500/30 w-24 sm:w-32 hover:bg-white/10 hover:border-white/20 transition-all">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Calendar className="h-3 sm:h-4 w-3 sm:w-4 text-slate-400" />
                                            <SelectValue placeholder="Bulan" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 bg-white text-slate-800">
                                        {[
                                            "Januari",
                                            "Februari",
                                            "Maret",
                                            "April",
                                            "Mei",
                                            "Juni",
                                            "Juli",
                                            "Agustus",
                                            "September",
                                            "Oktober",
                                            "November",
                                            "Desember",
                                        ].map((m, i) => (
                                            <SelectItem
                                                key={i + 1}
                                                value={String(i + 1)}
                                                className="rounded-xl text-xs font-semibold py-2.5 cursor-pointer"
                                            >
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={
                                        filters.year ||
                                        String(new Date().getFullYear())
                                    }
                                    onValueChange={(val) =>
                                        router.get(
                                            route("pharmacy.dashboard"),
                                            { ...filters, year: val },
                                            { preserveState: true },
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border-white/10 text-white font-semibold text-[10px] sm:text-xs tracking-wider focus:ring-blue-500/30 w-20 sm:w-28 hover:bg-white/10 hover:border-white/20 transition-all">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 bg-white text-slate-800">
                                        {[2024, 2025, 2026].map((y) => (
                                            <SelectItem
                                                key={y}
                                                value={String(y)}
                                                className="rounded-xl text-xs font-semibold py-2.5 cursor-pointer"
                                            >
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Rangkuman Metrik Utama
                            </h3>
                            <div className="h-px flex-1 bg-slate-150" />
                        </div>
                        <DashboardKpiCards
                            kpi={kpi}
                            revenueTrend={charts.revenue_trend || []}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Tren & Performa Visual
                            </h3>
                            <div className="h-px flex-1 bg-slate-150" />
                        </div>
                        <DashboardCharts charts={charts} />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Pemantauan Operasional
                            </h3>
                            <div className="h-px flex-1 bg-slate-150" />
                        </div>
                        <DashboardTables widgets={widgets} />
                    </div>
                </motion.div>
            </div>
        </DashboardPharmacyLayout>
    );
}
