import React from "react";
import { motion } from "framer-motion";
import {
    Phone,
    MapPin,
    Clock,
    Users,
    Star,
    ShieldAlert,
    Pill,
    ShoppingBag,
    Eye,
    Pencil,
    Trash2,
    MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VERIFICATION_CONFIG } from "@/features/admin/lib/constants";
import { getOperatingLabel } from "@/features/admin/lib/helpers";

function StatChip({ icon: Icon, value, label }) {
    return (
        <div className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex-1">
            <Icon className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm font-semibold text-primary leading-none">
                {value ?? 0}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
                {label}
            </span>
        </div>
    );
}

function InfoRow({ icon: Icon, children }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
            <div className="text-[11.5px] text-slate-400 leading-relaxed font-medium">
                {children}
            </div>
        </div>
    );
}

export function PharmacyCard({ pharmacy, onDetail, onEdit, onDelete }) {
    const vCfg =
        VERIFICATION_CONFIG[pharmacy.verification_status] ??
        VERIFICATION_CONFIG.PENDING;
    const opLabel = getOperatingLabel(pharmacy.hours);
    const apoteker = pharmacy.staffs?.find((s) => s.role === "APOTEKER");
    const staffCount = pharmacy.staffs?.length ?? 0;
    const primaryImage = pharmacy.primary_image;
    const isProblematic = pharmacy.is_force_closed || !pharmacy.is_active;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
        >
            <Card className="relative pt-0 flex flex-col h-full rounded-[28px] overflow-hidden border-0 shadow-2xl shadow-black/40 group">
                <div className="relative h-64 shrink-0 overflow-hidden bg-[#0b3b60]">
                    {primaryImage && (
                        <img
                            src={primaryImage}
                            alt={pharmacy.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-[#0d1a27] via-[#0d1a27]/30 to-transparent" />
                    <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between">
                        <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-semibold tracking-wide backdrop-blur-sm ${vCfg.badge}`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${vCfg.dot} animate-pulse`}
                            />
                            {vCfg.label}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-8 h-8 p-0 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="rounded-2xl border-slate-700 bg-[#0d1a27] shadow-2xl w-44 p-2"
                            >
                                <DropdownMenuItem
                                    onClick={() => onDetail?.(pharmacy)}
                                    className="rounded-xl text-xs font-medium gap-2 py-2.5 cursor-pointer text-slate-300 focus:bg-white/5 focus:text-white"
                                >
                                    <Eye className="w-3.5 h-3.5" /> Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onEdit?.(pharmacy)}
                                    className="rounded-xl text-xs font-medium gap-2 py-2.5 cursor-pointer text-slate-300 focus:bg-white/5 focus:text-white"
                                >
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                    Apotek
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(pharmacy)}
                                    className="rounded-xl text-xs font-medium gap-2 py-2.5 cursor-pointer text-rose-400 focus:bg-rose-500/10 focus:text-rose-300"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                        {isProblematic ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 backdrop-blur-sm">
                                <ShieldAlert className="w-3 h-3 text-rose-400" />
                                <span className="text-[10px] font-semibold text-rose-300 tracking-wide">
                                    {pharmacy.is_force_closed
                                        ? "Tutup Paksa"
                                        : "Nonaktif"}
                                </span>
                            </div>
                        ) : (
                            <div />
                        )}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-white">
                                {pharmacy.rating > 0 ? pharmacy.rating : "—"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                                ({pharmacy.total_reviews})
                            </span>
                        </div>
                    </div>
                </div>
                <CardContent className="flex flex-col flex-1 gap-4">
                    <div>
                        <h3 className="text-[13.5px] font-semibold text-primary leading-snug line-clamp-2 mb-1.5 tracking-tight">
                            {pharmacy.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                            <Phone className="w-3 h-3" />
                            {pharmacy.phone || "—"}
                        </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-300 p-3.5 flex flex-col gap-2.5">
                        <InfoRow icon={MapPin}>{pharmacy.address}</InfoRow>
                        <div className="h-px bg-slate-300" />
                        <div className="flex items-center justify-between">
                            <InfoRow icon={Clock}>{opLabel.text}</InfoRow>
                            {opLabel.sub && (
                                <span className="text-[10px] text-slate-600 font-medium">
                                    {opLabel.sub}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <StatChip
                            icon={Users}
                            value={staffCount}
                            label="Staf"
                        />
                        <StatChip
                            icon={Pill}
                            value={pharmacy.medicines_count}
                            label="Obat"
                        />
                        <StatChip
                            icon={ShoppingBag}
                            value={pharmacy.orders_count}
                            label="Order"
                        />
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300">
                        <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 rounded-xl border border-white/10">
                                <AvatarImage src={apoteker?.user?.avatar_url} />
                                <AvatarFallback className="bg-[#1a4a72] text-white text-[9px] font-semibold rounded-xl">
                                    {apoteker?.user?.username
                                        ?.substring(0, 2)
                                        .toUpperCase() || "—"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-[11.5px] font-semibold text-primary leading-none">
                                    {apoteker?.user?.username ||
                                        "Belum ditugaskan"}
                                </p>
                                <p className="text-[10px] text-slate-600 font-medium mt-0.5">
                                    Apoteker
                                </p>
                            </div>
                        </div>
                        <span className="text-[9px] font-medium text-slate-600 tracking-widest uppercase">
                            {pharmacy.legality?.sia_number || "—"}
                        </span>
                    </div>
                    <div className="mt-auto flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => onDetail?.(pharmacy)}
                            className="flex-1 h-10 rounded-2xl text-[11px] font-semibold text-primary bg-white border border-slate-300 hover:bg-slate-100 transition-all"
                        >
                            <Eye className="w-3.5 h-3.5 mr-1.5" /> Detail
                        </Button>
                        <Button
                            onClick={() => onEdit?.(pharmacy)}
                            className="flex-1 h-10 rounded-2xl text-[11px] font-semibold bg-[#1a6fad] hover:bg-[#1e7fc2] text-white border-0 transition-all"
                        >
                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onDelete?.(pharmacy)}
                            className="w-10 h-10 p-0 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-600 border border-rose-500/20 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
