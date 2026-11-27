import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HISTORY_MILESTONES, IMAGES } from '../data/siteData';
import { ResilientImage } from './ResilientImage';

export function HistorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="story-heading"
      className="relative bg-[#192647] text-white py-20 sm:py-28 lg:py-36 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Editorial Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start mb-20 sm:mb-24">
          {/* Left Column: Story Copy + Heritage Year Anchor */}
          <div className="lg:col-span-7 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00C52B]"
            >
              A Family Legacy
            </motion.p>

            <motion.h2
              id="story-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold tracking-[-0.03em] leading-[1.0] text-[clamp(2.2rem,4.5vw,4.25rem)]"
            >
              ROOTED IN HISTORY.
              <br />
              GROWING WITH{' '}
              <span className="font-editorial italic font-medium text-[#00C52B] tracking-normal">
                Purpose.
              </span>
            </motion.h2>

            {/* Editorial "1954" Heritage Anchor */}
            <div className="flex items-baseline gap-5 py-3 border-y border-white/15">
              <span className="font-display font-bold text-5xl sm:text-7xl tracking-[-0.04em] text-[#00C52B] tabular-nums leading-none">
                1954
              </span>
              <p className="text-xs sm:text-sm tracking-[0.14em] uppercase text-white/75 leading-snug">
                Established by Walter Kuettel · Multi-Generation Family
                Leadership in the Greater Toronto Area
              </p>
            </div>

            <div className="space-y-4 text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">
              <p>
                Walter&apos;s Landscaping began in 1954 when Walter Kuettel
                brought his Swiss gardening training and passion for creating
                beautiful landscapes to Canada.
              </p>
              <p>
                What started as a small family operation grew through
                dedication, craftsmanship, and a commitment to exceptional
                customer service.
              </p>
              <p>
                Today, the family tradition continues through the next
                generation, with Gordon and Chris leading the business and
                experienced teams bringing landscape designs to life throughout
                the Greater Toronto Area.
              </p>
            </div>
          </div>

          {/* Right Column: Mature Landscape Photography with Subtle Parallax */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden aspect-[4/5] bg-[#121D39] border border-white/10">
              <motion.div
                style={{ y: imageY }}
                className="w-full h-[114%] -mt-[7%] will-change-transform"
              >
                <ResilientImage
                  asset={IMAGES.seasonalGarden}
                  alt="Mature residential estate garden crafted with natural stone edging, lush white hydrangeas, and specimen trees"
                  tier="thumb"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121D39]/90 via-[#121D39]/40 to-transparent p-6">
                <p className="font-editorial italic text-xl text-white">
                  Swiss gardening heritage meets enduring Ontario stonework and
                  horticulture.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Milestones Timeline: Horizontal on Desktop, Vertical on Mobile */}
        <div className="relative pt-4">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/70">
              Historical Milestones
            </h3>
            <span className="text-xs tracking-[0.14em] uppercase text-[#00C52B] tabular-nums">
              1954 — Today
            </span>
          </div>

          {/* Desktop Horizontal Connecting Track */}
          <div className="hidden lg:block relative mb-8" aria-hidden="true">
            <div className="h-[1px] w-full bg-white/15" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 h-[2px] w-full bg-[#00C52B] origin-left"
            />
          </div>

          <ol className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 border-l border-white/20 pl-6 lg:border-l-0 lg:pl-0">
            {HISTORY_MILESTONES.map((milestone, idx) => (
              <motion.li
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                {/* Mobile timeline tick mark */}
                <span
                  aria-hidden="true"
                  className="lg:hidden absolute -left-[29px] top-2 w-2.5 h-2.5 bg-[#00C52B]"
                />
                <span className="block font-display font-bold text-4xl sm:text-5xl tracking-[-0.03em] text-[#00C52B] tabular-nums mb-3">
                  {milestone.year}
                </span>
                <h4 className="font-display font-semibold text-lg text-white mb-2">
                  {milestone.title}
                </h4>
                <p className="text-sm sm:text-[15px] text-white/78 leading-relaxed">
                  {milestone.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
