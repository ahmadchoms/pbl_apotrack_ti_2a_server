import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    History, 
    ArrowUpRight, 
    ShieldAlert, 
    UserPlus, 
    Building2,
    LogIn,
    Info,
    XCircle,
    FileText
} from "lucide-react";
import { Link } from "@inertiajs/react";

const ACTION_MAP = {
    'LOGIN': { icon: LogIn, color: "text-[#0b3b60]", bg: "bg-blue-50" },
    'PROFILE_UPDATE': { icon: Info, color: "text-emerald-500", bg: "bg-emerald-50" },
    'PASSWORD_CHANGE': { icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-50" },
    'PHARMACY_CREATE': { icon: Building2, color: "text-indigo-500", bg: "bg-indigo-50" },
    'USER_DELETE': { icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
    'DEFAULT': { icon: FileText, color: "text-slate-500", bg: "bg-slate-50" }
};

const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Baru saja';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date);
};

export function AuditLogCard({ logs = [] }) {
    return (
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white group flex flex-col h-full">
            <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
                        Jejak Audit
                    </CardTitle>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Aktivitas Sistem</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-[#0b3b60] transition-colors">
                    <History className="h-6 w-6" />
                </div>
            </CardHeader>
            <CardContent className="p-10 pt-4 flex-1">
                <div className="space-y-8 relative">
                    <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-100"></div>
                    {logs.length > 0 ? (
                        logs.map((log) => {
                            const config = ACTION_MAP[log.action] || ACTION_MAP['DEFAULT'];
                            const Icon = config.icon;
                            
                            return (
                                <div key={log.id} className="relative pl-8 group/item">
                                    <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover/item:scale-125 bg-slate-200`}></div>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center ${config.color} shrink-0`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className="text-xs font-black text-slate-800 leading-none truncate pr-2 uppercase tracking-tight">
                                                    {log.action.replace(/_/g, ' ')}
                                                </h4>
                                                <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">
                                                    {formatRelativeTime(log.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed truncate">
                                                {log.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Belum ada aktivitas</p>
                        </div>
                    )}
                </div>
                
                <Link 
                    href={route('admin.profile.audit-history')}
                    className="w-full mt-10 h-14 rounded-2xl bg-slate-50 hover:bg-[#0b3b60] text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                    Tampilkan Laporan Lengkap
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
            </CardContent>
        </Card>
    );
}