import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockDialog } from "@/features/pharmacy/components/dashboard/stock-dialog";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export function CriticalStockCard({ criticalStocks }) {
    return (
        <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-sm rounded-3xl bg-white h-full relative overflow-hidden flex flex-col">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <CardHeader className="pb-4 pt-6 px-8 relative z-10">
                    <CardTitle className="text-lg font-bold text-slate-800">
                        Stok Kritis
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-1">
                        Segera lakukan re-stock untuk item berikut
                    </p>
                </CardHeader>
                <CardContent className="px-8 pb-4 relative z-10 flex-1">
                    <div className="space-y-4">
                        {criticalStocks.map((stock) => (
                            <div
                                key={stock.id}
                                className="flex flex-col gap-1 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
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
                </CardContent>
                <StockDialog stocks={criticalStocks} />
            </Card>
        </motion.div>
    );
}
