import React from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export function TextInput({
    label,
    required,
    hint,
    icon: Icon,
    prefix,
    className,
    ...props
}) {
    const hasLeftElement = Icon || prefix;

    return (
        <FormField label={label} required={required} hint={hint}>
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                )}
                {prefix && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {prefix}
                    </span>
                )}
                <Input
                    className={`h-10 text-sm border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-xl transition-all placeholder:text-slate-300 w-full ${hasLeftElement ? "pl-9" : ""} ${props.type === "number" ? "tabular-nums" : ""} ${className || ""}`}
                    {...props}
                />
            </div>
        </FormField>
    );
}
