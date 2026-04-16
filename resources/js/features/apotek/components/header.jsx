import React from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="relative w-full max-w-md group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0b3b60] transition-colors">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    type="text"
                    placeholder="Cari obat, resep, atau nama pasien..."
                    className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0b3b60] rounded-xl h-10 transition-all"
                />
            </div>

            <div className="flex items-center gap-5">
                <button className="relative p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#0b3b60] hover:bg-white transition-all">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-slate-200"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-[#0b3b60] transition-colors">
                            Prayitno
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Apoteker Utama
                        </p>
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-slate-100 group-hover:border-[#0b3b60] transition-colors">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Prayitno&backgroundColor=0b3b60" />
                        <AvatarFallback className="bg-[#0b3b60] text-white">
                            PP
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
