import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CalendarDays, Hash } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { TextInput } from "@/components/shared/TextInput"; // Gunakan komponen yang kita buat sebelumnya

export function MedicineBatchManager({
    batches,
    onAdd,
    onRemove,
    onUpdate,
    isEdit,
}) {
    return (
        <div className="form-card">
            <SectionHeader
                icon={CalendarDays}
                label={isEdit ? "Batch & Stok Terkini" : "Batch & Stok Awal"}
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
                                transition: { duration: 0.2 },
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
                                        onClick={() => onRemove(batch.id)}
                                        className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <TextInput
                                    label="Nomor Batch"
                                    icon={Hash}
                                    placeholder="BCH-2026-001"
                                    value={batch.batch_number}
                                    onChange={(e) =>
                                        onUpdate(
                                            batch.id,
                                            "batch_number",
                                            e.target.value,
                                        )
                                    }
                                    className="font-mono text-xs"
                                />
                                <TextInput
                                    label="Tanggal Kedaluwarsa"
                                    type="date"
                                    value={batch.expired_date}
                                    onChange={(e) =>
                                        onUpdate(
                                            batch.id,
                                            "expired_date",
                                            e.target.value,
                                        )
                                    }
                                />
                                <TextInput
                                    label="Jumlah Stok"
                                    required
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={batch.stock}
                                    onChange={(e) =>
                                        onUpdate(
                                            batch.id,
                                            "stock",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <motion.button
                    type="button"
                    onClick={onAdd}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-10 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/40 bg-transparent hover:bg-primary/3 text-slate-400 hover:text-primary text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200"
                >
                    <Plus className="w-3.5 h-3.5" /> Tambah Batch Baru
                </motion.button>
            </div>
        </div>
    );
}
