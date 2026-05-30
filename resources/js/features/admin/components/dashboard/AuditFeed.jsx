import React from "react";
import {
    ShieldAlert,
    UserCheck,
    Settings,
    CheckCircle2,
    ChevronRight,
    Activity,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AuditFeed({ auditLogs = [] }) {
    // Helper to return beautiful icon and color based on title/type
    const getAuditMeta = (title) => {
        const t = title.toLowerCase();
        if (t.includes("user") || t.includes("pengguna")) {
            return {
                icon: UserCheck,
                color: "bg-blue-50 text-blue-600 border-blue-150",
            };
        } else if (
            t.includes("ekosistem") ||
            t.includes("sistem") ||
            t.includes("status")
        ) {
            return {
                icon: Settings,
                color: "bg-indigo-50 text-indigo-600 border-indigo-150",
            };
        } else if (
            t.includes("legalitas") ||
            t.includes("verifikasi") ||
            t.includes("apotek")
        ) {
            return {
                icon: CheckCircle2,
                color: "bg-emerald-50 text-emerald-655 border-emerald-150",
            };
        }
        return {
            icon: ShieldAlert,
            color: "bg-slate-50 text-slate-500 border-slate-150",
        };
    };

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
                <div className="space-y-6 relative flex-1 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {/* Vertical timeline connector */}
                    <div className="absolute left-6 top-3 bottom-3 w-px bg-slate-100"></div>

                    {auditLogs.map((log) => {
                        const meta = getAuditMeta(log.title);
                        const LogIcon = meta.icon;

                        return (
                            <div
                                key={log.id}
                                className="relative pl-12 group flex items-start gap-4"
                            >
                                {/* Timeline Bullet Icon */}
                                <div
                                    className={`absolute left-1.5 top-0.5 w-9 h-9 rounded-xl border flex items-center justify-center transition-all group-hover:scale-105 ${meta.color} bg-white shadow-xs z-10`}
                                >
                                    <LogIcon className="w-4.5 h-4.5" />
                                </div>

                                <div className="space-y-1 flex-1">
                                    <div className="flex justify-between items-center gap-2">
                                        <h4 className="text-xs font-bold text-slate-850 group-hover:text-primary transition-colors">
                                            {log.title}
                                        </h4>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                                            {log.time}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                        {log.desc}
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
