import React, { useState } from "react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { UserTableRow } from "@/features/admin/components/users/UserTableRow";
import { SuspendUserDialog } from "@/features/admin/components/users/SuspendUserDialog";
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
import { User, UserPlus } from "lucide-react";
import { ROLE_CONFIG } from "@/features/admin/lib/constants";
import { router } from "@inertiajs/react";

export default function AdminUserList({ users, filters }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleFilter = (newFilters) => {
        router.get(
            route("admin.users.index"),
            { ...filters, ...newFilters, page: 1 },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleReset = () => {
        router.get(route("admin.users.index"), {}, { replace: true });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/users/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null),
            });
        }
    };

    const resetPassword = (user) => {
        if (
            confirm(
                `Apakah Anda yakin ingin mereset password user ${user.username} menjadi default (Apotrack2026!)?`,
            )
        ) {
            router.patch(`/admin/users/${user.id}/reset-password`);
        }
    };

    return (
        <DashboardAdminLayout activeMenu="users">
            <div className="space-y-8 pb-12">
                <PageHeader
                    subtitle="Pengawasan Ekosistem"
                    title="Manajemen Pengguna"
                />

                <FilterBar
                    configs={[
                        {
                            type: "search",
                            key: "search",
                            placeholder: "Cari username atau email...",
                        },
                        {
                            type: "select",
                            key: "role",
                            label: "Peran",
                            options: Object.entries(ROLE_CONFIG).map(
                                ([k, v]) => ({ value: k, label: v.label }),
                            ),
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
                                router.get(route("admin.users.create"))
                            }
                            className="h-11 px-6 rounded-2xl bg-[#0b3b60] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all gap-2 shadow-lg shadow-blue-900/20"
                        >
                            <UserPlus className="w-4 h-4" /> Tambah Pengguna
                        </Button>
                    }
                />

                <Card className="pt-0 rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100/50">
                                    <TableHead className="py-6 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Profil Pengguna
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Kontak
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Peran
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
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-96 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-slate-300">
                                                <User className="w-16 h-16 mb-4 opacity-10" />
                                                <p className="text-sm font-black uppercase tracking-widest">
                                                    Data pengguna tidak
                                                    ditemukan
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <UserTableRow
                                            key={user.id}
                                            user={user}
                                            onSuspend={setDeleteTarget}
                                            onResetPassword={resetPassword}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {users.data.length > 0 && (
                    <AdminPagination pagination={users} itemLabel="pengguna" />
                )}
            </div>

            <SuspendUserDialog
                user={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </DashboardAdminLayout>
    );
}
