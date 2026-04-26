import React from "react";
import { DashboardAdminLayout } from "@/layouts/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/features/admin/components/shared/PageHeader";
import { UserFilters } from "@/features/admin/components/users/UserFilters";
import { UserTable } from "@/features/admin/components/users/UserTable";
import { DeleteUserDialog } from "@/features/admin/components/users/DeleteUserDialog";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";
import { useUserManagement } from "@/features/admin/hooks/useUserManagement";

export default function AdminUserList(props) {
    const {
        search, setSearch, role, setRole, status, setStatus,
        deleteTarget, setDeleteTarget, handleFilter, confirmDelete,
        userList, pagination,
    } = useUserManagement(props);

    return (
        <DashboardAdminLayout activeMenu="users">
            <div className="space-y-8 pb-12">
                <PageHeader subtitle="Pengawasan Ekosistem" title="Manajemen Pengguna" />
                <UserFilters search={search} setSearch={setSearch} role={role} setRole={setRole} status={status} setStatus={setStatus} onFilter={handleFilter} />
                <Card className="rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white">
                    <CardContent className="p-0">
                        <UserTable users={userList} onDelete={setDeleteTarget} />
                    </CardContent>
                </Card>
                <AdminPagination pagination={pagination} itemLabel="pengguna" />
            </div>
            <DeleteUserDialog user={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
        </DashboardAdminLayout>
    );
}
