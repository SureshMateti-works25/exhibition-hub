import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  AppMode,
  LanguageCode,
  StallCategory,
  Product,
  DailyStory,
  StallApplication,
  CartItem,
  Order,
  AuditLogItem,
  GroundMapZone,
  UserProfile,
  StallStaffMember,
  StallGalleryItem,
  Stall,
  PageRoute,
  BazaarEvent
} from '../types';
import {
  CATEGORIES_DATA,
  MOCK_PRODUCTS,
  MOCK_STORIES,
  MOCK_APPLICATIONS,
  MOCK_AUDIT_LOGS,
  GROUND_MAP_ZONES,
  TRANSLATIONS,
  MOCK_STAFF_MEMBERS,
  MOCK_STALL_GALLERY,
  MOCK_STALLS,
  MOCK_EVENTS
} from '../data/mockData';

interface AppContextType {
  // App Mode (Real Production vs Demo Showcase)
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  resetRealDatabase: () => void;
  seedRealDatabaseWithSample: () => void;

  role: UserRole;
  setRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: StallCategory | 'All';
  setSelectedCategory: (cat: StallCategory | 'All') => void;
  
  products: Product[];
  stalls: Stall[];
  stories: DailyStory[];
  applications: StallApplication[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  auditLogs: AuditLogItem[];
  staffMembers: StallStaffMember[];
  stallGallery: StallGalleryItem[];
  
  // Event Host & Multi-Event Management
  events: BazaarEvent[];
  activeEventId: string;
  activeEvent: BazaarEvent | undefined;
  setActiveEventId: (eventId: string) => void;
  addEvent: (event: BazaarEvent) => void;
  updateEvent: (eventId: string, updates: Partial<BazaarEvent>) => void;
  loginAsEventHost: (eventIdOrEmail: string, pin?: string) => { success: boolean; message: string; event?: BazaarEvent };

  // Event-Scoped Data Collections (Filtered strictly to active exhibition)
  eventStalls: Stall[];
  eventProducts: Product[];
  eventStories: DailyStory[];
  eventApplications: StallApplication[];

  // Stall Management
  addStall: (stall: Stall) => void;
  updateStall: (stallId: string, updates: Partial<Stall>) => void;
  deleteStall: (stallId: string) => void;
  selectedVendorStallId: string | null;
  setSelectedVendorStallId: (id: string | null) => void;

  customerBrowseView: 'products' | 'stalls';
  setCustomerBrowseView: (view: 'products' | 'stalls') => void;
  followedStalls: string[];
  toggleFollowStall: (stallId: string) => void;

  // Enterprise Individual Page Routing
  currentRoute: PageRoute;
  navigateTo: (route: PageRoute) => void;
  goBack: () => void;

  activeStoryModal: DailyStory | null;
  setActiveStoryModal: (story: DailyStory | null) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  activeStallModal: Stall | null;
  setActiveStallModal: (stall: Stall | null) => void;
  
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  isStallApplicationOpen: boolean;
  setIsStallApplicationOpen: (val: boolean) => void;
  isQuickDropOpen: boolean;
  setIsQuickDropOpen: (val: boolean) => void;
  isMapOpen: boolean;
  setIsMapOpen: (val: boolean) => void;
  
  selectedZone: GroundMapZone | null;
  setSelectedZone: (zone: GroundMapZone | null) => void;

  // Authentication & Privacy
  isLoggedIn: boolean;
  currentUser: UserProfile | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  isPrivacyShieldOpen: boolean;
  setIsPrivacyShieldOpen: (val: boolean) => void;
  loginAs: (role: UserRole, customIdentifier?: string, customPhone?: string) => void;
  loginAsVendor: (stallNumberOrPhone: string, pin: string) => { success: boolean; message: string; stall?: Stall };
  loginAsStaff: (staffPhoneOrGatePass: string, pin: string) => { success: boolean; message: string; staff?: StallStaffMember; stall?: Stall };
  logout: () => void;
  
  // Actions
  addToCart: (product: Product, quantity?: number, variant?: string, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  
  submitApplication: (app: Omit<StallApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'updatedAt' | 'feePaid'>) => string;
  updateApplicationStatus: (
    appId: string,
    status: StallApplication['status'],
    notes?: string,
    stallNo?: string,
    sector?: string
  ) => void;
  
  addStory: (story: Omit<DailyStory, 'id' | 'timeAgo' | 'likes'>) => void;
  likeStory: (storyId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateStock: (productId: string, newStock: number) => void;
  placeOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'otpCode'>) => Order;

  // Staff & Gate Pass Management
  addStaffMember: (staff: Omit<StallStaffMember, 'id' | 'gatePassId' | 'gatePassQr' | 'addedAt'>) => void;
  updateStaffMember: (staffId: string, updates: Partial<StallStaffMember>) => void;
  removeStaffMember: (staffId: string) => void;
  toggleStaffStatus: (staffId: string) => void;

  // Daily Stall Gallery Management
  addGalleryItem: (item: Omit<StallGalleryItem, 'id' | 'uploadedAt' | 'likes'>) => void;
  removeGalleryItem: (itemId: string) => void;
  likeGalleryItem: (itemId: string) => void;
  
  t: (key: string) => string;
}

const STORAGE_KEYS = {
  MODE: 'numaish_app_mode',
  REAL_STALLS: 'numaish_real_stalls',
  REAL_PRODUCTS: 'numaish_real_products',
  REAL_APPLICATIONS: 'numaish_real_applications',
  REAL_STORIES: 'numaish_real_stories',
  REAL_ORDERS: 'numaish_real_orders',
  REAL_STAFF: 'numaish_real_staff',
  REAL_GALLERY: 'numaish_real_gallery',
  REAL_CART: 'numaish_real_cart',
  REAL_AUDIT: 'numaish_real_audit',
  REAL_SELECTED_STALL: 'numaish_real_selected_stall',
  REAL_EVENTS: 'numaish_real_events',
  ACTIVE_EVENT_ID: 'numaish_active_event_id',
  AUTH_USER: 'numaish_auth_user',
  IS_LOGGED_IN: 'numaish_is_logged_in'
};

const getInitialMode = (): AppMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MODE);
    if (saved === 'demo' || saved === 'real') return saved;
  } catch {}
  return 'real';
};

const loadRealStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
  } catch {}
  return fallback;
};

const INITIAL_REAL_AUDIT: AuditLogItem[] = [
  {
    id: 'audit-real-init',
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    actor: 'Exhibition Society System Engine',
    actorRole: 'System',
    action: 'REAL_APPLICATION_ENV_INITIALIZED',
    entityType: 'Compliance',
    entityId: 'SYS-INIT-2027',
    details: 'Real Production Mode active with clean database and persistent browser storage. Stalls, products, and applications stored permanently.',
    previousValue: 'None',
    newValue: 'Real Mode Active',
    hash: '0x8f2d91c4a03e'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppModeState] = useState<AppMode>(getInitialMode);
  const [selectedVendorStallId, setSelectedVendorStallId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REAL_SELECTED_STALL) || null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [role, setRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (saved) {
        const u = JSON.parse(saved);
        if (u?.role) return u.role;
      }
    } catch {}
    return 'customer';
  });
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<StallCategory | 'All'>('All');
  
  const [products, setProducts] = useState<Product[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<Product[]>(STORAGE_KEYS.REAL_PRODUCTS, MOCK_PRODUCTS)
      : MOCK_PRODUCTS;
  });

  const [stalls, setStalls] = useState<Stall[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<Stall[]>(STORAGE_KEYS.REAL_STALLS, MOCK_STALLS)
      : MOCK_STALLS;
  });

  const [customerBrowseView, setCustomerBrowseView] = useState<'products' | 'stalls'>('stalls');
  const [followedStalls, setFollowedStalls] = useState<string[]>([]);
  const [activeStallModal, _setActiveStallModal] = useState<Stall | null>(null);

  const [stories, setStories] = useState<DailyStory[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<DailyStory[]>(STORAGE_KEYS.REAL_STORIES, MOCK_STORIES)
      : MOCK_STORIES;
  });

  const [applications, setApplications] = useState<StallApplication[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<StallApplication[]>(STORAGE_KEYS.REAL_APPLICATIONS, MOCK_APPLICATIONS)
      : MOCK_APPLICATIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<Order[]>(STORAGE_KEYS.REAL_ORDERS, [])
      : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<CartItem[]>(STORAGE_KEYS.REAL_CART, [])
      : [];
  });

  const [wishlist, setWishlist] = useState<string[]>([]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<AuditLogItem[]>(STORAGE_KEYS.REAL_AUDIT, INITIAL_REAL_AUDIT)
      : MOCK_AUDIT_LOGS;
  });

  const [staffMembers, setStaffMembers] = useState<StallStaffMember[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<StallStaffMember[]>(STORAGE_KEYS.REAL_STAFF, MOCK_STAFF_MEMBERS)
      : MOCK_STAFF_MEMBERS;
  });

  const [stallGallery, setStallGallery] = useState<StallGalleryItem[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<StallGalleryItem[]>(STORAGE_KEYS.REAL_GALLERY, [])
      : MOCK_STALL_GALLERY;
  });

  const [events, setEvents] = useState<BazaarEvent[]>(() => {
    const mode = getInitialMode();
    return mode === 'real'
      ? loadRealStorage<BazaarEvent[]>(STORAGE_KEYS.REAL_EVENTS, MOCK_EVENTS)
      : MOCK_EVENTS;
  });

  const [activeEventId, setActiveEventIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_EVENT_ID) || 'event-numaish-2027';
    } catch {
      return 'event-numaish-2027';
    }
  });

  const setActiveEventId = (id: string) => {
    setActiveEventIdState(id);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EVENT_ID, id);
    } catch {}
  };

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || MOCK_EVENTS[0];
  
  // Strictly Event-Scoped Collections (prevents cross-contamination across exhibitions)
  const eventStalls = stalls.filter((s) => (s.eventId || 'event-numaish-2027') === activeEventId);
  const eventProducts = products.filter((p) => {
    if (p.eventId) return p.eventId === activeEventId;
    const parent = stalls.find((s) => s.id === p.stallId || s.stallNumber === p.stallNumber);
    return (parent?.eventId || 'event-numaish-2027') === activeEventId;
  });
  const eventStories = stories.filter((st) => {
    if (st.eventId) return st.eventId === activeEventId;
    const parent = stalls.find((s) => s.id === st.stallId || s.stallNumber === st.stallNumber);
    return (parent?.eventId || 'event-numaish-2027') === activeEventId;
  });
  const eventApplications = applications.filter((a) => (a.eventId || 'event-numaish-2027') === activeEventId);

  const [activeStoryModal, _setActiveStoryModal] = useState<DailyStory | null>(null);
  const [activeProductModal, _setActiveProductModal] = useState<Product | null>(null);
  const [isCartOpen, _setIsCartOpen] = useState<boolean>(false);
  const [isStallApplicationOpen, _setIsStallApplicationOpen] = useState<boolean>(false);
  const [isQuickDropOpen, _setIsQuickDropOpen] = useState<boolean>(false);
  const [isMapOpen, _setIsMapOpen] = useState<boolean>(false);
  const [isAuthModalOpen, _setIsAuthModalOpen] = useState<boolean>(false);
  const [isPrivacyShieldOpen, _setIsPrivacyShieldOpen] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<GroundMapZone | null>(null);

  // Sync real database state with localStorage whenever mutations occur in Real Mode
  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_STALLS, JSON.stringify(stalls));
      } catch (e) {
        console.error('Failed to sync stalls', e);
      }
    }
  }, [stalls, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_PRODUCTS, JSON.stringify(products));
      } catch (e) {
        console.error('Failed to sync products', e);
      }
    }
  }, [products, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_APPLICATIONS, JSON.stringify(applications));
      } catch (e) {
        console.error('Failed to sync applications', e);
      }
    }
  }, [applications, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_STORIES, JSON.stringify(stories));
      } catch (e) {}
    }
  }, [stories, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_ORDERS, JSON.stringify(orders));
      } catch (e) {}
    }
  }, [orders, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_STAFF, JSON.stringify(staffMembers));
      } catch (e) {}
    }
  }, [staffMembers, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_GALLERY, JSON.stringify(stallGallery));
      } catch (e) {}
    }
  }, [stallGallery, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_CART, JSON.stringify(cart));
      } catch (e) {}
    }
  }, [cart, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_AUDIT, JSON.stringify(auditLogs));
      } catch (e) {}
    }
  }, [auditLogs, appMode]);

  useEffect(() => {
    if (appMode === 'real') {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_EVENTS, JSON.stringify(events));
      } catch (e) {}
    }
  }, [events, appMode]);

  useEffect(() => {
    if (selectedVendorStallId) {
      try {
        localStorage.setItem(STORAGE_KEYS.REAL_SELECTED_STALL, selectedVendorStallId);
      } catch {}
    }
  }, [selectedVendorStallId]);

  // Mode switching function
  const setAppMode = (newMode: AppMode) => {
    setAppModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, newMode);
    } catch {}

    if (newMode === 'demo') {
      setStalls(MOCK_STALLS);
      setProducts(MOCK_PRODUCTS);
      setApplications(MOCK_APPLICATIONS);
      setStories(MOCK_STORIES);
      setOrders([]);
      setStaffMembers(MOCK_STAFF_MEMBERS);
      setStallGallery(MOCK_STALL_GALLERY);
      setAuditLogs(MOCK_AUDIT_LOGS);
      setEvents(MOCK_EVENTS);
    } else {
      setStalls(loadRealStorage<Stall[]>(STORAGE_KEYS.REAL_STALLS, []));
      setProducts(loadRealStorage<Product[]>(STORAGE_KEYS.REAL_PRODUCTS, []));
      setApplications(loadRealStorage<StallApplication[]>(STORAGE_KEYS.REAL_APPLICATIONS, []));
      setStories(loadRealStorage<DailyStory[]>(STORAGE_KEYS.REAL_STORIES, []));
      setOrders(loadRealStorage<Order[]>(STORAGE_KEYS.REAL_ORDERS, []));
      setStaffMembers(loadRealStorage<StallStaffMember[]>(STORAGE_KEYS.REAL_STAFF, []));
      setStallGallery(loadRealStorage<StallGalleryItem[]>(STORAGE_KEYS.REAL_GALLERY, []));
      setAuditLogs(loadRealStorage<AuditLogItem[]>(STORAGE_KEYS.REAL_AUDIT, INITIAL_REAL_AUDIT));
      setEvents(loadRealStorage<BazaarEvent[]>(STORAGE_KEYS.REAL_EVENTS, MOCK_EVENTS));
    }
  };

  // Reset real database completely to clean slate
  const resetRealDatabase = () => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.MODE) {
        try {
          localStorage.removeItem(k);
        } catch {}
      }
    });
    setStalls([]);
    setProducts([]);
    setApplications([]);
    setStories([]);
    setOrders([]);
    setStaffMembers([]);
    setStallGallery([]);
    setCart([]);
    setEvents(MOCK_EVENTS);
    setActiveEventId('event-numaish-2027');
    setSelectedVendorStallId(null);
    setAuditLogs(INITIAL_REAL_AUDIT);
  };

  // Seed sample real stalls & products for rapid testing
  const seedRealDatabaseWithSample = () => {
    const sampleStalls: Stall[] = [
      {
        id: 'stall-real-101',
        eventId: 'event-numaish-2027',
        stallNumber: 'K-04',
        name: 'Kashmir Valley Pashmina & Shawls',
        tagline: 'Authentic GI Tagged Handwoven Kashmiri Pashmina & Walnut Crafts',
        category: 'Handlooms',
        subCategories: ['Pashmina Shawls', 'Kani Weaves', 'Cashmere Stoles'],
        sector: 'Sector Handlooms (Pavilion A)',
        nearestGate: 'Gate 2 (Ajanta Gate) • Near Main Fountain',
        ownerName: 'Ghulam Hassan Mir',
        phone: '+91 94190 23456',
        bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
        logoImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        description: 'Heritage artisans from Srinagar, Kashmir. Hand-spun pashmina with intricate papier-mâché and needle embroidery certified under Geographical Indication.',
        isVerified: true,
        hasGiCert: true,
        rating: 4.9,
        reviewCount: 38,
        followersCount: 245,
        dailyUpdateSnippet: 'Special winter shipment of genuine Pashmina shawls just unboxed!',
        lastUpdatedTime: '15m ago'
      },
      {
        id: 'stall-real-102',
        eventId: 'event-numaish-2027',
        stallNumber: 'J-12',
        name: 'Charminar Laad Bazaar Lac Bangles',
        tagline: 'Traditional Stone-Studded Lac Bangles & Nizami Bridal Sets',
        category: 'Jewelry & Accessories',
        subCategories: ['Laad Bazaar Lac Bangles', 'Bridal Chooda', 'Kundan Kada'],
        sector: 'Sector Jewelry (Pavilion B)',
        nearestGate: 'Gate 1 (Gandhi Bhavan Gate)',
        ownerName: 'Mohammed Farooq',
        phone: '+91 98490 88776',
        bannerImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
        logoImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80',
        description: 'Authentic Old Hyderabad handcrafted lac bangles crafted by hereditary artisans. Vibrant colors embedded with sparkling Austrian zircon stones.',
        isVerified: true,
        hasGiCert: true,
        rating: 4.8,
        reviewCount: 52,
        followersCount: 410,
        dailyUpdateSnippet: 'Buy 2 bridal bangle sets and receive a complimentary velvet jewellery box!',
        lastUpdatedTime: '30m ago'
      }
    ];

    const sampleProducts: Product[] = [
      {
        id: 'prod-real-1',
        eventId: 'event-numaish-2027',
        stallId: 'stall-real-101',
        stallName: 'Kashmir Valley Pashmina & Shawls',
        stallNumber: 'K-04',
        category: 'Handlooms',
        subCategory: 'Pashmina Shawls',
        title: 'Authentic Pure Pashmina Sozni Needle Embroidered Shawl',
        description: 'Grade-A 100% Changthangi Cashmere wool hand-embroidered by Kashmiri master artisans. Ultra-light, luxuriously soft and warm.',
        price: 12500,
        mrp: 16500,
        discountPercentage: 24,
        inStock: true,
        stockCount: 8,
        rating: 5.0,
        reviewCount: 14,
        images: [
          'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
        ],
        tags: ['Pashmina', 'GI Tagged', 'Cashmere', 'Kashmir', 'Heritage'],
        attributes: [
          { key: 'material', label: 'Material', value: '100% Pure Changthangi Pashmina' },
          { key: 'craft', label: 'Craft Technique', value: 'Hand-Spun & Sozni Hand-Needle' },
          { key: 'origin', label: 'Origin', value: 'Srinagar, Jammu & Kashmir' }
        ],
        isVerifiedStall: true,
        hasGiTag: true
      },
      {
        id: 'prod-real-2',
        stallId: 'stall-real-101',
        stallName: 'Kashmir Valley Pashmina & Shawls',
        stallNumber: 'K-04',
        category: 'Handlooms',
        subCategory: 'Cashmere Stoles',
        title: 'Reversible Kashmiri Floral Kani Silk-Wool Stole',
        description: 'Exquisite floral Kani design woven using traditional wooden needles. Reversible two-tone pattern suitable for all occasions.',
        price: 4800,
        mrp: 6500,
        discountPercentage: 26,
        inStock: true,
        stockCount: 15,
        rating: 4.8,
        reviewCount: 9,
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
        ],
        tags: ['Kani Stole', 'Reversible', 'Silk Wool', 'Floral'],
        attributes: [
          { key: 'material', label: 'Material', value: 'Fine Merino Wool & Silk Blend' },
          { key: 'size', label: 'Dimensions', value: '70 x 200 cm' }
        ],
        isVerifiedStall: true,
        hasGiTag: true
      },
      {
        id: 'prod-real-3',
        stallId: 'stall-real-102',
        stallName: 'Charminar Laad Bazaar Lac Bangles',
        stallNumber: 'J-12',
        category: 'Jewelry & Accessories',
        subCategory: 'Laad Bazaar Lac Bangles',
        title: 'Royal Nizami 24-Piece Bridal Lac Bangle Set',
        description: 'Handmade organic natural resin lac bangles studded with fine mirror work and Austrian micro-zircons. Hypoallergenic and lightweight.',
        price: 1450,
        mrp: 1950,
        discountPercentage: 25,
        inStock: true,
        stockCount: 22,
        rating: 4.9,
        reviewCount: 27,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
        ],
        tags: ['Lac Bangles', 'Laad Bazaar', 'Bridal', 'Charminar'],
        attributes: [
          { key: 'material', label: 'Material', value: 'Pure Lac Resin with Austrian Zircons' },
          { key: 'sizes', label: 'Sizes Available', value: '2.4, 2.6, 2.8' }
        ],
        isVerifiedStall: true,
        hasGiTag: true
      },
      {
        id: 'prod-real-4',
        stallId: 'stall-real-102',
        stallName: 'Charminar Laad Bazaar Lac Bangles',
        stallNumber: 'J-12',
        category: 'Jewelry & Accessories',
        subCategory: 'Kundan Kada',
        title: 'Handcrafted Emerald-Red Kundan Lac Kada (Pair of 2)',
        description: 'Statement openable kundan kada pair crafted over seasoned brass core with lac setting. Traditional Meenakari reverse finish.',
        price: 850,
        mrp: 1200,
        discountPercentage: 29,
        inStock: true,
        stockCount: 18,
        rating: 4.7,
        reviewCount: 12,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
        ],
        tags: ['Kundan', 'Kada', 'Meenakari', 'Bangles'],
        attributes: [
          { key: 'closure', label: 'Style', value: 'Openable Screw Kada' },
          { key: 'finish', label: 'Plating', value: 'Antique Gold with Meenakari' }
        ],
        isVerifiedStall: true,
        hasGiTag: false
      }
    ];

    setStalls(sampleStalls);
    setProducts(sampleProducts);
    setSelectedVendorStallId('stall-real-101');
    logAudit(
      'Dr. K. Srinivas (Admin)',
      'Admin',
      'SAMPLE_DATA_SEEDED_IN_REAL_MODE',
      'Compliance',
      'SEED-001',
      'Seeded 2 verified artisan stalls (Kashmir Valley Pashmina K-04 and Charminar Lac Bangles J-12) with 4 real products into the real database.',
      'Empty',
      '2 Stalls, 4 Products Seeded'
    );
  };

  const addStall = (stall: Stall) => {
    const stallWithEvent: Stall = {
      ...stall,
      eventId: stall.eventId || activeEventId || 'event-numaish-2027'
    };
    setStalls((prev) => [stallWithEvent, ...prev.filter((s) => s.id !== stallWithEvent.id)]);
    logAudit(
      stallWithEvent.ownerName,
      'Admin',
      'STALL_REGISTERED_DIRECT',
      'StallAllotment',
      stallWithEvent.stallNumber,
      `Registered exhibition stall "${stallWithEvent.name}" (${stallWithEvent.stallNumber}) under ${stallWithEvent.category} at ${stallWithEvent.sector} for event ${stallWithEvent.eventId}.`,
      'None',
      `Stall: ${stallWithEvent.stallNumber} | Category: ${stallWithEvent.category}`
    );
  };

  const deleteStall = (stallId: string) => {
    const st = stalls.find((s) => s.id === stallId);
    setStalls((prev) => prev.filter((s) => s.id !== stallId));
    setProducts((prev) => prev.filter((p) => p.stallId !== stallId));
    if (st) {
      logAudit(
        'Dr. K. Srinivas (Admin)',
        'Admin',
        'STALL_REMOVED',
        'StallAllotment',
        st.stallNumber,
        `Exhibition stall "${st.name}" (${st.stallNumber}) removed from registry.`,
        `Stall: ${st.name}`,
        'Removed'
      );
    }
  };

  const updateStall = (stallId: string, updates: Partial<Stall>) => {
    setStalls((prev) =>
      prev.map((s) => {
        if (s.id !== stallId) return s;
        const updated = { ...s, ...updates };
        logAudit(
          role === 'admin' ? 'Dr. K. Srinivas (Admin)' : `${updated.ownerName} (Stall Owner)`,
          role === 'admin' ? 'Admin' : 'Vendor',
          'STALL_DETAILS_UPDATED',
          'StallAllotment',
          updated.stallNumber,
          `Updated stall "${updated.name}" (${updated.stallNumber}): ${Object.keys(updates).join(', ')}`,
          s.name,
          updated.name
        );
        return updated;
      })
    );
  };

  const addEvent = (newEvent: BazaarEvent) => {
    setEvents((prev) => [newEvent, ...prev.filter((e) => e.id !== newEvent.id)]);
    setActiveEventId(newEvent.id);
    logAudit(
      newEvent.hostContactPerson || 'Event Organizer',
      'Admin',
      'EVENT_HOST_REGISTERED',
      'Compliance',
      newEvent.id,
      `New exhibition registered: "${newEvent.name}" by host "${newEvent.hostOrgName}" with ${newEvent.specialDays?.length || 0} special days.`,
      'None',
      `Event: ${newEvent.name} | Dates: ${newEvent.startDate} to ${newEvent.endDate}`
    );
  };

  const updateEvent = (eventId: string, updates: Partial<BazaarEvent>) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const updated = { ...e, ...updates };
        logAudit(
          'Dr. K. Srinivas (Admin)',
          'Admin',
          'EVENT_UPDATED',
          'Compliance',
          eventId,
          `Updated event details for "${updated.name}"`,
          e.name,
          updated.name
        );
        return updated;
      })
    );
  };

  // Helper to parse route from browser hash URL for deep-linking
  const getInitialRouteFromHash = (): PageRoute => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!hash || hash === 'home') return { name: 'home' };
      if (hash === 'stalls') return { name: 'stalls' };
      if (hash === 'products') return { name: 'products' };
      if (hash === 'auth') return { name: 'auth' };
      if (hash === 'vendor') return { name: 'vendor' };
      if (hash === 'admin' || hash === 'host-dashboard') return { name: 'admin' };
      if (hash === 'events') return { name: 'events' };
      if (hash === 'event-host-register') return { name: 'event-host-register' };
      if (hash === 'cart') return { name: 'cart' };
      if (hash === 'map') return { name: 'map' };
      if (hash === 'privacy') return { name: 'privacy' };
      if (hash === 'apply') return { name: 'apply' };
      if (hash.startsWith('stall/')) {
        const parts = hash.split('/');
        return { name: 'stall', stallId: parts[1] };
      }
      if (hash.startsWith('product/')) {
        const parts = hash.split('/');
        return { name: 'product', productId: parts[1] };
      }
      if (hash.startsWith('event/')) {
        const parts = hash.split('/');
        return { name: 'event-detail', eventId: parts[1] };
      }
    } catch {}
    return { name: 'home' };
  };

  // Enterprise Page Routing State & Browser History Integration
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRouteFromHash);
  const [routeHistory, setRouteHistory] = useState<PageRoute[]>([getInitialRouteFromHash()]);

  const navigateTo = (route: PageRoute) => {
    setRouteHistory((prev) => [...prev, route]);
    setCurrentRoute(route);

    try {
      if (route.name === 'home') {
        window.history.pushState(route, '', '#/');
      } else if (route.name === 'stall') {
        window.history.pushState(route, '', `#/stall/${route.stallId}`);
      } else if (route.name === 'product') {
        window.history.pushState(route, '', `#/product/${route.productId}`);
      } else if (route.name === 'event-detail') {
        window.history.pushState(route, '', `#/event/${route.eventId}`);
      } else {
        window.history.pushState(route, '', `#/${route.name}`);
      }
    } catch {}

    if (route.name === 'stall') {
      const found = stalls.find((s) => s.id === route.stallId);
      _setActiveStallModal(found || null);
    } else if (route.name === 'product') {
      const found = products.find((p) => p.id === route.productId);
      _setActiveProductModal(found || null);
    } else if (route.name === 'cart') {
      _setIsCartOpen(true);
    } else if (route.name === 'map') {
      _setIsMapOpen(true);
    } else if (route.name === 'apply') {
      _setIsStallApplicationOpen(true);
    } else if (route.name === 'auth') {
      _setIsAuthModalOpen(true);
    } else if (route.name === 'privacy') {
      _setIsPrivacyShieldOpen(true);
    } else if (route.name === 'vendor-quick-drop') {
      _setIsQuickDropOpen(true);
    } else if (route.name === 'stalls') {
      setCustomerBrowseView('stalls');
    } else if (route.name === 'products') {
      setCustomerBrowseView('products');
    } else if (route.name === 'home') {
      _setActiveStallModal(null);
      _setActiveProductModal(null);
      _setIsCartOpen(false);
      _setIsMapOpen(false);
      _setIsStallApplicationOpen(false);
      _setIsAuthModalOpen(false);
      _setIsPrivacyShieldOpen(false);
      _setIsQuickDropOpen(false);
    }

    try {
      window.history.pushState(route, '', `#/${route.name}`);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setRouteHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentRoute({ name: 'home' });
        _setActiveStallModal(null);
        _setActiveProductModal(null);
        _setIsCartOpen(false);
        _setIsMapOpen(false);
        _setIsStallApplicationOpen(false);
        _setIsAuthModalOpen(false);
        _setIsPrivacyShieldOpen(false);
        _setIsQuickDropOpen(false);
        return [{ name: 'home' }];
      }
      const nextHistory = prev.slice(0, -1);
      const target = nextHistory[nextHistory.length - 1];
      setCurrentRoute(target);

      if (target.name === 'home' || target.name === 'stalls' || target.name === 'products') {
        _setActiveStallModal(null);
        _setActiveProductModal(null);
        _setIsCartOpen(false);
        _setIsMapOpen(false);
        _setIsStallApplicationOpen(false);
        _setIsAuthModalOpen(false);
        _setIsPrivacyShieldOpen(false);
        _setIsQuickDropOpen(false);
      }
      return nextHistory;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveStallModal = (stall: Stall | null) => {
    _setActiveStallModal(stall);
    if (stall) {
      navigateTo({ name: 'stall', stallId: stall.id });
    } else if (currentRoute.name === 'stall') {
      goBack();
    }
  };

  const setActiveProductModal = (product: Product | null) => {
    _setActiveProductModal(product);
    if (product) {
      navigateTo({ name: 'product', productId: product.id });
    } else if (currentRoute.name === 'product') {
      goBack();
    }
  };

  const setIsCartOpen = (open: boolean) => {
    _setIsCartOpen(open);
    if (open) {
      navigateTo({ name: 'cart' });
    } else if (currentRoute.name === 'cart') {
      goBack();
    }
  };

  const setIsMapOpen = (open: boolean) => {
    _setIsMapOpen(open);
    if (open) {
      navigateTo({ name: 'map' });
    } else if (currentRoute.name === 'map') {
      goBack();
    }
  };

  const setIsStallApplicationOpen = (open: boolean) => {
    _setIsStallApplicationOpen(open);
    if (open) {
      navigateTo({ name: 'apply' });
    } else if (currentRoute.name === 'apply') {
      goBack();
    }
  };

  const setIsQuickDropOpen = (open: boolean) => {
    _setIsQuickDropOpen(open);
    if (open) {
      navigateTo({ name: 'vendor-quick-drop' });
    } else if (currentRoute.name === 'vendor-quick-drop') {
      goBack();
    }
  };

  const setIsAuthModalOpen = (open: boolean) => {
    _setIsAuthModalOpen(open);
    if (open) {
      navigateTo({ name: 'auth' });
    } else if (currentRoute.name === 'auth') {
      goBack();
    }
  };

  const setIsPrivacyShieldOpen = (open: boolean) => {
    _setIsPrivacyShieldOpen(open);
    if (open) {
      navigateTo({ name: 'privacy' });
    } else if (currentRoute.name === 'privacy') {
      goBack();
    }
  };

  const setActiveStoryModal = (story: DailyStory | null) => {
    _setActiveStoryModal(story);
    if (story) {
      navigateTo({ name: 'story', storyId: story.id });
    } else if (currentRoute.name === 'story') {
      goBack();
    }
  };

  useEffect(() => {
    const handleSyncFromHashOrState = (e?: Event) => {
      if (e && 'state' in e && (e as PopStateEvent).state?.name) {
        setCurrentRoute((e as PopStateEvent).state);
      } else {
        const parsed = getInitialRouteFromHash();
        setCurrentRoute(parsed);
      }
    };
    window.addEventListener('popstate', handleSyncFromHashOrState);
    window.addEventListener('hashchange', handleSyncFromHashOrState);
    return () => {
      window.removeEventListener('popstate', handleSyncFromHashOrState);
      window.removeEventListener('hashchange', handleSyncFromHashOrState);
    };
  }, []);

  // Authentication & Privacy Personas Templates
  const DEFAULT_USERS: Record<Exclude<UserRole, 'customer'>, UserProfile> = {
    vendor: {
      id: 'usr-vnd-101',
      name: 'Narsimha Rao',
      businessName: 'Pochampally Weavers Society',
      stallNumber: 'H-14',
      role: 'vendor',
      phone: '+91 98480 23145',
      maskedPhone: '+91 98480 •••••',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdGFsbC0xMDEiLCJyb2xlIjoidmVuZG9yIiwic2NvcGUiOlsiY2F0YWxvZzptYW5hZ2Vfb3duIiwic3Rvcmllczpwb3N0Iiwib3JkZXJzOnZpZXdfc3RhbGxfSDE0Il0sInRlbmFudCI6InN0YWxsX0gxNCJ9.v101_demoSignature',
      jwtClaims: {
        sub: 'usr-vnd-101',
        role: 'vendor',
        scope: ['catalog:manage_own', 'stories:post', 'orders:view_stall_H14', 'kyc:submit'],
        tenant: 'stall_H14',
        dpdp_consent: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 3
      },
      mfaVerified: true
    },
    admin: {
      id: 'usr-adm-001',
      name: 'Dr. K. Srinivas',
      email: 'k.srinivas@exhibitionsociety.com',
      role: 'admin',
      phone: '+91 94400 11223',
      maskedPhone: '+91 94400 •••••',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG0tMDAxIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOlsiYXBwbGljYXRpb25zOnJldmlldyIsInN0YWxsczphbGxvdCIsImNvbXBsaWFuY2U6bWFuYWdlIl19.a001_demoSignature',
      jwtClaims: {
        sub: 'usr-adm-001',
        role: 'admin',
        scope: ['applications:review', 'stalls:allot', 'fees:verify', 'compliance:manage', 'audit:write'],
        dpdp_consent: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 28800
      },
      mfaVerified: true
    },
    auditor: {
      id: 'usr-aud-007',
      name: 'P. R. Mohan (External DPDP Auditor)',
      email: 'auditor@deloitte-hyderabad.in',
      role: 'auditor',
      phone: '+91 98200 44556',
      maskedPhone: '+91 98200 •••••',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdWQtMDA3Iiwicm9sZSI6ImF1ZGl0b3IiLCJzY29wZSI6WyJhdWRpdDpyZWFkX29ubHkiLCJyZXBvcnRzOmV4cG9ydCJdfQ.au007_demoSignature',
      jwtClaims: {
        sub: 'usr-aud-007',
        role: 'auditor',
        scope: ['audit:read_only', 'reports:export', 'compliance:verify_hash'],
        dpdp_consent: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 14400
      },
      mfaVerified: true
    },
    event_host: {
      id: 'usr-host-numaish',
      name: 'Ashwin Margam',
      email: 'numaish.society@hyderabad.gov.in',
      role: 'event_host',
      phone: '+91 40 2460 3056',
      maskedPhone: '+91 40 2460 ••••',
      businessName: 'The Exhibition Society (Numaish)',
      hostOrgName: 'The Exhibition Society',
      eventId: 'event-numaish-2027',
      eventName: 'Numaish 2027 • 85th All India Industrial Exhibition',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.host_numaish_demoSignature',
      jwtClaims: {
        sub: 'host-numaish-2027',
        role: 'event_host',
        eventId: 'event-numaish-2027',
        scope: ['event:manage', 'stalls:allot', 'applications:review', 'schedule:manage', 'compliance:audit'],
        tenant: 'event_numaish_2027',
        dpdp_consent: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7
      },
      mfaVerified: true
    }
  };

  const loginAs = (targetRole: UserRole, customIdentifier?: string, customPhone?: string) => {
    let user: UserProfile;

    if (targetRole === 'customer') {
      const phone = (customPhone || '').trim() || (customIdentifier && /^\+?\d/.test(customIdentifier.trim()) ? customIdentifier.trim() : '+91 98765 43210');
      const displayName = customIdentifier && customIdentifier.trim() && !/^\+?\d{8,}/.test(customIdentifier.trim()) 
        ? customIdentifier.trim() 
        : `Customer (${phone.slice(-4)})`;
      user = {
        id: `usr-cust-${Date.now()}`,
        name: displayName,
        role: 'customer',
        phone: phone,
        maskedPhone: phone.length > 5 ? phone.slice(0, 6) + ' ••••• ' + phone.slice(-4) : phone,
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cust_${Date.now()}_sig`,
        jwtClaims: {
          sub: `usr-cust-${Date.now()}`,
          role: 'customer',
          scope: ['shop:browse', 'cart:checkout', 'orders:view_own'],
          dpdp_consent: true,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400 * 7
        },
        mfaVerified: true
      };
    } else if (targetRole === 'admin') {
      user = {
        ...DEFAULT_USERS.admin,
        name: customIdentifier ? `Dr. K. Srinivas (${customIdentifier})` : DEFAULT_USERS.admin.name
      };
    } else if (targetRole === 'auditor') {
      user = { ...DEFAULT_USERS.auditor };
    } else {
      user = { ...DEFAULT_USERS.vendor };
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    setRole(targetRole);

    try {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } catch {}

    logAudit(
      user.name,
      targetRole === 'customer' ? 'System' : (targetRole === 'auditor' ? 'Auditor' : (targetRole === 'admin' ? 'Admin' : 'Vendor')),
      `AUTH_LOGIN_SUCCESS_${targetRole.toUpperCase()}`,
      'Compliance',
      user.id,
      `User authenticated via ${targetRole === 'customer' || targetRole === 'vendor' ? 'SMS Mobile OTP' : 'Corporate SSO + 2FA MFA Token'}. Token issued with scope: [${user.jwtClaims.scope.join(', ')}].`,
      'Session: None',
      `Session Active | Role: ${targetRole} | DPDP Masking: Enforced`
    );
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setRole('customer');
    try {
      localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } catch {}
    logAudit(
      'User',
      'System',
      'AUTH_LOGOUT',
      'Compliance',
      'session-ended',
      'User signed out. Session credentials and scoped tokens purged.',
      'Active Session',
      'Guest Shopper Browse'
    );
    navigateTo({ name: 'stalls' });
  };

  const loginAsVendor = (
    stallNumberOrPhone: string,
    pin: string
  ): { success: boolean; message: string; stall?: Stall } => {
    const query = stallNumberOrPhone.trim().toLowerCase();
    const cleanPhone = stallNumberOrPhone.replace(/\D/g, '');

    const matchingStall = stalls.find(
      (s) =>
        s.stallNumber.toLowerCase() === query ||
        (cleanPhone.length >= 8 && s.phone.replace(/\D/g, '').endsWith(cleanPhone)) ||
        s.id.toLowerCase() === query
    );

    if (!matchingStall) {
      return {
        success: false,
        message: `No approved stall found matching "${stallNumberOrPhone}". Please enter your allotted Stall Number (e.g. H-22) or registered mobile number.`
      };
    }

    const expectedPin = matchingStall.pin || '2027';
    if (pin && pin.trim() !== expectedPin && pin.trim() !== '2027') {
      return {
        success: false,
        message: 'Invalid security PIN. Default initial PIN is 2027 or check your allotment notification.'
      };
    }

    const vendorUser: UserProfile = {
      id: `usr-vnd-${matchingStall.id}`,
      name: matchingStall.ownerName,
      role: 'vendor',
      staffRole: 'owner',
      stallId: matchingStall.id,
      stallNumber: matchingStall.stallNumber,
      businessName: matchingStall.name,
      phone: matchingStall.phone,
      maskedPhone: matchingStall.phone.replace(/(\+?\d{2}\s?\d{2})(\d{3,5})(\d{4})/, '$1 ••••• $3'),
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stall_${matchingStall.stallNumber}_vendorSignature`,
      jwtClaims: {
        sub: matchingStall.id,
        role: 'vendor',
        scope: [
          'catalog:manage_own',
          'stories:post',
          `orders:view_${matchingStall.stallNumber}`,
          'staff:manage',
          'stall:settings'
        ],
        tenant: `stall_${matchingStall.stallNumber}`,
        dpdp_consent: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 30
      },
      mfaVerified: true
    };

    setCurrentUser(vendorUser);
    setIsLoggedIn(true);
    setSelectedVendorStallId(matchingStall.id);
    setRole('vendor');

    try {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(vendorUser));
    } catch {}

    logAudit(
      matchingStall.ownerName,
      'Vendor',
      'VENDOR_LOGIN_SUCCESS',
      'Compliance',
      matchingStall.stallNumber,
      `Vendor authenticated for Stall ${matchingStall.stallNumber} (${matchingStall.name}) via PIN verification. Scoped session initialized.`,
      'Logged Out',
      `Active Session: Stall ${matchingStall.stallNumber}`
    );

    return {
      success: true,
      message: `Welcome ${matchingStall.ownerName}! Logged in as proprietor of Stall ${matchingStall.stallNumber} (${matchingStall.name}).`,
      stall: matchingStall
    };
  };

  const loginAsStaff = (
    staffPhoneOrGatePass: string,
    pin: string
  ): { success: boolean; message: string; staff?: StallStaffMember; stall?: Stall } => {
    const query = staffPhoneOrGatePass.trim().toLowerCase();
    const cleanPhone = staffPhoneOrGatePass.replace(/\D/g, '');

    const matchingStaff = staffMembers.find(
      (st) =>
        (cleanPhone.length >= 8 && st.phone.replace(/\D/g, '').endsWith(cleanPhone)) ||
        st.gatePassId.toLowerCase() === query ||
        st.id.toLowerCase() === query
    );

    if (!matchingStaff) {
      return {
        success: false,
        message: `No staff profile found for "${staffPhoneOrGatePass}". Please enter your registered mobile number or Gate Pass ID.`
      };
    }

    if (matchingStaff.status === 'inactive') {
      return {
        success: false,
        message: `Your staff credentials and Gate Pass (${matchingStaff.gatePassId}) are currently inactive. Please contact the stall owner.`
      };
    }

    const matchingStall = stalls.find(
      (s) => s.id === matchingStaff.stallId || s.stallNumber === matchingStaff.stallNumber
    );

    const staffUser: UserProfile = {
      id: `usr-staff-${matchingStaff.id}`,
      name: `${matchingStaff.name} (${matchingStaff.role.replace('_', ' ').toUpperCase()})`,
      role: 'vendor',
      staffRole: matchingStaff.role,
      stallId: matchingStaff.stallId,
      stallNumber: matchingStaff.stallNumber,
      businessName: matchingStall?.name || `Stall ${matchingStaff.stallNumber}`,
      phone: matchingStaff.phone,
      maskedPhone: matchingStaff.phone.replace(/(\+?\d{2}\s?\d{2})(\d{3,5})(\d{4})/, '$1 ••••• $3'),
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.staff_${matchingStaff.id}_signature`,
      jwtClaims: {
        sub: matchingStaff.id,
        role: 'vendor',
        scope: matchingStaff.permissions || ['catalog:view'],
        tenant: `stall_${matchingStaff.stallNumber}`,
        dpdp_consent: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7
      },
      mfaVerified: true
    };

    setCurrentUser(staffUser);
    setIsLoggedIn(true);
    setSelectedVendorStallId(matchingStaff.stallId);
    setRole('vendor');

    try {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(staffUser));
    } catch {}

    logAudit(
      matchingStaff.name,
      'Vendor',
      'STAFF_LOGIN_SUCCESS',
      'Compliance',
      matchingStaff.gatePassId,
      `Staff member authenticated for Stall ${matchingStaff.stallNumber} as ${matchingStaff.role}. Permissions enforced.`,
      'Logged Out',
      `Role: ${matchingStaff.role}`
    );

    return {
      success: true,
      message: `Welcome ${matchingStaff.name}! Signed in as ${matchingStaff.role.replace('_', ' ').toUpperCase()} for Stall ${matchingStaff.stallNumber}.`,
      staff: matchingStaff,
      stall: matchingStall
    };
  };

  const loginAsEventHost = (
    eventIdOrEmail: string,
    pin?: string
  ): { success: boolean; message: string; event?: BazaarEvent } => {
    const query = eventIdOrEmail.trim().toLowerCase();

    const matchingEvent = events.find(
      (e) =>
        e.id.toLowerCase() === query ||
        e.slug.toLowerCase() === query ||
        e.hostEmail.toLowerCase() === query ||
        e.name.toLowerCase().includes(query) ||
        e.hostOrgName.toLowerCase().includes(query)
    ) || events[0];

    if (!matchingEvent) {
      return {
        success: false,
        message: `No registered exhibition found for "${eventIdOrEmail}". Please check your Event ID or Host Email.`
      };
    }

    const hostUser: UserProfile = {
      id: `usr-host-${matchingEvent.id}`,
      name: `${matchingEvent.hostContactPerson || 'Event Host'}`,
      role: 'event_host',
      phone: matchingEvent.hostPhone,
      maskedPhone: matchingEvent.hostPhone,
      email: matchingEvent.hostEmail,
      businessName: matchingEvent.name,
      hostOrgName: matchingEvent.hostOrgName,
      eventId: matchingEvent.id,
      eventName: matchingEvent.name,
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.host_${matchingEvent.id}_signature`,
      jwtClaims: {
        sub: `host-${matchingEvent.id}`,
        role: 'event_host',
        eventId: matchingEvent.id,
        scope: [
          'event:manage',
          'stalls:allot',
          'applications:review',
          'schedule:manage',
          'compliance:audit'
        ],
        tenant: `event_${matchingEvent.slug}`,
        dpdp_consent: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 30
      },
      mfaVerified: true
    };

    setCurrentUser(hostUser);
    setIsLoggedIn(true);
    setRole('event_host');
    setActiveEventId(matchingEvent.id);

    try {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(hostUser));
    } catch {}

    logAudit(
      matchingEvent.hostContactPerson || matchingEvent.hostOrgName,
      'Admin',
      'EVENT_HOST_LOGIN_SUCCESS',
      'Compliance',
      matchingEvent.id,
      `Event Host authenticated for "${matchingEvent.name}" (${matchingEvent.hostOrgName}). Session initialized for event ${matchingEvent.id}.`,
      'Logged Out',
      `Active Host: ${matchingEvent.name}`
    );

    return {
      success: true,
      message: `Welcome ${matchingEvent.hostContactPerson || 'Organizer'}! Logged in as Event Host for "${matchingEvent.name}".`,
      event: matchingEvent
    };
  };

  // Translation helper
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  // Audit Log generator
  const logAudit = (
    actor: string,
    actorRole: AuditLogItem['actorRole'],
    action: string,
    entityType: AuditLogItem['entityType'],
    entityId: string,
    details: string,
    previousValue?: string,
    newValue?: string
  ) => {
    const randomHash = '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const newEntry: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      actor,
      actorRole,
      action,
      entityType,
      entityId,
      details,
      previousValue,
      newValue,
      hash: randomHash
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    variant?: string,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setCart(prev => {
      const existing = prev.find(
        item =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map(item =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedVariant: variant,
          selectedColor,
          selectedSize
        }
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleFollowStall = (stallId: string) => {
    setFollowedStalls(prev =>
      prev.includes(stallId) ? prev.filter(id => id !== stallId) : [...prev, stallId]
    );
  };

  // Vendor Application operations
  const submitApplication = (appData: Omit<StallApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'updatedAt' | 'feePaid'>): string => {
    const newId = `app-${Date.now()}`;
    const categoryCode = appData.category.substring(0, 3).toUpperCase();
    const appNum = `NUM2027-${categoryCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newApp: StallApplication = {
      ...appData,
      id: newId,
      eventId: appData.eventId || activeEventId || 'event-numaish-2027',
      eventName: appData.eventName || activeEvent?.name || 'Numaish 2027',
      applicationNumber: appNum,
      status: 'submitted',
      feePaid: false,
      submittedAt: now,
      updatedAt: now
    };

    setApplications(prev => [newApp, ...prev]);

    logAudit(
      appData.vendorName + ' (Applicant)',
      'Vendor',
      'STALL_APPLICATION_SUBMITTED',
      'Application',
      appNum,
      `New stall application submitted for ${appData.businessName} under category ${appData.category}. Verification queue alerted.`,
      'None',
      `Status: Submitted | Fee: ₹${appData.feeAmount.toLocaleString('en-IN')}`
    );

    return appNum;
  };

  const updateApplicationStatus = (
    appId: string,
    newStatus: StallApplication['status'],
    notes?: string,
    stallNo?: string,
    sector?: string
  ) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId) return app;
        const oldStatus = app.status;
        const finalStallNo = stallNo !== undefined ? stallNo : (app.allottedStallNumber || `H-${Math.floor(10 + Math.random() * 89)}`);
        const finalSector = sector !== undefined ? sector : (app.allottedSector || `Sector (${app.category})`);

        const updated: StallApplication = {
          ...app,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          reviewerNotes: notes || app.reviewerNotes,
          allottedStallNumber: finalStallNo,
          allottedSector: finalSector,
          feePaid: newStatus === 'stall_allotted' || newStatus === 'fee_paid' ? true : app.feePaid
        };

        // If stall is allotted, automatically ensure a Stall exists for customer & vendor browsing!
        if (newStatus === 'stall_allotted') {
          const stallId = `stall-${app.id.replace('app-', '')}`;
          const catObj = CATEGORIES_DATA.find(c => c.id === app.category);
          const newStall: Stall = {
            id: stallId,
            eventId: app.eventId || activeEventId || 'event-numaish-2027',
            stallNumber: finalStallNo,
            name: app.businessName,
            tagline: `${app.subCategory || app.category} • Authentic Artisan Pavilion`,
            category: app.category,
            subCategories: app.subCategory ? [app.subCategory] : (catObj?.subtypes ? [catObj.subtypes[0]] : [app.category]),
            sector: finalSector,
            nearestGate: 'Gate 2 (Ajanta Gate) • Main Central Pavilion',
            ownerName: app.vendorName,
            phone: app.mobile,
            pin: '2027',
            isVisibleInStallView: true,
            isProductsVisible: true,
            adminStatus: 'active',
            bannerImage: catObj?.bannerImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
            logoImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
            description: `${app.businessName} - Registered exhibitor at 85th All India Industrial Exhibition (Numaish 2027). Authentic ${app.subCategory || app.category} direct from master artisan. Allotted under Application #${app.applicationNumber}.`,
            isVerified: true,
            hasGiCert: Boolean(app.craftCertification),
            rating: 5.0,
            reviewCount: 0,
            followersCount: 1,
            dailyUpdateSnippet: `Welcome to ${app.businessName}! Allotted stall ${finalStallNo}.`,
            lastUpdatedTime: 'Just now'
          };

          setStalls(stallsPrev => {
            if (stallsPrev.some(s => s.id === stallId || s.stallNumber === finalStallNo)) {
              return stallsPrev;
            }
            return [newStall, ...stallsPrev];
          });
        }

        logAudit(
          'Dr. K. Srinivas (Exhibition Society Reviewer)',
          'Admin',
          `STATUS_CHANGED_${newStatus.toUpperCase()}`,
          newStatus === 'stall_allotted' ? 'StallAllotment' : 'Application',
          app.applicationNumber,
          `Application for ${app.businessName} updated to ${newStatus.replace('_', ' ').toUpperCase()}.${notes ? ` Notes: "${notes}"` : ''}${finalStallNo ? ` Allotted Stall: ${finalStallNo}` : ''}`,
          `Status: ${oldStatus}`,
          `Status: ${newStatus}${finalStallNo ? ` | Stall: ${finalStallNo}` : ''}`
        );

        return updated;
      })
    );
  };

  // Stories
  const addStory = (storyData: Omit<DailyStory, 'id' | 'timeAgo' | 'likes'>) => {
    const newStory: DailyStory = {
      ...storyData,
      id: `story-${Date.now()}`,
      timeAgo: 'Just now',
      likes: 1
    };
    setStories(prev => [newStory, ...prev]);

    logAudit(
      storyData.vendorName + ' (Vendor)',
      'Vendor',
      'TODAYS_UPDATE_POSTED',
      'Product',
      newStory.id,
      `Vendor posted live update: "${storyData.caption.substring(0, 60)}..."`,
      'None',
      `Live Drop: ${storyData.discountTag || 'Standard Update'}`
    );
  };

  const likeStory = (storyId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, likes: s.likes + 1 } : s))
    );
  };

  // Products
  const addProduct = (prodData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1
    };
    setProducts(prev => [newProd, ...prev]);

    logAudit(
      prodData.stallName,
      'Vendor',
      'PRODUCT_CATALOG_ADDED',
      'Product',
      newProd.id,
      `Added product "${prodData.title}" under ${prodData.category} at ₹${prodData.price}`,
      'None',
      `Price: ₹${prodData.price} | Stock: ${prodData.stockCount}`
    );
  };

  // Product CRUD
  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const updated = { ...p, ...updates };
        if (updates.mrp && updates.price) {
          updated.discountPercentage = Math.round(((updates.mrp - updates.price) / updates.mrp) * 100);
        }
        if (updates.stockCount !== undefined) {
          updated.inStock = updates.stockCount > 0;
        }

        logAudit(
          p.stallName,
          'Vendor',
          'PRODUCT_CATALOG_UPDATED',
          'Product',
          productId,
          `Updated product "${updated.title}". Price: ₹${updated.price}, Stock: ${updated.stockCount}`,
          `Price: ₹${p.price} | Stock: ${p.stockCount}`,
          `Price: ₹${updated.price} | Stock: ${updated.stockCount}`
        );

        return updated;
      })
    );
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (prod) {
      logAudit(
        prod.stallName,
        'Vendor',
        'PRODUCT_CATALOG_DELETED',
        'Product',
        productId,
        `Removed product "${prod.title}" from catalog`,
        `Title: ${prod.title}`,
        'Deleted'
      );
    }
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const validStock = Math.max(0, newStock);
        return {
          ...p,
          stockCount: validStock,
          inStock: validStock > 0
        };
      })
    );
  };

  // Staff & Gate Pass Management
  const addStaffMember = (staffData: Omit<StallStaffMember, 'id' | 'gatePassId' | 'gatePassQr' | 'addedAt'>) => {
    const newId = `staff-${Date.now()}`;
    const gpNumber = `NUM27-GP-H14-0${staffMembers.length + 1}`;
    const qrCode = `EXHIBITOR-PASS-H14-${staffData.name.toUpperCase().replace(/\s+/g, '_')}-2027`;
    const newStaff: StallStaffMember = {
      ...staffData,
      id: newId,
      gatePassId: gpNumber,
      gatePassQr: qrCode,
      addedAt: new Date().toISOString().split('T')[0]
    };

    setStaffMembers(prev => [newStaff, ...prev]);

    logAudit(
      'Narsimha Rao (Stall Owner)',
      'Vendor',
      'STAFF_ONBOARDED_GATE_PASS_ISSUED',
      'Staff',
      newId,
      `Onboarded staff "${staffData.name}" as ${staffData.role.replace('_', ' ').toUpperCase()}. Issued Gate Pass ${gpNumber} for ${staffData.entryGateAuthorized}.`,
      'None',
      `Pass: ${gpNumber} | Aadhaar (Last 4): ${staffData.aadhaarLast4}`
    );
  };

  const updateStaffMember = (staffId: string, updates: Partial<StallStaffMember>) => {
    setStaffMembers(prev =>
      prev.map(s => {
        if (s.id !== staffId) return s;
        const updated = { ...s, ...updates };
        logAudit(
          'Narsimha Rao (Stall Owner)',
          'Vendor',
          'STAFF_MEMBER_UPDATED',
          'Staff',
          staffId,
          `Updated permissions & details for staff "${updated.name}" (${updated.role})`,
          `Role: ${s.role}`,
          `Role: ${updated.role} | Status: ${updated.status}`
        );
        return updated;
      })
    );
  };

  const removeStaffMember = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    setStaffMembers(prev => prev.filter(s => s.id !== staffId));
    if (staff) {
      logAudit(
        'Narsimha Rao (Stall Owner)',
        'Vendor',
        'STAFF_REVOKED_GATE_PASS_CANCELLED',
        'Staff',
        staffId,
        `Revoked staff credentials and cancelled Gate Pass ${staff.gatePassId} for "${staff.name}". Security alerted at gates.`,
        `Active Pass: ${staff.gatePassId}`,
        'Cancelled / Revoked'
      );
    }
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaffMembers(prev =>
      prev.map(s => (s.id === staffId ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    );
  };

  // Daily Stall Gallery Management
  const addGalleryItem = (itemData: Omit<StallGalleryItem, 'id' | 'uploadedAt' | 'likes'>) => {
    const newItem: StallGalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      likes: 1
    };
    setStallGallery(prev => [newItem, ...prev]);

    logAudit(
      'Narsimha Rao (Vendor)',
      'Vendor',
      'DAILY_GALLERY_SHOWCASE_ADDED',
      'Gallery',
      newItem.id,
      `Uploaded showcase photo to album "${itemData.album}": "${itemData.title}"`,
      'None',
      `Album: ${itemData.album} | Date: ${itemData.dateTag}`
    );
  };

  const removeGalleryItem = (itemId: string) => {
    setStallGallery(prev => prev.filter(g => g.id !== itemId));
  };

  const likeGalleryItem = (itemId: string) => {
    setStallGallery(prev =>
      prev.map(g => (g.id === itemId ? { ...g, likes: g.likes + 1 } : g))
    );
  };
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'otpCode'>): Order => {
    const orderNum = `ORD-NUMAISH-${Math.floor(100000 + Math.random() * 900000)}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      otpCode: otp
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    logAudit(
      orderData.customerName + ' (Customer)',
      'System',
      'ORDER_CONFIRMED',
      'Compliance',
      orderNum,
      `Order placed: ₹${orderData.totalAmount.toLocaleString('en-IN')} via ${orderData.paymentMode.toUpperCase()} (${orderData.fulfillmentType === 'stall_pickup' ? 'Stall Pickup at ' + (orderData.pickupStallNumber || 'Stall') : 'Home Delivery'}). OTP generated.`,
      'Cart Checkout',
      `Status: Confirmed | Pickup Code: ${otp}`
    );

    return newOrder;
  };

  return (
    <AppContext.Provider
      value={{
        appMode,
        setAppMode,
        resetRealDatabase,
        seedRealDatabaseWithSample,
        role,
        setRole,
        language,
        setLanguage,
        isMobileFrame,
        setIsMobileFrame,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        products,
        stalls,
        addStall,
        updateStall,
        deleteStall,
        selectedVendorStallId,
        setSelectedVendorStallId,
        customerBrowseView,
        setCustomerBrowseView,
        followedStalls,
        toggleFollowStall,
        currentRoute,
        navigateTo,
        goBack,
        stories,
        applications,
        orders,
        cart,
        wishlist,
        auditLogs,
        staffMembers,
        stallGallery,
        events,
        activeEventId,
        activeEvent,
        setActiveEventId,
        addEvent,
        updateEvent,
        loginAsEventHost,
        eventStalls,
        eventProducts,
        eventStories,
        eventApplications,
        activeStoryModal,
        setActiveStoryModal,
        activeProductModal,
        setActiveProductModal,
        activeStallModal,
        setActiveStallModal,
        isCartOpen,
        setIsCartOpen,
        isStallApplicationOpen,
        setIsStallApplicationOpen,
        isQuickDropOpen,
        setIsQuickDropOpen,
        isMapOpen,
        setIsMapOpen,
        selectedZone,
        setSelectedZone,
        isLoggedIn,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPrivacyShieldOpen,
        setIsPrivacyShieldOpen,
        loginAs,
        loginAsVendor,
        loginAsStaff,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        submitApplication,
        updateApplicationStatus,
        addStory,
        likeStory,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addStaffMember,
        updateStaffMember,
        removeStaffMember,
        toggleStaffStatus,
        addGalleryItem,
        removeGalleryItem,
        likeGalleryItem,
        placeOrder,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
