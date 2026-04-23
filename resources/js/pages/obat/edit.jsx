import Sidebar from "../../components/ui/sidebar";
import EditObatPage from "../../features/obat/pages/edit-obat-page";
import { router } from "@inertiajs/react";

export default function EditObat({ id }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>
        <EditObatPage
          id={id}
          onBack={() => router.visit('/apotek/obat')}
          onSimpan={(data) => router.put(`/apotek/obat/${id}/edit`, data)}
        />
      </main>
    </div>
  );
}