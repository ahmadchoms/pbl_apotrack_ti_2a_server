"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
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
    Mail,
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
import { Separator } from "@/components/ui/separator";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const NEXT_STEPS = [
    {
        id: 1,
        icon: ClipboardList,
        title: "Inventori Obat",
        text: "Siapkan daftar inventori obat awal apotek Anda",
        accent: "#0b3b60",
    },
    {
        id: 2,
        icon: Camera,
        title: "Foto Apotek",
        text: "Siapkan foto profil apotek dan fasilitas pendukung",
        accent: "#1a6fad",
    },
    {
        id: 3,
        icon: BookOpen,
        title: "Panduan Sistem",
        text: "Pelajari panduan sistem manajemen apotek kami",
        accent: "#2589d0",
    },
];

// ─────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
};

// ─────────────────────────────────────────────
// Animated orb background (Light Mode)
// ─────────────────────────────────────────────

function BackgroundOrbs() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
                className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(11,59,96,0.08) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(26,111,173,0.05) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
            <div
                className="absolute inset-0 opacity-100"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(11,59,96,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(11,59,96,0.03) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────
// Status timeline step (Light Mode)
// ─────────────────────────────────────────────

function TimelineStep({ icon: Icon, title, desc, status, isLast }) {
    const isPending = status === "pending";
    const isDone = status === "done";
    const isRejected = status === "rejected";
    const isWaiting = status === "waiting";

    const ringColor = isDone
        ? "#10b981"
        : isRejected
          ? "#f43f5e"
          : isPending
            ? "#0b3b60"
            : "rgba(0,0,0,0.1)";

    const bgColor = isDone
        ? "rgba(16,185,129,0.1)"
        : isRejected
          ? "rgba(244,63,94,0.1)"
          : isPending
            ? "rgba(11,59,96,0.1)"
            : "#f8fafc";

    const textColor = isDone
        ? "#059669"
        : isRejected
          ? "#e11d48"
          : isPending
            ? "#0b3b60"
            : "#94a3b8";

    return (
        <div className="flex gap-5 relative">
            {!isLast && (
                <div
                    className="absolute left-6 top-12 w-px bottom-[-2.5rem]"
                    style={{
                        background: isDone
                            ? "linear-gradient(to bottom, #10b981, rgba(0,0,0,0.1))"
                            : "rgba(0,0,0,0.1)",
                    }}
                />
            )}

            <div className="relative z-10 shrink-0">
                <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white"
                    style={{
                        background: bgColor,
                        border: `1.5px solid ${ringColor}`,
                    }}
                    initial={false}
                    animate={
                        isPending
                            ? {
                                  boxShadow: [
                                      `0 0 0 0px ${ringColor}44`,
                                      `0 0 0 8px ${ringColor}00`,
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
                            <CircleDashed
                                className="w-5 h-5"
                                style={{ color: textColor }}
                            />
                        </motion.div>
                    ) : (
                        <Icon
                            className="w-5 h-5"
                            style={{ color: textColor }}
                        />
                    )}
                </motion.div>
            </div>

            <div className="pb-8 pt-1 flex-1">
                <h4
                    className="text-sm font-semibold leading-none mb-2"
                    style={{
                        color: isWaiting ? "#94a3b8" : "#0f172a",
                    }}
                >
                    {title}
                </h4>
                {desc && (
                    <p
                        className="text-xs leading-relaxed"
                        style={{ color: "#64748b" }}
                    >
                        {desc}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Data field (Light Mode)
// ─────────────────────────────────────────────

function DataField({ icon: Icon, label, value, mono }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                <Icon className="w-3 h-3" />
                {label}
            </div>
            {mono ? (
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-[#0b3b60] bg-[#0b3b60]/10 border border-[#0b3b60]/20">
                    {value}
                </span>
            ) : (
                <p className="text-sm font-medium text-slate-800 leading-snug">
                    {value}
                </p>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function WaitingRoomPage({ registration }) {
    return (
        <div
            className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden"
            style={{ background: "#f8fafc" }} // Light gray/blue-ish background to make white cards pop
        >
            <BackgroundOrbs />

            <motion.div
                className="relative z-10 w-full max-w-5xl"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                <motion.header variants={fadeUp} className="mb-12 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                        Pendaftaran Apotek
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-md mx-auto leading-relaxed">
                        Proses verifikasi sedang berlangsung. Pantau
                        perkembangan akun Anda di bawah ini.
                    </p>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-5">
                        <motion.div variants={fadeUp}>
                            <Card
                                className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
                                style={{
                                    background: "#ffffff",
                                }}
                            >
                                <CardHeader
                                    className="px-8 pt-8 pb-6 border-b"
                                    style={{
                                        borderColor: "#f1f5f9",
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-semibold text-slate-900 mb-1">
                                                Status Verifikasi
                                            </CardTitle>
                                            <CardDescription className="text-xs text-slate-500">
                                                Legalitas & dokumen operasional
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            className="rounded-xl text-[10px] font-semibold px-3 py-1.5 border shadow-none"
                                            style={{
                                                background:
                                                    registration.isRejected
                                                        ? "rgba(244,63,94,0.1)"
                                                        : "rgba(11,59,96,0.1)",
                                                color: registration.isRejected
                                                    ? "#e11d48"
                                                    : "#0b3b60",
                                                borderColor:
                                                    registration.isRejected
                                                        ? "rgba(244,63,94,0.2)"
                                                        : "rgba(11,59,96,0.2)",
                                            }}
                                        >
                                            {registration.isRejected
                                                ? "Ditolak"
                                                : "Dalam Proses"}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-8 py-8">
                                    <TimelineStep
                                        icon={CheckCircle2}
                                        title="Data Terkirim"
                                        desc={`Disubmit pada ${registration.submissionDate}`}
                                        status="done"
                                    />
                                    <TimelineStep
                                        icon={
                                            registration.isRejected
                                                ? AlertCircle
                                                : CircleDashed
                                        }
                                        title={
                                            registration.isRejected
                                                ? "Pendaftaran Ditolak"
                                                : "Verifikasi Dokumen"
                                        }
                                        desc={
                                            registration.isRejected
                                                ? "Tim kami menemukan ketidaksesuaian data. Silakan hubungi bantuan."
                                                : "Tim admin sedang meninjau Surat Izin Apotek (SIA) Anda."
                                        }
                                        status={
                                            registration.isRejected
                                                ? "rejected"
                                                : "pending"
                                        }
                                    />
                                    <TimelineStep
                                        icon={Circle}
                                        title="Aktivasi Akun"
                                        desc=""
                                        status="waiting"
                                        isLast
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <Card
                                className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
                                style={{
                                    background: "#ffffff",
                                }}
                            >
                                <CardHeader
                                    className="px-8 pt-7 pb-5 border-b"
                                    style={{
                                        borderColor: "#f1f5f9",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-semibold text-slate-900">
                                                Data Pendaftaran
                                            </CardTitle>
                                            <CardDescription className="text-xs text-slate-500 mt-0.5">
                                                Data tersimpan di sistem kami
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8 py-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
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
                                            label="Nomor SIA"
                                            value={registration.licenseNumber}
                                            mono
                                        />
                                        <DataField
                                            icon={Calendar}
                                            label="Tanggal Submit"
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

                    <div className="space-y-5">
                        <motion.div variants={fadeUp}>
                            <div
                                className="rounded-2xl p-5"
                                style={{
                                    background: "rgba(11,59,96,0.04)",
                                    border: "1px solid rgba(11,59,96,0.1)",
                                }}
                            >
                                <div className="flex gap-3.5 items-start">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            background: "rgba(11,59,96,0.1)",
                                        }}
                                    >
                                        <Clock className="w-4 h-4 text-[#0b3b60]" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-900 mb-1">
                                            Estimasi Verifikasi
                                        </p>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Biasanya memakan waktu{" "}
                                            <span className="text-[#0b3b60] font-semibold">
                                                1–3 hari kerja
                                            </span>
                                            . Notifikasi dikirim ke{" "}
                                            <span className="text-slate-800 font-medium">
                                                {registration.email}
                                            </span>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <Card
                                className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
                                style={{
                                    background: "#ffffff",
                                }}
                            >
                                <CardHeader
                                    className="px-6 pt-7 pb-5 border-b"
                                    style={{
                                        borderColor: "#f1f5f9",
                                    }}
                                >
                                    <CardTitle className="text-sm font-semibold text-slate-900">
                                        Langkah Selanjutnya
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                                        Persiapan sebelum apotek Anda aktif
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-6 py-6 space-y-4">
                                    {NEXT_STEPS.map((step, i) => {
                                        const Icon = step.icon;
                                        return (
                                            <motion.div
                                                key={step.id}
                                                className="flex items-start gap-3.5 group cursor-default"
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.4 + i * 0.1,
                                                    duration: 0.4,
                                                }}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                                                    style={{
                                                        background:
                                                            "rgba(11,59,96,0.05)",
                                                        border: "1px solid rgba(11,59,96,0.1)",
                                                    }}
                                                >
                                                    <Icon className="w-3.5 h-3.5 text-[#0b3b60]/50 group-hover:text-[#0b3b60] transition-colors" />
                                                </div>
                                                <div className="pt-0.5">
                                                    <p className="text-[11px] font-semibold text-slate-700 group-hover:text-[#0b3b60] transition-colors leading-none mb-1">
                                                        {step.title}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                                        {step.text}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    <div
                                        className="mt-2 flex items-start gap-2.5 p-3.5 rounded-2xl text-[11px] text-slate-600"
                                        style={{
                                            background: "rgba(11,59,96,0.03)",
                                            border: "1px solid rgba(11,59,96,0.1)",
                                        }}
                                    >
                                        <Info className="w-3.5 h-3.5 text-[#0b3b60] shrink-0 mt-0.5" />
                                        <p className="leading-relaxed">
                                            Pastikan email Anda aktif untuk
                                            menerima panduan akses awal.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeUp} className="space-y-2.5">
                            <Button
                                className="w-full pl-4 h-12 bg-primary text-white rounded-2xl text-sm font-semibold transition-all duration-300 border-0 flex items-center gap-2 hover:shadow-md"
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "#0f4d7d")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "#0b3b60")
                                }
                            >
                                <MessageCircle className="w-4 h-4" />
                                Hubungi Bantuan (WhatsApp)
                                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-80" />
                            </Button>
                            <p className="text-[10px] text-slate-400 text-center font-medium">
                                Respons dalam 1×24 jam pada hari kerja
                            </p>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    variants={fadeIn}
                    className="mt-10 text-center flex items-center justify-center gap-2 text-[11px] text-slate-400"
                >
                    <Shield className="w-3 h-3" />
                    Data Anda diproses sesuai kebijakan privasi Apotrack
                </motion.div>
            </motion.div>
        </div>
    );
}
