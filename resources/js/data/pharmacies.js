export const pharmaciesData = [
    {
        id: "pharm-001",
        admin_id: "user-admin-001",
        name: "Apotek Sehat Sentosa",
        phone: "024-1234567",
        address: "Jl. Pemuda No.45, Semarang",
        latitude: -6.992,
        longitude: 110.422,
        rating: 4.7,
        reviews_count: 128,
        is_active: true,
        is_force_closed: false,
        created_at: "2026-04-20T08:30:00Z",

        admin: {
            id: "user-admin-001",
            full_name: "Dr. Andi Pratama",
            phone: "081234567890",
            email: "andi.pratama@apoteker.com",
            role: "ADMIN_PHARMACY",
            is_active: true,
        },

        operating_hours: [
            {
                id: "hour-001",
                day_of_week: 1,
                open_time: "08:00",
                close_time: "22:00",
                is_closed: false,
                is_24_hours: false,
            },
            {
                id: "hour-002",
                day_of_week: 7,
                open_time: null,
                close_time: null,
                is_closed: true,
                is_24_hours: false,
            },
        ],
    },

    {
        id: "pharm-002",
        admin_id: "user-admin-002",
        name: "Apotek K24 Pandanaran",
        phone: "024-7654321",
        address: "Jl. Pandanaran No.20, Semarang",
        latitude: -6.991,
        longitude: 110.421,
        rating: 4.5,
        reviews_count: 98,
        is_active: true,
        is_force_closed: false,
        created_at: "2026-04-20T09:00:00Z",

        admin: {
            id: "user-admin-002",
            full_name: "Siti Rahmawati",
            phone: "089876543210",
            email: "siti.rahma@apoteker.com",
            role: "ADMIN_PHARMACY",
            is_active: true,
        },

        operating_hours: [
            {
                id: "hour-003",
                day_of_week: 1,
                open_time: null,
                close_time: null,
                is_closed: false,
                is_24_hours: true,
            },
        ],
    },

    {
        id: "pharm-003",
        admin_id: "user-admin-003",
        name: "Apotek Kimia Farma Simpang Lima",
        phone: "024-8889999",
        address: "Jl. Ahmad Yani No.10, Semarang",
        latitude: -6.993,
        longitude: 110.423,
        rating: 4.6,
        reviews_count: 156,
        is_active: true,
        is_force_closed: true,
        created_at: "2026-04-20T09:30:00Z",

        admin: {
            id: "user-admin-003",
            full_name: "Budi Santoso",
            phone: "085544332211",
            email: "budi.santoso@apoteker.com",
            role: "ADMIN_PHARMACY",
            is_active: true,
        },

        operating_hours: [
            {
                id: "hour-004",
                day_of_week: 1,
                open_time: "09:00",
                close_time: "21:00",
                is_closed: false,
                is_24_hours: false,
            },
        ],
    },

    {
        id: "pharm-004",
        admin_id: "user-admin-004",
        name: "Apotek Medika Sejahtera",
        phone: "024-2223333",
        address: "Jl. Gajah Mada No.88, Semarang",
        latitude: -6.995,
        longitude: 110.42,
        rating: 4.3,
        reviews_count: 67,
        is_active: true,
        is_force_closed: false,
        created_at: "2026-04-20T10:00:00Z",

        admin: {
            id: "user-admin-004",
            full_name: "Dewi Lestari",
            phone: "082233445566",
            email: "dewi.lestari@apoteker.com",
            role: "ADMIN_PHARMACY",
            is_active: true,
        },

        operating_hours: [
            {
                id: "hour-005",
                day_of_week: 1,
                open_time: "07:00",
                close_time: "23:00",
                is_closed: false,
                is_24_hours: false,
            },
        ],
    },

    {
        id: "pharm-005",
        admin_id: "user-admin-005",
        name: "Apotek Farma Jaya",
        phone: "024-4445555",
        address: "Jl. Sultan Agung No.15, Semarang",
        latitude: -6.996,
        longitude: 110.419,
        rating: 0,
        reviews_count: 0,
        is_active: true,
        is_force_closed: false,
        created_at: "2026-04-20T10:30:00Z",

        admin: {
            id: "user-admin-005",
            full_name: "Rizky Hidayat",
            phone: "081998877665",
            email: "rizky.hidayat@apoteker.com",
            role: "ADMIN_PHARMACY",
            is_active: true,
        },

        operating_hours: [
            {
                id: "hour-006",
                day_of_week: 1,
                open_time: "09:00",
                close_time: "18:00",
                is_closed: false,
                is_24_hours: false,
            },
        ],
    },
];
