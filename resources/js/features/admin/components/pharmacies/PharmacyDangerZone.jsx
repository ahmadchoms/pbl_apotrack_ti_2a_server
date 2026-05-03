import React from "react";
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Lock, Loader2, ShieldAlert } from "lucide-react";

export function PharmacyDangerZone({ 
    data, 
    isSuspendDialogOpen, 
    setIsSuspendDialogOpen, 
    isProcessing, 
    handleToggleSuspend 
}) {
    const isSuspended = data.verification_status === "SUSPENDED";

    return (
        <Card className="py-0 gap-0 rounded-[2.5rem] border-2 border-dashed border-rose-100 bg-rose-50/20 overflow-hidden">
            <CardHeader className="p-8">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Danger Zone
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1">
                    Tindakan yang dapat berdampak signifikan pada operasional mitra
                </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1">
                        {isSuspended ? "Aktifkan Kembali Apotek" : "Tangguhkan Akses Apotek (Suspend)"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {isSuspended
                            ? "Memberikan kembali hak akses kepada seluruh staf untuk mengelola dashboard dan melakukan transaksi."
                            : "Seluruh staf apotek ini tidak akan bisa login ke dashboard. Apotek juga tidak akan muncul di hasil pencarian pelanggan."}
                    </p>
                </div>
                <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant={isSuspended ? "default" : "destructive"}
                            className={`rounded-2xl h-14 px-8 font-black text-white text-[11px] uppercase tracking-widest shadow-xl ${isSuspended ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"}`}
                        >
                            {isSuspended ? (
                                <><CheckCircle2 className="w-5 h-5 mr-3" /> Re-Activate Pharmacy</>
                            ) : (
                                <><Lock className="w-5 h-5 mr-3" /> Suspend Pharmacy</>
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-106.25 rounded-[2rem]">
                        <DialogHeader className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isSuspended ? "bg-emerald-50" : "bg-rose-50"}`}>
                                <AlertTriangle className={`w-10 h-10 ${isSuspended ? "text-emerald-500" : "text-rose-500"}`} />
                            </div>
                            <DialogTitle className="text-xl font-black text-slate-900">
                                {isSuspended ? "Konfirmasi Re-Aktivasi" : "Konfirmasi Suspensi"}
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500 mt-2 px-4">
                                {isSuspended
                                    ? "Apakah Anda yakin ingin mengaktifkan kembali apotek ini? Akses staf akan segera dipulihkan."
                                    : "Anda akan membekukan seluruh operasional apotek ini. Tindakan ini akan mencatat riwayat di log platform."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-slate-50 p-6 rounded-3xl my-4 border border-slate-100">
                            <div className="flex items-start gap-4">
                                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                                    "Tindakan suspensi biasanya dilakukan karena adanya pelanggaran syarat & ketentuan atau ketidakvalidan dokumen yang fatal."
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <div className="space-y-3 w-full">
                                <Button
                                    className={`w-full h-12 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl ${isSuspended ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"}`}
                                    onClick={handleToggleSuspend}
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
                                    onClick={() => setIsSuspendDialogOpen(false)}
                                >
                                    Batal
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
