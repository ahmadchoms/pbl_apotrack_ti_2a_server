import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export function SecurityCard() {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pharmacy.profile.updatePassword"), {
            onSuccess: () => {
                toast.success("Password berhasil diperbarui");
                reset();
            },
            onError: (err) => {
                toast.error("Gagal memperbarui password", { description: Object.values(err)[0] });
            }
        });
    };

    return (
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 bg-white">
            <CardHeader className="pb-4 pt-6 px-8 border-b border-slate-50 flex flex-row items-center gap-3">
                <Shield className="h-5 w-5 text-[#0b3b60]" />
                <CardTitle className="text-lg font-bold text-slate-800">
                    Keamanan Akun
                </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Password Saat Ini
                        </Label>
                        <Input
                            type="password"
                            value={data.current_password}
                            onChange={(e) => setData("current_password", e.target.value)}
                            placeholder="••••••••"
                            className={`h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60] ${errors.current_password ? 'border-red-500' : ''}`}
                        />
                        {errors.current_password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.current_password}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Password Baru
                            </Label>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="••••••••"
                                className={`h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60] ${errors.password ? 'border-red-500' : ''}`}
                            />
                            {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Konfirmasi Password
                            </Label>
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                placeholder="••••••••"
                                className={`h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60] ${errors.password_confirmation ? 'border-red-500' : ''}`}
                            />
                        </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <Button type="submit" disabled={processing} className="bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-xl px-6">
                            {processing ? "Memproses..." : "Perbarui Keamanan"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
