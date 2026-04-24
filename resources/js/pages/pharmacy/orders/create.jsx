import PharmacistPOS from "@/features/pharmacy/pages/orders/pos";

export default function CreateOrderPage({ medicines = [] }) {
    return <PharmacistPOS medicines={medicines} />;
}
