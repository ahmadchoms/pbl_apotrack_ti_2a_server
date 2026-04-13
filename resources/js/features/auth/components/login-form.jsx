import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { loginSchema } from "../schemas/login-schema";
import { IconInput } from "./icon-input";

export function LoginForm({ onSubmitSuccess }) {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        if (onSubmitSuccess) onSubmitSuccess(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label
                    htmlFor="identifier"
                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                    Email atau ID Karyawan
                </Label>
                <IconInput
                    id="identifier"
                    icon={IdCard}
                    placeholder="admin@ethereal.health"
                    {...register("identifier")}
                />
                {errors.identifier && (
                    <p className="text-xs text-red-500 font-medium">
                        {errors.identifier.message}
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
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-xs text-red-500 font-medium">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="rememberMe"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id="rememberMe"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-slate-300 data-[state=checked]:bg-[#0b3b60] data-[state=checked]:text-white rounded"
                            />
                        )}
                    />
                    <Label
                        htmlFor="rememberMe"
                        className="text-sm font-medium text-slate-600 cursor-pointer"
                    >
                        Ingat saya
                    </Label>
                </div>
                <a
                    href="#"
                    className="text-sm font-semibold text-[#0b3b60] hover:underline"
                >
                    Lupa Kata Sandi?
                </a>
            </div>

            <Button
                type="submit"
                className="w-full bg-[#0b3b60] hover:bg-[#082a45] text-white py-6 rounded-xl group"
            >
                Masuk ke Dasbor
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </form>
    );
}
