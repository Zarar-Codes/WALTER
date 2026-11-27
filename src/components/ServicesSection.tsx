import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data/siteData';
import { ResilientImage } from './ResilientImage';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (projectType: string) => void;
}

export function ServicesSection({
  onSelectServiceForInquiry,
}: ServicesSectionProps) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
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
              What We Do
            </motion.p>
            <motion.h2
              id="services-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-[#192647] tracking-[-0.03em] leading-[1.02] text-[clamp(2.1rem,4.2vw,4rem)]"
            >
              FROM THE GROUND UP.
              <br />
              EVERY{' '}
              <span className="font-editorial italic font-medium text-[#008F24] tracking-normal">
                Detail
              </span>{' '}
              MATTERS.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-5 text-base sm:text-lg text-[#242824]/78 leading-relaxed"
          >
            Every outdoor space requires coordination between architecture,
            stonework, drainage, planting, and seasonal care. Explore our eight
            core landscape capabilities across residential and commercial
            properties.
          </motion.p>
        </div>

        {/* Large Horizontal Editorial Rows with Alternating Image Placement */}
        <div className="border-t border-[#DCE2DC]">
          {SERVICES.map((service, index) => {
            const isImageLeft = index % 2 === 1;
            return (
              <motion.article
                key={service.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-12 sm:py-16 border-b border-[#DCE2DC] transition-colors duration-300 hover:bg-[#F7F8F5]/75 px-0 sm:px-4 -mx-0 sm:-mx-4"
              >
                {/* Text Column */}
                <div
                  className={`lg:col-span-7 space-y-5 ${
                    isImageLeft ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#008F24] tabular-nums">
                      {service.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-[1px] w-10 bg-[#A8B3A4]"
                    />
                    <span className="text-xs font-medium tracking-[0.14em] uppercase text-[#747B76]">
                      Walter&apos;s Discipline
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-[2.1rem] tracking-[-0.02em] text-[#192647] uppercase leading-tight">
                    {service.title}
                  </h3>

                  <p className="text-base sm:text-[17px] text-[#242824]/80 leading-relaxed max-w-2xl">
                    {service.description}
                  </p>

                  {/* Clean Unboxed Metadata Highlights (Zero-Pill Discipline) */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-[13px] font-medium text-[#747B76] pt-1">
                    {service.highlights.map((hl, hlIdx) => (
                      <span key={hl} className="inline-flex items-center gap-3">
                        <span>{hl}</span>
                        {hlIdx < service.highlights.length - 1 && (
                          <span aria-hidden="true" className="text-[#008F24]">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectServiceForInquiry(service.dropdownValue)
                      }
                      className="inline-flex items-center gap-2.5 text-xs font-display font-semibold tracking-[0.12em] uppercase text-[#192647] hover:text-[#008F24] transition-colors cursor-pointer group/btn"
                    >
                      <span>Inquire About {service.title}</span>
                      <ArrowRight
                        className="w-4 h-4 text-[#008F24] transition-transform duration-200 group-hover/btn:translate-x-1.5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                {/* Editorial Landscape Photography Column */}
                <div
                  className={`lg:col-span-5 ${
                    isImageLeft ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#ECEFED]">
                    <ResilientImage
                      asset={service.image}
                      alt={service.imageAlt}
                      tier="thumb"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#00C52B] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom Services CTA */}
        <div className="mt-14 sm:mt-16 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#F7F8F5] border border-[#DCE2DC] p-7 sm:p-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#008F24] mb-1.5">
              Integrated Design-Build Team
            </p>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#192647] tracking-tight">
              Planning a complete property transformation or seasonal garden
              enhancement?
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onSelectServiceForInquiry('Landscape Design')}
            className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#00C52B] hover:bg-[#008F24] text-[#121D39] hover:text-white font-display font-bold text-xs sm:text-sm tracking-[0.09em] uppercase transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Discuss Your Landscape Project</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
