import React, { useState } from "react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { FilterBar } from "@/components/shared/FilterBar";
import { MedicineTableRow } from "@/features/pharmacy/components/medicine/MedicineTableRow";
import { MedicineDetailModal } from "@/features/pharmacy/components/medicine/MedicineDetailModal";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Plus, Package, Info, X, Trash2 } from "lucide-react";
import { FILTER_TABS } from "@/features/pharmacy/lib/constants";
import { router, Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function PharmacistMedicineCatalog({
    medicines,
    categories = [],
    filters = {},
}) {
    const [detailMedicine, setDetailMedicine] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        data: null,
    });

    const handleFilter = (newFilters) => {
        router.get(
            route("pharmacy.medicines.index"),
            { ...filters, ...newFilters, page: 1 },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleReset = () => {
        router.get(route("pharmacy.medicines.index"), {}, { replace: true });
    };

    const handleDelete = (medicine) => {
        setDeleteDialog({
            open: true,
            data: medicine,
        });
    };

    const confirmDelete = () => {
        if (deleteDialog.data) {
            router.delete(route("pharmacy.medicines.destroy", deleteDialog.data.id), {
                onSuccess: () => {
                    setDeleteDialog({ open: false, data: null });
                    toast.success("Data obat berhasil dihapus");
                },
            });
        }
    };

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Obat">
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-primary text-white border-blue-900 shadow-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Inventory Control
                            </Badge>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Katalog Inventori
                        </h2>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wide">
                            Kelola data master obat dan pergerakan stok apotek.
                        </p>
                    </div>

                    <Link href={route("pharmacy.medicines.create")}>
                        <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-[#0055a5] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95">
                            <Plus className="w-5 h-5" /> Tambah Obat Baru
                        </Button>
                    </Link>
                </div>

                <FilterBar
                    configs={[
                        {
                            type: "search",
                            key: "search",
                            placeholder: "Cari nama obat...",
                        },
                        {
                            type: "select",
                            key: "status",
                            label: "Status Stok",
                            options: FILTER_TABS.map((t) => ({
                                value: t.key,
                                label: t.label,
                            })),
                        },
                        {
                            type: "select",
                            key: "category",
                            label: "Kategori",
                            options: categories.map((cat) => ({
                                value: cat.name || cat,
                                label: cat.name || cat,
                            })),
                        },
                    ]}
                    currentFilters={filters}
                    onFilterChange={handleFilter}
                    onReset={handleReset}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Menampilkan{" "}
                                <span className="text-slate-800">
                                    {medicines.data.length}
                                </span>{" "}
                                dari{" "}
                                <span className="text-slate-800">
                                    {medicines.meta.total}
                                </span>{" "}
                                obat
                            </p>
                        </div>
                    </div>

                    <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100/50">
                                        <TableHead className="py-6 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            Obat & Info
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            Kategori
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            Harga
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            Stok Aktif
                                        </TableHead>
                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            Status
                                        </TableHead>
                                        <TableHead className="pr-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {medicines.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-96 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-slate-300">
                                                    <Package className="w-16 h-16 mb-4 opacity-10" />
                                                    <p className="text-sm font-black uppercase tracking-widest">
                                                        Data obat tidak
                                                        ditemukan
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        medicines.data.map((medicine) => (
                                            <MedicineTableRow
                                                key={medicine.id}
                                                medicine={medicine}
                                                onView={setDetailMedicine}
                                                onDelete={handleDelete}
                                            />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {medicines.meta?.links && (
                        <div className="pt-8">
                            <Pagination links={medicines.meta.links} />
                        </div>
                    )}
                </div>
            </div>

            <MedicineDetailModal
                medicine={detailMedicine}
                open={!!detailMedicine}
                onClose={() => setDetailMedicine(null)}
            />

            <Dialog
                open={deleteDialog.open}
                onOpenChange={(val) =>
                    !val && setDeleteDialog({ open: false, data: null })
                }
            >
                <DialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-md bg-white">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mb-6">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                            Hapus Data Obat?
                        </h3>
                        <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
                            Data obat{" "}
                            <span className="text-slate-900 font-black">
                                {deleteDialog.data?.name}
                            </span>{" "}
                            akan dihapus secara permanen dari inventori. Tindakan
                            ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex items-center gap-4 w-full">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setDeleteDialog({ open: false, data: null })
                                }
                                className="h-14 flex-1 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                className="h-14 flex-1 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20"
                            >
                                Ya, Hapus
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardPharmacyLayout>
    );
}
