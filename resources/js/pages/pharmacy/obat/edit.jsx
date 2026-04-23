import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    ImagePlus,
    X,
    Save,
    ArrowLeft,
    Plus,
    Trash2,
    CalendarDays,
    Hash,
    Package,
    Pill,
    Factory,
    Info,
    DollarSign,
    Weight,
    ShieldAlert,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { Link, useForm } from "@inertiajs/react";

const CATEGORIES = [
    "Antibiotik",
    "Analgesik",
    "Antipiretik",
    "Antasida & GERD",
    "Vitamin & Suplemen",
    "P3K & Antiseptik",
    "Antihistamin",
    "Kardiovaskular",
    "Dermatologi",
    "Oftalmologi",
    "Injeksi",
    "Nasal Care",
    "Lainnya",
];

const MEDICINE_TYPES = [
    "Obat Keras",
    "Obat Bebas",
    "Obat Bebas Terbatas",
    "Psikotropika",
    "Narkotika",
];

const FORMS = [
    "Tablet",
    "Kapsul",
    "Sirup",
    "Salep",
    "Krim",
    "Tetes",
    "Inhaler",
    "Suppositoria",
    "Injeksi",
    "Softgel",
    "Serbuk",
    "Semprot",
    "Patch",
    "Vial",
];

const UNITS = [
    "Strip",
    "Botol",
    "Tube",
    "Sachet",
    "Ampul",
    "Vial",
    "Box",
    "Blister",
    "Pcs",
];

function SectionHeader({ icon: Icon, label, color = "text-[#00346C]" }) {
    return (
        <div className="flex items-center gap-2.5 mb-5">
            <div className="w-1 h-5 rounded-full bg-[#00346C]" />
            <p
                className={`text-[10px] font-black uppercase tracking-[0.2em] ${color} flex items-center gap-2`}
            >
                <Icon className="w-3.5 h-3.5" />
                {label}
            </p>
        </div>
    );
}

function FormField({ label, required, children, hint }) {
    return (
        <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {label}
                {required && (
                    <span className="text-red-500 text-sm leading-none">*</span>
                )}
            </Label>
            {children}
            {hint && (
                <p className="text-[10px] text-slate-400 font-medium">{hint}</p>
            )}
        </div>
    );
}

const sectionVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.38,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
};

export default function EditMedicinePage({ medicine = {} }) {
    const initialImages =
        medicine.images?.map((img) => ({
            id: img.id,
            file: null,
            preview: img.url,
            isExisting: true,
        })) || [];

    const [images, setImages] = useState(initialImages);
    const [primaryIndex, setPrimaryIndex] = useState(0);

    const [batches, setBatches] = useState(
        medicine.batches?.length > 0
            ? medicine.batches
            : [
                  {
                      id: Date.now(),
                      batch_number: "",
                      expired_date: "",
                      stock: "",
                  },
              ],
    );

    const [requiresPrescription, setRequiresPrescription] = useState(
        medicine.requires_prescription || false,
    );
    const [isActive, setIsActive] = useState(medicine.is_active ?? true);
    const fileInputRef = useRef(null);

    const { data, setData, put, errors } = useForm({
        name: medicine.name || "",
        generic_name: medicine.generic_name || "",
        manufacturer: medicine.manufacturer || "",
        description: medicine.description || "",
        dosage_info: medicine.dosage_info || "",
        price: medicine.price || "",
        weight_in_grams: medicine.weight_in_grams || "",
        category: medicine.category || "",
        type: medicine.type || "",
        form: medicine.form || "",
        unit: medicine.unit || "",
        requires_prescription: medicine.requires_prescription || false,
        is_active: medicine.is_active ?? true,
        batches: batches,
    });

    useEffect(() => {
        setData("batches", batches);
    }, [batches]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files ?? []);
        const newImages = files.map((file) => ({
            id: Date.now() + Math.random(),
            file,
            preview: URL.createObjectURL(file),
            isExisting: false,
        }));
        setImages((prev) => [...prev, ...newImages].slice(0, 5));
    };

    const removeImage = (id) => {
        setImages((prev) => {
            const next = prev.filter((img) => img.id !== id);
            if (primaryIndex >= next.length)
                setPrimaryIndex(Math.max(0, next.length - 1));
            return next;
        });
    };

    const addBatch = () => {
        setBatches((prev) => [
            ...prev,
            { id: Date.now(), batch_number: "", expired_date: "", stock: "" },
        ]);
    };

    const removeBatch = (id) => {
        if (batches.length === 1) return;
        setBatches((prev) => prev.filter((b) => b.id !== id));
    };

    const updateBatch = (id, field, value) => {
        setBatches((prev) =>
            prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/pharmacy/medicines/${medicine.id}`, {
            preserveScroll: true,
        });
    };

    const inputClass =
        "h-10 text-sm border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00346C]/40 focus:ring-2 focus:ring-[#00346C]/10 rounded-xl transition-all placeholder:text-slate-300";
    const selectTriggerClass =
        "h-10 text-sm border-slate-200 bg-slate-50/50 focus:bg-white data-[state=open]:border-[#00346C]/40 rounded-xl";

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Obat">
            <div className="max-w-350 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 flex items-center gap-4"
                >
                    <Link
                        href="/pharmacy/medicines"
                        className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 shadow-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-0.5">
                            Manajemen Inventaris
                        </p>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Edit Data Obat
                        </h2>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
                        <div className="space-y-5">
                            <motion.div
                                custom={0}
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"
                            >
                                <h3 className="text-sm font-black text-slate-800 mb-5">
                                    Visual Produk
                                </h3>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />

                                <motion.button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#00346C]/40 bg-slate-50/60 hover:bg-[#00346C]/3 flex flex-col items-center justify-center gap-3 transition-all duration-200 group relative overflow-hidden"
                                >
                                    {images.length > 0 &&
                                    images[primaryIndex] ? (
                                        <>
                                            <img
                                                src={
                                                    images[primaryIndex].preview
                                                }
                                                alt="primary"
                                                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center gap-2">
                                                <ImagePlus className="w-7 h-7 text-white" />
                                                <p className="text-xs font-bold text-white">
                                                    Ganti Gambar
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 rounded-2xl bg-slate-200/80 group-hover:bg-[#00346C]/10 flex items-center justify-center transition-colors">
                                                <ImagePlus className="w-6 h-6 text-slate-400 group-hover:text-[#00346C] transition-colors" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-slate-500 group-hover:text-[#00346C] transition-colors">
                                                    Klik untuk unggah gambar
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    Format JPG, PNG atau WEBP
                                                    <br />
                                                    (Maks. 5MB)
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </motion.button>

                                {images.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-4 flex flex-wrap gap-2"
                                    >
                                        {images.map((img, idx) => (
                                            <motion.div
                                                key={img.id}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${idx === primaryIndex ? "border-[#00346C] ring-2 ring-[#00346C]/20" : "border-slate-200 hover:border-slate-300"}`}
                                                onClick={() =>
                                                    setPrimaryIndex(idx)
                                                }
                                            >
                                                <img
                                                    src={img.preview}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(img.id);
                                                    }}
                                                    className="absolute top-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-2.5 h-2.5" />
                                                </button>
                                                {idx === primaryIndex && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-[#00346C]/80 text-[8px] text-white font-bold text-center py-0.5">
                                                        Utama
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                        {images.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#00346C]/40 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#00346C] transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>

                            <motion.div
                                custom={1}
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4"
                            >
                                <h3 className="text-sm font-black text-slate-800">
                                    Pengaturan
                                </h3>

                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">
                                                Butuh Resep
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Hanya bisa dibeli dengan resep
                                                dokter
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={requiresPrescription}
                                        onCheckedChange={(v) => {
                                            setRequiresPrescription(v);
                                            setData("requires_prescription", v);
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">
                                                Status Aktif
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Obat tampil di katalog & bisa
                                                dipesan
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={(v) => {
                                            setIsActive(v);
                                            setData("is_active", v);
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </div>

                        <div className="space-y-5">
                            <motion.div
                                custom={2}
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"
                            >
                                <SectionHeader
                                    icon={Pill}
                                    label="Informasi Umum"
                                />

                                <div className="space-y-5">
                                    <FormField label="Nama Obat" required>
                                        <Input
                                            placeholder="Contoh: Amoxicillin 500mg"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                    </FormField>

                                    <FormField
                                        label="Nama Generik"
                                        hint="Nama kimia atau INN (International Nonproprietary Name)"
                                    >
                                        <Input
                                            placeholder="Contoh: Amoxicillin Trihydrate"
                                            value={data.generic_name}
                                            onChange={(e) =>
                                                setData(
                                                    "generic_name",
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </FormField>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField label="Kategori" required>
                                            <Select
                                                value={data.category}
                                                onValueChange={(v) =>
                                                    setData("category", v)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        selectTriggerClass
                                                    }
                                                >
                                                    <SelectValue placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {CATEGORIES.map((c) => (
                                                        <SelectItem
                                                            key={c}
                                                            value={c}
                                                            className="text-sm rounded-lg"
                                                        >
                                                            {c}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField label="Tipe Obat" required>
                                            <Select
                                                value={data.type}
                                                onValueChange={(v) =>
                                                    setData("type", v)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        selectTriggerClass
                                                    }
                                                >
                                                    <SelectValue placeholder="Pilih Tipe" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {MEDICINE_TYPES.map((t) => (
                                                        <SelectItem
                                                            key={t}
                                                            value={t}
                                                            className="text-sm rounded-lg"
                                                        >
                                                            {t}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            label="Bentuk Sediaan"
                                            required
                                        >
                                            <Select
                                                value={data.form}
                                                onValueChange={(v) =>
                                                    setData("form", v)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        selectTriggerClass
                                                    }
                                                >
                                                    <SelectValue placeholder="Sirup, Tablet, Kapsul..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {FORMS.map((f) => (
                                                        <SelectItem
                                                            key={f}
                                                            value={f}
                                                            className="text-sm rounded-lg"
                                                        >
                                                            {f}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField label="Satuan Jual" required>
                                            <Select
                                                value={data.unit}
                                                onValueChange={(v) =>
                                                    setData("unit", v)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        selectTriggerClass
                                                    }
                                                >
                                                    <SelectValue placeholder="Strip, Botol, Tube..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {UNITS.map((u) => (
                                                        <SelectItem
                                                            key={u}
                                                            value={u}
                                                            className="text-sm rounded-lg"
                                                        >
                                                            {u}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>

                                    <FormField label="Produsen / Pabrik">
                                        <div className="relative">
                                            <Factory className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                            <Input
                                                placeholder="Contoh: Kimia Farma, Kalbe Farma"
                                                value={data.manufacturer}
                                                onChange={(e) =>
                                                    setData(
                                                        "manufacturer",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${inputClass} pl-9`}
                                            />
                                        </div>
                                    </FormField>
                                </div>
                            </motion.div>

                            <motion.div
                                custom={3}
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"
                            >
                                <SectionHeader
                                    icon={DollarSign}
                                    label="Harga & Berat"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        label="Harga Jual (IDR)"
                                        required
                                    >
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                                Rp
                                            </span>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={data.price}
                                                onChange={(e) =>
                                                    setData(
                                                        "price",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${inputClass} pl-9 tabular-nums`}
                                            />
                                        </div>
                                    </FormField>

                                    <FormField
                                        label="Berat (gram)"
                                        hint="Untuk kalkulasi ongkos kirim"
                                    >
                                        <div className="relative">
                                            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={data.weight_in_grams}
                                                onChange={(e) =>
                                                    setData(
                                                        "weight_in_grams",
                                                        e.target.value,
                                                    )
                                                }
                                                className={`${inputClass} pl-9 tabular-nums`}
                                            />
                                        </div>
                                    </FormField>
                                </div>
                            </motion.div>

                            <motion.div
                                custom={4}
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"
                            >
                                <SectionHeader
                                    icon={Package}
                                    label="Batch & Stok Terkini"
                                />

                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {batches.map((batch, idx) => (
                                            <motion.div
                                                key={batch.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    x: -16,
                                                    transition: {
                                                        duration: 0.2,
                                                    },
                                                }}
                                                className="bg-slate-50 rounded-2xl border border-slate-100 p-4"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                        Batch #{idx + 1}
                                                    </span>
                                                    {batches.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeBatch(
                                                                    batch.id,
                                                                )
                                                            }
                                                            className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <FormField label="Nomor Batch">
                                                        <div className="relative">
                                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                                            <Input
                                                                placeholder="BCH-202604-001"
                                                                value={
                                                                    batch.batch_number
                                                                }
                                                                onChange={(e) =>
                                                                    updateBatch(
                                                                        batch.id,
                                                                        "batch_number",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={`${inputClass} pl-9 font-mono text-xs`}
                                                            />
                                                        </div>
                                                    </FormField>

                                                    <FormField label="Tanggal Kedaluwarsa">
                                                        <div className="relative">
                                                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                                            <Input
                                                                type="date"
                                                                value={
                                                                    batch.expired_date
                                                                }
                                                                onChange={(e) =>
                                                                    updateBatch(
                                                                        batch.id,
                                                                        "expired_date",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={`${inputClass} pl-9`}
                                                            />
                                                        </div>
                                                    </FormField>

                                                    <FormField
                                                        label="Jumlah Stok"
                                                        required
                                                    >
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            placeholder="0"
                                                            value={batch.stock}
                                                            onChange={(e) =>
                                                                updateBatch(
                                                                    batch.id,
                                                                    "stock",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`${inputClass} tabular-nums`}
                                                        />
                                                    </FormField>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    <motion.button
                                        type="button"
                                        onClick={addBatch}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-10 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#00346C]/40 bg-transparent hover:bg-[#00346C]/3 text-slate-400 hover:text-[#00346C] text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Tambah Batch Baru
                                    </motion.button>
                                </div>
                            </motion.div>

                            <motion.div
                                custom={5}
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6"
                            >
                                <SectionHeader
                                    icon={Info}
                                    label="Deskripsi & Informasi Tambahan"
                                />

                                <div className="space-y-4">
                                    <FormField label="Deskripsi Obat">
                                        <Textarea
                                            placeholder="Jelaskan kegunaan utama obat ini secara singkat..."
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            className="text-sm border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00346C]/40 focus:ring-2 focus:ring-[#00346C]/10 rounded-xl transition-all placeholder:text-slate-300 resize-none"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Petunjuk Dosis"
                                        hint="Contoh: Dewasa 1-2 tablet 3x sehari, anak-anak sesuai anjuran dokter"
                                    >
                                        <Textarea
                                            placeholder="Contoh: Dewasa: 1 tablet tiap 4-6 jam. Maks. 8 tablet/hari..."
                                            value={data.dosage_info}
                                            onChange={(e) =>
                                                setData(
                                                    "dosage_info",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            className="text-sm border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00346C]/40 focus:ring-2 focus:ring-[#00346C]/10 rounded-xl transition-all placeholder:text-slate-300 resize-none"
                                        />
                                    </FormField>
                                </div>
                            </motion.div>

                            <motion.div
                                custom={6}
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-amber-50/70 rounded-2xl border border-amber-100 p-4 flex items-start gap-3"
                            >
                                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-600 font-semibold leading-relaxed">
                                    Pastikan perubahan informasi obat sudah
                                    diperiksa dengan teliti. Update stok dan
                                    batch akan langsung mempengaruhi inventaris
                                    dan data penjualan aktif.
                                </p>
                            </motion.div>

                            <motion.div
                                custom={7}
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex items-center justify-end gap-3 pb-8"
                            >
                                <Link href="/pharmacy/medicines">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-11 px-6 rounded-xl text-slate-500 hover:text-slate-700 font-bold text-sm"
                                    >
                                        Batal
                                    </Button>
                                </Link>
                                <motion.div whileTap={{ scale: 0.97 }}>
                                    <Button
                                        type="submit"
                                        className="h-11 px-7 bg-linear-to-r from-[#00346C] to-[#0055a5] hover:from-[#002a58] hover:to-[#00469a] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#00346C]/25 transition-all flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Simpan Perubahan
                                        <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardPharmacyLayout>
    );
}
