import React from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export function OrderTrendCard({ trendData }) {
    return (
        <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm rounded-3xl bg-white h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-0 pt-6 px-8">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800">
                            Tren Pesanan
                        </CardTitle>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-slate-50 transition-colors">
                                <MoreHorizontal className="h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 rounded-xl p-2" align="end">
                            <div className="flex flex-col text-sm text-slate-600">
                                <button className="text-left px-3 py-2 hover:bg-slate-50 hover:text-[#0b3b60] rounded-lg font-medium transition-colors">
                                    Unduh Laporan PDF
                                </button>
                                <button className="text-left px-3 py-2 hover:bg-slate-50 hover:text-[#0b3b60] rounded-lg font-medium transition-colors">
                                    Bagikan Grafik
                                </button>
                                <div className="h-px w-full bg-slate-100 my-1"></div>
                                <button className="text-left px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
                                    Sembunyikan Grafik
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-4">
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={trendData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTrend"
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
                                    <filter
                                        id="glow"
                                        x="-20%"
                                        y="-20%"
                                        width="140%"
                                        height="140%"
                                    >
                                        <feGaussianBlur
                                            stdDeviation="3"
                                            result="blur"
                                        />
                                        <feComposite
                                            in="SourceGraphic"
                                            in2="blur"
                                            operator="over"
                                        />
                                    </filter>
                                </defs>
                                <XAxis
                                    dataKey="week"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: "#94a3b8",
                                        fontWeight: 600,
                                    }}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pesanan"
                                    stroke="#0b3b60"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorTrend)"
                                    filter="url(#glow)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
