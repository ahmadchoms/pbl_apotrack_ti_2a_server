import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    ChevronLeft, 
    Printer, 
    ShoppingBag, 
    User, 
    CreditCard, 
    Truck, 
    Package, 
    Pill, 
    ExternalLink, 
    ZoomIn, 
    CheckCircle2, 
    XCircle, 
    Clock,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { router, Link } from "@inertiajs/react";
import { formatRupiah } from "@/lib/utils";
import { STATUS_CONFIG } from "@/features/pharmacy/lib/constants";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function OrderShow({ order: orderWrapper }) {
    const order = orderWrapper.data;
    const [isZoomed, setIsZoomed] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    
    const statusCfg = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.PENDING;
    const isDelivery = order.service_type === "DELIVERY";
    const needsPrescription = order.requires_prescription;
    const isPrescriptionVerified = order.prescription?.status === 'VERIFIED';

    const handleValidatePrescription = (status) => {
        router.patch(route("pharmacy.orders.prescription.validate", order.prescription.id), {
            status,
        }, {
            onSuccess: () => toast.success(`Resep berhasil divalidasi`),
        });
    };

    const handleUpdateStatus = (status, note = null) => {
        router.patch(route("pharmacy.orders.status.update", order.id), {
            status,
            note
        }, {
            onSuccess: () => toast.success(`Status diperbarui ke ${status}`),
        });
    };

    const handleReject = () => {
        if (!rejectionReason) {
            toast.error("Alasan penolakan wajib diisi");
            return;
        }
        router.patch(route("pharmacy.orders.reject", order.id), {
            reason: rejectionReason
        }, {
            onSuccess: () => {
                toast.success("Pesanan ditolak");
                setShowRejectDialog(false);
            },
        });
    };

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Pesanan">
            <div className="max-w-[1600px] mx-auto pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-4">
                    <div className="flex items-center gap-4">
                        <Link 
                            href={route('pharmacy.orders.index')}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#00346C] hover:border-[#00346C]/30 transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-[#00346C] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                    Detail Transaksi
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                    ID: {order.order_number}
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                Pesanan <span className="text-[#00346C]">{order.buyer?.username}</span>
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 shadow-sm bg-white">
                            <Printer className="w-4 h-4" /> Cetak Struk
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                    {/* Left Column: Prescription Document */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <Card className="rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/30 overflow-hidden sticky top-6 bg-white flex flex-col h-[calc(100vh-200px)]">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 shadow-inner">
                                        <ExternalLink className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Dokumen Resep</h3>
                                </div>
                                {order.prescription?.image_url && (
                                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider text-violet-600 hover:bg-violet-50" onClick={() => window.open(order.prescription.image_url, '_blank')}>
                                        Buka di Tab Baru
                                    </Button>
                                )}
                            </div>
                            <CardContent className="flex-1 min-h-0 p-8 flex flex-col bg-slate-50/50">
                                {needsPrescription ? (
                                    <div className="flex-1 relative rounded-3xl overflow-hidden border border-slate-200 bg-white group shadow-2xl">
                                        {order.prescription?.image_url ? (
                                            <>
                                                <img 
                                                    src={order.prescription.image_url} 
                                                    alt="Resep" 
                                                    className="w-full h-full object-contain cursor-zoom-in p-4"
                                                    onClick={() => setIsZoomed(true)}
                                                />
                                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                    <Button variant="secondary" className="h-10 rounded-xl font-bold text-xs gap-2 shadow-xl bg-white/90 backdrop-blur" onClick={() => setIsZoomed(true)}>
                                                        <ZoomIn className="w-4 h-4" /> Perbesar
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4">
                                                <AlertCircle className="w-16 h-16 opacity-20" />
                                                <p className="text-xs font-black uppercase tracking-[0.2em]">Belum Ada Lampiran</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border border-slate-100 shadow-inner">
                                        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Otomatis Valid</p>
                                        <p className="text-xs text-slate-500 mt-3 font-medium italic leading-relaxed">
                                            "Pesanan ini tidak mengandung obat golongan keras yang memerlukan resep dokter."
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order Details & Actions */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                        {/* Summary & Customer Info */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <Card className="rounded-[2.5rem] border-slate-200/80 shadow-xl shadow-slate-200/20 bg-white p-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <ShoppingBag className="w-3.5 h-3.5" /> Identitas Pesanan
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">Status Saat Ini</span>
                                        <Badge className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${statusCfg.badge}`}>
                                            {statusCfg.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">Metode Pembayaran</span>
                                        <div className="flex items-center gap-2 text-slate-800">
                                            <CreditCard className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-black uppercase tracking-wider">{order.payment_method?.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">Status Bayar</span>
                                        <span className={`text-xs font-black uppercase tracking-wider ${order.payment_status === 'PAID' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                            {order.payment_status === 'PAID' ? 'Lunas' : 'Menunggu'}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-[2.5rem] border-slate-200/80 shadow-xl shadow-slate-200/20 bg-white p-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" /> Informasi Pelanggan
                                </h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-black shadow-inner">
                                        {order.buyer?.username?.substring(0,2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{order.buyer?.username}</p>
                                        <p className="text-xs text-slate-500 font-medium">{order.buyer?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No. Telepon</span>
                                        <span className="text-xs font-bold text-slate-600">{order.buyer?.phone}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Tipe Layanan</span>
                                        <div className="flex items-center gap-1.5">
                                            {isDelivery ? <Truck className="w-3 h-3 text-indigo-400" /> : <Package className="w-3 h-3 text-amber-400" />}
                                            <span className="text-xs font-bold text-slate-600">{isDelivery ? 'Antar Alamat' : 'Ambil di Apotek'}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Order Items Table */}
                        <Card className="rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/20 bg-white overflow-hidden">
                            <div className="p-8 border-b border-slate-50">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                    <Pill className="w-5 h-5 text-[#00346C]" /> Daftar Item Obat
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah</th>
                                            <th className="px-4 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga</th>
                                            <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {order.items?.map((item) => (
                                            <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#00346C] shrink-0 border border-slate-100">
                                                            <Pill className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-black text-slate-800 truncate">{item.medicine_name}</p>
                                                            {item.requires_prescription && (
                                                                <Badge className="mt-1 h-4 px-1.5 bg-rose-50 text-rose-500 border-rose-100 text-[8px] font-black uppercase tracking-widest">Wajib Resep</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    <span className="text-xs font-bold text-slate-600">{item.quantity} {item.unit_name}</span>
                                                </td>
                                                <td className="px-4 py-5 text-right">
                                                    <span className="text-xs font-bold text-slate-500 tabular-nums">{formatRupiah(item.price)}</span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <span className="text-sm font-black text-[#00346C] tabular-nums">{formatRupiah(item.subtotal)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-10 bg-[#00346C]/5 flex items-center justify-between border-t border-[#00346C]/10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#00346C]/60 uppercase tracking-[0.2em]">Total Pembayaran</span>
                                    <span className="text-xs text-[#00346C]/40 font-bold uppercase mt-1 italic">Termasuk biaya layanan & PPN</span>
                                </div>
                                <span className="text-3xl font-black text-[#00346C] tabular-nums tracking-tighter">
                                    {formatRupiah(order.grand_total)}
                                </span>
                            </div>
                        </Card>

                        {/* Action Buttons Container */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/80 shadow-2xl shadow-slate-200/30">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" /> Manajemen Status & Aksi
                            </h3>
                            
                            <div className="flex flex-wrap gap-4">
                                {order.order_status === "PENDING" && (
                                    <>
                                        {needsPrescription && !isPrescriptionVerified && (
                                            <Button className="h-14 px-8 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-violet-500/30 flex-1 min-w-[200px]" onClick={() => handleValidatePrescription("VERIFIED")}>
                                                <CheckCircle2 className="w-5 h-5 mr-2" /> Validasi Resep
                                            </Button>
                                        )}
                                        <Button className={`h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 flex-1 min-w-[200px] ${(needsPrescription && !isPrescriptionVerified) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`} 
                                            disabled={needsPrescription && !isPrescriptionVerified}
                                            onClick={() => handleUpdateStatus("PROCESSING")}>
                                            <CheckCircle2 className="w-5 h-5 mr-2" /> Setujui & Proses
                                        </Button>
                                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-rose-200 text-rose-500 hover:bg-rose-50 font-black text-[11px] uppercase tracking-[0.2em] flex-1 min-w-[200px]" onClick={() => setShowRejectDialog(true)}>
                                            <XCircle className="w-5 h-5 mr-2" /> Tolak Pesanan
                                        </Button>
                                    </>
                                )}

                                {order.order_status === "PROCESSING" && (
                                    <Button className="h-14 px-8 rounded-2xl bg-[#00346C] hover:bg-[#002a58] text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/30 flex-1" 
                                        onClick={() => handleUpdateStatus(isDelivery ? "SHIPPED" : "READY_FOR_PICKUP")}>
                                        {isDelivery ? (
                                            <> <Truck className="w-5 h-5 mr-2" /> Tandai Sudah Dikirim </>
                                        ) : (
                                            <> <CheckCircle2 className="w-5 h-5 mr-2" /> Tandai Siap Diambil </>
                                        )}
                                        <ArrowRight className="ml-4 w-4 h-4 opacity-50" />
                                    </Button>
                                )}

                                {["READY_FOR_PICKUP", "SHIPPED", "DELIVERED"].includes(order.order_status) && (
                                    <Button className="h-14 px-8 rounded-2xl bg-slate-800 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/30 flex-1" onClick={() => handleUpdateStatus("COMPLETED")}>
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Selesaikan Transaksi
                                    </Button>
                                )}

                                {order.order_status === "CANCELLED" && (
                                    <div className="flex-1 flex items-center gap-3 p-6 bg-rose-50 rounded-2xl border border-rose-100">
                                        <XCircle className="w-8 h-8 text-rose-500 shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-rose-700 uppercase tracking-widest">Pesanan Dibatalkan</p>
                                            <p className="text-[11px] text-rose-500 font-medium mt-1">Transaksi ini telah dihentikan dan tidak dapat diproses lebih lanjut.</p>
                                        </div>
                                    </div>
                                )}

                                {order.order_status === "COMPLETED" && (
                                    <div className="flex-1 flex items-center gap-3 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Pesanan Selesai</p>
                                            <p className="text-[11px] text-emerald-500 font-medium mt-1">Transaksi telah berhasil diselesaikan dan obat telah diterima oleh pasien.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-slate-100 shadow-2xl">
                    <DialogHeader>
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Konfirmasi Penolakan</DialogTitle>
                        <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                            Mohon berikan alasan penolakan yang jelas agar pelanggan dapat memahami mengapa pesanan tidak dapat diproses.
                        </p>
                    </DialogHeader>
                    <div className="py-6">
                        <textarea 
                            className="w-full h-32 rounded-2xl border-slate-100 bg-slate-50 text-sm p-4 focus:ring-[#00346C] focus:border-[#00346C] placeholder:text-slate-300 font-medium"
                            placeholder="Contoh: Stok obat habis, atau resep tidak valid..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" className="h-12 rounded-xl font-bold text-slate-400" onClick={() => setShowRejectDialog(false)}>Batal</Button>
                        <Button className="h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-lg shadow-rose-500/20" onClick={handleReject}>
                            Tolak Pesanan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Prescription Zoom Overlay */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8 cursor-zoom-out"
                        onClick={() => setIsZoomed(false)}
                    >
                        <motion.img 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={order.prescription?.image_url} 
                            className="max-w-full max-h-full object-contain shadow-2xl"
                        />
                        <Button variant="ghost" className="absolute top-8 right-8 text-white/50 hover:text-white" onClick={() => setIsZoomed(false)}>
                            Tutup <XCircle className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardPharmacyLayout>
    );
}
