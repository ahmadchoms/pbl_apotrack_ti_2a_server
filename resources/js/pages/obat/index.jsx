// resources/js/pages/obat/index.jsx

import Sidebar from "../../components/ui/sidebar";
import DaftarObat from "../../features/obat/pages/daftar-obat-page";
import { router } from "@inertiajs/react";

export default function ObatPage() {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
            <Sidebar />
            <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>
                <DaftarObat
                    onTambah={() => router.visit("/apotek/obat/tambah")}
                    onEdit={(id) => router.visit(`/apotek/obat/${id}/edit`)}
                />
            </main>
        </div>
    );
}