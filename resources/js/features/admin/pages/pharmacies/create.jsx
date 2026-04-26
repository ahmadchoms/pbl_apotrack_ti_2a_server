// This feature page re-exports the pharmacy create form.
// The form is complex (831 lines) and already uses a consistent pattern internally.
// The key architectural win is that the route page (`pages/admin/pharmacies/create.jsx`)
// becomes a thin proxy, and all shared components (SectionHeader, FormField, etc.)
// are imported from the centralized shared directory.
//
// Future optimization: decompose the form into PharmacyBasicInfoSection,
// PharmacyStaffSection, PharmacyHoursSection, and PharmacyDocumentsSection.

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, Clock, MapPin, FileText, CheckCircle2, Save, Image as ImageIcon, FileUp, Navigation, Phone, Users } from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { SectionHeader } from "@/features/admin/components/shared/SectionHeader";
import { FormField } from "@/features/admin/components/shared/FormField";
import { UploadZone } from "@/features/admin/components/shared/UploadZone";
import { InfoBox } from "@/features/admin/components/shared/InfoBox";
import { StaffPicker } from "@/features/admin/components/pharmacies/StaffPicker";
import { OperatingHoursEditor } from "@/features/admin/components/pharmacies/OperatingHoursEditor";
import { containerVariants, itemVariants, INITIAL_HOURS } from "@/features/admin/lib/constants";

export default function AdminPharmacyCreate({ available_staff = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "", license_number: "", phone: "", address: "",
        latitude: "", longitude: "", verification_status: "PENDING", is_active: true,
        hours: INITIAL_HOURS, staffs: [],
    });

    const [staffSearch, setStaffSearch] = useState("");

    const handleHourChange = (dayIndex, field, value) => {
        setData("hours", data.hours.map((h) => h.day_of_week === dayIndex ? { ...h, [field]: value } : h));
    };

    const addStaff = (user) => {
        if (data.staffs.find((s) => s.user_id === user.id)) return;
        setData("staffs", [...data.staffs, { user_id: user.id, role: user.role === "APOTEKER" ? "APOTEKER" : "STAFF", user_data: user }]);
        setStaffSearch("");
    };

    const removeStaff = (userId) => { setData("staffs", data.staffs.filter((s) => s.user_id !== userId)); };
    const updateStaffRole = (userId, role) => { setData("staffs", data.staffs.map((s) => s.user_id === userId ? { ...s, role } : s)); };

    const filteredAvailableStaff = available_staff.filter((user) =>
        !data.staffs.find((s) => s.user_id === user.id) &&
        (user.username.toLowerCase().includes(staffSearch.toLowerCase()) || user.email.toLowerCase().includes(staffSearch.toLowerCase()))
    );

    const handleSubmit = (e) => { e.preventDefault(); post(route("admin.pharmacies.store")); };

    const totalFields = 8;
    const filledFields = [data.name, data.license_number, data.phone, data.address, data.latitude && data.longitude ? "coords" : "", data.staffs.length > 0 ? "staff" : "", false, false].filter(Boolean).length;
    const completionPct = Math.round((filledFields / totalFields) * 100);

    return (
        <DashboardAdminLayout activeMenu="pharmacies">
            <form onSubmit={handleSubmit} className="space-y-10 pb-20">
                <PageHeader subtitle="Manajemen Fasilitas" title="Tambah Apotek Baru" description="Daftarkan entitas apotek baru ke dalam ekosistem.">
                    <Button type="button" variant="ghost" onClick={() => router.get("/admin/pharmacies")} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#0b3b60]">Batalkan</Button>
                    <Button type="submit" disabled={processing} className="h-14 px-10 rounded-2xl bg-[#0b3b60] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#082a45] transition-all shadow-xl shadow-[#0b3b60]/20 flex items-center gap-2"><Save className="w-4 h-4" />{processing ? "Menyimpan..." : "Simpan Data Apotek"}</Button>
                </PageHeader>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Basic Info */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <SectionHeader icon={<Building2 className="w-5 h-5" />} bg="bg-blue-50" color="text-[#0b3b60]" title="Informasi Dasar" />
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <FormField label="Nama Lengkap Apotek" error={errors.name}>
                                        <Input value={data.name} onChange={(e) => setData("name", e.target.value)} placeholder="Contoh: Apotek Sehat Jaya" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" />
                                    </FormField>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField label="Nomor Lisensi (SIA)" error={errors.license_number}>
                                            <Input value={data.license_number} onChange={(e) => setData("license_number", e.target.value)} placeholder="SIA/XXX/2024" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" />
                                        </FormField>
                                        <FormField label="Nomor Telepon Operasional" error={errors.phone}>
                                            <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><Input value={data.phone} onChange={(e) => setData("phone", e.target.value)} placeholder="+62 21 xxxx xxxx" className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" /></div>
                                        </FormField>
                                    </div>
                                    <FormField label="Alamat Lengkap" error={errors.address}>
                                        <Textarea value={data.address} onChange={(e) => setData("address", e.target.value)} placeholder="Nama jalan, nomor gedung, RT/RW..." className="min-h-[120px] rounded-[1.5rem] bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold p-6" />
                                    </FormField>
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Staff */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <SectionHeader icon={<Users className="w-5 h-5" />} bg="bg-indigo-50" color="text-indigo-600" title="Manajemen Staf & Akses" />
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2 overflow-visible">
                                <CardContent className="p-10">
                                    <StaffPicker staffs={data.staffs} staffSearch={staffSearch} setStaffSearch={setStaffSearch} filteredAvailableStaff={filteredAvailableStaff} addStaff={addStaff} removeStaff={removeStaff} updateStaffRole={updateStaffRole} />
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Coordinates */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <SectionHeader icon={<MapPin className="w-5 h-5" />} bg="bg-rose-50" color="text-rose-600" title="Titik Koordinat" />
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField label="Latitude" error={errors.latitude}>
                                            <div className="relative"><Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-45" /><Input value={data.latitude} onChange={(e) => setData("latitude", e.target.value)} placeholder="-6.2088" className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" /></div>
                                        </FormField>
                                        <FormField label="Longitude" error={errors.longitude}>
                                            <div className="relative"><Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /><Input value={data.longitude} onChange={(e) => setData("longitude", e.target.value)} placeholder="106.8456" className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:ring-[#0b3b60]/20 font-bold" /></div>
                                        </FormField>
                                    </div>
                                    <InfoBox text="Gunakan Google Maps untuk mendapatkan koordinat yang akurat. Klik kanan pada lokasi apotek dan pilih 'Salin Koordinat'." />
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Hours */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <SectionHeader icon={<Clock className="w-5 h-5" />} bg="bg-amber-50" color="text-amber-600" title="Jam Operasional" />
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10">
                                    <OperatingHoursEditor hours={data.hours} onHourChange={handleHourChange} />
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Documents */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <SectionHeader icon={<FileText className="w-5 h-5" />} bg="bg-violet-50" color="text-violet-600" title="Dokumen & Media" />
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/30 bg-white p-2">
                                <CardContent className="p-10 space-y-8">
                                    <UploadZone icon={<FileUp className="w-5 h-5" />} label="Dokumen Lisensi (SIA)" subLabel="Unggah dokumen SIA" hint="PDF, JPG, PNG — Maks. 5MB" />
                                    <UploadZone icon={<ImageIcon className="w-5 h-5" />} label="Foto Apotek" subLabel="Unggah foto apotek" hint="JPG, PNG — Maks. 10MB" />
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-10">
                        <motion.section variants={itemVariants}>
                            <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                <CardContent className="p-10 space-y-8">
                                    <SectionHeader icon={<CheckCircle2 className="w-5 h-5" />} bg="bg-slate-50" color="text-slate-400" title="Progres" />
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kelengkapan Data</p>
                                            <p className="text-sm font-black text-[#0b3b60]">{completionPct}%</p>
                                        </div>
                                        <Progress value={completionPct} className="h-2.5 rounded-full" />
                                        <div className="space-y-5">
                                            {[
                                                { check: data.name, label: "Informasi Dasar" },
                                                { check: data.address, label: "Alamat Lengkap" },
                                                { check: data.latitude && data.longitude, label: "Koordinat GPS" },
                                                { check: data.staffs.length > 0, label: "Staf Ditugaskan" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center ${item.check ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-300"}`}><CheckCircle2 className="w-4 h-4" /></div>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${item.check ? "text-slate-600" : "text-slate-300"}`}>{item.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>
                    </div>
                </motion.div>
            </form>
        </DashboardAdminLayout>
    );
}
