import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUSES = [
    { label: "Semua", value: "ALL" },
    { label: "Menunggu", value: "PENDING" },
    { label: "Diproses", value: "PROCESSING" },
    { label: "Dikirim", value: "SHIPPED" },
    { label: "Selesai", value: "COMPLETED" },
    { label: "Dibatalkan", value: "CANCELLED" },
];

export function OrderFilters({ search, setSearch, currentStatus, onStatusChange }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <span className="w-8 h-px bg-primary/30" />
                        Arsip Transaksi
                    </p>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        Riwayat Pesanan
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <InputGroup className="rounded-2xl min-w-64 bg-white shadow-sm border-slate-200">
                        <InputGroupInput
                            placeholder="Cari nomor order..."
                            className="h-11 text-sm border-0 focus:ring-0"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputGroupAddon className="pr-4">
                            <Search className="w-4 h-4 text-slate-400" />
                        </InputGroupAddon>
                    </InputGroup>
                    <Badge
                        variant="outline"
                        className="h-11 px-6 rounded-2xl bg-white text-slate-500 border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm"
                    >
                        <Filter className="w-4 h-4" /> Filter
                    </Badge>
                </div>
            </div>

            <div className="bg-white p-1.5 rounded-[1.8rem] border border-slate-200/60 shadow-sm inline-flex">
                <TabsList className="bg-transparent h-11 gap-1">
                    {STATUSES.map((s) => (
                        <TabsTrigger
                            key={s.value}
                            value={s.value}
                            className="rounded-2xl px-6 text-[10px] font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                        >
                            {s.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
        </div>
    );
}
