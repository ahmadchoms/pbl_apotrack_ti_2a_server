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
    PackageOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import {
    medicines,
    medicinesCategories,
    medicinesForms,
    medicinesTypes,
    medicinesUnits,
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

export default function CreateOrderPage() {
    const [cart, setCart] = useState([]);
    const [patientName, setPatientName] = useState("");
    const [rxNumber, setRxNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [selectedForm, setSelectedForm] = useState("Semua");
    const [selectedType, setSelectedType] = useState("Semua");
    const [selectedUnit, setSelectedUnit] = useState("Semua");

    const inputClass =
        "h-11 text-sm border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-xl transition-all placeholder:text-slate-400";
    const selectTriggerClass =
        "h-10 text-sm border-slate-200 bg-slate-50/50 focus:bg-white data-[state=open]:border-primary/40 rounded-xl";

    const filteredDrugs = useMemo(() => {
        return medicines.filter((drug) => {
            const matchesSearch =
                drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                drug.generic_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === "Semua" ||
                drug.category === selectedCategory;
            const matchesForm =
                selectedForm === "Semua" || drug.form === selectedForm;
            const matchesType =
                selectedType === "Semua" || drug.type === selectedType;
            const matchesUnit =
                selectedUnit === "Semua" || drug.unit === selectedUnit;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesForm &&
                matchesType &&
                matchesUnit &&
                drug.is_active
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
                    item.id === drug.id && item.qty < drug.total_active_stock
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
                    if (newQty > 0 && newQty <= item.total_active_stock) {
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
        <DashboardPharmacyLayout activeMenu="POS System">
            <div className="max-w-400 mx-auto h-full flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col min-w-0"
                >
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-0.5">
                            Point of Sales
                        </p>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Tambah Pesanan Baru
                        </h2>
                    </div>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-6 h-full items-start">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6 flex-1 w-full"
                    >
                        <motion.div variants={itemVariants}>
                            <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white overflow-hidden">
                                <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center gap-3 bg-slate-50/30">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <UserPlus className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-sm font-black text-slate-800">
                                        Informasi Pasien
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                                                <span>No. Resep</span>
                                                <span className="text-slate-400 font-medium normal-case">
                                                    Opsional
                                                </span>
                                            </label>
                                            <Input
                                                value={rxNumber}
                                                onChange={(e) =>
                                                    setRxNumber(e.target.value)
                                                }
                                                placeholder="Contoh: RX-99201"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-1 h-5 rounded-full bg-primary" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <Pill className="h-4 w-4" />
                                        Katalog Obat
                                    </h3>
                                </div>

                                <div className="relative w-full sm:w-72">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Search className="h-4 w-4" />
                                    </div>
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari nama atau komposisi..."
                                        className="pl-9 h-10 border-slate-200 bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-xl transition-all w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger
                                        className={selectTriggerClass}
                                    >
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem
                                            value="Semua"
                                            className="text-sm rounded-lg font-medium text-primary"
                                        >
                                            Semua Kategori
                                        </SelectItem>
                                        {medicinesCategories.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.name}
                                                className="text-sm rounded-lg"
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedForm}
                                    onValueChange={setSelectedForm}
                                >
                                    <SelectTrigger
                                        className={selectTriggerClass}
                                    >
                                        <SelectValue placeholder="Sediaan" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem
                                            value="Semua"
                                            className="text-sm rounded-lg font-medium text-primary"
                                        >
                                            Semua Sediaan
                                        </SelectItem>
                                        {medicinesForms.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.name}
                                                className="text-sm rounded-lg"
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedType}
                                    onValueChange={setSelectedType}
                                >
                                    <SelectTrigger
                                        className={selectTriggerClass}
                                    >
                                        <SelectValue placeholder="Tipe Obat" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem
                                            value="Semua"
                                            className="text-sm rounded-lg font-medium text-primary"
                                        >
                                            Semua Tipe
                                        </SelectItem>
                                        {medicinesTypes.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.name}
                                                className="text-sm rounded-lg"
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedUnit}
                                    onValueChange={setSelectedUnit}
                                >
                                    <SelectTrigger
                                        className={selectTriggerClass}
                                    >
                                        <SelectValue placeholder="Satuan" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem
                                            value="Semua"
                                            className="text-sm rounded-lg font-medium text-primary"
                                        >
                                            Semua Satuan
                                        </SelectItem>
                                        {medicinesUnits.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.name}
                                                className="text-sm rounded-lg"
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 pb-8">
                                <AnimatePresence mode="popLayout">
                                    {filteredDrugs.map((drug) => {
                                        const imageUrl =
                                            drug.images &&
                                            drug.images.length > 0
                                                ? drug.images[0].image_url
                                                : "/placeholder.jpg";

                                        return (
                                            <motion.div
                                                key={drug.id}
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Card className="py-0 border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300 bg-white flex flex-col h-full group">
                                                    <div className="h-44 w-full bg-slate-50/50 relative overflow-hidden border-b border-slate-100">
                                                        <img
                                                            src={imageUrl}
                                                            alt={drug.name}
                                                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                                            <Badge
                                                                className={`border-0 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                                                                    drug.total_active_stock >
                                                                    10
                                                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                                        : "bg-red-500 hover:bg-red-600 text-white"
                                                                }`}
                                                            >
                                                                Stok:{" "}
                                                                {
                                                                    drug.total_active_stock
                                                                }
                                                            </Badge>
                                                            {drug.requires_prescription && (
                                                                <Badge className="border-0 text-[9px] font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white shadow-sm w-fit">
                                                                    Resep
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-4 flex flex-col flex-1">
                                                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                                                            {drug.name}
                                                        </h4>
                                                        <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">
                                                            {drug.generic_name}
                                                        </p>
                                                        <div className="flex gap-1.5 mt-2 flex-wrap">
                                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                                                {drug.category}
                                                            </span>
                                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                                                {drug.form}
                                                            </span>
                                                        </div>
                                                        <div className="mt-auto pt-4 flex items-end justify-between">
                                                            <div>
                                                                <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                                                                    Harga per{" "}
                                                                    {drug.unit}
                                                                </p>
                                                                <p className="text-base font-black text-primary">
                                                                    {formatRupiah(
                                                                        drug.price,
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    addToCart(
                                                                        drug,
                                                                    )
                                                                }
                                                                disabled={
                                                                    drug.total_active_stock ===
                                                                    0
                                                                }
                                                                className="w-9 h-9 rounded-xl bg-slate-100 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn active:scale-95"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {filteredDrugs.length === 0 && (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                        <PackageOpen className="w-12 h-12 mb-3 text-slate-300" />
                                        <p className="text-sm font-bold text-slate-600">
                                            Obat tidak ditemukan
                                        </p>
                                        <p className="text-xs mt-1 text-center max-w-sm">
                                            Coba sesuaikan kata kunci pencarian
                                            atau filter kategori yang dipilih.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="w-full xl:w-100 shrink-0 flex flex-col h-[calc(100vh-8rem)] sticky top-6"
                    >
                        <div className="bg-linear-to-br from-primary to-[#004b9a] rounded-t-2xl p-6 text-white flex flex-col relative overflow-hidden shadow-sm border border-primary">
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="flex items-center justify-between relative z-10">
                                <h3 className="text-lg font-black tracking-tight">
                                    Keranjang Pasien
                                </h3>
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold px-2.5 py-1">
                                    {cart.length} ITEM
                                </Badge>
                            </div>
                            <p className="text-blue-200/80 text-xs mt-1.5 relative z-10 font-medium">
                                TRX-{new Date().getFullYear()}
                                {String(new Date().getMonth() + 1).padStart(
                                    2,
                                    "0",
                                )}
                                -001
                            </p>
                        </div>

                        <div className="bg-white border-x border-b border-slate-200 shadow-xl rounded-b-2xl flex-1 flex flex-col overflow-hidden">
                            <ScrollArea className="flex-1 p-5">
                                <AnimatePresence>
                                    {cart.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-slate-400 py-16"
                                        >
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                                <Pill className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-500">
                                                Keranjang masih kosong
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-1">
                                                Pilih obat dari katalog di
                                                samping
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-3">
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
                                                    className="flex flex-col gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60"
                                                >
                                                    <div className="flex justify-between items-start gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-sm font-bold text-slate-800 leading-tight">
                                                                {item.name}
                                                            </h5>
                                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                                {formatRupiah(
                                                                    item.price,
                                                                )}{" "}
                                                                / {item.unit}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-md transition-colors p-1.5"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                                            <button
                                                                onClick={() =>
                                                                    updateQty(
                                                                        item.id,
                                                                        -1,
                                                                    )
                                                                }
                                                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="w-8 text-center text-xs font-bold text-slate-800 bg-slate-50/50 py-1.5">
                                                                {item.qty}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQty(
                                                                        item.id,
                                                                        1,
                                                                    )
                                                                }
                                                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm font-black text-primary">
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
                                    <div className="mt-5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                                            Catatan Instruksi
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) =>
                                                setNotes(e.target.value)
                                            }
                                            placeholder="Contoh: Paracetamol diminum sesudah makan..."
                                            className="w-full h-20 bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 resize-none transition-all shadow-sm"
                                        />
                                    </div>
                                )}
                            </ScrollArea>

                            <div className="p-5 bg-slate-50/50 border-t border-slate-200">
                                <div className="space-y-2.5 mb-5">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-500 font-medium">
                                            Subtotal
                                        </p>
                                        <p className="text-xs font-bold text-slate-700">
                                            {formatRupiah(subtotal)}
                                        </p>
                                    </div>
                                    <div className="h-px w-full bg-slate-200/80 my-1"></div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-black text-slate-800">
                                            Total Harga
                                        </p>
                                        <p className="text-xl font-black text-primary tracking-tight">
                                            {formatRupiah(total)}
                                        </p>
                                    </div>
                                </div>
                                <motion.div
                                    whileTap={
                                        cart.length > 0 ? { scale: 0.98 } : {}
                                    }
                                >
                                    <Button
                                        disabled={cart.length === 0}
                                        className="w-full h-12 bg-linear-to-r from-primary to-[#004b9a] hover:from-[#002a58] hover:to-[#003b7a] text-white rounded-xl font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                                    >
                                        Proses Pembayaran
                                        <ChevronRight className="h-4 w-4 opacity-70" />
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardPharmacyLayout>
    );
}
