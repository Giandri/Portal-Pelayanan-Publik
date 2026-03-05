"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
    TimelineSteps,
    TimelineStepsItem,
    TimelineStepsConnector,
    TimelineStepsHeader,
    TimelineStepsIcon,
    TimelineStepsContent,
    TimelineStepsTitle,
    TimelineStepsDescription,
} from "@/components/ui/timeline-steps";
import { motion } from "framer-motion";
import { GlobeIcon, type GlobeIconHandle } from "@/components/ui/globe-icon";
import { UserPenIcon, type UserPenIconHandle } from "@/components/ui/user-pen-icon";
import { ClipboardListIcon, type ClipboardListIconHandle } from "@/components/ui/clipboard-list-icon";
import { FileUpIcon, type FileUpIconHandle } from "@/components/ui/file-up-icon";
import { SendIcon, type SendIconHandle } from "@/components/ui/send-icon";
import { ShieldCheckIcon, type ShieldCheckIconHandle } from "@/components/ui/shield-check-icon";

gsap.registerPlugin(ScrollTrigger);

type AnimatedIconHandle = {
    startAnimation: () => void;
    stopAnimation: () => void;
};

const steps = [
    {
        number: "1",
        title: "Buka Portal",
        description:
            "Masuk ke halaman Portal Pelayanan Publik BWS Bangka Belitung, www.portal-publik.bwsbabel.id",
        color: "#172554",
    },
    {
        number: "2",
        title: "Pilih Kategori",
        description: "Pilih jenis kategori permohonan atau perizinan yang Anda inginkan."
        ,
        color: "#172554",
    },
    {
        number: "3",
        title: "Isi Data Diri",
        description: "Isi data diri Anda secara lengkap sesuai kartu identitas (KTP) yang Anda miliki.",
        color: "#172554",
    },
    {
        number: "4",
        title: "Upload Dokumen",
        description:
            "Unggah dokumen pendukung yang dibutuhkan (seperti KTP dan surat lampiran pengajuan).",
        color: "#172554",
    },
    {
        number: "5",
        title: "Proses Pengajuan",
        description:
            "Tunggu proses verifikasi, permohonan Anda akan segera kami proses.",
        color: "#172554",
    },
    {
        number: "6",
        title: "Lacak Status",
        description:
            "Anda bisa pelacakan status pengajuan permohonan Anda sesuai dengan nomor lacak anda.",
        color: "#172554",
    },
];

function AnimatedIconWrapper({
    index,
    iconRef,
}: {
    index: number;
    iconRef: React.RefObject<AnimatedIconHandle | null>;
}) {
    const size = 22;
    switch (index) {
        case 0:
            return <GlobeIcon ref={iconRef as React.RefObject<GlobeIconHandle>} size={size} />;
        case 1:
            return <ClipboardListIcon ref={iconRef as React.RefObject<ClipboardListIconHandle>} size={size} />;
        case 2:
            return <UserPenIcon ref={iconRef as React.RefObject<UserPenIconHandle>} size={size} />;
        case 3:
            return <FileUpIcon ref={iconRef as React.RefObject<FileUpIconHandle>} size={size} />;
        case 4:
            return <SendIcon ref={iconRef as React.RefObject<SendIconHandle>} size={size} />;
        case 5:
            return <ShieldCheckIcon ref={iconRef as React.RefObject<ShieldCheckIconHandle>} size={size} />;
        default:
            return null;
    }
}

export function ActionsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLDivElement>(null);
    const mobileRef = useRef<HTMLDivElement>(null);
    const iconRefs = useRef<(AnimatedIconHandle | null)[]>([]);

    useGSAP(
        () => {
            if (!sectionRef.current) return;

            // ── Header entrance ──
            if (headerRef.current) {
                gsap.from(headerRef.current.children, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                });
            }

            const animateTimeline = (
                container: HTMLElement,
                startIndex: number,
                isVertical: boolean
            ) => {
                // ── Staggered step items ──
                const items = container.querySelectorAll(
                    '[data-slot="timeline-steps-item"], [data-slot="mobile-card"]'
                );


                // ── Connectors grow ──
                const connectors = container.querySelectorAll(
                    '[data-slot="timeline-steps-connector"]'
                );
                connectors.forEach((conn, i) => {
                    gsap.from(conn, {
                        [isVertical ? "scaleY" : "scaleX"]: 0,
                        transformOrigin: isVertical ? "top center" : "left center",
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: "power2.inOut",
                        scrollTrigger: {
                            trigger: conn,
                            start: "top 92%",
                            toggleActions: "play none none none",
                        },
                    });
                });

                // ── Only trigger icon animations (circles stay completely static) ──
                const iconElements = container.querySelectorAll(
                    '[data-slot="timeline-steps-icon"], [data-slot="mobile-icon"]'
                );
                iconElements.forEach((el, i) => {
                    ScrollTrigger.create({
                        trigger: el,
                        start: "top 92%",
                        onEnter: () => {
                            iconRefs.current[startIndex + i]?.startAnimation();
                        },
                    });
                });
            };

            if (desktopRef.current) {
                animateTimeline(desktopRef.current, 0, false);
            }
            if (mobileRef.current) {
                animateTimeline(mobileRef.current, steps.length, true);
            }
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className="py-20 bg-white relative overflow-hidden"
        >
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #1e3a5f 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            {/* Header */}
            <div className="container mx-auto px-4 text-center mb-12">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-4 px-2 py-1 rounded-full bg-blue-400/60  text-white text-sm font-medium mb-3"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                    Langkah-langkah
                </motion.span>
                <p className="max-w-3xl mx-auto md:text-lg text-sm text-gray-800 font-medium">
                    Ada beberapa langkah yang perlu diikuti untuk melakukan pengajuan permohonan data.
                </p>
            </div>

            {/* Desktop: Horizontal Timeline Stepper */}
            <div
                ref={desktopRef}
                className="container mx-auto px-4 relative z-10 hidden lg:block"
            >
                <TimelineSteps
                    orientation="horizontal"
                    className="gap-0 pb-4"
                >
                    {steps.map((step, index) => (
                        <TimelineStepsItem
                            key={step.number}
                            orientation="horizontal"
                            status="completed"
                            className="min-w-[160px]"
                        >
                            {index < steps.length - 1 && (
                                <TimelineStepsConnector
                                    orientation="horizontal"
                                    status="completed"
                                    className="h-[2px]! top-13! z-[1]!"
                                    style={{
                                        background: `linear-gradient(to right, ${step.color}, ${steps[index + 1].color})`,
                                    }}
                                />
                            )}

                            <TimelineStepsHeader className="flex-col gap-3">
                                <span
                                    className="text-[10px] font-bold tracking-[0.2em] uppercase block"
                                    style={{ color: step.color }}
                                >
                                    Langkah {step.number}
                                </span>
                                <TimelineStepsIcon
                                    size="lg"
                                    className="border-2 shadow-lg cursor-pointer transition-shadow duration-300 hover:shadow-xl"
                                    style={{
                                        borderColor: step.color,
                                        background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                                        color: "white",
                                    }}
                                >
                                    <AnimatedIconWrapper
                                        index={index}
                                        iconRef={{
                                            get current() {
                                                return iconRefs.current[index] ?? null;
                                            },
                                            set current(val) {
                                                iconRefs.current[index] = val;
                                            },
                                        }}
                                    />
                                </TimelineStepsIcon>
                            </TimelineStepsHeader>

                            <TimelineStepsContent className="ms-0! text-center mt-3 px-2">
                                <TimelineStepsTitle className="text-sm font-bold text-slate-800 mb-1.5">
                                    {step.title}
                                </TimelineStepsTitle>
                                <TimelineStepsDescription className="text-xs text-slate-500 leading-relaxed max-w-[180px] mx-auto">
                                    {step.description}
                                </TimelineStepsDescription>
                            </TimelineStepsContent>
                        </TimelineStepsItem>
                    ))}
                </TimelineSteps>
            </div>

            {/* Mobile: Card Layout */}
            <div
                ref={mobileRef}
                className="container mx-auto px-4 relative z-10 lg:hidden flex flex-col gap-4"
            >
                {steps.map((step, index) => (
                    <div
                        key={step.number}
                        data-slot="mobile-card"
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100/60 p-5 flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
                    >
                        <div
                            data-slot="mobile-icon"
                            className="shrink-0 flex items-center justify-center rounded-2xl size-14 shadow-sm border-2 border-white transform rotate-3 transition-transform group-hover:rotate-6"
                            style={{
                                background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                                color: "white",
                            }}
                        >
                            <AnimatedIconWrapper
                                index={index}
                                iconRef={{
                                    get current() {
                                        return iconRefs.current[index + steps.length] ?? null;
                                    },
                                    set current(val) {
                                        iconRefs.current[index + steps.length] = val;
                                    },
                                }}
                            />
                        </div>
                        <div className="flex-1 pt-1">
                            <span
                                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 block"
                                style={{ color: step.color }}
                            >
                                Langkah {step.number}
                            </span>
                            <h3 className="text-base font-bold text-slate-800 mb-1.5">
                                {step.title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed text-justify">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
