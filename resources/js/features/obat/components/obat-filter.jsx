// resources/js/features/obat/components/obat-filter.jsx

const filters = ["Stok Tersedia", "Stok Rendah", "Semua Obat"];

export default function ObatFilter({ active, onChange }) {
    return (
        <div style={{ display: "flex", gap: 12 }}>
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onChange(filter)}
                    style={{
                        padding: "8px 16px",
                        fontSize: 14,
                        fontWeight: active === filter ? 600 : 400,
                        color: active === filter ? "#1a2744" : "#6b7280",
                        background: active === filter ? "#f0f4ff" : "transparent",
                        border: active === filter ? "1px solid #1a2744" : "1px solid #e5e7eb",
                        borderRadius: 6,
                        cursor: "pointer",
                    }}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}