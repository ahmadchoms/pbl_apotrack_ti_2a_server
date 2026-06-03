"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    CheckCircle2,
    CircleDashed,
    Circle,
    MessageCircle,
    Camera,
    ClipboardList,
    BookOpen,
    FileText,
    Info,
    AlertCircle,
    Phone,
    MapPin,
    Building2,
    Calendar,
    ArrowRight,
    Shield,
    Sparkles,
    Check,
    ArrowLeft,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";

const NEXT_STEPS = [
    {
        id: 1,
        icon: ClipboardList,
        title: "Inventori Obat",
        text: "Siapkan daftar inventori obat awal apotek Anda",
        accent: "from-blue-500 to-indigo-500",
    },
    {
        id: 2,
        icon: Camera,
        title: "Foto Apotek",
        text: "Siapkan foto profil apotek dan fasilitas pendukung",
        accent: "from-purple-500 to-pink-500",
    },
    {
        id: 3,
        icon: BookOpen,
        title: "Panduan Sistem",
        text: "Pelajari panduan sistem manajemen apotek kami",
        accent: "from-emerald-500 to-teal-500",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
};

function BackgroundOrbs() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <motion.div
                className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full filter blur-[100px]"
                style={{
                    background:
                        "radial-gradient(circle, rgba(11,59,96,0.12) 0%, rgba(37,137,208,0.03) 70%)",
                }}
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, 30, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 15,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute -bottom-80 -right-60 w-[800px] h-[800px] rounded-full filter blur-[120px]"
                style={{
                    background:
                        "radial-gradient(circle, rgba(26,111,173,0.08) 0%, rgba(99,102,241,0.02) 70%)",
                }}
                animate={{
                    scale: [1, 1.12, 1],
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 18,
                    ease: "easeInOut",
                    delay: 3,
                }}
            />
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(#0b3b60 1.5px, transparent 1.5px)`,
                    backgroundSize: "32px 32px",
                }}
            />
        </div>
    );
}

function TimelineStep({ icon: Icon, title, desc, status, isLast }) {
    const isPending = status === "pending";
    const isDone = status === "done";
    const isRejected = status === "rejected";
    const isWaiting = status === "waiting";

    const ringColor = isDone
        ? "border-emerald-500/30 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10"
        : isRejected
          ? "border-rose-500/30 bg-rose-50 text-rose-600 shadow-lg shadow-rose-500/10"
          : isPending
            ? "border-blue-500/40 bg-blue-50/50 text-primary shadow-lg shadow-blue-500/10"
            : "border-slate-200 bg-slate-50 text-slate-400";

    return (
        <div className="flex gap-6 relative group">
            {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 bottom-[-2.5rem] bg-slate-100 overflow-hidden">
                    <motion.div
                        className="w-full h-full bg-linear-to-b from-emerald-500 via-blue-500 to-slate-200"
                        initial={{ y: "-100%" }}
                        animate={{ y: isDone ? "0%" : "-100%" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />
                </div>
            )}

            <div className="relative z-10 shrink-0">
                <motion.div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${ringColor}`}
                    whileHover={{ scale: 1.05 }}
                    animate={
                        isPending
                            ? {
                                  boxShadow: [
                                      "0 0 0 0px rgba(37,137,208,0.2)",
                                      "0 0 0 10px rgba(37,137,208,0)",
                                  ],
                              }
                            : {}
                    }
                    transition={
                        isPending
                            ? { repeat: Infinity, duration: 2, ease: "easeOut" }
                            : {}
                    }
                >
                    {isPending ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "linear",
                            }}
                        >
                            <CircleDashed className="w-5 h-5" />
                        </motion.div>
                    ) : isDone ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <Icon className="w-5 h-5" />
                    )}
                </motion.div>
            </div>

            <div className="pb-8 pt-1 flex-1">
                <h4
                    className={`text-sm font-semibold transition-colors duration-300 ${
                        isWaiting
                            ? "text-slate-400"
                            : "text-slate-900 group-hover:text-primary"
                    }`}
                >
                    {title}
                </h4>
                {desc && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                        {desc}
                    </p>
                )}
            </div>
        </div>
    );
}

function DataField({ icon: Icon, label, value, mono }) {
    return (
        <div className="space-y-2 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{label}</span>
            </div>
            {mono ? (
                <div className="flex">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-mono font-bold text-primary bg-blue-50 border border-blue-100">
                        {value}
                    </span>
                </div>
            ) : (
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {value}
                </p>
            )}
        </div>
    );
}

export default function WaitingRoomPage({ registration }) {
    const isRejected = registration.isRejected;

    return (
        <div className="min-h-screen bg-slate-50/60 flex flex-col items-center py-16 px-4 sm:px-6 md:px-8 relative overflow-hidden font-sans">
            <BackgroundOrbs />

            <motion.div
                variants={fadeUpVariants}
                className="mb-6 align-start self-start"
            >
                <Link
                    href={route("auth.logout")}
                    method="post"
                    as="button"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 bg-white/80 hover:bg-white border border-slate-200/80 rounded-xl hover:text-primary hover:border-primary hover:shadow-md active:scale-95 transition-all duration-300 cursor-pointer shadow-sm shadow-slate-100"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Login</span>
                </Link>
            </motion.div>

            <motion.div
                className="relative z-10 w-full max-w-6xl flex-1 flex flex-col"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.header
                    variants={fadeUpVariants}
                    className="mb-14 text-center"
                >
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Status Verifikasi Apotek
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
                        Terima kasih telah bergabung. Pendaftaran Anda sedang
                        ditinjau oleh tim kepatuhan sistem kami.
                    </p>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div variants={fadeUpVariants}>
                            <Card className="pt-0 border border-slate-200/80 rounded-[2.5rem] shadow-xl shadow-slate-200/30 bg-white/80 backdrop-blur-md overflow-hidden">
                                <CardHeader className="p-8 md:p-10 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900">
                                            Tahapan Verifikasi
                                        </CardTitle>
                                        <CardDescription className="text-xs text-slate-500 mt-1 font-medium">
                                            Peninjauan kelayakan operasional dan
                                            keaslian dokumen
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        className={`self-start sm:self-center rounded-2xl text-[11px] font-bold px-4 py-2 border shadow-none transition-all duration-300 uppercase tracking-wider ${
                                            isRejected
                                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                                : "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
                                        }`}
                                    >
                                        {isRejected
                                            ? "Pendaftaran Ditolak"
                                            : "Menunggu Review"}
                                    </Badge>
                                </CardHeader>

                                <CardContent className="p-8 md:p-10">
                                    <TimelineStep
                                        icon={CheckCircle2}
                                        title="Data Terkirim & Diterima"
                                        desc={`Pengajuan pendaftaran apotek Anda sukses disubmit pada ${registration.submissionDate}`}
                                        status="done"
                                    />
                                    <TimelineStep
                                        icon={
                                            isRejected
                                                ? AlertCircle
                                                : CircleDashed
                                        }
                                        title={
                                            isRejected
                                                ? "Dokumen Kepatuhan Ditolak"
                                                : "Validasi Dokumen & Legalitas"
                                        }
                                        desc={
                                            isRejected
                                                ? "Verifikasi dokumen dibatalkan karena terindikasi ketidaksesuaian data. Mohon hubungi dukungan bantuan di samping untuk panduan perbaikan."
                                                : "Petugas kepatuhan kami sedang melakukan pencocokan data Surat Izin Apotek (SIA) dengan database dinas kesehatan daerah."
                                        }
                                        status={
                                            isRejected ? "rejected" : "pending"
                                        }
                                    />
                                    <TimelineStep
                                        icon={Circle}
                                        title="Aktivasi Kunci Akun"
                                        desc="Akun disetujui, pembuatan kredensial pemilik apotek, dan akses penuh ke sistem dashboard."
                                        status="waiting"
                                        isLast
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeUpVariants}>
                            <Card className="pt-0 border border-slate-200/80 rounded-[2.5rem] shadow-xl shadow-slate-200/30 bg-white/80 backdrop-blur-md overflow-hidden">
                                <CardHeader className="p-8 md:p-10 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-100 text-primary">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-slate-900">
                                                Salinan Data Registrasi
                                            </CardTitle>
                                            <CardDescription className="text-xs text-slate-500 mt-1 font-medium">
                                                Berikut adalah rangkuman data
                                                apotek yang tersimpan di server
                                                kami
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <DataField
                                            icon={Building2}
                                            label="Nama Apotek"
                                            value={registration.pharmacyName}
                                        />
                                        <DataField
                                            icon={Phone}
                                            label="Nomor Telepon"
                                            value={registration.phone}
                                        />
                                        <DataField
                                            icon={FileText}
                                            label="Nomor Surat Izin Apotek (SIA)"
                                            value={registration.sia_number}
                                            mono
                                        />
                                        <DataField
                                            icon={Calendar}
                                            label="Waktu Pengajuan"
                                            value={registration.submissionDate}
                                        />
                                        <div className="sm:col-span-2">
                                            <DataField
                                                icon={MapPin}
                                                label="Alamat Lengkap"
                                                value={registration.address}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <motion.div variants={fadeUpVariants}>
                            <div className="rounded-3xl p-6 bg-linear-to-br from-primary to-[#0055a5] border border-blue-900/10 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5" />
                                <div className="flex gap-4 items-start relative z-10">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md shrink-0">
                                        <Clock className="w-5 h-5 text-blue-100" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white mb-1">
                                            Estimasi Penilaian
                                        </p>
                                        <p className="text-xs text-blue-100 leading-relaxed font-medium">
                                            Proses ini biasanya selesai dalam{" "}
                                            <span className="text-white font-bold underline decoration-indigo-300">
                                                1–3 hari kerja
                                            </span>
                                            . Laporan akhir verifikasi akan
                                            dikirimkan ke email terdaftar:{" "}
                                            <span className="text-white font-bold block mt-1 break-all">
                                                {registration.email}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUpVariants}>
                            <Card className="pt-0 border border-slate-200/80 rounded-[2.5rem] shadow-xl shadow-slate-200/30 bg-white/80 backdrop-blur-md overflow-hidden">
                                <CardHeader className="p-6 md:p-8 border-b border-slate-100">
                                    <CardTitle className="text-sm font-bold text-slate-800">
                                        Langkah Selanjutnya
                                    </CardTitle>
                                    <CardDescription className="text-[11px] text-slate-500 mt-1 font-medium">
                                        Persiapan yang bisa Anda lakukan selagi
                                        menunggu
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8 space-y-5">
                                    {NEXT_STEPS.map((step, idx) => {
                                        const Icon = step.icon;
                                        return (
                                            <div
                                                key={step.id}
                                                className="flex items-start gap-4 group cursor-default"
                                            >
                                                <div
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-linear-to-br ${step.accent} text-white shadow-md shadow-slate-300/20 group-hover:scale-110 transition-transform duration-300`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors duration-200">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-medium">
                                                        {step.text}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed font-medium">
                                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <p>
                                            Pastikan akun email dan nomor
                                            telepon Anda tetap aktif untuk
                                            koordinasi darurat jika terdapat
                                            lampiran dokumen yang buram.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={fadeUpVariants}
                            className="space-y-3"
                        >
                            <Button
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all duration-300 border-0 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/10 hover:shadow-xl hover:scale-[1.01] active:scale-95 cursor-pointer uppercase tracking-wider"
                                onClick={() =>
                                    window.open(
                                        "https://wa.me/6281234567890",
                                        "_blank",
                                    )
                                }
                            >
                                <MessageCircle className="w-4.5 h-4.5" />
                                Hubungi Bantuan (WhatsApp)
                            </Button>
                            <p className="text-[10px] text-slate-400 text-center font-semibold uppercase tracking-wider">
                                Waktu respons: 1×24 jam (hari kerja)
                            </p>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    className="mt-16 mb-4 text-center flex items-center justify-center gap-2 text-xs text-slate-400 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Shield className="w-4 h-4 text-slate-300" />
                    <span>
                        Data pendaftaran terenkripsi & sesuai standar kepatuhan
                        regulasi
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
}
