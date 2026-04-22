// resources/js/components/ui/sidebar.jsx

import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, Users, ShoppingCart, Pill, User, LogOut } from "lucide-react";

const navItems = [
    { label: "Dasbor Utama",    icon: LayoutDashboard, href: "/apotek" },
    { label: "Manajemen Staff", icon: Users,           href: "/apotek/staff" },
    { label: "Daftar Pesanan",  icon: ShoppingCart,    href: "/apotek/pesanan" },
    { label: "Daftar Obat",     icon: Pill,            href: "/apotek/obat" },
    { label: "Profil Pengguna", icon: User,            href: "/apotek/profile" },
];

export default function Sidebar() {
    const { url } = usePage();

    return (
        <div style={{ width: 220, minHeight: "100vh", background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0 }}>
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a2744", margin: 0 }}>Ethereal Health</h2>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>Pharmacy Portal</p>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "12px 0" }}>
                {navItems.map((item) => {
                    const isActive = url.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 24px",
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? "#1a2744" : "#6b7280",
                                background: isActive ? "#f0f4ff" : "transparent",
                                textDecoration: "none",
                                borderLeft: isActive ? "3px solid #1a2744" : "3px solid transparent",
                            }}
                        >
                            <Icon size={16} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                >
                    <LogOut size={16} />
                    Keluar
                </Link>
            </div>
        </div>
    );
}