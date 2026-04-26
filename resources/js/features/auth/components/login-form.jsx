import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { IdCard, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IconInput } from "@/components/ui/icon-input";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("auth.login.store"), {
            onSuccess: () => {
                toast.success("Berhasil masuk!", {
                    description: "Selamat datang kembali di ApoTrack.",
                });
            },
            onError: (err) => {
                toast.error("Gagal masuk", {
                    description:
                        err.email ||
                        "Silakan periksa kembali email dan kata sandi Anda.",
                });
                reset("password");
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
                    Email
                </Label>
                <IconInput
                    id="email"
                    icon={IdCard}
                    type="email"
                    placeholder="email@apotek.health"
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

            <div className="space-y-2">
                <Label
                    htmlFor="password"
                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                    Kata Sandi
                </Label>
                <IconInput
                    id="password"
                    icon={Lock}
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    disabled={processing}
                />
                {errors.password && (
                    <p className="text-xs text-red-500 font-medium">
                        {errors.password}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) =>
                            setData("remember", checked)
                        }
                        disabled={processing}
                        className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground rounded"
                    />
                    <Label
                        htmlFor="remember"
                        className="text-sm font-medium text-slate-600 cursor-pointer"
                    >
                        Ingat saya
                    </Label>
                </div>
                <Link
                    href={route("auth.forgot-password")}
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    Lupa Kata Sandi?
                </Link>
            </div>

            <Button
                type="submit"
                disabled={processing}
                className="w-full py-6 rounded-xl group bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
            >
                {processing ? (
                    <span className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Memproses...
                    </span>
                ) : (
                    <>
                        Masuk ke Dasbor
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </Button>
        </form>
    );
}
