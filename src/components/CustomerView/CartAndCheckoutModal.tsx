import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderFulfillmentType, PaymentMode, Order } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
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
  Smartphone
} from 'lucide-react';

export const CartAndCheckoutModal: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCharge = fulfillment === 'home_delivery' ? 80 : 0;
  const platformFee = 5; // Token fee for Exhibition Society welfare
  const grandTotal = subtotal > 0 ? subtotal + deliveryCharge + platformFee : 0;

  // Stalls involved
  const distinctStalls = Array.from(new Set(cart.map(i => i.product.stallNumber)));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName,
        customerPhone,
        items: [...cart],
        totalAmount: grandTotal,
        fulfillmentType: fulfillment,
        paymentMode,
        paymentStatus: paymentMode === 'pay_at_stall' ? 'pending_at_stall' : 'paid',
        status: 'confirmed',
        pickupStallNumber: distinctStalls.join(', '),
        deliveryAddress: fulfillment === 'home_delivery' ? deliveryAddress : undefined
      });

      setIsProcessing(false);
      setPlacedOrder(order);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1000);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setPlacedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div
        className="bg-white w-full max-w-lg max-h-[92dvh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {placedOrder ? 'Order Confirmation' : 'Numaish Stall Cart & Checkout'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {cart.length} unique stall item(s) selected
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {placedOrder ? (
            /* Order Placed Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                  Order Successfully Verified
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-2 font-serif">
                  Thank You, {placedOrder.customerName}!
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Order ID: <span className="font-mono font-bold text-slate-700">{placedOrder.orderNumber}</span>
                </p>
              </div>

              {/* Pickup Token Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-4 text-left max-w-sm mx-auto shadow-sm">
                <div className="flex items-center justify-between border-b border-orange-200/60 pb-2 mb-2">
                  <span className="text-xs font-bold text-orange-900">
                    {placedOrder.fulfillmentType === 'stall_pickup'
                      ? '🎪 Stall Pickup Token'
                      : '📦 Home Delivery Scheduled'}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 uppercase">
                    {placedOrder.paymentStatus === 'paid' ? 'Paid via UPI' : 'Pay at Stall'}
                  </span>
                </div>

                {placedOrder.fulfillmentType === 'stall_pickup' ? (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Your 4-Digit Pickup OTP</p>
                      <p className="text-2xl font-black tracking-widest text-orange-600 font-mono">
                        {placedOrder.otpCode}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Show this at: <span className="font-bold text-slate-900">Stall {placedOrder.pickupStallNumber}</span>
                      </p>
                    </div>

                    <div className="w-16 h-16 rounded-xl bg-white p-1 border border-orange-200 flex items-center justify-center shrink-0">
                      <QrCode className="w-12 h-12 text-slate-800" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-700 font-medium">
                      Shipping to: <span className="font-bold">{placedOrder.deliveryAddress}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Courier tracking link sent via SMS to {placedOrder.customerPhone}
                    </p>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-orange-200/60 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Total Amount Paid:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{placedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition"
                >
                  Continue Browsing Numaish Stalls
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Browse handlooms, pearls, dry fruits, and exhibition attractions to add them to your cart.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 bg-orange-600 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-sm hover:bg-orange-700 transition"
              >
                Browse Stalls
              </button>
            </div>
          ) : (
            /* Active Cart & Checkout View */
            <>
              {/* Items List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Selected Products</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h5>
                      <p className="text-[10px] text-orange-700 font-semibold flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        Stall {item.product.stallNumber} • {item.product.stallName}
                      </p>
                      {(item.selectedColor || item.selectedSize) && (
                        <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-600 mt-0.5 flex-wrap">
                          {item.selectedColor && (
                            <span className="bg-orange-100 text-orange-950 px-1.5 py-0.2 rounded font-bold">
                              {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-bold">
                              {item.selectedSize}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs font-bold text-slate-900 mt-0.5">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Fulfillment Option (Stall Pickup vs Home Delivery) */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
                  Delivery / Pickup Preference
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFulfillment('stall_pickup')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                      fulfillment === 'stall_pickup'
                        ? 'border-orange-600 bg-orange-50/70 text-orange-950 ring-1 ring-orange-500'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        Stall Pickup
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">FREE</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Skip queue at physical booth
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillment('home_delivery')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                      fulfillment === 'home_delivery'
                        ? 'border-orange-600 bg-orange-50/70 text-orange-950 ring-1 ring-orange-500'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-orange-600" />
                        Home Delivery
                      </span>
                      <span className="text-[10px] font-bold text-slate-900">+₹80</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Shiprocket courier pan-India
                    </span>
                  </button>
                </div>

                {fulfillment === 'home_delivery' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200">
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Payment Mode Selection */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
                  Select Payment Method
                </label>
                <div className="space-y-1.5 text-xs">
                  <label
                    onClick={() => setPaymentMode('upi')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                      paymentMode === 'upi'
                        ? 'border-orange-600 bg-orange-50/50 text-orange-950'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                        UPI
                      </div>
                      <span className="font-bold">Instant UPI (GPay / PhonePe / Paytm)</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      Zero Surcharge
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMode('card')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                      paymentMode === 'card'
                        ? 'border-orange-600 bg-orange-50/50 text-orange-950'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-slate-600" />
                      <span className="font-semibold">Credit / Debit Card / Net Banking</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMode('pay_at_stall')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                      paymentMode === 'pay_at_stall'
                        ? 'border-orange-600 bg-orange-50/50 text-orange-950'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold">Reserve & Pay at Physical Stall</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Pay on pickup</span>
                  </label>
                </div>
              </div>

              {/* Bill Details */}
              <div className="bg-slate-100/70 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>Items Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {fulfillment === 'home_delivery' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Charges</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Exhibition Society Welfare Cess</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-orange-600">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Button */}
        {!placedOrder && cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0 z-10">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 disabled:opacity-60 text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-orange-600/20 transition active:scale-98"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Pay ₹{grandTotal.toLocaleString('en-IN')} • Confirm Order
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
