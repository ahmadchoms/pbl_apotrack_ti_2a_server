import React from "react";
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export function PharmacyStaffList({ staffs }) {
    return (
        <Card className="py-0 gap-0 rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Daftar Staf Terdaftar
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    Pengguna yang memiliki akses ke dashboard apotek ini
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-6">
                    {staffs.map((staff) => (
                        <div
                            key={staff.id}
                            className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
                                    {staff.avatar ? (
                                        <img
                                            src={staff.avatar}
                                            alt={staff.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                                            <User className="w-6 h-6 text-indigo-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800">
                                        {staff.username}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        {staff.email}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                className={`${staff.role === "APOTEKER" ? "bg-indigo-500" : "bg-slate-400"} border-none text-[8px] font-black uppercase tracking-widest px-3 text-white`}
                            >
                                {staff.role}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
