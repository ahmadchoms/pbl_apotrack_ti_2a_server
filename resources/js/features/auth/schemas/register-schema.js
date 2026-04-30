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
        pharmacy_phone: z.string().min(10, { message: "Nomor telepon apotek minimal 10 digit." }),
        pharmacy_latitude: z.number().or(z.string().transform((v) => parseFloat(v))),
        pharmacy_longitude: z.number().or(z.string().transform((v) => parseFloat(v))),

        // Legality Data
        sia_number: z.string().min(5, { message: "Nomor SIA harus diisi." }),
        sipa_number: z.string().min(5, { message: "Nomor SIPA harus diisi." }),
        stra_number: z.string().min(5, { message: "Nomor STRA harus diisi." }),
        apoteker_nik: z.string().length(16, { message: "NIK KTP Apoteker harus 16 digit." }),
        sia_document: z.any().refine((file) => file !== null, "Dokumen SIA wajib diunggah."),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Konfirmasi kata sandi tidak cocok.",
        path: ["password_confirmation"],
    });
