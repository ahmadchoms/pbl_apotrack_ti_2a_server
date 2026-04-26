import React from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header({ mobileSidebar }) {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4 flex-1">
                {mobileSidebar && (
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2 -ml-2 text-slate-500 hover:text-primary transition-colors focus:outline-none">
                                    <Menu className="h-6 w-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="p-0 w-64 bg-white border-0 shadow-xl [&>button]:hidden"
                            >
                                {mobileSidebar}
                            </SheetContent>
                        </Sheet>
                    </div>
                )}

                <div className="relative w-full max-w-md group hidden sm:block">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                        <Search className="h-4 w-4" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Cari nama pengguna dan apotek..."
                        className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary rounded-xl h-10 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button className="relative p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#0b3b60] hover:bg-white transition-all shadow-sm">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-800 group-hover:text-[#0b3b60] transition-colors leading-none">
                            Administrator
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 leading-none">
                            Super Admin
                        </p>
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-slate-100 group-hover:border-[#0b3b60] transition-colors shadow-sm">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=0b3b60" />
                        <AvatarFallback className="bg-[#0b3b60] text-white font-black">
                            AD
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
