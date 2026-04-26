import React from "react";
import { Label } from "@/components/ui/label";

export function FormField({ label, children, error }) {
    return (
        <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</Label>
            {children}
            {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
        </div>
    );
}
