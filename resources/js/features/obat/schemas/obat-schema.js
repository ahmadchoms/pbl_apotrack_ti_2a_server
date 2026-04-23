// resources/js/features/obat/schemas/obat-schema.js

export const kategoriOptions = [
    "Antibiotik",
    "Analgesik",
    "Suplemen",
    "Nasal Care",
    "Injeksi",
    "Antivirus",
    "Antihistamin",
    "Obat Keras",
    "Lainnya",
];

export function validateObat(form) {
    const errors = {};

    if (!form.nama || form.nama.trim().length < 3) {
        errors.nama = "Nama obat minimal 3 karakter";
    }
    if (!form.kategori) {
        errors.kategori = "Kategori wajib dipilih";
    }
    if (Number(form.harga) < 0) {
        errors.harga = "Harga tidak boleh negatif";
    }
    if (Number(form.stok) < 0) {
        errors.stok = "Stok tidak boleh negatif";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}