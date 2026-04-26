import React, { useState } from "react";
import { motion } from "framer-motion";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Mail, Phone, User, Save, Camera, Trash2, AlertTriangle, ShieldAlert, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { router } from "@inertiajs/react";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { SectionHeader } from "@/features/admin/components/shared/SectionHeader";
import { FormField } from "@/features/admin/components/shared/FormField";
import { containerVariants, itemVariants } from "@/features/admin/lib/constants";

export default function AdminUserEdit({ user, pharmacies = [], roles = [] }) {
    const [formData, setFormData] = useState({
        username: user.username || "", email: user.email || "", phone: user.phone || "",
        role: user.role || "", pharmacy_id: user.pharmacy_id || "", is_active: user.is_active,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = () => {
        router.delete(`/admin/users/${user.id}`, { onSuccess: () => router.get("/admin/users") });
    };

    return (
        <DashboardAdminLayout activeMenu="users">
            <div className="space-y-10 pb-20">
                <PageHeader subtitle="Manajemen Profil" title="Edit Profil Pengguna" description={`Memperbarui informasi identitas dan tingkat otoritas akun ${user.username}.`}>
                    <Button variant="ghost" onClick={() => router.get("/admin/users")} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#0b3b60]">Batalkan</Button>
                    <Button className="h-14 px-10 rounded-2xl bg-[#0b3b60] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#082a45] transition-all shadow-xl shadow-[#0b3b60]/20 flex items-center gap-2"><Save className="w-4 h-4" /> Simpan Perubahan</Button>
                </PageHeader>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <motion.section variants={itemVariants} className="space-y-6">
                            <SectionHeader icon={<User className="w-5 h-5" />} bg="bg-blue-50" color="text-[#0b3b60]" title="Identitas Pengguna" />
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="flex flex-col items-center gap-4 shrink-0">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-blue-100 rounded-[2rem] blur-2xl scale-125 opacity-40 group-hover:opacity-60 transition-opacity" />
                                                <Avatar className="h-32 w-32 rounded-[2rem] border-8 border-white shadow-2xl relative z-10">
                                                    <AvatarImage src={user.avatar_url} />
                                                    <AvatarFallback className="bg-slate-50 text-slate-300 font-black text-2xl">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#0b3b60] rounded-2xl border-4 border-white text-white flex items-center justify-center shadow-xl z-20 hover:scale-110 transition-transform"><Camera className="w-4 h-4" /></button>
                                            </div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Update Foto</p>
                                        </div>
                                        <div className="flex-1 space-y-8">
                                            <FormField label="Nama Lengkap / Username">
                                                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan nama pengguna..." className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" /></div>
                                            </FormField>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <FormField label="Email Connection">
                                                    <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="admin@example.com" className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" /></div>
                                                </FormField>
                                                <FormField label="Phone Number">
                                                    <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+62 812..." className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" /></div>
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                        <motion.section variants={itemVariants} className="space-y-6">
                            <SectionHeader icon={<ShieldCheck className="w-5 h-5" />} bg="bg-emerald-50" color="text-emerald-600" title="Keamanan & Otoritas" />
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField label="Tingkat Otoritas (Role)">
                                            <Select value={formData.role} onValueChange={(v) => handleSelectChange("role", v)}>
                                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold"><SelectValue placeholder="Pilih Role" /></SelectTrigger>
                                                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                                    {roles.map((r) => (<SelectItem key={r} value={r} className="text-xs font-bold">{r.replace("_", " ")}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        {(formData.role === "PHARMACY_STAFF" || formData.role === "APOTEKER") && (
                                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                                <FormField label="Afiliasi Apotek">
                                                    <Select value={formData.pharmacy_id} onValueChange={(v) => handleSelectChange("pharmacy_id", v)}>
                                                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold"><SelectValue placeholder="Pilih Unit Apotek" /></SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                                            {pharmacies.map((p) => (<SelectItem key={p.id} value={p.id} className="text-xs font-bold">{p.name}</SelectItem>))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormField>
                                            </motion.div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                        <motion.section variants={itemVariants} className="space-y-6 pt-10">
                            <SectionHeader icon={<ShieldAlert className="w-5 h-5" />} bg="bg-rose-50" color="text-rose-600" title="Zona Berbahaya" />
                            <Card className="rounded-[2.5rem] border-2 border-rose-100 bg-rose-50/20 p-2">
                                <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <h4 className="text-base font-black text-rose-900 leading-none">Hapus Akun Pengguna</h4>
                                        <p className="text-xs font-bold text-rose-600/60 leading-relaxed max-w-md">Tindakan ini bersifat permanen. Seluruh data akses, riwayat, dan afiliasi akan dihapus dari sistem secara permanen.</p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="h-14 px-10 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center gap-2 shrink-0"><Trash2 className="w-4 h-4" /> Hapus Akun Permanen</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-lg">
                                            <AlertDialogHeader>
                                                <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mb-6 mx-auto"><AlertTriangle className="w-10 h-10" /></div>
                                                <AlertDialogTitle className="text-2xl font-black text-slate-900 text-center mb-2 uppercase tracking-tight">Konfirmasi Penghapusan</AlertDialogTitle>
                                                <AlertDialogDescription className="text-sm font-bold text-slate-400 text-center leading-relaxed">Apakah Anda yakin ingin menghapus akun <span className="text-slate-900">{user.username}</span>? Tindakan ini tidak dapat dibatalkan dan akan memutus seluruh akses pengguna ke ekosistem.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex flex-row items-center justify-center gap-4 mt-10">
                                                <AlertDialogCancel className="h-14 flex-1 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Batalkan</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete} className="h-14 flex-1 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20">Ya, Hapus Akun</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>
                    <div className="space-y-10">
                        <motion.section variants={itemVariants} className="space-y-6">
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <SectionHeader icon={<ShieldCheck className="w-5 h-5" />} bg="bg-slate-50" color="text-slate-400" title="Status Akun" />
                                    <div className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 flex flex-col items-center gap-4 text-center">
                                        <div className={`w-3 h-3 rounded-full ${formData.is_active ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"} animate-pulse`} />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{formData.is_active ? "Terverifikasi" : "Tertunda / Nonaktif"}</p>
                                            <p className="text-[9px] font-bold text-slate-400 mt-1">Status Keamanan Jaringan</p>
                                        </div>
                                    </div>
                                    <div className="space-y-5 pt-4 border-t border-slate-50">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Informasi Tambahan</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-xl bg-blue-50 text-[#0b3b60] flex items-center justify-center shrink-0"><Calendar className="w-3.5 h-3.5" /></div>
                                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">Update Terakhir: <span className="text-slate-900">Hari Ini</span></p>
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
