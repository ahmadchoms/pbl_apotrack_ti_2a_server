import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Decomposed Components
import { PharmacyHero } from "@/features/admin/components/pharmacies/PharmacyHero";
import { PharmacyStats } from "@/features/admin/components/pharmacies/PharmacyStats";
import { PharmacyLegality } from "@/features/admin/components/pharmacies/PharmacyLegality";
import { PharmacyStaffList } from "@/features/admin/components/pharmacies/PharmacyStaffList";
import { PharmacyOwnerInfo } from "@/features/admin/components/pharmacies/PharmacyOwnerInfo";
import { PharmacyDangerZone } from "@/features/admin/components/pharmacies/PharmacyDangerZone";

export default function PharmacyDetail({ pharmacy }) {
    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
    const [rejectionNote, setRejectionNote] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const data = pharmacy.data;

    const handleVerify = (status) => {
        router.patch(
            route("admin.pharmacies.verify-legality", data.id),
            {
                status: status,
                note: status === "REJECTED" ? rejectionNote : null,
            },
            {
                preserveScroll: true,
                onStart: () => setIsProcessing(true),
                onFinish: () => setIsProcessing(false),
                onSuccess: () => {
                    toast.success(
                        `Apotek berhasil ${status === "APPROVED" ? "disetujui" : "ditolak"}`,
                    );
                    setIsVerifyDialogOpen(false);
                    setIsRejectDialogOpen(false);
                    setRejectionNote("");
                },
                onError: () => {
                    toast.error("Terjadi kesalahan saat memproses verifikasi");
                },
            },
        );
    };

    const handleToggleSuspend = () => {
        router.patch(
            route("admin.pharmacies.toggle-suspend", data.id),
            {},
            {
                preserveScroll: true,
                onStart: () => setIsProcessing(true),
                onFinish: () => setIsProcessing(false),
                onSuccess: () => {
                    toast.success(`Status suspensi apotek berhasil diperbarui`);
                    setIsSuspendDialogOpen(false);
                },
                onError: () => {
                    toast.error(
                        "Terjadi kesalahan saat mengubah status suspensi",
                    );
                },
            },
        );
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "ACTIVE":
                return (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">
                        Aktif
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-amber-500 hover:bg-amber-600 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/20">
                        Menunggu Verifikasi
                    </Badge>
                );
            case "SUSPENDED":
                return (
                    <Badge className="bg-rose-500 hover:bg-rose-600 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-500/20">
                        Ditangguhkan
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge className="bg-slate-500 hover:bg-slate-600 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-slate-500/20">
                        Ditolak
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <DashboardAdminLayout activeMenu="Apotek">
            <Head title={`Detail Apotek - ${data.name}`} />

            <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <PharmacyHero data={data} getStatusBadge={getStatusBadge} />

                <PharmacyStats data={data} formatCurrency={formatCurrency} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Tabs defaultValue="legality" className="w-full">
                            <TabsList className="bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm h-14 mb-6">
                                <TabsTrigger
                                    value="legality"
                                    className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-widest data-[state=active]:bg-[#00346C] data-[state=active]:text-white transition-all"
                                >
                                    Legalitas & Dokumen
                                </TabsTrigger>
                                <TabsTrigger
                                    value="staff"
                                    className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-widest data-[state=active]:bg-[#00346C] data-[state=active]:text-white transition-all"
                                >
                                    Pengelola & Staf
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="legality"
                                className="mt-0 space-y-8 outline-none"
                            >
                                <PharmacyLegality
                                    data={data}
                                    isRejectDialogOpen={isRejectDialogOpen}
                                    setIsRejectDialogOpen={
                                        setIsRejectDialogOpen
                                    }
                                    isVerifyDialogOpen={isVerifyDialogOpen}
                                    setIsVerifyDialogOpen={
                                        setIsVerifyDialogOpen
                                    }
                                    rejectionNote={rejectionNote}
                                    setRejectionNote={setRejectionNote}
                                    isProcessing={isProcessing}
                                    handleVerify={handleVerify}
                                />
                            </TabsContent>

                            <TabsContent
                                value="staff"
                                className="mt-0 outline-none"
                            >
                                <PharmacyStaffList staffs={data.staffs} />
                            </TabsContent>
                        </Tabs>

                        <PharmacyDangerZone
                            data={data}
                            isSuspendDialogOpen={isSuspendDialogOpen}
                            setIsSuspendDialogOpen={setIsSuspendDialogOpen}
                            isProcessing={isProcessing}
                            handleToggleSuspend={handleToggleSuspend}
                        />
                    </div>

                    <div className="space-y-8">
                        <PharmacyOwnerInfo data={data} />
                    </div>
                </div>
            </div>
        </DashboardAdminLayout>
    );
}
