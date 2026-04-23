import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Search,
    PlusCircle,
    MoreVertical,
    Pencil,
    Trash2,
    Eye,
    SlidersHorizontal,
    CheckCircle2,
    AlertTriangle,
    Package,
    ShieldCheck,
    FlaskConical,
    Factory,
    Tag,
    CalendarClock,
    Hash,
    Info,
    Layers,
    X,
} from "lucide-react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { formatRupiah } from "@/lib/utils";
import { medicines } from "@/data/medicines";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Link, router } from "@inertiajs/react";
import { Separator } from "@/components/ui/separator";

const CATEGORY_COLORS = {
    Antibiotik: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        dot: "bg-red-500",
    },
    Analgesik: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        dot: "bg-orange-500",
    },
    Antipiretik: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        dot: "bg-amber-500",
    },
    "Antasida & GERD": {
        bg: "bg-lime-50",
        text: "text-lime-700",
        border: "border-lime-200",
        dot: "bg-lime-500",
    },
    "Vitamin & Suplemen": {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
    },
    "P3K & Antiseptik": {
        bg: "bg-sky-50",
        text: "text-sky-600",
        border: "border-sky-200",
        dot: "bg-sky-500",
    },
};

const DEFAULT_COLOR = {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
};

const TYPE_CONFIG = {
    "Obat Keras": {
        badge: "bg-red-50 text-red-600 border-red-200",
        icon: ShieldCheck,
    },
    "Obat Bebas": {
        badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
        icon: CheckCircle2,
    },
    "Obat Terbatas": {
        badge: "bg-amber-50 text-amber-600 border-amber-200",
        icon: AlertTriangle,
    },
};

const LOW_STOCK_THRESHOLD = 10;
const EXPIRY_WARN_DAYS = 90;

function getDaysUntilExpiry(dateStr) {
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStockStatus(medicine) {
    const stock = medicine.total_active_stock;
    if (stock === 0) return "empty";
    if (stock <= LOW_STOCK_THRESHOLD) return "low";
    return "ok";
}

function getExpiryWarning(medicine) {
    for (const batch of medicine.batches ?? []) {
        const days = getDaysUntilExpiry(batch.expired_date);
        if (days <= EXPIRY_WARN_DAYS) return days;
    }
    return null;
}

function CategoryBadge({ category }) {
    const c = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {category}
        </span>
    );
}

function StockBadge({ stock }) {
    const status =
        stock === 0 ? "empty" : stock <= LOW_STOCK_THRESHOLD ? "low" : "ok";
    if (status === "ok") return null;
    return (
        <span
            className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border ${status === "empty" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}
        >
            <AlertTriangle className="w-2.5 h-2.5" />
            {status === "empty" ? "Habis" : "Hampir Habis"}
        </span>
    );
}

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.055,
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

function MedicineDetailModal({ medicine, open, onClose }) {
    if (!medicine) return null;
    const typeConfig = TYPE_CONFIG[medicine.type] ?? TYPE_CONFIG["Obat Bebas"];
    const catColor = CATEGORY_COLORS[medicine.category] ?? DEFAULT_COLOR;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-3xl border-slate-200 p-0 overflow-hidden shadow-2xl">
                <div className="relative h-52 bg-linear-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {medicine.images?.[0]?.image_url ? (
                        <img
                            src={medicine.images[0].image_url}
                            alt={medicine.name}
                            className="w-full h-full object-cover opacity-80"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-slate-300" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                        <CategoryBadge category={medicine.category} />
                        <h2 className="text-xl font-black text-white mt-1.5 leading-tight drop-shadow">
                            {medicine.name}
                        </h2>
                        <p className="text-xs text-white/70 font-medium mt-0.5">
                            {medicine.generic_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-[#00346C]">
                            {formatRupiah(medicine.price)}
                        </p>
                        <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${typeConfig.badge}`}
                        >
                            <typeConfig.icon className="w-3 h-3" />
                            {medicine.type}
                        </span>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {
                                icon: FlaskConical,
                                label: "Bentuk",
                                value: medicine.form,
                            },
                            {
                                icon: Layers,
                                label: "Satuan",
                                value: medicine.unit,
                            },
                            {
                                icon: Factory,
                                label: "Produsen",
                                value: medicine.manufacturer,
                            },
                            {
                                icon: Tag,
                                label: "Kategori",
                                value: medicine.category,
                            },
                        ].map(({ icon: Icon, label, value }) => (
                            <div
                                key={label}
                                className="bg-slate-50 rounded-2xl px-3.5 py-3 flex items-start gap-2.5"
                            >
                                <div className="w-7 h-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                        {label}
                                    </p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {medicine.description && (
                        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl px-4 py-3.5 flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-1">
                                    Deskripsi
                                </p>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    {medicine.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {medicine.dosage_info && (
                        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-2.5">
                            <Hash className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mb-1">
                                    Dosis
                                </p>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    {medicine.dosage_info}
                                </p>
                            </div>
                        </div>
                    )}

                    <Separator className="bg-slate-100" />

                    <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                            <span className="inline-block w-3 h-px bg-slate-300" />
                            Stok & Batch
                        </p>
                        <div className="space-y-2">
                            {medicine.batches?.map((batch) => {
                                const days = getDaysUntilExpiry(
                                    batch.expired_date,
                                );
                                const expiring = days <= EXPIRY_WARN_DAYS;
                                return (
                                    <div
                                        key={batch.id}
                                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl border ${expiring ? "bg-amber-50/60 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                                    >
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 font-mono">
                                                {batch.batch_number}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <CalendarClock
                                                    className={`w-3 h-3 ${expiring ? "text-amber-500" : "text-slate-400"}`}
                                                />
                                                <p
                                                    className={`text-[10px] font-semibold ${expiring ? "text-amber-600" : "text-slate-400"}`}
                                                >
                                                    Exp:{" "}
                                                    {new Date(
                                                        batch.expired_date,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                    {expiring && (
                                                        <span className="ml-1 font-black">
                                                            ({days} hari)
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`text-sm font-black tabular-nums ${batch.stock <= LOW_STOCK_THRESHOLD ? "text-red-500" : "text-[#00346C]"}`}
                                            >
                                                {batch.stock}
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
                                                unit
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <Button
                            onClick={() =>
                                router.push(`/pharmacy/medicine/${medicine.id}`)
                            }
                            className="flex-1 bg-linear-to-r from-[#00346C] to-[#0055a5] hover:from-[#002a58] hover:to-[#00469a] text-white h-11 rounded-xl font-bold text-sm shadow-md shadow-[#00346C]/20"
                        >
                            <Pencil className="mr-2 w-4 h-4" />
                            Edit Obat
                        </Button>
                        <Button
                            variant="outline"
                            className="h-11 rounded-xl border-red-200 text-red-500 hover:bg-red-50 px-4"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MedicineCard({ medicine, index, onView }) {
    const primaryImage =
        medicine.images?.find((img) => img.is_primary) ?? medicine.images?.[0];
    const stockStatus = getStockStatus(medicine);
    const expiryDays = getExpiryWarning(medicine);
    const typeConfig = TYPE_CONFIG[medicine.type] ?? TYPE_CONFIG["Obat Bebas"];
    const catColor = CATEGORY_COLORS[medicine.category] ?? DEFAULT_COLOR;

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden group flex flex-col"
        >
            <div className="relative aspect-4/3 bg-linear-to-br from-slate-100 to-slate-150 overflow-hidden">
                {primaryImage?.image_url ? (
                    <img
                        src={primaryImage.image_url}
                        alt={medicine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                        }}
                    />
                ) : null}
                <div className="absolute inset-0 items-center justify-center hidden">
                    <Package className="w-12 h-12 text-slate-300" />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 left-3">
                    <CategoryBadge category={medicine.category} />
                </div>

                <div className="absolute top-2.5 right-2.5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-7 h-7 rounded-lg bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors">
                                <MoreVertical className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl"
                        >
                            <DropdownMenuItem
                                className="text-xs font-semibold rounded-lg cursor-pointer"
                                onClick={() => onView(medicine)}
                            >
                                <Eye className="mr-2 w-3.5 h-3.5" />
                                Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.push(
                                        `/pharmacy/medicine/${medicine.id}`,
                                    )
                                }
                                className="text-xs font-semibold rounded-lg cursor-pointer"
                            >
                                <Pencil className="mr-2 w-3.5 h-3.5" />
                                Edit Obat
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-semibold text-red-500 focus:text-red-600 rounded-lg cursor-pointer">
                                <Trash2 className="mr-2 w-3.5 h-3.5" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {(stockStatus !== "ok" || expiryDays !== null) && (
                    <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                        {stockStatus === "empty" && (
                            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-500 text-white shadow">
                                Stok Habis
                            </span>
                        )}
                        {stockStatus === "low" && (
                            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500 text-white shadow">
                                Hampir Habis
                            </span>
                        )}
                        {expiryDays !== null && (
                            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-500 text-white shadow">
                                Exp {expiryDays}h
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start gap-1.5 mb-1">
                    <h3 className="text-sm font-black text-slate-900 leading-snug flex-1">
                        {medicine.name}
                    </h3>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mb-3">
                    {medicine.form} · {medicine.unit}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">
                            Stok
                        </p>
                        <p
                            className={`text-sm font-black tabular-nums ${stockStatus === "ok" ? "text-[#00346C]" : stockStatus === "low" ? "text-amber-600" : "text-red-500"}`}
                        >
                            {medicine.total_active_stock}{" "}
                            <span className="text-xs font-semibold text-slate-400">
                                Unit
                            </span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">
                            Harga
                        </p>
                        <p className="text-sm font-black text-[#00346C] tabular-nums">
                            {formatRupiah(medicine.price)}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => onView(medicine)}
                    className="mt-3 w-full h-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#00346C] hover:border-[#00346C] hover:text-white text-slate-500 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                    <Eye className="w-3 h-3" />
                    Lihat Detail
                </button>
            </div>
        </motion.div>
    );
}

const FILTER_TABS = [
    { key: "all", label: "Stok Tersedia" },
    { key: "low", label: "Hampir Habis" },
    { key: "expiring", label: "Kedaluwarsa Segera" },
    { key: "keras", label: "Obat Keras" },
];

const ALL_CATEGORIES = [...new Set(medicines.map((m) => m.category))];

export default function MedicineCatalogPage() {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [detailMedicine, setDetailMedicine] = useState(null);

    const uniqueMedicines = useMemo(() => {
        const seen = new Set();
        return medicines.filter((m) => {
            if (seen.has(m.name)) return false;
            seen.add(m.name);
            return true;
        });
    }, []);

    const filtered = useMemo(() => {
        let list = uniqueMedicines;
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.category.toLowerCase().includes(q) ||
                    m.generic_name?.toLowerCase().includes(q),
            );
        }
        if (selectedCategory) {
            list = list.filter((m) => m.category === selectedCategory);
        }
        if (activeFilter === "low")
            list = list.filter(
                (m) =>
                    getStockStatus(m) === "low" ||
                    getStockStatus(m) === "empty",
            );
        if (activeFilter === "expiring")
            list = list.filter((m) => getExpiryWarning(m) !== null);
        if (activeFilter === "keras")
            list = list.filter((m) => m.type === "Obat Keras");
        return list;
    }, [uniqueMedicines, search, activeFilter, selectedCategory]);

    const lowStockCount = uniqueMedicines.filter(
        (m) => getStockStatus(m) !== "ok",
    ).length;
    const expiringCount = uniqueMedicines.filter(
        (m) => getExpiryWarning(m) !== null,
    ).length;

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Obat">
            <div className="max-w-350 mx-auto h-full flex flex-col">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">
                            Inventaris Medis
                        </p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Katalog Obat
                        </h2>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <InputGroup className="rounded-xl min-w-60">
                            <InputGroupInput
                                placeholder="Cari nama obat, kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 text-sm"
                            />
                            <InputGroupAddon>
                                <Search className="w-4 h-4 text-slate-400" />
                            </InputGroupAddon>
                        </InputGroup>
                        <Link
                            href="/pharmacy/medicines/create"
                            className="inline-flex items-center gap-2 bg-linear-to-r from-[#00346C] to-[#0055a5] text-white px-4 h-10 rounded-xl font-bold text-xs shadow-md shadow-[#00346C]/25 hover:from-[#002a58] hover:to-[#00469a] transition-all whitespace-nowrap"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Tambah Obat
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 shadow-sm transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    {FILTER_TABS.map((tab) => {
                        const isActive = activeFilter === tab.key;
                        const count =
                            tab.key === "low"
                                ? lowStockCount
                                : tab.key === "expiring"
                                  ? expiringCount
                                  : null;
                        return (
                            <motion.button
                                key={tab.key}
                                onClick={() => setActiveFilter(tab.key)}
                                whileTap={{ scale: 0.96 }}
                                className={`inline-flex items-center gap-2 h-9 px-4 rounded-full text-xs font-bold border transition-all duration-200 ${
                                    isActive
                                        ? "bg-[#00346C] text-white border-[#00346C] shadow-md shadow-[#00346C]/20"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                {tab.label}
                                {isActive && (
                                    <CheckCircle2 className="w-3.5 h-3.5 opacity-80" />
                                )}
                                {count !== null && count > 0 && (
                                    <span
                                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-600"}`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    <div className="flex items-center gap-2 flex-wrap">
                        {ALL_CATEGORIES.map((cat) => {
                            const c = CATEGORY_COLORS[cat] ?? DEFAULT_COLOR;
                            const isActive = selectedCategory === cat;
                            return (
                                <motion.button
                                    key={cat}
                                    onClick={() =>
                                        setSelectedCategory(
                                            isActive ? null : cat,
                                        )
                                    }
                                    whileTap={{ scale: 0.96 }}
                                    className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[10px] font-bold border transition-all duration-200 ${
                                        isActive
                                            ? `${c.bg} ${c.text} ${c.border} shadow-sm`
                                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    {isActive && (
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${c.dot}`}
                                        />
                                    )}
                                    {cat}
                                    {isActive && (
                                        <X className="w-3 h-3 ml-0.5 opacity-60" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-slate-400 font-semibold">
                        Menampilkan{" "}
                        <span className="text-slate-700 font-black">
                            {filtered.length}
                        </span>{" "}
                        dari {uniqueMedicines.length} obat
                    </p>
                    {(search || selectedCategory || activeFilter !== "all") && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setSelectedCategory(null);
                                setActiveFilter("all");
                            }}
                            className="text-[10px] font-bold text-[#00346C] hover:underline flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Reset Filter
                        </button>
                    )}
                </div>

                <ScrollArea className="flex-1 -mr-4 pr-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-24 text-slate-400"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                    <Package className="w-7 h-7 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">
                                    Tidak ada obat ditemukan
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Coba ubah filter atau kata kunci pencarian
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-8"
                            >
                                {filtered.map((medicine, index) => (
                                    <MedicineCard
                                        key={medicine.id}
                                        medicine={medicine}
                                        index={index}
                                        onView={setDetailMedicine}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ScrollArea>
            </div>

            <MedicineDetailModal
                medicine={detailMedicine}
                open={!!detailMedicine}
                onClose={() => setDetailMedicine(null)}
            />
        </DashboardPharmacyLayout>
    );
}
