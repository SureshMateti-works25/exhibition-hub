export type UserRole = 'customer' | 'vendor' | 'admin' | 'auditor' | 'event_host';
export type AppMode = 'demo' | 'real';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  maskedPhone: string;
  email?: string;
  stallId?: string;
  stallNumber?: string;
  businessName?: string;
  staffRole?: StaffRole | 'owner';
  eventId?: string;
  eventName?: string;
  hostOrgName?: string;
  token: string;
  jwtClaims: {
    sub: string;
    role: UserRole;
    scope: string[];
    tenant?: string;
    eventId?: string;
    dpdp_consent: boolean;
    iat: number;
    exp: number;
  };
  mfaVerified: boolean;
}

export type LanguageCode = 'en' | 'te' | 'hi' | 'ur';

export type StallCategory =
  | 'Handlooms'
  | 'Handicrafts'
  | 'Ready-Made Garments'
  | 'Home Furnishings'
  | 'Crockery & Home Essentials'
  | 'Jewelry & Accessories'
  | 'Leather Goods & Footwear'
  | 'Electronics & Appliances'
  | 'Dry Fruits & Food Items'
  | 'Amusement & Attractions';

export interface CategoryInfo {
  id: StallCategory;
  name: string;
  nameKey: string;
  icon: string;
  color: string;
  subtypes: string[];
  bannerImage: string;
}

export interface Stall {
  id: string;
  eventId: string; // The exhibition this stall is hosted at (e.g. 'event-numaish-2027')
  stallNumber: string;
  name: string;
  tagline: string;
  category: StallCategory;
  subCategories: string[];
  sector: string;
  nearestGate: string;
  ownerName: string;
  phone: string;
  pin?: string;
  bannerImage: string;
  logoImage: string;
  description: string;
  isVerified: boolean;
  hasGiCert: boolean;
  rating: number;
  reviewCount: number;
  followersCount: number;
  dailyUpdateSnippet?: string;
  lastUpdatedTime?: string;
  // Admin governance & visibility controls
  isVisibleInStallView?: boolean;
  isProductsVisible?: boolean;
  adminStatus?: 'active' | 'suspended' | 'pending_setup';
}

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'needs_changes'
  | 'approved'
  | 'rejected'
  | 'fee_paid'
  | 'stall_allotted';

export interface VendorDocument {
  id: string;
  name: string;
  type: 'Aadhaar/PAN' | 'GST' | 'FSSAI' | 'Handloom Mark / GI Tag' | 'Trade License';
  status: 'verified' | 'pending' | 'needs_revision';
  fileUrl: string;
  uploadedAt: string;
}

export interface StallApplication {
  id: string;
  eventId: string; // The exhibition this application is for
  eventName?: string;
  applicationNumber: string;
  vendorName: string;
  businessName: string;
  mobile: string;
  email: string;
  category: StallCategory;
  subCategory: string;
  stallSizePreference: 'Standard (10x10 ft)' | 'Prime Corner (15x15 ft)' | 'Double Stall (20x10 ft)' | 'Food Stall Special';
  craftCertification?: string;
  fssaiNumber?: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  status: ApplicationStatus;
  allottedStallNumber?: string;
  allottedSector?: string;
  feeAmount: number;
  feePaid: boolean;
  paymentTxnId?: string;
  documents: VendorDocument[];
  submittedAt: string;
  updatedAt: string;
  reviewerNotes?: string;
}

export interface ProductAttribute {
  key: string;
  label: string;
  value: string;
}

export interface ProductImageAngle {
  url: string;
  name: string; // e.g. "Front Drape", "Pallu & Zari Detail", "Fabric Weave Close-up", "Pleats & Fall", "Blouse Piece"
}

export interface ColorVariation {
  id: string;
  name: string; // e.g. "Royal Peacock Blue", "Rani Magenta", "Emerald Green", "Mustard Gold"
  hexCode?: string; // e.g. "#1e3a8a", "#be185d", "#047857"
  image?: string; // Optional specific photo for this color
  inStock?: boolean;
}

export interface SizeVariation {
  id: string;
  name: string; // e.g. "Standard Saree (5.5m + 0.8m Blouse)", "Free Size", "S", "M", "L", "XL"
  inStock?: boolean;
}

export interface Product {
  id: string;
  eventId?: string; // Optional direct event reference (matches stall.eventId)
  stallId: string;
  stallName: string;
  stallNumber: string;
  category: StallCategory;
  subCategory: string;
  title: string;
  description: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  imageAngles?: ProductImageAngle[]; // Up to 5 images with named angles
  colorVariations?: ColorVariation[]; // Available color variations
  sizeVariations?: SizeVariation[]; // Available size / measurement variations
  tags: string[];
  attributes: ProductAttribute[];
  isVerifiedStall: boolean;
  hasGiTag?: boolean;
  rating: number;
  reviewCount: number;
}

export interface DailyStory {
  id: string;
  eventId?: string; // Optional direct event reference
  stallId: string;
  stallName: string;
  stallNumber: string;
  vendorName: string;
  category: StallCategory;
  mediaUrl: string;
  caption: string;
  discountTag?: string;
  timeAgo: string;
  likes: number;
  isHotDeal: boolean;
  featuredProductId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderFulfillmentType = 'stall_pickup' | 'home_delivery';
export type PaymentMode = 'upi' | 'card' | 'pay_at_stall';
export type OrderStatus = 'received' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  fulfillmentType: OrderFulfillmentType;
  paymentMode: PaymentMode;
  paymentStatus: 'paid' | 'pending_at_stall';
  status: OrderStatus;
  pickupStallNumber?: string;
  deliveryAddress?: string;
  createdAt: string;
  otpCode: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'Admin' | 'Vendor' | 'Auditor' | 'System';
  action: string;
  entityType: 'Application' | 'StallAllotment' | 'Product' | 'PriceChange' | 'Compliance' | 'Staff' | 'Gallery';
  entityId: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  hash: string;
}

export type StaffRole = 'stall_manager' | 'sales_assistant' | 'billing_counter' | 'helper';

export interface StallStaffMember {
  id: string;
  stallId: string;
  stallNumber: string;
  name: string;
  phone: string;
  pin?: string;
  role: StaffRole;
  aadhaarLast4: string;
  photoUrl: string;
  status: 'active' | 'inactive';
  gatePassId: string;
  gatePassQr: string;
  entryGateAuthorized: string;
  addedAt: string;
  permissions: string[];
}

export type StallGalleryAlbum =
  | 'Daily Booth Setup'
  | 'Fresh Today'
  | 'Artisan Demos'
  | 'Crowd & Highlights'
  | 'Night Lights';

export interface StallGalleryItem {
  id: string;
  stallId: string;
  title: string;
  album: StallGalleryAlbum;
  imageUrl: string;
  caption: string;
  uploadedAt: string;
  dateTag: string;
  likes: number;
  taggedProductId?: string;
}

export interface GroundMapZone {
  id: string;
  sectorName: string;
  code: string;
  category: StallCategory;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  stalls: string[];
  gateProximity: string;
}

export interface EventSpecialDay {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  badgeText: string;
  badgeColor?: 'pink' | 'purple' | 'amber' | 'emerald' | 'blue' | 'rose';
  description: string;
  isLadiesOnly?: boolean;
  isFamilyOnly?: boolean;
  isDiscountDay?: boolean;
  entryRules?: string;
}

export interface EventGate {
  id: string;
  name: string;
  description: string;
}

export interface BazaarEvent {
  id: string;
  slug: string;
  name: string;
  edition?: string;
  tagline: string;
  description: string;
  categoryFocus: string[];
  
  // Host / Organizer Details
  hostOrgName: string;
  hostContactPerson: string;
  hostEmail: string;
  hostPhone: string;
  hostRegNumber: string;
  hostAddress: string;
  
  // Location & Venue Details
  venueName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  nearestMetro: string;
  nearestRailway: string;
  parkingCapacity: string;
  gates: EventGate[];
  
  // Dates & Schedule
  startDate: string;
  endDate: string;
  timingsWeekdays: string;
  timingsWeekends: string;
  
  // Special Days / Event Specific Days
  specialDays: EventSpecialDay[];
  
  // Capacity & Vendor Details
  totalStallCapacity: number;
  sectors: string[];
  vendorRentPerSqFt?: string;
  vendorApplicationDeadline?: string;
  
  // Public Amenities & Ticketing
  entryTicketPrice: number; // 0 for free
  ticketDescription?: string;
  amenities: string[];
  
  // Optional Aliases & Convenience Fields
  timings?: string;
  totalStalls?: number;
  ticketPriceAdult?: number;
  ticketPriceChild?: number;
  hostDesignation?: string;

  // Media & Status
  bannerImage: string;
  logoImage: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  isFlagship?: boolean;
  createdAt?: string;
}

export type PageRoute =
  | { name: 'home' }
  | { name: 'stalls' }
  | { name: 'products' }
  | { name: 'stall'; stallId: string }
  | { name: 'product'; productId: string }
  | { name: 'map'; zoneId?: string }
  | { name: 'cart' }
  | { name: 'apply' }
  | { name: 'auth' }
  | { name: 'privacy' }
  | { name: 'vendor' }
  | { name: 'vendor-product-form'; productId?: string }
  | { name: 'vendor-quick-drop' }
  | { name: 'vendor-gate-pass'; staffId?: string }
  | { name: 'story'; storyId: string }
  | { name: 'admin' }
  | { name: 'host-dashboard'; eventId?: string }
  | { name: 'events' }
  | { name: 'event-detail'; eventId: string }
  | { name: 'event-host-register'; eventId?: string };
