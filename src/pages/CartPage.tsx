import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderFulfillmentType, PaymentMode, Order } from '../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  Truck,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Store,
  Receipt,
  Download
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    goBack,
    navigateTo,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    isLoggedIn,
    currentUser
  } = useApp();

  const [fulfillment, setFulfillment] = useState<OrderFulfillmentType>('stall_pickup');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi');
  const [customerName, setCustomerName] = useState(
    isLoggedIn && currentUser?.role === 'customer' ? currentUser.name : ''
  );
  const [customerPhone, setCustomerPhone] = useState(
    isLoggedIn && currentUser?.role === 'customer' ? currentUser.phone : ''
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCharge = fulfillment === 'home_delivery' ? 80 : 0;
  const platformFee = 5; // Token fee for Exhibition Society welfare
  const grandTotal = subtotal > 0 ? subtotal + deliveryCharge + platformFee : 0;

  // Stalls involved
  const distinctStalls = Array.from(new Set(cart.map(i => i.product.stallNumber)));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const finalName = customerName.trim() || (isLoggedIn && currentUser ? currentUser.name : 'Guest Shopper');
    const finalPhone = customerPhone.trim() || (isLoggedIn && currentUser ? currentUser.phone : '+91 98000 00000');
    setIsProcessing(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: finalName,
        customerPhone: finalPhone,
        items: [...cart],
        totalAmount: grandTotal,
        fulfillmentType: fulfillment,
        paymentMode,
        paymentStatus: paymentMode === 'pay_at_stall' ? 'pending_at_stall' : 'paid',
        status: 'confirmed',
        pickupStallNumber: distinctStalls.join(', '),
        deliveryAddress: fulfillment === 'home_delivery' ? (deliveryAddress || 'Hyderabad Ground Delivery') : undefined
      });

      setIsProcessing(false);
      setPlacedOrder(order);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 900);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col animate-fadeIn">
      {/* 1. Enterprise Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Back to Shopping</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <span className="font-extrabold text-slate-900">
              {placedOrder ? 'Order Confirmation' : 'Numaish Cart & Express Checkout'}
            </span>
            {!placedOrder && (
              <span className="text-[11px] bg-orange-100 text-orange-800 font-extrabold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            )}
          </div>
        </div>

        {!placedOrder && cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition"
          >
            Clear Cart
          </button>
        )}
      </nav>

      {/* 2. Main Page Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24">
        {/* CASE A: Placed Order Success Screen */}
        {placedOrder ? (
          <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">
            {/* Success Hero Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Verified • Order #{placedOrder.orderNumber}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-serif">
                  Thank You, {placedOrder.customerName}!
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Your order has been officially registered with the All India Industrial Exhibition Society.
                </p>
              </div>

              {/* Security Pickup Token Badge */}
              {placedOrder.fulfillmentType === 'stall_pickup' && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-orange-300 max-w-sm mx-auto space-y-2">
                  <span className="text-[10px] text-orange-800 font-black uppercase tracking-widest block">
                    Your Official Stall Pickup Code
                  </span>
                  <div className="text-3xl font-black text-orange-600 font-mono tracking-wider">
                    {placedOrder.otpCode}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Present this 4-digit code at <strong>Stall {placedOrder.pickupStallNumber}</strong> to collect your sealed package.
                  </p>
                </div>
              )}

              {/* Order Details Grid */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 text-left border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Fulfillment Mode:</span>
                  <strong className="text-slate-900 capitalize">
                    {placedOrder.fulfillmentType.replace('_', ' ')}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment Status:</span>
                  <strong className="text-emerald-700 capitalize font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {placedOrder.paymentStatus} ({placedOrder.paymentMode.toUpperCase()})
                  </strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Amount Paid:</span>
                  <strong className="text-slate-900 font-black text-sm">
                    ₹{placedOrder.totalAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Receipt downloaded for ${placedOrder.orderNumber}`)}
                  className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 px-4 rounded-xl transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Gate Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPlacedOrder(null);
                    navigateTo({ name: 'stalls' });
                  }}
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition active:scale-95"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* CASE B: Empty Cart Screen */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-4 my-10">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Your Cart is Empty</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore authentic Pochampally silks, Hyderabadi pearls, dry fruits, and handicrafts from 10 pavilions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo({ name: 'stalls' })}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition active:scale-95"
            >
              Browse Stalls & Pavilions
            </button>
          </div>
        ) : (
          /* CASE C: Active Cart & Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Order Items ({cart.length})
                  </h2>
                  <span className="text-xs text-slate-500">
                    Fulfillment from {distinctStalls.length} Stalls
                  </span>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-orange-700 font-bold uppercase block truncate">
                          Stall {item.product.stallNumber} • {item.product.stallName}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.title}
                        </h3>
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 mt-0.5 flex-wrap">
                            {item.selectedColor && (
                              <span className="bg-orange-100 text-orange-950 px-1.5 py-0.2 rounded font-bold">
                                Color: {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-bold">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold px-1.5">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Checkout Options & Bill Summary */}
            <div className="lg:col-span-5 space-y-5">
              {/* Customer Contact Details */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                    Contact Details
                  </h3>
                  {isLoggedIn && currentUser ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ✓ {currentUser.name}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500">
                      Guest Checkout
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98490 XXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Fulfillment Mode */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Choose Fulfillment Mode
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFulfillment('stall_pickup')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                      fulfillment === 'stall_pickup'
                        ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-200'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Store className="w-4 h-4 text-orange-600" />
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        FREE
                      </span>
                    </div>
                    <strong className="text-slate-900 text-xs">Stall Pickup</strong>
                    <span className="text-[10px] text-slate-500 mt-0.5">Collect with digital token</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillment('home_delivery')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                      fulfillment === 'home_delivery'
                        ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-200'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Truck className="w-4 h-4 text-orange-600" />
                      <span className="text-[10px] font-bold text-slate-600">₹80</span>
                    </div>
                    <strong className="text-slate-900 text-xs">Home Delivery</strong>
                    <span className="text-[10px] text-slate-500 mt-0.5">Within Hyderabad/Sec'bad</span>
                  </button>
                </div>

                {fulfillment === 'home_delivery' && (
                  <div className="pt-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Delivery Address (Hyderabad)
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Payment Method
                </h3>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymode"
                        checked={paymentMode === 'upi'}
                        onChange={() => setPaymentMode('upi')}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <Smartphone className="w-4 h-4 text-slate-700" />
                      <span className="font-bold text-slate-800">Instant UPI (GPay / PhonePe / QR)</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-extrabold">Instant Token</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymode"
                        checked={paymentMode === 'pay_at_stall'}
                        onChange={() => setPaymentMode('pay_at_stall')}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <Store className="w-4 h-4 text-slate-700" />
                      <span className="font-bold text-slate-800">Pay at Stall Counter (Cash / Card)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Item Subtotal</span>
                  <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                </div>
                {deliveryCharge > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <strong>₹{deliveryCharge}</strong>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Society Welfare Token Fee</span>
                  <strong>₹{platformFee}</strong>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-slate-900 font-black text-sm sm:text-base">
                  <span>Total Amount</span>
                  <span className="text-orange-600">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full mt-3 py-3.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white shadow-md transition active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Secure Payment...' : `Confirm & Pay ₹${grandTotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
