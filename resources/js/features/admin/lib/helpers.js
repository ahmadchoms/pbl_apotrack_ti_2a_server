import { DAY_LABELS } from "./constants";

/**
 * Format a date string to localized short date (e.g., "26 Apr 2026")
 */
export function formatDate(dateString) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(dateString));
}

/**
 * Format a date string to localized time (e.g., "07.06")
 */
export function formatTime(dateString) {
    return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateString));
}

/**
 * Format a date string to relative time (e.g., "5 menit lalu")
 */
export function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "Baru saja";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(date);
}

/**
 * Get today's operating status label from a pharmacy's hours array.
 */
export function getOperatingLabel(hours) {
    if (!hours || hours.length === 0) return { text: "Belum diatur", sub: "" };
    const today = new Date().getDay();
    const todayHour = hours.find((h) => h.day_of_week === today);
    if (!todayHour || todayHour.is_closed) return { text: "Tutup Hari Ini", sub: DAY_LABELS[today] };
    if (todayHour.is_24_hours) return { text: "Buka 24 Jam", sub: DAY_LABELS[today] };
    const open = todayHour.open_time?.slice(0, 5) || "08:00";
    const close = todayHour.close_time?.slice(0, 5) || "22:00";
    return { text: `${open} – ${close}`, sub: DAY_LABELS[today] };
}

/**
 * Determine a pharmacy's live status based on is_active, is_force_closed, and operating hours.
 */
export function getPharmacyStatus(pharmacy) {
    if (!pharmacy.is_active) return "inactive";
    if (pharmacy.is_force_closed) return "force_closed";
    const label = getOperatingLabel(pharmacy.hours);
    if (label.text === "Tutup Hari Ini") return "closed_today";
    return "open";
}
