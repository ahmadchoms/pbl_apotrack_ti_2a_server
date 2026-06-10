import React from "react";
import { ChevronRight, Activity } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AuditFeed({ auditLogs = [] }) {
    return (
        <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white flex flex-col h-full">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-primary">
                        <Activity className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800">
                            Log Aktivitas Admin
                        </CardTitle>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Riwayat tindakan sistem ekosistem
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 pt-2 flex-1 flex flex-col justify-between">
                <div className="space-y-6 relative flex-1 max-h-75 overflow-y-auto pr-1 no-scrollbar">
                    {auditLogs.map((log) => {
                        return (
                            <div
                                key={log.id}
                                className="relative pl-2 group flex items-start gap-4"
                            >
                                <div className="space-y-1 flex-1">
                                    <div className="flex justify-between items-center gap-2">
                                        <h4 className="text-xs font-bold text-slate-850 group-hover:text-primary transition-colors">
                                            {log.action}
                                        </h4>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                                            {log.relative_time}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                        {log.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-50">
                    <Link
                        href={route("admin.profile.audit-history")}
                        className="w-full"
                    >
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-2xl border-slate-200 hover:bg-primary text-slate-500 hover:text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                        >
                            <span>Lihat Semua Aktivitas</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
