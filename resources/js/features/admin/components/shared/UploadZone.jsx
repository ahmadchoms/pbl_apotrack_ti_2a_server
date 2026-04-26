import React from "react";
import { Label } from "@/components/ui/label";

export function UploadZone({ icon, label, subLabel, hint }) {
    return (
        <div className="space-y-3">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</Label>
            <div className="group cursor-pointer p-6 rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-[#0b3b60]/30 transition-all text-center">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 mx-auto mb-3 group-hover:scale-110 transition-transform">{icon}</div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{subLabel}</p>
                {hint && <p className="text-[9px] font-bold text-slate-300 mt-1.5 uppercase tracking-widest">{hint}</p>}
            </div>
        </div>
    );
}
