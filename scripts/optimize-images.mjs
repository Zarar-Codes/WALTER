import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src', 'assets', 'images');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'optimized');
const URL_PREFIX = '/images/optimized';
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'optimizedImages.ts');

const IMAGE_MAP = {
  heroBackyard: 'hero_luxury_backyard_1795182801032.jpg',
  stoneFireplace: 'stone_patio_fireplace_1795182830026.jpg',
  waterFeature: 'natural_water_feature_1795182802043.jpg',
  frontEntrance: 'front_entrance_walkway_1795182801501.jpg',
  poolsideLiving: 'poolside_outdoor_living_1795182796164.jpg',
  treeFarm: 'tree_farm_nursery_1795182843023.jpg',
  constructionCraft: 'landscape_construction_craft_1795182798259.jpg',
  seasonalGarden: 'seasonal_garden_estate_1795182796787.jpg',
  twilightGarden: 'consultation_twilight_garden_1795182802398.jpg',
};

const TARGET_WIDTHS = [480, 960, 1600];

fs.mkdirSync(OUT_DIR, { recursive: true });

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

async function run() {
  const manifest = {};
  let totalOriginalBytes = 0;
  let totalAvif960Bytes = 0;
  let totalWebp960Bytes = 0;

  for (const [key, filename] of Object.entries(IMAGE_MAP)) {
    const inputPath = path.join(SRC_DIR, filename);
    const stat = fs.statSync(inputPath);
    totalOriginalBytes += stat.size;

    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const naturalWidth = metadata.width ?? 1600;
    const naturalHeight = metadata.height ?? 1000;

    // Extract average dominant tone for clean CSS background placeholder (zero base64 bloat)
    const stats = await sharp(inputPath).resize(24, 24, { fit: 'cover' }).stats();
    const placeholderColor = rgbToHex(
      stats.channels[0]?.mean ?? 28,
      stats.channels[1]?.mean ?? 40,
      stats.channels[2]?.mean ?? 44
    );

    const avifEntries = [];
    const webpEntries = [];
    const jpgEntries = [];

    const thumbAvifEntries = [];
    const thumbWebpEntries = [];
    const thumbJpgEntries = [];

    const widths = Array.from(
      new Set(TARGET_WIDTHS.map((w) => Math.min(w, naturalWidth)))
    ).sort((a, b) => a - b);

    for (const width of widths) {
      const baseName = `${key}_${width}w`;
      const avifFile = `${baseName}.avif`;
      const webpFile = `${baseName}.webp`;
      const jpgFile = `${baseName}.jpg`;

      const pipeline = sharp(inputPath).resize({
        width,
        withoutEnlargement: true,
      });

      const avifPath = path.join(OUT_DIR, avifFile);
      const webpPath = path.join(OUT_DIR, webpFile);
      const jpgPath = path.join(OUT_DIR, jpgFile);

      await Promise.all([
        pipeline
          .clone()
          .avif({ quality: width <= 480 ? 52 : 56, effort: 5, chromaSubsampling: '4:2:0' })
          .toFile(avifPath),
        pipeline
          .clone()
          .webp({ quality: width <= 480 ? 74 : 78, effort: 5, smartSubsample: true })
          .toFile(webpPath),
        pipeline
          .clone()
          .jpeg({ quality: width <= 480 ? 76 : 80, progressive: true, mozjpeg: true })
          .toFile(jpgPath),
      ]);

      if (width === 960 || (width === widths[widths.length - 1] && !widths.includes(960))) {
        totalAvif960Bytes += fs.statSync(avifPath).size;
        totalWebp960Bytes += fs.statSync(webpPath).size;
      }

      const avifUrl = `${URL_PREFIX}/${avifFile}`;
      const webpUrl = `${URL_PREFIX}/${webpFile}`;
      const jpgUrl = `${URL_PREFIX}/${jpgFile}`;

      avifEntries.push(`${avifUrl} ${width}w`);
      webpEntries.push(`${webpUrl} ${width}w`);
      jpgEntries.push(`${jpgUrl} ${width}w`);

      // Gallery/card thumbnail tier caps at <= 960w so thumbnails never pull full 1600w assets
      if (width <= 960) {
        thumbAvifEntries.push(`${avifUrl} ${width}w`);
        thumbWebpEntries.push(`${webpUrl} ${width}w`);
        thumbJpgEntries.push(`${jpgUrl} ${width}w`);
      }
    }

    const largestWidth = widths[widths.length - 1];
    const thumbLargestWidth = widths.filter((w) => w <= 960).pop() ?? largestWidth;

    manifest[key] = {
      id: key,
      width: naturalWidth,
      height: naturalHeight,
      placeholderColor,
      thumb: {
        avifSrcSet: thumbAvifEntries.join(', '),
        webpSrcSet: thumbWebpEntries.join(', '),
        jpgSrcSet: thumbJpgEntries.join(', '),
        fallbackSrc: `${URL_PREFIX}/${key}_${thumbLargestWidth}w.jpg`,
      },
      full: {
        avifSrcSet: avifEntries.join(', '),
        webpSrcSet: webpEntries.join(', '),
        jpgSrcSet: jpgEntries.join(', '),
        fallbackSrc: `${URL_PREFIX}/${key}_${largestWidth}w.jpg`,
      },
    };

    const origKB = (stat.size / 1024).toFixed(0);
    const avif480KB = (
      fs.statSync(path.join(OUT_DIR, `${key}_${widths[0]}w.avif`)).size / 1024
    ).toFixed(1);
    const avif960KB = (
      fs.statSync(path.join(OUT_DIR, `${key}_${thumbLargestWidth}w.avif`)).size / 1024
    ).toFixed(1);
    const avifFullKB = (
      fs.statSync(path.join(OUT_DIR, `${key}_${largestWidth}w.avif`)).size / 1024
    ).toFixed(1);
    console.log(
      `${key}: original ${origKB}KB -> AVIF ${widths[0]}w=${avif480KB}KB, ${thumbLargestWidth}w=${avif960KB}KB, ${largestWidth}w=${avifFullKB}KB (${naturalWidth}x${naturalHeight}, ${placeholderColor})`
    );
  }

  const tsContent = `// Auto-generated by scripts/optimize-images.mjs — do not hand-edit paths.

export interface ImageVariantSet {
  avifSrcSet: string;
  webpSrcSet: string;
  jpgSrcSet: string;
  fallbackSrc: string;
}

export interface OptimizedImageAsset {
  id: string;
  width: number;
  height: number;
  placeholderColor: string;
  thumb: ImageVariantSet;
  full: ImageVariantSet;
}

export const OPTIMIZED_IMAGES: Record<
  ${Object.keys(IMAGE_MAP)
    .map((k) => `'${k}'`)
    .join(' | ')},
  OptimizedImageAsset
> = ${JSON.stringify(manifest, null, 2)};

export type ImageAssetKey = keyof typeof OPTIMIZED_IMAGES;
`;

  fs.writeFileSync(MANIFEST_PATH, tsContent, 'utf8');
  console.log(
    `\nSummary: 9 originals ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB -> 960w AVIF total ${(totalAvif960Bytes / 1024).toFixed(0)} KB, WebP total ${(totalWebp960Bytes / 1024).toFixed(0)} KB.`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
