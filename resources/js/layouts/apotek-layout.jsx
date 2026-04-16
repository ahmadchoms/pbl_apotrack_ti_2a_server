import { Header } from "@/features/apotek/components/header";
import { Sidebar } from "@/features/apotek/components/sidebar";
import React from "react";

export function DashboardApotekLayout({ children, activeMenu }) {
    return (
        <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
            <Sidebar activeMenu={activeMenu} />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Header />

                <main className="flex-1 overflow-y-auto p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
