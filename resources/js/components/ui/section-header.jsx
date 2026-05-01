import React from "react";

export function SectionHeader({ icon: Icon, label, color = "text-primary" }) {
    return (
        <div className="flex items-center gap-2.5 mb-5">
            <div
                className={`w-1 h-5 rounded-full ${color.replace("text-", "bg-")}`}
            />
            <p
                className={`text-[10px] font-black uppercase tracking-[0.2em] ${color} flex items-center gap-2`}
            >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </p>
        </div>
    );
}
