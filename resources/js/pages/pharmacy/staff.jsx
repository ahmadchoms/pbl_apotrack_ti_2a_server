import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserPlus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Search,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { DashboardPharmacyLayout } from "@/layouts/pharmacy-layout";
import { staff as initialStaffData } from "@/data/staffs";

const ROWS_PER_PAGE = 5;

const ANIMATION = {
    container: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    },
    row: {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -10 },
    },
};

/**
 * Mendapatkan inisial dari nama user untuk avatar fallback
 */
const getInitials = (name) => {
    if (!name) return "??";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const StaffFormDialog = ({ open, onClose, onSave, initialData }) => {
    const isEdit = !!initialData;
    const [form, setForm] = useState({
        role: "STAFF",
        user: { username: "", email: "", phone: "", is_active: true },
    });

    React.useEffect(() => {
        if (open) {
            setForm(
                initialData || {
                    role: "STAFF",
                    user: {
                        username: "",
                        email: "",
                        phone: "",
                        is_active: true,
                    },
                },
            );
        }
    }, [initialData, open]);

    const handleUpdateUser = (field, value) => {
        setForm((prev) => ({
            ...prev,
            user: { ...prev.user, [field]: value },
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Perbarui Data Staff" : "Tambah Staff Baru"}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Nama Lengkap
                        </label>
                        <Input
                            value={form.user.username}
                            onChange={(e) =>
                                handleUpdateUser("username", e.target.value)
                            }
                            placeholder="Nama staff..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={form.user.email}
                            onChange={(e) =>
                                handleUpdateUser("email", e.target.value)
                            }
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Nomor Telepon
                        </label>
                        <Input
                            type="tel"
                            value={form.user.phone}
                            onChange={(e) =>
                                handleUpdateUser("phone", e.target.value)
                            }
                            placeholder="081234567890"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Status Akun
                        </label>
                        <Select
                            value={form.user.is_active ? "active" : "inactive"}
                            onValueChange={(val) =>
                                handleUpdateUser("is_active", val === "active")
                            }
                        >
                            <SelectTrigger className="w-full border border-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">
                                    Nonaktif
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        onClick={() => {
                            onSave(form);
                            onClose();
                        }}
                        className="bg-primary"
                    >
                        <Check className="w-4 h-4 mr-2" /> Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function StaffManagementPage() {
    const [staffData, setStaffData] = useState(initialStaffData);
    const [filters, setFilters] = useState({ role: "all", status: "all" });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [dialog, setDialog] = useState({
        formOpen: false,
        deleteOpen: false,
        selected: null,
    });

    const filteredStaff = useMemo(() => {
        return staffData.filter((s) => {
            const statusMatch =
                filters.status === "all" ||
                (filters.status === "active"
                    ? s.user.is_active
                    : !s.user.is_active);

            const searchMatch =
                searchQuery === "" ||
                s.user.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                s.user.email.toLowerCase().includes(searchQuery.toLowerCase());

            return statusMatch && searchMatch;
        });
    }, [staffData, filters, searchQuery]);

    const paginatedStaff = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return filteredStaff.slice(start, start + ROWS_PER_PAGE);
    }, [filteredStaff, currentPage]);

    const totalPages = Math.ceil(filteredStaff.length / ROWS_PER_PAGE);

    const handleAction = useCallback((type, staff = null) => {
        setDialog((prev) => ({ ...prev, [type]: true, selected: staff }));
    }, []);

    const handleSave = (data) => {
        if (dialog.selected) {
            setStaffData((prev) =>
                prev.map((item) => (item.id === data.id ? data : item)),
            );
        } else {
            setStaffData((prev) => [
                { ...data, id: crypto.randomUUID() },
                ...prev,
            ]);
        }
    };

    const handleDelete = () => {
        setStaffData((prev) =>
            prev.filter((item) => item.id !== dialog.selected?.id),
        );
        setDialog((p) => ({ ...p, deleteOpen: false, selected: null }));
    };

    return (
        <DashboardPharmacyLayout activeMenu="Manajemen Staff">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Manajemen Staff
                        </h2>
                        <p className="text-sm text-slate-500">
                            Kelola kredensial dan hak akses tim apotek Anda.
                        </p>
                    </div>
                    <Button
                        onClick={() => handleAction("formOpen")}
                        className="bg-primary hover:bg-primary/90 px-6 rounded-xl shadow-lg shadow-blue-900/10"
                    >
                        <UserPlus className="w-4 h-4 mr-2" /> Tambah Staff Baru
                    </Button>
                </header>

                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="p-6 border-b border-slate-50 flex flex-wrap gap-3">
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Cari nama atau email..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-9 bg-slate-50 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-slate-300 shadow-sm"
                                />
                            </div>

                            <Select
                                value={filters.status}
                                onValueChange={(v) => {
                                    setFilters((p) => ({ ...p, status: v }));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[150px] bg-slate-50 border-none rounded-xl text-slate-600">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-50 rounded-xl shadow-sm">
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Aktif
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Nonaktif
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {(filters.role !== "all" ||
                                filters.status !== "all") && (
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        setFilters({
                                            role: "all",
                                            status: "all",
                                        })
                                    }
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-3"
                                >
                                    <X className="w-4 h-4 mr-1" /> Reset
                                </Button>
                            )}
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-100 hover:bg-transparent bg-slate-50/60">
                                    <TableHead className="w-[300px] pl-6 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                                        Informasi Staff
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                                        Kontak
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                                        Status Akun
                                    </TableHead>
                                    <TableHead className="text-right pr-6 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {paginatedStaff.map((staff) => (
                                        <motion.tr
                                            key={staff.id}
                                            variants={ANIMATION.row}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                            className="group border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                                        >
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 ring-1 ring-slate-200 shadow-sm">
                                                        <AvatarImage
                                                            src={
                                                                staff.user
                                                                    .avatar_url
                                                            }
                                                            alt={
                                                                staff.user
                                                                    .username
                                                            }
                                                        />
                                                        <AvatarFallback className="bg-primary text-white text-[11px] font-medium">
                                                            {getInitials(
                                                                staff.user
                                                                    .username,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-800 text-sm">
                                                            {
                                                                staff.user
                                                                    .username
                                                            }
                                                        </span>
                                                        <span className="text-xs text-slate-500 font-medium">
                                                            {staff.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm text-slate-700 font-medium">
                                                        {staff.user.email}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {staff.user.phone ||
                                                            "Belum ada nomor"}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`rounded-full px-3 py-1 text-[11px] font-semibold border-none ${
                                                        staff.user.is_active
                                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                                            : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    {staff.user.is_active
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 rounded-full transition-opacity focus:opacity-100 data-[state=open]:opacity-100"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="rounded-xl w-36 shadow-md border-slate-100"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleAction(
                                                                    "formOpen",
                                                                    staff,
                                                                )
                                                            }
                                                            className="cursor-pointer gap-2.5 text-slate-600 font-medium py-2"
                                                        >
                                                            <Pencil className="w-4 h-4" />{" "}
                                                            Edit Data
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleAction(
                                                                    "deleteOpen",
                                                                    staff,
                                                                )
                                                            }
                                                            className="cursor-pointer gap-2.5 text-red-600 font-medium py-2 focus:text-red-700 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />{" "}
                                                            Hapus Akun
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>

                        {filteredStaff.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-slate-400 text-sm font-medium">
                                    Data staff tidak ditemukan.
                                </p>
                            </div>
                        )}

                        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                                Menampilkan {paginatedStaff.length} dari{" "}
                                {filteredStaff.length} staff
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <Button
                                            key={i}
                                            variant={
                                                currentPage === i + 1
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className={`h-8 w-8 rounded-lg text-xs font-bold ${currentPage === i + 1 ? "bg-primary" : ""}`}
                                            onClick={() =>
                                                setCurrentPage(i + 1)
                                            }
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg"
                                    disabled={
                                        currentPage === totalPages ||
                                        totalPages === 0
                                    }
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
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
