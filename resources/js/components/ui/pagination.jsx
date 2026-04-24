import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 py-4">
            {links.map((link, i) => {
                const label = link.label
                    .replace("&laquo; Previous", "")
                    .replace("Next &raquo;", "")
                    .trim();

                const isPrev = link.label.includes("Previous");
                const isNext = link.label.includes("Next");

                if (!link.url && !isPrev && !isNext) return null;

                return (
                    <Link
                        key={i}
                        href={link.url || "#"}
                        preserveScroll
                        className={`
                            h-9 min-w-[36px] px-2 rounded-xl flex items-center justify-center text-xs font-black transition-all
                            ${link.active 
                                ? "bg-[#00346C] text-white shadow-lg shadow-[#00346C]/20" 
                                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"}
                            ${!link.url ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
                        `}
                    >
                        {isPrev ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : label}
                    </Link>
                );
            })}
        </div>
    );
}
