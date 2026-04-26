import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Phone,
    Mail,
    Edit2,
    Check,
    ShieldCheck,
    CheckCircle2,
    User,
    Calendar,
    BadgeCheck,
} from "lucide-react";

export function ProfileCard({ user }) {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const [tempProfileData, setTempProfileData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const handleSaveProfile = () => {
        // Here you would typically call a router.put or similar
        setIsEditProfileOpen(false);
        setTimeout(() => setIsSuccessOpen(true), 150);
    };

    return (
        <>
            <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-10 flex flex-col items-center relative">
                    <Dialog
                        open={isEditProfileOpen}
                        onOpenChange={(open) => {
                            setIsEditProfileOpen(open);
                            if (open)
                                setTempProfileData({
                                    username: user?.username || "",
                                    email: user?.email || "",
                                    phone: user?.phone || "",
                                });
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-6 right-6 text-slate-300 hover:text-primary hover:bg-slate-50 rounded-2xl"
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-10 border-0 shadow-2xl">
                            <DialogHeader>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                                    Otentikasi Identitas
                                </p>
                                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                    Edit Profil Admin
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6 py-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Nama Pengguna
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input
                                            value={tempProfileData.username}
                                            onChange={(e) =>
                                                setTempProfileData({
                                                    ...tempProfileData,
                                                    username: e.target.value,
                                                })
                                            }
                                            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Alamat Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input
                                            type="email"
                                            value={tempProfileData.email}
                                            onChange={(e) =>
                                                setTempProfileData({
                                                    ...tempProfileData,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Nomor Telepon
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <Input
                                            type="tel"
                                            value={tempProfileData.phone}
                                            onChange={(e) =>
                                                setTempProfileData({
                                                    ...tempProfileData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    onClick={handleSaveProfile}
                                    className="w-full bg-primary hover:bg-primary/80 text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                                >
                                    Konfirmasi Perubahan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="relative mb-8 group">
                        <div className="absolute inset-0 bg-blue-100 rounded-[3rem] blur-2xl scale-125 opacity-40 group-hover:opacity-60 transition-opacity" />
                        <Avatar className="h-32 w-32 border-8 border-white shadow-2xl relative z-10 rounded-[3rem]">
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback className="bg-primary text-white text-3xl font-black">
                                {user?.username?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 right-1 bg-sky-500 rounded-2xl border-4 border-white z-20 text-white shadow-xl">
                            <BadgeCheck className="size-6" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 text-center tracking-tight">
                        {user?.username}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">
                        Administrator Sistem
                    </p>

                    <div className="inline-flex items-center gap-2 mt-6 px-5 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-primary text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Super Admin Privileges
                    </div>

                    <div className="w-full mt-10 space-y-5">
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                <Mail className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                    Email Address
                                </p>
                                <p className="text-sm font-bold text-slate-600">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                <Phone className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                    Phone Connection
                                </p>
                                <p className="text-sm font-bold text-slate-600">
                                    {user?.phone || "Not connected"}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-xs rounded-[2.5rem] p-10 text-center border-0 shadow-2xl">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-inner">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                Sinkronisasi Berhasil
                            </DialogTitle>
                            <p className="text-xs text-slate-400 font-bold mt-2">
                                Informasi profil Anda telah diperbarui dalam
                                repositori sistem.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
