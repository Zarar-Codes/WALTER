import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Mail, MapPin, Phone, X } from 'lucide-react';
import { BUSINESS_INFO, NAV_ITEMS } from '../data/siteData';

interface MobileMenuProps {
  isOpen: boolean;
  activeSection: string;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export function MobileMenu({
  isOpen,
  activeSection,
  onClose,
  onNavigate,
}: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-0 z-[70] bg-[#121D39] text-white flex flex-col justify-between overflow-y-auto"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-7 bg-[#00C52B]" aria-hidden="true" />
              <span className="font-display font-bold text-lg tracking-[-0.02em] uppercase">
                Walter&apos;s Landscaping
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="inline-flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-[#00C52B] hover:text-[#00C52B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Anchor Links */}
          <nav aria-label="Mobile navigation" className="px-5 sm:px-8 py-8 flex flex-col gap-2">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeSection === item.sectionId;
              return (
                <motion.a
                  key={item.sectionId}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * idx, duration: 0.3 }}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    onNavigate(item.sectionId);
                  }}
                  className={`flex items-center justify-between py-3.5 border-b border-white/10 font-display text-2xl sm:text-3xl font-semibold tracking-tight transition-colors ${
                    isActive ? 'text-[#00C52B]' : 'text-white hover:text-[#00C52B]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs font-sans tracking-[0.15em] text-white/40 tabular-nums">
                    0{idx + 1}
                  </span>
                </motion.a>
              );
            })}
          </nav>

          {/* Bottom Contact & CTA */}
          <div className="px-5 sm:px-8 pb-8 pt-4 space-y-5 bg-[#192647]/60 border-t border-white/10">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                onNavigate('contact');
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#00C52B] hover:bg-[#008F24] text-[#121D39] hover:text-white font-display font-bold text-sm tracking-[0.08em] uppercase transition-colors"
            >
              <span>Request a Consultation</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
              <a
                href={BUSINESS_INFO.phoneHref}
                className="inline-flex items-center gap-2.5 hover:text-[#00C52B] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#00C52B] shrink-0" aria-hidden="true" />
                <span className="tabular-nums">{BUSINESS_INFO.phoneDisplay}</span>
              </a>
              <a
                href={BUSINESS_INFO.emailHref}
                className="inline-flex items-center gap-2.5 hover:text-[#00C52B] transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-[#00C52B] shrink-0" aria-hidden="true" />
                <span className="truncate">{BUSINESS_INFO.email}</span>
              </a>
              <div className="sm:col-span-2 inline-flex items-start gap-2.5 text-white/65 text-xs">
                <MapPin className="w-4 h-4 text-[#00C52B] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {BUSINESS_INFO.addressLine1}, {BUSINESS_INFO.addressLine2}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
