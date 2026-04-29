import { DemoPreview } from '@/components/landing/demo-preview';
import { FAQSection } from '@/components/landing/faq-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { Navbar } from '@/components/landing/navbar';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonial-section';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <DemoPreview />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <section id="faq">
        <FAQSection />
      </section>
      <Footer />
    </main>
  );
}
