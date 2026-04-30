import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, AlertTriangle, Download, Plus } from "lucide-react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
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
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { PharmacyFilters } from "@/features/admin/components/pharmacies/PharmacyFilters";
import { PharmacyCard } from "@/features/admin/components/pharmacies/PharmacyCard";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";
import { usePharmacyList } from "@/features/admin/hooks/usePharmacyList";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function AdminPharmacyList(props) {
    const {
        search,
        setSearch,
        status,
        setStatus,
        deleteTarget,
        setDeleteTarget,
        handleFilter,
        confirmDelete,
        pharmacyList,
        pagination,
    } = usePharmacyList(props);

    return (
        <DashboardAdminLayout activeMenu="pharmacies">
            <div className="space-y-8 pb-12">
                <PageHeader
                    subtitle="Ekosistem Fasilitas"
                    title="Manajemen Apotek"
                />
                <PharmacyFilters
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    onFilter={handleFilter}
                />
                <AnimatePresence mode="wait">
                    {pharmacyList.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 text-slate-300"
                        >
                            <Building2 className="w-20 h-20 mb-6 opacity-10" />
                            <p className="text-sm font-black uppercase tracking-widest">
                                Tidak ada apotek ditemukan
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.06 },
                                },
                            }}
                            className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        >
                            {pharmacyList.map((pharmacy) => (
                                <PharmacyCard
                                    key={pharmacy.id}
                                    pharmacy={pharmacy}
                                    onDetail={(p) =>
                                        router.get(`/admin/pharmacies/${p.id}`)
                                    }
                                    onEdit={(p) =>
                                        router.get(
                                            `/admin/pharmacies/${p.id}/edit`,
                                        )
                                    }
                                    onDelete={(p) => setDeleteTarget(p)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                {pharmacyList.length > 0 && (
                    <AdminPagination
                        pagination={pagination}
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
                            <span className="text-slate-900">
                                {deleteTarget?.name}
                            </span>
                            ? Seluruh data staf, obat, dan riwayat order terkait
                            akan terpengaruh.
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
