import StaffPage from "@/features/pharmacy/pages/staff/index";

export default function StaffManagementPage({ staff, activityLogs, filters }) {
    return (
        <StaffPage
            staff={staff}
            activityLogs={activityLogs}
            filters={filters}
        />
    );
}
