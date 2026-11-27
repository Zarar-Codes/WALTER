import { useEffect, useState } from 'react';
import { Menu, Phone } from 'lucide-react';
import { BUSINESS_INFO, NAV_ITEMS } from '../data/siteData';

interface NavigationProps {
  activeSection: string;
  onOpenMobileMenu: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Navigation({
  activeSection,
  onOpenMobileMenu,
  onNavigate,
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#121D39]/96 shadow-[0_10px_30px_rgba(18,29,57,0.28)] border-b border-white/10 py-3'
          : 'bg-[#192647]/92 border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 text-white whitespace-nowrap shrink-0 group focus-visible:outline-[#00C52B]"
          aria-label="Walter's Landscaping — Home"
        >
          <span className="inline-block w-2.5 h-7 bg-[#00C52B] shrink-0 transition-transform duration-200 group-hover:scale-y-110" aria-hidden="true" />
          <span className="font-display font-bold text-lg sm:text-xl tracking-[-0.02em] uppercase">
            Walter&apos;s <span className="font-semibold text-white/85">Landscaping</span>
          </span>
        </a>

        {/* Zone 2: Primary Anchor Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.sectionId;
            return (
              <a
                key={item.sectionId}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.sectionId);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 text-[13px] font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white/75 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#00C52B] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Direct Phone + Consultation CTA */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <a
            href={BUSINESS_INFO.phoneHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-[#00C52B] transition-colors whitespace-nowrap shrink-0 tabular-nums"
          >
            <Phone className="w-3.5 h-3.5 text-[#00C52B]" aria-hidden="true" />
            <span>{BUSINESS_INFO.phoneNav}</span>
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('contact');
            }}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#00C52B] hover:bg-[#008F24] text-[#121D39] hover:text-white font-display font-semibold text-xs tracking-[0.08em] uppercase transition-colors duration-200 whitespace-nowrap shrink-0"
          >
            Request a Consultation
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-3 xl:hidden shrink-0">
          <a
            href={BUSINESS_INFO.phoneHref}
            aria-label={`Call ${BUSINESS_INFO.phoneDisplay}`}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-white/90 hover:text-[#00C52B] transition-colors"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="inline-flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-[#00C52B] hover:text-[#00C52B] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
