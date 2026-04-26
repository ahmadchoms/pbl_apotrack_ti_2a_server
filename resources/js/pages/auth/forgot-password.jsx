import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/layouts/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
    const handleForgot = (data) => {
        console.log("Forgot Password Data:", data);
    };

    return (
        <AuthLayout
            title="Lupa Kata Sandi?"
            description="Masukkan email Anda untuk menerima tautan pemulihan kata sandi."
            subtitle="Pharmacy Portal Access"
            maxWidthClass="max-w-md"
        >
            <div className="flex items-center space-x-2 mb-6">
                <Link
                    href={route("auth.login")}
                    className="text-slate-400 hover:text-primary transition-colors flex items-center"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span className="text-xs font-bold uppercase tracking-widest mt-0.5">
                        Kembali
                    </span>
                </Link>
            </div>

            <ForgotPasswordForm onSubmitSuccess={handleForgot} />
        </AuthLayout>
    );
}
