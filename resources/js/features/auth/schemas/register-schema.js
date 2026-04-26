import * as z from "zod";

export const registerSchema = z
    .object({
        // User Data
        username: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter." }),
        email: z.string().email({ message: "Format email tidak valid." }),
        phone: z.string().min(10, { message: "Nomor telepon minimal 10 digit." }),
        password: z
            .string()
            .min(8, { message: "Kata sandi minimal 8 karakter." }),
        password_confirmation: z
            .string()
            .min(8, { message: "Konfirmasi kata sandi harus diisi." }),

        // Pharmacy Data
        pharmacy_name: z.string().min(3, { message: "Nama apotek minimal 3 karakter." }),
        pharmacy_address: z.string().min(5, { message: "Alamat apotek minimal 5 karakter." }),
        pharmacy_phone: z.string().optional(),
        pharmacy_latitude: z.number().or(z.string().transform((v) => parseFloat(v))),
        pharmacy_longitude: z.number().or(z.string().transform((v) => parseFloat(v))),
        license_number: z.string().min(5, { message: "Nomor SIA harus diisi." }),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Konfirmasi kata sandi tidak cocok.",
        path: ["password_confirmation"],
    });
