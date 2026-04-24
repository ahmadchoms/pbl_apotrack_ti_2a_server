import PharmacistDashboard from "@/features/pharmacy/pages/dashboard";

export default function PharmacistDashboardPage({
    totalOrders = 0,
    totalMedicines = 0,
    criticalStocksCount = 0,
    prescriptionQueue = 0,
    totalRevenue = 0,
    revenueData = [],
    trendData = [],
    userActivities = [],
    criticalStocks = [],
}) {
    return (
        <PharmacistDashboard
            totalOrders={totalOrders}
            totalMedicines={totalMedicines}
            criticalStocksCount={criticalStocksCount}
            prescriptionQueue={prescriptionQueue}
            totalRevenue={totalRevenue}
            revenueData={revenueData}
            trendData={trendData}
            userActivities={userActivities}
            criticalStocks={criticalStocks}
        />
    );
}
