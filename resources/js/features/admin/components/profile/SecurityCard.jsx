import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, KeyRound, RefreshCw } from "lucide-react";

export function SecurityCard() {
    return (
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white group">
            <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
                        Protokol Keamanan
                    </CardTitle>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sertifikasi & Enkripsi</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-[#0b3b60] transition-colors">
                    <Shield className="h-6 w-6" />
                </div>
            </CardHeader>
            <CardContent className="p-10 pt-4">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Current Access Key
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0b3b60]/20 transition-all font-bold"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                New Secret Key
                            </Label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0b3b60]/20 transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Verify Secret Key
                            </Label>
                            <div className="relative">
                                <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0b3b60]/20 transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <Shield className="w-4 h-4 text-[#0b3b60]" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                            Password terakhir diubah <span className="text-[#0b3b60]">14 hari yang lalu</span>. <br/>
                            Disarankan untuk merotasi kunci akses setiap 90 hari.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Button className="w-full bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#0b3b60]/20 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Perbarui Protokol Keamanan
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
