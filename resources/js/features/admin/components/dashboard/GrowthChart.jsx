import React from "react";
import { XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { router } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

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

export function GrowthChart({ data = [], filters = {} }) {
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        { val: null, label: "Semua Bulan" },
        { val: 1, label: "Januari" }, { val: 2, label: "Februari" },
        { val: 3, label: "Maret" }, { val: 4, label: "April" },
        { val: 5, label: "Mei" }, { val: 6, label: "Juni" },
        { val: 7, label: "Juli" }, { val: 8, label: "Agustus" },
        { val: 9, label: "September" }, { val: 10, label: "Oktober" },
        { val: 11, label: "November" }, { val: 12, label: "Desember" }
    ];

    const handleFilterChange = (key, val) => {
        const newFilters = { ...filters, [key]: val };
        router.get(route('admin.dashboard'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            only: ['charts', 'filters']
        });
    };

    return (
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-10">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-10 gap-6">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Pertumbuhan Lintas Platform</h3>
                    <p className="text-xs text-slate-400 mt-1 font-bold">Statistik pertumbuhan pendaftaran pengguna</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Year Select */}
                    <div className="relative group">
                        <select 
                            value={filters.year} 
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="appearance-none h-11 pl-5 pr-10 rounded-2xl bg-slate-50 border-none text-[10px] font-black uppercase tracking-wider text-[#0b3b60] focus:ring-2 focus:ring-[#0b3b60]/10 transition-all cursor-pointer"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#0b3b60] pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
                    </div>

                    {/* Month Select */}
                    <div className="relative group">
                        <select 
                            value={filters.month || ""} 
                            onChange={(e) => handleFilterChange('month', e.target.value || null)}
                            className="appearance-none h-11 pl-5 pr-10 rounded-2xl bg-slate-50 border-none text-[10px] font-black uppercase tracking-wider text-[#0b3b60] focus:ring-2 focus:ring-[#0b3b60]/10 transition-all cursor-pointer"
                        >
                            {months.map(m => <option key={m.val} value={m.val || ""}>{m.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#0b3b60] pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
                    </div>
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
