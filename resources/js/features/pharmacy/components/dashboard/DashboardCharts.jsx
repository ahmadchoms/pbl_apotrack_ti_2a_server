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
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 shadow-2xl rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-[#0b3b60]">
                    {payload[0].name === "Revenue" 
                        ? `Rp ${payload[0].value.toLocaleString()}`
                        : `${payload[0].value} Unit`}
                </p>
            </div>
        );
    }
    return null;
};

export function DashboardCharts({ charts = {} }) {
    const revenueTrend = charts.revenue_trend || [];
    const topMedicines = charts.top_medicines || [];

    const barColors = ["#0b3b60", "#1a6fad", "#3b82f6", "#60a5fa", "#93c5fd"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Trend Chart */}
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-0">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-blue-50 text-[#0b3b60]">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Tren Pendapatan</CardTitle>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">30 Hari Terakhir</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueTrend}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0b3b60" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#0b3b60" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        hide 
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        name="Revenue"
                                        stroke="#0b3b60" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Top Medicines Chart */}
            <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="p-10 pb-0">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Obat Terlaris</CardTitle>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Top 5 Produk</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topMedicines} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 800, fill: '#475569' }}
                                        width={100}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="value" name="Terjual" radius={[0, 12, 12, 0]} barSize={32}>
                                        {topMedicines.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
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
