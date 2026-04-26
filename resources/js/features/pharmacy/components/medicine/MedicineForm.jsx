import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useForm } from "@inertiajs/react";
import {
    Save,
    ArrowLeft,
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SectionHeader } from "@/components/ui/section-header";
import { TextInput } from "@/components/shared/TextInput";
import { SelectInput } from "@/components/shared/SelectInput";
import { TextareaInput } from "@/components/shared/TextareaInput";
import { MedicineImageUploader } from "./MedicineImageUploader";
import { MedicineBatchManager } from "./MedicineBatchManager";

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

const FormCard = ({ custom, children }) => (
    <motion.div
        custom={custom}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="form-card"
    >
        {children}
    </motion.div>
);

export function MedicineForm({
    medicine = {},
    isEdit = false,
    categories = [],
    units = [],
    types = [],
    forms = [],
}) {
    const [images, setImages] = useState(
        medicine.images?.map((img) => ({
            id: img.id,
            file: null,
            preview: img.image_url,
            isExisting: true,
        })) || [],
    );
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

    const { data, setData, post, put } = useForm({
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

    const handleSubmit = (e) => {
        e.preventDefault();
        isEdit
            ? put(`/pharmacy/medicines/${medicine.id}/edit`, {
                  preserveScroll: true,
              })
            : post("/pharmacy/medicines/new");
    };

    return (
        <div className="max-w-350 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 flex items-center gap-4"
            >
                <Link
                    href={route("pharmacy.medicines.index")}
                    className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 shadow-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-0.5">
                        Manajemen Inventaris
                    </p>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {isEdit ? "Edit Data Obat" : "Tambah Obat Baru"}
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
                        >
                            <MedicineImageUploader
                                images={images}
                                primaryIndex={primaryIndex}
                                onUpload={handleImageUpload}
                                onRemove={removeImage}
                                onSetPrimary={setPrimaryIndex}
                            />
                        </motion.div>

                        <FormCard custom={1}>
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
                                    checked={data.requires_prescription}
                                    onCheckedChange={(v) =>
                                        setData("requires_prescription", v)
                                    }
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
                                    checked={data.is_active}
                                    onCheckedChange={(v) =>
                                        setData("is_active", v)
                                    }
                                />
                            </div>
                        </FormCard>
                    </div>

                    <div className="space-y-5">
                        <FormCard custom={2}>
                            <SectionHeader icon={Pill} label="Informasi Umum" />
                            <div className="space-y-5">
                                <TextInput
                                    label="Nama Obat"
                                    required
                                    placeholder="Contoh: Amoxicillin 500mg"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <TextInput
                                    label="Nama Generik"
                                    hint="Nama kimia atau INN"
                                    placeholder="Contoh: Amoxicillin Trihydrate"
                                    value={data.generic_name}
                                    onChange={(e) =>
                                        setData("generic_name", e.target.value)
                                    }
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <SelectInput
                                        key="category"
                                        label="Kategori"
                                        required
                                        placeholder="Pilih Kategori"
                                        options={categories}
                                        value={data.category || ""}
                                        onChange={(v) => setData("category", v)}
                                    />
                                    <SelectInput
                                        key="type"
                                        label="Tipe Obat"
                                        required
                                        placeholder="Pilih Tipe"
                                        options={types}
                                        value={data.type || ""}
                                        onChange={(v) => setData("type", v)}
                                    />
                                    <SelectInput
                                        key="form"
                                        label="Bentuk Sediaan"
                                        required
                                        placeholder="Pilih Bentuk"
                                        options={forms}
                                        value={data.form || ""}
                                        onChange={(v) => setData("form", v)}
                                    />
                                    <SelectInput
                                        key="unit"
                                        label="Satuan Jual"
                                        required
                                        placeholder="Pilih Satuan"
                                        options={units}
                                        value={data.unit || ""}
                                        onChange={(v) => setData("unit", v)}
                                    />
                                </div>
                                <TextInput
                                    label="Produsen / Pabrik"
                                    icon={Factory}
                                    placeholder="Contoh: Kimia Farma, Kalbe Farma"
                                    value={data.manufacturer}
                                    onChange={(e) =>
                                        setData("manufacturer", e.target.value)
                                    }
                                />
                            </div>
                        </FormCard>

                        <FormCard custom={3}>
                            <SectionHeader
                                icon={DollarSign}
                                label="Harga & Berat"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextInput
                                    label="Harga Jual (IDR)"
                                    required
                                    prefix="Rp"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                />
                                <TextInput
                                    label="Berat (gram)"
                                    hint="Untuk kalkulasi ongkos kirim"
                                    icon={Weight}
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
                                />
                            </div>
                        </FormCard>

                        <motion.div
                            custom={4}
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <MedicineBatchManager
                                batches={batches}
                                isEdit={isEdit}
                                onAdd={() =>
                                    setBatches((p) => [
                                        ...p,
                                        {
                                            id: Date.now(),
                                            batch_number: "",
                                            expired_date: "",
                                            stock: "",
                                        },
                                    ])
                                }
                                onRemove={(id) =>
                                    setBatches((p) =>
                                        p.filter((b) => b.id !== id),
                                    )
                                }
                                onUpdate={(id, field, value) =>
                                    setBatches((p) =>
                                        p.map((b) =>
                                            b.id === id
                                                ? { ...b, [field]: value }
                                                : b,
                                        ),
                                    )
                                }
                            />
                        </motion.div>

                        <FormCard custom={5}>
                            <SectionHeader
                                icon={Info}
                                label="Deskripsi & Informasi Tambahan"
                            />
                            <div className="space-y-4">
                                <TextareaInput
                                    label="Deskripsi Obat"
                                    placeholder="Jelaskan kegunaan utama obat ini secara singkat..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />
                                <TextareaInput
                                    label="Petunjuk Dosis"
                                    hint="Contoh: Dewasa 1-2 tablet 3x sehari"
                                    placeholder="Contoh: Dewasa: 1 tablet tiap 4-6 jam..."
                                    value={data.dosage_info}
                                    onChange={(e) =>
                                        setData("dosage_info", e.target.value)
                                    }
                                />
                            </div>
                        </FormCard>

                        <motion.div
                            custom={6}
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-amber-50/70 rounded-2xl border border-amber-100 p-4 flex items-start gap-3"
                        >
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-600 font-semibold leading-relaxed">
                                {isEdit
                                    ? "Update stok dan batch akan langsung mempengaruhi inventaris aktif."
                                    : "Data stok dan batch akan tercatat langsung di inventaris apotek."}
                            </p>
                        </motion.div>

                        <motion.div
                            custom={7}
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center justify-end gap-3 pb-8"
                        >
                            <Link href={route("pharmacy.medicines.index")}>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-11 px-6 rounded-xl text-slate-500 font-bold text-sm"
                                >
                                    Batal
                                </Button>
                            </Link>
                            <motion.div whileTap={{ scale: 0.97 }}>
                                <Button
                                    type="submit"
                                    className="h-11 px-7 bg-linear-to-r from-[#00346C] to-[#0055a5] text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />{" "}
                                    {isEdit
                                        ? "Simpan Perubahan"
                                        : "Simpan Obat"}{" "}
                                    <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </form>
        </div>
    );
}
