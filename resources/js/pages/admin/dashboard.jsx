import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Building2,
    UserCircle,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardAdminLayout } from "@/layouts/admin-layout";

// Data now comes from Inertia Props

const menuItems = [
    { id: "Dasbor", icon: LayoutDashboard },
    { id: "Pengguna", icon: Users },
    { id: "Apotek", icon: Building2 },
    { id: "Profil", icon: UserCircle },
];

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

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0b3b60] text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg">
                <p>{`${payload[0].payload.name}: ${(payload[0].value / 1000).toFixed(1)}k`}</p>
            </div>
        );
    }
    return null;
};

export default function AdminDashboardPage({
    totalUsers = 0,
    userGrowth = 0,
    totalPharmacies = 0,
    activePharmacyPercentage = 0,
    userGrowthData = [],
    apotekGrowthData = [],
    auditLogs = []
}) {
    const [userFilter, setUserFilter] = useState("Bulanan");
    const [apotekFilter, setApotekFilter] = useState("Bulanan");

    return (
        <DashboardAdminLayout>
            <main className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-[1400px] mx-auto space-y-8">
                    <div>
                        <p className="text-[10px] font-bold text-[#0b3b60] uppercase tracking-widest mb-1">
                            Ikhtisar Ekosistem
                        </p>
                        <h2 className="text-2xl font-extrabold text-slate-800">
                            Wawasan Terkurasi
                        </h2>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-sm shadow-slate-200/50 rounded-3xl bg-gradient-to-br from-white to-slate-50/50 relative overflow-hidden h-full">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                                <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full">
                                    <div>
                                        <div className="w-12 h-12 bg-blue-100/50 rounded-2xl flex items-center justify-center mb-6">
                                            <Users className="h-6 w-6 text-[#0b3b60]" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Total Pengguna
                                        </p>
                                        <h3 className="text-4xl font-extrabold text-slate-800">
                                            {totalUsers.toLocaleString()}
                                        </h3>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        <p className="text-xs font-bold text-emerald-500">
                                            {userGrowth >= 0 ? "Peningkatan" : "Penurunan"} {Math.abs(userGrowth)}%{" "}
                                            <span className="text-slate-400 font-medium ml-1">
                                                vs bulan lalu
                                            </span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-sm shadow-slate-200/50 rounded-3xl bg-gradient-to-br from-white to-slate-50/50 relative overflow-hidden h-full">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
                                <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full">
                                    <div>
                                        <div className="w-12 h-12 bg-emerald-100/50 rounded-2xl flex items-center justify-center mb-6">
                                            <Building2 className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Total Apotek
                                        </p>
                                        <h3 className="text-4xl font-extrabold text-slate-800">
                                            {totalPharmacies.toLocaleString()}
                                        </h3>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <p className="text-xs font-bold text-emerald-500">
                                            {activePharmacyPercentage}% Aktif{" "}
                                            <span className="text-slate-400 font-medium ml-1">
                                                Node terverifikasi
                                            </span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-sm shadow-slate-200/50 rounded-3xl bg-white h-full">
                                <CardHeader className="pb-4 pt-6 px-6 flex flex-row items-center justify-between border-b border-slate-50">
                                    <CardTitle className="text-sm font-bold text-slate-800">
                                        Log Audit Klinis
                                    </CardTitle>
                                    <button className="text-[10px] font-bold text-[#0b3b60] hover:underline uppercase tracking-wider">
                                        Lihat Semua
                                    </button>
                                </CardHeader>
                                <CardContent className="px-6 py-4">
                                    <div className="relative pl-3 space-y-5">
                                        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-100"></div>
                                        {auditLogs.map((log) => (
                                            <div
                                                key={log.id}
                                                className="relative pl-5"
                                            >
                                                <div
                                                    className={`absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm ${log.isNew ? "bg-emerald-500" : "bg-[#0b3b60]"}`}
                                                ></div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="text-xs font-bold text-slate-800 leading-none">
                                                        {log.title}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 shrink-0 whitespace-nowrap leading-none mt-0.5">
                                                        {log.time}
                                                    </p>
                                                </div>
                                                <p className="text-[10px] font-medium text-slate-500 mt-1.5 leading-relaxed">
                                                    {log.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-sm shadow-slate-200/50 rounded-3xl bg-white p-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        Analisis Pertumbuhan Pengguna
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Kecepatan onboarding lintas demografi
                                        utama
                                    </p>
                                </div>
                                <div className="flex bg-slate-50 p-1 rounded-xl mt-4 sm:mt-0">
                                    {["Bulanan", "Triwulanan"].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() =>
                                                setUserFilter(filter)
                                            }
                                            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                                                userFilter === filter
                                                    ? "bg-white text-slate-800 shadow-sm border border-slate-200/50"
                                                    : "text-slate-400 hover:text-slate-600"
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={
                                            userFilter === "Bulanan"
                                                ? userGrowthData
                                                : userGrowthData.slice(0, 4)
                                        }
                                        margin={{
                                            top: 20,
                                            right: 0,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 10,
                                                fill: "#94a3b8",
                                                fontWeight: 700,
                                            }}
                                            dy={10}
                                        />
                                        <Tooltip
                                            cursor={{ fill: "transparent" }}
                                            content={<CustomTooltip />}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[6, 6, 0, 0]}
                                            barSize={45}
                                        >
                                            {userGrowthData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            entry.name === "MEI"
                                                                ? "#0b3b60"
                                                                : "#cbd5e1"
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-sm shadow-slate-200/50 rounded-3xl bg-white p-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        Analisis Pertumbuhan Apotek
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Kecepatan onboarding lintas demografi
                                        utama
                                    </p>
                                </div>
                                <div className="flex bg-slate-50 p-1 rounded-xl mt-4 sm:mt-0">
                                    {["Bulanan", "Triwulanan"].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() =>
                                                setApotekFilter(filter)
                                            }
                                            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                                                apotekFilter === filter
                                                    ? "bg-white text-slate-800 shadow-sm border border-slate-200/50"
                                                    : "text-slate-400 hover:text-slate-600"
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={
                                            apotekFilter === "Bulanan"
                                                ? apotekGrowthData
                                                : apotekGrowthData.slice(0, 4)
                                        }
                                        margin={{
                                            top: 20,
                                            right: 0,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 10,
                                                fill: "#94a3b8",
                                                fontWeight: 700,
                                            }}
                                            dy={10}
                                        />
                                        <Tooltip
                                            cursor={{ fill: "transparent" }}
                                            content={<CustomTooltip />}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[6, 6, 0, 0]}
                                            barSize={45}
                                        >
                                            {apotekGrowthData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            entry.name === "MEI"
                                                                ? "#004aad"
                                                                : "#e2e8f0"
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </DashboardAdminLayout>
    );
}
