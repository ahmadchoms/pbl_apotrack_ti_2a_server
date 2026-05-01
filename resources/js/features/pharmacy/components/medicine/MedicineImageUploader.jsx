import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ImagePlus, X, Plus } from "lucide-react";

export function MedicineImageUploader({ images, primaryIndex, onUpload }) {
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
                className="hidden"
                onChange={onUpload}
            />

            <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/40 bg-slate-50/60 hover:bg-primary/3 flex flex-col items-center justify-center gap-3 transition-all duration-200 group relative overflow-hidden"
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
                        <div className="w-14 h-14 rounded-2xl bg-slate-200/80 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <ImagePlus className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-500 group-hover:text-primary transition-colors">
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
        </div>
    );
}
