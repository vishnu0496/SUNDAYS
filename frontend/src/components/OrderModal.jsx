import { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Phone, MapPin, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const C = {
  bg: "#0A140E",
  surface: "#1C3A2A",
  elevated: "#254836",
  gold: "#C9A84C",
  goldHover: "#DCC275",
  goldDim: "rgba(201,168,76,0.15)",
  text: "#FDFBF7",
  muted: "#A9B8AF",
  border: "rgba(201,168,76,0.18)",
};

export default function OrderModal({ open, onClose, cart, cartTotal, onSubmit }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errs.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
    setForm({ name: "", phone: "", address: "", notes: "" });
    setErrors({});
  };

  const update = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto p-0 border"
        style={{ background: C.bg, borderColor: C.border }}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle
            style={{ color: C.text, fontFamily: "'Playfair Display', serif", fontWeight: 300, fontSize: "1.5rem" }}
          >
            Place Your Order
          </DialogTitle>
          <DialogDescription
            className="text-sm font-light"
            style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}
          >
            Enter your details and we'll confirm via WhatsApp
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          {/* Name */}
          <div>
            <label
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-2"
              style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}
            >
              <User size={12} /> Name
            </label>
            <input
              type="text"
              data-testid="order-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 text-sm outline-none transition-colors"
              style={{
                fontFamily: "Manrope, sans-serif",
                background: C.surface,
                color: C.text,
                border: `1px solid ${errors.name ? "#e55" : C.border}`,
              }}
            />
            {errors.name && (
              <p className="mt-1 text-xs" style={{ color: "#e55", fontFamily: "Manrope, sans-serif" }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-2"
              style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}
            >
              <Phone size={12} /> Phone Number
            </label>
            <div className="flex">
              <span
                className="flex items-center px-3 text-sm shrink-0"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  background: C.elevated,
                  color: C.muted,
                  border: `1px solid ${errors.phone ? "#e55" : C.border}`,
                  borderRight: "none",
                }}
              >
                +91
              </span>
              <input
                type="tel"
                data-testid="order-phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="9177155540"
                className="w-full px-4 py-3 text-sm outline-none"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  background: C.surface,
                  color: C.text,
                  border: `1px solid ${errors.phone ? "#e55" : C.border}`,
                }}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs" style={{ color: "#e55", fontFamily: "Manrope, sans-serif" }}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-2"
              style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}
            >
              <MapPin size={12} /> Delivery Address
            </label>
            <textarea
              data-testid="order-address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Full delivery address"
              rows={3}
              className="w-full px-4 py-3 text-sm outline-none resize-none"
              style={{
                fontFamily: "Manrope, sans-serif",
                background: C.surface,
                color: C.text,
                border: `1px solid ${errors.address ? "#e55" : C.border}`,
              }}
            />
            {errors.address && (
              <p className="mt-1 text-xs" style={{ color: "#e55", fontFamily: "Manrope, sans-serif" }}>
                {errors.address}
              </p>
            )}
          </div>

          {/* Notes (optional) */}
          <div>
            <label
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-2"
              style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}
            >
              <FileText size={12} /> Notes <span className="text-[10px] lowercase tracking-normal opacity-50">(optional)</span>
            </label>
            <input
              type="text"
              data-testid="order-notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Any special requests?"
              className="w-full px-4 py-3 text-sm outline-none"
              style={{
                fontFamily: "Manrope, sans-serif",
                background: C.surface,
                color: C.text,
                border: `1px solid ${C.border}`,
              }}
            />
          </div>

          {/* Order Summary */}
          <div className="pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <p
              className="text-xs uppercase tracking-[0.15em] mb-3"
              style={{ color: C.muted, fontFamily: "Manrope, sans-serif" }}
            >
              Order Summary
            </p>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.cookieId} className="flex items-center justify-between text-sm"
                  style={{ fontFamily: "Manrope, sans-serif" }}>
                  <span style={{ color: "rgba(253,251,247,0.7)" }}>
                    {item.name}
                    {!item.isAssorted && !item.isMini && <span className="opacity-50"> x{item.quantity}</span>}
                    {item.isAssorted && <span className="opacity-50"> (Box of 6)</span>}
                    {item.isMini && <span className="opacity-50"> (Pack)</span>}
                  </span>
                  <span style={{ color: C.gold }}>{"\u20B9"}{item.subtotal}</span>
                </div>
              ))}
            </div>
            <div
              className="flex items-center justify-between mt-4 pt-3 text-base font-bold"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <span style={{ color: C.text, fontFamily: "Manrope, sans-serif" }}>Total</span>
              <span className="sundays-heading text-xl" style={{ color: C.gold }}>{"\u20B9"}{cartTotal}</span>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={submitting}
            data-testid="submit-order-btn"
            className="flex items-center justify-center gap-2.5 w-full py-4 text-sm font-bold tracking-[0.12em] uppercase text-[#0A140E] disabled:opacity-50"
            style={{ background: C.gold, fontFamily: "Manrope, sans-serif" }}
            whileHover={!submitting ? { background: C.goldHover } : {}}
            whileTap={!submitting ? { scale: 0.97 } : {}}
          >
            {submitting ? "Placing Order..." : "Confirm Order"}
          </motion.button>

          <p
            className="text-center text-[11px]"
            style={{ color: "rgba(253,251,247,0.3)", fontFamily: "Manrope, sans-serif" }}
          >
            We'll confirm your order on WhatsApp. Delivery only.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
