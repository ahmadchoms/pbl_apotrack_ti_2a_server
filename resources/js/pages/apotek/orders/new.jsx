import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Minus,
    Trash2,
    UserPlus,
    Pill,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardApotekLayout } from "@/layouts/apotek-layout";
import {
    medicineCategories,
    medicineForms,
    medicinesData,
    medicineTypes,
    medicineUnits,
} from "@/data/medicines";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

export default function PosApotekPage() {
    const [cart, setCart] = useState([]);
    const [patientName, setPatientName] = useState("");
    const [rxNumber, setRxNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedForm, setSelectedForm] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");

    const filteredDrugs = useMemo(() => {
        return medicinesData.filter((drug) => {
            const matchesSearch = drug.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesCategory =
                !selectedCategory ||
                selectedCategory === "Semua" ||
                drug.category_id === selectedCategory;
            const matchesForm =
                !selectedForm ||
                selectedForm === "Semua" ||
                drug.form_id === selectedForm;
            const matchesType =
                !selectedType ||
                selectedType === "Semua" ||
                drug.type_id === selectedType;
            const matchesUnit =
                !selectedUnit ||
                selectedUnit === "Semua" ||
                drug.unit_id === selectedUnit;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesForm &&
                matchesType &&
                matchesUnit
            );
        });
    }, [
        searchQuery,
        selectedCategory,
        selectedForm,
        selectedType,
        selectedUnit,
    ]);

    const addToCart = (drug) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === drug.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === drug.id && item.qty < drug.stock
                        ? { ...item, qty: item.qty + 1 }
                        : item,
                );
            }
            return [...prev, { ...drug, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.qty + delta;
                    if (newQty > 0 && newQty <= item.stock) {
                        return { ...item, qty: newQty };
                    }
                }
                return item;
            }),
        );
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0;
    const total = subtotal + tax;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number);
    };

    return (
        <DashboardApotekLayout activeMenu="POS System">
            <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-8">
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="mb-8">
                        <p className="text-[10px] font-bold text-[#0b3b60] uppercase tracking-widest mb-1">
                            POS System
                        </p>
                        <h2 className="text-3xl font-extrabold text-slate-800">
                            Tambah Pesanan Baru
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 h-full">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6 flex-1"
                        >
                            <motion.div variants={itemVariants}>
                                <Card className="border-0 shadow-sm shadow-slate-200/50 rounded-3xl bg-white">
                                    <CardHeader className="px-8 border-b border-slate-50 flex flex-row items-center gap-3">
                                        <UserPlus className="h-5 w-5 text-[#0b3b60]" />
                                        <CardTitle className="text-lg font-bold text-slate-800">
                                            Informasi Pasien
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                    Nama Pasien
                                                </label>
                                                <Input
                                                    value={patientName}
                                                    onChange={(e) =>
                                                        setPatientName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Masukkan nama lengkap"
                                                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                    No. Resep (Opsional)
                                                </label>
                                                <Input
                                                    value={rxNumber}
                                                    onChange={(e) =>
                                                        setRxNumber(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: RX-99201"
                                                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60]"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#0b3b60] rounded-lg text-white">
                                            <Pill className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">
                                            Katalog Obat
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="relative w-full sm:w-64">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Search className="h-4 w-4" />
                                            </div>
                                            <Input
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Cari obat..."
                                                className="pl-9 h-10 bg-white border-slate-200 rounded-xl focus-visible:ring-[#0b3b60] w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <Select onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Category
                                                </SelectLabel>
                                                <SelectItem value="Semua">
                                                    All Categories
                                                </SelectItem>
                                                {medicineCategories.map(
                                                    (item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Select onValueChange={setSelectedForm}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue placeholder="Form" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Form</SelectLabel>
                                                <SelectItem value="Semua">
                                                    All Forms
                                                </SelectItem>
                                                {medicineForms.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Select onValueChange={setSelectedType}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Type</SelectLabel>
                                                <SelectItem value="Semua">
                                                    All Types
                                                </SelectItem>
                                                {medicineTypes.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Select onValueChange={setSelectedUnit}>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Unit</SelectLabel>
                                                <SelectItem value="Semua">
                                                    All Units
                                                </SelectItem>
                                                {medicineUnits.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                                    <AnimatePresence mode="popLayout">
                                        {filteredDrugs.map((drug) => (
                                            <motion.div
                                                key={drug.id}
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Card className="border-0 shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-white flex flex-col h-full">
                                                    <div className="h-40 w-full bg-slate-50 relative overflow-hidden group">
                                                        <img
                                                            src={drug.image}
                                                            alt={drug.name}
                                                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute top-3 left-3">
                                                            <Badge
                                                                className={`border-0 text-[10px] font-bold uppercase tracking-wider ${
                                                                    drug.stock >
                                                                    10
                                                                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                                                        : "bg-red-100 text-red-700 hover:bg-red-100"
                                                                }`}
                                                            >
                                                                STOK:{" "}
                                                                {drug.stock}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-5 flex flex-col flex-1">
                                                        <h4 className="text-base font-bold text-slate-800 line-clamp-1">
                                                            {drug.name}
                                                        </h4>
                                                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                                                            {drug.category.name}
                                                        </p>
                                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                                            <p className="text-lg font-bold text-[#0b3b60]">
                                                                {formatRupiah(
                                                                    drug.price,
                                                                )}
                                                            </p>
                                                            <button
                                                                onClick={() =>
                                                                    addToCart(
                                                                        drug,
                                                                    )
                                                                }
                                                                disabled={
                                                                    drug.stock ===
                                                                    0
                                                                }
                                                                className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-[#0b3b60] hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="w-full lg:w-[400px] flex-shrink-0 flex flex-col h-[calc(100vh-8rem)] sticky top-4"
                        >
                            <div className="bg-[#0b3b60] rounded-t-3xl p-6 text-white flex flex-col relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <h3 className="text-xl font-bold">
                                        Keranjang
                                    </h3>
                                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold">
                                        {cart.length} ITEM
                                    </Badge>
                                </div>
                                <p className="text-blue-200 text-xs mt-1 relative z-10">
                                    Pesanan Baru #ORD-{new Date().getFullYear()}
                                    -001
                                </p>
                            </div>

                            <div className="bg-white border-x border-b border-slate-100 shadow-xl rounded-b-3xl flex-1 flex flex-col overflow-hidden">
                                <ScrollArea className="flex-1 p-6">
                                    <AnimatePresence>
                                        {cart.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="h-full flex flex-col items-center justify-center text-slate-400 py-10"
                                            >
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <Pill className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-sm font-medium">
                                                    Keranjang masih kosong
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <div className="space-y-4">
                                                {cart.map((item) => (
                                                    <motion.div
                                                        key={item.id}
                                                        layout
                                                        initial={{
                                                            opacity: 0,
                                                            y: 10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            scale: 0.95,
                                                        }}
                                                        className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                                                    >
                                                        <div className="flex justify-between items-start gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0b3b60] shrink-0">
                                                                <Pill className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="text-sm font-bold text-slate-800 line-clamp-1">
                                                                    {item.name}
                                                                </h5>
                                                                <p className="text-xs text-slate-500">
                                                                    {formatRupiah(
                                                                        item.price,
                                                                    )}{" "}
                                                                    / unit
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    removeFromCart(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                                                                <button
                                                                    onClick={() =>
                                                                        updateQty(
                                                                            item.id,
                                                                            -1,
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#0b3b60] hover:bg-slate-50 rounded-l-lg transition-colors"
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-bold text-slate-800">
                                                                    {item.qty}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        updateQty(
                                                                            item.id,
                                                                            1,
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#0b3b60] hover:bg-slate-50 rounded-r-lg transition-colors"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                            <p className="text-sm font-bold text-[#0b3b60]">
                                                                {formatRupiah(
                                                                    item.price *
                                                                        item.qty,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </AnimatePresence>

                                    {cart.length > 0 && (
                                        <div className="mt-6">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                                                Catatan Instruksi
                                            </label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) =>
                                                    setNotes(e.target.value)
                                                }
                                                placeholder="Contoh: Paracetamol diminum sesudah makan..."
                                                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#0b3b60] resize-none"
                                            />
                                        </div>
                                    )}
                                </ScrollArea>

                                <div className="p-6 bg-white border-t border-slate-100">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-slate-500 font-medium">
                                                Subtotal
                                            </p>
                                            <p className="text-sm font-bold text-slate-800">
                                                {formatRupiah(subtotal)}
                                            </p>
                                        </div>
                                        <div className="h-px w-full bg-slate-200 my-2"></div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-base font-extrabold text-slate-800">
                                                Total Harga
                                            </p>
                                            <p className="text-2xl font-extrabold text-[#0b3b60]">
                                                {formatRupiah(total)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        disabled={cart.length === 0}
                                        className="w-full h-14 bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-xl font-bold text-base flex justify-between items-center px-6 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        Buat Pesanan
                                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardApotekLayout>
    );
}
