"use client";


import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { IntroductionSection } from "@/components/home/introduction-section";
import { FeaturesSection } from "@/components/home/features-section";
import { ActionsSection } from "@/components/home/actions-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FloatingContact } from "@/components/layout/floating-contact";
import { GratifikasiAlert } from "@/components/home/gratifikasi-alert";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <GratifikasiAlert />
      <Navbar />
      <HeroCarousel />

      {/* Floating Navigation Dock (Desktop & Mobile) */}


      <IntroductionSection />
      <FeaturesSection />
      <ActionsSection />



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

      <FloatingContact />
    </div>
  );
}
