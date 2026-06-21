import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export function AdminPagination({ pagination, itemLabel = "item" }) {
    if (!pagination) return null;
    
    const data = pagination.data || pagination.items || [];
    if (data.length === 0) return null;

    const meta = pagination.meta || {};
    const from = meta.from ?? pagination.from ?? 0;
    const to = meta.to ?? pagination.to ?? 0;
    const total = meta.total ?? pagination.total ?? 0;
    const links = meta.links ?? pagination.links ?? [];
    
    const prevPageUrl = pagination.prev_page_url ?? pagination.links?.prev ?? null;
    const nextPageUrl = pagination.next_page_url ?? pagination.links?.next ?? null;

    const onPageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest order-2 sm:order-1">
                Menampilkan {from} – {to} dari{" "}
                {total} {itemLabel}
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-2xl bg-white border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 disabled:opacity-30 transition-all shadow-sm"
                    disabled={!prevPageUrl}
                    onClick={() => onPageChange(prevPageUrl)}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1.5">
                    {Array.isArray(links) &&
                        links
                            .filter((l) => l && !isNaN(l.label))
                            .map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => onPageChange(link.url)}
                                    className={`w-10 h-10 rounded-2xl text-[11px] font-black transition-all shadow-sm ${link.active ? "bg-primary text-white shadow-primary/20" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"}`}
                                >
                                    {link.label}
                                </button>
                            ))}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-2xl bg-white border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 disabled:opacity-30 transition-all shadow-sm"
                    disabled={!nextPageUrl}
                    onClick={() => onPageChange(nextPageUrl)}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
