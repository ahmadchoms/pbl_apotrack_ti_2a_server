import { Header } from "@/features/apotek/components/header";
import { Sidebar } from "@/features/apotek/components/sidebar";
import React from "react";

export function DashboardApotekLayout({ children, activeMenu }) {
    return (
        <div className="flex h-screen bg-slate-50/50 text-slate-800 font-sans overflow-hidden">
            <div className="hidden md:flex shrink-0 z-20 shadow-sm border-r border-slate-100 bg-white">
                <Sidebar activeMenu={activeMenu} />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
                <Header mobileSidebar={<Sidebar activeMenu={activeMenu} />} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
