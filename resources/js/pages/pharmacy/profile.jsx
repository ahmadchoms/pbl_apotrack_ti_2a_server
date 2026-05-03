import React, { useState } from "react";
import { motion } from "framer-motion";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import {
    User,
    Store,
    Clock,
    ShieldCheck,
    Lock,
    Mail,
    Phone,
    MapPin,
    Save,
    AlertCircle,
    Activity,
    CheckCircle2,
} from "lucide-react";
import { router, useForm } from "@inertiajs/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const DAYS = [
    { id: 1, name: "Senin" },
    { id: 2, name: "Selasa" },
    { id: 3, name: "Rabu" },
    { id: 4, name: "Kamis" },
    { id: 5, name: "Jumat" },
    { id: 6, name: "Sabtu" },
    { id: 0, name: "Minggu" },
];

export default function PharmacistProfile({ user, pharmacy, auditLogs }) {
    const isApoteker = user.pharmacy_staff?.role === "APOTEKER";

    return (
        <DashboardPharmacyLayout activeMenu="Profil Saya">
            <div className="pb-20 px-4">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                            Pharmacy Control Center
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        Pengaturan{" "}
                        <span className="text-indigo-600">Profil</span>
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                        Kelola identitas personal, informasi operasional apotek,
                        dan pengaturan keamanan dalam satu panel terpusat.
                    </p>
                </div>

                <Tabs defaultValue="personal" className="space-y-8">
                    <TabsList className="bg-white p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-sm h-14 w-full md:w-auto">
                        <TabsTrigger
                            value="personal"
                            className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                        >
                            <User className="w-4 h-4 mr-2" /> Profil Saya
                        </TabsTrigger>
                        {isApoteker && (
                            <>
                                <TabsTrigger
                                    value="pharmacy"
                                    className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                                >
                                    <Store className="w-4 h-4 mr-2" /> Informasi
                                    Apotek
                                </TabsTrigger>
                                <TabsTrigger
                                    value="hours"
                                    className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                                >
                                    <Clock className="w-4 h-4 mr-2" /> Jam
                                    Operasional
                                </TabsTrigger>
                            </>
                        )}
                    </TabsList>

                    <TabsContent value="personal" className="mt-0 outline-none">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <PersonalForm user={user} />
                                <PasswordForm />
                            </div>
                            <div className="space-y-8">
                                <AuditLogSection logs={auditLogs} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="pharmacy" className="mt-0 outline-none">
                        <div className="max-w-3xl">
                            <PharmacyForm pharmacy={pharmacy} />
                        </div>
                    </TabsContent>

                    <TabsContent value="hours" className="mt-0 outline-none">
                        <div className="min-w-full">
                            <OperatingHoursForm pharmacy={pharmacy} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardPharmacyLayout>
    );
}

function PersonalForm({ user }) {
    const { data, setData, patch, processing, errors } = useForm({
        username: user.username || "",
        email: user.email || "",
    });

    const submit = (e) => {
        e.preventDefault();
        // Assuming there's a route for user profile update
        // router.patch(route('pharmacy.profile.user.update'), data);
        toast.info("Fitur update profil user akan segera hadir");
    };

    return (
        <Card className="py-0 gap-0 rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-10">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Detail Akun Personal
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    Informasi dasar identitas Anda sebagai pengelola apotek
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Username
                        </Label>
                        <Input
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className="h-12 font-bold rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Email Address
                        </Label>
                        <Input
                            value={data.email}
                            disabled
                            className="h-12 rounded-xl bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                        />
                    </div>
                </div>
                <Button
                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/80 text-white font-black text-[10px] uppercase tracking-widest"
                    onClick={submit}
                >
                    Simpan Perubahan
                </Button>
            </CardContent>
        </Card>
    );
}

function PasswordForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("pharmacy.profile.updatePassword"), {
            onSuccess: () => {
                reset();
                toast.success("Password berhasil diperbarui");
            },
        });
    };

    return (
        <Card className="py-0 gap-0 rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Keamanan & Password
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    Perbarui kata sandi Anda secara berkala untuk menjaga
                    keamanan akun
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Password Saat Ini
                        </Label>
                        <Input
                            type="password"
                            value={data.current_password}
                            placeholder="Minimal 8 karakter"
                            onChange={(e) =>
                                setData("current_password", e.target.value)
                            }
                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                        />
                        {errors.current_password && (
                            <p className="text-[10px] text-rose-500 font-bold px-1">
                                {errors.current_password}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Password Baru
                        </Label>
                        <Input
                            type="password"
                            value={data.password}
                            placeholder="Minimal 8 karakter"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                        />
                        {errors.password && (
                            <p className="text-[10px] text-rose-500 font-bold px-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Konfirmasi Password
                        </Label>
                        <Input
                            type="password"
                            value={data.password_confirmation}
                            placeholder="Minimal 8 karakter"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                        />
                    </div>
                </div>
                <Button
                    className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest"
                    disabled={processing}
                    onClick={submit}
                >
                    <ShieldCheck className="w-4 h-4 mr-2" /> Ganti Password
                </Button>
            </CardContent>
        </Card>
    );
}

import { LocationPicker } from "@/features/admin/components/shared/LocationPicker";

function PharmacyForm({ pharmacy }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: pharmacy.name || "",
        address: pharmacy.address || "",
        phone: pharmacy.phone || "",
        latitude: pharmacy.latitude || "",
        longitude: pharmacy.longitude || "",
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("pharmacy.profile.update"), {
            onSuccess: () => toast.success("Informasi apotek diperbarui"),
        });
    };

    return (
        <Card className="py-0 gap-0 rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Informasi Publik Apotek
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    Data ini akan ditampilkan kepada pelanggan di aplikasi
                    mobile
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Nama Apotek
                    </Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Alamat Lengkap
                    </Label>
                    <textarea
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        className="w-full min-h-[100px] p-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-sm font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Nomor Telepon Apotek
                    </Label>
                    <Input
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                    />
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Lokasi Apotek (Peta)
                    </Label>
                    <LocationPicker 
                        lat={data.latitude} 
                        lng={data.longitude} 
                        onChange={(lat, lng) => {
                            setData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                        }} 
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Latitude</Label>
                            <Input readOnly value={data.latitude} className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-mono" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Longitude</Label>
                            <Input readOnly value={data.longitude} className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-mono" />
                        </div>
                    </div>
                </div>

                <Button
                    className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20"
                    disabled={processing}
                    onClick={submit}
                >
                    <Save className="w-5 h-5 mr-3" /> Update Info Apotek
                </Button>
            </CardContent>
        </Card>
    );
}

function OperatingHoursForm({ pharmacy }) {
    // Transform relational data back to form state
    const initialHours = DAYS.map((day) => {
        const hourData = pharmacy.operating_hours?.find(
            (h) => h.day_of_week === day.id,
        ) || {
            day_of_week: day.id,
            open_time: "08:00",
            close_time: "21:00",
            is_closed: false,
            is_24_hours: false,
        };

        // Ensure times are formatted correctly for input type="time" (HH:mm)
        const formatTime = (time) => {
            if (!time) return "08:00";
            return time.substring(0, 5);
        };

        return {
            ...hourData,
            open_time: formatTime(hourData.open_time),
            close_time: formatTime(hourData.close_time),
            is_closed: !!hourData.is_closed,
            is_24_hours: !!hourData.is_24_hours,
        };
    });

    const [hours, setHours] = useState(initialHours);

    const updateHour = (dayId, field, value) => {
        setHours((prev) =>
            prev.map((h) =>
                h.day_of_week === dayId ? { ...h, [field]: value } : h,
            ),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        router.post(
            route("pharmacy.profile.updateHours"),
            { hours },
            {
                onSuccess: () => toast.success("Jam operasional diperbarui"),
            },
        );
    };

    return (
        <Card className="rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Manajemen Jam Operasional
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    Atur jadwal operasional mingguan untuk menginformasikan
                    pelanggan
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-4">
                    {DAYS.map((day) => {
                        const h = hours.find((h) => h.day_of_week === day.id);
                        const isDisabled = h.is_closed || h.is_24_hours;

                        return (
                            <div
                                key={day.id}
                                className={`flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-2xl border transition-all ${
                                    h.is_closed
                                        ? "bg-slate-50/50 border-slate-100 opacity-60"
                                        : "bg-white border-slate-100 shadow-sm"
                                } gap-6`}
                            >
                                <div className="flex items-center gap-4 min-w-[120px]">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full ${h.is_closed ? "bg-slate-300" : h.is_24_hours ? "bg-indigo-500" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`}
                                    />
                                    <span className="text-sm font-black text-slate-700">
                                        {day.name}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                id={`closed-${day.id}`}
                                                checked={h.is_closed}
                                                onCheckedChange={(val) =>
                                                    updateHour(
                                                        day.id,
                                                        "is_closed",
                                                        val,
                                                    )
                                                }
                                                className="data-[state=checked]:bg-rose-500"
                                            />
                                            <Label
                                                htmlFor={`closed-${day.id}`}
                                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer"
                                            >
                                                Tutup
                                            </Label>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Switch
                                                id={`24h-${day.id}`}
                                                disabled={h.is_closed}
                                                checked={h.is_24_hours}
                                                onCheckedChange={(val) =>
                                                    updateHour(
                                                        day.id,
                                                        "is_24_hours",
                                                        val,
                                                    )
                                                }
                                                className="data-[state=checked]:bg-indigo-500"
                                            />
                                            <Label
                                                htmlFor={`24h-${day.id}`}
                                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer"
                                            >
                                                24 Jam
                                            </Label>
                                        </div>
                                    </div>

                                    <div
                                        className={`flex items-center gap-3 transition-opacity ${isDisabled ? "opacity-30 pointer-events-none" : "opacity-100"}`}
                                    >
                                        <div className="relative">
                                            <Input
                                                type="time"
                                                value={h.open_time}
                                                onChange={(e) =>
                                                    updateHour(
                                                        day.id,
                                                        "open_time",
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-10 w-38 rounded-xl border-slate-200 text-xs font-bold pl-8"
                                            />
                                            <Clock className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        <span className="text-slate-300 font-bold">
                                            -
                                        </span>
                                        <div className="relative">
                                            <Input
                                                type="time"
                                                value={h.close_time}
                                                onChange={(e) =>
                                                    updateHour(
                                                        day.id,
                                                        "close_time",
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-10 w-38 rounded-xl border-slate-200 text-xs font-bold pl-8"
                                            />
                                            <Clock className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-10 flex justify-end">
                    <Button
                        className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/80 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20"
                        onClick={submit}
                    >
                        <Save className="w-5 h-5 mr-3" /> Simpan Jam Operasional
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function AuditLogSection({ logs }) {
    return (
        <Card className="py-0 gap-0 rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50 flex items-center justify-between flex-row">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Audit History
                </CardTitle>
                <Activity className="w-4 h-4 text-slate-300" />
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-700 leading-tight">
                                    {log.description}
                                </p>
                                <p className="text-[9px] text-slate-400 font-medium mt-1">
                                    {new Date(
                                        log.created_at,
                                    ).toLocaleDateString("id-ID")}{" "}
                                    •{" "}
                                    {new Date(
                                        log.created_at,
                                    ).toLocaleTimeString("id-ID")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <Button
                    variant="ghost"
                    className="w-full mt-4 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    onClick={() =>
                        router.get(route("pharmacy.profile.audit-logs"))
                    }
                >
                    Lihat Semua Log
                </Button>
            </CardContent>
        </Card>
    );
}
