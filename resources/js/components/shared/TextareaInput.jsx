import React from "react";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";

export function TextareaInput({
    label,
    required,
    hint,
    rows = 3,
    className,
    ...props
}) {
    return (
        <FormField label={label} required={required} hint={hint}>
            <Textarea
                rows={rows}
                className={`text-sm border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#00346C]/40 focus:ring-2 focus:ring-[#00346C]/10 rounded-xl transition-all placeholder:text-slate-300 resize-none w-full ${className || ""}`}
                {...props}
            />
        </FormField>
    );
}
