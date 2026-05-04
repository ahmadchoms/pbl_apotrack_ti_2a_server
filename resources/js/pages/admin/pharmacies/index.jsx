import React, { useState } from "react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { PharmacyTableRow } from "@/features/admin/components/pharmacies/PharmacyTableRow";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building2, AlertTriangle, Download } from "lucide-react";
import { VERIFICATION_OPTIONS } from "@/features/admin/lib/constants";
import { router } from "@inertiajs/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminPharmacyList({ pharmacies, filters }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleFilter = (newFilters) => {
        router.get(
            route("admin.pharmacies.index"),
            { ...filters, ...newFilters, page: 1 },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleReset = () => {
        router.get(route("admin.pharmacies.index"), {}, { replace: true });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/pharmacies/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null),
            });
        }
    };

    return (
        <DashboardAdminLayout activeMenu="pharmacies">
            <div className="space-y-8 pb-12">
                <PageHeader
                    subtitle="Ekosistem Fasilitas"
                    title="Manajemen Apotek"
                />

                <FilterBar
                    configs={[
                        {
                            type: "search",
                            key: "search",
                            placeholder: "Cari nama, alamat, telepon...",
                        },
                        {
                            type: "select",
                            key: "status",
                            label: "Status",
                            options: VERIFICATION_OPTIONS,
                        },
                    ]}
                    currentFilters={filters}
                    onFilterChange={handleFilter}
                    onReset={handleReset}
                    actions={
                        <>
                            <Button
                                onClick={() =>
                                    window.open(
                                        route("admin.pharmacies.export"),
                                    )
                                }
                                variant="outline"
                                className="h-11 px-6 rounded-2xl bg-blue-50 border-0 text-[#0b3b60] font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all gap-2"
                            >
                                <Download className="w-4 h-4" /> Ekspor
                            </Button>
                            <Button
                                onClick={() =>
                                    router.get("/admin/pharmacies/create")
                                }
                                className="h-11 px-6 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all gap-2 shadow-lg shadow-primary/20"
                            >
                                <Building2 className="w-4 h-4" /> Tambah Apotek
                            </Button>
                        </>
                    }
                />

                <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100/50">
                                    <TableHead className="py-6 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Apotek & Lokasi
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Kontak
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Verifikasi
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Performa
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Statistik
                                    </TableHead>
                                    <TableHead className="pr-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pharmacies.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-96 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-slate-300">
                                                <Building2 className="w-16 h-16 mb-4 opacity-10" />
                                                <p className="text-sm font-black uppercase tracking-widest">
                                                    Data apotek tidak ditemukan
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pharmacies.data.map((pharmacy) => (
                                        <PharmacyTableRow
                                            key={pharmacy.id}
                                            pharmacy={pharmacy}
                                            onDelete={setDeleteTarget}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {pharmacies.data.length > 0 && (
                    <AdminPagination
                        pagination={pharmacies}
                        itemLabel="apotek"
                    />
                )}
            </div>

            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={() => setDeleteTarget(null)}
            >
                <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-lg">
                    <AlertDialogHeader>
                        <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mb-6 mx-auto">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black text-slate-900 text-center mb-2 uppercase tracking-tight">
                            Konfirmasi Penghapusan
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-bold text-slate-400 text-center leading-relaxed">
                            Apakah Anda yakin ingin menghapus{" "}
                            <span className="text-slate-900 font-black">
                                {deleteTarget?.name}
                            </span>
                            ? Seluruh data staf, obat, dan riwayat order terkait
                            akan terpengaruh secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row items-center justify-center gap-4 mt-10">
                        <AlertDialogCancel className="h-14 flex-1 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Batalkan
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="h-14 flex-1 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20"
                        >
                            Ya, Hapus Apotek
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardAdminLayout>
    );
}
