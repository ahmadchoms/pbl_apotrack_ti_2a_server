import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Scan, ShoppingCart, X } from "lucide-react";
import { OrderCatalog } from "../../components/orders/OrderCatalog";
import { OrderCart } from "../../components/orders/OrderCart";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";

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

    const [cart, setCart] = useState([]);
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

    const addToCart = (drug, delta = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === drug.id);
            if (existing) {
                const newQty = existing.qty + delta;
                if (newQty <= 0)
                    return prev.filter((item) => item.id !== drug.id);
                if (newQty > drug.total_active_stock) return prev;
                return prev.map((item) =>
                    item.id === drug.id ? { ...item, qty: newQty } : item,
                );
            }
            if (delta <= 0) return prev;
            return [
                ...prev,
                {
                    id: drug.id,
                    name: drug.name,
                    generic_name: drug.generic_name,
                    price: drug.price,
                    form: drug.form,
                    unit: drug.unit,
                    image_url: drug.image_url ?? null,
                    requires_prescription: drug.requires_prescription,
                    max_stock: drug.total_active_stock,
                    qty: 1,
                },
            ];
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) => {
            return prev
                .map((item) => {
                    if (item.id !== id) return item;
                    const newQty = item.qty + delta;
                    if (newQty <= 0) return null;
                    if (newQty > item.max_stock) return item;
                    return { ...item, qty: newQty };
                })
                .filter(Boolean);
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const resetCart = () => setCart([]);

    const totalCartItems = cart.reduce((a, i) => a + i.qty, 0);

    return (
        <DashboardPharmacyLayout activeMenu="orders.pos">
            <div className="max-w-screen-2xl mx-auto h-full flex flex-col">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-5 flex items-center justify-between shrink-0"
                >
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-0.5">
                            Sistem Kasir
                        </p>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-[#0055a5] flex items-center justify-center shadow-md shadow-primary/20">
                                <Scan className="w-4 h-4 text-white" />
                            </div>
                            Point of Sale
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-semibold">
                                {uniqueMedicines.length} obat tersedia
                            </span>
                        </div>

                        <button
                            onClick={() => setMobileCartOpen(true)}
                            className="lg:hidden relative w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25"
                        >
                            <ShoppingCart className="w-4.5 h-4.5" />
                            {totalCartItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow">
                                    {totalCartItems}
                                </span>
                            )}
                        </button>
                    </div>
                </motion.div>

                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="min-h-0 flex flex-col"
                    >
                        <OrderCatalog
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            filteredDrugs={filteredDrugs}
                            addToCart={addToCart}
                            cart={cart}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="hidden lg:flex flex-col min-h-0"
                    >
                        <OrderCart
                            cart={cart}
                            updateQty={updateQty}
                            removeFromCart={removeFromCart}
                            onReset={resetCart}
                        />
                    </motion.div>
                </div>
            </div>

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
                        className="relative w-full max-h-[90vh] bg-white rounded-t-3xl overflow-hidden flex flex-col shadow-2xl z-10"
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
                        <div className="flex-1 overflow-hidden flex flex-col">
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
        </DashboardPharmacyLayout>
    );
}
