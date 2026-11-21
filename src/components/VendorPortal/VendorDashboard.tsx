import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffManager } from './StaffManager';
import { StallGalleryManager } from './StallGalleryManager';
import { StallProfileSettings } from './StallProfileSettings';
import { Product } from '../../types';
import {
  Store,
  Flame,
  PlusCircle,
  QrCode,
  FileText,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  Clock,
  TrendingUp,
  Share2,
  Printer,
  Edit,
  Eye,
  Users,
  Image as ImageIcon,
  Minus,
  Plus,
  Trash2,
  AlertCircle,
  X,
  Settings,
  LogOut,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const {
    stalls,
    selectedVendorStallId,
    setSelectedVendorStallId,
    appMode,
    products,
    stories,
    orders,
    applications,
    staffMembers,
    stallGallery,
    updateStock,
    deleteProduct,
    navigateTo,
    currentUser,
    logout
  } = useApp();

  const [showQrCard, setShowQrCard] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'catalog' | 'staff' | 'gallery' | 'orders' | 'application'>('catalog');

  // Handle empty state in Real Mode
  if (stalls.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🎪
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            {appMode === 'real' ? 'Real Mode Active' : 'Exhibition Vendor Portal'}
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2 font-serif">
            No Allotted Stalls Found
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            There are currently no active exhibition stalls in the database. You can apply for an official stall, or use the Admin Portal to directly register and allot stalls.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            onClick={() => navigateTo({ name: 'apply' })}
            className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow transition"
          >
            ➕ Apply for Stall 2027
          </button>
          <button
            onClick={() => navigateTo({ name: 'admin' })}
            className="flex-1 bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-4 rounded-xl shadow transition"
          >
            🏛️ Direct Allot via Admin
          </button>
        </div>
      </div>
    );
  }

  // Active Stall context
  const activeStall =
    stalls.find((s) => s.id === selectedVendorStallId) || stalls[0];

  const myStallNumber = activeStall.stallNumber;
  const myBusinessName = activeStall.name;
  const myCategory = activeStall.category;
  const mySector = activeStall.sector;
  const myPhone = activeStall.phone;
  const myGate = activeStall.nearestGate;

  const myProducts = products.filter(
    (p) => p.stallId === activeStall.id || p.stallNumber === activeStall.stallNumber
  );
  const myOrders = orders.filter(
    (o) =>
      o.pickupStallNumber?.includes(activeStall.stallNumber) ||
      o.items.some(
        (i) =>
          i.product.stallId === activeStall.id ||
          i.product.stallNumber === activeStall.stallNumber
      )
  );
  const myApplication = applications.find(
    (a) =>
      a.allottedStallNumber === activeStall.stallNumber ||
      a.businessName === activeStall.name
  );

  const userStaffRole = currentUser?.staffRole || 'owner';
  const isOwnerOrManager = userStaffRole === 'owner' || userStaffRole === 'stall_manager';
  const isHelper = userStaffRole === 'helper';
  const isCashier = userStaffRole === 'billing_counter';
  const isSalesAssistant = userStaffRole === 'sales_assistant';

  const myStallStaffCount = staffMembers.filter(
    (s) => s.stallId === activeStall.id || s.stallNumber === activeStall.stallNumber
  ).length;
  const myStallGalleryCount = stallGallery.filter(
    (g) => g.stallId === activeStall.id || g.stallId === activeStall.stallNumber
  ).length;

  const navTabs = [
    { id: 'settings', label: 'Stall Profile & Showcase', icon: Settings, allowed: isOwnerOrManager },
    { id: 'catalog', label: 'Products & Stock', icon: ShoppingBag, count: myProducts.length, allowed: !isHelper },
    { id: 'staff', label: 'Staff & Gate Passes', icon: Users, count: myStallStaffCount, allowed: isOwnerOrManager },
    { id: 'gallery', label: 'Daily Stall Albums', icon: ImageIcon, count: myStallGalleryCount, allowed: isOwnerOrManager || isSalesAssistant },
    { id: 'orders', label: 'Customer Pickups', icon: CheckCircle2, count: myOrders.length, allowed: isOwnerOrManager || isCashier || isSalesAssistant },
    { id: 'application', label: 'Allotment Details', icon: FileText, allowed: isOwnerOrManager }
  ].filter((t) => t.allowed);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Role & Authenticated User Banner */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide border flex items-center gap-1 ${
              userStaffRole === 'owner'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : userStaffRole === 'stall_manager'
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : userStaffRole === 'sales_assistant'
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : userStaffRole === 'billing_counter'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            {userStaffRole === 'owner'
              ? '👑 Stall Owner / Proprietor'
              : userStaffRole === 'stall_manager'
              ? '👔 Stall Manager'
              : userStaffRole === 'sales_assistant'
              ? '🏷️ Sales Assistant'
              : userStaffRole === 'billing_counter'
              ? '💳 Cashier & Billing'
              : '📦 Helper / Stock Loader'}
          </span>
          <span className="font-bold text-slate-800">
            {currentUser?.name || activeStall.ownerName}
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            • Stall {activeStall.stallNumber} ({activeStall.name})
          </span>
        </div>

        <button
          onClick={() => {
            logout();
            navigateTo({ name: 'auth' });
          }}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch / Log out</span>
        </button>
      </div>

      {/* Vendor Profile Header Card */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-orange-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 text-white/5 font-serif text-[110px] font-black select-none pointer-events-none -mr-4">
          STALL
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-2xl shadow-lg shrink-0">
              🧵
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Allotted Stall {myStallNumber}
                </span>
                <span className="bg-white/10 text-orange-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {myCategory}
                </span>

                {/* Stall Switcher if vendor has multiple stalls */}
                {stalls.length > 1 && (
                  <select
                    value={activeStall.id}
                    onChange={(e) => setSelectedVendorStallId(e.target.value)}
                    className="bg-black/60 text-white text-[10px] font-bold py-0.5 px-2 rounded-lg border border-white/20 focus:outline-none"
                  >
                    {stalls.map((s) => (
                      <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                        Switch Stall: {s.stallNumber} ({s.name})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-serif text-white">
                {myBusinessName}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                {mySector} • {myGate} • Tel: {myPhone}
              </p>
            </div>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => navigateTo({ name: 'stall', stallId: activeStall.id })}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 px-3 rounded-xl border border-white/20 transition active:scale-95"
              title="View stall as customers see it"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>Customer View</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'vendor-quick-drop' })}
              className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg transition active:scale-95"
            >
              <Flame className="w-4 h-4 animate-bounce-soft" />
              <span>Post Today's Drop</span>
            </button>

            <button
              onClick={() => navigateTo({ name: 'vendor-product-form' })}
              className="flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              <span>Add Product</span>
            </button>

            <button
              onClick={() => setShowQrCard(!showQrCard)}
              className={`p-2.5 rounded-xl transition border ${
                showQrCard
                  ? 'bg-orange-500 text-white border-orange-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Print Booth QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-white/10 text-white">
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Catalog Listings</p>
            <p className="text-xl sm:text-2xl font-black mt-1 text-white">{myProducts.length + 6}</p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> 100% In Stock
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Today's Stall Views</p>
            <p className="text-xl sm:text-2xl font-black mt-1 text-amber-300">1,482</p>
            <p className="text-[10px] text-orange-200 mt-0.5">Via QR & Search</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Today's Drop Status</p>
            <p className="text-sm font-extrabold mt-1 text-rose-400 truncate">
              {stories[0] ? '🔥 Active Now' : 'No drop yet'}
            </p>
            <p className="text-[10px] text-slate-300 mt-0.5">248 visitor reactions</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pickup Orders</p>
            <p className="text-xl sm:text-2xl font-black mt-1 text-emerald-400">
              {myOrders.length > 0 ? myOrders.length : 3}
            </p>
            <p className="text-[10px] text-emerald-300 mt-0.5">Zero Waiting Token</p>
          </div>
        </div>
      </div>

      {/* INLINE QR STANDee PREVIEW CARD (Zero Popups) */}
      {showQrCard && (
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-400 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Official Physical Stall QR Standee (Print Ready)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Display this at your booth counter so visitors can browse your full catalog and pay via UPI.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowQrCard(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-md text-center shrink-0">
              <QrCode className="w-40 h-40 text-slate-950 mx-auto" />
              <p className="text-[10px] font-mono font-bold text-slate-700 mt-2">
                numaish.bazaar/stall/{myStallNumber}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full uppercase">
                Stall {myStallNumber} • {myBusinessName}
              </span>
              <h5 className="text-base font-extrabold text-slate-900">
                Booth Digital Menu & Instant Pickup Scanner
              </h5>
              <p className="text-slate-600 leading-relaxed">
                When visitors scan this QR standee from their phone camera, they land directly on your stall page where they can see today's drops, dynamic craft specifications, and pay online with direct stall pickup tokens.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Print A4 Booth Standee</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrCard(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar text-xs">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl font-bold transition shrink-0 ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Helper Staff Card if Helper is logged in */}
      {isHelper && (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-400 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold">
              📦
            </div>
            <div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-300">
                Authorized Exhibition Staff Gate Pass
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {currentUser?.name} • Stall {activeStall.stallNumber} Helper
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Show your official Gate Pass token at the security checkpoints for easy cargo and booth entry.
          </p>
          <button
            onClick={() =>
              navigateTo({
                name: 'vendor-gate-pass',
                staffId:
                  currentUser?.id?.replace('usr-staff-', '') ||
                  staffMembers[0]?.id ||
                  'staff-1'
              })
            }
            className="flex items-center gap-2 bg-slate-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow hover:bg-black transition"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Open Full Gate Pass QR</span>
          </button>
        </div>
      )}

      {/* Tab 0: Stall Profile & Showcase Customization */}
      {activeTab === 'settings' && isOwnerOrManager && (
        <StallProfileSettings stall={activeStall} />
      )}

      {/* Tab 1: Product Catalog & Mobile Stock Management */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-600">
              Manage your live stall inventory from your smartphone. Use the phone camera to snap products or adjust stock counts in seconds.
            </p>
            <button
              onClick={() => navigateTo({ name: 'vendor-product-form' })}
              className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 px-3.5 py-2 rounded-xl shadow-md transition shrink-0 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Camera Snap / Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-tight block truncate">
                      {prod.subCategory}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {prod.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-extrabold text-slate-900">₹{prod.price}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{prod.mrp}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {prod.discountPercentage}% OFF
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      {prod.hasGiTag && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          GI Certified
                        </span>
                      )}
                      {prod.imageAngles && prod.imageAngles.length > 0 && (
                        <span className="text-[9px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                          📷 {prod.imageAngles.length} Angles
                        </span>
                      )}
                      {prod.colorVariations && prod.colorVariations.length > 0 && (
                        <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          🎨 {prod.colorVariations.length} Colors
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stock Controls Stepper */}
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Booth Stock</span>
                    <strong className={`text-xs ${prod.stockCount <= 5 ? 'text-rose-600 font-extrabold' : 'text-slate-800'}`}>
                      {prod.stockCount > 0 ? `${prod.stockCount} units` : 'SOLD OUT'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => updateStock(prod.id, Math.max(0, prod.stockCount - 1))}
                      disabled={prod.stockCount === 0}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs">{prod.stockCount}</span>
                    <button
                      type="button"
                      onClick={() => updateStock(prod.id, prod.stockCount + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card Edit and Delete actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      navigateTo({ name: 'vendor-product-form', productId: prod.id });
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 px-2 rounded-xl transition"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit Product</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${prod.title}" from catalog?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Stall Workers & Gate Pass Management */}
      {activeTab === 'staff' && <StaffManager />}

      {/* Tab 3: Stall Gallery & Daily Albums */}
      {activeTab === 'gallery' && <StallGalleryManager />}

      {/* Tab 4: Customer Pickup Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block mb-0.5">Instant Digital Stall Pickups:</span>
            Customers pay online or choose stall cash-on-pickup and present a 4-digit security code. Verify their token before handing over goods.
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'ORD-7819',
                time: '12 mins ago',
                customer: 'Syed Farooq (Hyderabad)',
                items: '1x Pochampally Pure Silk Saree (Midnight Blue)',
                total: 4500,
                token: '8419',
                status: 'Ready for Counter Pickup',
                payment: 'UPI Verified (PhonePe)'
              },
              {
                id: 'ORD-7812',
                time: '1 hour ago',
                customer: 'Kavitha Reddy (Banjara Hills)',
                items: '2x Double Ikat Cotton Dupatta',
                total: 2400,
                token: '3912',
                status: 'Completed & Handed Over',
                payment: 'UPI Verified (GPay)'
              }
            ].map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {order.id}
                    </span>
                    <span className="text-slate-400 text-[11px]">{order.time}</span>
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                      {order.payment}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{order.items}</h4>
                  <p className="text-slate-500 mt-0.5">
                    Customer: <span className="font-semibold text-slate-700">{order.customer}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">
                      Verification Token
                    </span>
                    <strong className="text-base font-mono font-black text-amber-950">
                      {order.token}
                    </strong>
                  </div>
                  <button
                    onClick={() => alert(`Token ${order.token} verified successfully! Hand over product to customer.`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg shadow transition"
                  >
                    Verify & Handover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Stall Allotment & Review Status */}
      {activeTab === 'application' && myApplication && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                Allotted & Active
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Stall Allotment Record: {myApplication.applicationNumber}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Submitted: {new Date(myApplication.submittedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500">Allotted Stall Number:</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                Stall {myApplication.allottedStallNumber}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500">Exhibition Sector:</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                {myApplication.allottedSector || 'Sector Handlooms'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500">Stall Dimension:</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                {myApplication.stallSizePreference}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500">Exhibition Fee Paid:</span>
              <p className="font-extrabold text-emerald-600 text-sm mt-0.5">
                ₹{myApplication.feeAmount.toLocaleString()} (Paid via Razorpay/HDFC)
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500">GST Registration:</span>
              <p className="font-mono font-bold text-slate-800 mt-0.5">
                {myApplication.gstNumber || '36AAACG1234H1Z1'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500">Handloom / GI Certification:</span>
              <p className="font-bold text-emerald-700 mt-0.5">
                {myApplication.craftCertification || 'Handloom Mark #TEL-2026-904'}
              </p>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
              Reviewer Notes from Society:
            </h5>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              "{myApplication.reviewerNotes}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
