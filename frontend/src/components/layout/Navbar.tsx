'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { Menu, X, Camera } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/book', label: 'Book Now' },
    ...(user ? [{ href: '/dashboard', label: 'My Bookings' }] : []),
    ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <img src="/Logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="font-display text-xl text-charcoal-900">Three Points Studio</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'text-xs tracking-widest uppercase font-body transition-colors',
                pathname === l.href ? 'text-gold-500' : 'text-charcoal-700 hover:text-charcoal-900'
              )}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-charcoal-700/60 font-body">{user.name}</span>
              <button onClick={handleLogout} className="text-xs tracking-widest uppercase font-body text-charcoal-700 hover:text-charcoal-900 transition-colors">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs tracking-widest uppercase font-body text-charcoal-700 hover:text-charcoal-900 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-xs px-4 py-2">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-xs tracking-widest uppercase font-body text-charcoal-700">
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="text-xs tracking-widest uppercase font-body text-left text-charcoal-700">
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-xs tracking-widest uppercase font-body text-charcoal-700">Sign In</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="btn-primary inline-block text-center">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
