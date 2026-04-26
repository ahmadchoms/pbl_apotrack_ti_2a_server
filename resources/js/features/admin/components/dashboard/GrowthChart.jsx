import React, { useState } from "react";
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card } from "@/components/ui/card";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0b3b60] text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-xl border border-white/10 backdrop-blur-md">
                <p>{`${payload[0].payload.name}: ${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};

export function GrowthChart({ data = [] }) {
    const [filter, setFilter] = useState("Bulanan");

    return (
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Pertumbuhan Lintas Platform</h3>
                    <p className="text-xs text-slate-400 mt-1 font-bold">Statistik bulanan pendaftaran pengguna baru</p>
                </div>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl mt-4 sm:mt-0">
                    {["Bulanan", "Tahunan"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? "bg-white text-[#0b3b60] shadow-md shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0b3b60" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#0b3b60" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 800 }} dy={15} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="value" stroke="#0b3b60" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" animationDuration={2000} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
