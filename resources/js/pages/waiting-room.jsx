import React from "react";
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
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const MOCK_USER_DATA = {
    pharmacyName: "PT. Apotek Jaya Sejahtera",
    pharmacistName: "Prayitno, S.Farm., Apt.",
    siaNumber: "SIA/12345/DKI/2026",
    submissionDate: "16 April 2026",
};

const NEXT_STEPS = [
    { id: 1, icon: ClipboardList, text: "Siapkan daftar inventori obat awal" },
    {
        id: 2,
        icon: Camera,
        text: "Siapkan staf yang akan bertugas di apotek anda",
    },
    { id: 3, icon: BookOpen, text: "Pelajari panduan kasir & resep" },
];

export default function WaitingRoomPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center">
            <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(#0f172a 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            <motion.div
                className="z-10 w-full max-w-5xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div variants={itemVariants}>
                            <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
                                <CardHeader className="border-b border-slate-100 pb-6 pt-4 px-8">
                                    <CardTitle className="text-xl font-bold text-slate-800">
                                        Status Pendaftaran
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium mt-1">
                                        Pantau proses verifikasi legalitas
                                        apotek Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-8">
                                    <div className="relative">
                                        <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-slate-200" />

                                        <div className="space-y-8 relative">
                                            <div className="flex items-start gap-4">
                                                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full text-emerald-600 border-2 border-emerald-500 shadow-sm">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>
                                                <div className="pt-2">
                                                    <h4 className="text-base font-bold text-slate-800">
                                                        Data Terkirim
                                                    </h4>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        Pendaftaran berhasil
                                                        disubmit pada{" "}
                                                        {
                                                            MOCK_USER_DATA.submissionDate
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white text-teal-600 border-2 border-teal-600 shadow-md">
                                                    <CircleDashed className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
                                                    <motion.div
                                                        className="absolute inset-0 rounded-full border-2 border-teal-500"
                                                        animate={{
                                                            scale: [1, 1.3, 1],
                                                            opacity: [
                                                                0.8, 0, 0.8,
                                                            ],
                                                        }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                            ease: "easeInOut",
                                                        }}
                                                    />
                                                </div>
                                                <div className="pt-2">
                                                    <h4 className="text-base font-bold text-teal-700">
                                                        Verifikasi Dokumen
                                                    </h4>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        Tim kami sedang meninjau
                                                        Surat Izin Apotek (SIA)
                                                        Anda.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 border-2 border-slate-200">
                                                    <Circle className="w-5 h-5" />
                                                </div>
                                                <div className="pt-3">
                                                    <h4 className="text-base font-semibold text-slate-400">
                                                        Aktivasi Akun
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Alert className="bg-teal-50 border-teal-200 rounded-2xl p-5 flex gap-4 items-start">
                                <div className="bg-teal-100 p-2 rounded-full text-teal-700 shrink-0 mt-0.5">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <AlertTitle className="text-teal-900 font-bold text-base mb-1">
                                        Estimasi Waktu Verifikasi
                                    </AlertTitle>
                                    <AlertDescription className="text-teal-700 text-sm leading-relaxed">
                                        Proses peninjauan dokumen biasanya
                                        memakan waktu{" "}
                                        <strong>1-3 hari kerja</strong>. Kami
                                        akan mengirimkan notifikasi persetujuan
                                        beserta akses login ke email Anda.
                                    </AlertDescription>
                                </div>
                            </Alert>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                                <CardHeader className="bg-white pb-4 pt-6 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-slate-400" />
                                        Ringkasan Data
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Nama Apotek
                                            </p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {MOCK_USER_DATA.pharmacyName}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Apoteker Penanggung Jawab
                                            </p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {MOCK_USER_DATA.pharmacistName}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Nomor SIA (Surat Izin Apotek)
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-mono font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                                    {MOCK_USER_DATA.siaNumber}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <motion.div variants={itemVariants}>
                            <Card className="border border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
                                <CardHeader className="pb-4 pt-4 px-6 border-b border-slate-100">
                                    <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        Langkah Selanjutnya
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-500 mt-1">
                                        Sambil menunggu, persiapkan hal berikut:
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-6">
                                    <div className="space-y-5">
                                        {NEXT_STEPS.map((step) => {
                                            const Icon = step.icon;
                                            return (
                                                <div
                                                    key={step.id}
                                                    className="flex gap-3 group"
                                                >
                                                    <div className="bg-slate-100 flex items-center justify-center p-2 rounded-lg text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors shrink-0">
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-600 leading-snug pt-1 group-hover:text-slate-900 transition-colors">
                                                        {step.text}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Separator className="my-5 bg-slate-100" />

                                    <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                        <p>
                                            Data ini akan memudahkan proses
                                            onboarding saat akun Anda sudah
                                            aktif.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="space-y-3"
                        >
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl shadow-lg shadow-emerald-600/20 font-semibold text-sm transition-all">
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Hubungi Bantuan (WhatsApp)
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
