import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, Mail, MapPin, Edit2, Check } from "lucide-react";

import { router, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export function ProfileCard({ user, pharmacy }) {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const { data, setData, put, processing } = useForm({
        name: pharmacy?.name || "",
        phone: pharmacy?.phone || "",
        address: pharmacy?.address || "",
    });

    const handleSaveProfile = () => {
        put(route("pharmacy.profile.update"), {
            onSuccess: () => {
                toast.success("Profil apotek diperbarui");
                setIsEditProfileOpen(false);
            },
            onError: (err) => {
                toast.error("Gagal memperbarui profil", { description: Object.values(err)[0] });
            }
        });
    };

    const toggleStatus = (val) => {
        // This should probably call a specific endpoint to toggle pharmacy status
        router.patch(route("pharmacy.profile.update"), { is_active: val }, {
            onSuccess: () => toast.success(`Status apotek diubah ke ${val ? 'Buka' : 'Tutup'}`)
        });
    };

    return (
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 bg-white">
            <CardContent className="p-8 flex flex-col items-center relative">
                <Dialog
                    open={isEditProfileOpen}
                    onOpenChange={setIsEditProfileOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 text-slate-400 hover:text-[#0b3b60] hover:bg-slate-50 rounded-full"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-3xl p-8">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Edit Profil Apotek
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Nama Apotek
                                </Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Nomor Telepon
                                </Label>
                                <Input
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                    className="h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-[#0b3b60]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Alamat
                                </Label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                    className="w-full flex min-h-[80px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0b3b60]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleSaveProfile}
                                disabled={processing}
                                className="bg-[#0b3b60] hover:bg-[#082a45] text-white rounded-xl px-6 w-full sm:w-auto"
                            >
                                {processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="relative mb-4">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl scale-110 opacity-60"></div>
                    <Avatar className="h-28 w-28 border-4 border-white shadow-md relative z-10">
                        <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}&backgroundColor=0b3b60`} />
                        <AvatarFallback className="bg-[#0b3b60] text-white text-2xl">
                            {user?.username?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-[#0b3b60] p-1.5 rounded-full border-2 border-white z-20 text-white shadow-sm">
                        <Check className="h-4 w-4" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-[#0b3b60] text-center">
                    {user?.username}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {user?.pharmacy_staff?.role?.replace('_', ' ') || 'Petugas Apotek'}
                </p>

                <div className="w-full mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600">
                                {pharmacy?.phone}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 leading-relaxed text-balance">
                                {pharmacy?.address}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-8 p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Status Apotek
                        </p>
                        <p
                            className={`text-sm font-bold mt-0.5 ${pharmacy?.is_active ? "text-emerald-600" : "text-slate-400"}`}
                        >
                            {pharmacy?.is_active ? "Buka Sekarang" : "Sedang Tutup"}
                        </p>
                    </div>
                    <Switch
                        checked={pharmacy?.is_active}
                        onCheckedChange={toggleStatus}
                        className="data-[state=checked]:bg-[#0b3b60]"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
