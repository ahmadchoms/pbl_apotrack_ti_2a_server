import React, { useState, useEffect } from "react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { router } from "@inertiajs/react";
import { Package } from "lucide-react";
import { OrderFilters } from "@/features/pharmacy/components/orders/OrderFilters";
import { OrderTableRow } from "@/features/pharmacy/components/orders/OrderTableRow";
import { Pagination } from "@/components/ui/pagination";

export default function OrdersList({
    orders,
    currentStatus,
    filters: serverFilters,
}) {
    const [search, setSearch] = useState(serverFilters?.search || "");
    const ordersData = orders?.data || [];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (serverFilters?.search || "")) {
                handleFilterChange({ search });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (newFilters) => {
        router.get(
            route("pharmacy.orders.list"),
            { ...serverFilters, ...newFilters, status: currentStatus },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusChange = (status) => {
        router.get(
            route("pharmacy.orders.list"),
            { ...serverFilters, status, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Pesanan">
            <div className="space-y-8 pb-12 max-w-7xl mx-auto">
                <Tabs
                    defaultValue={currentStatus}
                    onValueChange={handleStatusChange}
                    className="w-full"
                >
                    <OrderFilters
                        search={search}
                        setSearch={setSearch}
                        currentStatus={currentStatus}
                        onStatusChange={handleStatusChange}
                    />

                    <TabsContent value={currentStatus} className="mt-8">
                        <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-slate-100/50">
                                            <TableHead className="py-6 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                No. Order
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Pasien / Pembeli
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Layanan
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Pembayaran
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                                Grand Total
                                            </TableHead>
                                            <TableHead className="pr-10"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ordersData.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    className="h-96 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                                        <Package className="w-16 h-16 mb-4 opacity-10" />
                                                        <p className="text-sm font-black uppercase tracking-widest">
                                                            Tidak ada data
                                                            pesanan
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            ordersData.map((order) => (
                                                <OrderTableRow
                                                    key={order.id}
                                                    order={order}
                                                />
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {orders?.meta?.links && (
                            <div className="pt-8">
                                <Pagination links={orders.meta.links} />
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardPharmacyLayout>
    );
}
