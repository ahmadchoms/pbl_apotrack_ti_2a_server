import { useState } from "react";
import { router } from "@inertiajs/react";

export function useUserManagement({ users, filters: serverFilters }) {
    const [search, setSearch] = useState(serverFilters?.search || "");
    const [role, setRole] = useState(serverFilters?.role || "all");
    const [status, setStatus] = useState(serverFilters?.status || "all");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleFilter = (overrides = {}) => {
        const params = { search, role, status, ...overrides };
        if (params.search === "") delete params.search;
        if (params.role === "all") delete params.role;
        if (params.status === "all") delete params.status;
        router.get("/admin/users", params, { preserveState: true, replace: true });
    };

    const onPageChange = (url) => {
        if (url) router.get(url, { search, role, status }, { preserveState: true });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/users/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null),
            });
        }
    };

    const resetPassword = (user) => {
        if (confirm(`Apakah Anda yakin ingin mereset password user ${user.username} menjadi default (Apotrack2026!)?`)) {
            router.patch(`/admin/users/${user.id}/reset-password`);
        }
    };

    return {
        search, setSearch,
        role, setRole,
        status, setStatus,
        deleteTarget, setDeleteTarget,
        handleFilter,
        onPageChange,
        confirmDelete,
        resetPassword,
        userList: users?.data || [],
        pagination: users,
    };
}
