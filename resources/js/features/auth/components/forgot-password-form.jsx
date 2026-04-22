import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "../schemas/forgot-password-schema";
import { IconInput } from "@/components/ui/icon-input";

export function ForgotPasswordForm({ onSubmitSuccess }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Forgot Password Data:", data);
        if (onSubmitSuccess) onSubmitSuccess(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    placeholder="admin@ethereal.health"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 font-medium">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full py-6 rounded-xl group"
            >
                Kirim Tautan Reset
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </form>
    );
}
