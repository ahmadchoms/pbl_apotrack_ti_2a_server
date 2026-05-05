import React from "react";
import { motion } from "framer-motion";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { ProfileCard } from "@/features/admin/components/profile/ProfileCard";
import { SecurityCard } from "@/features/admin/components/profile/SecurityCard";
import { AuditLogCard } from "@/features/admin/components/profile/AuditLogCard";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
};

export default function AdminProfilePage({ user, auditLogs }) {
    return (
        <DashboardAdminLayout activeMenu="profile">
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-black text-[#0b3b60] uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                            <span className="w-8 h-px bg-[#0b3b60]/30" />
                            Manajemen Akun
                        </p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Profil Administrator
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            Kelola data personal, preferensi keamanan, dan
                            tinjau log audit sistem.
                        </p>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                >
                    <div className="space-y-10">
                        <motion.div variants={itemVariants}>
                            <ProfileCard user={user} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <AuditLogCard logs={auditLogs} />
                        </motion.div>
                    </div>

                    <div className="lg:col-span-2 space-y-10">
                        <motion.div variants={itemVariants}>
                            <SecurityCard user={user} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <div className="p-10 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-sm mb-4">
                                    <span className="text-2xl">⚙️</span>
                                </div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">
                                    Konfigurasi Lanjutan
                                </h4>
                                <p className="text-xs text-slate-400 font-bold max-w-64">
                                    Pengaturan sistem tambahan akan tersedia di
                                    versi berikutnya.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </DashboardAdminLayout>
    );
}
