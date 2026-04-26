import React from "react";
import { UserPlus, Search, Trash2, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { StaffFormDialog } from "@/features/pharmacy/components/staff/StaffFormDialog";
import { StaffTable } from "@/features/pharmacy/components/staff/StaffTable";
import { useStaff } from "@/features/pharmacy/hooks/useStaff";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Pagination } from "@/components/ui/pagination";

export default function PharmacistStaff(props) {
    const {
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        dialog,
        setDialog,
        staffList,
        pagination,
        handleAction,
        handleSave,
        handleDelete,
    } = useStaff(props);

    return (
        <DashboardPharmacyLayout activeMenu="Manajemen Staff">
            <div className="space-y-6">
                <header>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Manajemen Staff
                    </h2>
                    <p className="text-sm text-slate-500">
                        Kelola kredensial dan hak akses tim apotek Anda.
                    </p>
                </header>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <InputGroup className="rounded-xl max-w-80">
                        <InputGroupInput
                            placeholder="Cari nama staff, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 text-sm"
                        />
                        <InputGroupAddon>
                            <Search className="w-4 h-4 text-slate-400" />
                        </InputGroupAddon>
                    </InputGroup>

                    <div className="flex flex-wrap items-center gap-3 justify-end">
                        <Select
                            value={filters.status}
                            onValueChange={(v) => {
                                setFilters((p) => ({ ...p, status: v }));
                            }}
                        >
                            <SelectTrigger className="w-40 border border-zinc-200 rounded-xl text-slate-600">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl shadow-sm">
                                <SelectItem value="all">
                                    Semua Status
                                </SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">
                                    Nonaktif
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {(filters.status !== "all" || searchQuery) && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSearchQuery("");
                                    setFilters({ status: "all" });
                                }}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-3"
                            >
                                <X className="w-4 h-4 mr-1" /> Reset
                            </Button>
                        )}

                        <Button
                            onClick={() => handleAction("formOpen")}
                            className="bg-primary hover:bg-primary/90 px-6 rounded-xl shadow-lg shadow-blue-900/10"
                        >
                            <UserPlus className="w-4 h-4 mr-2" /> Tambah Staff
                            Baru
                        </Button>
                    </div>
                </div>

                <Card className="pt-0 border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardContent className="p-0">
                        <StaffTable
                            paginatedStaff={staffList}
                            onAction={handleAction}
                        />

                        {staffList.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-slate-400 text-sm font-medium">
                                    Data staff tidak ditemukan.
                                </p>
                            </div>
                        )}

                        <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between flex-wrap gap-4">
                            <span className="text-xs text-slate-400 font-medium">
                                Menampilkan {pagination.from || 0} -{" "}
                                {pagination.to || 0} dari{" "}
                                {pagination.total || 0} staff
                            </span>
                            <Pagination links={pagination.meta.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <StaffFormDialog
                open={dialog.formOpen}
                onClose={() =>
                    setDialog((p) => ({
                        ...p,
                        formOpen: false,
                        selected: null,
                    }))
                }
                onSave={handleSave}
                initialData={dialog.selected}
            />

            <Dialog
                open={dialog.deleteOpen}
                onOpenChange={(val) =>
                    !val && setDialog((p) => ({ ...p, deleteOpen: false }))
                }
            >
                <DialogContent className="sm:max-w-sm rounded-2xl text-center">
                    <div className="pt-4 flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">
                            Hapus Akun Staff?
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 px-4">
                            Akun{" "}
                            <span className="font-bold text-slate-700">
                                {dialog.selected?.user?.username}
                            </span>{" "}
                            akan dihapus secara permanen.
                        </p>
                    </div>
                    <DialogFooter className="sm:justify-center gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDialog((p) => ({ ...p, deleteOpen: false }))
                            }
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white border-none"
                        >
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardPharmacyLayout>
    );
}
