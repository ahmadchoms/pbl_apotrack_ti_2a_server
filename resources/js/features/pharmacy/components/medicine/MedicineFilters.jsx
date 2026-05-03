import React from "react";
import { Search, Plus, Filter, X, CheckCircle2 } from "lucide-react";
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
import { FILTER_TABS, CATEGORY_COLORS, DEFAULT_COLOR } from "@/features/pharmacy/lib/constants";
import { motion } from "framer-motion";

export function MedicineFilters({ filters, categories, onFilter, onReset }) {
    return (
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    {FILTER_TABS.map((tab) => {
                        const isActive = (filters.status || "all") === tab.key;
                        return (
                            <motion.button
                                key={tab.key}
                                onClick={() => onFilter({ status: tab.key })}
                                whileTap={{ scale: 0.96 }}
                                className={`inline-flex items-center gap-2 h-10 px-5 rounded-full text-xs font-black border transition-all duration-200 ${
                                    isActive
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                {tab.label}
                                {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <InputGroup className="rounded-2xl min-w-64 bg-white shadow-sm border-slate-200">
                        <InputGroupInput
                            placeholder="Cari nama obat..."
                            className="h-11 text-sm border-0 focus:ring-0"
                            value={filters.search || ""}
                            onChange={(e) => onFilter({ search: e.target.value })}
                        />
                        <InputGroupAddon className="pr-4">
                            <Search className="w-4 h-4 text-slate-400" />
                        </InputGroupAddon>
                    </InputGroup>
                    
                    <Select 
                        value={filters.category || "all"} 
                        onValueChange={(val) => onFilter({ category: val })}
                    >
                        <SelectTrigger className="h-11 w-48 rounded-2xl bg-white border-slate-200 shadow-sm text-xs font-black text-slate-600">
                            <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                            <SelectItem value="all" className="text-xs font-black">Semua Kategori</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id || cat.name || cat} value={cat.name || cat} className="text-xs font-black">
                                    {cat.name || cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(filters.search || (filters.status && filters.status !== "all") || (filters.category && filters.category !== "all")) && (
                        <Button
                            variant="ghost"
                            onClick={onReset}
                            className="h-11 px-4 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-xs"
                        >
                            <X className="w-4 h-4 mr-2" /> Reset
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
