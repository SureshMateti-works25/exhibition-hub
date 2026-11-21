import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Flame,
  MapPin,
  ShoppingBag,
  Store,
  FileText,
  ShieldCheck,
  Key,
  User,
  LogOut
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    role,
    setRole,
    isLoggedIn,
    currentUser,
    logout,
    cart,
    customerBrowseView,
    setCustomerBrowseView,
    currentRoute,
    navigateTo
  } = useApp();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // In individual product page, hide generic bottom nav so product checkout/cart sticky bar has full focus
  if (currentRoute.name === 'product') {
    return null;
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1 shadow-mobile"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* CASE 1: Guest Visitor or Customer Account */}
        {(!isLoggedIn || currentUser?.role === 'customer') && (
          <>
            <button
              onClick={() => {
                setCustomerBrowseView('stalls');
                navigateTo({ name: 'stalls' });
              }}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'stalls' || (currentRoute.name === 'home' && customerBrowseView === 'stalls')
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Stalls"
            >
              <Store className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Stalls</span>
            </button>

            <button
              onClick={() => {
                setCustomerBrowseView('products');
                navigateTo({ name: 'products' });
              }}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'products' || (currentRoute.name === 'home' && customerBrowseView === 'products')
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Products"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Products</span>
            </button>

            {/* Exhibitions Hub Action */}
            <button
              onClick={() => navigateTo({ name: 'events' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'events' || currentRoute.name === 'event-detail' || currentRoute.name === 'event-host-register'
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Expos"
            >
              <span className="text-base leading-none">🎪</span>
              <span className="text-[10px] mt-0.5">Expos</span>
            </button>

            {/* Quick Apply Center Action */}
            <button
              onClick={() => navigateTo({ name: 'apply' })}
              className="flex flex-col items-center -mt-3.5 group"
              aria-label="Apply Stall"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-orange-700 mt-0.5">Apply</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'map' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'map' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Map"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Map</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'cart' })}
              className={`relative flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'cart' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-2 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-[10px] font-semibold mt-0.5">Cart</span>
            </button>

            {/* Sign In for Guest or Logout for Signed In Customer */}
            {isLoggedIn && currentUser ? (
              <button
                onClick={logout}
                className="flex flex-col items-center justify-center p-1.5 text-rose-600 hover:text-rose-700 transition"
                aria-label="Sign Out"
                title={`Signed in as ${currentUser.name}. Click to log out.`}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-0.5 truncate max-w-[48px]">
                  Sign Out
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo({ name: 'auth' })}
                className="flex flex-col items-center justify-center p-1.5 text-orange-600 hover:text-orange-700 transition"
                aria-label="Sign In"
              >
                <Key className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-0.5">Sign In</span>
              </button>
            )}
          </>
        )}

        {/* CASE 2: Authenticated Vendor */}
        {isLoggedIn && currentUser?.role === 'vendor' && (
          <>
            <button
              onClick={() => navigateTo({ name: 'vendor' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'vendor' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="My Stall"
            >
              <Store className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">My Stall</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'vendor-product-form' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'vendor-product-form' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Add Product"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">+ Product</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'stalls' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'stalls' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Public Storefront"
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Bazaar</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'map' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'map' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Grounds Map"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Map</span>
            </button>

            <button
              onClick={logout}
              className="flex flex-col items-center justify-center p-1.5 text-rose-600 hover:text-rose-700 transition"
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Sign Out</span>
            </button>
          </>
        )}

        {/* CASE 3: Authenticated Admin */}
        {isLoggedIn && currentUser?.role === 'admin' && (
          <>
            <button
              onClick={() => navigateTo({ name: 'admin' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'admin' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Admin Console"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Console</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'stalls' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'stalls' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Live Bazaar"
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Bazaar</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'map' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'map' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Stall Grid"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Stall Grid</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'privacy' })}
              className={`flex flex-col items-center justify-center p-1.5 transition ${
                currentRoute.name === 'privacy' ? 'text-orange-600 font-bold' : 'text-slate-600 hover:text-orange-600'
              }`}
              aria-label="Audit Trail"
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Audit</span>
            </button>

            <button
              onClick={logout}
              className="flex flex-col items-center justify-center p-1.5 text-rose-600 hover:text-rose-700 transition"
              aria-label="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Sign Out</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
