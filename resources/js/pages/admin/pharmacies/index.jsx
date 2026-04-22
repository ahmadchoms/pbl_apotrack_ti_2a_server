import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    LayoutGrid,
    List,
    Filter,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Phone,
    Star,
    ArrowRight,
    Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { pharmaciesData } from "@/data/pharmacies";
import { STATUS_DOT, STATUS_STYLES } from "@/lib/constants";
import { getHoursSummary, getInitials, getPharmacyStatus } from "@/lib/utils";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" },
    },
};

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[status.variant]}`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[status.variant]}`}
            />
            {status.label}
        </span>
    );
}

function AdminAvatar({ name }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-blue-700">
                    {getInitials(name)}
                </span>
            </div>
            <span className="text-xs text-slate-500 truncate max-w-[120px]">
                {name}
            </span>
        </div>
    );
}

function RatingDisplay({ rating, reviewsCount }) {
    if (rating <= 0) {
        return (
            <span className="text-xs text-slate-400 italic">
                Belum ada ulasan
            </span>
        );
    }
    return (
        <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-slate-800">
                {rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">
                ({reviewsCount} ulasan)
            </span>
        </div>
    );
}

function PharmacyCard({ pharmacy, onDetail }) {
    const status = getPharmacyStatus(pharmacy);
    const hoursSummary = getHoursSummary(pharmacy.operating_hours);
    const isClosedVariant = ["closed", "force_closed", "inactive"].includes(
        status.variant,
    );

    return (
        <motion.div
            variants={itemVariants}
            layout
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
            <Card className="relative border border-slate-200/70 shadow-sm rounded-2xl overflow-hidden bg-white flex flex-col h-full">
                <CardContent className="p-5 flex flex-col flex-1 gap-0">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mb-1">
                                {pharmacy.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Phone className="w-3 h-3" />
                                {pharmacy.phone}
                            </div>
                        </div>
                        <StatusBadge status={status} />
                    </div>

                    <div className="flex items-start gap-2 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {pharmacy.address}
                        </p>
                    </div>

                    <div className="flex items-start gap-2 mb-4">
                        <Clock className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                        <div className="flex flex-col gap-0.5">
                            <span
                                className={`text-xs font-medium ${
                                    isClosedVariant
                                        ? "text-red-500"
                                        : "text-slate-700"
                                }`}
                            >
                                {status.description}
                            </span>
                            <span className="text-[11px] text-slate-400">
                                {hoursSummary}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-1" />

                    <div className="flex items-center justify-between pt-3 mb-4">
                        <RatingDisplay
                            rating={pharmacy.rating}
                            reviewsCount={pharmacy.reviews_count}
                        />
                        <AdminAvatar name={pharmacy.admin.full_name} />
                    </div>

                    <div className="mt-auto">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onDetail?.(pharmacy)}
                            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2.5 rounded-xl transition-colors duration-150"
                        >
                            Lihat Detail
                            <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPharmacyPage() {
    const [viewMode, setViewMode] = useState("grid");

    return (
        <DashboardAdminLayout>
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-[#0b3b60] uppercase tracking-widest mb-1">
                                Ekosistem Fasilitas
                            </p>
                            <h2 className="text-3xl font-extrabold text-slate-800">
                                Apotek
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Mengelola {pharmaciesData.length} fasilitas
                                farmasi aktif di seluruh jaringan.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === "grid"
                                            ? "bg-slate-100 text-[#0b3b60]"
                                            : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${
                                        viewMode === "list"
                                            ? "bg-slate-100 text-[#0b3b60]"
                                            : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>

                            <Button className="bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-xl h-11 px-6 font-bold shadow-md shadow-[#0b3b60]/20">
                                <Building2 className="mr-2 h-4 w-4" />
                                Tambah Apotek Baru
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-slate-500 mr-2">
                                <Filter className="h-4 w-4" />
                                <span className="text-sm font-semibold">
                                    Filter:
                                </span>
                            </div>
                            <Select defaultValue="semua">
                                <SelectTrigger className="w-[160px] h-9 rounded-xl bg-slate-50 border-transparent focus:ring-[#0b3b60] text-xs font-semibold text-[#0b3b60]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem
                                        value="semua"
                                        className="text-xs font-semibold"
                                    >
                                        Status: Semua
                                    </SelectItem>
                                    <SelectItem
                                        value="buka"
                                        className="text-xs font-semibold"
                                    >
                                        Buka
                                    </SelectItem>
                                    <SelectItem
                                        value="tutup"
                                        className="text-xs font-semibold"
                                    >
                                        Tutup
                                    </SelectItem>
                                    <SelectItem
                                        value="24jam"
                                        className="text-xs font-semibold"
                                    >
                                        Buka 24 Jam
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select defaultValue="semua">
                                <SelectTrigger className="w-[160px] h-9 rounded-xl bg-slate-50 border-transparent focus:ring-[#0b3b60] text-xs font-semibold text-slate-600">
                                    <SelectValue placeholder="Lokasi" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem
                                        value="semua"
                                        className="text-xs font-semibold"
                                    >
                                        Semua Lokasi
                                    </SelectItem>
                                    <SelectItem
                                        value="semarang"
                                        className="text-xs font-semibold"
                                    >
                                        Semarang
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-xs font-medium text-slate-500">
                                Menampilkan {pharmaciesData.length} fasilitas
                            </p>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0b3b60] transition-colors">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={`grid gap-5 ${
                            viewMode === "grid"
                                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                                : "grid-cols-1"
                        }`}
                    >
                        <AnimatePresence>
                            {pharmaciesData.map((pharmacy) => (
                                <PharmacyCard
                                    key={pharmacy.id}
                                    pharmacy={pharmacy}
                                    onDetail={(p) => console.log("Detail:", p)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
        </DashboardAdminLayout>
    );
}
