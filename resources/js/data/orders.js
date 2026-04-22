const CURRENT_PHARMACY_ID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

export const ordersData = [
    {
        id: "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d",
        user_id: "u1234567-89ab-cdef-0123-456789abcdef",
        pharmacy_id: CURRENT_PHARMACY_ID,
        address_id: null,
        service_type: "PICKUP",
        payment_method: "QRIS",
        order_status: "PROCESSING",
        payment_status: "PAID",
        total_price: 155000,
        verification_code: "RX-882-V",
        notes: "Resep Dokter #RX-882 (Verifikasi) - Pengambilan Resep",
        paid_at: "2026-04-21T09:15:00Z",
        expired_at: "2026-04-21T10:20:00Z",
        created_at: "2026-04-21T09:20:00Z",
        updated_at: "2026-04-21T09:20:00Z",

        user: {
            id: "u1234567-89ab-cdef-0123-456789abcdef",
            full_name: "Siti Aminah",
            phone: "081234567890",
            email: "siti.aminah@email.com",
        },

        address: null,

        items: [
            {
                id: "item1-1111-2222-3333-444455556666",
                order_id: "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d",
                medicine_id: "med1-1111-2222-3333-444455556666",
                quantity: 2,
                price: 50000,
                subtotal: 100000,
                medicine: {
                    name: "Amoxicillin 500mg",
                    unit: "Strip",
                    image_url: "https://example.com/amoxicillin.jpg",
                },
            },
            {
                id: "item2-1111-2222-3333-444455556666",
                order_id: "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d",
                medicine_id: "med2-1111-2222-3333-444455556666",
                quantity: 1,
                price: 55000,
                subtotal: 55000,
                medicine: {
                    name: "Sanmol Paracetamol 500mg",
                    unit: "Botol",
                    image_url: "https://example.com/sanmol.jpg",
                },
            },
        ],
    },
    {
        id: "b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e",
        user_id: "u2345678-9abc-def0-1234-56789abcdef0",
        pharmacy_id: CURRENT_PHARMACY_ID,
        address_id: "addr1-2222-3333-4444-555566667777",
        service_type: "DELIVERY",
        payment_method: "CASH",
        order_status: "PENDING",
        payment_status: "PAID",
        total_price: 85000,
        verification_code: null,
        notes: "Tolong dibungkus plastik double, sedang hujan.",
        paid_at: "2026-04-21T09:45:00Z",
        expired_at: "2026-04-21T10:45:00Z",
        created_at: "2026-04-21T09:40:00Z",
        updated_at: "2026-04-21T09:45:00Z",

        user: {
            id: "u2345678-9abc-def0-1234-56789abcdef0",
            full_name: "Budi Santoso",
            phone: "089876543210",
            email: "budi.s@email.com",
        },

        address: {
            id: "addr1-2222-3333-4444-555566667777",
            label: "Rumah",
            address_detail:
                "Jl. Merdeka No. 45, RT 01/RW 02, Kec. Sukajadi. (Pagar Hitam)",
            latitude: -6.2,
            longitude: 106.816666,
        },

        items: [
            {
                id: "item3-1111-2222-3333-444455556666",
                order_id: "b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e",
                medicine_id: "med3-1111-2222-3333-444455556666",
                quantity: 1,
                price: 85000,
                subtotal: 85000,
                medicine: {
                    name: "Imboost Force",
                    unit: "Strip",
                    image_url: "https://example.com/imboost.jpg",
                },
            },
        ],
    },
    {
        id: "c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f",
        user_id: "u3456789-abcd-ef01-2345-6789abcdef01",
        pharmacy_id: CURRENT_PHARMACY_ID,
        address_id: null,
        service_type: "PICKUP",
        payment_method: "CASH",
        order_status: "COMPLETED",
        payment_status: "PAID",
        total_price: 45000,
        verification_code: "OTC-45K-X",
        notes: "Pembelian Langsung - Obat Bebas",
        paid_at: "2026-04-20T14:30:00Z",
        expired_at: "2026-04-20T15:00:00Z",
        created_at: "2026-04-20T14:15:00Z",
        updated_at: "2026-04-20T14:30:00Z",

        user: {
            id: "u3456789-abcd-ef01-2345-6789abcdef01",
            full_name: "Agus Pratama",
            phone: "085544332211",
            email: "agus.pratama@email.com",
        },

        address: null,

        items: [
            {
                id: "item4-1111-2222-3333-444455556666",
                order_id: "c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f",
                medicine_id: "med4-1111-2222-3333-444455556666",
                quantity: 3,
                price: 15000,
                subtotal: 45000,
                medicine: {
                    name: "Promag Tablet",
                    unit: "Blister",
                    image_url: "https://example.com/promag.jpg",
                },
            },
        ],
    },
];
