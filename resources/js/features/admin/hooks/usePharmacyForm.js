import { useState, useMemo } from "react";
import { DAY_NAMES, INITIAL_HOURS } from "../lib/constants";

export function usePharmacyForm({ initialData = {}, availableStaff = [] }) {
    const [staffSearch, setStaffSearch] = useState("");

    // Build initial hours from existing data or defaults
    const buildInitialHours = () => {
        if (!initialData.hours || initialData.hours.length === 0) return INITIAL_HOURS;
        return DAY_NAMES.map((_, i) => {
            const existing = initialData.hours.find((h) => h.day_of_week === i);
            return existing
                ? { ...existing, open_time: existing.open_time?.slice(0, 5) || "08:00", close_time: existing.close_time?.slice(0, 5) || "22:00" }
                : INITIAL_HOURS[i];
        });
    };

    // Build initial staffs from existing data
    const buildInitialStaffs = () => {
        if (!initialData.staffs || initialData.staffs.length === 0) return [];
        return initialData.staffs.map((s) => ({
            user_id: s.user_id,
            role: s.role,
            user_data: s.user,
        }));
    };

    const [hours, setHours] = useState(buildInitialHours);
    const [staffs, setStaffs] = useState(buildInitialStaffs);

    const handleHourChange = (dayIndex, field, value) => {
        setHours((prev) => prev.map((h) => (h.day_of_week === dayIndex ? { ...h, [field]: value } : h)));
    };

    const addStaff = (user) => {
        if (staffs.find((s) => s.user_id === user.id)) return;
        setStaffs((prev) => [
            ...prev,
            { user_id: user.id, role: user.role === "APOTEKER" ? "APOTEKER" : "STAFF", user_data: user },
        ]);
        setStaffSearch("");
    };

    const removeStaff = (userId) => {
        setStaffs((prev) => prev.filter((s) => s.user_id !== userId));
    };

    const updateStaffRole = (userId, role) => {
        setStaffs((prev) => prev.map((s) => (s.user_id === userId ? { ...s, role } : s)));
    };

    const filteredAvailableStaff = useMemo(() => {
        return availableStaff.filter(
            (user) =>
                !staffs.find((s) => s.user_id === user.id) &&
                (user.username.toLowerCase().includes(staffSearch.toLowerCase()) ||
                    user.email.toLowerCase().includes(staffSearch.toLowerCase()))
        );
    }, [availableStaff, staffs, staffSearch]);

    return {
        hours, setHours, handleHourChange,
        staffs, setStaffs, addStaff, removeStaff, updateStaffRole,
        staffSearch, setStaffSearch,
        filteredAvailableStaff,
    };
}
