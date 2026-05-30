import React from "react";
import { motion } from "framer-motion";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ShieldCheck,
    Mail,
    Phone,
    User,
    Save,
    Trash2,
    AlertTriangle,
    ShieldAlert,
    Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { SectionHeader } from "@/features/admin/components/shared/SectionHeader";
import { FormField } from "@/features/admin/components/shared/FormField";
import {
    containerVariants,
    itemVariants,
} from "@/features/admin/lib/constants";
import { Switch } from "@/components/ui/switch";

export default function AdminUserEdit({ user, pharmacies = [], roles = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        username: user.data.username || "",
        email: user.data.email || "",
        phone: user.data.phone || "",
        role: user.data.role || "",
        pharmacy_id: user.data.pharmacy_id || "",
        is_active: user.data.is_active,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectChange = (name, value) => {
        setData(name, value);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.users.update", user.data.id), {
            onSuccess: () =>
                toast.success("Profil pengguna berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui profil pengguna"),
        });
    };

    const handleResetAvatar = () => {
        router.post(
            route("admin.users.reset-avatar", user.data.id),
            {},
            {
                onSuccess: () => toast.success("Foto profil berhasil direset"),
                onError: () => toast.error("Gagal mereset foto profil"),
            },
        );
    };

    const handleDelete = () => {
        router.delete(`/admin/users/${user.data.id}`, {
            onSuccess: () => router.get("/admin/users"),
        });
    };

    return (
        <DashboardAdminLayout activeMenu="users">
            <div className="space-y-10 pb-20">
                <PageHeader
                    subtitle="Manajemen Profil"
                    title="Edit Profil Pengguna"
                    description={`Memperbarui informasi identitas dan tingkat otoritas akun ${user.data.username}.`}
                >
                    <Button
                        variant="ghost"
                        onClick={() => router.get("/admin/users")}
                        className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary"
                    >
                        Batalkan
                    </Button>
                    <Button
                        disabled={processing}
                        onClick={submit}
                        className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#082a45] transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Simpan Perubahan
                            </>
                        )}
                    </Button>
                </PageHeader>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                >
                    <div className="lg:col-span-2 space-y-10">
                        <motion.section
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <SectionHeader
                                icon={<User className="w-5 h-5" />}
                                bg="bg-blue-50"
                                color="text-primary"
                                title="Identitas Pengguna"
                            />
                            <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="flex flex-col items-center gap-4 shrink-0">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-blue-100 rounded-[2rem] blur-2xl scale-125 opacity-40 transition-opacity" />

                                                <Avatar className="h-32 w-32 rounded-full border-8 border-white shadow-2xl relative z-10 overflow-hidden">
                                                    {user.data.avatar_url && (
                                                        <AvatarImage
                                                            src={
                                                                user.data
                                                                    .avatar_url
                                                            }
                                                            className="object-cover"
                                                        />
                                                    )}
                                                    <AvatarFallback className="bg-slate-50 text-slate-300 font-black text-2xl">
                                                        <User className="w-10 h-10" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>

                                            {user.data.avatar_url && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="mt-2 text-xs font-black uppercase tracking-widest text-rose-600 hover:text-white hover:bg-rose-600 border-rose-100 hover:border-transparent rounded-xl h-10 px-4"
                                                        >
                                                            Reset Avatar
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-lg">
                                                        <AlertDialogHeader className="flex flex-col items-center justify-center">
                                                            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mb-6 mx-auto">
                                                                <AlertTriangle className="w-10 h-10" />
                                                            </div>
                                                            <AlertDialogTitle className="text-2xl font-black text-slate-900 text-center mb-2 uppercase tracking-tight w-full">
                                                                Reset Foto
                                                                Profil
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-sm font-bold text-slate-400 text-center leading-relaxed">
                                                                Apakah Anda
                                                                yakin ingin
                                                                menghapus foto
                                                                profil ini dan
                                                                mengembalikannya
                                                                ke default
                                                                sistem?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="flex flex-row items-center justify-center gap-4 mt-10">
                                                            <AlertDialogCancel className="h-14 flex-1 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                                                                Batalkan
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={
                                                                    handleResetAvatar
                                                                }
                                                                className="h-14 flex-1 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20"
                                                            >
                                                                Ya, Hapus Foto
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-8">
                                            <FormField
                                                label="Nama Lengkap / Username"
                                                error={errors.username}
                                            >
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <Input
                                                        name="username"
                                                        value={data.username}
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="Masukkan nama pengguna..."
                                                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-primary/20 font-bold"
                                                    />
                                                </div>
                                            </FormField>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <FormField
                                                    label="Email Connection"
                                                    error={errors.email}
                                                >
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                        <Input
                                                            name="email"
                                                            type="email"
                                                            value={data.email}
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            placeholder="admin@example.com"
                                                            className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-primary/20 font-bold"
                                                        />
                                                    </div>
                                                </FormField>
                                                <FormField
                                                    label="Phone Number"
                                                    error={errors.phone}
                                                >
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                        <Input
                                                            name="phone"
                                                            value={data.phone}
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            placeholder="+62 812..."
                                                            className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-primary/20 font-bold"
                                                        />
                                                    </div>
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                        <motion.section
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <SectionHeader
                                icon={<ShieldCheck className="w-5 h-5" />}
                                bg="bg-emerald-50"
                                color="text-emerald-600"
                                title="Keamanan & Otoritas"
                            />
                            <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField
                                            label="Tingkat Otoritas (Role)"
                                            error={errors.role}
                                        >
                                            <Select
                                                value={data.role}
                                                onValueChange={(v) =>
                                                    handleSelectChange(
                                                        "role",
                                                        v,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-primary/20 font-bold">
                                                    <SelectValue placeholder="Pilih Role" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                                    {roles.map((r) => (
                                                        <SelectItem
                                                            key={r}
                                                            value={r}
                                                            className="text-xs font-bold"
                                                        >
                                                            {r
                                                                .split("_")
                                                                .map(
                                                                    (word) =>
                                                                        word
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase() +
                                                                        word
                                                                            .slice(
                                                                                1,
                                                                            )
                                                                            .toLowerCase(),
                                                                )
                                                                .join(" ")}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        {(data.role === "PHARMACY_STAFF" ||
                                            data.role === "APOTEKER") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                            >
                                                <FormField
                                                    label="Afiliasi Apotek"
                                                    error={errors.pharmacy_id}
                                                >
                                                    <Select
                                                        value={data.pharmacy_id}
                                                        onValueChange={(v) =>
                                                            handleSelectChange(
                                                                "pharmacy_id",
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-primary/20 font-bold">
                                                            <SelectValue placeholder="Pilih Unit Apotek" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                                            {pharmacies.map(
                                                                (p) => (
                                                                    <SelectItem
                                                                        key={
                                                                            p.id
                                                                        }
                                                                        value={
                                                                            p.id
                                                                        }
                                                                        className="text-xs font-bold"
                                                                    >
                                                                        {p.name}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormField>
                                            </motion.div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
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
                                            Hapus Akun Pengguna
                                        </h4>
                                        <p className="text-xs font-bold text-rose-600/60 leading-relaxed max-w-md">
                                            Tindakan ini bersifat permanen.
                                            Seluruh data akses, riwayat, dan
                                            afiliasi akan dihapus dari sistem
                                            secara permanen.
                                        </p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="h-14 px-10 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center gap-2 shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />{" "}
                                                Hapus Akun Permanen
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
                                                    menghapus akun{" "}
                                                    <span className="text-slate-900">
                                                        {user.data.username}
                                                    </span>
                                                    ? Tindakan ini tidak dapat
                                                    dibatalkan dan akan memutus
                                                    seluruh akses pengguna ke
                                                    ekosistem.
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
                                                    Ya, Hapus Akun
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>
                    <div className="space-y-10">
                        <motion.section
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <SectionHeader
                                        icon={
                                            <ShieldCheck className="w-5 h-5" />
                                        }
                                        bg="bg-slate-50"
                                        color="text-slate-400"
                                        title="Manajemen Akses"
                                    />

                                    <div
                                        className={`p-6 rounded-[2rem] border transition-all duration-300 flex items-center justify-between gap-6 ${
                                            data.is_active
                                                ? "bg-emerald-50/30 border-emerald-100/80"
                                                : "bg-slate-50/50 border-slate-100"
                                        }`}
                                    >
                                        <div className="flex flex-col text-left">
                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                                                {data.is_active
                                                    ? "Akun Aktif"
                                                    : "Akun Nonaktif"}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-0.5 normal-case font-normal">
                                                {data.is_active
                                                    ? "Dapat mengakses sistem"
                                                    : "Akses ditangguhkan sementara"}
                                            </span>
                                        </div>

                                        <Switch
                                            checked={data.is_active}
                                            onCheckedChange={(checked) =>
                                                setData("is_active", checked)
                                            }
                                            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-300 shrink-0"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                                Terdaftar Sejak
                                            </p>
                                            <p className="text-xs font-black text-slate-800 mt-0.5">
                                                {user.data.created_at
                                                    ? new Date(
                                                          user.data.created_at,
                                                      ).toLocaleDateString(
                                                          "id-ID",
                                                          {
                                                              day: "numeric",
                                                              month: "short",
                                                              year: "numeric",
                                                          },
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>
                </motion.div>
            </div>
        </DashboardAdminLayout>
    );
}
