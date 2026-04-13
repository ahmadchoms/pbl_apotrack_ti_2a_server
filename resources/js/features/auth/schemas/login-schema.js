import * as z from "zod";

export const loginSchema = z.object({
    identifier: z
        .string()
        .min(3, { message: "Email atau ID Karyawan harus diisi." }),
    password: z.string().min(6, { message: "Kata sandi minimal 6 karakter." }),
    rememberMe: z.boolean().default(false).optional(),
});
