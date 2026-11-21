import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  MapPin,
  Smartphone,
  Monitor,
  Store,
  ShieldCheck,
  Globe,
  PlusCircle,
  Search,
  Database,
  RotateCcw,
  Zap,
  ChevronDown,
  Key,
  LogOut,
  Lock
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    appMode,
    setAppMode,
    resetRealDatabase,
    seedRealDatabaseWithSample,
    stalls,
    products,
    role,
    setRole,
    isLoggedIn,
    currentUser,
    logout,
    currentRoute,
    navigateTo,
    language,
    setLanguage,
    isMobileFrame,
    setIsMobileFrame,
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    events,
    activeEvent,
    activeEventId,
    setActiveEventId,
    t
  } = useApp();

  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'EN' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ur', label: 'Urdu', native: 'اردو' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      {/* Top Notification & Mode Switcher Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-700 text-white text-xs px-3 py-1 font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <button
            onClick={() => navigateTo({ name: 'events' })}
            className="flex items-center gap-1.5 hover:opacity-90 transition text-left"
            title="Click to view all exhibitions or switch active bazaar"
          >
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
              {activeEvent?.edition || '85th Edition'}
            </span>
            <span className="truncate hidden sm:inline font-bold hover:underline">
              {activeEvent?.name || 'Numaish 2027 • All India Industrial Exhibition'}
            </span>
            <span className="truncate sm:hidden font-bold">
              {activeEvent?.name ? activeEvent.name.split('-')[0].trim() : 'Numaish'}
            </span>
            <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-normal shrink-0">
              ▼ Expos ({events.length})
            </span>
          </button>
        </div>

        {/* Real App vs Demo Mode Switcher Dropdown */}
        <div className="relative flex items-center gap-2 shrink-0 text-[11px]">
          <div className="relative">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-extrabold text-[11px] shadow-xs transition ${
                appMode === 'real'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-400/50 hover:bg-emerald-900'
                  : 'bg-white text-orange-800 hover:bg-orange-50'
              }`}
              title="Click to toggle Real Production vs Demo Showcase mode"
            >
              <span className={`w-2 h-2 rounded-full ${appMode === 'real' ? 'bg-emerald-400 animate-pulse' : 'bg-orange-500'}`} />
              <span>{appMode === 'real' ? 'Real App Mode' : 'Demo Mode'}</span>
              <span className="text-[10px] opacity-80">({stalls.length} stalls)</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showModeDropdown && (
              <div className="absolute right-0 mt-1 w-64 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 text-xs animate-fadeIn space-y-2">
                <div className="border-b border-slate-100 pb-2">
                  <p className="font-extrabold text-slate-900 text-xs">Application Database Mode</p>
                  <p className="text-[10px] text-slate-500">
                    Switch between clean real persistence and showcase mock data.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAppMode('real');
                      setShowModeDropdown(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition ${
                      appMode === 'real'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>🟢 Real Mode</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-0.5">Clean & permanently persisted</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAppMode('demo');
                      setShowModeDropdown(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition ${
                      appMode === 'demo'
                        ? 'border-orange-500 bg-orange-50 text-orange-900 font-extrabold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>🟠 Demo Mode</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-0.5">Pre-loaded showcase items</p>
                  </button>
                </div>

                {appMode === 'real' && (
                  <div className="pt-1.5 border-t border-slate-100 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        seedRealDatabaseWithSample();
                        setShowModeDropdown(false);
                      }}
                      className="w-full text-left p-1.5 rounded-lg text-[11px] font-bold text-orange-800 bg-orange-50 hover:bg-orange-100 flex items-center gap-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5 text-orange-600" />
                      <span>⚡ Seed 2 Quick Real Stalls</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Reset the real database? All newly entered stalls and products will be cleared to a completely fresh 0 state.')) {
                          resetRealDatabase();
                          setShowModeDropdown(false);
                        }
                      }}
                      className="w-full text-left p-1.5 rounded-lg text-[11px] font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                      <span>↺ Reset Real Database (Clean 0)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => navigateTo({ name: 'event-host-register' })}
            className="hidden sm:inline-flex items-center gap-1 bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-extrabold hover:bg-amber-300 transition shadow-xs"
            title="Register as an Event Host to onboard a new exhibition"
          >
            <Sparkles className="w-3 h-3 text-slate-900" />
            + Host Event
          </button>

          <button
            onClick={() => navigateTo({ name: 'apply' })}
            className="hidden sm:inline-flex items-center gap-1 bg-white text-orange-700 px-2 py-0.5 rounded font-semibold hover:bg-orange-50 transition"
          >
            <PlusCircle className="w-3 h-3" />
            Apply Stall 2027
          </button>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1 text-orange-100 hover:text-white transition"
            title="Toggle iPhone Frame View"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Mobile Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo({ name: 'home' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <span className="text-xl">🎪</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text text-transparent">
                NUMAISH
              </span>
              <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded-md uppercase">
                Bazaar
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
              Exhibition Society Digital Stalls
            </p>
          </div>
        </div>

        {/* Global Search Bar (Responsive) */}
        <div className="flex-1 max-w-md mx-2 relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Exhibitions Directory Button */}
          <button
            onClick={() => navigateTo({ name: 'events' })}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition"
            aria-label="View Exhibitions"
          >
            <span className="text-sm">🎪</span>
            <span className="hidden md:inline">Expos</span>
          </button>

          {/* Interactive Map Button */}
          <button
            onClick={() => navigateTo({ name: 'map' })}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition"
            aria-label="Open Grounds Map"
          >
            <MapPin className="w-4 h-4 text-orange-600" />
            <span className="hidden md:inline">Grounds Map</span>
          </button>

          {/* Language Switcher */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold uppercase">{language}</span>
            </button>
            <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-orange-50 ${
                    language === lang.code ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{lang.label}</span>
                  <span className="text-[10px] text-slate-400">{lang.native}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cart Icon */}
          <button
            onClick={() => navigateTo({ name: 'cart' })}
            className="relative p-2 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce-soft">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile or Guest Sign In Button */}
          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-1.5">
              {currentUser.role === 'event_host' && (
                <button
                  onClick={() => navigateTo({ name: 'admin' })}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 text-orange-950 border border-orange-300 text-xs font-black transition shadow-xs"
                  title="Open Event Host & Society Console"
                >
                  <span>🎪</span>
                  <span className="truncate max-w-[140px]">
                    {currentUser.hostOrgName || currentUser.eventName || 'Host Console'}
                  </span>
                </button>
              )}

              <button
                onClick={() => navigateTo({ name: 'auth' })}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition"
                title="View active profile & security scopes"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline truncate max-w-[100px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-black uppercase ${
                  currentUser.role === 'event_host'
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-slate-600'
                }`}>
                  {currentUser.role === 'event_host' ? 'HOST' : currentUser.role}
                </span>
              </button>

              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigateTo({ name: 'auth' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
              title="Sign in to your Numaish account"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Privacy Shield Button */}
          <button
            onClick={() => navigateTo({ name: 'privacy' })}
            className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
            title="DPDP 2023 Data Privacy Shield & Token Claims"
            aria-label="Privacy Shield"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Contextual Persona & Portal Tabs (Zero Bypass) */}
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            {isLoggedIn && currentUser?.role === 'vendor' ? (
              <>
                <button
                  onClick={() => navigateTo({ name: 'vendor' })}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition ${
                    currentRoute.name === 'vendor'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  My Stall Portal
                </button>
                <button
                  onClick={() => navigateTo({ name: 'stalls' })}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
                    currentRoute.name === 'stalls' || currentRoute.name === 'products'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Browse Storefront
                </button>
              </>
            ) : isLoggedIn && currentUser?.role === 'admin' ? (
              <>
                <button
                  onClick={() => navigateTo({ name: 'admin' })}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition ${
                    currentRoute.name === 'admin'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  Admin Society Console
                </button>
                <button
                  onClick={() => navigateTo({ name: 'stalls' })}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
                    currentRoute.name === 'stalls' || currentRoute.name === 'products'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  Live Bazaar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo({ name: 'stalls' })}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
                    currentRoute.name === 'stalls'
                      ? 'bg-white text-orange-600 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  Browse Stalls
                </button>
                <button
                  onClick={() => navigateTo({ name: 'products' })}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition ${
                    currentRoute.name === 'products'
                      ? 'bg-white text-orange-600 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  All Products
                </button>
                <button
                  onClick={() => navigateTo({ name: 'auth' })}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-slate-600 hover:text-orange-700 hover:bg-orange-50 transition"
                  title="Vendor sign in required to manage stall"
                >
                  <Lock className="w-3 h-3 text-orange-500" />
                  Exhibitor Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Role Banner for Mobile View */}
      <div className="lg:hidden bg-slate-50 border-t border-slate-100 px-3 py-1.5 flex items-center justify-between text-xs">
        {isLoggedIn && currentUser ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {currentUser.name} ({currentUser.role})
            </span>
            <div className="flex items-center gap-1.5">
              {currentUser.role === 'vendor' ? (
                <button
                  onClick={() => navigateTo({ name: 'vendor' })}
                  className="px-2 py-0.5 rounded bg-orange-600 text-white text-[10px] font-bold"
                >
                  My Stall
                </button>
              ) : currentUser.role === 'admin' ? (
                <button
                  onClick={() => navigateTo({ name: 'admin' })}
                  className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold"
                >
                  Admin
                </button>
              ) : null}
              <button
                onClick={logout}
                className="text-[10px] text-rose-600 font-bold px-1.5 py-0.5"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-medium text-slate-500">
              Visitor: Guest Shopper
            </span>
            <button
              onClick={() => navigateTo({ name: 'auth' })}
              className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <Key className="w-3 h-3" />
              <span>Vendor / Admin Login →</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
