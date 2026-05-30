import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Scan, ShoppingCart, X } from "lucide-react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { useCart } from "@/features/pharmacy/hooks/useCart";
import { OrderCatalog } from "@/features/pharmacy/components/orders/OrderCatalog";
import { OrderCart } from "@/features/pharmacy/components/orders/OrderCart";
import { Link } from "@inertiajs/react";

function getUniqueMedicines(list) {
    const seen = new Set();
    return list.filter((m) => {
        if (!m.is_active) return false;
        if (seen.has(m.name)) return false;
        seen.add(m.name);
        return true;
    });
}

export default function PharmacistPOS({ medicines }) {
    const uniqueMedicines = useMemo(
        () => getUniqueMedicines(medicines.data),
        [medicines],
    );

    const {
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        resetCart,
        totalCartItems,
    } = useCart();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [mobileCartOpen, setMobileCartOpen] = useState(false);

    const filteredDrugs = useMemo(() => {
        let list = uniqueMedicines;
        if (selectedCategory !== "Semua") {
            list = list.filter((m) => m.category === selectedCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.generic_name?.toLowerCase().includes(q) ||
                    m.category?.toLowerCase().includes(q) ||
                    m.manufacturer?.toLowerCase().includes(q),
            );
        }
        return list;
    }, [uniqueMedicines, selectedCategory, searchQuery]);

    return (
        <DashboardPharmacyLayout activeMenu="orders.pos">
            <div className="max-w-screen-2xl mx-auto h-[calc(100vh-100px)] flex flex-col overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mb-6 flex items-center justify-between shrink-0"
                >
                    <div className="w-full flex items-center gap-4">
                        <Link
                            href={route("pharmacy.orders.index")}
                            className="w-11 h-11 rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,23,42,0.01)] border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-primary transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>

                        <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                            <Scan className="w-5 h-5 stroke-[2.2]" />
                        </div>

                        <div className="flex justify-between items-center w-full">
                            <div className="space-y-0.5">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                                    Point of Sale
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-medium text-slate-400">
                                        Sistem Kasir Manual
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[11px] font-semibold text-slate-500">
                                    {uniqueMedicines.length} Obat Siap Jual
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => setMobileCartOpen(true)}
                            className="lg:hidden relative w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 flex items-center justify-center transition-all active:scale-[0.97]"
                        >
                            <ShoppingCart className="w-4.5 h-4.5 stroke-[2.2]" />
                            {totalCartItems > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-md bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs font-mono">
                                    {totalCartItems}
                                </span>
                            )}
                        </button>
                    </div>
                </motion.div>

                <div className="flex-1 min-h-0 pb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, delay: 0.05 }}
                            className="h-full flex flex-col min-h-0"
                        >
                            <div className="flex-1 min-h-0 flex flex-col">
                                <OrderCatalog
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    filteredDrugs={filteredDrugs}
                                    addToCart={addToCart}
                                    cart={cart}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, delay: 0.1 }}
                            className="hidden lg:flex flex-col h-full min-h-0"
                        >
                            <div className="flex-1 min-h-0 flex flex-col">
                                <OrderCart
                                    cart={cart}
                                    updateQty={updateQty}
                                    removeFromCart={removeFromCart}
                                    onReset={resetCart}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileCartOpen && (
                    <div className="lg:hidden fixed inset-0 z-50 flex items-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setMobileCartOpen(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{
                                type: "spring",
                                damping: 28,
                                stiffness: 300,
                            }}
                            className="relative w-full h-[85vh] bg-white rounded-t-3xl overflow-hidden flex flex-col shadow-2xl z-10"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                                <h3 className="text-base font-black text-slate-900">
                                    Keranjang Transaksi
                                </h3>
                                <button
                                    onClick={() => setMobileCartOpen(false)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                                <OrderCart
                                    cart={cart}
                                    updateQty={updateQty}
                                    removeFromCart={removeFromCart}
                                    onReset={resetCart}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardPharmacyLayout>
    );
}
