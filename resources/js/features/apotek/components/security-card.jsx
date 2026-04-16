import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export function SecurityCard() {
    return (
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 bg-white">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-slate-50 flex flex-row items-center gap-3">
                <Shield className="h-5 w-5 text-[#0b3b60]" />
                <CardTitle className="text-lg font-bold text-slate-800">
                    Keamanan Akun
                </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-6">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Password Saat Ini
                        </Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60]"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Password Baru
                            </Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Konfirmasi Password
                            </Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60]"
                            />
                        </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <Button className="bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-xl px-6">
                            Perbarui Keamanan
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
