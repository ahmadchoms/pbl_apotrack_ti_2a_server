import React from "react";
import { AlertTriangle } from "lucide-react";
import { LOW_STOCK_THRESHOLD } from "@/features/pharmacy/lib/constants";

export function StockBadge({ stock }) {
    const status =
        stock === 0 ? "empty" : stock <= LOW_STOCK_THRESHOLD ? "low" : "ok";
    if (status === "ok") return null;
    return (
        <span
            className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border ${status === "empty" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}
        >
            <AlertTriangle className="w-2.5 h-2.5" />
            {status === "empty" ? "Habis" : "Hampir Habis"}
        </span>
    );
}
