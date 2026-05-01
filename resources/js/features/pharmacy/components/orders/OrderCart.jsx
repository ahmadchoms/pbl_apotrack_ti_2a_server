import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trash2,
    Plus,
    Minus,
    Package,
    Ticket,
    QrCode,
    Banknote,
    ChevronRight,
    RotateCcw,
    ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRupiah } from "@/lib/utils";

const PAYMENT_METHODS = [
    { id: "CASH", label: "Tunai / Cash", icon: Banknote },
    { id: "QRIS", label: "QRIS", icon: QrCode },
];

export function OrderCart({ cart, updateQty, removeFromCart, onReset }) {
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const PayIcon = paymentMethod.icon;

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 flex flex-col overflow-hidden border border-slate-200/80 h-full">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                        Detail Transaksi
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {cart.length === 0
                            ? "Belum ada item dipilih"
                            : `${cart.reduce((a, i) => a + i.qty, 0)} item dipilih`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="bg-slate-100 text-slate-500 border-0 h-7 px-3 rounded-full font-black text-[10px] uppercase tracking-widest">
                        {cart.length} Jenis
                    </Badge>
                    {cart.length > 0 && (
                        <button
                            onClick={onReset}
                            className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors"
                            title="Reset Keranjang"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
                <div className="px-6 py-5">
                    <AnimatePresence mode="popLayout">
                        {cart.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center text-slate-400 py-16"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
                                    <Package className="h-8 w-8 text-slate-200" />
                                </div>
                                <p className="text-sm font-bold text-slate-500">
                                    Keranjang Kosong
                                </p>
                                <p className="text-xs text-slate-400 mt-1.5 text-center max-w-40 leading-relaxed">
                                    Pilih obat dari katalog untuk memulai
                                    transaksi
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
                                            x: 16,
                                            scale: 0.97,
                                        }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{
                                            opacity: 0,
                                            x: -12,
                                            scale: 0.95,
                                            transition: { duration: 0.18 },
                                        }}
                                        className="flex items-start gap-3 group p-3 rounded-2xl hover:bg-slate-50/80 transition-colors"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-slate-300" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h5 className="text-xs font-black text-slate-900 leading-snug truncate">
                                                        {item.name}
                                                    </h5>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                        {item.form} ·{" "}
                                                        {item.unit}
                                                    </p>
                                                    {item.requires_prescription && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <ShieldAlert className="w-2.5 h-2.5 text-violet-500" />
                                                            <span className="text-[9px] font-bold text-violet-500 uppercase tracking-wide">
                                                                Butuh Resep
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                    className="w-6 h-6 rounded-full bg-transparent hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-2.5">
                                                <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                                                    <button
                                                        onClick={() =>
                                                            updateQty(
                                                                item.id,
                                                                -1,
                                                            )
                                                        }
                                                        className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all"
                                                    >
                                                        <Minus className="w-2.5 h-2.5" />
                                                    </button>
                                                    <span className="w-7 text-center text-xs font-black text-slate-900 tabular-nums">
                                                        {item.qty}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQty(
                                                                item.id,
                                                                1,
                                                            )
                                                        }
                                                        className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all"
                                                    >
                                                        <Plus className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                                <span className="text-sm font-black text-primary tabular-nums">
                                                    {formatRupiah(
                                                        item.price * item.qty,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </ScrollArea>

            <div className="px-6 pt-4 pb-6 bg-slate-50/40 border-t border-slate-100 shrink-0 space-y-4">
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                            Total Bayar
                        </span>
                        <motion.span
                            key={subtotal}
                            initial={{ scale: 1.06, color: "#00346C" }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="text-xl font-black text-primary tabular-nums tracking-tight"
                        >
                            {formatRupiah(subtotal)}
                        </motion.span>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-full flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                <PayIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    Metode Bayar
                                </p>
                                <p className="text-xs font-bold text-slate-800 truncate">
                                    {paymentMethod.label}
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-52 rounded-2xl p-1.5"
                    >
                        {PAYMENT_METHODS.map((method) => {
                            const Icon = method.icon;
                            const isSelected = paymentMethod.id === method.id;
                            return (
                                <DropdownMenuItem
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer ${isSelected ? "bg-primary/8 text-primary" : ""}`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <span
                                        className={`text-sm font-bold ${isSelected ? "text-primary" : ""}`}
                                    >
                                        {method.label}
                                    </span>
                                    {isSelected && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                <motion.button
                    disabled={cart.length === 0}
                    whileTap={{ scale: 0.97 }}
                    className="w-full h-13 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                >
                    <span>Proses Sekarang</span>
                    {cart.length > 0 && (
                        <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full tabular-nums">
                            {formatRupiah(subtotal)}
                        </span>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
