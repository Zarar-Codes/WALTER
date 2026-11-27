import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/siteData';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

const headlineLines = [
  { text: 'MORE THAN', accent: false, italic: false },
  { text: 'LANDSCAPING.', accent: false, italic: false },
  { text: 'A LEGACY OF', accent: false, italic: false },
  { text: 'BEAUTIFUL OUTDOOR SPACES.', accent: true, italic: false },
];

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);

  return (
    <section
      id="home"
      ref={heroRef}
      aria-label="Walter's Landscaping introduction"
      className="relative min-h-[100svh] w-full flex flex-col justify-end overflow-hidden bg-[#121D39] pt-28 pb-12 sm:pb-16 lg:pb-20"
    >
      {/* Background Cinematic Photography — Immediate LCP Paint with Subtle Scroll Parallax */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        initial={{ scale: 1.04 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <ResilientImage
          asset={IMAGES.heroBackyard}
          alt="Luxury Ontario residential backyard designed and built with natural flagstone patio, tiered stone walls, cedar pergola, and mature gardens"
          priority
          tier="full"
          sizes="100vw"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Measured Contrast Scrim for WCAG AA Legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-t from-[#121D39]/92 via-[#121D39]/55 to-[#121D39]/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-r from-[#121D39]/80 via-[#121D39]/35 to-transparent"
      />

      {/* Main Content Container */}
      <div className="relative z-20 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          {/* Left / Main Typographic Composition */}
          <div className="lg:col-span-9 space-y-6 sm:space-y-7">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-white/85 flex items-center gap-3"
            >
              <span className="inline-block w-8 h-[2px] bg-[#00C52B]" aria-hidden="true" />
              <span>Creators of Beautiful Gardens · Est. 1954</span>
            </motion.p>

            {/* Primary Display H1 — Line-by-Line Reveal */}
            <h1 className="font-display font-bold tracking-[-0.03em] leading-[0.98] text-white text-[clamp(2.35rem,5.4vw,5.25rem)]">
              {headlineLines.map((line, index) => (
                <span key={line.text} className="block overflow-hidden pb-1">
                  <motion.span
                    initial={{ y: '105%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{
                      duration: 0.75,
                      delay: 0.25 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`block ${
                      line.accent ? 'text-[#00C52B]' : 'text-white'
                    }`}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Supporting Positioning Statement */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-base sm:text-lg lg:text-xl text-white/88 leading-relaxed font-normal"
            >
              From thoughtful landscape design to expert construction and seasonal
              care, we bring every part of your outdoor vision together.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#gallery"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('gallery');
                }}
                className="group inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#00C52B] hover:bg-[#008F24] text-[#121D39] hover:text-white font-display font-bold text-xs sm:text-sm tracking-[0.09em] uppercase transition-colors duration-200 whitespace-nowrap"
              >
                <span>Explore Our Work</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contact');
                }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 border border-white/45 hover:border-white bg-[#121D39]/55 hover:bg-white text-white hover:text-[#121D39] font-display font-semibold text-xs sm:text-sm tracking-[0.09em] uppercase transition-colors duration-200 whitespace-nowrap"
              >
                <span>Request a Consultation</span>
              </a>
            </motion.div>
          </div>

          {/* Right Architectural Heritage Mark & Scroll Cue */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 flex lg:flex-col items-end justify-between lg:items-end lg:justify-end gap-6 pt-4 lg:pt-0 border-t border-white/15 lg:border-t-0"
          >
            <div className="text-left lg:text-right">
              <p className="font-editorial italic text-xl sm:text-2xl text-white/90 leading-snug">
                From the first design idea
                <br />
                to the finished landscape.
              </p>
              <p className="mt-2 text-xs tracking-[0.18em] uppercase text-[#00C52B] font-semibold tabular-nums">
                Family Owned · Since 1954
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('difference')}
              aria-label="Scroll to The Walter's Difference"
              className="group inline-flex items-center gap-2.5 text-xs tracking-[0.18em] uppercase text-white/75 hover:text-[#00C52B] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Scroll</span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut',
                }}
                className="inline-flex items-center justify-center w-9 h-9 border border-white/25 group-hover:border-[#00C52B] transition-colors"
              >
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </motion.span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
