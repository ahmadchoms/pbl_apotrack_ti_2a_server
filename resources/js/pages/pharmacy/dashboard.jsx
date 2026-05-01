import PharmacistDashboard from "@/features/pharmacy/pages/dashboard";

export default function PharmacistDashboardPage({
    kpi = {},
    charts = {},
    widgets = {},
}) {
    return (
        <PharmacistDashboard
            kpi={kpi}
            charts={charts}
            widgets={widgets}
        />
    );
}
