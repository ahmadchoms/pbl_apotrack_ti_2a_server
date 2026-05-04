import React, { useState } from "react";
import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import {
    Users,
    QrCode,
    Copy,
    Search,
    Calendar,
    Activity,
    ToggleLeft,
    ToggleRight,
    Plus,
    Trash2,
    UserPlus,
} from "lucide-react";
import { router, Link } from "@inertiajs/react";
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
    DialogFooter,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import axios from "axios";
import { FilterBar } from "@/components/shared/FilterBar";
import { StaffTableRow } from "@/features/pharmacy/components/staff/StaffTableRow";
import { StaffFormDialog } from "@/features/pharmacy/components/staff/StaffFormDialog";
import { Pagination } from "@/components/ui/pagination";

export default function StaffPage({ staff, activityLogs, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
    const [invitationUrl, setInvitationUrl] = useState("");
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
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-blue-50 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                                Human Resource Center
                            </Badge>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Manajemen{" "}
                            <span className="text-primary">Pegawai</span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-xl">
                            Kelola tim apotek Anda, pantau aktivitas, dan undang
                            anggota tim baru ke dalam sistem.
                        </p>
                    </div>

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

                <Tabs defaultValue="list" className="space-y-8">
                    <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl">
                        <TabsTrigger
                            value="list"
                            className="rounded-xl px-8 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
                        >
                            Daftar Pegawai
                        </TabsTrigger>
                        <TabsTrigger
                            value="activity"
                            className="rounded-xl px-8 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
                        >
                            Aktivitas Terbaru
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-6">
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
                                        {
                                            value: "inactive",
                                            label: "Non-Aktif",
                                        },
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
                                    className="h-11 px-6 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all gap-2 shadow-lg shadow-blue-900/10"
                                >
                                    <UserPlus className="w-4 h-4" /> Tambah
                                    Staff
                                </Button>
                            }
                        />

                        <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-slate-100/50">
                                            <TableHead className="py-6 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                Informasi Pegawai
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                Kontak
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {staff.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="h-96 text-center"
                                                >
                                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                                        <Users className="w-16 h-16 mb-4 opacity-10" />
                                                        <p className="text-sm font-black uppercase tracking-widest">
                                                            Data pegawai tidak
                                                            ditemukan
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            staff.data.map((item) => (
                                                <StaffTableRow
                                                    key={item.id}
                                                    staff={item}
                                                    onEdit={(s) =>
                                                        setFormDialog({
                                                            open: true,
                                                            data: s,
                                                        })
                                                    }
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
                            <div className="pt-4">
                                <Pagination links={staff.meta.links} />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="activity">
                        <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <Activity className="w-6 h-6 text-primary" />
                                    Log Aktivitas Tim
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50">
                                    {activityLogs.data?.map((log) => (
                                        <div
                                            key={log.id}
                                            className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {log.description}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                        {new Date(
                                                            log.created_at,
                                                        ).toLocaleString(
                                                            "id-ID",
                                                            {
                                                                dateStyle:
                                                                    "medium",
                                                                timeStyle:
                                                                    "short",
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-slate-200 text-slate-500"
                                            >
                                                {log.user.username}
                                            </Badge>
                                        </div>
                                    ))}
                                    {!activityLogs.data?.length && (
                                        <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                                            Belum ada aktivitas tercatat
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
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
                            Bagikan QR Code atau link ini kepada calon staff
                            baru Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        <div className="flex flex-col items-center gap-6">
                            <div className="p-4 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50">
                                <QRCodeSVG value={invitationUrl} size={180} />
                            </div>

                            <div className="w-full space-y-4">
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                                    <code className="flex-1 text-xs text-slate-600 font-bold truncate">
                                        {invitationUrl}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                invitationUrl,
                                            );
                                            toast.success(
                                                "Link berhasil disalin",
                                            );
                                        }}
                                        className="h-8 w-8 p-0 rounded-xl hover:bg-white text-primary shrink-0"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
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
                <DialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 mb-6">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                            Hapus Staff?
                        </h3>
                        <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
                            Akun staff{" "}
                            <span className="text-slate-900 font-black">
                                {deleteDialog.data?.user?.username}
                            </span>{" "}
                            akan dihapus secara permanen. Tindakan ini tidak
                            dapat dibatalkan.
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
                                onClick={handleDelete}
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
