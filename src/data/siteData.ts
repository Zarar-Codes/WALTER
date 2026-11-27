import { OPTIMIZED_IMAGES, OptimizedImageAsset } from './optimizedImages';

export const IMAGES = OPTIMIZED_IMAGES;

export const BUSINESS_INFO = {
  name: "Walter's Landscaping",
  foundedYear: '1954',
  addressLine1: '2686B Stouffville Road',
  addressLine2: 'Stouffville, Ontario, L4A 2J4, Canada',
  phoneDisplay: '905-887-0700',
  phoneNav: '905.887.0700',
  phoneHref: 'tel:+19058870700',
  email: 'office@walterslandscaping.com',
  emailHref: 'mailto:office@walterslandscaping.com',
  hours: 'Monday–Friday, 8:00 AM–5:00 PM',
  website: 'https://walterslandscaping.com/',
  instagram: 'https://www.instagram.com/walterslandscaping/',
  facebook: 'https://www.facebook.com/on.walterslandscaping',
} as const;

export interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home', sectionId: 'home' },
  { label: 'Services', href: '#services', sectionId: 'services' },
  { label: 'Gallery', href: '#gallery', sectionId: 'gallery' },
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Our Process', href: '#process', sectionId: 'process' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
];

export interface DifferencePillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: OptimizedImageAsset;
  imageAlt: string;
  stageKey: 'design' | 'construction' | 'planting';
}

export const DIFFERENCE_PILLARS: DifferencePillar[] = [
  {
    number: '01',
    title: 'Design',
    subtitle: 'Architectural Concept & Site Vision',
    description:
      "Thoughtful landscape concepts shaped around the property, architecture, and the client's lifestyle.",
    image: IMAGES.heroBackyard,
    imageAlt:
      'Architectural residential backyard landscape featuring tiered natural stone walls, flagstone terrace, and cedar pergola',
    stageKey: 'design',
  },
  {
    number: '02',
    title: 'Construction',
    subtitle: 'Precision Stonework & Craftsmanship',
    description:
      'Experienced construction crews bring the design to life through quality workmanship and carefully selected materials.',
    image: IMAGES.constructionCraft,
    imageAlt:
      'Precision natural flagstone walkway and dry-stacked limestone retaining wall installation alongside prepared garden beds',
    stageKey: 'construction',
  },
  {
    number: '03',
    title: 'Planting & Care',
    subtitle: 'Nursery Stock & Seasonal Stewardship',
    description:
      'Beautiful planting, seasonal enhancements, and ongoing garden care help outdoor spaces thrive.',
    image: IMAGES.seasonalGarden,
    imageAlt:
      'Lush mature perennial garden beds with white hydrangeas, lavender, ornamental grasses, and sculpted shade trees',
    stageKey: 'planting',
  },
];

export type GalleryCategory =
  | 'All'
  | 'Patios & Outdoor Living'
  | 'Natural Stone & Stonework'
  | 'Gardens & Planting'
  | 'Water Features'
  | 'Outdoor Fireplaces'
  | 'Front Entrances'
  | 'Pool Surroundings';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  secondaryCategories?: Exclude<GalleryCategory, 'All'>[];
  summary: string;
  image: OptimizedImageAsset;
  alt: string;
  layoutSpan: 'featured' | 'tall' | 'standard' | 'panoramic';
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'All',
  'Patios & Outdoor Living',
  'Natural Stone & Stonework',
  'Gardens & Planting',
  'Water Features',
  'Outdoor Fireplaces',
  'Front Entrances',
  'Pool Surroundings',
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'backyard-sanctuary',
    title: 'Tiered Flagstone Terrace & Cedar Pergola',
    category: 'Patios & Outdoor Living',
    secondaryCategories: ['Natural Stone & Stonework', 'Gardens & Planting'],
    summary:
      'Multi-level natural flagstone terrace, dry-stacked stone walls, custom cedar pergola, and mature perennial plantings.',
    image: IMAGES.heroBackyard,
    alt: 'Multi-level natural flagstone backyard terrace with timber pergola, stone retaining walls, and flowering garden beds',
    layoutSpan: 'featured',
  },
  {
    id: 'front-walkway',
    title: 'Natural Limestone Entrance & Boxwood Borders',
    category: 'Front Entrances',
    secondaryCategories: ['Natural Stone & Stonework'],
    summary:
      'Curving limestone walkway, wide stone entry steps, and structured four-season foundation greenery.',
    image: IMAGES.frontEntrance,
    alt: 'Sweeping natural limestone front walkway with entry steps framed by boxwood hedges and flowering evergreens',
    layoutSpan: 'tall',
  },
  {
    id: 'stone-fireplace',
    title: 'Ledger-Stone Outdoor Hearth & Lounge Patio',
    category: 'Outdoor Fireplaces',
    secondaryCategories: ['Patios & Outdoor Living', 'Natural Stone & Stonework'],
    summary:
      'Hand-built natural stone outdoor fireplace anchoring an intimate flagstone patio framed by ornamental grasses.',
    image: IMAGES.stoneFireplace,
    alt: 'Custom natural stone outdoor fireplace with warm firelight beside a flagstone seating patio and manicured hedges',
    layoutSpan: 'standard',
  },
  {
    id: 'granite-waterfall',
    title: 'Natural Granite Waterfall & Woodland Pond',
    category: 'Water Features',
    secondaryCategories: ['Gardens & Planting'],
    summary:
      'Cascading granite boulders flowing into a tranquil garden pond nestled among Japanese maples, ferns, and hostas.',
    image: IMAGES.waterFeature,
    alt: 'Natural granite boulder waterfall cascading into a clear garden pond surrounded by Japanese maples and lush ferns',
    layoutSpan: 'standard',
  },
  {
    id: 'poolside-pavilion',
    title: 'Limestone Pool Surround & Cedar Privacy Hedge',
    category: 'Pool Surroundings',
    secondaryCategories: ['Patios & Outdoor Living', 'Gardens & Planting'],
    summary:
      'Precision limestone pool coping, shaded dining pavilion, emerald cedar screening, and perennial borders.',
    image: IMAGES.poolsideLiving,
    alt: 'Luxury residential pool surrounded by natural grey limestone paving, tall emerald cedar hedges, and perennial plantings',
    layoutSpan: 'panoramic',
  },
  {
    id: 'estate-perennials',
    title: 'Four-Season Estate Perennial Garden',
    category: 'Gardens & Planting',
    summary:
      'Layered white hydrangeas, lavender, and mature specimen shade trees edging a sweeping manicured lawn.',
    image: IMAGES.seasonalGarden,
    alt: 'Curving natural stone garden border overflowing with white Annabelle hydrangeas, lavender, and ornamental grasses',
    layoutSpan: 'standard',
  },
  {
    id: 'retaining-stonework',
    title: 'Dry-Stacked Limestone Retaining Wall & Walkway',
    category: 'Natural Stone & Stonework',
    summary:
      'Hand-fitted natural flagstone paving and structural limestone garden walls built for enduring Ontario seasons.',
    image: IMAGES.constructionCraft,
    alt: 'Crafted dry-stacked natural limestone retaining wall along a precision-cut flagstone garden pathway',
    layoutSpan: 'standard',
  },
  {
    id: 'twilight-courtyard',
    title: 'Illuminated Evening Patio & Garden Lighting',
    category: 'Patios & Outdoor Living',
    secondaryCategories: ['Outdoor Fireplaces'],
    summary:
      'Warm architectural path lighting, specimen tree uplighting, and an inviting evening terrace for outdoor gathering.',
    image: IMAGES.twilightGarden,
    alt: 'Twilight residential stone patio illuminated by warm architectural garden lighting and uplighted specimen trees',
    layoutSpan: 'standard',
  },
];

export interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
}

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    year: '1954',
    title: 'Swiss Craftsmanship Arrives in Canada',
    description:
      'Walter Kuettel establishes the business, bringing his Swiss gardening training and passion for thoughtful landscapes to Canada.',
  },
  {
    year: '1965',
    title: 'Expanding Roots in Thornhill',
    description:
      'The family and business move to a larger property in Thornhill as client relationships and landscape capabilities grow.',
  },
  {
    year: '1989',
    title: 'The Next Generation Takes the Helm',
    description:
      'Gordon and Chris take over the business, carrying forward the family commitment to craftsmanship, quality, and personal service.',
  },
  {
    year: 'TODAY',
    title: 'Full-Service Landscape Legacy',
    description:
      'The company continues its family-owned tradition of integrated landscape design, construction, planting, and maintenance across the GTA.',
  },
];

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  dropdownValue: string;
  highlights: string[];
  image: OptimizedImageAsset;
  imageAlt: string;
}

export const SERVICES: ServiceItem[] = [
  {
    number: '01',
    title: 'Landscape Design',
    description:
      "Every beautiful landscape begins with a thoughtful plan. Our design team works with your ideas, your property's character, and your lifestyle to create an outdoor environment that feels naturally connected to your home.",
    dropdownValue: 'Landscape Design',
    highlights: ['Site & Architecture Alignment', 'Master Garden Layouts', 'Planting & Material Pairing'],
    image: IMAGES.heroBackyard,
    imageAlt: 'Integrated residential landscape design combining stone terrace, cedar pergola, and mature gardens',
  },
  {
    number: '02',
    title: 'Landscape Construction',
    description:
      'From patios and decks to natural stone installations and retaining walls, our construction team brings landscape concepts to life with careful attention to materials, detail, and craftsmanship.',
    dropdownValue: 'Landscape Construction',
    highlights: ['Experienced In-House Crews', 'Structural Retaining Walls', 'Decks & Architectural Grading'],
    image: IMAGES.constructionCraft,
    imageAlt: 'Experienced construction team installing natural stone paving and dry-stacked retaining walls',
  },
  {
    number: '03',
    title: 'Garden Creation & Planting',
    description:
      'Bring your outdoor space to life with carefully selected trees, shrubs, perennials, and garden combinations designed to complement your property.',
    dropdownValue: 'Garden & Planting',
    highlights: ['Tree Farm Nursery Stock', 'Layered Perennial Borders', 'Mature Tree Planting'],
    image: IMAGES.seasonalGarden,
    imageAlt: 'Mature residential garden creation featuring hydrangeas, lavender, shade trees, and stone edging',
  },
  {
    number: '04',
    title: 'Patios & Outdoor Living',
    description:
      'Create inviting outdoor spaces for entertaining, relaxing, and enjoying your garden. Explore patio layouts, outdoor living arrangements, and thoughtfully integrated features.',
    dropdownValue: 'Patio & Outdoor Living',
    highlights: ['Natural Flagstone Terraces', 'Pool Surroundings', 'Dining & Lounge Spaces'],
    image: IMAGES.poolsideLiving,
    imageAlt: 'Expansive outdoor living terrace and limestone pool surround framed by emerald privacy hedges',
  },
  {
    number: '05',
    title: 'Water Features',
    description:
      'Add another dimension to your landscape with fountains, ponds, waterfalls, and water features that bring movement and atmosphere to your garden.',
    dropdownValue: 'Water Features',
    highlights: ['Natural Boulder Waterfalls', 'Garden Ponds', 'Architectural Fountains'],
    image: IMAGES.waterFeature,
    imageAlt: 'Natural granite waterfall cascading into a clear garden pond surrounded by woodland plantings',
  },
  {
    number: '06',
    title: 'Stonework & Walkways',
    description:
      'Improve the structure and visual character of your property through natural stone, walkways, retaining walls, driveways, and other hardscape elements.',
    dropdownValue: 'Stonework & Walkways',
    highlights: ['Natural Limestone Steps', 'Front Entrances & Walkways', 'Driveways & Stone Borders'],
    image: IMAGES.frontEntrance,
    imageAlt: 'Curving natural limestone front walkway and stone entry steps leading to a residential home',
  },
  {
    number: '07',
    title: 'Seasonal Planting & Garden Care',
    description:
      'Keep your outdoor space looking its best with seasonal planting, spring pruning, winterization, and garden maintenance services.',
    dropdownValue: 'Seasonal Planting & Maintenance',
    highlights: ['Spring Pruning & Clean-Up', 'Seasonal Colour Displays', 'Fall Winterization & Care'],
    image: IMAGES.treeFarm,
    imageAlt: 'Healthy Ontario nursery trees and seasonal plant material cultivated for residential gardens',
  },
  {
    number: '08',
    title: 'Outdoor Fire Features',
    description:
      'Create a welcoming outdoor environment with thoughtfully integrated fire features and gathering spaces.',
    dropdownValue: 'Outdoor Fire Features',
    highlights: ['Custom Stone Fireplaces', 'Evening Gathering Patios', 'Integrated Hearth Seating'],
    image: IMAGES.stoneFireplace,
    imageAlt: 'Custom natural stone outdoor fireplace warming an architectural backyard lounge terrace',
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  image: OptimizedImageAsset;
  imageAlt: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Initial Consultation',
    description:
      'Discuss the property, your ideas, priorities, and the type of outdoor space you want to create.',
    image: IMAGES.frontEntrance,
    imageAlt: 'Residential front entrance consultation and architectural site assessment',
  },
  {
    number: '02',
    title: 'Landscape Design',
    description:
      'Develop a design direction that considers your lifestyle, property, and outdoor requirements.',
    image: IMAGES.heroBackyard,
    imageAlt: 'Comprehensive residential backyard landscape design concept',
  },
  {
    number: '03',
    title: 'Planning & Material Selection',
    description:
      'Refine the landscape layout and consider suitable planting, stonework, and other materials.',
    image: IMAGES.treeFarm,
    imageAlt: 'Selecting healthy nursery trees and natural stone materials for landscape planning',
  },
  {
    number: '04',
    title: 'Construction & Installation',
    description:
      'The construction team brings the agreed design to life through the relevant landscape work.',
    image: IMAGES.constructionCraft,
    imageAlt: 'Skilled construction crew laying natural stone walkways and retaining walls',
  },
  {
    number: '05',
    title: 'Planting & Finishing Details',
    description:
      'Complete the landscape with planting and the finishing elements appropriate to the project.',
    image: IMAGES.waterFeature,
    imageAlt: 'Finished garden planting and natural stone water feature detailing',
  },
  {
    number: '06',
    title: 'Ongoing Garden Care',
    description:
      'Where required, seasonal planting, maintenance, pruning, and winterization help care for the landscape.',
    image: IMAGES.seasonalGarden,
    imageAlt: 'Flourishing mature estate garden maintained through seasonal pruning and planting',
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
}

// Verified authentic excerpts published on walterslandscaping.com
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tracy-don',
    quote:
      "Walter's Landscaping has done an amazing job. Gordon has managed to capture all that we wanted and has provided us with an oasis in the City. We are in awe of the transformation and we are already planning for the front of the house next spring! All of the crew members were courteous and we were very impressed... the wall along the back of the patio is getting rave reviews.",
    author: 'Tracy and Don R.',
    location: 'Toronto',
  },
  {
    id: 'brenda-p',
    quote:
      "From my initial phone inquiry to the completion of the work I have been impressed with your level of customer service and excellent workmanship. In particular the fellows who did the actual garden work were terrific and left the place spotless. I will certainly recommend Walter's to others and wouldn't hesitate to use your service again.",
    author: 'Brenda P.',
    location: 'Toronto',
  },
  {
    id: 'garry-b',
    quote:
      "Dealing with Walter's was a great experience for us and the few challenges we had were resolved effortlessly by Chris. I know yours must be a tough business because one's home is one's castle, but you get that and it is evident in all that you do. It is refreshing in this day and age to see the care that you provide without cutting corners.",
    author: 'Garry B.',
    location: 'Aurora',
  },
];

export interface ServiceAreaNode {
  id: string;
  name: string;
  role: string;
  description: string;
  x: number; // SVG coordinate (0-600)
  y: number; // SVG coordinate (0-440)
  isPrimary?: boolean;
}

export const SERVICE_AREAS: ServiceAreaNode[] = [
  {
    id: 'stouffville',
    name: 'Stouffville',
    role: 'Company Headquarters',
    description:
      'Home to our main office on Stouffville Road, coordinating residential and commercial landscape projects across the region.',
    x: 418,
    y: 168,
    isPrimary: true,
  },
  {
    id: 'newmarket',
    name: 'Newmarket',
    role: "Walter's Tree Farm",
    description:
      'Location of our own tree farm, where nursery stock is grown and integrated directly into our landscape projects.',
    x: 296,
    y: 66,
    isPrimary: true,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    role: 'York Region Community',
    description:
      'Serving residential estates and properties throughout Aurora with full landscape design, stonework, and seasonal garden care.',
    x: 288,
    y: 132,
  },
  {
    id: 'richmond-hill',
    name: 'Richmond Hill',
    role: 'York Region Community',
    description:
      'Complete outdoor living, natural stone walkways, mature planting, and ongoing landscape maintenance in Richmond Hill.',
    x: 274,
    y: 214,
  },
  {
    id: 'markham',
    name: 'Markham',
    role: 'York Region Community',
    description:
      'Integrated design-build patios, front entrances, garden creation, and commercial landscape care across Markham.',
    x: 374,
    y: 244,
  },
  {
    id: 'north-york',
    name: 'North York',
    role: 'Greater Toronto Area',
    description:
      'Transforming urban and estate properties across North York with bespoke gardens, stonework, and four-season planting.',
    x: 262,
    y: 292,
  },
  {
    id: 'toronto',
    name: 'Toronto',
    role: 'Greater Toronto Area',
    description:
      'Creating private outdoor sanctuaries, patios, natural stone walls, and lush city gardens across Toronto neighbourhoods.',
    x: 254,
    y: 368,
    isPrimary: true,
  },
];

export const PROJECT_TYPE_OPTIONS = [
  'Landscape Design',
  'Landscape Construction',
  'Patio & Outdoor Living',
  'Garden & Planting',
  'Water Features',
  'Stonework & Walkways',
  'Driveway',
  'Outdoor Fire Features',
  'Seasonal Planting & Maintenance',
  'Other',
] as const;
