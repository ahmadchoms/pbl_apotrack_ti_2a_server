import OrdersList from "@/features/pharmacy/pages/orders/list";

export default function OrderListPage({ orders, currentStatus }) {
    return (
        <OrdersList orders={orders} currentStatus={currentStatus} />
    );
}
