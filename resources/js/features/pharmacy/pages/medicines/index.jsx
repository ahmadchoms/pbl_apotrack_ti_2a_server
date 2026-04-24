import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, X } from "lucide-react";
import { router } from "@inertiajs/react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { MedicineFilters } from "@/features/pharmacy/components/medicine/MedicineFilters";
import { MedicineCard } from "@/features/pharmacy/components/medicine/MedicineCard";
import { MedicineDetailModal } from "@/features/pharmacy/components/medicine/MedicineDetailModal";
import { Pagination } from "@/components/ui/pagination";

export default function PharmacistMedicineCatalog({
    medicines = { data: [], links: [] },
    categories = [],
    filters = {},
}) {
    // Ensure medicines is not null
    const safeMedicines = medicines || { data: [], links: [] };
    const [search, setSearch] = useState(
        typeof filters?.search === "string" ? filters.search : "",
    );
    const [activeFilter, setActiveFilter] = useState(
        typeof filters?.status === "string" ? filters.status : "all",
    );
    const [selectedCategory, setSelectedCategory] = useState(
        typeof filters?.category === "string" ? filters.category : null,
    );
    const [detailMedicine, setDetailMedicine] = useState(null);

    // Sync with server-side filters
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
            search: search,
            category: selectedCategory,
            status: activeFilter,
            ...newFilters,
        };

        // Remove empty values
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
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const medicineData = safeMedicines.data || [];
    const allCategories = categories || [];

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Obat">
            <div className="max-w-350 mx-auto h-full flex flex-col">
                <MedicineFilters
                    search={search}
                    setSearch={setSearch}
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
                    lowStockCount={0} // Server-side count could be added later
                    expiringCount={0}
                    allCategories={(allCategories || []).map(
                        (c) => c?.name || c,
                    )}
                />

                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-slate-400 font-semibold">
                        Menampilkan{" "}
                        <span className="text-slate-700 font-black">
                            {safeMedicines.from || 0} - {safeMedicines.to || 0}
                        </span>{" "}
                        dari {safeMedicines.total || 0} obat
                    </p>
                    {(search || selectedCategory || activeFilter !== "all") && (
                        <button
                            onClick={handleReset}
                            className="text-[10px] font-bold text-[#00346C] hover:underline flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Reset Filter
                        </button>
                    )}
                </div>

                <ScrollArea className="flex-1 -mr-4 pr-4">
                    <AnimatePresence mode="popLayout">
                        {medicineData.length === 0 ? (
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
                            <>
                                <motion.div
                                    key="grid"
                                    className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8"
                                >
                                    {medicineData.map((medicine, index) => (
                                        <MedicineCard
                                            key={medicine.id}
                                            medicine={medicine}
                                            index={index}
                                            onView={setDetailMedicine}
                                        />
                                    ))}
                                </motion.div>
                                <Pagination links={safeMedicines.links} />
                            </>
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
