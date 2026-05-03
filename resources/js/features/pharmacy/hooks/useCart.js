import { useState } from "react";

export function useCart(initialCart = []) {
    const [cart, setCart] = useState(initialCart);

    const addToCart = (drug, delta = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === drug.id);
            if (existing) {
                const newQty = existing.qty + delta;
                if (newQty <= 0)
                    return prev.filter((item) => item.id !== drug.id);
                if (newQty > drug.total_active_stock) return prev;
                return prev.map((item) =>
                    item.id === drug.id ? { ...item, qty: newQty } : item,
                );
            }
            if (delta <= 0) return prev;
            return [
                ...prev,
                {
                    id: drug.id,
                    name: drug.name,
                    generic_name: drug.generic_name,
                    price: drug.price,
                    form: drug.form,
                    unit: drug.unit,
                    image_url: drug.image_url ?? null,
                    requires_prescription: drug.requires_prescription,
                    max_stock: drug.total_active_stock,
                    qty: 1,
                },
            ];
        });
    };

    const updateQty = (id, delta) => {
        setCart((prev) => {
            return prev
                .map((item) => {
                    if (item.id !== id) return item;
                    const newQty = item.qty + delta;
                    if (newQty <= 0) return null;
                    if (newQty > item.max_stock) return item;
                    return { ...item, qty: newQty };
                })
                .filter(Boolean);
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const resetCart = () => setCart([]);

    const totalCartItems = cart.reduce((a, i) => a + i.qty, 0);

    return {
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        resetCart,
        totalCartItems
    };
}
