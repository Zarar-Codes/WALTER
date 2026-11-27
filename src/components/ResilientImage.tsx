import { useEffect, useRef, useState } from 'react';
import { Trees } from 'lucide-react';
import { OptimizedImageAsset } from '../data/optimizedImages';

interface ResilientImageProps {
  asset: OptimizedImageAsset;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  /** True ONLY for the above-the-fold LCP hero image */
  priority?: boolean;
  /** True for user-triggered overlays (e.g. Lightbox) to skip IntersectionObserver delay */
  immediate?: boolean;
  /** 'thumb' serves <=960w responsive derivatives for cards/galleries; 'full' serves up to desktop/lightbox resolution */
  tier?: 'thumb' | 'full';
  /** Responsive CSS sizes hint matched to container layout */
  sizes: string;
}

export function ResilientImage({
  asset,
  alt,
  className = '',
  wrapperClassName = 'w-full h-full',
  priority = false,
  immediate = false,
  tier = 'thumb',
  sizes,
}: ResilientImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const loadImmediately = priority || immediate;
  const [shouldLoad, setShouldLoad] = useState<boolean>(loadImmediately);
  const [isLoaded, setIsLoaded] = useState<boolean>(priority);
  const [hasError, setHasError] = useState<boolean>(false);

  // Reset error/load state if asset or tier changes (e.g. navigating Lightbox slides)
  useEffect(() => {
    setHasError(false);
    if (priority) {
      setShouldLoad(true);
      setIsLoaded(true);
      return;
    }
    if (immediate) {
      setShouldLoad(true);
    }
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    } else if (!priority) {
      setIsLoaded(false);
    }
  }, [asset.id, tier, priority, immediate]);

  // Progressive IntersectionObserver lazy loading for below-the-fold imagery
  useEffect(() => {
    if (loadImmediately || shouldLoad) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        rootMargin: '280px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadImmediately, shouldLoad]);

  const variant = tier === 'full' ? asset.full : asset.thumb;

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#192647] via-[#24345F] to-[#121D39] text-white/80 p-6 text-center ${wrapperClassName}`}
      >
        <Trees className="w-8 h-8 text-[#00C52B] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wider uppercase text-white/70 max-w-[220px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor: asset.placeholderColor }}
      className={`relative overflow-hidden ${wrapperClassName}`}
    >
      {shouldLoad && (
        <picture className="block w-full h-full">
          <source type="image/avif" srcSet={variant.avifSrcSet} sizes={sizes} />
          <source type="image/webp" srcSet={variant.webpSrcSet} sizes={sizes} />
          <img
            ref={imgRef}
            src={variant.fallbackSrc}
            srcSet={variant.jpgSrcSet}
            sizes={sizes}
            width={asset.width}
            height={asset.height}
            alt={alt}
            referrerPolicy="no-referrer"
            loading={loadImmediately ? 'eager' : 'lazy'}
            fetchPriority={priority || immediate ? 'high' : 'low'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`${className} ${
              priority
                ? 'opacity-100'
                : `transition-opacity duration-300 ease-out ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`
            }`}
          />
        </picture>
      )}
    </div>
  );
}
