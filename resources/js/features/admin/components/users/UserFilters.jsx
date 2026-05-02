import React from "react";
import { Search, UserPlus, Download } from "lucide-react";
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
import { router } from "@inertiajs/react";

export function UserFilters({
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    onFilter,
}) {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <InputGroup className="rounded-2xl min-w-64 bg-white shadow-sm border-slate-200">
                    <InputGroupInput
                        placeholder="Cari nama, email, atau unit..."
                        className="h-11 text-sm border-0 focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onFilter()}
                    />
                    <InputGroupAddon className="pr-4">
                        <Search className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                </InputGroup>
                <Select
                    value={role}
                    onValueChange={(val) => {
                        setRole(val);
                        setTimeout(() => onFilter({ role: val }), 0);
                    }}
                >
                    <SelectTrigger className="h-11 w-40 rounded-2xl bg-white border-slate-200 shadow-sm text-xs font-bold text-slate-600 focus:ring-[#0b3b60]/20 transition-all">
                        <SelectValue placeholder="Peran" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                        <SelectItem value="all" className="text-xs font-bold">
                            Peran: Semua
                        </SelectItem>
                        <SelectItem
                            value="CUSTOMER"
                            className="text-xs font-bold"
                        >
                            Pengguna
                        </SelectItem>
                        <SelectItem
                            value="APOTEKER"
                            className="text-xs font-bold"
                        >
                            Apoteker
                        </SelectItem>
                        <SelectItem
                            value="STAFF"
                            className="text-xs font-bold"
                        >
                            Staff
                        </SelectItem>
                        <SelectItem
                            value="SUPER_ADMIN"
                            className="text-xs font-bold"
                        >
                            Admin
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={status}
                    onValueChange={(val) => {
                        setStatus(val);
                        setTimeout(() => onFilter({ status: val }), 0);
                    }}
                >
                    <SelectTrigger className="h-11 w-40 rounded-2xl bg-white border-slate-200 shadow-sm text-xs font-bold text-slate-600 focus:ring-[#0b3b60]/20 transition-all">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                        <SelectItem value="all" className="text-xs font-bold">
                            Status: Semua
                        </SelectItem>
                        <SelectItem
                            value="active"
                            className="text-xs font-bold"
                        >
                            Terverifikasi
                        </SelectItem>
                        <SelectItem
                            value="inactive"
                            className="text-xs font-bold"
                        >
                            Tertunda
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <Button
                    onClick={() => window.open(route("admin.users.export"))}
                    variant="outline"
                    className="h-11 px-6 rounded-2xl bg-[#d0e4f5] border-0 text-[#0b3b60] font-black text-[10px] uppercase tracking-widest hover:bg-[#c0d8ed] transition-all gap-2 flex-1 lg:flex-none"
                >
                    <Download className="w-4 h-4" /> Ekspor
                </Button>
                <Button
                    onClick={() => router.get("/admin/users/create")}
                    className="h-11 px-6 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all gap-2 shadow-lg shadow-primary/20 flex-1 lg:flex-none"
                >
                    <UserPlus className="w-4 h-4" /> Tambah Pengguna Baru
                </Button>
            </div>
        </div>
    );
}
