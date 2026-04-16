import React from "react";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    Pill,
    TrendingUp,
    PackageX,
    Wallet,
    ClipboardList,
    Calendar,
    MoreHorizontal,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ActivityDialog } from "@/features/apotek/components/activity-dialog";
import { StockDialog } from "@/features/apotek/components/stock-dialog";
import { DashboardApotekLayout } from "@/layouts/apotek-layout";

const revenueData = [
    { name: "SEN", revenue: 4000000, orders: 120 },
    { name: "SEL", revenue: 5500000, orders: 150 },
    { name: "RAB", revenue: 4800000, orders: 130 },
    { name: "KAM", revenue: 6000000, orders: 170 },
    { name: "JUM", revenue: 8500000, orders: 220 },
    { name: "SAB", revenue: 7200000, orders: 190 },
    { name: "MIN", revenue: 5000000, orders: 140 },
];

const trendData = [
    { week: "Minggu 1", pesanan: 450 },
    { week: "Minggu 2", pesanan: 580 },
    { week: "Minggu 3", pesanan: 850 },
    { week: "Minggu 4", pesanan: 1284 },
];

const userActivities = [
    {
        id: 1,
        name: "Budi Santoso",
        status: "Baru saja",
        amount: "Rp 450.000",
        avatar: "BS",
    },
    {
        id: 2,
        name: "Siti Aminah",
        status: "2 menit yang lalu",
        amount: "Rp 1.200.000",
        avatar: "SA",
    },
    {
        id: 3,
        name: "Aditya Wijaya",
        status: "15 menit yang lalu",
        amount: "Rp 85.000",
        avatar: "AW",
    },
    {
        id: 4,
        name: "Dr. Sarah",
        status: "1 jam yang lalu",
        amount: "Rp 3.500.000",
        avatar: "DS",
    },
    {
        id: 5,
        name: "Rina Melati",
        status: "2 jam yang lalu",
        amount: "Rp 120.000",
        avatar: "RM",
    },
    {
        id: 6,
        name: "Hendra Kusuma",
        status: "3 jam yang lalu",
        amount: "Rp 450.000",
        avatar: "HK",
    },
];

const criticalStocks = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        type: "Obat Bebas",
        sisa: 0,
        critical: true,
    },
    {
        id: 2,
        name: "Amoxicillin 250mg",
        type: "Antibiotik",
        sisa: 5,
        critical: false,
    },
    {
        id: 3,
        name: "Syrup OBH Combi",
        type: "Obat Batuk",
        sisa: 2,
        critical: true,
    },
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

export default function PharmacistDashboardPage() {
    return (
        <DashboardApotekLayout activeMenu="Dasbor Utama">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Ikhtisar Apotek
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Pantau performa dan inventori secara real-time.
                        </p>
                    </div>

                    <Select defaultValue="30days">
                        <SelectTrigger className="w-[190px] h-10 rounded-xl bg-white border-slate-200 text-slate-600 focus:ring-[#0b3b60]">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <SelectValue placeholder="Pilih Periode" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="week">Minggu Ini</SelectItem>
                            <SelectItem value="30days">
                                Terakhir 30 Hari
                            </SelectItem>
                            <SelectItem value="month">Bulan Ini</SelectItem>
                            <SelectItem value="year">Tahun Ini</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.div
                            variants={itemVariants}
                            className="group cursor-default"
                        >
                            <Card className="border border-white/40 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-slate-100/80 w-10 h-10 flex items-center justify-center rounded-xl text-slate-600">
                                            <ShoppingCart className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Total Order
                                            </p>
                                            <h3 className="text-3xl font-extrabold text-slate-800">
                                                1,284
                                            </h3>
                                        </div>
                                        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />{" "}
                                            +12% dari bulan lalu
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="border border-white/40 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-slate-100/80 w-10 h-10 flex items-center justify-center rounded-xl text-slate-600">
                                            <Pill className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Total Obat
                                            </p>
                                            <h3 className="text-3xl font-extrabold text-slate-800">
                                                452
                                            </h3>
                                        </div>
                                        <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                                            <PackageX className="h-3 w-3" /> 12
                                            stok menipis
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="border border-white/40 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 rounded-2xl">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-orange-50 w-10 h-10 flex items-center justify-center rounded-xl text-orange-500">
                                            <ClipboardList className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                Antrean Resep
                                            </p>
                                            <h3 className="text-3xl font-extrabold text-slate-800">
                                                24
                                            </h3>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">
                                            Butuh verifikasi Apoteker
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="bg-gradient-to-br from-[#0b3b60] to-[#082a45] text-white shadow-xl shadow-[#0b3b60]/20 hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl overflow-hidden relative">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                                <CardContent className="p-6 relative z-10">
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-white/10 w-10 h-10 flex items-center justify-center rounded-xl text-blue-100">
                                            <Wallet className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                                                Total Revenue
                                            </p>
                                            <h3 className="text-3xl font-extrabold text-white">
                                                Rp 458M
                                            </h3>
                                        </div>
                                        <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />{" "}
                                            Ekspektasi tercapai
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2"
                        >
                            <Card className="border-0 shadow-sm rounded-3xl bg-white h-full">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-8">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-800">
                                            Performa Pendapatan
                                        </CardTitle>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Analisis pendapatan dan volume
                                            pesanan harian
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
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
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
                                                        boxShadow:
                                                            "0 4px 6px -1px rgb(0 0 0 / 0.1)",
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

                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-sm rounded-3xl bg-white h-full flex flex-col">
                                <CardHeader className="pb-4 pt-6 px-8 border-b border-slate-50">
                                    <CardTitle className="text-lg font-bold text-slate-800">
                                        User Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 p-0">
                                    <ScrollArea className="h-[260px] w-full px-6 pt-4">
                                        <div className="space-y-6">
                                            {userActivities.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border-2 border-slate-50 group-hover:border-blue-100 transition-colors">
                                                            <AvatarImage
                                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}&backgroundColor=e2e8f0`}
                                                            />
                                                            <AvatarFallback className="bg-[#0b3b60] text-white text-xs font-bold">
                                                                {user.avatar}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-[10px] font-medium text-slate-400">
                                                                {user.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                                            Total Beli
                                                        </p>
                                                        <p className="text-sm font-bold text-[#0b3b60]">
                                                            {user.amount}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                                <div className="border-t border-slate-50 text-center">
                                    <ActivityDialog
                                        activities={userActivities}
                                    />
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-sm rounded-3xl bg-white h-full relative overflow-hidden flex flex-col">
                                <div className="absolute -right-16 -top-16 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                                <CardHeader className="pb-4 pt-6 px-8 relative z-10">
                                    <CardTitle className="text-lg font-bold text-slate-800">
                                        Stok Kritis
                                    </CardTitle>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Segera lakukan re-stock untuk item
                                        berikut
                                    </p>
                                </CardHeader>
                                <CardContent className="px-8 pb-4 relative z-10 flex-1">
                                    <div className="space-y-4">
                                        {criticalStocks.map((stock) => (
                                            <div
                                                key={stock.id}
                                                className="flex flex-col gap-1 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {stock.critical ? (
                                                        <span className="relative flex h-2.5 w-2.5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                                                        </span>
                                                    ) : (
                                                        <span className="relative flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                                                    )}
                                                    <p className="text-sm font-bold text-[#0b3b60] flex-1">
                                                        {stock.name}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] uppercase font-bold border-0 ${stock.critical ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}
                                                    >
                                                        Sisa: {stock.sisa}
                                                    </Badge>
                                                </div>
                                                <p className="text-[11px] text-slate-400 ml-5">
                                                    {stock.type} • System
                                                    Automation
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <StockDialog stocks={criticalStocks} />
                            </Card>
                        </motion.div>

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
                                        <PopoverContent
                                            className="w-44 rounded-xl p-2"
                                            align="end"
                                        >
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
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
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
                                                        boxShadow:
                                                            "0 4px 6px -1px rgb(0 0 0 / 0.1)",
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
                    </div>
                </motion.div>
            </div>
        </DashboardApotekLayout>
    );
}
