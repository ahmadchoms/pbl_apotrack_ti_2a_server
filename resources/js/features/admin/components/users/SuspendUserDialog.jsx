import React from "react";
import { ShieldAlert } from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function SuspendUserDialog({ user, onClose, onConfirm }) {
    const isSuspending = user?.is_active;

    return (
        <AlertDialog open={!!user} onOpenChange={() => onClose()}>
            <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-lg">
                <AlertDialogHeader>
                    <div className={`w-20 h-20 ${isSuspending ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} rounded-[2rem] flex items-center justify-center mb-6 mx-auto`}>
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-black text-slate-900 text-center mb-2 uppercase tracking-tight">
                        {isSuspending ? 'Konfirmasi Penangguhan' : 'Konfirmasi Aktivasi'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-bold text-slate-400 text-center leading-relaxed">
                        {isSuspending 
                            ? `Apakah Anda yakin ingin menonaktifkan akun ${user?.username}? Pengguna ini tidak akan bisa masuk ke sistem sampai diaktifkan kembali.`
                            : `Apakah Anda yakin ingin mengaktifkan kembali akun ${user?.username}? Pengguna akan dapat mengakses sistem kembali.`
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row items-center justify-center gap-4 mt-10">
                    <AlertDialogCancel className="h-14 flex-1 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Batalkan
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onConfirm} 
                        className={`h-14 flex-1 rounded-2xl ${isSuspending ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'} text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl`}
                    >
                        {isSuspending ? 'Ya, Tangguhkan' : 'Ya, Aktifkan'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
