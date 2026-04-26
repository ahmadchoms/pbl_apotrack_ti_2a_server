import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconInput } from "@/components/ui/icon-input";

export function ForgotPasswordForm() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("auth.forgot-password.store"), {
            onSuccess: () => {
                toast.success("Tautan terkirim!", {
                    description: "Silakan periksa email Anda untuk melanjutkan reset kata sandi.",
                });
            },
            onError: (err) => {
                toast.error("Gagal mengirim tautan", {
                    description: err.email || "Terjadi kesalahan saat memproses permintaan Anda.",
                });
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label
                    htmlFor="email"
                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                    Email Terdaftar
                </Label>
                <IconInput
                    id="email"
                    icon={Mail}
                    type="email"
                    placeholder="admin@ethereal.health"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    disabled={processing}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 font-medium">
                        {errors.email}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full py-6 rounded-xl group bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                >
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Mengirim...
                        </span>
                    ) : (
                        <>
                            Kirim Tautan Reset
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </Button>

                <Link
                    href={route("auth.login")}
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Login
                </Link>
            </div>
        </form>
    );
}
