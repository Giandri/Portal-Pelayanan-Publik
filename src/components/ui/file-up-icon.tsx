"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface FileUpIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface FileUpIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const fileVariants: Variants = {
    normal: { opacity: 1 },
    animate: {
        opacity: [0.8, 1],
        transition: { duration: 0.6, repeat: Infinity, repeatDelay: 1.5 },
    },
};

const arrowVariants: Variants = {
    normal: { y: 0, opacity: 1 },
    animate: {
        y: [6, 0],
        opacity: [0, 1],
        transition: { duration: 0.8, delay: 0.25, ease: "backOut", repeat: Infinity, repeatDelay: 1.5 },
    },
};

const FileUpIcon = forwardRef<FileUpIconHandle, FileUpIconProps>(
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
                    <motion.path
                        animate={controls}
                        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                        variants={fileVariants}
                    />
                    <motion.path animate={controls} d="M14 2v4a2 2 0 0 0 2 2h4" variants={fileVariants} />
                    <motion.path animate={controls} d="M12 18v-6" variants={arrowVariants} />
                    <motion.path animate={controls} d="m9 15 3-3 3 3" variants={arrowVariants} />
                </svg>
            </div>
        );
    }
);

FileUpIcon.displayName = "FileUpIcon";
export { FileUpIcon };
