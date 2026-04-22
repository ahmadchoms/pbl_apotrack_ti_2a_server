import React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function AuthLayout({
    children,
    title,
    description,
    subtitle = "Pharmacy Portal Access",
    maxWidthClass = "max-w-md",
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden py-10">
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
                <div className="bg-primary p-3 rounded-xl shadow-md mb-4">
                    <Building2 className="text-white h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-primary">ApoTrack</h1>
                <p className="text-xs font-medium text-slate-500 tracking-widest mt-1 uppercase text-center max-w-[250px]">
                    {subtitle}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`z-10 w-full ${maxWidthClass} px-4`}
            >
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="space-y-2 pb-6 pt-8 px-8 text-center sm:text-left">
                        <CardTitle className="text-2xl font-semibold text-slate-800">
                            {title}
                        </CardTitle>
                        {description && (
                            <CardDescription className="text-slate-500">
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        {children}
                    </CardContent>
                </Card>
            </motion.div>

            <footer className="z-10 mt-10 flex flex-col items-center space-y-4 text-slate-500 text-xs">
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-primary transition-colors">
                        Pusat Bantuan
                    </a>
                    <a href="#" className="hover:text-primary transition-colors">
                        Kebijakan Privasi
                    </a>
                    <a href="#" className="hover:text-primary transition-colors">
                        Syarat & Ketentuan
                    </a>
                </div>
                <p className="text-[10px] tracking-wider uppercase font-semibold">
                    &copy; {new Date().getFullYear()} APOTRACK. ALL RIGHTS RESERVED.
                </p>
            </footer>
        </div>
    );
}
