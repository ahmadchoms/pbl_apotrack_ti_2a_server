import * as z from "zod";

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email harus diisi." })
        .email({ message: "Format email tidak valid." }),
});
