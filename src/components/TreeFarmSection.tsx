import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '../data/siteData';
import { ResilientImage } from './ResilientImage';

interface TreeFarmSectionProps {
  onNavigate: (sectionId: string) => void;
}

export function TreeFarmSection({ onNavigate }: TreeFarmSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Natural subtle horizontal parallax movement on the panoramic nursery photograph
  const panoramicX = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  return (
    <section
      id="tree-farm"
      ref={sectionRef}
      aria-labelledby="tree-farm-heading"
      className="bg-[#F7F8F5] py-20 sm:py-28 lg:py-32 border-t border-[#ECEFED] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-[#008F24] mb-4"
            >
              Growing Our Own Roots
            </motion.p>
            <motion.h2
              id="tree-farm-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-[#192647] tracking-[-0.03em] leading-[1.02] text-[clamp(2.1rem,4.2vw,4rem)]"
            >
              FROM OUR TREE FARM
              <br />
              TO YOUR{' '}
              <span className="font-editorial italic font-medium text-[#008F24] tracking-normal">
                Landscape.
              </span>
            </motion.h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#747B76] mb-2">
              Newmarket, Ontario
            </p>
            <p className="text-base sm:text-lg text-[#242824]/80 leading-relaxed">
              Walter&apos;s operates its own tree farm in Newmarket, where a
              wide variety of nursery stock is grown and incorporated into
              landscape projects.
            </p>
          </div>
        </div>

        {/* Panoramic Tree Farm Image with Subtle Horizontal Parallax */}
        <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-[#192647]/10 mb-10 sm:mb-14">
          <motion.div
            style={{ x: panoramicX }}
            className="w-[108%] -ml-[4%] h-full will-change-transform"
          >
            <ResilientImage
              asset={IMAGES.treeFarm}
              alt="Rows of nursery-grown maple trees, evergreens, and ornamental plant material cultivated at a rural Ontario tree farm"
              tier="full"
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Split-Screen Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-6 flex flex-col justify-between bg-white border border-[#DCE2DC] p-7 sm:p-10 lg:p-12"
          >
            <div className="space-y-6">
              <p className="font-editorial italic text-2xl sm:text-3xl text-[#192647] leading-snug">
                &ldquo;A direct connection between cultivating healthy plant
                material and designing enduring outdoor spaces.&rdquo;
              </p>

              <p className="text-base sm:text-[17px] text-[#242824]/80 leading-relaxed">
                This connection between growing and designing allows the team to
                work with plant material as an important part of the overall
                landscape vision.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#ECEFED]">
                <div>
                  <h3 className="font-display font-bold text-sm tracking-[0.1em] uppercase text-[#192647] mb-1.5">
                    Grown for Local Conditions
                  </h3>
                  <p className="text-sm text-[#747B76] leading-relaxed">
                    Nursery stock raised in Ontario soil and climate to thrive
                    season after season across GTA properties.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-[0.1em] uppercase text-[#192647] mb-1.5">
                    Selected With Purpose
                  </h3>
                  <p className="text-sm text-[#747B76] leading-relaxed">
                    Trees, evergreens, and shrubs chosen directly alongside
                    your architectural stonework and garden plan.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-[#ECEFED]">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="group inline-flex items-center gap-2.5 text-xs font-display font-bold tracking-[0.12em] uppercase text-[#192647] hover:text-[#008F24] transition-colors cursor-pointer"
              >
                <span>Plan Your Garden &amp; Tree Planting</span>
                <ArrowRight
                  className="w-4 h-4 text-[#008F24] transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-6 relative min-h-[340px] overflow-hidden bg-[#ECEFED]"
          >
            <ResilientImage
              asset={IMAGES.seasonalGarden}
              alt="Finished residential estate garden featuring mature shade trees, hydrangeas, and structured perennial beds"
              tier="thumb"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
