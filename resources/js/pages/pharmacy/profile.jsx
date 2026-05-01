import PharmacistProfile from "@/features/pharmacy/pages/profile";

export default function ProfilePage({
    user = {},
    auditLogs = [],
    pharmacy = {},
}) {
    return (
        <PharmacistProfile
            user={user}
            auditLogs={auditLogs}
            pharmacy={pharmacy}
        />
    );
}
