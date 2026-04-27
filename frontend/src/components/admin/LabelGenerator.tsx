'use client';

import React from 'react';
import { MergedOrder } from '@/lib/admin-data';
import { cn } from '@/lib/utils';

interface LabelGeneratorProps {
  order: MergedOrder;
  handwrittenNote?: string;
  onClose: () => void;
}

export default function LabelGenerator({ order, handwrittenNote, onClose }: LabelGeneratorProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-8 print:p-0 print:static print:bg-white">
      <div className="bg-white w-[400px] p-0 rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:w-[4in] print:h-[6in] print:rounded-none relative">
        
        {/* Label Content */}
        <div className="p-8 space-y-8 text-black font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-6">
            <h1 className="text-3xl font-serif tracking-[0.2em] font-bold">SUNDAYS</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black mt-1">Boutique Fresh &middot; Hyderabad</p>
          </div>

          {/* Delivery To */}
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-widest font-black text-gray-500">Deliver To:</p>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold uppercase">{order.customer.firstName} {order.customer.lastName}</h2>
              <p className="text-sm font-medium leading-relaxed">{order.customer.address}</p>
              <p className="text-sm font-bold mt-2">TEL: +91 {order.customer.phone}</p>
            </div>
          </div>

          {/* Package Manifest */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3">Box Contents:</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs font-bold uppercase">
                  <span>{item.name}</span>
                  <span className="bg-black text-white px-2 py-0.5 rounded">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Handwritten Note (The Level 10 Touch) */}
          {handwrittenNote && (
            <div className="pt-4 border-t border-dashed border-gray-200">
              <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-2 italic text-center">Boutique Message</p>
              <p className="font-serif italic text-xl text-center leading-tight text-gray-800">
                "{handwrittenNote}"
              </p>
            </div>
          )}

          {/* Footer / QR */}
          <div className="pt-6 flex justify-between items-end border-t-2 border-black">
            <div className="space-y-1">
              <p className="text-[10px] font-bold">ORD # {order.orderNumber}</p>
              <p className="text-[8px] uppercase tracking-widest text-gray-500">Baked: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center border border-gray-200">
              {/* QR Placeholder */}
              <span className="text-[8px] font-black text-center uppercase leading-none px-2">Sundays Ritual Guide</span>
            </div>
          </div>
        </div>

        {/* UI Overlay (Hidden during print) */}
        <div className="absolute bottom-6 right-6 flex gap-3 print:hidden">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-black text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={handlePrint}
            className="px-8 py-3 bg-black text-white text-[10px] uppercase tracking-widest font-black rounded-full shadow-lg hover:bg-gray-800"
          >
            Print Label
          </button>
        </div>
      </div>

      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 4in;
            height: 6in;
          }
          @page {
            size: 4in 6in;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
