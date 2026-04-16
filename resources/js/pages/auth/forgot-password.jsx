import { motion } from "framer-motion";
import { Building2, ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
    const handleForgot = (data) => {
        console.log("Forgot Password Data:", data);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f7f9] relative overflow-hidden">
            <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(#cbd5e1 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 flex flex-col items-center mb-8"
            >
                <div className="bg-[#0b3b60] p-3 rounded-xl shadow-md mb-4">
                    <Building2 className="text-white h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-[#0b3b60]">ApoTrack</h1>
                <p className="text-xs font-medium text-slate-500 tracking-widest mt-1 uppercase">
                    Pharmacy Portal Access
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="z-10 w-full max-w-md px-4"
            >
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                    <CardHeader className="space-y-2 pb-6 pt-8 px-8 text-center sm:text-left">
                        <div className="flex items-center space-x-2 mb-2">
                            <Link
                                href="/auth/login"
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Kembali
                            </span>
                        </div>
                        <CardTitle className="text-2xl font-semibold text-slate-800">
                            Lupa Kata Sandi?
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                            Masukkan email Anda untuk menerima tautan pemulihan
                            kata sandi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <ForgotPasswordForm onSubmitSuccess={handleForgot} />
                    </CardContent>
                </Card>
            </motion.div>

            <footer className="z-10 mt-10 flex flex-col items-center space-y-4 text-slate-500 text-xs">
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-slate-800">
                        Pusat Bantuan
                    </a>
                    <a href="#" className="hover:text-slate-800">
                        Kebijakan Privasi
                    </a>
                    <a href="#" className="hover:text-slate-800">
                        Syarat & Ketentuan
                    </a>
                </div>
                <p className="text-[10px] tracking-wider uppercase font-semibold">
                    &copy; 2026 APOTRACK. ALL RIGHTS RESERVED.
                </p>
            </footer>
        </div>
    );
}
