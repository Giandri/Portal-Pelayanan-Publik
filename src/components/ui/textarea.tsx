import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, id, ...props }, ref) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        `w-full min-h-[120px] px-4 py-3 rounded-lg
            border border-[var(--border)] bg-white
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            transition-colors duration-200 resize-y
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

Textarea.displayName = "Textarea";

export { Textarea };
