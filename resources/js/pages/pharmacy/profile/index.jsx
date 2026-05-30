import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, usePage, router } from "@inertiajs/react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { TextInput } from "@/components/shared/TextInput";
import { TextareaInput } from "@/components/shared/TextareaInput";
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
    LockKeyhole,
    MapPinned,
    Loader2,
    Camera,
    Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { LocationPicker } from "@/features/admin/components/shared/LocationPicker";
import { ScrollArea } from "@/components/ui/scroll-area";

const DAYS = [
    { id: 1, name: "Senin" },
    { id: 2, name: "Selasa" },
    { id: 3, name: "Rabu" },
    { id: 4, name: "Kamis" },
    { id: 5, name: "Jumat" },
    { id: 6, name: "Sabtu" },
    { id: 7, name: "Minggu" },
];

export default function PharmacyProfilePage({
    pharmacy,
    operatingHours = [],
    userActivities = [],
}) {
    const { auth } = usePage().props;
    const [activeSection, setActiveSection] = useState("personal");

    const personalForm = useForm({
        username: auth?.user?.username || "",
        email: auth?.user?.email || "",
        phone: auth?.user?.phone || "",
    });

    const pharmacyForm = useForm({
        name: pharmacy?.name || "",
        address: pharmacy?.address || "",
        phone: pharmacy?.phone || "",
        latitude: pharmacy?.latitude || "",
        longitude: pharmacy?.longitude || "",
    });

    const sortedDbHours = [...operatingHours].sort((a, b) => {
        const dayA = a.day_of_week === 0 ? 7 : a.day_of_week;
        const dayB = b.day_of_week === 0 ? 7 : b.day_of_week;
        return dayA - dayB;
    });

    const hoursForm = useForm({
        hours: DAYS.map((d) => {
            const dbDayCode = d.id === 7 ? 0 : d.id;
            const existing = sortedDbHours.find(
                (h) => h.day_of_week === dbDayCode,
            );
            return {
                day_of_week: dbDayCode,
                day_name: d.name,
                is_closed: existing ? !!existing.is_closed : false,
                is_24_hours: existing ? !!existing.is_24_hours : false,
                open_time: existing?.open_time
                    ? existing.open_time.substring(0, 5)
                    : "08:00",
                close_time: existing?.close_time
                    ? existing.close_time.substring(0, 5)
                    : "21:00",
            };
        }),
    });

    const securityForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleUpdatePersonal = (e) => {
        e.preventDefault();
        personalForm.patch(route("pharmacy.profile.updateUser"), {
            onSuccess: () =>
                toast.success("Profil pengguna berhasil diperbarui"),
        });
    };

    const handleUpdatePharmacy = (e) => {
        e.preventDefault();
        pharmacyForm.patch(route("pharmacy.profile.update"), {
            onSuccess: () =>
                toast.success("Informasi apotek berhasil diperbarui"),
        });
    };

    const handleUpdateHours = (e) => {
        e.preventDefault();
        hoursForm.post(route("pharmacy.profile.updateHours"), {
            onSuccess: () =>
                toast.success("Jam operasional apotek berhasil disimpan"),
        });
    };

    const handleUpdateSecurity = (e) => {
        e.preventDefault();
        securityForm.post(route("pharmacy.profile.updatePassword"), {
            onSuccess: () => {
                toast.success("Kata sandi akun Anda berhasil diubah");
                securityForm.reset();
            },
        });
    };

    const handleOperatingHoursChange = (index, field, value) => {
        const updatedHours = [...hoursForm.data.hours];
        if (field === "is_closed" && value === true) {
            updatedHours[index] = {
                ...updatedHours[index],
                is_closed: true,
                is_24_hours: false,
            };
        } else if (field === "is_24_hours" && value === true) {
            updatedHours[index] = {
                ...updatedHours[index],
                is_closed: false,
                is_24_hours: true,
            };
        } else {
            updatedHours[index] = {
                ...updatedHours[index],
                [field]: value,
            };
        }
        hoursForm.setData("hours", updatedHours);
    };

    const navItems = [
        {
            id: "personal",
            label: "Informasi Pribadi",
            icon: User,
            desc: "Kelola profil & data personal Anda",
        },
        {
            id: "pharmacy",
            label: "Profil Apotek",
            icon: Store,
            desc: "Kelola identitas & lokasi apotek",
        },
        {
            id: "hours",
            label: "Jam Operasional",
            icon: Clock,
            desc: "Atur jadwal buka & tutup apotek",
        },
        {
            id: "security",
            label: "Keamanan Akun",
            icon: ShieldCheck,
            desc: "Perbarui kredensial & kata sandi",
        },
        {
            id: "activity",
            label: "Log Aktivitas",
            icon: Activity,
            desc: "Pantau riwayat aksi akun Anda",
        },
    ];

    return (
        <DashboardPharmacyLayout activeMenu="pharmacy.profile">
            <div className="max-w-6xl mx-auto pb-12">
                <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm border border-slate-100 overflow-hidden">
                                {auth?.user?.avatar_url ? (
                                    <img
                                        src={auth.user.avatar_url}
                                        alt={auth.user.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    auth?.user?.username
                                        ?.substring(0, 2)
                                        .toUpperCase()
                                )}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-xs hover:bg-slate-50 transition-all active:scale-90 opacity-0 group-hover:opacity-100">
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    {auth?.user?.username}
                                </h1>
                                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-wider border border-blue-100">
                                    {auth?.user?.role}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                {auth?.user?.email}
                            </p>
                            <p className="text-xs text-slate-400">
                                Terdaftar di:{" "}
                                <span className="font-semibold text-slate-600">
                                    {pharmacy?.name || "Apotek Pro"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                    <div className="md:col-span-1 space-y-2 md:sticky md:top-24 shrink-0">
                        {navItems.map((item) => {
                            const IsActive = activeSection === item.id;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left border transition-all duration-200 group relative ${
                                        IsActive
                                            ? "bg-primary border-primabg-primary text-white shadow-sm"
                                            : "bg-white border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/80"
                                    }`}
                                >
                                    <Icon
                                        className={`w-4.5 h-4.5 stroke-[2.2] transition-colors ${IsActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}
                                    />
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold tracking-wide">
                                            {item.label}
                                        </p>
                                    </div>
                                    {IsActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="md:col-span-3 min-h-125">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                {activeSection === "personal" && (
                                    <PersonalFormCard
                                        form={personalForm}
                                        onSubmit={handleUpdatePersonal}
                                    />
                                )}

                                {activeSection === "pharmacy" && (
                                    <PharmacyFormCard
                                        form={pharmacyForm}
                                        onSubmit={handleUpdatePharmacy}
                                    />
                                )}

                                {activeSection === "hours" && (
                                    <OperatingHoursCard
                                        form={hoursForm}
                                        onHoursChange={
                                            handleOperatingHoursChange
                                        }
                                        onSubmit={handleUpdateHours}
                                    />
                                )}

                                {activeSection === "security" && (
                                    <SecurityFormCard
                                        form={securityForm}
                                        onSubmit={handleUpdateSecurity}
                                    />
                                )}

                                {activeSection === "activity" && (
                                    <ActivityLogCard logs={userActivities} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardPharmacyLayout>
    );
}

function PersonalFormCard({ form, onSubmit }) {
    return (
        <Card className="border border-slate-100 rounded-[1.5rem] shadow-[0_2px_12px_rgba(15,23,42,0.01)] bg-white overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-800">
                    Informasi Pribadi & Kontak
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    Perbarui data login serta nomor seluler operasional Anda.
                </p>
            </div>
            <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <TextInput
                                label="Nama Lengkap"
                                value={form.data.username}
                                onChange={(e) =>
                                    form.setData("username", e.target.value)
                                }
                            />
                            {form.errors.username && (
                                <p className="text-[11px] text-red-500 font-semibold mt-1">
                                    {form.errors.username}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <TextInput
                                label="Nomor Telepon / WhatsApp"
                                icon={Phone}
                                value={form.data.phone}
                                onChange={(e) =>
                                    form.setData("phone", e.target.value)
                                }
                            />
                            {form.errors.phone && (
                                <p className="text-[11px] text-red-500 font-semibold mt-1">
                                    {form.errors.phone}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <TextInput
                            label="Email"
                            type="email"
                            icon={Mail}
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData("email", e.target.value)
                            }
                        />
                        {form.errors.email && (
                            <p className="text-[11px] text-red-500 font-semibold mt-1">
                                {form.errors.email}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-50">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-2 min-w-35"
                        >
                            {form.processing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            <span>Simpan Profil</span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function PharmacyFormCard({ form, onSubmit }) {
    return (
        <Card className="border border-slate-100 rounded-[1.5rem] shadow-[0_2px_12px_rgba(15,23,42,0.01)] bg-white overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-800">
                    Informasi Gerai Apotek
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    Perbarui identitas fisik, kontak layanan, serta titik
                    koordinat pemetaan kurir digital.
                </p>
            </div>
            <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <TextInput
                                label="Nama Resmi Apotek"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                            />
                            {form.errors.name && (
                                <p className="text-[11px] text-red-500 font-semibold mt-1">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <TextInput
                                label="Nomor Telepon Apotek"
                                value={form.data.phone}
                                onChange={(e) =>
                                    form.setData("phone", e.target.value)
                                }
                            />
                            {form.errors.phone && (
                                <p className="text-[11px] text-red-500 font-semibold mt-1">
                                    {form.errors.phone}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <TextareaInput
                            label="Alamat Lengkap Gerai"
                            value={form.data.address}
                            onChange={(e) =>
                                form.setData("address", e.target.value)
                            }
                            rows={2}
                        />
                        {form.errors.address && (
                            <p className="text-[11px] text-red-500 font-semibold mt-1">
                                {form.errors.address}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                            <MapPinned className="w-4 h-4 text-slate-500" />
                            <span>Titik Geografis Apotek</span>
                        </div>
                        <div className="w-full rounded-2xl overflow-hidden border border-slate-100 h-64 mt-2">
                            <LocationPicker
                                latitude={form.data.latitude}
                                longitude={form.data.longitude}
                                onChange={(lat, lng) => {
                                    form.setData({
                                        ...form.data,
                                        latitude: lat,
                                        longitude: lng,
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-50">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-2 min-w-35"
                        >
                            {form.processing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            <span>Simpan Apotek</span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function OperatingHoursCard({ form, onHoursChange, onSubmit }) {
    return (
        <Card className="border border-slate-100 rounded-[1.5rem] shadow-[0_2px_12px_rgba(15,23,42,0.01)] bg-white overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-800">
                    Manajemen Jam Operasional
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    Konfigurasikan status operasional harian guna sinkronisasi
                    pesanan kurir pengiriman instan.
                </p>
            </div>
            <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="divide-y divide-slate-100">
                        {form.data.hours.map((day, idx) => (
                            <motion.div
                                key={day.day_of_week}
                                className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4"
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-sm font-bold text-slate-700">
                                    {day.day_name}
                                </span>

                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={!!day.is_closed}
                                            onCheckedChange={(checked) =>
                                                onHoursChange(
                                                    idx,
                                                    "is_closed",
                                                    checked,
                                                )
                                            }
                                            className="data-[state=checked]:bg-rose-500"
                                        />
                                        <span className="text-xs font-semibold text-slate-600">
                                            Tutup
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={!!day.is_24_hours}
                                            onCheckedChange={(checked) =>
                                                onHoursChange(
                                                    idx,
                                                    "is_24_hours",
                                                    checked,
                                                )
                                            }
                                            className="data-[state=checked]:bg-emerald-500"
                                        />
                                        <span className="text-xs font-semibold text-slate-600">
                                            24 Jam
                                        </span>
                                    </div>

                                    <div className="min-w-50 flex items-center justify-end">
                                        <AnimatePresence mode="wait">
                                            {day.is_closed ? (
                                                <motion.div
                                                    key="closed"
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{ opacity: 0 }}
                                                    className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider text-center w-full"
                                                >
                                                    Tutup / Libur
                                                </motion.div>
                                            ) : day.is_24_hours ? (
                                                <motion.div
                                                    key="24h"
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{ opacity: 0 }}
                                                    className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-xs uppercase tracking-wider text-center w-full"
                                                >
                                                    Buka 24 Jam
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="custom"
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-primary/45 rounded-xl px-3 py-1.5 gap-2 transition-all">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                            Buka
                                                        </span>
                                                        <input
                                                            type="time"
                                                            value={
                                                                day.open_time ||
                                                                "08:00"
                                                            }
                                                            onChange={(e) =>
                                                                onHoursChange(
                                                                    idx,
                                                                    "open_time",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="bg-transparent border-0 font-mono text-xs font-bold text-slate-700 focus:outline-none p-0 w-12"
                                                        />
                                                    </div>
                                                    <span className="text-slate-300 font-medium text-xs">
                                                        s/d
                                                    </span>
                                                    <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-primary/45 rounded-xl px-3 py-1.5 gap-2 transition-all">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                            Tutup
                                                        </span>
                                                        <input
                                                            type="time"
                                                            value={
                                                                day.close_time ||
                                                                "21:00"
                                                            }
                                                            onChange={(e) =>
                                                                onHoursChange(
                                                                    idx,
                                                                    "close_time",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="bg-transparent border-0 font-mono text-xs font-bold text-slate-700 focus:outline-none p-0 w-12"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-2 min-w-35"
                        >
                            {form.processing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            <span>Simpan Jadwal</span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function SecurityFormCard({ form, onSubmit }) {
    return (
        <Card className="border border-slate-100 rounded-[1.5rem] shadow-[0_2px_12px_rgba(15,23,42,0.01)] bg-white overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-800">
                    Keamanan & Otentikasi
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    Perbarui kata sandi secara berkala guna mengamankan hak
                    akses sistem kasir digital.
                </p>
            </div>
            <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <TextInput
                            label="Kata Sandi Saat Ini"
                            type="password"
                            icon={Lock}
                            value={form.data.current_password}
                            onChange={(e) =>
                                form.setData("current_password", e.target.value)
                            }
                        />
                        {form.errors.current_password && (
                            <p className="text-[11px] text-red-500 font-semibold mt-1">
                                {form.errors.current_password}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <TextInput
                                label="Kata Sandi Baru"
                                type="password"
                                icon={LockKeyhole}
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData("password", e.target.value)
                                }
                            />
                            {form.errors.password && (
                                <p className="text-[11px] text-red-500 font-semibold mt-1">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <TextInput
                                label="Konfirmasi Kata Sandi Baru"
                                type="password"
                                icon={LockKeyhole}
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                            />
                            {form.errors.password_confirmation && (
                                <p className="text-[11px] text-red-500 font-semibold mt-1">
                                    {form.errors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-50">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-2 min-w-35"
                        >
                            {form.processing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            <span>Ubah Password</span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function ActivityLogCard({ logs = [] }) {
    return (
        <Card className="pt-0 border border-slate-100 rounded-[1.5rem] shadow-[0_2px_12px_rgba(15,23,42,0.01)] bg-white overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-sm font-bold text-slate-800">
                    Log Aktivitas Akun
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    Audit jejak digital aksi operasional yang terafiliasi dengan
                    akun login ini.
                </p>
            </div>
            <CardContent className="p-6">
                <ScrollArea className="h-96 pr-2">
                    {logs.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 font-medium text-xs">
                            Belum ada rekam jejak log aktivitas terdeteksi.
                        </div>
                    ) : (
                        <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-6 pb-2">
                            {logs.map((log) => (
                                <div key={log.id} className="relative group">
                                    <span className="absolute -left-5.25 top-1 h-2.5 w-2.5 rounded-full bg-slate-300 border-2 border-white group-hover:bg-blue-500 transition-colors" />

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                                                {log.action}
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-400">
                                                {log.created_at_formatted ||
                                                    log.created_at}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                            {log.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="flex justify-end pt-4 border-t border-slate-50 mt-4">
                    <Button
                        variant="outline"
                        className="text-xs font-bold w-full h-10 rounded-xl cursor-pointer"
                        onClick={() =>
                            router.get(route("pharmacy.profile.audit-logs"))
                        }
                    >
                        Lihat Semua Log Aktivitas
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
