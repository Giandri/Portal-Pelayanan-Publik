---
description: create-component
---

# Create Component Workflow

Follow these steps to create a new component in the Portal-Pelayanan-Publik project.

1.  **Identify Component Type**: Determine if the component is an atomic UI component (`src/components/ui/`) or a business-specific component (`src/components/business/`).
2.  **Naming Convention**: Use PascalCase for the filename (e.g., `MyNewComponent.tsx`).
3.  **Template**:
    ```tsx
    "use client"; // If it has state or interactive elements

    import { cn } from "@/lib/utils";
    import { motion } from "framer-motion";

    interface MyNewComponentProps {
        className?: string;
        children?: React.ReactNode;
    }

    export function MyNewComponent({ className, children }: MyNewComponentProps) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={cn("base-styles", className)}
            >
                {children}
            </motion.div>
        );
    }
    ```
4.  **Styling**: Use Tailwind CSS 4 utility classes.
5.  **Micro-animations**: Add `framer-motion` or `gsap` for a "premium" feel as per the "Rich Aesthetics" rule.
6.  **Accessibility**: Ensure proper ARIA labels and keyboard navigation support.
