import PharmacistProfile from "@/features/pharmacy/pages/profile";

export default function ProfilePage({
    user = {},
    auditLogs = [],
    recentActivities = [],
    securitySettings = {},
}) {
    return (
        <PharmacistProfile
            user={user}
            auditLogs={auditLogs}
            recentActivities={recentActivities}
            securitySettings={securitySettings}
        />
    );
}
