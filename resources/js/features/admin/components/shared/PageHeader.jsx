import React from "react";

export function PageHeader({ subtitle, title, description, children }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <p className="text-[10px] font-black text-[#0b3b60] uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                    <span className="w-8 h-px bg-[#0b3b60]/30" />
                    {subtitle}
                </p>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
                {description && (
                    <p className="text-sm text-slate-400 font-medium mt-1">{description}</p>
                )}
            </div>
            {children && <div className="flex items-center gap-4">{children}</div>}
        </div>
    );
}
