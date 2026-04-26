import React from "react";

export function SectionHeader({ icon, bg, color, title }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center ${color}`}>{icon}</div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
        </div>
    );
}
