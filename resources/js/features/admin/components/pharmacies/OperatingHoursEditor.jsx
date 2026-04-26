import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DAY_NAMES } from "@/features/admin/lib/constants";

export function OperatingHoursEditor({ hours, onHourChange }) {
    return (
        <div className="space-y-6">
            {hours.map((hour) => {
                const dayName = DAY_NAMES[hour.day_of_week];
                return (
                    <div key={hour.day_of_week} className={`flex items-center gap-6 p-5 rounded-2xl transition-all ${hour.is_closed ? "bg-slate-50 opacity-60" : "bg-white border border-slate-100"}`}>
                        <div className="w-20 shrink-0">
                            <p className="text-xs font-black text-slate-900 tracking-tight">{dayName}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={hour.is_closed} onChange={(e) => onHourChange(hour.day_of_week, "is_closed", e.target.checked)} className="w-4 h-4 rounded-md border-slate-300 text-[#0b3b60]" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tutup</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={hour.is_24_hours} disabled={hour.is_closed} onChange={(e) => onHourChange(hour.day_of_week, "is_24_hours", e.target.checked)} className="w-4 h-4 rounded-md border-slate-300 text-[#0b3b60]" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24 Jam</span>
                            </label>
                        </div>
                        {!hour.is_closed && !hour.is_24_hours && (
                            <div className="flex items-center gap-3">
                                <Input type="time" value={hour.open_time} onChange={(e) => onHourChange(hour.day_of_week, "open_time", e.target.value)} className="h-10 rounded-xl bg-slate-50 border-transparent text-xs font-bold w-28" />
                                <span className="text-slate-300 text-xs font-black">–</span>
                                <Input type="time" value={hour.close_time} onChange={(e) => onHourChange(hour.day_of_week, "close_time", e.target.value)} className="h-10 rounded-xl bg-slate-50 border-transparent text-xs font-bold w-28" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
