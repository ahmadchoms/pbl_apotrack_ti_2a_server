import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Activity } from "lucide-react";

const auditLogs = [
    {
        id: 1,
        type: "success",
        title: "PERUBAHAN STOK",
        desc: "Update stok Insulin Glargine (+50 unit)",
        time: "HARI INI, 09:45 AM",
        detail: "Dilakukan via Batch System. Supplier: PT. Pharma Medika. Batch ID: B-77812",
    },
    {
        id: 2,
        type: "warning",
        title: "PENAMBAHAN OBAT BARU",
        desc: "Validasi resep digital dr. Sarah (ID: 9921)",
        time: "HARI INI, 08:20 AM",
        detail: "Memerlukan konfirmasi dosis untuk pasien anak (Usia 8th). Resep divalidasi dengan catatan khusus.",
    },
    {
        id: 3,
        type: "success",
        title: "SISTEM",
        desc: "Backup Database Harian Berhasil",
        time: "KEMARIN, 23:59 PM",
        detail: "Size: 45MB. Disimpan di server cloud AWS-AP3. Durasi proses: 12 detik.",
    },
    {
        id: 4,
        type: "warning",
        title: "KEAMANAN",
        desc: "Gagal login terdeteksi",
        time: "KEMARIN, 14:30 PM",
        detail: "IP Address: 192.168.1.105. 3x percobaan gagal pada akun Admin.",
    },
];

export function AuditLogCard() {
    const [expandedLogId, setExpandedLogId] = useState(null);

    const toggleAuditLog = (id) => {
        setExpandedLogId(expandedLogId === id ? null : id);
    };

    return (
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 bg-white">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-[#0b3b60]" />
                    <CardTitle className="text-lg font-bold text-slate-800">
                        Log Audit Klinis
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
                                Semua Log Audit Klinis
                            </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[450px] w-full pr-4 mt-4">
                            <div className="relative pl-3 space-y-8">
                                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="relative pl-6">
                                        <div
                                            className={`absolute left-[-5px] top-1 h-3 w-3 rounded-full border-2 border-white shadow-sm ${log.type === "success" ? "bg-emerald-500" : "bg-amber-500"}`}
                                        ></div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {log.title}
                                        </p>
                                        <p className="text-sm font-semibold text-slate-800 mt-1">
                                            {log.desc}
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-1">
                                            {log.time}
                                        </p>
                                        <div className="mt-3 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100 leading-relaxed">
                                            {log.detail}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="px-8 py-6">
                <div className="relative pl-3 space-y-6">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                    {auditLogs.slice(0, 3).map((log) => (
                        <div
                            key={log.id}
                            className="relative pl-6 cursor-pointer group"
                            onClick={() => toggleAuditLog(log.id)}
                        >
                            <div
                                className={`absolute left-[-5px] top-1 h-3 w-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${
                                    log.type === "success"
                                        ? "bg-emerald-500"
                                        : "bg-amber-500"
                                }`}
                            ></div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {log.title}
                            </p>
                            <p className="text-sm font-semibold text-slate-700 mt-1 group-hover:text-[#0b3b60] transition-colors">
                                {log.desc}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                                {log.time}
                            </p>
                            <AnimatePresence>
                                {expandedLogId === log.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                                            {log.detail}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
