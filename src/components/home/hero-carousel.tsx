"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
    image: string;
    title: string;
    description: string;
}

const slides: Slide[] = [
    {
        image: "/images/img-1.png",
        title: "Bendung Panti Rao",
        description: "Bendung Irigasi Panti Rao, Kabupaten Pasaman, Luas Sawah Irigasi 8300 Ha",
    },
    {
        image: "/images/img-2.png",
        title: "Waduk Pembangunan",
        description: "Infrastruktur pengelolaan sumber daya air untuk kesejahteraan masyarakat",
    },
    {
        image: "/images/img-3.png",
        title: "Sistem Irigasi Modern",
        description: "Mendukung ketahanan pangan nasional melalui pengelolaan air berkelanjutan",
    },
];

export function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance required (in px)
    const minSwipeDistance = 50;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Touch handlers
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
            setIsAutoPlaying(false);
        } else if (isRightSwipe) {
            prevSlide();
            setIsAutoPlaying(false);
        }
    };

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 8000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <section
            className="relative h-[80vh] min-h-[500px] w-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Slides */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-gray-900">
                        <Image
                            src={slides[currentIndex].image}
                            alt={slides[currentIndex].title}
                            fill
                            quality={100}
                            sizes="100vw"
                            className="object-cover"
                            priority
                            unoptimized
                        />
                    </div>

                    {/* Gradient Overlay - Bottom Only */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Center Hook Text */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-4 px-2 py-1 rounded-full bg-yellow-300/40  text-white text-sm font-medium mb-3"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                        </svg>
                        Selamat Datang di
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                    >
                        Portal <span className="text-yellow-400">Pengajuan</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-white max-w-2xl mx-auto"
                    >
                        Sistem Informasi Pelayanan Publik Terpadu untuk Pengelolaan Sumber Daya Air
                    </motion.p>
                </div>
            </div>




            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            goToSlide(index);
                            setIsAutoPlaying(false);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                            ? "bg-white w-8"
                            : "bg-white/50 hover:bg-white/70"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
