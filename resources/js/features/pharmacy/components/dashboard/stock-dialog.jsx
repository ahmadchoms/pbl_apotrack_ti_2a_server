import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function StockDialog({ stocks }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full text-xs font-bold text-[#0b3b60] tracking-widest uppercase hover:text-blue-700 transition-colors p-4 border-t border-slate-50 relative z-10 bg-white">
                    Lihat Semua Stok Kritis
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        Semua Stok Kritis
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-100 w-full pr-4 mt-4">
                    <div className="space-y-4">
                        {stocks.map((stock) => (
                            <div
                                key={stock.id}
                                className="flex flex-col gap-1 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
                            >
                                <div className="flex items-center gap-3">
                                    {stock.critical ? (
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                                        </span>
                                    ) : (
                                        <span className="relative flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                                    )}
                                    <p className="text-sm font-bold text-[#0b3b60] flex-1">
                                        {stock.name}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={`text-[10px] uppercase font-bold border-0 ${stock.critical ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}
                                    >
                                        Sisa: {stock.sisa}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-slate-400 ml-5">
                                    {stock.type} • System Automation
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
