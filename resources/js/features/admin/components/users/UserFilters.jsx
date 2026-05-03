import React from "react";
import { Search, UserPlus, X } from "lucide-react";
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
import { ROLE_CONFIG } from "@/features/admin/lib/constants";
import { router } from "@inertiajs/react";

export function UserFilters({ filters, onFilter, onReset }) {
    const handleRoleChange = (val) => {
        onFilter({ role: val });
    };

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
                        placeholder="Cari username atau email..."
                        className="h-11 text-sm border-0 focus:ring-0"
                        value={filters.search || ""}
                        onChange={handleSearchChange}
                    />
                    <InputGroupAddon className="pr-4">
                        <Search className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                </InputGroup>

                <Select value={filters.role || "all"} onValueChange={handleRoleChange}>
                    <SelectTrigger className="h-11 w-44 rounded-2xl bg-white border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                        <SelectValue placeholder="Semua Peran" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                        <SelectItem value="all" className="text-xs font-bold">Semua Peran</SelectItem>
                        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                            <SelectItem key={key} value={key} className="text-xs font-bold">
                                {cfg.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
                    <SelectTrigger className="h-11 w-40 rounded-2xl bg-white border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                        <SelectItem value="all" className="text-xs font-bold">Semua Status</SelectItem>
                        <SelectItem value="active" className="text-xs font-bold">Aktif</SelectItem>
                        <SelectItem value="inactive" className="text-xs font-bold">Non-Aktif</SelectItem>
                    </SelectContent>
                </Select>

                {(filters.search || filters.role !== "all" || filters.status !== "all") && (
                    <Button
                        variant="ghost"
                        onClick={onReset}
                        className="h-11 px-4 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-bold text-xs"
                    >
                        <X className="w-4 h-4 mr-2" /> Reset
                    </Button>
                )}
            </div>

            <Button
                onClick={() => router.get(route('admin.users.create'))}
                className="h-11 px-6 rounded-2xl bg-[#0b3b60] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all gap-2 shadow-lg shadow-blue-900/20"
            >
                <UserPlus className="w-4 h-4" /> Tambah Pengguna
            </Button>
        </div>
    );
}
