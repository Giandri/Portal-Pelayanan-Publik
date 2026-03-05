"use client";


import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getPublicSurveys } from "@/app/actions/surveys";



interface Testimonial {
    id: string;
    name: string;
    agency: string | null;
    text: string;
    rating: number;
}

export function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            const data = await getPublicSurveys();
            if (data && data.length > 0) {
                setTestimonials(data);
            }
        };
        fetchTestimonials();
    }, []);

    if (testimonials.length === 0) return null;

    const displayTestimonials = testimonials.length < 5
        ? [...testimonials, ...testimonials, ...testimonials] // Triple if few items to ensure smooth loop
        : [...testimonials, ...testimonials]; // Double if enough items

    return (
        <section className="py-10 overflow-hidden">
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
                    Survei
                </motion.span>
                <p className="max-w-3xl mx-auto md:text-lg text-sm text-gray-800 font-medium">
                    Beberapa hasil tingkat kepuasan masyarakat serta mitra kerja dalam menggunakan layanan publik Balai Wilayah Sungai Bangka Belitung.
                </p>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden">
                {/* Fade edges */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />

                <div
                    className="flex w-max"
                    style={{
                        "--duration": `${Math.max(30, displayTestimonials.length * 4)}s`,
                        "--gap": "1.5rem",
                        gap: "var(--gap)",
                    } as React.CSSProperties}
                >
                    {/* First row */}
                    <div className="flex shrink-0 animate-marquee" style={{ gap: "var(--gap)" } as React.CSSProperties}>
                        {displayTestimonials.map((item, idx) => (
                            <div
                                key={`a-${idx}-${item.id}`}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-left hover:shadow-xl transition-shadow duration-300 relative border border-white/50 w-[300px] md:w-[400px] shrink-0"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800 leading-tight">{item.name}</h4>
                                        {item.agency && (
                                            <p className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wide">
                                                {item.agency}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex text-yellow-400 shrink-0 ml-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < (item.rating || 5) ? "fill-current" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                                    &ldquo;{item.text}&rdquo;
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Duplicate row for seamless loop */}
                    <div className="flex shrink-0 animate-marquee" style={{ gap: "var(--gap)" } as React.CSSProperties} aria-hidden="true">
                        {displayTestimonials.map((item, idx) => (
                            <div
                                key={`b-${idx}-${item.id}`}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-left hover:shadow-xl transition-shadow duration-300 relative border border-white/50 w-[300px] md:w-[400px] shrink-0"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800 leading-tight">{item.name}</h4>
                                        {item.agency && (
                                            <p className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wide">
                                                {item.agency}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex text-yellow-400 shrink-0 ml-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < (item.rating || 5) ? "fill-current" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                                    &ldquo;{item.text}&rdquo;
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

