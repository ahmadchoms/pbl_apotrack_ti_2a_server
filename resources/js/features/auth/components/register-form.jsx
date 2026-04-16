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
    IdCard,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { registerSchema } from "../schemas/register-schema";
import { IconInput } from "./icon-input";

const STEPS = [
    {
        id: 1,
        title: "Identitas Pemilik",
        description: "Data pribadi dan kredensial login",
        icon: User,
        fields: ["name", "email", "password", "confirmPassword", "ktpNumber"],
    },
    {
        id: 2,
        title: "Legalitas Apotek",
        description: "Informasi dan dokumen apotek",
        icon: Building2,
        fields: ["pharmacyName", "pharmacyLocation", "siaDocument"],
    },
];

export function RegisterForm({ onSubmitSuccess }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            ktpNumber: "",
            pharmacyName: "",
            pharmacyLocation: "",
            siaDocument: null,
        },
    });

    const handleNextStep = async (e) => {
        if (e) e.preventDefault();

        const currentStepFields = STEPS[currentStep - 1].fields;
        const isValid = await trigger(currentStepFields);

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

    const onSubmit = async (data) => {
        if (currentStep !== STEPS.length) return;

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success("Pendaftaran berhasil!", {
                description: "Akun Anda telah dibuat.",
            });
            if (onSubmitSuccess) onSubmitSuccess(data);
        } catch (error) {
            toast.error("Terjadi kesalahan", {
                description: "Silakan coba lagi.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File terlalu besar", {
                    description: "Maksimal 5MB",
                });
                return;
            }
            setUploadedFile(file);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                                >
                                    Nama Lengkap
                                </Label>
                                <IconInput
                                    id="name"
                                    icon={User}
                                    placeholder="John Doe"
                                    {...register("name")}
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.name.message}
                                    </p>
                                )}
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
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="ktpNumber"
                                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                                >
                                    Nomor KTP
                                </Label>
                                <IconInput
                                    id="ktpNumber"
                                    icon={IdCard}
                                    placeholder="123456789012345"
                                    {...register("ktpNumber")}
                                    disabled={isSubmitting}
                                />
                                {errors.ktpNumber && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.ktpNumber.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator className="my-6 bg-slate-200" />

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
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                                >
                                    Konfirmasi Sandi
                                </Label>
                                <IconInput
                                    id="confirmPassword"
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
                                    {...register("confirmPassword")}
                                    disabled={isSubmitting}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 font-medium">
                                        {errors.confirmPassword.message}
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
                                htmlFor="pharmacyName"
                                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                                Nama Apotek
                            </Label>
                            <IconInput
                                id="pharmacyName"
                                icon={Building2}
                                placeholder="PT. Apotek Jaya Sejahtera"
                                {...register("pharmacyName")}
                                disabled={isSubmitting}
                            />
                            {errors.pharmacyName && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.pharmacyName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="pharmacyLocation"
                                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                                Lokasi Apotek
                            </Label>
                            <IconInput
                                id="pharmacyLocation"
                                icon={MapPin}
                                placeholder="Jl. Gatot Subroto No. 1, Jakarta"
                                {...register("pharmacyLocation")}
                                disabled={isSubmitting}
                            />
                            {errors.pharmacyLocation && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.pharmacyLocation.message}
                                </p>
                            )}
                        </div>

                        <Separator className="my-6 bg-slate-200" />

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Surat Izin Apotek (SIA)
                            </Label>
                            <div className="relative group mt-2">
                                <input
                                    type="file"
                                    id="siaDocument"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    disabled={isSubmitting}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${uploadedFile ? "border-[#0b3b60] bg-[#0b3b60]/5" : "border-slate-300 group-hover:border-[#0b3b60]"}`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            className={`p-3 rounded-xl transition-colors duration-300 ${uploadedFile ? "bg-[#0b3b60] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-[#0b3b60]/10 group-hover:text-[#0b3b60]"}`}
                                        >
                                            {uploadedFile ? (
                                                <FileText className="h-6 w-6" />
                                            ) : (
                                                <UploadCloud className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {uploadedFile
                                                    ? uploadedFile.name
                                                    : "Klik atau seret file SIA kesini"}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {uploadedFile
                                                    ? `${(uploadedFile.size / 1024).toFixed(2)} KB`
                                                    : "PDF, JPG, atau PNG (maks. 5MB)"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {errors.siaDocument && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errors.siaDocument.message}
                                </p>
                            )}
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
                <div className="flex items-center justify-between mb-6 px-2">
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
                                        animate={{ scale: isActive ? 1.05 : 1 }}
                                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                                            isCompleted
                                                ? "bg-[#0b3b60] border-[#0b3b60] text-white"
                                                : isActive
                                                  ? "bg-white border-[#0b3b60] text-[#0b3b60] shadow-md shadow-[#0b3b60]/10"
                                                  : "bg-white border-slate-200 text-slate-400"
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <StepIcon className="w-5 h-5" />
                                        )}
                                    </motion.div>
                                </div>

                                {idx < STEPS.length - 1 && (
                                    <div className="flex-1 h-[2px] mx-4 relative overflow-hidden bg-slate-200 rounded-full">
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{
                                                scaleX: isCompleted ? 1 : 0,
                                            }}
                                            className="absolute inset-0 bg-[#0b3b60] origin-left"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800">
                        {STEPS[currentStep - 1].title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {STEPS[currentStep - 1].description}
                    </p>
                </div>
            </div>


            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
                <AnimatePresence mode="wait">
                    {renderStepContent()}
                </AnimatePresence>

                <div className="flex gap-4 mt-8 pt-4">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevStep}
                            disabled={isSubmitting}
                            className="w-1/3 py-6 rounded-xl border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900 group"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
                            Kembali
                        </Button>
                    )}

                    {currentStep < STEPS.length ? (
                        <Button
                            type="button"
                            onClick={handleNextStep}
                            disabled={isSubmitting}
                            className="flex-1 bg-[#0b3b60] hover:bg-[#082a45] text-white py-6 rounded-xl group"
                        >
                            Lanjutkan{" "}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#0b3b60] hover:bg-[#082a45] text-white py-6 rounded-xl group"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Memproses...
                                </span>
                            ) : (
                                <>
                                    Selesaikan Pendaftaran{" "}
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
