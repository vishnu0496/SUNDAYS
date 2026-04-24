"use client";

export function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/919177155540" 
      target="_blank"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all group"
    >
      <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-forest px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl">
        Need help? Chat with us
      </span>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="py-20 bg-forest border-t border-gold/10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-gold text-2xl md:text-3xl font-serif tracking-[0.3em] font-medium uppercase mb-12">
          SUNDAYS
        </h2>
        
        <div className="flex justify-center gap-12 mb-16 text-[10px] tracking-[0.2em] uppercase font-bold text-cream/40">
          <a href="https://instagram.com/sundays.hyd" target="_blank" className="hover:text-gold transition-colors">Instagram</a>
          <a href="https://wa.me/919177155540" target="_blank" className="hover:text-gold transition-colors">WhatsApp</a>
          <a href="mailto:hello@sundays.com" className="hover:text-gold transition-colors">Email</a>
        </div>
        
        <p className="text-cream/20 text-[10px] tracking-[0.2em] uppercase font-bold">
          © 2024 SUNDAYS HYDERABAD. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
