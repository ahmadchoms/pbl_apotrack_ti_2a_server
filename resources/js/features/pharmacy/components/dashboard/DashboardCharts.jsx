import React from "react";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Trophy } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const isSales = payload[0].name === "Pendapatan";
        return (
            <div className="bg-slate-900/90 text-white p-4 shadow-2xl rounded-2xl border border-slate-800 backdrop-blur-md">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p className="text-sm font-bold text-white">
                    {isSales
                        ? new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                          }).format(payload[0].value)
                        : `${payload[0].value.toLocaleString()} Unit`}
                </p>
            </div>
        );
    }
    return null;
};

export function DashboardCharts({ charts = {} }) {
    const revenueTrend = charts.revenue_trend || [];
    const topMedicines = charts.top_medicines || [];

    // Modern harmonious color palette for top medicines
    const barColors = [
        "url(#barGrad1)",
        "url(#barGrad2)",
        "url(#barGrad3)",
        "url(#barGrad4)",
        "url(#barGrad5)",
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-7">
                <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="p-8 pb-2 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-50 text-primary">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold text-slate-800">
                                    Tren Pendapatan Harian
                                </CardTitle>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Grafik pergerakan omzet 30 hari terakhir
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueTrend}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorRevenue"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#0b3b60"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#0b3b60"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fontWeight: 600,
                                            fill: "#94a3b8",
                                        }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fontWeight: 600,
                                            fill: "#94a3b8",
                                        }}
                                        tickFormatter={(v) =>
                                            `Rp ${v >= 1000000 ? v / 1000000 + "M" : v.toLocaleString()}`
                                        }
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Pendapatan"
                                        stroke="#0b3b60"
                                        strokeWidth={3.5}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-5">
                <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="p-8 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold text-slate-800">
                                    Obat Paling Laris
                                </CardTitle>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    5 komoditas obat dengan volume jual
                                    tertinggi
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={topMedicines}
                                    layout="vertical"
                                    margin={{
                                        left: -10,
                                        right: 10,
                                        top: 10,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="barGrad1"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#0b3b60"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#1e4ed8"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="barGrad2"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#2563eb"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#3b82f6"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="barGrad3"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#4f46e5"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#6366f1"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="barGrad4"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#6366f1"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#818cf8"
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="barGrad5"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#94a3b8"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#cbd5e1"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                        horizontal={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            fill: "#475569",
                                        }}
                                        width={100}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: "#f8fafc" }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        name="Terjual"
                                        radius={[0, 8, 8, 0]}
                                        barSize={24}
                                    >
                                        {topMedicines.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    barColors[
                                                        index % barColors.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
