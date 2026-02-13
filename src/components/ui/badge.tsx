import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
    size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => {
        const baseStyles = "inline-flex items-center font-medium rounded-full";

        const variants = {
            default: "bg-[var(--surface)] text-[var(--text-secondary)]",
            success: "bg-[var(--status-approved-bg)] text-[var(--status-approved)]",
            warning: "bg-[var(--status-pending-bg)] text-[var(--status-pending)]",
            danger: "bg-[var(--status-rejected-bg)] text-[var(--status-rejected)]",
            info: "bg-[var(--status-process-bg)] text-[var(--status-process)]",
            outline: "border border-[var(--border)] text-[var(--text-secondary)]",
        };

        const sizes = {
            sm: "px-2 py-0.5 text-xs",
            md: "px-3 py-1 text-sm",
        };

        return (
            <span
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
