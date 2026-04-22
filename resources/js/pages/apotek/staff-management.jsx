import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserPlus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Filter,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Clock,
    X,
    Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { DashboardApotekLayout } from "@/layouts/apotek-layout";

// ─── DATA DUMMY ────────────────────────────────────────────────────────────────
const dummyStaff = [
    { id: 1, name: "Dr. Dian Rahayu",  role: "Senior Practitioner", phone: "08123456789", status: "verified", avatar: "DR" },
    { id: 2, name: "Bambang Susanto",  role: "Pharmacist",          phone: "08234567890", status: "verified", avatar: "BS" },
    { id: 3, name: "Siti Permata",     role: "Nurse Admin",         phone: "08345678901", status: "pending",  avatar: "SP" },
    { id: 4, name: "Rizky Pratama",    role: "Cashier",             phone: "08456789012", status: "verified", avatar: "RP" },
    { id: 5, name: "Maya Lestari",     role: "Pharmacist",          phone: "08567890123", status: "pending",  avatar: "ML" },
    { id: 6, name: "Hendra Gunawan",   role: "Senior Practitioner", phone: "08678901234", status: "verified", avatar: "HG" },
];

// ─── ANIMASI ───────────────────────────────────────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const rowVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    if (status === "verified") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Terverifikasi
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Tertunda
        </span>
    );
}

// ─── MODAL TAMBAH / EDIT STAFF ─────────────────────────────────────────────────
function StaffFormDialog({ open, onClose, editData }) {
    const isEdit = !!editData;
    const [form, setForm] = useState(
        editData || { name: "", role: "", phone: "", status: "pending" }
    );

    React.useEffect(() => {
        setForm(editData || { name: "", role: "", phone: "", status: "pending" });
    }, [editData, open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="rounded-2xl max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-800">
                        {isEdit ? "Edit Staff" : "Tambah Staff Baru"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                            Nama Lengkap
                        </label>
                        <Input
                            placeholder="Contoh: Dr. Budi Santoso"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="rounded-xl border-slate-200 focus-visible:ring-[#0b3b60]"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                            Jabatan / Role
                        </label>
                        <Select
                            value={form.role}
                            onValueChange={(val) => setForm({ ...form, role: val })}
                        >
                            <SelectTrigger className="rounded-xl border-slate-200 focus:ring-[#0b3b60]">
                                <SelectValue placeholder="Pilih jabatan..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="Senior Practitioner">Senior Practitioner</SelectItem>
                                <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                                <SelectItem value="Nurse Admin">Nurse Admin</SelectItem>
                                <SelectItem value="Cashier">Cashier</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                            No. Telepon
                        </label>
                        <Input
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="rounded-xl border-slate-200 focus-visible:ring-[#0b3b60]"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                            Status
                        </label>
                        <Select
                            value={form.status}
                            onValueChange={(val) => setForm({ ...form, status: val })}
                        >
                            <SelectTrigger className="rounded-xl border-slate-200 focus:ring-[#0b3b60]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="verified">Terverifikasi</SelectItem>
                                <SelectItem value="pending">Tertunda</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-slate-200 text-slate-600"
                    >
                        <X className="w-4 h-4 mr-1" /> Batal
                    </Button>
                    <Button
                        onClick={onClose}
                        className="rounded-xl bg-[#0b3b60] hover:bg-[#082a45] text-white"
                    >
                        <Check className="w-4 h-4 mr-1" />
                        {isEdit ? "Simpan Perubahan" : "Tambah Staff"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── MODAL KONFIRMASI HAPUS ────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, staffName }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="rounded-2xl max-w-sm text-center">
                <div className="flex flex-col items-center gap-3 py-4">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-red-500" />
                    </div>
                    <DialogTitle className="text-lg font-bold text-slate-800">
                        Hapus Staff?
                    </DialogTitle>
                    <p className="text-sm text-slate-500">
                        Yakin ingin menghapus{" "}
                        <span className="font-bold text-slate-700">{staffName}</span>?
                        Tindakan ini tidak bisa dibatalkan.
                    </p>
                </div>
                <DialogFooter className="gap-2 sm:justify-center pb-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-slate-200"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={onClose}
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                    >
                        Ya, Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── HALAMAN UTAMA ─────────────────────────────────────────────────────────────
export default function StaffManagementPage() {
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const ROWS_PER_PAGE = 5;

    // ── Filter gabungan status + role ──
    const filtered = dummyStaff.filter((s) => {
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        const matchRole = roleFilter === "all" || s.role === roleFilter;
        return matchStatus && matchRole;
    });

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    function handleEdit(staff) {
        setEditData(staff);
        setFormOpen(true);
    }

    function handleDeleteClick(staff) {
        setDeleteTarget(staff);
        setDeleteOpen(true);
    }

    return (
        <DashboardApotekLayout activeMenu="Manajemen Staff">
            <div className="max-w-7xl mx-auto">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-slate-800">
                        Manajemen Staff
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Kelola data, peran, dan status akun seluruh staff apotek.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">

                        {/* ── Toolbar ── */}
                        <CardContent className="px-8 pt-6 pb-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-wrap">

                                    {/* Filter Peran (Filter Lanjutan) */}
                                    <Select
                                        value={roleFilter}
                                        onValueChange={(v) => {
                                            setRoleFilter(v);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-[190px] h-10 rounded-xl border-slate-200 text-slate-600 text-sm bg-slate-50 focus:ring-[#0b3b60]">
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <SelectValue placeholder="Peran: Semua" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="all">Peran: Semua</SelectItem>
                                            <SelectItem value="Senior Practitioner">Senior Practitioner</SelectItem>
                                            <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                                            <SelectItem value="Nurse Admin">Nurse Admin</SelectItem>
                                            <SelectItem value="Cashier">Cashier</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Filter Status */}
                                    <Select
                                        value={statusFilter}
                                        onValueChange={(v) => {
                                            setStatusFilter(v);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-[160px] h-10 rounded-xl border-slate-200 text-slate-600 text-sm bg-slate-50 focus:ring-[#0b3b60]">
                                            <SelectValue placeholder="Status: Semua" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="all">Status: Semua</SelectItem>
                                            <SelectItem value="verified">Terverifikasi</SelectItem>
                                            <SelectItem value="pending">Tertunda</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Indikator filter aktif */}
                                    {(roleFilter !== "all" || statusFilter !== "all") && (
                                        <button
                                            onClick={() => {
                                                setRoleFilter("all");
                                                setStatusFilter("all");
                                                setCurrentPage(1);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors"
                                        >
                                            <X className="w-3 h-3" /> Reset Filter
                                        </button>
                                    )}
                                </div>

                                <Button
                                    onClick={() => { setEditData(null); setFormOpen(true); }}
                                    className="rounded-xl bg-[#0b3b60] hover:bg-[#082a45] text-white h-10 px-5 font-semibold shadow-md shadow-[#0b3b60]/20"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Tambah Staff Baru
                                </Button>
                            </div>
                        </CardContent>

                        {/* ── Tabel ── */}
                        <div className="px-8 pb-2">
                            {/* Header kolom */}
                            <div className="grid grid-cols-[2fr_2fr_1fr_48px] gap-4 px-4 py-2 border-b border-slate-100">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Nama Staff
                                </span>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    No. Telepon
                                </span>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Status
                                </span>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                                    Aksi
                                </span>
                            </div>

                            {/* Baris data */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="divide-y divide-slate-50"
                            >
                                <AnimatePresence mode="wait">
                                    {paginated.length === 0 ? (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-16 text-center"
                                        >
                                            <p className="text-slate-400 text-sm">
                                                Tidak ada staff yang sesuai filter.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        paginated.map((staff) => (
                                            <motion.div
                                                key={staff.id}
                                                variants={rowVariants}
                                                layout
                                                className="grid grid-cols-[2fr_2fr_1fr_48px] gap-4 items-center px-4 py-4 hover:bg-slate-50/70 rounded-2xl transition-colors group"
                                            >
                                                {/* Nama + Avatar */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-slate-100">
                                                        <AvatarImage
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.avatar}&backgroundColor=e2e8f0`}
                                                        />
                                                        <AvatarFallback className="bg-[#0b3b60] text-white text-xs font-bold">
                                                            {staff.avatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-800 truncate">
                                                            {staff.name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 font-medium truncate">
                                                            {staff.role}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* No. Telepon */}
                                                <p className="text-sm text-slate-500 truncate">
                                                    {staff.phone}
                                                </p>

                                                {/* Status */}
                                                <StatusBadge status={staff.status} />

                                                {/* Aksi */}
                                                <div className="flex justify-end">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                                                                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-36 rounded-xl p-1.5" align="end">
                                                            <button
                                                                onClick={() => handleEdit(staff)}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#0b3b60] rounded-lg font-medium transition-colors"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(staff)}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                                                            </button>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* ── Pagination ── */}
                        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-50">
                            <p className="text-[13px] text-slate-400 font-medium">
                                Showing{" "}
                                {paginated.length === 0
                                    ? 0
                                    : (currentPage - 1) * ROWS_PER_PAGE + 1}
                                –{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of{" "}
                                {filtered.length} Staff
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                                            currentPage === page
                                                ? "bg-[#0b3b60] text-white shadow-sm"
                                                : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* ── Dialogs ── */}
            <StaffFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                editData={editData}
            />
            <DeleteDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                staffName={deleteTarget?.name}
            />
        </DashboardApotekLayout>
    );
}
