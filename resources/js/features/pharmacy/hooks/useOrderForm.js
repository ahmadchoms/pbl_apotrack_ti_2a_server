import { useState, useMemo } from "react";

export function useOrderForm({ medicines = [] }) {
    const [cart, setCart] = useState([]);
    const [patientName, setPatientName] = useState("");
    const [rxNumber, setRxNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [selectedForm, setSelectedForm] = useState("Semua");
    const [selectedType, setSelectedType] = useState("Semua");
    const [selectedUnit, setSelectedUnit] = useState("Semua");

    const filteredDrugs = useMemo(() => {
        return medicines.filter((drug) => {
            const matchesSearch =
                drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                drug.generic_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === "Semua" ||
                drug.category === selectedCategory;
            const matchesForm =
                selectedForm === "Semua" || drug.form === selectedForm;
            const matchesType =
                selectedType === "Semua" || drug.type === selectedType;
            const matchesUnit =
                selectedUnit === "Semua" || drug.unit === selectedUnit;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesForm &&
                matchesType &&
                matchesUnit &&
                drug.is_active
            );
        });
    }, [
        searchQuery,
        selectedCategory,
        selectedForm,
        selectedType,
        selectedUnit,
    ]);

    const addToCart = (drug) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === drug.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === drug.id && item.qty < drug.total_active_stock
                        ? { ...item, qty: item.qty + 1 }
                        : item,
                );
            }
            return [...prev, { ...drug, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.qty + delta;
                    if (newQty > 0 && newQty <= item.total_active_stock) {
                        return { ...item, qty: newQty };
                    }
                }
                return item;
            }),
        );
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0;
    const total = subtotal + tax;

    return {
        cart,
        patientName,
        setPatientName,
        rxNumber,
        setRxNumber,
        notes,
        setNotes,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedForm,
        setSelectedForm,
        selectedType,
        setSelectedType,
        selectedUnit,
        setSelectedUnit,
        filteredDrugs,
        addToCart,
        updateQty,
        removeFromCart,
        subtotal,
        tax,
        total,
    };
}
