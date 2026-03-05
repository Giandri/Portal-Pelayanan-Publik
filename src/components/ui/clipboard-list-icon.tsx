"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ClipboardListIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface ClipboardListIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const clipboardVariants: Variants = {
    normal: { y: 0 },
    animate: {
        y: [0, -2, 0],
        transition: { duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 },
    },
};

const lineVariants = (delay: number): Variants => ({
    normal: { pathLength: 1, opacity: 1 },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: { duration: 0.6, delay, repeat: Infinity, repeatDelay: 1.5 },
    },
});

const ClipboardListIcon = forwardRef<ClipboardListIconHandle, ClipboardListIconProps>(
    ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
        const controls = useAnimation();
        const isControlledRef = useRef(false);

        useImperativeHandle(ref, () => {
            isControlledRef.current = true;
            return {
                startAnimation: () => controls.start("animate"),
                stopAnimation: () => controls.start("normal"),
            };
        });

        const handleMouseEnter = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) {
                    onMouseEnter?.(e);
                } else {
                    controls.start("animate");
                }
            },
            [controls, onMouseEnter]
        );

        const handleMouseLeave = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) {
                    onMouseLeave?.(e);
                } else {
                    controls.start("normal");
                }
            },
            [controls, onMouseLeave]
        );

        return (
            <div
                className={cn(className)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                <motion.svg
                    animate={controls}
                    variants={clipboardVariants}
                    fill="none"
                    height={size}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width={size}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <motion.path animate={controls} d="M12 11h4" variants={lineVariants(0.15)} />
                    <motion.path animate={controls} d="M12 16h4" variants={lineVariants(0.3)} />
                    <motion.path animate={controls} d="M8 11h.01" variants={lineVariants(0.1)} />
                    <motion.path animate={controls} d="M8 16h.01" variants={lineVariants(0.25)} />
                </motion.svg>
            </div>
        );
    }
);

ClipboardListIcon.displayName = "ClipboardListIcon";
export { ClipboardListIcon };
