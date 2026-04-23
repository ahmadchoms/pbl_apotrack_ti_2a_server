import Sidebar from "../../components/ui/sidebar";
import TambahObat from "../../features/obat/pages/tambah-obat-page";
import { router } from "@inertiajs/react";

export default function TambahObatPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>
        <TambahObat
          onBack={() => router.visit('/apotek/obat')}
          onSimpan={(data) => router.post('/apotek/obat/tambah', data)}
        />
      </main>
    </div>
  );
}