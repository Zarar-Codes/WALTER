import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { BUSINESS_INFO, NAV_ITEMS } from '../data/siteData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#121D39] text-white border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-12">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="inline-flex items-center gap-2.5 text-white"
            >
              <span
                className="inline-block w-2.5 h-7 bg-[#00C52B]"
                aria-hidden="true"
              />
              <span className="font-display font-bold text-xl tracking-[-0.02em] uppercase">
                Walter&apos;s{' '}
                <span className="font-semibold text-white/85">Landscaping</span>
              </span>
            </a>

            <p className="text-sm sm:text-[15px] text-white/75 leading-relaxed max-w-sm">
              Family owned and operated since 1954. Creating thoughtful
              landscapes and beautiful outdoor spaces throughout the Greater
              Toronto Area.
            </p>

            <div className="flex items-center gap-5 pt-1 text-xs font-display font-semibold tracking-[0.14em] uppercase">
              <a
                href={BUSINESS_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 hover:text-[#00C52B] transition-colors"
              >
                Facebook
              </a>
              <span aria-hidden="true" className="text-white/25">
                ·
              </span>
              <a
                href={BUSINESS_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 hover:text-[#00C52B] transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#00C52B] mb-5">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.sectionId}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.sectionId);
                    }}
                    className="text-white/78 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#00C52B] mb-5">
              Contact
            </h3>
            <div className="space-y-3.5 text-sm text-white/80">
              <p className="flex items-start gap-2.5">
                <MapPin
                  className="w-4 h-4 text-[#00C52B] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  {BUSINESS_INFO.addressLine1}
                  <br />
                  {BUSINESS_INFO.addressLine2}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone
                  className="w-4 h-4 text-[#00C52B] shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="hover:text-[#00C52B] transition-colors tabular-nums"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail
                  className="w-4 h-4 text-[#00C52B] shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="hover:text-[#00C52B] transition-colors break-all"
                >
                  {BUSINESS_INFO.email}
                </a>
              </p>
            </div>
          </div>

          {/* Office Hours & Back to Top */}
          <div className="lg:col-span-2 flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#00C52B] mb-5">
                Office Hours
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {BUSINESS_INFO.hours}
              </p>
            </div>

            <button
              type="button"
              onClick={handleBackToTop}
              aria-label="Scroll back to top"
              className="group self-start inline-flex items-center gap-2.5 px-4 py-3 border border-white/20 hover:border-[#00C52B] text-xs font-display font-semibold tracking-[0.14em] uppercase text-white/85 hover:text-[#00C52B] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Back to Top</span>
              <ArrowUp
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Closing Brand Statement & Copyright */}
        <div className="pt-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <p className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-[-0.02em] uppercase leading-tight">
            CREATORS OF BEAUTIFUL GARDENS.{' '}
            <span className="text-[#00C52B] block sm:inline">SINCE 1954.</span>
          </p>

          <p className="text-xs text-white/55">
            &copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
