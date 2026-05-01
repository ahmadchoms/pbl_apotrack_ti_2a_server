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
import { Input } from "@/components/ui/input";
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

export default function StaffPage({ staff, activityLogs, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
    const [invitationUrl, setInvitationUrl] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("pharmacy.staff.index"),
            { search },
            { preserveState: true },
        );
    };

    const handleToggleStatus = (staffId) => {
        router.patch(
            route("pharmacy.staff.toggle-status", staffId),
            {},
            {
                onSuccess: () =>
                    toast.success("Status staff berhasil diperbarui"),
            },
        );
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(invitationUrl);
        toast.success("Link berhasil disalin ke clipboard");
    };

    return (
        <DashboardPharmacyLayout activeMenu="Tim Apotek">
            <div className="pb-20 px-4">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 bg-blue-50 text-[#00346C] text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                Human Resource Center
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Manajemen{" "}
                            <span className="text-[#00346C]">Pegawai</span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-xl">
                            Kelola tim apotek Anda, pantau aktivitas
                            operasional, dan undang apoteker atau staf baru
                            melalui sistem undangan terenkripsi.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={generateInvitation}
                            disabled={isGenerating}
                            className="h-14 px-8 rounded-2xl bg-[#00346C] hover:bg-[#002a58] text-white font-black text-sm shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-0.5"
                        >
                            <QrCode className="w-5 h-5 mr-3" />
                            {isGenerating
                                ? "Generating..."
                                : "Generate Invitation"}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="list" className="space-y-8">
                    <TabsList className="bg-white p-1.5 rounded-[1.5rem] border border-slate-200/60 shadow-sm h-14">
                        <TabsTrigger
                            value="list"
                            className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-wider data-[state=active]:bg-[#00346C] data-[state=active]:text-white transition-all"
                        >
                            <Users className="w-4 h-4 mr-2" /> Daftar Pegawai
                        </TabsTrigger>
                        <TabsTrigger
                            value="logs"
                            className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-wider data-[state=active]:bg-[#00346C] data-[state=active]:text-white transition-all"
                        >
                            <Activity className="w-4 h-4 mr-2" /> Audit Log
                            Aktivitas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="mt-0 outline-none">
                        <Card className="rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <form
                                    onSubmit={handleSearch}
                                    className="relative w-full md:w-96"
                                >
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Cari nama atau email pegawai..."
                                        className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </form>
                            </div>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-slate-100">
                                            <TableHead className="py-5 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Pegawai
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Role
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Tanggal Bergabung
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-right pr-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {staff.data.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                                            >
                                                <TableCell className="py-5 pl-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs">
                                                            {item.user.username
                                                                .substring(0, 2)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">
                                                                {
                                                                    item.user
                                                                        .username
                                                                }
                                                            </p>
                                                            <p className="text-xs text-slate-500 font-medium">
                                                                {
                                                                    item.user
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-lg border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5"
                                                    >
                                                        {item.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span className="text-xs font-bold">
                                                            {item.created_at}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                            item.is_active
                                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                                : "bg-rose-50 text-rose-600 border-rose-100"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1 h-1 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-rose-500"}`}
                                                        />
                                                        {item.is_active
                                                            ? "Aktif"
                                                            : "Nonaktif"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                item.id,
                                                            )
                                                        }
                                                        className={`h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                            item.is_active
                                                                ? "text-rose-500 hover:bg-rose-50"
                                                                : "text-emerald-500 hover:bg-emerald-50"
                                                        }`}
                                                    >
                                                        {item.is_active ? (
                                                            <>
                                                                {" "}
                                                                <ToggleRight className="w-4 h-4 mr-2" />{" "}
                                                                Deactivate{" "}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {" "}
                                                                <ToggleLeft className="w-4 h-4 mr-2" />{" "}
                                                                Activate{" "}
                                                            </>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="logs" className="mt-0 outline-none">
                        <Card className="rounded-[2.5rem] border-slate-200/80 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                            <CardHeader className="p-8 border-b border-slate-50">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
                                    Riwayat Aktivitas Pegawai
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-slate-100">
                                            <TableHead className="py-5 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Waktu
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Pegawai
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Aksi
                                            </TableHead>
                                            <TableHead className="pr-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Keterangan
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activityLogs.data.map((log) => (
                                            <TableRow
                                                key={log.id}
                                                className="hover:bg-slate-50/50 transition-colors border-slate-100"
                                            >
                                                <TableCell className="py-5 pl-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-900">
                                                            {new Date(
                                                                log.created_at,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                            )}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {new Date(
                                                                log.created_at,
                                                            ).toLocaleTimeString(
                                                                "id-ID",
                                                            )}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs font-black text-slate-700">
                                                        {log.user?.username}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-slate-100 text-slate-600 border-0 text-[9px] font-black uppercase tracking-widest">
                                                        {log.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="pr-8">
                                                    <p className="text-xs font-medium text-slate-500">
                                                        {log.description}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog
                open={isInvitationModalOpen}
                onOpenChange={setIsInvitationModalOpen}
            >
                <DialogContent className="min-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] border-slate-100 shadow-2xl flex flex-col p-0">
                    <div className="p-8 overflow-y-auto flex-1">
                        <DialogHeader>
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#00346C] mb-4 shadow-inner">
                                <QrCode className="w-8 h-8" />
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                Undang Pegawai Baru
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                                QR Code dan Link di bawah ini valid selama 24
                                jam. Kirimkan kepada calon pegawai Anda untuk
                                melakukan registrasi mandiri.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-8 flex flex-col items-center">
                            <div className="p-6 bg-white rounded-[2rem] border-4 border-slate-50 shadow-2xl shadow-blue-900/10 mb-8">
                                {invitationUrl && (
                                    <QRCodeSVG
                                        value={invitationUrl}
                                        size={180}
                                        level="H"
                                    />
                                )}
                            </div>

                            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">
                                    Invitation Link
                                </p>

                                <div className="bg-white rounded-xl p-3 border border-slate-200">
                                    <p className="text-xs font-mono text-[#00346C] line-clamp-3 break-all">
                                        {invitationUrl}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        Salin Link
                                    </span>

                                    <Button
                                        size="sm"
                                        className="h-9 rounded-xl bg-[#00346C] hover:bg-[#002a58] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                        onClick={copyToClipboard}
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        Copy
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-slate-100">
                        <div className="space-y-3 w-full">
                            <Button
                                className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest"
                                onClick={() =>
                                    window.open(
                                        `https://wa.me/?text=${encodeURIComponent(
                                            "Halo, silakan klik link berikut untuk bergabung sebagai staf di apotek kami: " +
                                                invitationUrl,
                                        )}`,
                                        "_blank",
                                    )
                                }
                            >
                                Bagikan via WhatsApp
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full h-12 rounded-xl font-bold text-slate-400 border-slate-200 hover:bg-slate-100"
                                onClick={() => setIsInvitationModalOpen(false)}
                            >
                                Tutup
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardPharmacyLayout>
    );
}
