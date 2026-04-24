import { useState, useCallback, useEffect } from "react";
import { router } from "@inertiajs/react";

export function useStaff(props) {
    const { staff, filters: serverFilters } = props;
    const [filters, setFilters] = useState({ 
        status: serverFilters?.status || "all" 
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

    const handleFilterChange = (newFilters) => {
        const params = {
            search: searchQuery,
            status: filters.status,
            ...newFilters,
        };

        // Remove empty/default values
        if (params.search === "") delete params.search;
        if (params.status === "all") delete params.status;

        router.get("/pharmacy/staff", params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleAction = useCallback((type, staff = null) => {
        setDialog((prev) => ({ ...prev, [type]: true, selected: staff }));
    }, []);

    const handleSave = (data) => {
        if (dialog.selected) {
            router.put(`/pharmacy/staff/${dialog.selected.id}`, data, {
                onSuccess: () => {
                    setDialog((p) => ({ ...p, formOpen: false, selected: null }));
                },
            });
        } else {
            router.post("/pharmacy/staff", data, {
                onSuccess: () => {
                    setDialog((p) => ({ ...p, formOpen: false }));
                },
            });
        }
    };

    const handleDelete = () => {
        if (!dialog.selected) return;
        
        router.delete(`/pharmacy/staff/${dialog.selected.id}`, {
            onSuccess: () => {
                setDialog((p) => ({ ...p, deleteOpen: false, selected: null }));
            },
        });
    };

    return {
        filters,
        setFilters: (newFilters) => {
            if (typeof newFilters === 'function') {
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

