import React from "react";
import { User, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

export function OrderPatientInfo({ patientName, setPatientName, rxNumber, setRxNumber }) {
    const inputWrapper = "flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-1.5 focus-within:border-[#00346C]/40 focus-within:shadow-lg focus-within:shadow-slate-200 transition-all gap-3 h-12";

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className={inputWrapper}>
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col min-w-[180px]">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pasien</span>
                    <Input
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Nama Lengkap"
                        className="h-auto p-0 border-0 focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-300"
                    />
                </div>
            </div>

            <div className={inputWrapper}>
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col min-w-[140px]">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">No. Resep</span>
                    <Input
                        value={rxNumber}
                        onChange={(e) => setRxNumber(e.target.value)}
                        placeholder="Opsional"
                        className="h-auto p-0 border-0 focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-300"
                    />
                </div>
            </div>
        </div>
    );
}
