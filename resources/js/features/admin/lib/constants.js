import {
    LogIn,
    Info,
    ShieldAlert,
    Building2,
    XCircle,
    FileText,
    UserPlus,
    ShieldCheck,
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
};

export const listItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── User Role Config ─────────────────────────────────────────────────
export const ROLE_CONFIG = {
    USER: {
        label: "PENGGUNA",
        variant: "secondary",
        class: "bg-blue-50 text-blue-600 border-blue-100",
    },
    STAFF: {
        label: "STAFF",
        variant: "outline",
        class: "bg-slate-50 text-slate-600 border-slate-200",
    },
    APOTEKER: {
        label: "APOTEKER",
        variant: "default",
        class: "bg-[#0b3b60] text-white border-0",
    },
    SUPER_ADMIN: {
        label: "ADMIN",
        variant: "destructive",
        class: "bg-amber-50 text-amber-600 border-amber-200",
    },
};

// ─── User Status Config ───────────────────────────────────────────────
export const USER_STATUS_CONFIG = {
    active: {
        label: "TERVERIFIKASI",
        dot: "bg-emerald-500",
        text: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    inactive: {
        label: "TERTUNDA",
        dot: "bg-rose-500",
        text: "text-rose-600",
        badge: "bg-rose-50 text-rose-600 border-rose-100",
    },
};

// ─── Pharmacy Verification Config ─────────────────────────────────────
export const VERIFICATION_CONFIG = {
    VERIFIED: {
        label: "Terverifikasi",
        dot: "bg-emerald-400",
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    },
    PENDING: {
        label: "Menunggu",
        dot: "bg-amber-400",
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    REJECTED: {
        label: "Ditolak",
        dot: "bg-rose-400",
        badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    },
};

export const VERIFICATION_OPTIONS = [
    { value: "PENDING", label: "Menunggu" },
    { value: "VERIFIED", label: "Terverifikasi" },
    { value: "REJECTED", label: "Ditolak" },
];

// ─── Audit Log Config ─────────────────────────────────────────────────
export const ACTION_ICONS = {
    LOGIN: LogIn,
    PROFILE_UPDATE: Info,
    PASSWORD_CHANGE: ShieldAlert,
    PHARMACY_CREATE: Building2,
    USER_DELETE: XCircle,
    DEFAULT: FileText,
};

export const ACTION_COLORS = {
    LOGIN: "text-blue-500 bg-blue-50",
    PROFILE_UPDATE: "text-emerald-500 bg-emerald-50",
    PASSWORD_CHANGE: "text-amber-500 bg-amber-50",
    PHARMACY_CREATE: "text-indigo-500 bg-indigo-50",
    USER_DELETE: "text-rose-500 bg-rose-50",
    DEFAULT: "text-slate-500 bg-slate-50",
};

// ─── Operating Hours ──────────────────────────────────────────────────
export const DAY_NAMES = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
];
export const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const INITIAL_HOURS = DAY_NAMES.map((_, i) => ({
    day_of_week: i,
    open_time: "08:00",
    close_time: "22:00",
    is_closed: false,
    is_24_hours: false,
}));
