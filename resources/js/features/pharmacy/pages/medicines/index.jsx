import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, X, Plus, Filter, Search, Info } from "lucide-react";
import { router, Link } from "@inertiajs/react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { MedicineFilters } from "@/features/pharmacy/components/medicine/MedicineFilters";
import { MedicineTable } from "@/features/pharmacy/components/medicine/MedicineTable";
import { MedicineDetailModal } from "@/features/pharmacy/components/medicine/MedicineDetailModal";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

export default function PharmacistMedicineCatalog({
    medicines = { data: [], links: [], meta: {} },
    categories = [],
    filters = {},
}) {
    const safeMedicines = medicines || { data: [], links: [], meta: {} };
    const [search, setSearch] = useState(filters?.search || "");
    const [activeFilter, setActiveFilter] = useState(filters?.status || "all");
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || null,
    );
    const [detailMedicine, setDetailMedicine] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || "")) {
                handleFilterChange({ search });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (newFilters) => {
        const params = {
            search,
            category: selectedCategory,
            status: activeFilter,
            ...newFilters,
        };

        Object.keys(params).forEach(
            (key) =>
                (params[key] == null ||
                    params[key] === "" ||
                    params[key] === "all") &&
                delete params[key],
        );

        router.get("/pharmacy/medicines", params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        setSelectedCategory(null);
        setActiveFilter("all");
        router.get(
            "/pharmacy/medicines",
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Obat">
            <div className="max-w-350 mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-[#00346C] text-white text-[10px] font-black uppercase tracking-widest border border-blue-900 shadow-sm">
                                Inventory Control
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            Katalog Inventori
                        </h2>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wide">
                            Kelola data master obat dan pergerakan stok apotek.
                        </p>
                    </div>

                    <div className="flex justify-center items-center gap-2">
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
                        <Link href={route("pharmacy.medicines.create")}>
                            <Button className="py-5 px-8 rounded-2xl bg-linear-to-r from-[#00346C] to-[#0055a5] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 group">
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Tambah Obat Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                <MedicineFilters
                    activeFilter={activeFilter}
                    setActiveFilter={(f) => {
                        setActiveFilter(f);
                        handleFilterChange({ status: f });
                    }}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={(c) => {
                        setSelectedCategory(c);
                        handleFilterChange({ category: c });
                    }}
                    allCategories={(categories || []).map((c) => c?.name || c)}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-[#00346C]" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Menampilkan{" "}
                                <span className="text-slate-800">
                                    {safeMedicines.data.length || 0}
                                </span>{" "}
                                dari{" "}
                                <span className="text-slate-800">
                                    {safeMedicines.total || 0}
                                </span>{" "}
                                obat
                            </p>
                        </div>
                        {(search ||
                            selectedCategory ||
                            activeFilter !== "all") && (
                            <button
                                onClick={handleReset}
                                className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-2 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Bersihkan Filter
                            </button>
                        )}
                    </div>

                    <MedicineTable
                        medicines={safeMedicines.data || []}
                        onView={setDetailMedicine}
                    />

                    {safeMedicines.meta?.links && (
                        <div className="mt-8">
                            <Pagination links={safeMedicines.meta.links} />
                        </div>
                    )}
                </div>
            </div>

            <MedicineDetailModal
                medicine={detailMedicine}
                open={!!detailMedicine}
                onClose={() => setDetailMedicine(null)}
            />
        </DashboardPharmacyLayout>
    );
}
