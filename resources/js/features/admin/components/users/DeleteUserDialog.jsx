import React from "react";
import { AlertTriangle } from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteUserDialog({ user, onClose, onConfirm }) {
    return (
        <AlertDialog open={!!user} onOpenChange={() => onClose()}>
            <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-lg">
                <AlertDialogHeader>
                    <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mb-6 mx-auto">
                        <AlertTriangle className="w-10 h-10" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-black text-slate-900 text-center mb-2 uppercase tracking-tight">
                        Konfirmasi Penghapusan
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-bold text-slate-400 text-center leading-relaxed">
                        Apakah Anda yakin ingin menghapus akun{" "}
                        <span className="text-slate-900">{user?.username}</span>
                        ? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row items-center justify-center gap-4 mt-10">
                    <AlertDialogCancel className="h-14 flex-1 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Batalkan
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="h-14 flex-1 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20">
                        Ya, Hapus Akun
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
