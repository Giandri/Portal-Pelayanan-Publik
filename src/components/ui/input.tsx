import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, type = "text", id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    type={type}
                    id={inputId}
                    className={cn(
                        `w-full h-11 px-4 rounded-lg
            border border-[var(--border)] bg-white
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            transition-colors duration-200
            focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-bg)]
            disabled:bg-[var(--surface)] disabled:cursor-not-allowed`,
                        error && "border-[var(--status-rejected)] focus:border-[var(--status-rejected)] focus:ring-[var(--status-rejected-bg)]",
                        className
                    )}
                    {...props}
                />
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

Input.displayName = "Input";

export { Input };
