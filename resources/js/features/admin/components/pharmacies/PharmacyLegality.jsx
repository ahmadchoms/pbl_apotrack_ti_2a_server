import React from "react";
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    FileText, Eye, ExternalLink, ShieldAlert, XCircle, 
    CheckCircle2, Loader2, ShieldCheck 
} from "lucide-react";

export function PharmacyLegality({ 
    data, 
    isRejectDialogOpen, 
    setIsRejectDialogOpen, 
    isVerifyDialogOpen, 
    setIsVerifyDialogOpen, 
    rejectionNote, 
    setRejectionNote, 
    isProcessing, 
    handleVerify 
}) {
    return (
        <Card className="py-0 gap-0 rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Verifikasi Dokumen Legal
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                    Tinjau dokumen SIA (Surat Izin Apotek) dan SIPA Apoteker
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
                                {data.legality?.sia_number || "N/A"}
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                Nomor SIPA
                            </p>
                            <p className="text-lg font-black text-slate-800">
                                {data.pharmacist?.sipa || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="aspect-3/4 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-300">
                            {data.legality?.sia_document_url ? (
                                <>
                                    <img
                                        src={data.legality.sia_document_url}
                                        alt={`Dokumen SIA ${data.name}`}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <Button
                                            variant="secondary"
                                            className="rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9"
                                        >
                                            <Eye className="w-4 h-4 mr-2" /> Lihat
                                        </Button>
                                        <a
                                            href={data.legality.sia_document_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                                variant="secondary"
                                                className="rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" /> Tab Baru
                                            </Button>
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8">
                                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Dokumen belum diunggah
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-50">
                            <ShieldAlert className="w-6 h-6 text-amber-500" />
                        </div>
                    </div>
                </div>

                {data.verification_status === "PENDING" && (
                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <p className="text-[11px] font-bold text-slate-600 mb-1">
                                Butuh Tindakan Admin
                            </p>
                            <p className="text-xs text-slate-400">
                                Pastikan nomor SIA dan dokumen fisik cocok sebelum menyetujui.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-12 px-6 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black text-[10px] uppercase tracking-widest border border-rose-100"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> Tolak Dokumen
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-106.25 rounded-[2rem]">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-black text-slate-900">
                                            Tolak Verifikasi
                                        </DialogTitle>
                                        <DialogDescription className="text-sm font-medium text-slate-500">
                                            Berikan alasan penolakan agar apotek dapat memperbaiki dokumen mereka.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Label htmlFor="reason" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                            Alasan Penolakan
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            className="mt-2 rounded-2xl border-slate-200 focus:ring-rose-500/10 min-h-30"
                                            placeholder="Misal: Foto dokumen tidak jelas, nomor SIA tidak valid..."
                                            value={rejectionNote}
                                            onChange={(e) => setRejectionNote(e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            className="w-full h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20"
                                            onClick={() => handleVerify("REJECTED")}
                                            disabled={!rejectionNote || isProcessing}
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

                            <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="h-12 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Verifikasi & Setujui
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-106.25 rounded-[2rem]">
                                    <DialogHeader className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                                            <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                        </div>
                                        <DialogTitle className="text-xl font-black text-slate-900">
                                            Konfirmasi Verifikasi
                                        </DialogTitle>
                                        <DialogDescription className="text-sm font-medium text-slate-500">
                                            Dengan menyetujui, apotek <strong>{data.name}</strong> akan segera aktif dan dapat melakukan transaksi di platform.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="mt-6">
                                        <div className="w-full space-y-3">
                                            <Button
                                                className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                                                onClick={() => handleVerify("APPROVED")}
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
                                                onClick={() => setIsVerifyDialogOpen(false)}
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
