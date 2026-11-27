import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';
import { BUSINESS_INFO, IMAGES } from '../data/siteData';
import { ResilientImage } from './ResilientImage';

interface ConsultationCTAProps {
  onNavigate: (sectionId: string) => void;
}

export function ConsultationCTA({ onNavigate }: ConsultationCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="consultation-cta-heading"
      className="relative overflow-hidden bg-[#121D39] text-white py-24 sm:py-32 lg:py-40"
    >
      {/* Full-Width Cinematic Twilight Photography with Subtle Parallax */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -top-12 -bottom-12 z-0 will-change-transform"
      >
        <ResilientImage
          asset={IMAGES.twilightGarden}
          alt="Illuminated luxury residential patio and mature trees at twilight with warm architectural garden lighting"
          tier="full"
          sizes="100vw"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Measured Dark Navy Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-r from-[#121D39]/90 via-[#192647]/78 to-[#121D39]/72"
      />

      <div className="relative z-20 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00C52B] mb-5"
          >
            Let&apos;s Create Something Beautiful
          </motion.p>

          <motion.h2
            id="consultation-cta-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold tracking-[-0.03em] leading-[0.98] text-[clamp(2.3rem,5vw,4.75rem)]"
          >
            YOUR GARDEN.
            <br />
            YOUR VISION.
            <br />
            <span className="font-editorial italic font-medium text-[#00C52B] tracking-normal">
              The Walter&apos;s
            </span>{' '}
            EXPERIENCE.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="mt-6 text-base sm:text-xl text-white/88 leading-relaxed max-w-2xl"
          >
            Ready to transform your outdoor space? Start with a conversation
            about your property, your ideas, and what is possible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('contact');
              }}
              className="group inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#00C52B] hover:bg-[#008F24] text-[#121D39] hover:text-white font-display font-bold text-xs sm:text-sm tracking-[0.09em] uppercase transition-colors duration-200 whitespace-nowrap"
            >
              <span>Request a Consultation</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>

            <a
              href={BUSINESS_INFO.phoneHref}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 border border-white/45 hover:border-white bg-[#121D39]/55 hover:bg-white text-white hover:text-[#121D39] font-display font-semibold text-xs sm:text-sm tracking-[0.09em] uppercase transition-colors duration-200 whitespace-nowrap tabular-nums"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>Call {BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
