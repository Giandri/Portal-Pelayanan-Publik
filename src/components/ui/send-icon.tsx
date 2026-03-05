"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SendIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface SendIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

const planeVariants: Variants = {
    normal: { x: 0, y: 0 },
    animate: {
        x: [0, 3, 0],
        y: [0, -3, 0],
        transition: { duration: 1.0, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.5 },
    },
};

const lineVariants: Variants = {
    normal: { pathLength: 1, opacity: 1 },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: { duration: 0.8, delay: 0.3, repeat: Infinity, repeatDelay: 1.5 },
    },
};

const SendIcon = forwardRef<SendIconHandle, SendIconProps>(
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
                        d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
                        variants={planeVariants}
                    />
                    <motion.path animate={controls} d="m21.854 2.147-10.94 10.939" variants={lineVariants} />
                </svg>
            </div>
        );
    }
);

SendIcon.displayName = "SendIcon";
export { SendIcon };
