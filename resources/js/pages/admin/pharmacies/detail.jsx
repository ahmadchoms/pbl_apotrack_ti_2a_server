import React from "react";
import { motion } from "framer-motion";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Phone,
    Award,
    Calendar,
    Star,
    Clock,
    ExternalLink,
    ChevronLeft,
    Trash2,
    Edit3,
    ShieldCheck,
    User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { router } from "@inertiajs/react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
};

export default function PharmacyDetail({ pharmacy, pharmacist, stats }) {
    return (
        <DashboardAdminLayout activeMenu="pharmacies">
            <div className="space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            {pharmacy.name}
                        </h1>
                        <Badge className="bg-emerald-100 text-emerald-600 border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest gap-1.5 flex">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {pharmacy.verification_status}
                        </Badge>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    <motion.div variants={itemVariants}>
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white group hover:scale-[1.02] transition-transform">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-[#0b3b60] shrink-0">
                                    <Calendar className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Bergabung Sejak
                                    </p>
                                    <p className="text-lg font-black text-[#0b3b60]">
                                        {stats.joined_at}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white group hover:scale-[1.02] transition-transform">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                                    <Star className="w-7 h-7 fill-amber-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Kepuasan Pasien
                                    </p>
                                    <p className="text-lg font-black text-[#0b3b60]">
                                        {pharmacy.rating}{" "}
                                        <span className="text-sm text-slate-400 ml-1">
                                            ({pharmacy.total_reviews}rb ulasan)
                                        </span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white group hover:scale-[1.02] transition-transform">
                            <CardContent className="p-8 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                                    <Clock className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        Order Bulan Ini
                                    </p>
                                    <p className="text-lg font-black text-[#0b3b60]">
                                        {stats.total_orders} pesanan
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#0b3b60] flex items-center justify-center text-white shadow-lg shadow-[#0b3b60]/20">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    Detail Administrasi
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <Card className="rounded-[2rem] border-0 shadow-xl shadow-slate-200/30 bg-white p-2">
                                    <CardContent className="p-6 flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                                                Alamat Lengkap
                                            </p>
                                            <p className="text-sm font-bold text-slate-600 leading-relaxed max-w-md">
                                                {pharmacy.address}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-[2rem] border-0 shadow-xl shadow-slate-200/30 bg-white p-2">
                                    <CardContent className="p-6 flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                                                Nomor Telepon
                                            </p>
                                            <p className="text-sm font-black text-slate-900 tracking-wider">
                                                {pharmacy.phone}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-[2rem] border-0 shadow-xl shadow-slate-200/30 bg-white p-2">
                                    <CardContent className="p-6 flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                                                    Nomor Lisensi (SIA)
                                                </p>
                                                <p className="text-sm font-black text-slate-900 tracking-wider">
                                                    {
                                                        pharmacy.legality
                                                            ?.sia_number
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="text-[#0b3b60] font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-blue-50 px-6 h-12 rounded-2xl"
                                        >
                                            Lihat SIA
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#0b3b60] flex items-center justify-center text-white shadow-lg shadow-[#0b3b60]/20">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                        Daftar Staf Aktif
                                    </h3>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-[#0b3b60] font-black text-[10px] uppercase tracking-widest px-0"
                                >
                                    Kelola Semua
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pharmacy.staffs.map((staff) => (
                                    <Card
                                        key={staff.id}
                                        className="rounded-[2rem] border-0 shadow-xl shadow-slate-200/30 bg-white overflow-hidden group hover:scale-[1.03] transition-all"
                                    >
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-lg">
                                                <AvatarImage
                                                    src={staff.user.avatar_url}
                                                />
                                                <AvatarFallback className="bg-slate-50 text-slate-300 font-black">
                                                    {staff.user.username
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0b3b60] transition-colors">
                                                    {staff.user.username}
                                                </h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {staff.role === "APOTEKER"
                                                        ? "Apoteker Utama"
                                                        : "Staf Inventaris"}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-10">
                        <section className="space-y-6">
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-8 pb-4">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                                            Penanggung Jawab Utama
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-14 w-14 rounded-2xl border-2 border-slate-50">
                                                <AvatarImage
                                                    src={pharmacist?.avatar}
                                                />
                                                <AvatarFallback className="bg-[#0b3b60] text-white font-black">
                                                    {pharmacist?.name
                                                        .substring(0, 2)
                                                        .toUpperCase() || "AS"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="text-sm font-black text-[#0b3b60]">
                                                    Apt.{" "}
                                                    {pharmacist?.name ||
                                                        "Andi Saputra"}
                                                </h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    SIPA: {pharmacist?.sipa}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 pt-0 mt-4 border-t border-slate-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                                                Lokasi Presisi
                                            </p>
                                            <button className="text-[10px] font-black text-[#0b3b60] flex items-center gap-1.5 hover:underline">
                                                Maps{" "}
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="h-48 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden relative group">
                                            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s-l+0b3b60(${pharmacy.longitude},${pharmacy.latitude})/${pharmacy.longitude},${pharmacy.latitude},15,0/400x300?access_token=pk.eyJ1IjoiZGVlcG1pbmQiLCJhIjoiY2sxZXB4')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 to-transparent pointer-events-none" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <div className="pt-10 space-y-4">
                            <Button
                                onClick={() => router.get("/admin/pharmacies")}
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Kembali ke Daftar
                            </Button>
                            <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                                <Edit3 className="w-4 h-4" />
                                Edit Data Apotek
                            </Button>
                            <button className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-rose-600 flex items-center justify-center gap-2 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                Hapus Apotek dari Sistem
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardAdminLayout>
    );
}
