import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import {
  GALLERY_CATEGORIES,
  GALLERY_ITEMS,
  GalleryCategory,
} from '../data/siteData';
import { ResilientImage } from './ResilientImage';
import { Lightbox } from './Lightbox';

export function PortfolioGallery() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(
      (item) =>
        item.category === selectedCategory ||
        item.secondaryCategories?.includes(selectedCategory)
    );
  }, [selectedCategory]);

  const handlePrev = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length
    );
  };

  const handleNext = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % filteredItems.length
    );
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="bg-[#F7F8F5] py-20 sm:py-28 lg:py-32 border-t border-[#ECEFED]"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-[#008F24] mb-4"
            >
              Selected Landscapes
            </motion.p>
            <motion.h2
              id="gallery-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-[#192647] tracking-[-0.03em] leading-[1.02] text-[clamp(2.1rem,4.2vw,4rem)]"
            >
              OUTDOOR SPACES.
              <br />
              MADE{' '}
              <span className="font-editorial italic font-medium text-[#008F24] tracking-normal">
                Extraordinary.
              </span>
            </motion.h2>
          </div>

          <div className="max-w-md space-y-3">
            <p className="text-sm sm:text-base text-[#242824]/75 leading-relaxed">
              Explore our landscape disciplines—from natural stone terraces and
              outdoor fireplaces to woodland waterfalls, front entrances, and
              four-season gardens.
            </p>
            <p className="text-xs text-[#747B76]">
              Representative architectural landscape imagery illustrating our
              core design, stonework, water feature, and planting capabilities.
            </p>
          </div>
        </div>

        {/* Interactive Category Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter landscape gallery by discipline"
          className="flex flex-wrap items-center gap-2 pb-10 border-b border-[#DCE2DC] mb-10"
        >
          {GALLERY_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setSelectedCategory(category);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 text-xs sm:text-[13px] font-medium tracking-[0.04em] transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#192647] text-white'
                    : 'bg-white text-[#242824]/80 hover:bg-[#ECEFED] hover:text-[#192647] border border-[#DCE2DC]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-7">
          {filteredItems.map((item, idx) => {
            let spanClass = 'md:col-span-6';
            let aspectClass = 'aspect-[4/3]';
            let imageSizes = '(max-width: 768px) 100vw, 50vw';

            if (selectedCategory === 'All') {
              if (item.layoutSpan === 'featured') {
                spanClass = 'md:col-span-8';
                aspectClass = 'aspect-[16/10] md:h-full md:aspect-auto md:min-h-[460px]';
                imageSizes = '(max-width: 768px) 100vw, 66vw';
              } else if (item.layoutSpan === 'tall') {
                spanClass = 'md:col-span-4';
                aspectClass = 'aspect-[3/4] md:h-full md:aspect-auto md:min-h-[460px]';
                imageSizes = '(max-width: 768px) 100vw, 33vw';
              } else if (item.layoutSpan === 'panoramic') {
                spanClass = 'md:col-span-12';
                aspectClass = 'aspect-[16/9] lg:aspect-[21/9]';
                imageSizes = '(max-width: 768px) 100vw, 94vw';
              } else if (idx === 5 || idx === 6 || idx === 7) {
                spanClass = 'md:col-span-4';
                aspectClass = 'aspect-[4/3]';
                imageSizes = '(max-width: 768px) 100vw, 33vw';
              }
            }

            return (
              <motion.figure
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`${spanClass} group relative`}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Open full-screen view: ${item.title}`}
                  className="block w-full text-left cursor-pointer focus-visible:outline-[#00C52B]"
                >
                  <div
                    className={`relative w-full ${aspectClass} overflow-hidden bg-[#192647]/10`}
                  >
                    <ResilientImage
                      asset={item.image}
                      alt={item.alt}
                      tier="thumb"
                      sizes={imageSizes}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#121D39]/80 via-[#121D39]/15 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300"
                    />

                    {/* Minimal Hover Caption Overlay */}
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#00C52B] mb-1.5">
                          {item.category}
                        </p>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-white leading-snug">
                          {item.title}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="block h-[2px] w-0 group-hover:w-20 bg-[#00C52B] transition-all duration-300 mt-2.5"
                        />
                      </div>

                      <span className="inline-flex items-center justify-center w-10 h-10 border border-white/30 bg-[#121D39]/60 text-white group-hover:bg-[#00C52B] group-hover:border-[#00C52B] group-hover:text-[#121D39] transition-all duration-300 shrink-0">
                        <ArrowUpRight
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </figcaption>
                  </div>
                </button>
              </motion.figure>
            );
          })}
        </div>

        {/* View Our Work Action */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-[#DCE2DC]">
          <p className="text-sm text-[#747B76]">
            Select any photograph above to inspect full-screen architectural
            details, or reset filters to browse all landscape categories.
          </p>
          <button
            type="button"
            onClick={() => {
              if (selectedCategory !== 'All') {
                setSelectedCategory('All');
              } else {
                setLightboxIndex(0);
              }
            }}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#192647] hover:bg-[#008F24] text-white font-display font-semibold text-xs tracking-[0.1em] uppercase transition-colors duration-200 whitespace-nowrap cursor-pointer"
          >
            <span>
              {selectedCategory !== 'All' ? 'View All Categories' : 'View Our Work'}
            </span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Lightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
