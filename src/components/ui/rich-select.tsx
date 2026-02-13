"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

interface RichSelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    options: Option[];
    label?: string;
    customDropdown?: boolean;
    className?: string;
    error?: string;
}

export function RichSelect({
    value,
    onValueChange,
    placeholder,
    options,
    className,
    customDropdown,
    label,
    error,
}: RichSelectProps) {
    const id = React.useId();
    const selectId = label?.toLowerCase().replace(/\s+/g, "-") || id;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
                >
                    {label}
                </label>
            )}
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger
                    id={selectId}
                    className={cn(
                        "w-full h-11 px-4 rounded-lg border border-border bg-white text-[var(--text-primary)] text-base font-normal shadow-none transition-colors duration-200 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-bg)] disabled:bg-[var(--surface)] disabled:cursor-not-allowed data-placeholder:text-(--text-muted)",
                        error && "border-[var(--status-rejected)] focus:border-[var(--status-rejected)] focus:ring-[var(--status-rejected-bg)] ",
                        className
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent
                    className="bg-white z-50 w-(--radix-select-trigger-width)"
                    position="popper"
                >
                    <div className="max-h-[300px] overflow-y-auto">
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="focus:bg-(--primary-bg) focus:text-primary">
                                <div className="flex items-center gap-3 py-1.5 w-full overflow-hidden">
                                    {option.icon && (
                                        <div className="shrink-0 text-(--text-muted) group-focus:text-primary">
                                            {option.icon}
                                        </div>
                                    )}
                                    <div className="flex flex-col text-left overflow-hidden">
                                        <span className="font-medium  text-[var(--text-primary)] group-focus:text-primary truncate">
                                            {option.label}
                                        </span>
                                        {option.description && (
                                            <span className="text-xs text-(--text-muted) line-clamp-1">
                                                {option.description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </div>
                </SelectContent>
            </Select>
            {error && (
                <p className="mt-1.5 text-sm text-[var(--status-rejected)]">{error}</p>
            )}
        </div>
    );
}
