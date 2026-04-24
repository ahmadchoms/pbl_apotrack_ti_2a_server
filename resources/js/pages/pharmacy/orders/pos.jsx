import PharmacistPOS from "@/features/pharmacy/pages/orders/pos";

export default function POSPage({ medicines }) {
    return (
        <PharmacistPOS medicines={medicines} />
    );
}
