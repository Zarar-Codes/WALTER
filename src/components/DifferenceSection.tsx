import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { DIFFERENCE_PILLARS } from '../data/siteData';
import { ResilientImage } from './ResilientImage';
import type { LandscapeStage } from './LandscapeStudio3D';

const LazyLandscapeStudio3D = lazy(() =>
  import('./LandscapeStudio3D').then((m) => ({ default: m.LandscapeStudio3D }))
);

export function DifferenceSection() {
  const [activeStage, setActiveStage] = useState<LandscapeStage>('planting');
  const [mountStudio3D, setMountStudio3D] = useState(false);
  const studioSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mountStudio3D) return;
    const el = studioSentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setMountStudio3D(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMountStudio3D(true);
          observer.disconnect();
        }
      },
      { rootMargin: '360px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mountStudio3D]);

  return (
    <section
      id="difference"
      aria-labelledby="difference-heading"
      className="bg-white py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 sm:mb-20">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-[#008F24] mb-4"
            >
              Why Walter&apos;s
            </motion.p>
            <motion.h2
              id="difference-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-[#192647] tracking-[-0.03em] leading-[1.02] text-[clamp(2.1rem,4.2vw,4rem)]"
            >
              ONE VISION.
              <br />
              EVERY STEP.
              <br />
              <span className="font-editorial italic font-medium text-[#008F24] tracking-normal">
                Beautifully
              </span>{' '}
              CONNECTED.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="lg:col-span-5"
          >
            <p className="text-base sm:text-lg text-[#242824]/80 leading-relaxed">
              Great landscapes are created when every detail works together. At
              Walter&apos;s, our design, construction, and planting teams work
              together to bring outdoor spaces to life, from the first ideas to
              the finished garden.
            </p>
          </motion.div>
        </div>

        {/* Animated Connecting Line across the 3 Stages (Desktop) */}
        <div className="hidden lg:block relative mb-8" aria-hidden="true">
          <div className="h-[1px] w-full bg-[#ECEFED]" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#192647] via-[#00C52B] to-[#008F24] origin-left"
          />
        </div>

        {/* Connected Three-Part Editorial Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {DIFFERENCE_PILLARS.map((pillar, index) => {
            const isSelected = activeStage === pillar.stageKey;
            return (
              <motion.article
                key={pillar.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col justify-between border-t border-[#ECEFED] lg:border-t-0 pt-6 lg:pt-0"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-[#192647] tabular-nums">
                      {pillar.number}
                    </span>
                    <span className="text-xs font-medium tracking-[0.14em] uppercase text-[#747B76]">
                      {pillar.subtitle}
                    </span>
                  </div>

                  {/* Editorial Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#ECEFED] mb-6">
                    <ResilientImage
                      asset={pillar.image}
                      alt={pillar.imageAlt}
                      tier="thumb"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-[1.75rem] tracking-tight text-[#192647] uppercase mb-3">
                    {pillar.number} — {pillar.title}
                  </h3>

                  <p className="text-[#242824]/78 leading-relaxed text-[15px] sm:text-base">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#ECEFED]">
                  <button
                    type="button"
                    onClick={() => {
                      setMountStudio3D(true);
                      setActiveStage(pillar.stageKey);
                    }}
                    className={`inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                      isSelected
                        ? 'text-[#008F24]'
                        : 'text-[#192647] hover:text-[#008F24]'
                    }`}
                  >
                    <span>
                      {isSelected
                        ? `Viewing Stage ${pillar.number} in 3D`
                        : `Inspect Stage ${pillar.number} in 3D`}
                    </span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Interactive 3D Architectural Landscape Concept Studio */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20 pt-14 border-t border-[#ECEFED]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#008F24] mb-2">
                From the First Design Idea to the Finished Landscape
              </p>
              <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#192647]">
                Explore How Design, Construction &amp; Planting Come Together in 3D
              </h3>
            </div>
            <p className="text-sm text-[#747B76] max-w-md">
              Toggle between architectural site planning, stone &amp; cedar
              construction, and finished garden planting across changing daylight.
            </p>
          </div>

          <div ref={studioSentinelRef} className="w-full">
            {mountStudio3D ? (
              <Suspense
                fallback={
                  <div className="w-full h-[500px] sm:h-[580px] lg:h-[640px] bg-[#121D39] border border-[#192647]/15 flex items-center justify-center text-white/75 text-xs tracking-[0.16em] uppercase">
                    Loading Interactive 3D Concept Studio...
                  </div>
                }
              >
                <LazyLandscapeStudio3D
                  activeStage={activeStage}
                  onStageChange={setActiveStage}
                />
              </Suspense>
            ) : (
              <div className="w-full h-[500px] sm:h-[580px] lg:h-[640px] bg-[#121D39] border border-[#192647]/15 flex items-center justify-center text-white/60 text-xs tracking-[0.16em] uppercase">
                Interactive 3D Concept Studio
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
