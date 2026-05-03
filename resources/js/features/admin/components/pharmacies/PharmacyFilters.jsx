import React from "react";
import { Search, Building2, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { VERIFICATION_OPTIONS } from "@/features/admin/lib/constants";
import { router } from "@inertiajs/react";

export function PharmacyFilters({ filters, onFilter, onReset }) {
    const handleStatusChange = (val) => {
        onFilter({ status: val });
    };

    const handleSearchChange = (e) => {
        onFilter({ search: e.target.value });
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <InputGroup className="rounded-2xl min-w-64 bg-white shadow-sm border-slate-200">
                    <InputGroupInput
                        placeholder="Cari nama, alamat, telepon..."
                        className="h-11 text-sm border-0 focus:ring-0"
                        value={filters.search || ""}
                        onChange={handleSearchChange}
                    />
                    <InputGroupAddon className="pr-4">
                        <Search className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                </InputGroup>

                <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
                    <SelectTrigger className="h-11 w-44 rounded-2xl bg-white border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                        <SelectItem value="all" className="text-xs font-bold">Semua Status</SelectItem>
                        {VERIFICATION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs font-bold">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {(filters.search || filters.status !== "all") && (
                    <Button
                        variant="ghost"
                        onClick={onReset}
                        className="h-11 px-4 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-bold text-xs"
                    >
                        <X className="w-4 h-4 mr-2" /> Reset
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
                <Button
                    onClick={() => window.open(route('admin.pharmacies.export'))}
                    variant="outline"
                    className="h-11 px-6 rounded-2xl bg-blue-50 border-0 text-[#0b3b60] font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all gap-2"
                >
                    <Download className="w-4 h-4" /> Ekspor
                </Button>
                <Button
                    onClick={() => router.get('/admin/pharmacies/create')}
                    className="h-11 px-6 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all gap-2 shadow-lg shadow-primary/20"
                >
                    <Building2 className="w-4 h-4" /> Tambah Apotek
                </Button>
            </div>
        </div>
    );
}
