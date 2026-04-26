import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACTION_ICONS, ACTION_COLORS } from "@/features/admin/lib/constants";
import { formatDate, formatTime } from "@/features/admin/lib/helpers";
import { MoreHorizontal } from "lucide-react";

export function AuditLogItem({ log }) {
    const Icon = ACTION_ICONS[log.action] || ACTION_ICONS.DEFAULT;
    const colors = ACTION_COLORS[log.action] || ACTION_COLORS.DEFAULT;
    return (
        <Card className="border-0 shadow-lg shadow-slate-200/20 rounded-3xl bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all group">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl ${colors} flex items-center justify-center shrink-0`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-black text-slate-900 truncate tracking-tight uppercase">{log.action.replace(/_/g, " ")}</h4>
                                <Badge className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border-0 ${log.status === "SUCCESS" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                                    {log.status === "SUCCESS" ? "Berhasil" : "Gagal"}
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500 font-medium line-clamp-1">{log.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 text-right shrink-0">
                        <div className="hidden lg:block text-right">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Data Terdampak</p>
                            <p className="text-[10px] font-bold text-slate-600">{log.metadata ? Object.keys(log.metadata).length : 0} Entitas</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Timestamp</p>
                            <p className="text-[11px] font-black text-slate-800">{formatDate(log.created_at)}</p>
                            <p className="text-[10px] font-bold text-slate-400">{formatTime(log.created_at)} WIB</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-[#0b3b60] group-hover:bg-blue-50 transition-all cursor-pointer">
                            <MoreHorizontal className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
