import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    PackageOpen,
    ShieldAlert,
    CheckCircle2,
    Pill,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRupiah } from "@/lib/utils";

const CATEGORY_COLORS = {
    Antibiotik: {
        dot: "bg-red-500",
        pill: "bg-red-50 text-red-600 border-red-200",
    },
    Analgesik: {
        dot: "bg-orange-500",
        pill: "bg-orange-50 text-orange-600 border-orange-200",
    },
    Antipiretik: {
        dot: "bg-amber-500",
        pill: "bg-amber-50 text-amber-600 border-amber-200",
    },
    "Antasida & GERD": {
        dot: "bg-lime-500",
        pill: "bg-lime-50 text-lime-700 border-lime-200",
    },
    "Vitamin & Suplemen": {
        dot: "bg-emerald-500",
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    "P3K & Antiseptik": {
        dot: "bg-sky-500",
        pill: "bg-sky-50 text-sky-600 border-sky-200",
    },
};
const DEFAULT_COLOR = {
    dot: "bg-slate-400",
    pill: "bg-slate-50 text-slate-600 border-slate-200",
};

const TYPE_ICON = {
    "Obat Keras": { icon: ShieldAlert, cls: "text-red-500 bg-red-50" },
    "Obat Bebas": { icon: CheckCircle2, cls: "text-emerald-500 bg-emerald-50" },
    "Obat Bebas Terbatas": {
        icon: ShieldAlert,
        cls: "text-amber-500 bg-amber-50",
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.04,
            duration: 0.32,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
    exit: { opacity: 0, scale: 0.94, transition: { duration: 0.18 } },
};

function StockIndicator({ stock }) {
    if (stock === 0)
        return (
            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-500 text-white shadow-sm">
                Habis
            </span>
        );
    if (stock <= 10)
        return (
            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-400 text-white shadow-sm">
                {stock} Sisa
            </span>
        );
    return (
        <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm shadow-sm">
            {stock} Stok
        </span>
    );
}

export function OrderCatalog({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredDrugs,
    addToCart,
    cart,
}) {
    const categories = ["Semua", ...Object.keys(CATEGORY_COLORS)];

    const getCartQty = (id) => cart.find((c) => c.id === id)?.qty ?? 0;

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex flex-col gap-4 mb-5 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Cari nama obat, kategori, generik..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-2xl border-slate-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-[#00346C]/10 focus:border-[#00346C]/40 placeholder:text-slate-300"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 flex items-center justify-center text-xs font-bold transition-colors"
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        const c = CATEGORY_COLORS[cat] ?? DEFAULT_COLOR;
                        return (
                            <motion.button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                whileTap={{ scale: 0.95 }}
                                className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[11px] font-bold border whitespace-nowrap transition-all duration-200 shrink-0 ${
                                    isActive
                                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                {cat !== "Semua" && (
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : c.dot}`}
                                    />
                                )}
                                {cat}
                                {cat === "Semua" && (
                                    <span
                                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                                    >
                                        {filteredDrugs.length}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <ScrollArea className="flex-1 -mr-2 pr-2">
                <div className="grid grid-cols-2 gap-4 pb-6">
                    <AnimatePresence mode="popLayout">
                        {filteredDrugs.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50/60 rounded-3xl border-2 border-dashed border-slate-200"
                            >
                                <PackageOpen className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-sm font-bold text-slate-500">
                                    Obat Tidak Ditemukan
                                </p>
                                <p className="text-xs text-slate-400 mt-1 text-center max-w-48">
                                    Coba kata kunci atau kategori yang berbeda
                                </p>
                            </motion.div>
                        ) : (
                            filteredDrugs.map((drug, index) => {
                                const catColor =
                                    CATEGORY_COLORS[drug.category] ??
                                    DEFAULT_COLOR;
                                const typeInfo =
                                    TYPE_ICON[drug.type] ??
                                    TYPE_ICON["Obat Bebas"];
                                const TypeIcon = typeInfo.icon;
                                const isOutOfStock =
                                    drug.total_active_stock === 0;
                                const cartQty = getCartQty(drug.id);
                                const inCart = cartQty > 0;

                                return (
                                    <motion.div
                                        key={drug.id}
                                        custom={index}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className={`bg-white rounded-3xl border overflow-hidden flex flex-col group transition-all duration-300 ${
                                            inCart
                                                ? "border-[#00346C]/25 shadow-lg shadow-[#00346C]/8 ring-1 ring-[#00346C]/10"
                                                : "border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300"
                                        } ${isOutOfStock ? "opacity-60" : ""}`}
                                    >
                                        <div className="relative aspect-4/3 bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden">
                                            {drug.image_url ? (
                                                <img
                                                    src={drug.image_url}
                                                    alt={drug.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Pill className="w-10 h-10 text-slate-200" />
                                                </div>
                                            )}

                                            <div className="absolute top-2.5 left-2.5">
                                                <StockIndicator
                                                    stock={drug.total_stock}
                                                />
                                            </div>

                                            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                                                <div
                                                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${typeInfo.cls}`}
                                                >
                                                    <TypeIcon className="w-3 h-3" />
                                                </div>
                                                {drug.requires_prescription && (
                                                    <span className="text-[8px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-violet-500 text-white shadow-sm leading-none">
                                                        Resep
                                                    </span>
                                                )}
                                            </div>

                                            {inCart && (
                                                <div className="absolute inset-0 bg-[#00346C]/5" />
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="mb-3 flex-1">
                                                <div className="flex items-start justify-between gap-1 mb-1">
                                                    <span
                                                        className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${catColor.pill}`}
                                                    >
                                                        <span
                                                            className={`w-1 h-1 rounded-full ${catColor.dot}`}
                                                        />
                                                        {drug.category}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-black text-slate-900 leading-snug mt-1.5 group-hover:text-[#00346C] transition-colors">
                                                    {drug.name}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                    {drug.form} · {drug.unit}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed hidden xl:block">
                                                    {drug.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                                                <p className="text-base font-black text-slate-900 tabular-nums tracking-tight">
                                                    {formatRupiah(drug.price)}
                                                </p>
                                                {inCart ? (
                                                    <div className="flex items-center bg-[#00346C]/5 border border-[#00346C]/15 rounded-xl p-0.5">
                                                        <button
                                                            onClick={() =>
                                                                addToCart(
                                                                    drug,
                                                                    -1,
                                                                )
                                                            }
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#00346C] hover:bg-[#00346C] hover:text-white transition-all text-sm font-black"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-7 text-center text-xs font-black text-[#00346C] tabular-nums">
                                                            {cartQty}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                addToCart(
                                                                    drug,
                                                                    1,
                                                                )
                                                            }
                                                            disabled={
                                                                isOutOfStock
                                                            }
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#00346C] hover:bg-[#00346C] hover:text-white transition-all text-sm font-black disabled:opacity-40"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <motion.button
                                                        onClick={() =>
                                                            addToCart(drug, 1)
                                                        }
                                                        disabled={isOutOfStock}
                                                        whileTap={{
                                                            scale: 0.93,
                                                        }}
                                                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-[#00346C] text-white px-3.5 py-2 rounded-xl font-bold text-[11px] transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                        Tambah
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );
}
