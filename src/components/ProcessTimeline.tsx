import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { PROCESS_STEPS } from '../data/siteData';
import { ResilientImage } from './ResilientImage';

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 60%'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="bg-white py-20 sm:py-28 lg:py-32 border-t border-[#ECEFED]"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 sm:mb-20">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-[#008F24] mb-4"
            >
              From Vision to Reality
            </motion.p>
            <motion.h2
              id="process-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-[#192647] tracking-[-0.03em] leading-[1.02] text-[clamp(2.1rem,4.2vw,4rem)]"
            >
              YOUR LANDSCAPE JOURNEY.
              <br />
              MADE{' '}
              <span className="font-editorial italic font-medium text-[#008F24] tracking-normal">
                Simple.
              </span>
            </motion.h2>
          </div>

          <p className="lg:col-span-5 text-base sm:text-lg text-[#242824]/78 leading-relaxed">
            A clear, collaborative path from initial site conversation to
            thoughtful construction, planting, and seasonal garden care.
          </p>
        </div>

        {/* Scroll-Driven Green Progress Line (Desktop Horizontal) */}
        <div className="hidden lg:block relative mb-10" aria-hidden="true">
          <div className="h-[2px] w-full bg-[#ECEFED]" />
          <motion.div
            style={{ scaleX: smoothProgress }}
            className="absolute top-0 left-0 h-[3px] w-full bg-[#00C52B] origin-left"
          />
        </div>

        {/* Responsive Process Grid: Horizontal 3x2 / 6-step Architectural Flow on Desktop, Vertical Timeline on Mobile */}
        <ol className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 border-l-2 border-[#ECEFED] pl-6 md:border-l-0 md:pl-0">
          {PROCESS_STEPS.map((step, index) => (
            <motion.li
              key={step.number}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: (index % 3) * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative group flex flex-col"
            >
              {/* Mobile Vertical Timeline Node */}
              <span
                aria-hidden="true"
                className="md:hidden absolute -left-[31px] top-1.5 w-3 h-3 bg-[#00C52B] ring-4 ring-white"
              />

              {/* Step Header & Number */}
              <div className="flex items-center justify-between border-b border-[#ECEFED] pb-3 mb-5">
                <span className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#008F24] tabular-nums">
                  {step.number}
                </span>
                <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#747B76] tabular-nums">
                  Stage {index + 1} of 6
                </span>
              </div>

              {/* Small Supporting Landscape Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#ECEFED] mb-5">
                <ResilientImage
                  asset={step.image}
                  alt={step.imageAlt}
                  tier="thumb"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <h3 className="font-display font-bold text-xl tracking-tight text-[#192647] uppercase mb-2.5">
                {step.title}
              </h3>

              <p className="text-[15px] text-[#242824]/78 leading-relaxed">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
