import React from "react";
import { CATEGORY_COLORS, DEFAULT_COLOR } from "@/features/pharmacy/lib/constants";

export function CategoryBadge({ category }) {
    const c = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {category}
        </span>
    );
}
