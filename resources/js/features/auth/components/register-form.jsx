import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Building2,
    FileText,
    MapPin,
    Phone,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    ClipboardCheck,
    Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { registerSchema } from "../schemas/register-schema";
import { IconInput } from "@/components/ui/icon-input";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
    {
        id: 1,
        title: "Identitas Pemilik",
        description: "Data pribadi dan kredensial login",
        icon: User,
        fields: [
            "username",
            "email",
            "phone",
            "password",
            "password_confirmation",
        ],
    },
    {
        id: 2,
        title: "Legalitas Apotek",
        description: "Informasi operasional apotek",
        icon: Building2,
        fields: ["pharmacy_name", "pharmacy_address", "license_number"],
    },
    {
        id: 3,
        title: "Ringkasan",
        description: "Tinjau data sebelum mendaftar",
        icon: ClipboardCheck,
        fields: [],
    },
];

export function RegisterForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        trigger,
        setError,
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            username: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
            pharmacy_name: "",
            pharmacy_address: "",
            pharmacy_phone: "",
            pharmacy_latitude: -6.2088, // Default Jakarta
            pharmacy_longitude: 106.8456,
            license_number: "",
        },
    });

    const handleNextStep = async (e) => {
        if (e) e.preventDefault();

        const currentStepFields = STEPS[currentStep - 1].fields;
        const isValid =
            currentStepFields.length > 0
                ? await trigger(currentStepFields)
                : true;

        if (!isValid) return;
        setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = (e) => {
        if (e) e.preventDefault();
        setCurrentStep(currentStep - 1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (currentStep < STEPS.length) {
                handleNextStep();
            } else {
                handleSubmit(onSubmit)();
            }
        }
    };

    const onSubmit = (data) => {
        setIsSubmitting(true);
        router.post(route("auth.register"), data, {
            onSuccess: () => {
                toast.success("Pendaftaran berhasil!", {
                    description: "Akun Anda telah dibuat.",
                });
            },
            onError: (err) => {
                // Map server-side errors back to react-hook-form
                Object.keys(err).forEach((key) => {
                    setError(key, {
                        type: "server",
                        message: err[key],
                    });
                });

                toast.error("Gagal mendaftar", {
                    description:
                        Object.values(err)[0] ||
                        "Silakan periksa kembali data Anda.",
                });
                
                // If there are errors on previous steps, navigate back
                const firstErrorField = Object.keys(err)[0];
                const stepWithError = STEPS.find(step => step.fields.includes(firstErrorField));
                if (stepWithError && stepWithError.id !== currentStep) {
                    setCurrentStep(stepWithError.id);
                }
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const renderStepContent = () => {
        const formData = getValues();

        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="username"
                                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                                >
                                    Nama Lengkap
                                </Label>
                                <IconInput
                                    id="username"
                                    icon={User}
                                    placeholder="John Doe"
                                    {...register("username")}
                                    disabled={isSubmitting}
                                />
                                {errors.username && (
                                    <p className="text-[10px] text-red-500 font-medium">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                                >
                                    Nomor Telepon
                                </Label>
                                <IconInput
                                    id="phone"
                                    icon={Phone}
                                    placeholder="081234567890"
                                    {...register("phone")}
                                    disabled={isSubmitting}
                                />
                                {errors.phone && (
                                    <p className="text-[10px] text-red-500 font-medium">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                                Email
                            </Label>
                            <IconInput
                                id="email"
                                icon={Mail}
                                type="email"
                                placeholder="admin@apotek.health"
                                {...register("email")}
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="text-[10px] text-red-500 font-medium">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                    onRightIconClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password")}
                                    disabled={isSubmitting}
                                />
                                {errors.password && (
                                    <p className="text-[10px] text-red-500 font-medium">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                                >
                                    Konfirmasi Sandi
                                </Label>
                                <IconInput
                                    id="password_confirmation"
                                    icon={Lock}
                                    rightIcon={
                                        showConfirmPassword ? EyeOff : Eye
                                    }
                                    onRightIconClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="••••••••"
                                    {...register("password_confirmation")}
                                    disabled={isSubmitting}
                                />
                                {errors.password_confirmation && (
                                    <p className="text-[10px] text-red-500 font-medium">
                                        {errors.password_confirmation.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Label
                                htmlFor="pharmacy_name"
                                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                                Nama Apotek
                            </Label>
                            <IconInput
                                id="pharmacy_name"
                                icon={Building2}
                                placeholder="PT. Apotek Jaya Sejahtera"
                                {...register("pharmacy_name")}
                                disabled={isSubmitting}
                            />
                            {errors.pharmacy_name && (
                                <p className="text-[10px] text-red-500 font-medium">
                                    {errors.pharmacy_name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="pharmacy_address"
                                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                                Alamat Apotek
                            </Label>
                            <IconInput
                                id="pharmacy_address"
                                icon={MapPin}
                                placeholder="Jl. Gatot Subroto No. 1, Jakarta"
                                {...register("pharmacy_address")}
                                disabled={isSubmitting}
                            />
                            {errors.pharmacy_address && (
                                <p className="text-[10px] text-red-500 font-medium">
                                    {errors.pharmacy_address.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="license_number"
                                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                                Nomor SIA (Surat Izin Apotek)
                            </Label>
                            <IconInput
                                id="license_number"
                                icon={FileText}
                                placeholder="SIA/12345/DKI/2026"
                                {...register("license_number")}
                                disabled={isSubmitting}
                            />
                            {errors.license_number && (
                                <p className="text-[10px] text-red-500 font-medium">
                                    {errors.license_number.message}
                                </p>
                            )}
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <Card className="border-slate-200 shadow-sm overflow-hidden bg-slate-50/50">
                            <CardContent className="p-0">
                                <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-slate-100 rounded-lg">
                                            <User className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                                            Akun Pemilik
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCurrentStep(1)}
                                        className="h-8 text-[10px] text-primary"
                                    >
                                        Ubah
                                    </Button>
                                </div>
                                <div className="p-5 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                            Nama Lengkap
                                        </p>
                                        <p className="text-sm font-medium text-slate-800">
                                            {formData.username}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                            Nomor Telepon
                                        </p>
                                        <p className="text-sm font-medium text-slate-800">
                                            {formData.phone}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                            Email
                                        </p>
                                        <p className="text-sm font-medium text-slate-800">
                                            {formData.email}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm overflow-hidden bg-slate-50/50">
                            <CardContent className="p-0">
                                <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-slate-100 rounded-lg">
                                            <Building2 className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                                            Informasi Apotek
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCurrentStep(2)}
                                        className="h-8 text-[10px] text-primary"
                                    >
                                        Ubah
                                    </Button>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                                Nama Apotek
                                            </p>
                                            <p className="text-sm font-medium text-slate-800">
                                                {formData.pharmacy_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                                Nomor SIA
                                            </p>
                                            <p className="text-sm font-mono font-medium text-slate-700">
                                                {formData.license_number}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                            Alamat
                                        </p>
                                        <p className="text-sm font-medium text-slate-800">
                                            {formData.pharmacy_address}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                            <Info className="h-5 w-5 text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-800 leading-relaxed">
                                Pastikan semua data di atas sudah benar. Setelah
                                disubmit, tim admin akan memverifikasi legalitas
                                apotek Anda dalam waktu 1-3 hari kerja.
                            </p>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-8 px-2">
                    {STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;

                        return (
                            <div
                                key={step.id}
                                className="flex items-center flex-1 last:flex-none"
                            >
                                <div className="flex flex-col items-center relative">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: isActive ? 1.1 : 1,
                                            backgroundColor: isCompleted
                                                ? "#0b3b60"
                                                : isActive
                                                  ? "#0b3b60"
                                                  : "#fff",
                                        }}
                                        className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                                            isCompleted
                                                ? "border-primary-500 text-white"
                                                : isActive
                                                  ? "border-primary text-white shadow-lg shadow-primary/20"
                                                  : "border-slate-200 text-slate-400"
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <StepIcon className="w-5 h-5" />
                                        )}
                                    </motion.div>
                                    <div className="absolute top-12 whitespace-nowrap text-center">
                                        <p
                                            className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? "text-primary" : "text-slate-400"}`}
                                        >
                                            {step.title}
                                        </p>
                                    </div>
                                </div>

                                {idx < STEPS.length - 1 && (
                                    <div className="flex-1 h-[2px] mx-4 bg-slate-200 rounded-full relative overflow-hidden">
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{
                                                scaleX: isCompleted ? 1 : 0,
                                            }}
                                            className="absolute inset-0 bg-primary/50 origin-left"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={handleKeyDown}
                className="mt-14"
            >
                <AnimatePresence mode="wait">
                    {renderStepContent()}
                </AnimatePresence>

                <div className="flex gap-4 mt-10">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevStep}
                            disabled={isSubmitting}
                            className="w-1/3 py-6 rounded-xl border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900 group"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Kembali
                        </Button>
                    )}

                    {currentStep < STEPS.length ? (
                        <Button
                            type="button"
                            onClick={handleNextStep}
                            disabled={isSubmitting}
                            className="flex-1 py-6 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold group"
                        >
                            Lanjutkan
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-6 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold shadow-lg shadow-primary-600/20 group"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Mendaftarkan...
                                </span>
                            ) : (
                                <>
                                    Kirim Pendaftaran
                                    <CheckCircle2 className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
