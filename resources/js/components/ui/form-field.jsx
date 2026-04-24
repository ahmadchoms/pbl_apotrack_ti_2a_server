import React from "react";
import { Label } from "@/components/ui/label";

export function FormField({ label, required, children, hint, className = "" }) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {label}
                {required && (
                    <span className="text-red-500 text-sm leading-none">*</span>
                )}
            </Label>
            {children}
            {hint && (
                <p className="text-[10px] text-slate-400 font-medium">{hint}</p>
            )}
        </div>
    );
}
