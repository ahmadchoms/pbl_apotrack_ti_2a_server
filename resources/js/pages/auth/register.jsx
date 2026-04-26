import { Link } from "@inertiajs/react";
import { AuthLayout } from "@/layouts/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
    const handleRegister = (data) => {
        console.log("Register Data:", data);
    };

    return (
        <AuthLayout
            title="Pendaftaran Apotek"
            description="Daftarkan akun admin apotek Anda dan mulai mengelola inventori dengan lebih efisien."
            subtitle="Sistem Manajemen Apotek"
            maxWidthClass="max-w-2xl"
        >
            <RegisterForm onSubmitSuccess={handleRegister} />

            <div className="mt-8 text-center text-sm text-slate-500">
                Sudah punya akun?{" "}
                <Link
                    href={route("auth.login")}
                    className="font-semibold text-primary hover:underline"
                >
                    Masuk di sini
                </Link>
            </div>
        </AuthLayout>
    );
}
