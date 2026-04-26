import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { DashboardStatsGrid } from "@/features/pharmacy/components/dashboard/DashboardStatsGrid";
import { RevenueChartCard } from "@/features/pharmacy/components/dashboard/RevenueChartCard";
import { UserActivityCard } from "@/features/pharmacy/components/dashboard/UserActivityCard";
import { CriticalStockCard } from "@/features/pharmacy/components/dashboard/CriticalStockCard";
import { OrderTrendCard } from "@/features/pharmacy/components/dashboard/OrderTrendCard";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function PharmacistDashboard({
    totalOrders = 0,
    totalMedicines = 0,
    criticalStocksCount = 0,
    prescriptionQueue = 0,
    totalRevenue = 0,
    revenueData = [],
    trendData = [],
    userActivities = [],
    criticalStocks = [],
}) {
    return (
        <DashboardPharmacyLayout activeMenu="Dasbor Utama">
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Ikhtisar Apotek
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Pantau performa dan inventori secara real-time.
                        </p>
                    </div>

                    <Select defaultValue="30days">
                        <SelectTrigger className="w-47.5 h-10 rounded-xl bg-white border-slate-200 text-slate-600 focus:ring-[#0b3b60]">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <SelectValue placeholder="Pilih Periode" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="week">Minggu Ini</SelectItem>
                            <SelectItem value="30days">
                                Terakhir 30 Hari
                            </SelectItem>
                            <SelectItem value="month">Bulan Ini</SelectItem>
                            <SelectItem value="year">Tahun Ini</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <DashboardStatsGrid
                        totalOrders={totalOrders}
                        totalMedicines={totalMedicines}
                        criticalStocksCount={criticalStocksCount}
                        prescriptionQueue={prescriptionQueue}
                        totalRevenue={totalRevenue}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <RevenueChartCard revenueData={revenueData} />
                        <UserActivityCard userActivities={userActivities} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CriticalStockCard criticalStocks={criticalStocks} />
                        <OrderTrendCard trendData={trendData} />
                    </div>
                </motion.div>
            </div>
        </DashboardPharmacyLayout>
    );
}
