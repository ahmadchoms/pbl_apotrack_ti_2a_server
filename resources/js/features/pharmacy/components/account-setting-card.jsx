import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, AlertTriangle, AlertOctagon } from "lucide-react";

export function AccountSettingsCard() {
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md shadow-slate-200/50 rounded-3xl bg-white flex flex-col justify-center p-8 hover:scale-[1.02] transition-transform duration-300">
                <div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">
                        Keluar Perangkat
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                        Akhiri sesi aktif Anda di perangkat ini untuk menjaga
                        keamanan data medis.
                    </p>
                    <Button
                        variant="outline"
                        className="w-full justify-between rounded-xl h-12 border-slate-200 hover:bg-slate-50 hover:text-slate-800 group"
                    >
                        <span className="flex items-center gap-2 font-semibold">
                            <LogOut className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />{" "}
                            Keluar Sesi
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                            Sign out
                        </span>
                    </Button>
                </div>
            </Card>

            <Card className="border border-red-100 shadow-md shadow-red-100/50 rounded-3xl bg-red-50/30 flex flex-col justify-center p-8 hover:scale-[1.02] transition-transform duration-300">
                <div>
                    <h3 className="text-base font-bold text-red-700 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Danger Zone
                    </h3>
                    <p className="text-xs text-red-600/70 mb-6 leading-relaxed">
                        Penghapusan akun bersifat permanen. Semua data riwayat
                        inventori dan log akan hilang selamanya.
                    </p>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full justify-between rounded-xl h-12 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 transition-colors group"
                            >
                                <span className="flex items-center gap-2 font-semibold">
                                    <AlertOctagon className="h-4 w-4" /> Hapus
                                    Akun Permanen
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md rounded-3xl p-8">
                            <AlertDialogHeader className="mb-4">
                                <AlertDialogTitle className="text-xl text-red-600 flex items-center gap-2">
                                    <AlertOctagon className="h-5 w-5" />{" "}
                                    Konfirmasi Penghapusan
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600 mt-2">
                                    Tindakan ini tidak dapat dibatalkan. Silakan
                                    ketik kata sandi Anda untuk memverifikasi
                                    bahwa ini adalah Anda.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Kata Sandi Anda
                                    </Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={deleteConfirmText}
                                        onChange={(e) =>
                                            setDeleteConfirmText(e.target.value)
                                        }
                                        className="h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-red-500"
                                    />
                                </div>
                            </div>
                            <AlertDialogFooter className="sm:justify-end gap-2 mt-4">
                                <AlertDialogCancel className="rounded-xl border-slate-200">
                                    Batal
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={!deleteConfirmText}
                                    className="rounded-xl bg-red-600 hover:bg-red-700"
                                >
                                    Ya, Hapus Akun Saya
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </Card>
        </div>
    );
}
