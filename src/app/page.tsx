"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { IntroductionSection } from "@/components/home/introduction-section";
import { FeaturesSection } from "@/components/home/features-section";
import { ActionsSection } from "@/components/home/actions-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";


export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <HeroCarousel />
      <IntroductionSection />
      <FeaturesSection />
      <ActionsSection />

      {/* Shared Background Wrapper for Testimonials & Footer */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bg-2.png')" }}
        >
          <div className="absolute inset-0 bg-white/60" />
        </div>
        <div className="relative z-10">
          <TestimonialsSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
