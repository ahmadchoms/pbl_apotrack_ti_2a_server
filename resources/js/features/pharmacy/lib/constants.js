import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

export const CATEGORY_COLORS = {
    Antibiotik: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        dot: "bg-red-500",
    },
    Analgesik: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        dot: "bg-orange-500",
    },
    Antipiretik: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        dot: "bg-amber-500",
    },
    Antihipertensi: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        dot: "bg-yellow-500",
    },
    Antidiabetes: {
        bg: "bg-lime-50",
        text: "text-lime-700",
        border: "border-lime-200",
        dot: "bg-lime-500",
    },
    "Vitamin & Suplemen": {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
    },
    Antihistamin: {
        bg: "bg-teal-50",
        text: "text-teal-700",
        border: "border-teal-200",
        dot: "bg-teal-500",
    },
    "Antasida & GERD": {
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
        dot: "bg-cyan-500",
    },
    "Batuk & Flu": {
        bg: "bg-sky-50",
        text: "text-sky-600",
        border: "border-sky-200",
        dot: "bg-sky-500",
    },
    "P3K & Antiseptik": {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        dot: "bg-blue-500",
    },
    "Kesehatan Mata": {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        dot: "bg-indigo-500",
    },
    "Ibu & Bayi": {
        bg: "bg-pink-50",
        text: "text-pink-600",
        border: "border-pink-200",
        dot: "bg-pink-500",
    },
};

export const DEFAULT_COLOR = {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
};

export const TYPE_CONFIG = {
    "Obat Keras": {
        badge: "bg-red-50 text-red-600 border-red-200",
        icon: ShieldCheck,
    },
    "Obat Bebas": {
        badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
        icon: CheckCircle2,
    },
    "Obat Terbatas": {
        badge: "bg-amber-50 text-amber-600 border-amber-200",
        icon: AlertTriangle,
    },
};

export const LOW_STOCK_THRESHOLD = 10;
export const EXPIRY_WARN_DAYS = 90;

export const FILTER_TABS = [
    { key: "all", label: "Stok Tersedia" },
    { key: "low", label: "Hampir Habis" },
    { key: "expiring", label: "Kedaluwarsa Segera" },
];

export const STATUS_CONFIG = {
    PENDING: {
        label: "Menunggu",
        dot: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-300/30",
    },
    PROCESSING: {
        label: "Diproses",
        dot: "bg-blue-500",
        badge: "bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-300/30",
    },
    READY_FOR_PICKUP: {
        label: "Siap Diambil",
        dot: "bg-purple-500",
        badge: "bg-purple-50 text-purple-700 border-purple-200/80 ring-1 ring-purple-300/30",
    },
    SHIPPED: {
        label: "Dikirim",
        dot: "bg-indigo-500",
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200/80 ring-1 ring-indigo-300/30",
    },
    DELIVERED: {
        label: "Sampai",
        dot: "bg-teal-500",
        badge: "bg-teal-50 text-teal-700 border-teal-200/80 ring-1 ring-teal-300/30",
    },
    COMPLETED: {
        label: "Selesai",
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-300/30",
    },
    CANCELLED: {
        label: "Dibatalkan",
        dot: "bg-rose-500",
        badge: "bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-300/30",
    },
};

export const SERVICE_ICON = {
    DELIVERY: "Truck",
    PICKUP: "Package",
};

export const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.07,
            duration: 0.38,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
};

export const detailVariants = {
    hidden: { opacity: 0, x: 18 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
};
