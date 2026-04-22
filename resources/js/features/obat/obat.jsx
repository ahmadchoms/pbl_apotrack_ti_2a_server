// resources/js/features/obat/obat.jsx

import { useState } from "react";
import DaftarObat from "./pages/daftar-obat-page";
import TambahObat from "./pages/tambah-obat-page";
import EditObat from "./pages/edit-obat-page";

export default function Obat() {
  const [page, setPage] = useState("daftar");
  const [editTarget, setEditTarget] = useState(null);

  if (page === "tambah") {
    return (
      <TambahObat
        onBack={() => setPage("daftar")}
        onSimpan={(data) => {
          alert(`Obat "${data.nama}" berhasil ditambahkan!`);
          setPage("daftar");
        }}
      />
    );
  }

  if (page === "edit" && editTarget) {
    return (
      <EditObat
        obat={editTarget}
        onBack={() => setPage("daftar")}
        onSimpan={(data) => {
          alert(`Obat "${data.nama}" berhasil diperbarui!`);
          setPage("daftar");
        }}
      />
    );
  }

  return (
    <DaftarObat
      onTambah={() => setPage("tambah")}
      onEdit={(obat) => {
        setEditTarget(obat);
        setPage("edit");
      }}
    />
  );
}