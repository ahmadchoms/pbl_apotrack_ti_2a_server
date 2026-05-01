import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Truck,
    Package,
    Clock,
    ChevronDown,
    ChevronUp,
    FileText,
    User,
    CreditCard,
    Pill,
} from "lucide-react";
import { formatRupiah, formatTime } from "@/lib/utils";
import {
    STATUS_CONFIG,
    SERVICE_ICON,
    cardVariants,
} from "@/features/pharmacy/lib/constants";

function SectionLabel({ children }) {
    return (
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
            <span className="inline-block w-3 h-px bg-slate-300" />
            {children}
        </p>
    );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mb-1">
                    {label}
                </p>
                <p
                    className={`text-sm font-semibold ${highlight ? "text-primary" : "text-slate-700"}`}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

export function OrderCard({ order, index, isSelected, onSelect }) {
    const statusCfg =
        STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG.PENDING;
    const iconMapping = {
        Truck: Truck,
        Package: Package,
    };
    const ServiceIcon =
        iconMapping[SERVICE_ICON[order.service_type]] ?? Package;
    const shortNum = order.order_number;
    const hasPrescription = !!order.prescription;

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group ${
                isSelected
                    ? "border-primary/40 shadow-lg shadow-primary/8 ring-1 ring-primary/15 bg-white"
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md bg-slate-50/30 hover:bg-white"
            }`}
            onClick={() => onSelect(order)}
        >
            <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isSelected
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                    : "bg-white border border-slate-100 text-slate-500 group-hover:border-slate-200"
                            }`}
                        >
                            <ServiceIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                    {shortNum}
                                </span>
                                {hasPrescription && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-violet-600 bg-violet-50 border border-violet-200/80 px-1.5 py-0.5 rounded-full">
                                        <FileText className="w-2.5 h-2.5" />
                                        Resep
                                    </span>
                                )}
                            </div>
                            <h3
                                className={`text-sm font-bold transition-colors mb-1.5 ${isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}
                            >
                                {order.buyer?.username || "Guest"}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span
                                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-all ${statusCfg.badge}`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} animate-pulse`}
                                    />
                                    {statusCfg.label}
                                </span>
                                <span className="text-xs text-slate-300">
                                    ·
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {order.service_type === "DELIVERY"
                                        ? "Antar"
                                        : "Ambil"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <p
                            className={`text-base font-black transition-colors tabular-nums ${isSelected ? "text-primary" : "text-slate-900"}`}
                        >
                            {formatRupiah(order.grand_total)}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            {formatTime(order.created_at)}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
