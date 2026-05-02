import React from "react";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import { Link } from "@inertiajs/react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { StatsGrid } from "@/features/admin/components/dashboard/StatsGrid";
import { GrowthChart } from "@/features/admin/components/dashboard/GrowthChart";
import { AuditFeed } from "@/features/admin/components/dashboard/AuditFeed";
import { itemVariants } from "@/features/admin/lib/constants";

export default function AdminDashboard({ stats = {}, charts = {}, auditLogs = [], filters = {} }) {
    return (
        <DashboardAdminLayout activeMenu="dashboard">
            <div className="space-y-10">
                <PageHeader subtitle="Sistem Administrasi" title="Dashboard Utama" description="Pantau performa ekosistem dan manajemen node secara real-time.">
                    <Link 
                        href={route('admin.profile.audit-history')}
                        className="h-11 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <History className="w-4 h-4" /> Log Sistem
                    </Link>
                </PageHeader>
                <StatsGrid stats={stats} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <motion.div variants={itemVariants} className="lg:col-span-8">
                        <GrowthChart data={charts.userGrowth || []} filters={filters} />
                    </motion.div>
                    <motion.div variants={itemVariants} className="lg:col-span-4">
                        <AuditFeed auditLogs={auditLogs} />
                    </motion.div>
                </div>
            </div>
        </DashboardAdminLayout>
    );
}
