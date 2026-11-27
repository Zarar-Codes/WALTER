import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navigation } from './components/Navigation';
import { MobileMenu } from './components/MobileMenu';
import { HeroSection } from './components/HeroSection';
import { DifferenceSection } from './components/DifferenceSection';
import { PortfolioGallery } from './components/PortfolioGallery';
import { HistorySection } from './components/HistorySection';
import { ServicesSection } from './components/ServicesSection';
import { TreeFarmSection } from './components/TreeFarmSection';
import { ProcessTimeline } from './components/ProcessTimeline';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ServiceAreasSection } from './components/ServiceAreasSection';
import { ConsultationCTA } from './components/ConsultationCTA';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { NAV_ITEMS } from './data/siteData';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [preselectedProjectType, setPreselectedProjectType] = useState('Landscape Design');

  // Smooth anchor scrolling with fixed header offset
  const scrollToSection = useCallback((sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
      return;
    }
    const element = document.getElementById(sectionId);
    if (!element) return;
    const headerOffset = 76;
    const top =
      element.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const handleSelectServiceForInquiry = useCallback(
    (projectType: string) => {
      setPreselectedProjectType(projectType);
      scrollToSection('contact');
    },
    [scrollToSection]
  );

  // Scroll-spy for active section indicator in top navigation
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.sectionId);
    const handleScroll = () => {
      const scrollMarker = window.scrollY + 180;
      let current = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollMarker) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-[#242824]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:bg-[#00C52B] focus:text-[#121D39] focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to main content
        </a>

        <Navigation
          activeSection={activeSection}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={scrollToSection}
        />

        <MobileMenu
          isOpen={mobileMenuOpen}
          activeSection={activeSection}
          onClose={() => setMobileMenuOpen(false)}
          onNavigate={scrollToSection}
        />

        <main id="main-content">
          {/* Section 01 — Cinematic Hero */}
          <HeroSection onNavigate={scrollToSection} />

          {/* Section 02 — The Walter's Difference + Interactive 3D Concept Studio */}
          <DifferenceSection />

          {/* Section 03 — Signature Project Gallery + Lightbox */}
          <PortfolioGallery />

          {/* Section 04 — Since 1954: Our Story */}
          <HistorySection />

          {/* Section 05 — Landscape Services */}
          <ServicesSection
            onSelectServiceForInquiry={handleSelectServiceForInquiry}
          />

          {/* Section 06 — The Walter's Tree Farm */}
          <TreeFarmSection onNavigate={scrollToSection} />

          {/* Section 07 — How We Work */}
          <ProcessTimeline />

          {/* Section 08 — Customer Experiences */}
          <TestimonialsSection />

          {/* Section 09 — Service Areas */}
          <ServiceAreasSection />

          {/* Section 10 — Consultation CTA */}
          <ConsultationCTA onNavigate={scrollToSection} />

          {/* Section 11 — Contact & Consultation Form */}
          <ContactForm preselectedProjectType={preselectedProjectType} />
        </main>

        {/* Section 12 — Footer */}
        <Footer onNavigate={scrollToSection} />
      </div>
    </MotionConfig>
  );
}
