import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AdminLayout } from "@/layouts/admin-layout";
import {
    ChevronLeft,
    ShieldCheck,
    ShieldAlert,
    MapPin,
    Phone,
    User,
    FileText,
    TrendingUp,
    ShoppingBag,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Eye,
    ExternalLink,
    Lock,
    Loader2,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
        <AdminLayout activeMenu="Apotek">
            <Head title={`Detail Apotek - ${data.name}`} />

            <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <Link
                            href={route("admin.pharmacies.index")}
                            className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-4 group"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />{" "}
                            Kembali ke Daftar
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                {data.name}
                            </h1>
                            {getStatusBadge(data.verification_status)}
                        </div>
                        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />{" "}
                            {data.address}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route("admin.pharmacies.edit", data.id)}
                            className="inline-flex items-center justify-center rounded-2xl h-12 px-6 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                        >
                            Edit Profil
                        </Link>
                        <Link 
                            href={route("admin.profile.audit-history", { search: data.name })}
                            className="inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-[#00346C] hover:bg-[#002a58] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all"
                        >
                            Log Aktivitas
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="rounded-[2rem] border-none shadow-2xl shadow-slate-200/50 bg-linear-to-br from-white to-slate-50/50 overflow-hidden group">
                            <CardContent className="p-8 relative">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <TrendingUp className="w-20 h-20 text-indigo-600" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    Total Omset
                                </p>
                                <h3 className="text-3xl font-black text-slate-900">
                                    {formatCurrency(data.stats.total_revenue)}
                                </h3>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                        Transaksi Berhasil
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="rounded-[2rem] border-none shadow-2xl shadow-slate-200/50 bg-linear-to-br from-white to-slate-50/50 overflow-hidden group">
                            <CardContent className="p-8 relative">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <ShoppingBag className="w-20 h-20 text-amber-600" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    Total Pesanan
                                </p>
                                <h3 className="text-3xl font-black text-slate-900">
                                    {data.stats.total_orders}
                                </h3>
                                <div className="mt-4 flex items-center gap-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Pesanan Selesai
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="rounded-[2rem] border-none shadow-2xl shadow-slate-200/50 bg-linear-to-br from-white to-slate-50/50 overflow-hidden group">
                            <CardContent className="p-8 relative">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <Calendar className="w-20 h-20 text-emerald-600" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    Bergabung Sejak
                                </p>
                                <h3 className="text-3xl font-black text-slate-900">
                                    {data.stats.joined_at}
                                </h3>
                                <div className="mt-4 flex items-center gap-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Mitra ApoTrack
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="rounded-[2rem] border-none shadow-2xl shadow-slate-200/50 bg-linear-to-br from-white to-slate-50/50 overflow-hidden group">
                            <CardContent className="p-8 relative">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <ShieldCheck className="w-20 h-20 text-indigo-600" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    Rating Platform
                                </p>
                                <h3 className="text-3xl font-black text-slate-900">
                                    {data.rating || "0.0"}
                                </h3>
                                <div className="mt-4 flex items-center gap-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {data.total_reviews} Ulasan Pelanggan
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
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
                                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                    <CardHeader className="p-8 border-b border-slate-50">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                                            Verifikasi Dokumen Legal
                                        </CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                                            Tinjau dokumen SIA (Surat Izin
                                            Apotek) dan SIPA Apoteker
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                                        Nomor SIA
                                                    </p>
                                                    <p className="text-lg font-black text-slate-800">
                                                        {data.legality
                                                            ?.sia_number ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                                        Nomor SIPA
                                                    </p>
                                                    <p className="text-lg font-black text-slate-800">
                                                        {data.pharmacist
                                                            ?.sipa || "N/A"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="relative group">
                                                <div className="aspect-3/4 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-300">
                                                    {data.legality
                                                        ?.sia_document_url ? (
                                                        <>
                                                            <img
                                                                src={
                                                                    data
                                                                        .legality
                                                                        .sia_document_url
                                                                }
                                                                alt={`Dokumen SIA ${data.name}`}
                                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                                <Button
                                                                    variant="secondary"
                                                                    className="rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9"
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />{" "}
                                                                    Lihat
                                                                </Button>
                                                                <a
                                                                    href={
                                                                        data
                                                                            .legality
                                                                            .sia_document_url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <Button
                                                                        variant="secondary"
                                                                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9"
                                                                    >
                                                                        <ExternalLink className="w-4 h-4 mr-2" />{" "}
                                                                        Tab Baru
                                                                    </Button>
                                                                </a>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-8">
                                                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                                Dokumen belum
                                                                diunggah
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-50">
                                                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {data.verification_status ===
                                            "PENDING" && (
                                            <div className="pt-8 border-t border-slate-50 flex items-center justify-between gap-6">
                                                <div className="flex-1">
                                                    <p className="text-[11px] font-bold text-slate-600 mb-1">
                                                        Butuh Tindakan Admin
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Pastikan nomor SIA dan
                                                        dokumen fisik cocok
                                                        sebelum menyetujui.
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Dialog
                                                        open={
                                                            isRejectDialogOpen
                                                        }
                                                        onOpenChange={
                                                            setIsRejectDialogOpen
                                                        }
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-12 px-6 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black text-[10px] uppercase tracking-widest border border-rose-100"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />{" "}
                                                                Tolak Dokumen
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-106.25 rounded-[2rem]">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-xl font-black text-slate-900">
                                                                    Tolak
                                                                    Verifikasi
                                                                </DialogTitle>
                                                                <DialogDescription className="text-sm font-medium text-slate-500">
                                                                    Berikan
                                                                    alasan
                                                                    penolakan
                                                                    agar apotek
                                                                    dapat
                                                                    memperbaiki
                                                                    dokumen
                                                                    mereka.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="py-4">
                                                                <Label
                                                                    htmlFor="reason"
                                                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                                                                >
                                                                    Alasan
                                                                    Penolakan
                                                                </Label>
                                                                <Textarea
                                                                    id="reason"
                                                                    className="mt-2 rounded-2xl border-slate-200 focus:ring-rose-500/10 min-h-30"
                                                                    placeholder="Misal: Foto dokumen tidak jelas, nomor SIA tidak valid..."
                                                                    value={
                                                                        rejectionNote
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setRejectionNote(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <Button
                                                                    className="w-full h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20"
                                                                    onClick={() =>
                                                                        handleVerify(
                                                                            "REJECTED",
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !rejectionNote || isProcessing
                                                                    }
                                                                >
                                                                    {isProcessing ? (
                                                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
                                                                    ) : (
                                                                        "Kirim Penolakan"
                                                                    )}
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog
                                                        open={
                                                            isVerifyDialogOpen
                                                        }
                                                        onOpenChange={
                                                            setIsVerifyDialogOpen
                                                        }
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button className="h-12 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">
                                                                <CheckCircle2 className="w-4 h-4 mr-2" />{" "}
                                                                Verifikasi &
                                                                Setujui
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-106.25 rounded-[2rem]">
                                                            <DialogHeader className="flex flex-col items-center text-center">
                                                                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                                                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                                                </div>
                                                                <DialogTitle className="text-xl font-black text-slate-900">
                                                                    Konfirmasi
                                                                    Verifikasi
                                                                </DialogTitle>
                                                                <DialogDescription className="text-sm font-medium text-slate-500">
                                                                    Dengan
                                                                    menyetujui,
                                                                    apotek{" "}
                                                                    <strong>
                                                                        {
                                                                            data.name
                                                                        }
                                                                    </strong>{" "}
                                                                    akan segera
                                                                    aktif dan
                                                                    dapat
                                                                    melakukan
                                                                    transaksi di
                                                                    platform.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter className="mt-6 flex-col gap-3">
                                                                <Button
                                                                    className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                                                                    onClick={() =>
                                                                        handleVerify(
                                                                            "APPROVED",
                                                                        )
                                                                    }
                                                                    disabled={isProcessing}
                                                                >
                                                                    {isProcessing ? (
                                                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
                                                                    ) : (
                                                                        "Ya, Setujui Sekarang"
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="w-full h-12 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400"
                                                                    onClick={() =>
                                                                        setIsVerifyDialogOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                >
                                                                    Batal
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent
                                value="staff"
                                className="mt-0 outline-none"
                            >
                                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                                    <CardHeader className="p-8 border-b border-slate-50">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                                            Daftar Staf Terdaftar
                                        </CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                                            Pengguna yang memiliki akses ke
                                            dashboard apotek ini
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-6">
                                            {data.staffs.map((staff) => (
                                                <div
                                                    key={staff.id}
                                                    className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
                                                            {staff.avatar ? (
                                                                <img
                                                                    src={
                                                                        staff.avatar
                                                                    }
                                                                    alt={staff.username}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                                                                    <User className="w-6 h-6 text-indigo-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-800">
                                                                {staff.username}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                                {staff.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        className={`${staff.role === "APOTEKER" ? "bg-indigo-500" : "bg-slate-400"} border-none text-[8px] font-black uppercase tracking-widest px-3`}
                                                    >
                                                        {staff.role}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Danger Zone */}
                        <Card className="rounded-[2.5rem] border-2 border-dashed border-rose-100 bg-rose-50/20 overflow-hidden">
                            <CardHeader className="p-8">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Danger
                                    Zone
                                </CardTitle>
                                <CardDescription className="text-xs font-medium text-slate-400 mt-1">
                                    Tindakan yang dapat berdampak signifikan
                                    pada operasional mitra
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 pt-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="max-w-md">
                                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1">
                                        {data.verification_status ===
                                        "SUSPENDED"
                                            ? "Aktifkan Kembali Apotek"
                                            : "Tangguhkan Akses Apotek (Suspend)"}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {data.verification_status ===
                                        "SUSPENDED"
                                            ? "Memberikan kembali hak akses kepada seluruh staf untuk mengelola dashboard dan melakukan transaksi."
                                            : "Seluruh staf apotek ini tidak akan bisa login ke dashboard. Apotek juga tidak akan muncul di hasil pencarian pelanggan."}
                                    </p>
                                </div>
                                <Dialog
                                    open={isSuspendDialogOpen}
                                    onOpenChange={setIsSuspendDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant={
                                                data.verification_status ===
                                                "SUSPENDED"
                                                    ? "default"
                                                    : "destructive"
                                            }
                                            className={`rounded-2xl h-14 px-8 font-black text-[11px] uppercase tracking-widest shadow-xl ${data.verification_status === "SUSPENDED" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"}`}
                                        >
                                            {data.verification_status ===
                                            "SUSPENDED" ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 mr-3" />{" "}
                                                    Re-Activate Pharmacy
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-5 h-5 mr-3" />{" "}
                                                    Suspend Pharmacy
                                                </>
                                            )}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-106.25 rounded-[2rem]">
                                        <DialogHeader className="flex flex-col items-center text-center">
                                            <div
                                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${data.verification_status === "SUSPENDED" ? "bg-emerald-50" : "bg-rose-50"}`}
                                            >
                                                <AlertTriangle
                                                    className={`w-10 h-10 ${data.verification_status === "SUSPENDED" ? "text-emerald-500" : "text-rose-500"}`}
                                                />
                                            </div>
                                            <DialogTitle className="text-xl font-black text-slate-900">
                                                {data.verification_status ===
                                                "SUSPENDED"
                                                    ? "Konfirmasi Re-Aktivasi"
                                                    : "Konfirmasi Suspensi"}
                                            </DialogTitle>
                                            <DialogDescription className="text-sm font-medium text-slate-500 mt-2 px-4">
                                                {data.verification_status ===
                                                "SUSPENDED"
                                                    ? "Apakah Anda yakin ingin mengaktifkan kembali apotek ini? Akses staf akan segera dipulihkan."
                                                    : "Anda akan membekukan seluruh operasional apotek ini. Tindakan ini akan mencatat riwayat di log platform."}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="bg-slate-50 p-6 rounded-3xl my-4 border border-slate-100">
                                            <div className="flex items-start gap-4">
                                                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                                                    "Tindakan suspensi biasanya
                                                    dilakukan karena adanya
                                                    pelanggaran syarat &
                                                    ketentuan atau
                                                    ketidakvalidan dokumen yang
                                                    fatal."
                                                </p>
                                            </div>
                                        </div>
                                        <DialogFooter className="bg-red-300">
                                            <div className="space-y-3 bg-red-200">
                                                <Button
                                                    className={`w-full h-12 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl ${data.verification_status === "SUSPENDED" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"}`}
                                                    onClick={
                                                        handleToggleSuspend
                                                    }
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? (
                                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
                                                    ) : (
                                                        "Ya, Konfirmasi Tindakan"
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full h-12 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400"
                                                    onClick={() =>
                                                        setIsSuspendDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Quick Info */}
                    <div className="space-y-8">
                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-50">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                                    Info Pemilik
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                                            {data.pharmacist?.avatar ? (
                                                <img
                                                    src={data.pharmacist.avatar}
                                                    alt={data.pharmacist.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-8 h-8 text-indigo-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-800 leading-tight">
                                                {data.pharmacist?.name ||
                                                    "Unknown"}
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className="bg-indigo-50 text-indigo-600 border-none text-[8px] font-black uppercase tracking-widest px-3 mt-1"
                                            >
                                                Apoteker Penanggungjawab
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                    WhatsApp/Telp
                                                </p>
                                            </div>
                                            <p className="text-xs font-black text-slate-800">
                                                {data.pharmacist?.phone || "-"}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                                    <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                    No. SIPA
                                                </p>
                                            </div>
                                            <p className="text-xs font-black text-slate-800">
                                                {data.pharmacist?.sipa || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <a
                                        href={`https://wa.me/${data.pharmacist?.phone?.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full h-12 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest transition-colors"
                                    >
                                        Hubungi Apoteker
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-50">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                                    Lokasi & Kontak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="aspect-video rounded-3xl bg-slate-100 border border-slate-200 relative overflow-hidden group">
                                    {/* Placeholder for map */}
                                    <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center">
                                        <MapPin className="w-10 h-10 text-indigo-200 animate-bounce" />
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-full h-10 rounded-xl bg-white/90 backdrop-blur shadow-lg font-bold text-[10px] uppercase tracking-widest text-slate-800 hover:bg-white transition-colors"
                                        >
                                            Buka di Google Maps
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                            {data.address}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-indigo-500" />
                                        <p className="text-xs font-medium text-slate-500">
                                            {data.phone}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
