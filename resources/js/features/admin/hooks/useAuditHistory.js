import { useState } from "react";
import { router } from "@inertiajs/react";

export function useAuditHistory({ logs, filters: serverFilters, actionTypes: serverActionTypes = [] }) {
    const [search, setSearch] = useState(serverFilters?.search || "");
    const [status, setStatus] = useState(serverFilters?.status || "all");
    const [actionType, setActionType] = useState(serverFilters?.action_type || "all");
    const [dateFrom, setDateFrom] = useState(serverFilters?.date_from || "");
    const [dateTo, setDateTo] = useState(serverFilters?.date_to || "");

    const handleFilter = () => {
        router.get(route("admin.profile.audit-history"), {
            search, status,
            action_type: actionType,
            date_from: dateFrom,
            date_to: dateTo,
        }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch("");
        setStatus("all");
        setActionType("all");
        setDateFrom("");
        setDateTo("");
        router.get(route("admin.profile.audit-history"));
    };

    return {
        search, setSearch,
        status, setStatus,
        actionType, setActionType,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        handleFilter,
        resetFilters,
        logList: logs?.data || [],
        pagination: logs,
        actionTypes: serverActionTypes,
    };
}
