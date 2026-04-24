"use client";

import { useState } from "react";

interface OrderItem {
  packName: string;
  selections: Record<string, number>;
  price: number;
}

export function OrderSection({ cart }: { cart: OrderItem[] }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: ""
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = subtotal >= 899 || subtotal === 0 ? 0 : 49;
  const total = subtotal + deliveryFee;
  const hasFreeTote = total >= 1099;

  const handleWhatsAppOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in your name, phone, and address.");
      return;
    }

    let message = `*NEW ORDER - SUNDAYS COOKIES*%0A%0A`;
    message += `*Name:* ${formData.name}%0A`;
    message += `*Phone:* ${formData.phone}%0A`;
    message += `*Address:* ${formData.address}%0A`;
    if (formData.note) message += `*Note:* ${formData.note}%0A`;
    message += `%0A*Order Details:*%0A`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.packName} - ₹${item.price}%0A`;
      Object.entries(item.selections).forEach(([cookie, count]) => {
        if (count > 0) message += `   - ${cookie}: ${count}%0A`;
      });
    });

    message += `%0A*Subtotal:* ₹${subtotal}%0A`;
    message += `*Delivery:* ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}%0A`;
    if (hasFreeTote) message += `*Gift:* FREE TOTE BAG 🎁%0A`;
    message += `*Total:* ₹${total}%0A`;

    window.open(`https://wa.me/919999999999?text=${message}`, "_blank");
  };

  return (
    <section id="order" className="py-section bg-forest relative">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-gap-lg">
          <p className="text-gold-muted tracking-[0.4em] uppercase text-[10px] font-bold mb-gap-sm">PLACE YOUR ORDER</p>
          <h2 className="text-5xl md:text-6xl font-serif text-white">Almost There</h2>
        </div>

        {/* Unified Order Summary Card */}
        <div className="glass-card p-8 md:p-12 mb-12">
          <div className="space-y-6">
            {cart.map((item, i) => (
              <div key={i} className="border-b border-gold/5 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-serif text-white">{item.packName}</h3>
                  <span className="text-white font-serif">₹{item.price}</span>
                </div>
                <p className="text-white/40 text-sm font-light">
                  {Object.entries(item.selections)
                    .filter(([_, count]) => count > 0)
                    .map(([name, count]) => `${count}× ${name}`)
                    .join(", ")}
                </p>
              </div>
            ))}
            
            {cart.length === 0 && (
              <p className="text-white/30 text-center py-4 font-serif italic">Your cart is empty. Pick a pack to start.</p>
            )}

            <div className="pt-6 space-y-4 border-t border-gold/10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40 uppercase tracking-widest">Delivery</span>
                <span className={deliveryFee === 0 ? "text-green-500 font-bold" : "text-white"}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              
              {hasFreeTote && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-tan uppercase tracking-widest">Gift: Tote Bag</span>
                  <span className="text-green-500 font-bold">FREE</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gold/5">
                <span className="text-white/40 uppercase tracking-[0.2em] font-bold">Total</span>
                <span className="text-tan text-2xl font-serif font-bold">₹{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="space-y-8">
          <div>
            <label className="block text-gold-muted text-[10px] tracking-[0.2em] uppercase font-bold mb-3">Your Name</label>
            <input 
              type="text" 
              placeholder="Full name"
              className="input-premium"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gold-muted text-[10px] tracking-[0.2em] uppercase font-bold mb-3">WhatsApp Number</label>
            <input 
              type="tel" 
              placeholder="+91 98765 43210"
              className="input-premium"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gold-muted text-[10px] tracking-[0.2em] uppercase font-bold mb-3">Delivery Address</label>
            <textarea 
              placeholder="Full address, Hyderabad"
              className="input-premium min-h-[120px] py-4"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gold-muted text-[10px] tracking-[0.2em] uppercase font-bold mb-3">Note (Optional)</label>
            <input 
              type="text" 
              placeholder="Any special requests?"
              className="input-premium"
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
            />
          </div>

          <button 
            onClick={handleWhatsAppOrder}
            className="premium-button w-full py-6 mt-4 flex items-center justify-center gap-3"
          >
            Send Order via WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
