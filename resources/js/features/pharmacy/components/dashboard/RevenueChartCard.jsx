import React from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export function RevenueChartCard({ revenueData }) {
    return (
        <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-sm rounded-3xl bg-white h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-8">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800">
                            Performa Pendapatan
                        </CardTitle>
                        <p className="text-xs text-slate-400 mt-1">
                            Analisis pendapatan dan volume pesanan harian
                        </p>
                    </div>
                    <Badge
                        variant="secondary"
                        className="bg-blue-50 text-[#0b3b60] border-0 font-bold uppercase text-[10px] tracking-wider px-3 py-1"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0b3b60] mr-2"></span>{" "}
                        Revenue
                    </Badge>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-4">
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={revenueData}
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
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#cbd5e1"
                                            stopOpacity={0.4}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f1f5f9"
                                />
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
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: "#94a3b8",
                                    }}
                                    tickFormatter={(value) =>
                                        `Rp${value / 1000000}M`
                                    }
                                />
                                <Tooltip
                                    cursor={{ fill: "#f8fafc" }}
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="url(#colorRevenue)"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
