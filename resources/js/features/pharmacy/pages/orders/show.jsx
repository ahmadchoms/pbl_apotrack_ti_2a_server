import React from "react";
import { motion } from "framer-motion";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, 
    Printer, 
    Calendar, 
    User, 
    Phone, 
    Package, 
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { router } from "@inertiajs/react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function OrderShow({ order }) {
    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED": return "bg-emerald-100 text-emerald-700";
            case "PENDING": return "bg-amber-100 text-amber-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "COMPLETED": return <CheckCircle2 className="w-4 h-4" />;
            case "PENDING": return <Clock className="w-4 h-4" />;
            case "CANCELLED": return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <DashboardPharmacyLayout activeMenu="Riwayat Transaksi">
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.get(route('pharmacy.orders.index'))}
                            className="text-slate-500 hover:text-[#0b3b60] p-0 mb-2"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Riwayat
                        </Button>
                        <h2 className="text-3xl font-black text-[#0b3b60]">
                            Detail Pesanan <span className="text-slate-300">#{order.id.substring(0, 8)}</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-slate-600 flex items-center gap-2">
                            <Printer className="w-4 h-4" /> Cetak Struk
                        </Button>
                    </div>
                </div>

                <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible" 
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Items */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                                <CardHeader className="px-10 pt-10 pb-6 border-b border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <Package className="w-5 h-5 text-[#0b3b60]" /> Daftar Item
                                        </CardTitle>
                                        <span className="text-sm font-bold text-slate-400">
                                            {order.items?.length || 0} Produk
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-50">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                                                        {item.medicine?.images?.[0] ? (
                                                            <img src={item.medicine.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-6 h-6 text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">{item.medicine?.name}</h4>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                            {item.quantity} x Rp {item.price_per_unit.toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-[#0b3b60]">
                                                        Rp {(item.quantity * item.price_per_unit).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-10 bg-slate-50/50 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Subtotal</span>
                                            <span className="text-slate-800 font-bold">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Pajak (0%)</span>
                                            <span className="text-slate-800 font-bold">Rp 0</span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                            <span className="text-base font-black text-[#0b3b60] uppercase tracking-widest">Total Bayar</span>
                                            <span className="text-2xl font-black text-[#0b3b60]">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Transaction Status */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                                <CardContent className="p-10 space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Transaksi</p>
                                        <div className={`h-12 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0b3b60]">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</p>
                                                <p className="text-sm font-bold text-slate-700">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode Pembayaran</p>
                                                <p className="text-sm font-bold text-slate-700">{order.payment_method || 'Tunai (POS)'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Customer Info */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                                <CardHeader className="px-10 pt-10 pb-0 border-0">
                                    <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                        Informasi Pelanggan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-10 pt-6 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{order.user?.username || 'Guest Customer'}</h4>
                                            <p className="text-xs text-slate-400">{order.user?.email || 'Walk-in Customer'}</p>
                                        </div>
                                    </div>
                                    {order.user?.phone && (
                                        <div className="pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <Phone className="w-4 h-4" />
                                                <span className="text-sm font-medium">{order.user.phone}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </DashboardPharmacyLayout>
    );
}
