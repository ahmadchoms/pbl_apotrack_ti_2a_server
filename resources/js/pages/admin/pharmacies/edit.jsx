import React, { useState } from "react";
import { motion } from "framer-motion";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Building2,
    Clock,
    MapPin,
    FileText,
    Save,
    Image as ImageIcon,
    FileUp,
    Navigation,
    ShieldCheck,
    ShieldAlert,
    Phone,
    Trash2,
    AlertTriangle,
    Users,
} from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { SectionHeader } from "@/features/admin/components/shared/SectionHeader";
import { FormField } from "@/features/admin/components/shared/FormField";
import { UploadZone } from "@/features/admin/components/shared/UploadZone";
import { InfoBox } from "@/features/admin/components/shared/InfoBox";
import { StaffPicker } from "@/features/admin/components/pharmacies/StaffPicker";
import { LocationPicker } from "@/features/admin/components/shared/LocationPicker";
import {
    containerVariants,
    itemVariants,
    VERIFICATION_OPTIONS,
} from "@/features/admin/lib/constants";

export default function AdminPharmacyEdit({ pharmacy, available_staff = [] }) {
    const pData = pharmacy.data;

    const initialStaffs = (pData.staffs || []).map((s) => ({
        user_id: s.user_id,
        role: s.role,
        user_data: {
            id: s.user_id,
            username: s.username,
            avatar_url: s.avatar_url,
        },
    }));

    const { data, setData, put, processing, errors } = useForm({
        name: pData.name || "",
        sia_number: pData.legality?.sia_number || "",
        phone: pData.phone || "",
        address: pData.address || "",
        latitude: pData.latitude ?? "",
        longitude: pData.longitude ?? "",
        verification_status: pData.verification_status || "PENDING",
        is_active: pData.is_active ?? true,
        is_force_closed: pData.is_force_closed ?? false,
        staffs: initialStaffs,
    });

    const [staffSearch, setStaffSearch] = useState("");

    const addStaff = (user) => {
        if (data.staffs.find((s) => s.user_id === user.id)) return;
        setData("staffs", [
            ...data.staffs,
            {
                user_id: user.id,
                role: user.role === "APOTEKER" ? "APOTEKER" : "STAFF",
                user_data: user,
            },
        ]);
        setStaffSearch("");
    };

    const removeStaff = (userId) => {
        setData(
            "staffs",
            data.staffs.filter((s) => s.user_id !== userId),
        );
    };
    const updateStaffRole = (userId, role) => {
        setData(
            "staffs",
            data.staffs.map((s) => (s.user_id === userId ? { ...s, role } : s)),
        );
    };

    const filteredAvailableStaff = available_staff.filter(
        (user) =>
            !data.staffs.find((s) => s.user_id === user.id) &&
            (user.username.toLowerCase().includes(staffSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(staffSearch.toLowerCase())),
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.pharmacies.update", pData.id));
    };
    const handleDelete = () => {
        router.delete(route("admin.pharmacies.destroy", pData.id));
    };

    return (
        <DashboardAdminLayout activeMenu="pharmacies">
            <form onSubmit={handleSubmit} className="space-y-10 pb-20">
                <PageHeader
                    subtitle="Manajemen Fasilitas"
                    title="Edit Apotek"
                    description={`Memperbarui data dan konfigurasi ${pData.name}.`}
                >
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                            router.get(route("admin.pharmacies.index"))
                        }
                        className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#0b3b60]"
                    >
                        Batalkan
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-14 px-10 rounded-2xl bg-[#0b3b60] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#082a45] transition-all shadow-xl shadow-[#0b3b60]/20 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </PageHeader>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                >
                    <div className="lg:col-span-2 space-y-10">
                        {/* Basic Info */}
                        <motion.section
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <SectionHeader
                                icon={<Building2 className="w-5 h-5" />}
                                bg="bg-blue-50"
                                color="text-[#0b3b60]"
                                title="Informasi Dasar"
                            />
                            <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <FormField
                                        label="Nama Lengkap Apotek"
                                        error={errors.name}
                                    >
                                        <Input
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Contoh: Apotek Sehat Jaya"
                                            className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold"
                                        />
                                    </FormField>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField
                                            label="Nomor Lisensi (SIA)"
                                            error={errors.sia_number}
                                        >
                                            <Input
                                                value={data.sia_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "sia_number",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="SIA/XXX/2024"
                                                className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Nomor Telepon Operasional"
                                            error={errors.phone}
                                        >
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <Input
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="+62 21 xxxx"
                                                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold"
                                                />
                                            </div>
                                        </FormField>
                                    </div>
                                    <FormField
                                        label="Alamat Lengkap"
                                        error={errors.address}
                                    >
                                        <Textarea
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama jalan, nomor gedung, RT/RW..."
                                            className="min-h-[120px] rounded-[1.5rem] bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold p-6"
                                        />
                                    </FormField>
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Staff */}
                        <motion.section
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <SectionHeader
                                icon={<Users className="w-5 h-5" />}
                                bg="bg-indigo-50"
                                color="text-indigo-600"
                                title="Manajemen Staf & Akses"
                            />
                            <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2 overflow-visible">
                                <CardContent className="p-10">
                                    <StaffPicker
                                        staffs={data.staffs}
                                        staffSearch={staffSearch}
                                        setStaffSearch={setStaffSearch}
                                        filteredAvailableStaff={
                                            filteredAvailableStaff
                                        }
                                        addStaff={addStaff}
                                        removeStaff={removeStaff}
                                        updateStaffRole={updateStaffRole}
                                    />
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Coordinates */}
                        <motion.section
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <SectionHeader
                                icon={<MapPin className="w-5 h-5" />}
                                bg="bg-rose-50"
                                color="text-rose-600"
                                title="Lokasi Apotek (Peta)"
                            />
                            <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <LocationPicker
                                        lat={data.latitude}
                                        lng={data.longitude}
                                        onChange={(lat, lng) => {
                                            setData((prev) => ({
                                                ...prev,
                                                latitude: lat,
                                                longitude: lng,
                                            }));
                                        }}
                                    />

                                    <div className="grid grid-cols-2 gap-8 opacity-50">
                                        <FormField
                                            label="Latitude"
                                            error={errors.latitude}
                                        >
                                            <Input
                                                readOnly
                                                value={data.latitude}
                                                className="h-12 rounded-xl bg-slate-50 border-transparent font-mono text-xs"
                                            />
                                        </FormField>
                                        <FormField
                                            label="Longitude"
                                            error={errors.longitude}
                                        >
                                            <Input
                                                readOnly
                                                value={data.longitude}
                                                className="h-12 rounded-xl bg-slate-50 border-transparent font-mono text-xs"
                                            />
                                        </FormField>
                                    </div>

                                    <InfoBox text="Pengaturan jam operasional dapat dikelola oleh Apoteker melalui halaman profil apotek." />
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Danger Zone */}
                        <motion.section
                            variants={itemVariants}
                            className="space-y-6 pt-10"
                        >
                            <SectionHeader
                                icon={<ShieldAlert className="w-5 h-5" />}
                                bg="bg-rose-50"
                                color="text-rose-600"
                                title="Zona Berbahaya"
                            />
                            <Card className="pt-0 rounded-[2.5rem] border-2 border-rose-100 bg-rose-50/20 p-2">
                                <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <h4 className="text-base font-black text-rose-900 leading-none">
                                            Hapus Data Apotek
                                        </h4>
                                        <p className="text-xs font-bold text-rose-600/60 leading-relaxed max-w-md">
                                            Tindakan ini bersifat permanen.
                                            Seluruh data staf, obat, riwayat,
                                            dan order akan dihapus dari sistem.
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="h-14 px-10 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center gap-2 shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />{" "}
                                                Hapus Apotek
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-lg">
                                            <AlertDialogHeader>
                                                <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mb-6 mx-auto">
                                                    <AlertTriangle className="w-10 h-10" />
                                                </div>
                                                <AlertDialogTitle className="text-2xl font-black text-slate-900 text-center mb-2 uppercase tracking-tight">
                                                    Konfirmasi Penghapusan
                                                </AlertDialogTitle>
                                                <AlertDialogDescription className="text-sm font-bold text-slate-400 text-center leading-relaxed">
                                                    Apakah Anda yakin ingin
                                                    menghapus{" "}
                                                    <span className="text-slate-900">
                                                        {pharmacy.name}
                                                    </span>
                                                    ? Seluruh data terkait akan
                                                    dihapus secara permanen.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex flex-row items-center justify-center gap-4 mt-10">
                                                <AlertDialogCancel className="h-14 flex-1 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                                                    Batalkan
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDelete}
                                                    className="h-14 flex-1 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20"
                                                >
                                                    Ya, Hapus Apotek
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-10">
                        <motion.section variants={itemVariants}>
                            <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <SectionHeader
                                        icon={
                                            <ShieldCheck className="w-5 h-5" />
                                        }
                                        bg="bg-emerald-50"
                                        color="text-emerald-600"
                                        title="Status & Verifikasi"
                                    />
                                    <FormField label="Status Verifikasi">
                                        <Select
                                            value={data.verification_status}
                                            onValueChange={(v) =>
                                                setData(
                                                    "verification_status",
                                                    v,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                                {VERIFICATION_OPTIONS.map(
                                                    (o) => (
                                                        <SelectItem
                                                            key={o.value}
                                                            value={o.value}
                                                            className="text-xs font-bold"
                                                        >
                                                            {o.label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                    Apotek Aktif
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                                                    Tampilkan di pencarian
                                                    publik
                                                </p>
                                            </div>
                                            <Switch
                                                checked={data.is_active}
                                                onCheckedChange={(v) =>
                                                    setData("is_active", v)
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                                            <div>
                                                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">
                                                    Tutup Paksa
                                                </p>
                                                <p className="text-[9px] text-rose-400 font-bold mt-0.5">
                                                    Override jam operasional
                                                </p>
                                            </div>
                                            <Switch
                                                checked={data.is_force_closed}
                                                onCheckedChange={(v) =>
                                                    setData(
                                                        "is_force_closed",
                                                        v,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                        <motion.section variants={itemVariants}>
                            <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <SectionHeader
                                        icon={<FileUp className="w-5 h-5" />}
                                        bg="bg-slate-50"
                                        color="text-slate-400"
                                        title="Dokumen"
                                    />
                                    <UploadZone
                                        icon={<FileText className="w-6 h-6" />}
                                        label="Dokumen SIA (.PDF)"
                                        subLabel="Ganti file SIA"
                                        hint="Maks. 5MB"
                                    />
                                    <UploadZone
                                        icon={<ImageIcon className="w-6 h-6" />}
                                        label="Foto Apotek"
                                        subLabel="Ganti Foto Utama"
                                    />
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>
                </motion.div>
            </form>
        </DashboardAdminLayout>
    );
}
