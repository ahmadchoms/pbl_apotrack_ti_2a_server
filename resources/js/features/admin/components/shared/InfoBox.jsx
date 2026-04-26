import React from "react";
import { AlertCircle } from "lucide-react";

export function InfoBox({ text }) {
    return (
        <div className="p-5 bg-blue-50/50 rounded-[1.5rem] border border-blue-100 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0b3b60] shrink-0">
                <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{text}</p>
        </div>
    );
}
