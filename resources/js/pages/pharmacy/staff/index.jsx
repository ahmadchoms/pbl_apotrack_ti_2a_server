import React, { useState } from "react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import {
    Users,
    QrCode,
    Copy,
    Calendar,
    Activity,
    Trash2,
    UserPlus,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import axios from "axios";
import { FilterBar } from "@/components/shared/FilterBar";
import { StaffTableRow } from "@/features/pharmacy/components/staff/StaffTableRow";
import { StaffFormDialog } from "@/features/pharmacy/components/staff/StaffFormDialog";
import { Pagination } from "@/components/ui/pagination";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";

export default function StaffPage({ staff, activityLogs, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
    const [invitationUrl, setInvitationUrl] = useState("");
    const [invitationPin, setInvitationPin] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const [formDialog, setFormDialog] = useState({ open: false, data: null });
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        data: null,
    });

    const handleFilter = (updates) => {
        const newFilters = { ...filters, ...updates };
        router.get(route("pharmacy.staff.index"), newFilters, {
            preserveState: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        setStatus("all");
        router.get(route("pharmacy.staff.index"), {}, { replace: true });
    };

    const handleSave = (data) => {
        const method = formDialog.data ? "put" : "post";
        const url = formDialog.data
            ? route("pharmacy.staff.update", formDialog.data.id)
            : route("pharmacy.staff.store");

        router[method](url, data, {
            onSuccess: () => {
                setFormDialog({ open: false, data: null });
                toast.success("Data staff berhasil disimpan");
            },
        });
    };

    const handleDelete = () => {
        if (deleteDialog.data) {
            router.delete(
                route("pharmacy.staff.destroy", deleteDialog.data.id),
                {
                    onSuccess: () => {
                        setDeleteDialog({ open: false, data: null });
                        toast.success("Staff berhasil dihapus");
                    },
                },
            );
        }
    };

    const generateInvitation = async () => {
        setIsGenerating(true);
        try {
            const response = await axios.post(
                route("pharmacy.staff.invitation"),
            );
            setInvitationUrl(response.data.url);
            setInvitationPin(response.data.pin);
            setIsInvitationModalOpen(true);
        } catch (error) {
            toast.error("Gagal membuat link undangan");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <DashboardPharmacyLayout activeMenu="Tim Apotek">
            <div className="pb-20 px-4 max-w-7xl mx-auto">
                <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <PageHeader
                        title="Manajemen Pegawai Apotek"
                        description="Kelola tim apotek Anda, pantau aktivitas, dan undang anggota tim baru ke dalam sistem."
                    />

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={generateInvitation}
                            disabled={isGenerating}
                            variant="outline"
                            className="h-14 px-8 rounded-2xl border-2 border-slate-100 bg-white text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all gap-3"
                        >
                            <QrCode className="w-5 h-5" />
                            {isGenerating ? "Generating..." : "Link Undangan"}
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    <FilterBar
                        configs={[
                            {
                                type: "search",
                                key: "search",
                                placeholder: "Cari nama staff, email...",
                            },
                            {
                                type: "select",
                                key: "status",
                                label: "Status",
                                options: [
                                    { value: "active", label: "Aktif" },
                                    { value: "inactive", label: "Non-Aktif" },
                                ],
                            },
                        ]}
                        currentFilters={filters}
                        onFilterChange={handleFilter}
                        onReset={handleReset}
                        actions={
                            <Button
                                onClick={() =>
                                    setFormDialog({
                                        open: true,
                                        data: null,
                                    })
                                }
                                className="h-10 px-5 rounded-xl bg-primary text-white font-semibold text-xs tracking-wide hover:bg-[#002855] transition-all gap-2 shadow-sm shadow-blue-900/10 active:scale-98"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Tambah Staff</span>
                            </Button>
                        }
                    />

                    <Card className="pt-0 rounded-2xl border border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/70">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="py-4 pl-8 text-xs font-semibold text-slate-500 tracking-wide">
                                            Informasi Pegawai
                                        </TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-500 tracking-wide">
                                            Kontak
                                        </TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-500 tracking-wide">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-xs pl-8 font-semibold text-slate-500 tracking-wide">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {staff.data.length === 0 ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell
                                                colSpan={4}
                                                className="h-72 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-slate-300">
                                                    <Users className="w-12 h-12 mb-3 text-slate-200" />
                                                    <p className="text-xs font-medium text-slate-400 tracking-wide">
                                                        Data pegawai tidak ditemukan
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        staff.data.map((item) => (
                                            <StaffTableRow
                                                key={item.id}
                                                staff={item}
                                                onDelete={(s) =>
                                                    setDeleteDialog({
                                                        open: true,
                                                        data: s,
                                                    })
                                                }
                                            />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {staff.meta?.links && (
                        <div className="pt-2">
                            <Pagination links={staff.meta.links} />
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                open={isInvitationModalOpen}
                onOpenChange={setIsInvitationModalOpen}
            >
                <DialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-0 max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader className="text-center px-8 pt-8 pb-4 border-b border-slate-100">
                        <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Link Undangan
                        </DialogTitle>
                        <DialogDescription className="text-sm font-bold text-slate-400">
                            Bagikan QR Code atau Pin ini kepada calon staff baru
                            Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        <div className="flex flex-col items-center gap-6">
                            <div className="p-4 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50">
                                <QRCodeSVG value={invitationUrl} size={180} />
                            </div>

                            <div className="w-full space-y-4">
                                {invitationPin && (
                                    <div className="w-full">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-3">
                                            Kode Undangan Manual
                                        </p>
                                        <div className="flex items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <span className="flex-1 text-center text-2xl font-black text-slate-800 tracking-[0.3em]">
                                                {invitationPin}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        invitationPin,
                                                    );
                                                    toast.success(
                                                        "Kode berhasil disalin",
                                                    );
                                                }}
                                                className="h-8 w-8 p-0 rounded-xl hover:bg-white text-primary shrink-0"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <StaffFormDialog
                open={formDialog.open}
                onClose={() => setFormDialog({ open: false, data: null })}
                onSave={handleSave}
                initialData={formDialog.data}
            />

            <Dialog
                open={deleteDialog.open}
                onOpenChange={(val) =>
                    !val && setDeleteDialog({ open: false, data: null })
                }
            >
                <DialogContent className="rounded-3xl border border-slate-100 shadow-xl p-8 max-w-sm bg-white animate-in fade-in-50 zoom-in-95 duration-200">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 hover:rotate-12">
                            <Trash2 className="w-6 h-6" />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                            Hapus Akun Staff
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed px-2">
                            Akun staff <span className="text-slate-900 font-semibold">{deleteDialog.data?.user?.username}</span> akan dihapus secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
                        </p>

                        <div className="flex items-center gap-3 w-full">
                            <Button
                                variant="ghost"
                                onClick={() => setDeleteDialog({ open: false, data: null })}
                                className="h-11 flex-1 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 font-semibold text-xs tracking-wide transition-all"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="h-11 flex-1 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-semibold text-xs tracking-wide shadow-sm shadow-rose-600/10 active:scale-98 transition-all"
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
