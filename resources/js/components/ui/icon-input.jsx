import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const IconInput = React.forwardRef(
    ({ icon: Icon, rightIcon: RightIcon, onRightIconClick, className, ...props }, ref) => {
        return (
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <Input
                    className={cn(
                        Icon ? "pl-10" : "",
                        RightIcon ? "pr-10" : "",
                        "bg-slate-50/50 border-slate-200 focus-visible:ring-primary",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {RightIcon && (
                    <button
                        type="button"
                        onClick={onRightIconClick}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <RightIcon className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }
);
IconInput.displayName = "IconInput";
