"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FREE_DELIVERY_THRESHOLD,
  UNSUPPORTED_PINCODE_MESSAGE,
  getDeliveryQuoteByPincode,
  normalizePincode,
} from "@/lib/delivery";

interface OrderItem {
  packName: string;
  selections: Record<string, number>;
  price: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onClearCart?: () => void;
}

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailedPayment = {
  error: {
    description?: string;
    reason?: string;
  };
};

type RazorpayCheckoutOptions = {
  key: string;
  name: string;
  currency: string;
  amount: number;
  order_id: string;
  description: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal: {
    ondismiss: () => void;
  };
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
};

type RazorpayCheckoutInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: RazorpayFailedPayment) => void) => void;
};

type CreateOrderResponse = {
  order_id?: string;
  id?: string;
  amount?: number;
  currency?: string;
  subtotal?: number;
  delivery?: number;
  total?: number;
  error?: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
}

export function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onClearCart }: CartDrawerProps) {
  const [stage, setStage] = useState<'cart' | 'checkout'>('cart');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    note: ""
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryGoal = FREE_DELIVERY_THRESHOLD;
  const toteGoal = 1099;
  const normalizedPincode = normalizePincode(formData.pincode);
  const deliveryQuote = subtotal > 0 ? getDeliveryQuoteByPincode(normalizedPincode, subtotal) : null;
  const calculatedDeliveryFee = subtotal > 0 ? deliveryQuote?.fee ?? null : 0;
  const hasCompletePincode = normalizedPincode.length === 6;
  const isUnsupportedPincode = hasCompletePincode && calculatedDeliveryFee === null;
  const missingMinimum = hasCompletePincode && deliveryQuote ? deliveryQuote.missingMinimum : 0;
  const isBelowMinimum = missingMinimum > 0;
  const isMiniBitesOnlyOrder =
    cart.length > 0 &&
    cart.every((item) => item.packName === "12 Mini Bites" || item.packName === "24 Mini Bites" || item.packName === "12 Bite-Size Box" || item.packName === "24 Bite-Size Box");
  const isMiniOnlyBlocked = hasCompletePincode && Boolean(deliveryQuote) && deliveryQuote?.zoneId !== "zone1" && isMiniBitesOnlyOrder;
  const miniOnlyBlockedMessage = "Mini Bites are standalone only in Zone 1. Add a regular pack or choose The Sunday Starter combo.";
  const deliveryFee = calculatedDeliveryFee ?? 0;
  const total = subtotal + deliveryFee;
  const deliveryLabel =
    subtotal === 0
      ? "Free"
      : !hasCompletePincode
        ? "Enter pincode"
        : isUnsupportedPincode
          ? "Unavailable"
          : isBelowMinimum
            ? `Add ₹${missingMinimum}`
            : deliveryFee === 0
              ? "FREE"
              : `₹${deliveryFee}`;

  const deliveryProgress = Math.min((subtotal / deliveryGoal) * 100, 100);
  const toteProgress = Math.min((subtotal / toteGoal) * 100, 100);

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const isCheckoutBlocked = isProcessing || !hasCompletePincode || calculatedDeliveryFee === null || isBelowMinimum || isMiniOnlyBlocked;

  const initializeRazorpay = () => {
    if (window.Razorpay) {
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true), { once: true });
        existingScript.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getApiItems = () => cart.map(item => ({
    id: item.packName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: item.packName,
    quantity: 1,
    price: item.price,
    selections: item.selections
  }));

  const submitOrderToBackend = async (payment: RazorpayPaymentResponse) => {
    const apiUrl = `${window.location.origin}/api/order`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        customer: {
          firstName: formData.name ? formData.name.split(' ')[0] : 'Customer',
          email: formData.email,
          whatsapp: formData.phone,
          addressHouse: formData.address,
          addressLocality: "Hyderabad",
          addressCity: "Hyderabad",
          addressState: "Telangana",
          addressPincode: normalizedPincode,
        },
        items: getApiItems(),
        payment
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const result: { success?: boolean; error?: string } = await response.json();
    return result;
  };

  const handleCompleteOrder = async () => {
    setPaymentError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !hasCompletePincode) {
      setPaymentError("Please fill in all delivery details before payment.");
      return;
    }

    if (isUnsupportedPincode || calculatedDeliveryFee === null) {
      setPaymentError(UNSUPPORTED_PINCODE_MESSAGE);
      return;
    }

    if (isMiniOnlyBlocked) {
      setPaymentError(miniOnlyBlockedMessage);
      return;
    }

    if (isBelowMinimum) {
      setPaymentError(`Add ₹${missingMinimum} more to meet the minimum order for your area.`);
      return;
    }

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      setPaymentError("Razorpay public key is missing. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and redeploy.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await initializeRazorpay();
      if (!res || !window.Razorpay) {
        throw new Error("Razorpay checkout failed to load. Please refresh and try again.");
      }

      const createOrderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: getApiItems(),
          pincode: normalizedPincode,
          currency: "INR",
          receipt: `sundays_${Date.now()}`,
        }),
      });

      const data = (await createOrderRes.json()) as CreateOrderResponse;
      if (!createOrderRes.ok || data.error) {
        throw new Error(data.error || "Could not create Razorpay order.");
      }

      const orderId = data.order_id || data.id;
      if (!orderId || !data.amount || !data.currency) {
        throw new Error("Razorpay order response was incomplete.");
      }

      const options: RazorpayCheckoutOptions = {
        key: razorpayKeyId,
        name: "Sundays",
        currency: data.currency,
        amount: data.amount,
        order_id: orderId,
        description: "Sundays Order",
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            const result = await submitOrderToBackend(response);
            if (result.success) {
              setOrderSuccess(true);
              setStage("cart");
              onClearCart?.();
            } else {
              throw new Error(result.error || "Order saving failed after payment.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            setPaymentError(
              error instanceof Error
                ? error.message
                : "Error verifying payment. Please contact us if money was deducted."
            );
          } finally {
             setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#C7A44C", // Using the gold color from the app
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        setPaymentError(
          response.error.description || response.error.reason || "Payment failed. Please try again."
        );
        setIsProcessing(false);
      });
      paymentObject.open();
    } catch (error: unknown) {
      console.error("Order error:", error);
      setPaymentError(error instanceof Error ? error.message : "Could not connect to payment server.");
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black/80 z-[100]" onClick={onClose} />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }}
              className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-[#050D0A] z-[101] flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-8 border border-gold/20">
                <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-4xl font-serif text-white mb-4">Order Reserved</h2>
              <p className="text-tan/60 text-lg mb-10 font-serif italic">Check your email for your receipt. We are preparing your box of joy!</p>
              <button onClick={onClose} className="premium-button w-full py-6">Back to Sundays</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[100]"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-[#050D0A] border-l border-gold/10 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gold/10 flex justify-between items-center">
              <div>
                <p className="text-[11px] tracking-[0.3em] font-bold text-gold-muted uppercase mb-1">
                  {stage === 'cart' ? 'Your Selection' : 'Place Your Order'}
                </p>
                <h2 className="text-3xl font-serif text-white">
                  {stage === 'cart' ? 'Order Summary' : 'Almost There'}
                </h2>
              </div>
              <button onClick={onClose} className="text-gold-muted hover:text-white transition-colors">
                <span className="text-[11px] tracking-widest uppercase font-bold">Close</span>
              </button>
            </div>

            {/* Stages Container */}
            <div className="flex-grow overflow-y-auto">
              <div className="p-8 space-y-10">
                {stage === 'cart' ? (
                  <div className="space-y-10">
                    {/* Rewards Tracker */}
                    <div className="space-y-5 pb-8 border-b border-gold/5">
                      <div className="flex justify-between text-[11px] tracking-widest uppercase font-bold">
                        <span className={subtotal >= deliveryGoal ? "text-green-500" : "text-gold-muted"}>
                          {subtotal >= deliveryGoal ? "Free Delivery Unlocked" : `₹${deliveryGoal - subtotal} more for Free Delivery`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${subtotal >= deliveryGoal ? "bg-green-500" : "bg-gold"}`} style={{ width: `${deliveryProgress}%` }} />
                      </div>
                      
                      <div className="flex justify-between text-[11px] tracking-widest uppercase font-bold">
                        <span className={subtotal >= toteGoal ? "text-green-500" : "text-gold-muted"}>
                          {subtotal >= toteGoal ? "Free Tote Bag Unlocked" : `₹${toteGoal - subtotal} more for Free Tote`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${subtotal >= toteGoal ? "bg-green-500" : "bg-tan"}`} style={{ width: `${toteProgress}%` }} />
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-6">
                      {cart.length === 0 ? (
                        <p className="text-white/20 font-serif italic text-center py-20 text-xl">Your selection is empty.</p>
                      ) : (
                        cart.map((item, index) => (
                          <div key={index} className="bg-white/[0.03] border border-gold/5 rounded-2xl p-6 space-y-4 relative overflow-hidden group">
                            <span className="absolute -right-2 -top-4 text-7xl font-serif text-white/[0.02] italic select-none">
                              {index + 1}
                            </span>

                            <div className="flex justify-between items-center">
                              <span className="text-tan text-[12px] tracking-[0.3em] font-bold uppercase">Box #{index + 1}</span>
                              <button onClick={() => onUpdateQuantity(index, -1)} className="text-white/40 hover:text-red-400 transition-colors text-[11px] uppercase tracking-widest font-bold">Remove</button>
                            </div>

                            <div className="flex justify-between items-baseline">
                              <h3 className="text-2xl font-serif text-white">{item.packName}</h3>
                              <span className="text-white font-serif text-xl">₹{item.price}</span>
                            </div>

                            <div className="space-y-3 pt-3 border-l-2 border-gold/10 pl-6">
                              {Object.entries(item.selections).filter(([, count]) => count > 0).map(([name, count]) => (
                                <div key={name} className="flex justify-between text-sm">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-2 h-2 rounded-full" 
                                      style={{ 
                                        backgroundColor: name === "The Legend" ? "#C7A44C" :
                                                        name === "The Naughty Nutella" ? "#4B3621" : "#FDFD96"
                                      }} 
                                    />
                                    <span className="text-white/60 italic font-serif text-lg">{name}</span>
                                  </div>
                                  <span className="text-tan font-bold">x{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <button onClick={() => setStage('cart')} className="text-gold-muted hover:text-white transition-colors text-[11px] tracking-widest uppercase font-bold flex items-center gap-2 mb-8">
                      ← Back to Selection
                    </button>
                    <p className="-mt-5 rounded-xl border border-gold/10 bg-white/[0.03] px-4 py-3 text-sm font-serif italic text-white/45">
                      Delivery charges are calculated by pincode at checkout.
                    </p>

                    <div className="space-y-10">
                      <div>
                        <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-4">Your Name</label>
                        <input required type="text" placeholder="Full name" className="input-premium h-14 text-base" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-4">Email Address</label>
                        <input required type="email" placeholder="hello@example.com" className="input-premium h-14 text-base" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-4">WhatsApp Number</label>
                        <input required type="tel" placeholder="+91 98765 43210" className="input-premium h-14 text-base" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-4">Delivery Pincode</label>
                        <input
                          required
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="500085"
                          className="input-premium h-14 text-base"
                          value={formData.pincode}
                          onChange={(e) => {
                            setFormData({ ...formData, pincode: normalizePincode(e.target.value) });
                            setPaymentError("");
                          }}
                        />
                        <p className={`mt-3 text-sm font-serif italic ${isUnsupportedPincode ? "text-red-300" : "text-white/45"}`}>
                          {isUnsupportedPincode
                            ? UNSUPPORTED_PINCODE_MESSAGE
                            : hasCompletePincode
                              ? isMiniOnlyBlocked
                                ? miniOnlyBlockedMessage
                                : isBelowMinimum
                                ? `${deliveryQuote?.zoneLabel}: add ₹${missingMinimum} more for this area`
                                : `${deliveryQuote?.zoneLabel}: delivery ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}`
                              : "Enter your Hyderabad pincode to calculate delivery."}
                        </p>
                      </div>
                      <div>
                        <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-4">Delivery Address</label>
                        <textarea required placeholder="Full address, Hyderabad" className="input-premium min-h-[140px] py-4 text-base" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-gold-muted text-[11px] tracking-[0.2em] uppercase font-bold mb-4">Note (Optional)</label>
                        <input type="text" placeholder="Any special requests?" className="input-premium h-14 text-base" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-gold/10 bg-white/[0.02]">
              {cart.length > 0 && (
                <div className="mb-6 space-y-3 border-b border-gold/10 pb-6 text-sm">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Delivery</span>
                    <span>{deliveryLabel}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center mb-8">
                <span className="text-white/40 uppercase tracking-widest text-[11px] font-bold">
                  {stage === 'cart' ? 'Total Selection' : 'Grand Total'}
                </span>
                <span className="text-tan text-3xl font-serif font-bold">₹{total}</span>
              </div>
              {paymentError && (
                <p className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center text-sm text-red-300">
                  {paymentError}
                </p>
              )}
              
              {stage === 'cart' ? (
                <button 
                  onClick={() => {
                    setPaymentError("");
                    setStage('checkout');
                  }}
                  disabled={cart.length === 0}
                  className="premium-button w-full py-6 disabled:opacity-20"
                >
                  Continue to Payment
                </button>
              ) : (
                <button 
                  onClick={handleCompleteOrder}
                  disabled={isCheckoutBlocked}
                  className="premium-button w-full py-6 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Opening Razorpay...
                    </>
                  ) : (
                    isUnsupportedPincode ? "Delivery unavailable" :
                    !hasCompletePincode ? "Enter pincode to continue" :
                    isMiniOnlyBlocked ? "Add regular pack or combo" :
                    isBelowMinimum ? `Add ₹${missingMinimum} more` :
                    `Pay ₹${total} with Razorpay`
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
