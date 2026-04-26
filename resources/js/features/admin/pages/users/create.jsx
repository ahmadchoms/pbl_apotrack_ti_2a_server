import React, { useState } from "react";
import { motion } from "framer-motion";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, ShieldCheck, Mail, Phone, User, Lock, Building2, CheckCircle2, Save, Camera } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { router } from "@inertiajs/react";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { SectionHeader } from "@/features/admin/components/shared/SectionHeader";
import { FormField } from "@/features/admin/components/shared/FormField";
import { InfoBox } from "@/features/admin/components/shared/InfoBox";
import { containerVariants, itemVariants } from "@/features/admin/lib/constants";

export default function AdminUserCreate({ pharmacies = [], roles = [] }) {
    const [formData, setFormData] = useState({
        username: "", email: "", phone: "", password: "", role: "", pharmacy_id: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const totalFields = 5;
    const filledFields = [formData.username, formData.email, formData.password, formData.role, formData.role === "PHARMACY_STAFF" || formData.role === "APOTEKER" ? formData.pharmacy_id : true].filter((v) => v && v !== "").length;
    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    return (
        <DashboardAdminLayout activeMenu="users">
            <div className="space-y-10 pb-20">
                <PageHeader subtitle="Otentikasi Sistem" title="Tambah Pengguna Baru" description="Buat kredensial akses baru untuk personel atau pelanggan dalam ekosistem.">
                    <Button variant="ghost" onClick={() => router.get("/admin/users")} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#0b3b60]">Batalkan</Button>
                    <Button className="h-14 px-10 rounded-2xl bg-[#0b3b60] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#082a45] transition-all shadow-xl shadow-[#0b3b60]/20 flex items-center gap-2">
                        <Save className="w-4 h-4" /> Buat Akun Pengguna
                    </Button>
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
                                                    <AvatarFallback className="bg-slate-50 text-slate-300 font-black text-2xl"><User className="w-10 h-10" /></AvatarFallback>
                                                </Avatar>
                                                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#0b3b60] rounded-2xl border-4 border-white text-white flex items-center justify-center shadow-xl z-20 hover:scale-110 transition-transform"><Camera className="w-4 h-4" /></button>
                                            </div>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Avatar Default</p>
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
                                    <div className="space-y-2 pt-4 border-t border-slate-50">
                                        <FormField label="Password Initial">
                                            <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><Input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" /></div>
                                        </FormField>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                        <motion.section variants={itemVariants} className="space-y-6">
                            <SectionHeader icon={<ShieldCheck className="w-5 h-5" />} bg="bg-emerald-50" color="text-emerald-600" title="Hak Akses & Afiliasi" />
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
                    </div>
                    <div className="space-y-10">
                        <motion.section variants={itemVariants} className="space-y-6">
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <SectionHeader icon={<ShieldCheck className="w-5 h-5" />} bg="bg-slate-50" color="text-slate-400" title="Ringkasan" />
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validitas Form</p>
                                            <p className="text-sm font-black text-[#0b3b60]">{completionPercentage}%</p>
                                        </div>
                                        <Progress value={completionPercentage} className="h-2.5 rounded-full" />
                                        <div className="space-y-5">
                                            {[{ check: formData.username && formData.email, label: "Data Identitas Lengkap" }, { check: formData.password, label: "Kredensial Aman" }, { check: formData.role, label: "Otoritas Ditetapkan" }].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center ${item.check ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-300"}`}><CheckCircle2 className="w-4 h-4" /></div>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${item.check ? "text-slate-600" : "text-slate-300"}`}>{item.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-8 border-t border-slate-50 space-y-4">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Sistem Security Note</p>
                                        <InfoBox text="Pengguna baru akan menerima email aktivasi setelah akun dibuat oleh Administrator." />
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
