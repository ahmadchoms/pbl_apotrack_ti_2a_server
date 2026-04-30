import { useState, useCallback, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export function useStaff(props) {
    const { staff, filters: serverFilters } = props;
    const [filters, setFilters] = useState({
        status: serverFilters?.status || "all",
    });
    const [searchQuery, setSearchQuery] = useState(serverFilters?.search || "");
    const [dialog, setDialog] = useState({
        formOpen: false,
        deleteOpen: false,
        selected: null,
    });

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== (serverFilters?.search || "")) {
                handleFilterChange({ search: searchQuery });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const normalizeParams = (params) => {
        return Object.fromEntries(
            Object.entries(params).filter(([key, value]) => {
                if (value == null) return false;
                if (typeof value === "string" && value.trim() === "")
                    return false;
                if (key === "status" && value === "all") return false;
                return true;
            }),
        );
    };

    const handleFilterChange = (newFilters) => {
        const rawParams = {
            search: searchQuery,
            ...filters,
            ...newFilters,
        };

        const params = normalizeParams(rawParams);

        router.get(route("pharmacy.staff.index", params), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleAction = useCallback((type, staff = null) => {
        setDialog((prev) => ({ ...prev, [type]: true, selected: staff }));
    }, []);

    const handleError = (errors) => {
        const firstError =
            Object.values(errors ?? {})[0] ?? "Terjadi kesalahan";
        toast.error("Gagal menyimpan", { description: firstError });
    };

    const handleSave = (data) => {
        const staffId = dialog.selected?.id;

        if (staffId) {
            router.put(route("pharmacy.staff.update", staffId), data, {
                onSuccess: () => {
                    toast.success("Staf berhasil diperbarui");
                    setDialog((p) => ({
                        ...p,
                        formOpen: false,
                        selected: null,
                    }));
                },
                onError: handleError,
            });
        } else {
            router.post(route("pharmacy.staff.store"), data, {
                onSuccess: () => {
                    toast.success("Staf berhasil ditambahkan");
                    setDialog((p) => ({ ...p, formOpen: false }));
                },
                onError: handleError,
            });
        }
    };

    const handleDelete = () => {
        const staffId = dialog.selected?.id;
        if (!staffId) return;

        router.delete(route("pharmacy.staff.destroy", staffId), {
            onSuccess: () => {
                toast.success("Staf berhasil dihapus");
                setDialog((p) => ({ ...p, deleteOpen: false, selected: null }));
            },
            onError: () => toast.error("Gagal menghapus staf"),
        });
    };

    return {
        filters,
        setFilters: (newFilters) => {
            if (typeof newFilters === "function") {
                const nextFilters = newFilters(filters);
                setFilters(nextFilters);
                handleFilterChange(nextFilters);
            } else {
                setFilters(newFilters);
                handleFilterChange(newFilters);
            }
        },
        searchQuery,
        setSearchQuery,
        dialog,
        setDialog,
        staffList: staff.data || [],
        pagination: staff,
        handleAction,
        handleSave,
        handleDelete,
    };
}
