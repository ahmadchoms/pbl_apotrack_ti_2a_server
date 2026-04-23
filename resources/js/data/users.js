export const users = [
    {
        id: "019db9a6-8991-7103-b685-bf0ed93fe9fb",
        username: "Super Admin",
        email: "admin@apotek.id",
        phone: "081111111111",
        role: "SUPER_ADMIN",
        avatar_url:
            "https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg",
        is_active: true,
        addresses: [],
    },
    {
        id: "019db9a6-8b24-721a-a65a-f1b4d19984a9",
        username: "Budi Santoso",
        email: "budi@customer.id",
        phone: "082222222222",
        role: "CUSTOMER",
        avatar_url:
            "https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg",
        is_active: true,
        addresses: [
            {
                label: "Rumah Utama",
                address_detail:
                    "Jl. Mawar Merah No. 15, RT 02/RW 04, Jakarta Barat",
                is_primary: true,
            },
        ],
    },
    {
        id: "019db9a6-8cb4-7325-9429-527424339f8a",
        username: "Siti Rahayu",
        email: "siti@customer.id",
        phone: "083333333333",
        role: "CUSTOMER",
        avatar_url:
            "https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg",
        is_active: true,
        addresses: [
            {
                label: "Kantor",
                address_detail:
                    "Gedung Cyber, Jl. Kuningan Barat No. 8, Jakarta Selatan",
                is_primary: true,
            },
        ],
    },
    {
        id: "019db9a6-8e47-71cb-a7a6-808bdd1bc112",
        username: "Dr. Prayitno Apoteker",
        email: "prayitno@apotek.id",
        phone: "084444444444",
        role: "APOTEKER",
        avatar_url:
            "https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg",
        is_active: true,
        addresses: [],
    },
    {
        id: "019db9a6-8fd2-7055-badd-9d6a6538b9d5",
        username: "Rina Staff",
        email: "rina@apotek.id",
        phone: "085555555555",
        role: "PHARMACY_STAFF",
        avatar_url:
            "https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg",
        is_active: true,
        addresses: [],
    },
    {
        id: "019db9a6-915e-73d5-86e3-280f864f4268",
        username: "Hanif Nakal",
        email: "hanif@banned.id",
        phone: "086666666666",
        role: "CUSTOMER",
        avatar_url:
            "https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg",
        is_active: false,
        addresses: [],
    },
];
