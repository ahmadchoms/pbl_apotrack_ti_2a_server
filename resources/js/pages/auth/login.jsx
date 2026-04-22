import { Link } from "@inertiajs/react";
import { AuthLayout } from "@/layouts/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
    const handleLogin = (data) => {
        console.log("Login Data:", data);
    };

    return (
        <AuthLayout
            title="Selamat Datang Kembali"
            description="Silakan masuk menggunakan kredensial Anda."
            subtitle="Pharmacy Portal Access"
            maxWidthClass="max-w-md"
        >
            <LoginForm onSubmitSuccess={handleLogin} />

            <div className="mt-6 text-center text-sm text-slate-500">
                Belum punya akun?{" "}
                <Link
                    href="/auth/register"
                    className="font-semibold text-primary hover:underline"
                >
                    Daftar di sini
                </Link>
            </div>
        </AuthLayout>
    );
}
