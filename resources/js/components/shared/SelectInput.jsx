import React from "react";
import { FormField } from "@/components/ui/form-field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function SelectInput({
    label,
    required,
    hint,
    value,
    onChange,
    placeholder,
    options = [],
    className,
}) {
    return (
        <FormField label={label} required={required} hint={hint}>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    className={`h-10 text-sm border-slate-200 bg-slate-50/50 focus:bg-white data-[state=open]:border-primary/40 rounded-xl w-full ${className || ""}`}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                    {options.map((opt) => (
                        <SelectItem
                            key={opt.id}
                            value={opt.name}
                            className="text-sm rounded-lg"
                        >
                            {opt.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FormField>
    );
}
