"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search } from "lucide-react";
import { forwardRef, useState, useRef, useEffect, type ReactNode } from "react";

export interface ComboboxOption {
    value: string;
    label: string;
    icon?: ReactNode;
    description?: string;
    logo?: string;
}

export interface ComboboxProps {
    label?: string;
    error?: string;
    helperText?: string;
    options: ComboboxOption[];
    placeholder?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
    ({ className, label, error, helperText, options, placeholder, value, onValueChange, disabled }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState("");
        const dropdownRef = useRef<HTMLDivElement>(null);

        // Close on outside click
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const selectedOption = options.find((o) => o.value === value);

        const filteredOptions = options.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            option.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className={cn("w-full relative", className)} ref={dropdownRef}>
                {label && (
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        className={cn(
                            `w-full h-11 px-4 rounded-lg
                            border border-[var(--border)] bg-white
                            text-[var(--text-primary)]
                            transition-colors duration-200
                            focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-bg)]
                            flex items-center justify-between gap-2 text-sm text-left cursor-pointer`,
                            !value && "text-[var(--text-muted)]",
                            isOpen && "border-[var(--primary)] ring-2 ring-[var(--primary-bg)]",
                            error && "border-[var(--status-rejected)] focus:border-[var(--status-rejected)] focus:ring-[var(--status-rejected-bg)]",
                            disabled && "opacity-50 cursor-not-allowed bg-[var(--surface)]"
                        )}
                    >
                        {selectedOption ? (
                            <span className="flex items-center gap-3 truncate">
                                {selectedOption.logo ? (
                                    <img src={selectedOption.logo} alt="" className="w-5 h-5 rounded object-contain bg-white" />
                                ) : selectedOption.icon ? (
                                    <span className="flex-shrink-0">{selectedOption.icon}</span>
                                ) : null}
                                <span className="truncate">{selectedOption.label}</span>
                            </span>
                        ) : (
                            <span>{placeholder || "Cari..."}</span>
                        )}
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 flex-shrink-0 opacity-50 transition-transform duration-200",
                                isOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--border)] rounded-lg shadow-xl max-h-80 overflow-hidden flex flex-col">
                            <div className="p-2 border-b">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        autoFocus
                                        className="w-full h-9 pl-9 pr-3 text-sm bg-gray-50 border rounded-md focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                                        placeholder="Ketik untuk mencari..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-auto flex-1">
                                {searchQuery && !filteredOptions.find(o => o.label.toLowerCase() === searchQuery.toLowerCase()) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onValueChange?.(searchQuery);
                                            setIsOpen(false);
                                            setSearchQuery("");
                                        }}
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left w-full hover:bg-[var(--primary-bg)] hover:text-[var(--primary)] border-b italic"
                                    >
                                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border">
                                            <Search className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium truncate text-[var(--primary)]">Gunakan "{searchQuery}"</p>
                                            <p className="text-xs text-[var(--text-muted)] truncate">Gunakan nama instansi yang Anda ketik</p>
                                        </div>
                                    </button>
                                )}

                                {filteredOptions.length === 0 && !searchQuery ? (
                                    <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                                        Pilih kategori atau ketik untuk mencari...
                                    </div>
                                ) : filteredOptions.length === 0 && searchQuery ? (
                                    <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                                        Tidak ada saran untuk "{searchQuery}". Klik di atas untuk menggunakan nama ini.
                                    </div>
                                ) : (
                                    filteredOptions.map((option) => {
                                        const isSelected = value === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    onValueChange?.(option.value);
                                                    setIsOpen(false);
                                                    setSearchQuery("");
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left w-full",
                                                    isSelected
                                                        ? "bg-[var(--primary-bg)] text-[var(--primary)]"
                                                        : "hover:bg-gray-50 text-[var(--text-primary)]"
                                                )}
                                            >
                                                <div className="w-6 h-6 rounded bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border">
                                                    {option.logo ? (
                                                        <img src={option.logo} alt="" className="w-full h-full object-contain p-0.5" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase">
                                                            {option.label.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium truncate">{option.label}</p>
                                                    {option.description && (
                                                        <p className="text-xs text-[var(--text-muted)] truncate">{option.description}</p>
                                                    )}
                                                </div>
                                                {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-[var(--status-rejected)]">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-[var(--text-muted)]">{helperText}</p>
                )}
            </div>
        );
    }
);

Combobox.displayName = "Combobox";

export { Combobox };
