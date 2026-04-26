import React from "react";
import { motion } from "framer-motion";
import {
    Search,
    PlusCircle,
    SlidersHorizontal,
    CheckCircle2,
    X,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    FILTER_TABS,
    CATEGORY_COLORS,
    DEFAULT_COLOR,
} from "@/features/pharmacy/lib/constants";

export function MedicineFilters({
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    selectedCategory,
    setSelectedCategory,
    lowStockCount,
    expiringCount,
    allCategories,
}) {
    return (
        <div className="flex flex-col gap-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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
                        href={route("pharmacy.medicines.create")}
                        className="inline-flex items-center gap-2 bg-linear-to-r from-primary to-[#0055a5] text-white px-4 h-10 rounded-xl font-bold text-xs shadow-md shadow-primary/25 hover:from-[#002a58] hover:to-[#00469a] transition-all whitespace-nowrap"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Tambah Obat
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
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
                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
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

                <div className="flex items-center gap-2 flex-wrap">
                    {(allCategories || []).map((cat) => {
                        const c = CATEGORY_COLORS[cat] ?? DEFAULT_COLOR;
                        const isActive = selectedCategory === cat;
                        return (
                            <motion.button
                                key={cat?.toLowerCase() || Math.random()}
                                onClick={() =>
                                    setSelectedCategory(isActive ? null : cat)
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
        </div>
    );
}
