import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ImagePlus, X, Plus } from "lucide-react";

export function MedicineImageUploader({
    images,
    primaryIndex,
    onUpload,
    onRemove,
    onSetPrimary,
}) {
    const fileInputRef = useRef(null);

    return (
        <div className="form-card">
            <h3 className="text-sm font-black text-slate-800 mb-5">
                Visual Produk
            </h3>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={onUpload}
            />

            <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#00346C]/40 bg-slate-50/60 hover:bg-[#00346C]/3 flex flex-col items-center justify-center gap-3 transition-all duration-200 group relative overflow-hidden"
            >
                {images.length > 0 && images[primaryIndex] ? (
                    <>
                        <img
                            src={images[primaryIndex].preview}
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
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${idx === primaryIndex ? "border-[#00346C] ring-2 ring-[#00346C]/20" : "border-slate-200 hover:border-slate-300"}`}
                            onClick={() => onSetPrimary(idx)}
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
                                    onRemove(img.id);
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
                            onClick={() => fileInputRef.current?.click()}
                            className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#00346C]/40 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#00346C] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
}
