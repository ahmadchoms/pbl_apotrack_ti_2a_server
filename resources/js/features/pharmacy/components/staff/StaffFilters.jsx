import React from "react";
import { Search, UserPlus, X, Filter } from "lucide-react";
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

export function StaffFilters({ search, setSearch, status, setStatus, onReset, onAdd }) {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <InputGroup className="rounded-2xl min-w-64 bg-white shadow-sm border-slate-200">
                    <InputGroupInput
                        placeholder="Cari nama staff, email..."
                        className="h-11 text-sm border-0 focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <InputGroupAddon className="pr-4">
                        <Search className="w-4 h-4 text-slate-400" />
                    </InputGroupAddon>
                </InputGroup>

                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-11 w-44 rounded-2xl bg-white border-slate-200 shadow-sm text-xs font-black text-slate-600">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                        <SelectItem value="all" className="text-xs font-black">Semua Status</SelectItem>
                        <SelectItem value="active" className="text-xs font-black">Aktif</SelectItem>
                        <SelectItem value="inactive" className="text-xs font-black">Non-Aktif</SelectItem>
                    </SelectContent>
                </Select>

                {(search || status !== "all") && (
                    <Button
                        variant="ghost"
                        onClick={onReset}
                        className="h-11 px-4 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-xs"
                    >
                        <X className="w-4 h-4 mr-2" /> Reset
                    </Button>
                )}
            </div>

            <Button
                onClick={onAdd}
                className="h-11 px-6 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all gap-2 shadow-lg shadow-blue-900/10"
            >
                <UserPlus className="w-4 h-4" /> Tambah Staff
            </Button>
        </div>
    );
}
