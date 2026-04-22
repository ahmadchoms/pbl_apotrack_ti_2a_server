const CURRENT_PHARMACY_ID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

export const medicineCategories = [
    { id: "cat-001", name: "Analgesic" },
    { id: "cat-002", name: "Antibiotic" },
    { id: "cat-003", name: "Cough & Cold" },
    { id: "cat-004", name: "Gastrointestinal" },
    { id: "cat-005", name: "Vitamin & Supplement" },
];

export const medicineForms = [
    { id: "form-001", name: "Tablet" },
    { id: "form-002", name: "Capsule" },
    { id: "form-003", name: "Syrup" },
    { id: "form-004", name: "Injection" },
    { id: "form-005", name: "Ointment" },
];

export const medicineTypes = [
    { id: "type-001", name: "Over The Counter" },
    { id: "type-002", name: "Prescription" },
    { id: "type-003", name: "Herbal" },
    { id: "type-004", name: "Supplement" },
    { id: "type-005", name: "Limited OTC" },
];

export const medicineUnits = [
    { id: "unit-001", name: "Tablet" },
    { id: "unit-002", name: "Strip" },
    { id: "unit-003", name: "Bottle" },
    { id: "unit-004", name: "Box" },
    { id: "unit-005", name: "Tube" },
];

export const medicinesData = [
    {
        id: "11111111-aaaa-4aaa-aaaa-111111111111",
        pharmacy_id: CURRENT_PHARMACY_ID,
        // Disesuaikan dengan ID master array di atas
        category_id: "cat-001",
        form_id: "form-001",
        type_id: "type-001",
        unit_id: "unit-002",
        name: "Paracetamol 500mg",
        description: "Obat untuk meredakan demam dan nyeri ringan",
        price: 8000,
        stock: 120,
        unit: "Strip",
        image: "https://example.com/paracetamol.jpg", // Diubah dari image_url ke image (sesuai new.jsx)
        is_active: true,
        created_at: "2026-04-21T08:00:00Z",
        updated_at: "2026-04-21T08:00:00Z",

        category: { id: "cat-001", name: "Analgesic" },
        form: { id: "form-001", name: "Tablet" },
        type: { id: "type-001", name: "Over The Counter" },
        unit_detail: { id: "unit-002", name: "Strip" },
    },
    {
        id: "22222222-bbbb-4bbb-bbbb-222222222222",
        pharmacy_id: CURRENT_PHARMACY_ID,
        category_id: "cat-002",
        form_id: "form-002",
        type_id: "type-002",
        unit_id: "unit-002",
        name: "Amoxicillin 500mg",
        description: "Antibiotik untuk infeksi bakteri",
        price: 15000,
        stock: 80,
        unit: "Strip",
        image: "https://example.com/amoxicillin.jpg", // Diubah ke image
        is_active: true,
        created_at: "2026-04-21T08:10:00Z",
        updated_at: "2026-04-21T08:10:00Z",

        category: { id: "cat-002", name: "Antibiotic" },
        form: { id: "form-002", name: "Capsule" },
        type: { id: "type-002", name: "Prescription" },
        unit_detail: { id: "unit-002", name: "Strip" },
    },
    {
        id: "33333333-cccc-4ccc-cccc-333333333333",
        pharmacy_id: CURRENT_PHARMACY_ID,
        category_id: "cat-003",
        form_id: "form-003",
        type_id: "type-001",
        unit_id: "unit-003",
        name: "OBH Combi Batuk Berdahak",
        description: "Sirup untuk meredakan batuk berdahak",
        price: 18000,
        stock: 50,
        unit: "Botol",
        image: "https://example.com/obh-combi.jpg", // Diubah ke image
        is_active: true,
        created_at: "2026-04-21T08:20:00Z",
        updated_at: "2026-04-21T08:20:00Z",

        category: { id: "cat-003", name: "Cough & Cold" }, // Disesuaikan dengan master
        form: { id: "form-003", name: "Syrup" },
        type: { id: "type-001", name: "Over The Counter" },
        unit_detail: { id: "unit-003", name: "Bottle" },
    },
    {
        id: "44444444-dddd-4ddd-dddd-444444444444",
        pharmacy_id: CURRENT_PHARMACY_ID,
        category_id: "cat-005", // Vitamin
        form_id: "form-001",
        type_id: "type-004", // Disesuaikan dengan ID Supplement
        unit_id: "unit-003",
        name: "Vitamin C 1000mg",
        description: "Suplemen untuk meningkatkan daya tahan tubuh",
        price: 35000,
        stock: 40,
        unit: "Botol",
        image: "https://example.com/vitamin-c.jpg", // Diubah ke image
        is_active: true,
        created_at: "2026-04-21T08:30:00Z",
        updated_at: "2026-04-21T08:30:00Z",

        category: { id: "cat-005", name: "Vitamin & Supplement" }, // Disesuaikan dengan master
        form: { id: "form-001", name: "Tablet" },
        type: { id: "type-004", name: "Supplement" }, // Dikoreksi dari 'Presciption'
        unit_detail: { id: "unit-003", name: "Bottle" },
    },
];
