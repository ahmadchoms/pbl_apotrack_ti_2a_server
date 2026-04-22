// resources/js/features/obat/pages/daftar-obat.jsx

import { useState } from "react";
import { router } from "@inertiajs/react";
import ObatCard from "../components/obat-card";
import ObatFilter from "../components/obat-filter";

const initialObat = [
  { id: 1, nama: "Amoxicillin 500mg", kategori: "ANTIBIOTIK", bentuk: "Kapsul", satuan: "Strip isi 10", stok: 450, harga: 12500, image: null },
  { id: 2, nama: "Paracetamol Sirup", kategori: "ANALGESIK", bentuk: "Cair", satuan: "Botol 60ml", stok: 8, harga: 18000, image: null },
  { id: 3, nama: "Vitamin D3 1000IU", kategori: "SUPLEMEN", bentuk: "Softgel", satuan: "Botol isi 30", stok: 124, harga: 85000, image: null },
  { id: 4, nama: "Oxymetazoline Spray", kategori: "NASAL CARE", bentuk: "Semprot", satuan: "15ml", stok: 54, harga: 45000, image: null },
  { id: 5, nama: "Insulin Glargine", kategori: "INJEKSI", bentuk: "Vial", satuan: "3ml Pen", stok: 32, harga: 185000, image: null },
];

export default function DaftarObat({ onTambah, onEdit }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Stok Tersedia");
  const [obatList, setObatList] = useState(initialObat);

  const filtered = obatList.filter((o) =>
    o.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus obat ini?")) {
      setObatList((prev) => prev.filter((o) => o.id !== id));
    }
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>Inventaris Medis</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a2744", margin: 0 }}>Katalog Obat</h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama obat, kategori..."
              style={{ padding: "10px 16px 10px 36px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, width: 260, background: "#fff", outline: "none" }}
            />
          </div>
          <button
            onClick={onTambah}
            style={{ background: "#1a2744", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            ＋ Tambah Obat
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 28 }}>
        <ObatFilter active={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        {filtered.map((obat) => (
          <ObatCard key={obat.id} obat={obat} onEdit={onEdit} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <p style={{ color: "#9ca3af", gridColumn: "1/-1", textAlign: "center" }}>Tidak ada obat ditemukan.</p>
        )}
      </div>
    </div>
  );
}