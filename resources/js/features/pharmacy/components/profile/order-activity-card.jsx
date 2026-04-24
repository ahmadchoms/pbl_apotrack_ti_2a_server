import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    ShoppingBag,
    CheckCircle2,
    Clock,
    ChevronRight,
    FileText,
    CreditCard,
} from "lucide-react";

const orderActivities = [
    {
        id: "ORD-88219",
        time: "2 Menit yang lalu",
        items: "Amoxicillin 500mg, Paracetamol 500mg",
        status: "processing",
        customer: "Budi Santoso",
        total: "Rp 45.000",
        payment: "QRIS",
    },
    {
        id: "ORD-88215",
        time: "15 Menit yang lalu",
        items: "Vitamin C, Zinc",
        status: "completed",
        customer: "Siti Aminah",
        total: "Rp 120.000",
        payment: "Transfer Bank",
    },
    {
        id: "ORD-88210",
        time: "1 Jam yang lalu",
        items: "Ibuprofen 400mg, Sirup Batuk",
        status: "completed",
        customer: "Aditya Wijaya",
        total: "Rp 85.000",
        payment: "Tunai",
    },
    {
        id: "ORD-88198",
        time: "3 Jam yang lalu",
        items: "Insulin Glargine",
        status: "completed",
        customer: "Dr. Sarah",
        total: "Rp 350.000",
        payment: "Asuransi",
    },
];

export function OrderActivityCard() {
    return (
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 bg-white">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#0b3b60]" />
                    <CardTitle className="text-lg font-bold text-slate-800">
                        Aktivitas Pesanan
                    </CardTitle>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="text-xs font-bold text-[#0b3b60] hover:underline">
                            Lihat Semua
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl rounded-3xl p-8">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Semua Aktivitas Pesanan
                            </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[450px] w-full pr-4">
                            <div className="space-y-4">
                                {orderActivities.map((order, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 gap-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`p-3 rounded-xl mt-1 ${order.status === "processing" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"}`}
                                            >
                                                {order.status ===
                                                "processing" ? (
                                                    <ShoppingBag className="h-6 w-6" />
                                                ) : (
                                                    <CheckCircle2 className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-base font-bold text-slate-800">
                                                        {order.id}
                                                    </p>
                                                    {order.status ===
                                                    "processing" ? (
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-md">
                                                            Diproses
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-md">
                                                            Selesai
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />{" "}
                                                    {order.time}
                                                </p>
                                                <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5 pt-1">
                                                    <FileText className="h-4 w-4 text-slate-400" />{" "}
                                                    {order.items}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
                                            <div className="text-left sm:text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                                    Total
                                                </p>
                                                <p className="text-base font-bold text-[#0b3b60]">
                                                    {order.total}
                                                </p>
                                            </div>
                                            <div className="text-right mt-0 sm:mt-2">
                                                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                                    <CreditCard className="h-3.5 w-3.5" />{" "}
                                                    {order.payment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[220px] px-8 pt-4 pb-4">
                    <div className="space-y-4">
                        {orderActivities.slice(0, 3).map((order, idx) => (
                            <div
                                key={idx}
                                className="group flex items-center justify-between p-4 bg-slate-50/80 hover:bg-blue-50/50 rounded-2xl border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-2.5 rounded-xl ${order.status === "processing" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"}`}
                                    >
                                        {order.status === "processing" ? (
                                            <ShoppingBag className="h-5 w-5" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-slate-800">
                                                {order.id}
                                            </p>
                                            {order.status === "processing" && (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                </span>
                                            )}
                                            {order.status === "completed" && (
                                                <span className="relative flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            {order.time} • {order.items}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-[#0b3b60] transition-colors" />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
