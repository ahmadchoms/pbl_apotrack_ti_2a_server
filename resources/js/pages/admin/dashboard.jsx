import React, { useState } from "react";
import { motion } from "framer-motion";
import { History, RefreshCw } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { StatsGrid } from "@/features/admin/components/dashboard/StatsGrid";
import { GrowthChart } from "@/features/admin/components/dashboard/GrowthChart";
import { AuditFeed } from "@/features/admin/components/dashboard/AuditFeed";
import { Button } from "@/components/ui/button";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function AdminDashboard({
    stats = {},
    charts = {},
    auditLogs = [],
    filters = {},
}) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [systemHealth, setSystemHealth] = useState("Optimal");

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ["stats", "charts", "auditLogs"],
            onFinish: () => setIsRefreshing(false),
        });
    };

    return (
        <DashboardAdminLayout activeMenu="dashboard">
            <div className="space-y-8 font-sans pb-20">
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-primary text-white p-8 md:p-10 shadow-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <div className="space-y-2 relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                            Dashboard Admin Apotrack
                        </h2>
                        <p className="text-sm font-medium text-blue-200/70 max-w-lg leading-relaxed">
                            Pantau aktivitas transaksi, manajemen kemitraan
                            apotek, dan pertumbuhan pengguna lintas platform
                            secara real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 shrink-0 w-full md:w-auto">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/20 text-white transition-all duration-300 active:scale-95 shrink-0 shadow-inner"
                            disabled={isRefreshing}
                        >
                            <motion.div
                                animate={{ rotate: isRefreshing ? 360 : 0 }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeInOut",
                                }}
                                className="flex items-center justify-center"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${isRefreshing ? "text-emerald-400" : "text-white"}`}
                                />
                            </motion.div>
                        </Button>

                        <Link
                            href={route("admin.profile.audit-history")}
                            className="h-12 px-6 rounded-2xl bg-white hover:bg-blue-50 text-primary font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 flex-1 md:flex-none"
                        >
                            <History className="w-4 h-4 text-primary" /> Log
                            Sistem
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-10"
                >
                    <StatsGrid stats={stats} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        <div className="lg:col-span-8 h-full">
                            <GrowthChart
                                data={charts.userGrowth || []}
                                filters={filters}
                            />
                        </div>
                        <div className="lg:col-span-4 h-full">
                            <AuditFeed auditLogs={auditLogs.data} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardAdminLayout>
    );
}
