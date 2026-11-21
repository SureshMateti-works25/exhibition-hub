import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HeroBanner } from './components/CustomerView/HeroBanner';
import { TodaysUpdatesFeed } from './components/CustomerView/TodaysUpdatesFeed';
import { CategoryPills } from './components/CustomerView/CategoryPills';
import { ProductCard } from './components/CustomerView/ProductCard';
import { StallCard } from './components/CustomerView/StallCard';
import { StallPage } from './pages/StallPage';
import { ProductPage } from './pages/ProductPage';
import { GroundsMapPage } from './pages/GroundsMapPage';
import { CartPage } from './pages/CartPage';
import { StallApplicationPage } from './pages/StallApplicationPage';
import { AuthPage } from './pages/AuthPage';
import { PrivacyShieldPage } from './pages/PrivacyShieldPage';
import { VendorProductFormPage } from './pages/VendorProductFormPage';
import { VendorQuickDropPage } from './pages/VendorQuickDropPage';
import { GatePassPage } from './pages/GatePassPage';
import { StoryViewerPage } from './pages/StoryViewerPage';
import { EventsListPage } from './pages/EventsListPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { EventHostRegisterPage } from './pages/EventHostRegisterPage';
import { VendorDashboard } from './components/VendorPortal/VendorDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import {
  ShoppingBag,
  Store,
  Search
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const {
    appMode,
    setAppMode,
    seedRealDatabaseWithSample,
    isLoggedIn,
    currentUser,
    role,
    products,
    stalls,
    eventProducts,
    eventStalls,
    activeEvent,
    customerBrowseView,
    setCustomerBrowseView,
    selectedCategory,
    searchQuery,
    isMobileFrame,
    currentRoute,
    navigateTo
  } = useApp();

  // Filter products by selectedCategory & search query & active exhibition & admin visibility configuration
  const filteredProducts = eventProducts.filter((prod) => {
    // If browsing as customer, respect admin stall and product visibility toggles
    if (role === 'customer') {
      const parentStall = eventStalls.find(
        (s) => s.id === prod.stallId || s.stallNumber === prod.stallNumber
      );
      if (parentStall) {
        if (parentStall.isProductsVisible === false) return false;
        if (parentStall.adminStatus === 'suspended') return false;
      }
    }

    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      prod.title.toLowerCase().includes(query) ||
      prod.stallName.toLowerCase().includes(query) ||
      prod.stallNumber.toLowerCase().includes(query) ||
      prod.subCategory.toLowerCase().includes(query) ||
      prod.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Filter stalls by selectedCategory & search query & active exhibition & admin visibility configuration
  const filteredStalls = eventStalls.filter((stall) => {
    // If browsing as customer, respect admin stall visibility toggle
    if (role === 'customer') {
      if (stall.isVisibleInStallView === false) return false;
      if (stall.adminStatus === 'suspended') return false;
    }

    const matchesCategory =
      selectedCategory === 'All' || stall.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      stall.name.toLowerCase().includes(query) ||
      stall.stallNumber.toLowerCase().includes(query) ||
      stall.sector.toLowerCase().includes(query) ||
      stall.tagline.toLowerCase().includes(query) ||
      stall.nearestGate.toLowerCase().includes(query) ||
      stall.subCategories.some((sub) => sub.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`min-h-[100dvh] flex flex-col ${
        isMobileFrame
          ? 'bg-slate-900 py-4 sm:py-8 px-2 sm:px-4 items-center justify-center'
          : 'bg-slate-50'
      }`}
    >
      {/* Mobile Device Mockup Wrapper if toggled */}
      <div
        className={`w-full flex flex-col transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[430px] min-h-[880px] h-[92dvh] bg-slate-50 rounded-[44px] shadow-[0_0_50px_rgba(0,0,0,0.6)] border-[10px] border-slate-800 overflow-hidden relative'
            : 'max-w-7xl mx-auto'
        }`}
      >
        {/* iPhone Dynamic Island Simulation in Mobile Frame */}
        {isMobileFrame && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
          </div>
        )}

        {/* ENTERPRISE PAGE ROUTING: Individual Full Pages (Zero Popups) */}
        {currentRoute.name === 'events' ? (
          <EventsListPage />
        ) : currentRoute.name === 'event-detail' ? (
          <EventDetailPage eventId={currentRoute.eventId} />
        ) : currentRoute.name === 'event-host-register' ? (
          <EventHostRegisterPage />
        ) : currentRoute.name === 'stall' ? (
          <StallPage stallId={currentRoute.stallId} />
        ) : currentRoute.name === 'product' ? (
          <ProductPage productId={currentRoute.productId} />
        ) : currentRoute.name === 'map' ? (
          <GroundsMapPage />
        ) : currentRoute.name === 'cart' ? (
          <CartPage />
        ) : currentRoute.name === 'apply' ? (
          <StallApplicationPage />
        ) : currentRoute.name === 'auth' ? (
          <AuthPage />
        ) : currentRoute.name === 'privacy' ? (
          <PrivacyShieldPage />
        ) : currentRoute.name === 'vendor-product-form' ||
            currentRoute.name === 'vendor-quick-drop' ||
            currentRoute.name === 'vendor-gate-pass' ||
            currentRoute.name === 'vendor' ? (
          !isLoggedIn || currentUser?.role !== 'vendor' ? (
            <div className="flex flex-col flex-1">
              <Header />
              <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl shadow-inner">
                  🔒
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  Restricted Exhibitor Workspace
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  Vendor Sign In Required
                </h2>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  You are currently browsing Numaish Bazaar as a guest. To manage your stall profile, upload daily albums, onboard staff, or update inventory, please sign in with your allotted Stall Number and Access PIN.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full max-w-xs">
                  <button
                    onClick={() => navigateTo({ name: 'auth' })}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow transition"
                  >
                    🔑 Log In as Vendor
                  </button>
                  <button
                    onClick={() => navigateTo({ name: 'stalls' })}
                    className="px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    ← Browse Stalls
                  </button>
                </div>
              </main>
            </div>
          ) : currentRoute.name === 'vendor-product-form' ? (
            <VendorProductFormPage productId={currentRoute.productId} />
          ) : currentRoute.name === 'vendor-quick-drop' ? (
            <VendorQuickDropPage />
          ) : currentRoute.name === 'vendor-gate-pass' ? (
            <GatePassPage staffId={currentRoute.staffId} />
          ) : (
            <div className="flex flex-col flex-1">
              <Header />
              <main className="flex-1 px-3 sm:px-6 py-4 overflow-y-auto pb-24 md:pb-12">
                <VendorDashboard />
              </main>
            </div>
          )
        ) : currentRoute.name === 'admin' || currentRoute.name === 'host-dashboard' ? (
          !isLoggedIn || (currentUser?.role !== 'admin' && currentUser?.role !== 'event_host') ? (
            <div className="flex flex-col flex-1">
              <Header />
              <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 text-amber-400 flex items-center justify-center text-3xl shadow-inner">
                  🏛️
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                  Exhibition Host & Society Administrative Console
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  Event Host Sign In Required
                </h2>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  Registered Event Host or Society credentials are required to manage your exhibition's stall allotments, applicant KYC verification, daily schedule, and special days like Ladies-Only Day.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full max-w-xs">
                  <button
                    onClick={() => navigateTo({ name: 'auth' })}
                    className="flex-1 bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-4 rounded-xl shadow transition"
                  >
                    🎪 Event Host / Admin Sign In
                  </button>
                  <button
                    onClick={() => navigateTo({ name: 'stalls' })}
                    className="px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    ← Return to Bazaar
                  </button>
                </div>
              </main>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <Header />
              <main className="flex-1 px-3 sm:px-6 py-4 overflow-y-auto pb-24 md:pb-12">
                <AdminDashboard />
              </main>
            </div>
          )
        ) : (
          /* DEFAULT: EXHIBITION STOREFRONT HOME PAGE */
          <div className="flex flex-col flex-1">
            {/* Global Header */}
            <Header />

            {/* Main View Area */}
            <main className="flex-1 px-3 sm:px-6 py-4 overflow-y-auto pb-24 md:pb-12">
              <div className="animate-fadeIn">
                {/* Hero Banner */}
                <HeroBanner />

                {/* Today's Update Live Stories Feed */}
                <TodaysUpdatesFeed />

                {/* Category Explorer (10 Society Categories) */}
                <CategoryPills />

                {/* Customer Browse View Toggle: Stalls vs Products */}
                <div className="flex items-center justify-between mb-4 bg-slate-200/80 p-1 rounded-2xl max-w-md mx-auto sm:mx-0 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerBrowseView('stalls');
                      navigateTo({ name: 'stalls' });
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      customerBrowseView === 'stalls'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>🎪 Browse Stalls</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        customerBrowseView === 'stalls'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {filteredStalls.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomerBrowseView('products');
                      navigateTo({ name: 'products' });
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      customerBrowseView === 'products'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>🛍️ All Products</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        customerBrowseView === 'products'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {filteredProducts.length}
                    </span>
                  </button>
                </div>

                {/* View 1: Stalls & Pavilions View */}
                {customerBrowseView === 'stalls' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                          <span>Exhibitor Pavilions & Stalls</span>
                          <span className="text-xs bg-orange-100 text-orange-800 font-extrabold px-2 py-0.5 rounded-full">
                            {filteredStalls.length} stalls
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500">
                          {selectedCategory === 'All'
                            ? 'Browse verified artisan stalls, daily showcase albums & booth catalogs'
                            : `Stalls in ${selectedCategory}`}
                        </p>
                      </div>
                    </div>

                    {filteredStalls.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStalls.map((stall) => (
                          <StallCard key={stall.id} stall={stall} />
                        ))}
                      </div>
                    ) : stalls.length === 0 && appMode === 'real' ? (
                      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-slate-200/80 my-6 shadow-sm space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                          🎪
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                            Real Production Mode Active
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-2 font-serif">
                            Clean Database Ready for Your Real Stalls
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                            No exhibition stalls are registered yet. Apply for a stall to begin, or use the quick tools below to test real persistent additions.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => navigateTo({ name: 'apply' })}
                            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition"
                          >
                            ➕ Apply for Stall 2027
                          </button>
                          <button
                            type="button"
                            onClick={seedRealDatabaseWithSample}
                            className="bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold py-2.5 px-4 rounded-xl transition"
                          >
                            ⚡ Seed 2 Sample Real Stalls
                          </button>
                          <button
                            type="button"
                            onClick={() => setAppMode('demo')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition"
                          >
                            🟠 Switch to Demo Mode
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 my-6 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                          <Store className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                          No exhibition stalls matching your search
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          Try searching for "Pochampally", "Pista House", "Pearls", or clear the category filter to explore all stalls.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* View 2: All Products Grid View */}
                {customerBrowseView === 'products' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                          <span>Numaish Heritage Showcases</span>
                          <span className="text-xs bg-orange-100 text-orange-800 font-extrabold px-2 py-0.5 rounded-full">
                            {filteredProducts.length} items
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500">
                          {selectedCategory === 'All'
                            ? 'Handlooms, Pearls, Crafts, Footwear & Food'
                            : `Filtered by ${selectedCategory}`}
                        </p>
                      </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                        {filteredProducts.map((prod) => (
                          <ProductCard key={prod.id} product={prod} />
                        ))}
                      </div>
                    ) : products.length === 0 && appMode === 'real' ? (
                      <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-slate-200/80 my-6 shadow-sm space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                          🛍️
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                            Real Production Mode Active
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-2 font-serif">
                            No Products in Active Catalog Yet
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                            Once stalls are allotted, vendor merchants can upload products with photos, prices, and specifications from the Vendor Portal.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => navigateTo({ name: 'vendor-product-form' })}
                            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition"
                          >
                            ➕ Add First Product (Vendor)
                          </button>
                          <button
                            type="button"
                            onClick={seedRealDatabaseWithSample}
                            className="bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold py-2.5 px-4 rounded-xl transition"
                          >
                            ⚡ Seed 2 Sample Real Stalls
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 my-6 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                          <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                          No stall items matching your search
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          Try searching for "Pochampally", "Pearls", "Haleem", or select another category from the 10 official pavilions.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default AppContent;
