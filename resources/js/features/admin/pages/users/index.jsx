import React from "react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { UserFilters } from "@/features/admin/components/users/UserFilters";
import { UserTable } from "@/features/admin/components/users/UserTable";
import { SuspendUserDialog } from "@/features/admin/components/users/SuspendUserDialog";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";
import { useUserManagement } from "@/features/admin/hooks/useUserManagement";

import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export default function AdminUserList(props) {
    const {
        search,
        setSearch,
        role,
        setRole,
        status,
        setStatus,
        deleteTarget,
        setDeleteTarget,
        handleFilter,
        confirmDelete,
        resetPassword,
        userList,
        pagination,
    } = useUserManagement(props);

    return (
        <DashboardAdminLayout activeMenu="users">
            <div className="space-y-8 pb-12">
                <PageHeader
                    subtitle="Pengawasan Ekosistem"
                    title="Manajemen Pengguna"
                />
                <UserFilters
                    search={search}
                    setSearch={setSearch}
                    role={role}
                    setRole={setRole}
                    status={status}
                    setStatus={setStatus}
                    onFilter={handleFilter}
                />
                <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                    <CardContent className="p-0">
                        <UserTable
                            users={userList}
                            onDelete={setDeleteTarget}
                            onResetPassword={resetPassword}
                        />
                    </CardContent>
                </Card>
                <AdminPagination pagination={pagination} itemLabel="pengguna" />
            </div>
            <SuspendUserDialog
                user={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </DashboardAdminLayout>
    );
}
