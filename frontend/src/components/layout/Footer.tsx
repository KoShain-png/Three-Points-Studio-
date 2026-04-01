'use client';
import Link from 'next/link';
import { Camera, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-100 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Camera size={20} className="text-gold-400" />
            <span className="font-display text-xl text-cream-50">Lumière Studio</span>
          </div>
          <p className="text-cream-200/60 text-sm font-light leading-relaxed">
            Premium photography studio in the heart of Singapore. Capturing life's most precious moments with artistry and care.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="text-cream-200/40 hover:text-gold-400 transition-colors"><Instagram size={18} /></a>
            <a href="#" className="text-cream-200/40 hover:text-gold-400 transition-colors"><Facebook size={18} /></a>
            <a href="mailto:hello@lumierestudio.com" className="text-cream-200/40 hover:text-gold-400 transition-colors"><Mail size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-xs tracking-widest uppercase text-gold-400 mb-6 font-body">Quick Links</h4>
          <ul className="space-y-3">
            {[['/', 'Home'], ['/services', 'Services'], ['/book', 'Book a Session'], ['/dashboard', 'My Bookings']].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-cream-200/60 hover:text-cream-50 text-sm font-light transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest uppercase text-gold-400 mb-6 font-body">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-cream-200/60 text-sm font-light">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold-400" />
              No.61 Sabal Chan 2str, (11)Qtr, Hlaing, Yangon
            </li>
            <li className="flex items-center gap-3 text-cream-200/60 text-sm font-light">
              <Phone size={14} className="shrink-0 text-gold-400" />
              +959 9899 63578
            </li>
            <li className="flex items-center gap-3 text-cream-200/60 text-sm font-light">
              <Mail size={14} className="shrink-0 text-gold-400" />
              ms9022053@gmail.com
            </li>
          </ul>
          <div className="mt-6">
            <h5 className="text-xs tracking-widest uppercase text-cream-200/40 mb-2 font-body">Studio Hours</h5>
            <p className="text-cream-200/60 text-sm font-light">Mon – Fri: 9am – 7pm</p>
            <p className="text-cream-200/60 text-sm font-light">Saturday: 9am – 5pm</p>
            <p className="text-cream-200/60 text-sm font-light">Sunday: Closed</p>
          </div>
        </div>
      </div>
      <div className="border-t border-cream-200/10 py-6 text-center">
        <p className="text-cream-200/30 text-xs font-light tracking-wider">© {new Date().getFullYear()} Lumière Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}
