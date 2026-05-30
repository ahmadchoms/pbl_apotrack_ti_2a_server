import React from "react";
import {
    XAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
} from "recharts";
import { router } from "@inertiajs/react";
import { Card, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md">
                <p className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                    {payload[0].payload.name}
                </p>
                <p className="text-sm font-black text-white">
                    {`${payload[0].value.toLocaleString()} Pendaftaran`}
                </p>
            </div>
        );
    }
    return null;
};

export function GrowthChart({ data = [], filters = {} }) {
    const years = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i,
    );
    const months = [
        { val: null, label: "Semua Bulan" },
        { val: 1, label: "Januari" },
        { val: 2, label: "Februari" },
        { val: 3, label: "Maret" },
        { val: 4, label: "April" },
        { val: 5, label: "Mei" },
        { val: 6, label: "Juni" },
        { val: 7, label: "Juli" },
        { val: 8, label: "Agustus" },
        { val: 9, label: "September" },
        { val: 10, label: "Oktober" },
        { val: 11, label: "November" },
        { val: 12, label: "Desember" },
    ];

    const handleFilterChange = (key, val) => {
        const newFilters = { ...filters, [key]: val };
        router.get(route("admin.dashboard"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            only: ["charts", "filters"],
        });
    };

    return (
        <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-8 md:p-10 h-full flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800">
                            Pertumbuhan Pengguna
                        </CardTitle>
                        <p className="text-xs text-slate-405 mt-0.5">
                            Grafik pertumbuhan registrasi pengguna apotek &
                            staff
                        </p>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <Select
                            value={String(filters.year)}
                            onValueChange={(value) =>
                                handleFilterChange("year", value)
                            }
                        >
                            <SelectTrigger className="appearance-none h-11 pl-4 pr-10 rounded-2xl bg-slate-50 border border-slate-250/30 text-xs font-bold text-primary focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all cursor-pointer shadow-sm [&>svg]:opacity-60 [&>svg]:w-3.5 [&>svg]:h-3.5">
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-md">
                                {years.map((y) => (
                                    <SelectItem
                                        key={y}
                                        value={String(y)}
                                        className="text-xs font-medium text-slate-700 focus:bg-slate-50 focus:text-primary cursor-pointer rounded-lg py-2"
                                    >
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative">
                        <Select
                            value={String(filters.month || "ALL")}
                            onValueChange={(value) =>
                                handleFilterChange(
                                    "month",
                                    value === "ALL" ? null : value,
                                )
                            }
                        >
                            <SelectTrigger className="appearance-none h-11 pl-4 pr-10 rounded-2xl bg-slate-50 border border-slate-250/30 text-xs font-bold text-primary focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all cursor-pointer shadow-sm [&>svg]:opacity-60 [&>svg]:w-3.5 [&>svg]:h-3.5">
                                <SelectValue placeholder="Pilih Bulan" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-slate-200 bg-white shadow-md">
                                {months.map((m) => (
                                    <SelectItem
                                        key={m.val || "ALL"}
                                        value={String(m.val || "ALL")}
                                        className="text-xs font-medium text-slate-700 focus:bg-slate-50 focus:text-primary cursor-pointer rounded-lg py-2"
                                    >
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="h-80 w-full mt-4 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorGrowth"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#0b3b60"
                                    stopOpacity={0.15}
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
                            dataKey="name"
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
                            content={<CustomTooltip />}
                            cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0b3b60"
                            strokeWidth={3.5}
                            fillOpacity={1}
                            fill="url(#colorGrowth)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
