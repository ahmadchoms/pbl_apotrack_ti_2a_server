import React from "react";
import { Search, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AuditFilters({ search, setSearch, actionType, setActionType, status, setStatus, dateFrom, setDateFrom, dateTo, setDateTo, actionTypes = [] }) {
    return (
        <Card className="border-0 shadow-xl shadow-slate-200/30 rounded-[2.5rem] bg-white overflow-visible">
            <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="space-y-2 lg:col-span-1">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pencarian</Label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari aktivitas..." className="pl-11 h-12 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/10 font-bold text-xs" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe Aksi</Label>
                        <Select value={actionType} onValueChange={setActionType}>
                            <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-transparent text-xs font-bold">
                                <SelectValue placeholder="Semua Tipe" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                <SelectItem value="all" className="text-xs font-bold">Semua Tipe</SelectItem>
                                {actionTypes.map((type) => (
                                    <SelectItem key={type} value={type} className="text-xs font-bold">{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-transparent text-xs font-bold">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                <SelectItem value="all" className="text-xs font-bold">Semua Status</SelectItem>
                                <SelectItem value="SUCCESS" className="text-xs font-bold">Berhasil</SelectItem>
                                <SelectItem value="FAILED" className="text-xs font-bold">Gagal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dari Tanggal</Label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="pl-11 h-12 rounded-2xl bg-slate-50 border-transparent text-xs font-bold" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sampai Tanggal</Label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="pl-11 h-12 rounded-2xl bg-slate-50 border-transparent text-xs font-bold" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
