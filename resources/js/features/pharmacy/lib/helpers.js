import { LOW_STOCK_THRESHOLD, EXPIRY_WARN_DAYS } from "./constants";

export function getDaysUntilExpiry(dateStr) {
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getStockStatus(medicine) {
    const stock = medicine.total_active_stock;
    if (stock === 0) return "empty";
    if (stock <= LOW_STOCK_THRESHOLD) return "low";
    return "ok";
}

export function getExpiryWarning(medicine) {
    for (const batch of medicine.batches ?? []) {
        const days = getDaysUntilExpiry(batch.expired_date);
        if (days <= EXPIRY_WARN_DAYS) return days;
    }
    return null;
}
