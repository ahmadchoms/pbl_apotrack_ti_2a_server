import React, { useState } from "react";
import { motion } from "framer-motion";
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
import {
    PlusCircle,
    Package,
    Info,
    X,
    Trash2,
    ArrowUpDown,
    ArrowDownAZ,
    ArrowUpAZ,
    DollarSign,
    Package2,
} from "lucide-react";
import { FILTER_TABS } from "@/features/pharmacy/lib/constants";
import { router, Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";

const SORT_OPTIONS = [
    { key: "name_asc", label: "Nama A-Z", icon: ArrowDownAZ },
    { key: "name_desc", label: "Nama Z-A", icon: ArrowUpAZ },
    { key: "stock_asc", label: "Stok Tersedikit", icon: Package2 },
    { key: "stock_desc", label: "Stok Terbanyak", icon: Package2 },
    { key: "price_asc", label: "Harga Terendah", icon: DollarSign },
    { key: "price_desc", label: "Harga Tertinggi", icon: DollarSign },
];

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

    const currentSort = filters.sort || "name_asc";
    const currentSortLabel =
        SORT_OPTIONS.find((s) => s.key === currentSort)?.label || "Urutkan";

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
            router.delete(
                route("pharmacy.medicines.destroy", deleteDialog.data.id),
                {
                    onSuccess: () => {
                        setDeleteDialog({ open: false, data: null });
                        toast.success("Data obat berhasil dihapus");
                    },
                },
            );
        }
    };

    return (
        <DashboardPharmacyLayout activeMenu="Daftar Obat">
            <div className="pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2"
                >
                    <PageHeader
                        title="Manajemen Obat Apotek"
                        description="Kelola inventori obat Anda dengan mudah. Tambah, edit, atau hapus data obat untuk memastikan stok selalu akurat dan up-to-date."
                    />

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-slate-600 font-semibold text-xs px-4 h-11 rounded-xl border-slate-200 hover:bg-slate-50 shadow-sm transition-all shrink-0"
                                >
                                    <ArrowUpDown className="w-4 h-4" />
                                    <span className="hidden sm:inline">{currentSortLabel}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="rounded-2xl border-slate-200 shadow-xl w-48 p-2"
                            >
                                {SORT_OPTIONS.map((opt) => {
                                    const Icon = opt.icon;
                                    const isActive = currentSort === opt.key;
                                    return (
                                        <DropdownMenuItem
                                            key={opt.key}
                                            onClick={() =>
                                                handleFilter({ sort: opt.key })
                                            }
                                            className={`rounded-xl text-xs font-bold gap-2 py-2.5 cursor-pointer ${
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-slate-600 focus:bg-slate-50"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {opt.label}
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                            )}
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link
                            href={route("pharmacy.medicines.create")}
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold text-xs tracking-wide px-4 h-11 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-600/10 transition-all duration-200 group shrink-0 active:scale-[0.98] flex-1 md:flex-none"
                        >
                            <PlusCircle className="w-4 h-4 text-white/90 group-hover:rotate-90 transition-transform duration-300 stroke-[2.2]" />
                            <span>Tambah Obat</span>
                        </Link>
                    </div>
                </motion.div>

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
                            akan dihapus secara permanen dari inventori.
                            Tindakan ini tidak dapat dibatalkan.
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
