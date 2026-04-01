'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { CheckCircle, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { data, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => api.get(`/api/bookings/${id}`).then(r => r.data.booking),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="font-display text-4xl text-charcoal-900 mb-4">You're Booked!</h1>
          <p className="text-charcoal-700/60 font-light mb-10">
            Your session has been confirmed. We'll see you soon at the studio.
          </p>

          {data && !isLoading && (
            <div className="bg-white border border-cream-200 p-8 mb-8 text-left">
              <h3 className="text-xs tracking-widest uppercase font-body text-charcoal-700/50 mb-6">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gold-500" />
                  <span className="font-body text-sm">{format(new Date(data.date + 'T00:00:00'), 'EEEE, d MMMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gold-500" />
                  <span className="font-body text-sm">{data.startTime} – {data.endTime}</span>
                </div>
                <div className="pt-3 border-t border-cream-100 flex justify-between">
                  <span className="text-charcoal-700/50 text-sm font-body">{data.service?.name}</span>
                  <span className="font-display text-lg">S${data.totalPrice}</span>
                </div>
                <div className="pt-1">
                  <span className="text-xs text-charcoal-700/40 font-body">Booking ref: {data.id.slice(0, 8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
              View My Bookings <ArrowRight size={14} />
            </Link>
            <Link href="/" className="btn-outline inline-flex items-center gap-2">
              Back to Home
            </Link>
          </div>

          <p className="text-charcoal-700/30 text-xs mt-8 font-body">
            A confirmation email has been sent. Payment is due at the studio.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
