"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface GlobeIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface GlobeIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const globeVariants: Variants = {
    normal: { rotate: 0 },
    animate: {
        rotate: [0, -10, 10, -5, 0],
        transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 },
    },
};

const lineVariants: Variants = {
    normal: { pathLength: 1, opacity: 1 },
    animate: {
        pathLength: [0, 1],
        opacity: [0.3, 1],
        transition: { duration: 0.8, delay: 0.2, repeat: Infinity, repeatDelay: 1.5 },
    },
};

const GlobeIcon = forwardRef<GlobeIconHandle, GlobeIconProps>(
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
                    variants={globeVariants}
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
                    <circle cx="12" cy="12" r="10" />
                    <motion.path animate={controls} d="M12 2a14.5 14.5 0 0 0 0 20" variants={lineVariants} />
                    <motion.path animate={controls} d="M12 2a14.5 14.5 0 0 1 0 20" variants={lineVariants} />
                    <motion.path animate={controls} d="M2 12h20" variants={lineVariants} />
                </motion.svg>
            </div>
        );
    }
);

GlobeIcon.displayName = "GlobeIcon";
export { GlobeIcon };
