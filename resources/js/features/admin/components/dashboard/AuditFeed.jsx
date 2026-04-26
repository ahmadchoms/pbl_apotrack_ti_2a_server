import React from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuditFeed({ auditLogs = [] }) {
    return (
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white flex flex-col h-full">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Aktivitas Terkini</CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit Log</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-slate-400" />
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 flex-1">
                <div className="space-y-6 relative">
                    <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-100"></div>
                    {auditLogs.map((log) => (
                        <div key={log.id} className="relative pl-6 group">
                            <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${log.isNew ? "bg-emerald-500" : "bg-blue-500"}`}></div>
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-xs font-black text-slate-800 leading-none">{log.title}</h4>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{log.time}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{log.desc}</p>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-8 h-12 rounded-2xl bg-slate-50 hover:bg-[#0b3b60] text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300">
                    Lihat Semua Aktivitas
                </button>
            </CardContent>
        </Card>
    );
}
