"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface UserPenIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface UserPenIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const userVariants: Variants = {
    normal: { opacity: 1, y: 0 },
    animate: {
        opacity: [0.5, 1],
        y: [2, 0],
        transition: { duration: 0.6, repeat: Infinity, repeatDelay: 1.5 },
    },
};

const penVariants: Variants = {
    normal: { opacity: 1, x: 0, y: 0 },
    animate: {
        opacity: [0, 1],
        x: [5, 0],
        y: [-5, 0],
        transition: { duration: 0.8, delay: 0.3, repeat: Infinity, repeatDelay: 1.5 },
    },
};

const UserPenIcon = forwardRef<UserPenIconHandle, UserPenIconProps>(
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
                <svg
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
                    <motion.path animate={controls} d="M11.5 15H7a4 4 0 0 0-4 4v2" variants={userVariants} />
                    <motion.path
                        animate={controls}
                        d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
                        variants={penVariants}
                    />
                    <motion.circle animate={controls} cx="10" cy="7" r="4" variants={userVariants} />
                </svg>
            </div>
        );
    }
);

UserPenIcon.displayName = "UserPenIcon";
export { UserPenIcon };
