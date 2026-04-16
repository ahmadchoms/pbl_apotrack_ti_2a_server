import React from "react";
import { motion } from "framer-motion";
import { DashboardApotekLayout } from "@/layouts/apotek-layout";
import { ProfileCard } from "@/features/apotek/components/profile-card";
import { AuditLogCard } from "@/features/apotek/components/audit-log-card";
import { OrderActivityCard } from "@/features/apotek/components/order-activity-card";
import { SecurityCard } from "@/features/apotek/components/security-card";
import { AccountSettingsCard } from "@/features/apotek/components/account-setting-card";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export default function ProfilePage() {
    return (
        <DashboardApotekLayout activeMenu="Profil Pengguna">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Profil Administrator
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola data pribadi, keamanan, dan pengaturan akun Anda.
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="space-y-8">
                        <motion.div variants={itemVariants}>
                            <ProfileCard />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <AuditLogCard />
                        </motion.div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <motion.div variants={itemVariants}>
                            <OrderActivityCard />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <SecurityCard />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <AccountSettingsCard />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </DashboardApotekLayout>
    );
}
