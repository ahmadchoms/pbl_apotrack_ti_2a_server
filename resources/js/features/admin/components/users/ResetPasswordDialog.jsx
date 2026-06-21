import React from "react";
import { KeyRound } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ResetPasswordDialog({ user, onClose, onConfirm }) {
    return (
        <AlertDialog open={!!user} onOpenChange={() => onClose()}>
            <AlertDialogContent className="rounded-[2rem] border border-slate-100 shadow-xl p-8 max-w-md bg-white">
                <AlertDialogHeader className="items-center text-center">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                        <KeyRound className="w-6 h-6" />
                    </div>

                    <AlertDialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                        Reset Password Pengguna
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-[13px] font-normal text-slate-500 leading-relaxed">
                        Apakah Anda yakin ingin mereset password akun{" "}
                        <span className="font-semibold text-slate-800">
                            {user?.username}
                        </span>{" "}
                        menjadi password default (
                        <span className="font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Apotrack2026!
                        </span>
                        )?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex sm:flex-row items-center gap-3 mt-8">
                    <AlertDialogCancel className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 font-extrabold text-xs tracking-wide transition-all m-0 sm:mt-0">
                        Batalkan
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="h-11 flex-1 rounded-xl text-white font-extrabold text-xs tracking-wide transition-all border-0 shadow-sm bg-amber-600 hover:bg-amber-700"
                    >
                        Ya, Reset Password
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
