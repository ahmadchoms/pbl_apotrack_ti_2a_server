import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export function AdminPagination({ pagination, itemLabel = "item" }) {
    if (!pagination || !pagination.data || pagination.data.length === 0)
        return null;
    const onPageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest order-2 sm:order-1">
                Menampilkan {pagination.from} – {pagination.to} dari{" "}
                {pagination.total} {itemLabel}
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-2xl bg-white border-slate-200 text-slate-400 hover:text-[#0b3b60] hover:border-[#0b3b60]/20 disabled:opacity-30 transition-all shadow-sm"
                    disabled={!pagination.prev_page_url}
                    onClick={() => onPageChange(pagination.prev_page_url)}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1.5">
                    {pagination.meta.links
                        .filter((l) => !isNaN(l.label))
                        .map((link, i) => (
                            <button
                                key={i}
                                onClick={() => onPageChange(link.url)}
                                className={`w-10 h-10 rounded-2xl text-[11px] font-black transition-all shadow-sm ${link.active ? "bg-[#0b3b60] text-white shadow-[#0b3b60]/20" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"}`}
                            >
                                {link.label}
                            </button>
                        ))}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-2xl bg-white border-slate-200 text-slate-400 hover:text-[#0b3b60] hover:border-[#0b3b60]/20 disabled:opacity-30 transition-all shadow-sm"
                    disabled={!pagination.next_page_url}
                    onClick={() => onPageChange(pagination.next_page_url)}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
