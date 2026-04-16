import * as z from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter." }),
        email: z.string().email({ message: "Format email tidak valid." }),
        password: z
            .string()
            .min(6, { message: "Kata sandi minimal 6 karakter." }),
        confirmPassword: z
            .string()
            .min(6, { message: "Konfirmasi kata sandi harus diisi." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Konfirmasi kata sandi tidak cocok.",
        path: ["confirmPassword"],
    });
