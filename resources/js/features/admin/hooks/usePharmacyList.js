import { useState } from "react";
import { router } from "@inertiajs/react";

export function usePharmacyList({ pharmacies, filters: serverFilters }) {
    const [search, setSearch] = useState(serverFilters?.search || "");
    const [status, setStatus] = useState(serverFilters?.status || "all");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleFilter = (overrides = {}) => {
        const params = { search, status, ...overrides };
        if (params.search === "") delete params.search;
        if (params.status === "all") delete params.status;
        router.get("/admin/pharmacies", params, { preserveState: true, replace: true });
    };

    const onPageChange = (url) => {
        if (url) router.get(url, { search, status }, { preserveState: true });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(`/admin/pharmacies/${deleteTarget.id}`, {
                onSuccess: () => setDeleteTarget(null),
            });
        }
    };

    return {
        search, setSearch,
        status, setStatus,
        deleteTarget, setDeleteTarget,
        handleFilter,
        onPageChange,
        confirmDelete,
        pharmacyList: pharmacies?.data || [],
        pagination: pharmacies,
    };
}
