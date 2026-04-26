import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, PlusCircle, Package, ScanLine } from "lucide-react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Link } from "@inertiajs/react";
import { OrderCard } from "@/features/pharmacy/components/orders/OrderCard";
import { OrderDetailPanel } from "@/features/pharmacy/components/orders/OrderDetailPanel";

export default function PharmacistOrderManagement({ orders: paginatedOrders }) {
    const orders = paginatedOrders?.data || [];
    const ordersList = orders.filter(
        (o) =>
            o.order_status !== "DELIVERED" &&
            o.order_status !== "COMPLETED" &&
            o.order_status !== "CANCELLED",
    );
    const [selectedOrder, setSelectedOrder] = useState(
        ordersList.length > 0 ? ordersList[0] : null,
    );
    const [search, setSearch] = useState("");

    const filteredOrders = ordersList.filter(
        (o) =>
            !search ||
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.buyer?.username?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Pesanan">
            <div className="pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Manajemen Pesanan
                        </h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            Pantau status dan kelola detail transaksi obat
                            pasien secara real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <InputGroup className="rounded-2xl min-w-80 bg-white shadow-sm border-slate-200 focus-within:border-primary/40 transition-all">
                            <InputGroupInput
                                placeholder="Cari No. Order atau Nama Pasien..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 text-sm border-0 focus:ring-0"
                            />
                            <InputGroupAddon className="pr-4">
                                <Search className="w-4.5 h-4.5 text-slate-400" />
                            </InputGroupAddon>
                        </InputGroup>
                        <Link
                            href={route("pharmacy.orders.pos")}
                            className="inline-flex items-center gap-2.5 bg-primary text-white px-5 h-11 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-[#002a58] transition-all whitespace-nowrap active:scale-95"
                        >
                            <PlusCircle className="w-4.5 h-4.5" />
                            Pesanan Baru
                        </Link>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                Daftar Transaksi ({filteredOrders.length})
                            </h3>
                            <Link
                                href={route("pharmacy.orders.list")}
                                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                Lihat Semua List →
                            </Link>
                        </div>

                        <ScrollArea className="h-full pr-4 -mr-4">
                            <div className="grid grid-cols-1 gap-4 pb-12">
                                {filteredOrders.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200"
                                    >
                                        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                                            <Package className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-500">
                                            Data tidak ditemukan
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Coba gunakan kata kunci pencarian
                                            lain.
                                        </p>
                                    </motion.div>
                                ) : (
                                    filteredOrders.map((order, index) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            index={index}
                                            isSelected={
                                                selectedOrder?.id === order.id
                                            }
                                            onSelect={setSelectedOrder}
                                        />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="lg:col-span-5 sticky top-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-2xl shadow-slate-200/50 flex flex-col h-full overflow-hidden">
                            <ScrollArea className="flex-1">
                                <AnimatePresence mode="wait">
                                    {selectedOrder ? (
                                        <OrderDetailPanel
                                            key={selectedOrder.id}
                                            order={selectedOrder}
                                        />
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center h-full min-h-100 text-slate-400 p-12 text-center"
                                        >
                                            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                                                <ScanLine className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <h4 className="text-base font-bold text-slate-600">
                                                Pilih Salah Satu Pesanan
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-50 mx-auto">
                                                Klik pada kartu pesanan di
                                                sebelah kiri untuk melihat
                                                rincian detail.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardPharmacyLayout>
    );
}
