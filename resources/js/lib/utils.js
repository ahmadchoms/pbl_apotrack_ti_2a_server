import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DAY_NAMES } from "./constants";
import { AlertTriangle, XCircle } from "lucide-react";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatRupiah(amount) {
    return `Rp ${Number(amount).toLocaleString("id-ID")}`;
}

export function formatTime(dateStr) {
    return (
        new Date(dateStr).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        }) + " WIB"
    );
}

export function getTodaySchedule(operating_hours) {
    const today = new Date().getDay(); // 0 = Minggu
    const normalizedDay = today === 0 ? 7 : today;

    return operating_hours.find((item) => item.day_of_week === normalizedDay);
}

export function getPharmacyStatus(pharmacy) {
    if (!pharmacy.is_active) {
        return {
            label: "Nonaktif",
            description: "Apotek tidak aktif",
            variant: "inactive",
            icon: XCircle,
        };
    }

    if (pharmacy.is_force_closed) {
        return {
            label: "Tutup Sementara",
            description: "Ditutup sementara oleh pengelola",
            variant: "force_closed",
            icon: AlertTriangle,
        };
    }

    const todayIndex = new Date().getDay() || 7; // 1=Mon ... 7=Sun
    const todayHours = pharmacy.operating_hours.find(
        (h) => h.day_of_week === todayIndex,
    );

    if (!todayHours || todayHours.is_closed) {
        return {
            label: "Tutup Hari Ini",
            description: `Tidak beroperasi hari ${DAY_NAMES[todayIndex]}`,
            variant: "closed",
            icon: XCircle,
        };
    }

    if (todayHours.is_24_hours) {
        return {
            label: "Buka 24 Jam",
            description: "Melayani sepanjang hari",
            variant: "open_24h",
            icon: Moon,
        };
    }

    return {
        label: "Buka",
        description: `${todayHours.open_time} – ${todayHours.close_time}`,
        variant: "open",
        icon: CheckCircle2,
    };
}

export function getHoursSummary(operatingHours) {
    const allOpen = operatingHours.filter((h) => !h.is_closed);
    if (!allOpen.length) return "Tidak ada jam operasional";
    if (allOpen.every((h) => h.is_24_hours)) return "Setiap hari 24 jam";
    const unique = [
        ...new Set(
            allOpen
                .filter((h) => h.open_time)
                .map((h) => `${h.open_time}–${h.close_time}`),
        ),
    ];
    return unique.join(", ") || "-";
}
