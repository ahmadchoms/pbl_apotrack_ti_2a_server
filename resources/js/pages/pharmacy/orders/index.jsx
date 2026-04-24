import PharmacistOrderManagement from "@/features/pharmacy/pages/orders/index";

export default function OrderManagementPage({
    orders = [],
    pendingCount = 0,
    completedCount = 0,
}) {
    console.log("Orders:", orders);
    return (
        <PharmacistOrderManagement
            orders={orders}
            pendingCount={pendingCount}
            completedCount={completedCount}
        />
    );
}
