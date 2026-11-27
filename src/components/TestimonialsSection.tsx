import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '../data/siteData';

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const featured = TESTIMONIALS[activeIndex];
  const supporting = TESTIMONIALS.filter((_, idx) => idx !== activeIndex);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-[#192647] text-white py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00C52B] mb-4"
            >
              The Walter&apos;s Experience
            </motion.p>
            <motion.h2
              id="testimonials-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold tracking-[-0.03em] leading-[1.02] text-[clamp(2.1rem,4.2vw,4rem)]"
            >
              BEAUTIFUL LANDSCAPES.
              <br />
              LASTING{' '}
              <span className="font-editorial italic font-medium text-[#00C52B] tracking-normal">
                Relationships.
              </span>
            </motion.h2>
          </div>

          {/* Slider Arrows */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous client testimonial"
              className="inline-flex items-center justify-center w-12 h-12 border border-white/25 text-white hover:border-[#00C52B] hover:text-[#00C52B] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next client testimonial"
              className="inline-flex items-center justify-center w-12 h-12 border border-white/25 text-white hover:border-[#00C52B] hover:text-[#00C52B] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Featured Testimonial + Two Supporting Excerpts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Featured Large Quotation */}
          <div className="lg:col-span-7 bg-[#121D39] border border-white/12 p-8 sm:p-12 flex flex-col justify-between min-h-[340px]">
            <div>
              <span
                aria-hidden="true"
                className="block font-editorial text-7xl leading-none text-[#00C52B] -mb-4 select-none"
              >
                &ldquo;
              </span>
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={featured.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-editorial italic text-2xl sm:text-[1.85rem] leading-[1.4] text-white/95"
                >
                  {featured.quote}
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-lg text-white">
                  {featured.author}
                </p>
                <p className="text-xs tracking-[0.16em] uppercase text-[#00C52B] mt-0.5">
                  {featured.location}
                </p>
              </div>

              {/* Navigation Dots */}
              <div
                role="tablist"
                aria-label="Select featured testimonial"
                className="flex items-center gap-2.5"
              >
                {TESTIMONIALS.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeIndex}
                    aria-label={`View testimonial from ${t.author}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 transition-all duration-300 cursor-pointer ${
                      idx === activeIndex
                        ? 'w-8 bg-[#00C52B]'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Two Supporting Testimonials */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {supporting.map((item) => {
              const targetIdx = TESTIMONIALS.findIndex((t) => t.id === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(targetIdx)}
                  className="flex-1 text-left bg-[#24345F]/45 hover:bg-[#24345F]/75 border border-white/12 hover:border-[#00C52B]/60 p-7 transition-colors duration-200 flex flex-col justify-between cursor-pointer"
                >
                  <p className="text-sm sm:text-[15px] text-white/85 leading-relaxed line-clamp-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="font-display font-semibold text-sm text-white">
                      {item.author}
                    </span>
                    <span className="text-xs tracking-[0.14em] uppercase text-[#00C52B]">
                      {item.location}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
