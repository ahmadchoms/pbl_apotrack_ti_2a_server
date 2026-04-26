import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    Home,
    ShieldAlert,
    Search,
    RefreshCw,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ status, message }) {
    const title = {
        503: "503: Service Unavailable",
        500: "500: Server Error",
        404: "404: Page Not Found",
        403: "403: Access Forbidden",
        401: "401: Unauthorized Access",
    }[status] || `Error ${status}`;

    const description = {
        503: "Sorry, we are doing some maintenance. Please check back soon.",
        500: "Whoops, something went wrong on our servers. We are looking into it.",
        404: "Sorry, the page you are looking for could not be found.",
        403: "Sorry, you don't have permission to access this page.",
        401: "Please login to access this area.",
    }[status] || message || "An unexpected error occurred.";

    const Icon = {
        503: RefreshCw,
        500: AlertCircle,
        404: Search,
        403: Lock,
        401: ShieldAlert,
    }[status] || AlertCircle;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden p-6 font-sans">
            <Head title={title} />

            {/* Abstract Background Patterns */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="z-10 w-full max-w-lg text-center"
            >
                <div className="relative mb-8 inline-block">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-[2rem] shadow-2xl shadow-primary/20 flex items-center justify-center relative z-10 mx-auto"
                    >
                        <Icon className="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute -top-4 -right-4 bg-red-500 text-white font-black px-4 py-1.5 rounded-full text-xs sm:text-sm shadow-lg transform rotate-12"
                    >
                        {status}
                    </motion.div>
                </div>

                <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight"
                >
                    {title.split(': ')[1] || title}
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-500 text-lg mb-10 leading-relaxed font-medium"
                >
                    {description}
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="w-full sm:w-auto px-8 h-14 rounded-2xl border-2 border-slate-200 hover:bg-slate-100 font-bold text-slate-700 gap-2.5 transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Kembali
                    </Button>

                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto px-8 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold gap-2.5 shadow-xl shadow-primary/25 transition-all group">
                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Ke Beranda
                        </Button>
                    </Link>
                </motion.div>

                {status === 401 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8"
                    >
                        <Link 
                            href={route('auth.login')}
                            className="text-primary font-bold hover:underline"
                        >
                            Masuk ke Akun Anda
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            <footer className="absolute bottom-8 left-0 right-0 text-center z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} ApoTrack Systems &bull; Error Dashboard
                </p>
            </footer>
        </div>
    );
}
