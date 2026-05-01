import React from "react";
import { Search, Filter, X } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function OrderFilter({
    search,
    onSearchChange,
    selectedStatuses,
    onStatusChange,
    onClearFilters,
}) {
    const statuses = [
        { id: "PENDING", label: "Menunggu" },
        { id: "PROCESSING", label: "Diproses" },
        { id: "READY_FOR_PICKUP", label: "Siap Diambil" },
        { id: "SHIPPED", label: "Dikirim" },
        { id: "DELIVERED", label: "Sampai" },
        { id: "COMPLETED", label: "Selesai" },
        { id: "CANCELLED", label: "Dibatalkan" },
    ];

    const hasFilters = search || selectedStatuses.length > 0;

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <InputGroup className="rounded-2xl bg-white shadow-sm border-slate-200 focus-within:border-primary/40 transition-all">
                    <InputGroupAddon className="pl-4">
                        <Search className="w-4.5 h-4.5 text-slate-400" />
                    </InputGroupAddon>
                    <InputGroupInput
                        placeholder="Cari No. Pesanan atau Nama Pelanggan..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="h-12 text-sm border-0 focus:ring-0"
                    />
                </InputGroup>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-12 px-5 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-600 gap-2 shadow-sm"
                        >
                            <Filter className="w-4 h-4" />
                            Status ({selectedStatuses.length || "Semua"})
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-2xl p-2 shadow-xl border-slate-100"
                    >
                        <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1.5">
                            Filter Status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        {statuses.map((status) => (
                            <DropdownMenuCheckboxItem
                                key={status.id}
                                checked={selectedStatuses.includes(status.id)}
                                onCheckedChange={() =>
                                    onStatusChange(status.id)
                                }
                                className="rounded-xl text-xs font-bold text-slate-600 py-2.5 focus:bg-slate-50 focus:text-primary"
                            >
                                {status.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        onClick={onClearFilters}
                        className="h-12 px-4 rounded-2xl text-slate-400 hover:text-rose-500 font-bold text-xs gap-2"
                    >
                        <X className="w-4 h-4" />
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
}
