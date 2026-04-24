import { useState, useMemo } from "react";
import {
    getStockStatus,
    getExpiryWarning,
} from "@/features/pharmacy/lib/helpers";

export function useMedicineFilter(medicines) {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState(null);

    const uniqueMedicines = useMemo(() => {
        const seen = new Set();
        return medicines.filter((m) => {
            if (seen.has(m.name)) return false;
            seen.add(m.name);
            return true;
        });
    }, [medicines]);

    const filtered = useMemo(() => {
        let list = uniqueMedicines;
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.category.toLowerCase().includes(q) ||
                    m.generic_name?.toLowerCase().includes(q),
            );
        }
        if (selectedCategory) {
            list = list.filter((m) => m.category === selectedCategory);
        }
        if (activeFilter === "low") {
            list = list.filter(
                (m) =>
                    getStockStatus(m) === "low" ||
                    getStockStatus(m) === "empty",
            );
        }
        if (activeFilter === "expiring") {
            list = list.filter((m) => getExpiryWarning(m) !== null);
        }
        if (activeFilter === "keras") {
            list = list.filter((m) => m.type === "Obat Keras");
        }
        return list;
    }, [uniqueMedicines, search, activeFilter, selectedCategory]);

    const lowStockCount = useMemo(
        () => uniqueMedicines.filter((m) => getStockStatus(m) !== "ok").length,
        [uniqueMedicines],
    );

    const expiringCount = useMemo(
        () =>
            uniqueMedicines.filter((m) => getExpiryWarning(m) !== null).length,
        [uniqueMedicines],
    );

    return {
        search,
        setSearch,
        activeFilter,
        setActiveFilter,
        selectedCategory,
        setSelectedCategory,
        filtered,
        uniqueMedicines,
        lowStockCount,
        expiringCount,
    };
}
