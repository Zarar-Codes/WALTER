import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryItem } from '../data/siteData';
import { ResilientImage } from './ResilientImage';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const isOpen = currentIndex !== null && items[currentIndex] !== undefined;
  const activeItem = isOpen ? items[currentIndex] : null;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {isOpen && activeItem && currentIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${activeItem.title}`}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-[#121D39]/96 flex flex-col justify-between p-4 sm:p-8"
        >
          {/* Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-white max-w-[1440px] w-full mx-auto"
          >
            <div className="flex items-center gap-3 text-xs sm:text-sm tracking-[0.14em] uppercase text-white/75">
              <span className="text-[#00C52B] font-semibold">
                {activeItem.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {String(currentIndex + 1).padStart(2, '0')} /{' '}
                {String(items.length).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery lightbox"
              className="inline-flex items-center justify-center w-11 h-11 border border-white/25 text-white hover:border-[#00C52B] hover:text-[#00C52B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Center Image Stage */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 flex items-center justify-center my-4 sm:my-6 max-w-[1360px] w-full mx-auto min-h-0"
          >
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous landscape photograph"
              className="hidden sm:inline-flex items-center justify-center w-12 h-12 border border-white/20 bg-[#192647]/80 text-white hover:border-[#00C52B] hover:text-[#00C52B] transition-colors mr-4 shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>

            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[68vh] w-full flex items-center justify-center overflow-hidden"
            >
              <ResilientImage
                asset={activeItem.image}
                alt={activeItem.alt}
                immediate
                tier="full"
                sizes="(max-width: 768px) 96vw, 85vw"
                wrapperClassName="max-h-[68vh] max-w-full flex items-center justify-center"
                className="max-h-[68vh] w-auto max-w-full object-contain shadow-2xl"
              />
            </motion.div>

            <button
              type="button"
              onClick={onNext}
              aria-label="Next landscape photograph"
              className="hidden sm:inline-flex items-center justify-center w-12 h-12 border border-white/20 bg-[#192647]/80 text-white hover:border-[#00C52B] hover:text-[#00C52B] transition-colors ml-4 shrink-0 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Bottom Caption & Mobile Navigation */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-[1000px] w-full mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-white/15 pt-4 text-white"
          >
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
                {activeItem.title}
              </h3>
              <p className="text-sm text-white/75 mt-1 max-w-2xl">
                {activeItem.summary}
              </p>
            </div>

            <div className="flex sm:hidden items-center gap-3 self-end">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous landscape photograph"
                className="inline-flex items-center justify-center w-11 h-11 border border-white/25 text-white hover:border-[#00C52B]"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next landscape photograph"
                className="inline-flex items-center justify-center w-11 h-11 border border-white/25 text-white hover:border-[#00C52B]"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
