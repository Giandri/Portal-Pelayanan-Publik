"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useMotionValue, animate } from "framer-motion";
import { motion } from "framer-motion";

interface CounterItemProps {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description: string;
}

function CounterItem({ value, suffix, prefix, label, description }: CounterItemProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const count = useMotionValue(0);
    const { ref, inView } = useInView({ triggerOnce: false });

    useEffect(() => {
        if (inView) {
            animate(count, value, {
                duration: 1,
                ease: "easeInOut",
                onUpdate: (latest) => setDisplayValue(Math.round(latest)),
            });
        } else {
            setDisplayValue(0);
            count.set(0);
        }
    }, [inView, count, value]);

    return (
        <div ref={ref} className="flex flex-col items-center text-center">
            <div className="text-5xl md:text-6xl font-extrabold text-blue-950 tracking-tight mb-2">
                <NumberFlow value={displayValue} prefix={prefix} suffix={suffix} />
            </div>
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider mb-1">{label}</h3>
            <p className="text-xs text-blue-950 max-w-[200px]">{description}</p>
        </div>
    );
}

interface StatsData {
    totalPermits: number;
    totalApplicants: number;
    totalCategories: number;
    avgSatisfaction: number;
}

export function FeaturesSection() {
    const [stats, setStats] = useState<StatsData>({
        totalPermits: 0,
        totalApplicants: 0,
        totalCategories: 0,
        avgSatisfaction: 0,
    });

    useEffect(() => {
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data: StatsData) => setStats(data))
            .catch(() => {
                // Keep defaults on error
            });
    }, []);

    const items = [
        {
            value: stats.totalPermits,
            suffix: "+",
            label: "Total Pengajuan",
            description: "Permohonan yang telah diajukan masyarakat",
        },
        {
            value: 24,
            suffix: "/7",
            label: "Akses Layanan",
            description: "Layanan tersedia kapan saja untuk masyarakat",
        },
        {
            value: stats.totalCategories,
            label: "Layanan Tersedia",
            description: "Jenis kategori perizinan dan permohonan",
        },
        {
            value: stats.avgSatisfaction,
            suffix: "%",
            label: "Tingkat Kepuasan",
            description: "Kepuasan masyarakat terhadap pelayanan",
        },
    ];

    return (

        <section className="py-8 bg-yellow-400 relative overflow-hidden">

            <div
                className="absolute inset-0 opacity-10 bg-repeat bg-center"
                style={{ backgroundImage: "url('/images/bg/batik.png')" }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
                    {items.map((item) => (
                        <CounterItem
                            key={item.label}
                            value={item.value}
                            suffix={item.suffix}
                            label={item.label}
                            description={item.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
