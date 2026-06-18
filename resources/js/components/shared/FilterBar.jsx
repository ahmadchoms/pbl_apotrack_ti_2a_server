import React, { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
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

/**
 * FilterBar Component
 * 
 * Props:
 * - configs: Array of filter configurations
 *   { 
 *     type: 'search' | 'select', 
 *     key: string, 
 *     placeholder?: string, 
 *     label?: string, 
 *     options?: Array<{value, label}> 
 *   }
 * - currentFilters: Object containing current filter values
 * - onFilterChange: Callback function (updates: Object) => void
 * - onReset: Callback function () => void
 * - actions: React Node (optional buttons/actions on the right)
 */
export function FilterBar({ configs, currentFilters, onFilterChange, onReset, actions }) {
    const [localFilters, setLocalFilters] = useState({ ...currentFilters });

    useEffect(() => {
        setLocalFilters({ ...currentFilters });
    }, [currentFilters]);

    const updateLocal = (key, value) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onFilterChange(localFilters);
    };

    const handleReset = () => {
        setLocalFilters({});
        onReset();
    };

    const hasActiveFilters = Object.entries(currentFilters).some(([key, val]) => {
        if (key === 'page') return false;
        if (val === 'all' || val === '' || val === null || val === undefined) return false;
        return true;
    });

    const hasChanges = Object.entries(localFilters).some(([key, val]) => {
        return val !== currentFilters[key];
    });

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {configs.map((config) => {
                    if (config.type === "search") {
                        return (
                            <InputGroup key={config.key} className="rounded-2xl min-w-64 bg-white shadow-sm border-slate-200">
                                <InputGroupInput
                                    placeholder={config.placeholder || "Cari..."}
                                    className="h-11 text-sm border-0 focus:ring-0"
                                    value={localFilters[config.key] || ""}
                                    onChange={(e) => updateLocal(config.key, e.target.value)}
                                />
                                <InputGroupAddon className="pr-4">
                                    <Search className="w-4 h-4 text-slate-400" />
                                </InputGroupAddon>
                            </InputGroup>
                        );
                    }

                    if (config.type === "select") {
                        return (
                            <Select 
                                key={config.key}
                                value={localFilters[config.key] || "all"} 
                                onValueChange={(val) => updateLocal(config.key, val === "all" ? "" : val)}
                            >
                                <SelectTrigger className="h-11 min-w-40 rounded-2xl bg-white border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                                    <SelectValue placeholder={config.label || "Semua"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                                    {!config.options?.some(opt => opt.value === "all") && (
                                        <SelectItem value="all" className="text-xs font-bold">
                                            Semua {config.label || ""}
                                        </SelectItem>
                                    )}
                                    {(config.options || []).map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value} className="text-xs font-bold">
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    }

                    return null;
                })}

                <Button
                    onClick={handleApply}
                    disabled={!hasChanges}
                    className="h-11 px-5 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Filter className="w-4 h-4 mr-1.5" /> Terapkan Filter
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="h-11 px-4 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-bold text-xs"
                    >
                        <X className="w-4 h-4 mr-2" /> Reset
                    </Button>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    {actions}
                </div>
            )}
        </div>
    );
}
