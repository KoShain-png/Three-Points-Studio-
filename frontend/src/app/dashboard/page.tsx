'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Booking } from '@/types';
import { Calendar, Clock, ArrowRight, X, Loader2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  CONFIRMED: 'bg-green-50 text-green-700 border border-green-200',
  CANCELLED: 'bg-red-50 text-red-500 border border-red-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border border-blue-200',
};

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading]);

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.get('/api/bookings/mine').then(r => r.data.bookings as Booking[]),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/bookings/${id}/cancel`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-bookings'] }),
  });

  const upcoming = data?.filter(b => b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && new Date(b.date) >= new Date()) || [];
  const past = data?.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED' || new Date(b.date) < new Date()) || [];

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 bg-cream-50">
        <div className="bg-charcoal-900 py-12">
          <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
            <div>
              <p className="text-gold-400 text-xs tracking-[0.3em] uppercase font-body mb-2">Welcome back</p>
              <h1 className="font-display text-3xl text-cream-50">{user.name}</h1>
            </div>
            <Link href="/book" className="btn-gold flex items-center gap-2">
              <Plus size={14} /> New Booking
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-gold-500" /></div>
          ) : (
            <>
              {/* Upcoming */}
              <section className="mb-12">
                <h2 className="font-display text-2xl mb-6">Upcoming Sessions</h2>
                {upcoming.length === 0 ? (
                  <div className="bg-white border border-cream-200 p-12 text-center">
                    <p className="text-charcoal-700/40 font-body mb-4">No upcoming sessions</p>
                    <Link href="/book" className="btn-primary inline-flex items-center gap-2">
                      Book a Session <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcoming.map(booking => (
                      <div key={booking.id} className="bg-white border border-cream-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-display text-lg">{booking.service.name}</h3>
                            <span className={clsx('text-xs px-2 py-0.5 font-body uppercase tracking-wider', statusColors[booking.status])}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-charcoal-700/50">
                            <span className="flex items-center gap-1"><Calendar size={12} />
                              {format(new Date(booking.date + 'T00:00:00'), 'EEE, d MMM yyyy')}
                            </span>
                            <span className="flex items-center gap-1"><Clock size={12} />
                              {booking.startTime} – {booking.endTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-display text-xl">S${booking.totalPrice}</span>
                          {booking.status !== 'CANCELLED' && (
                            <button
                              onClick={() => { if (confirm('Cancel this booking?')) cancelMutation.mutate(booking.id); }}
                              disabled={cancelMutation.isPending}
                              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors font-body uppercase tracking-wider border border-red-200 px-3 py-1.5">
                              <X size={12} /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Past */}
              {past.length > 0 && (
                <section>
                  <h2 className="font-display text-2xl mb-6">Past Sessions</h2>
                  <div className="space-y-3">
                    {past.map(booking => (
                      <div key={booking.id} className="bg-white border border-cream-200 p-5 flex items-center justify-between opacity-70">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-body font-light">{booking.service.name}</h3>
                            <span className={clsx('text-xs px-2 py-0.5 font-body uppercase tracking-wider', statusColors[booking.status])}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal-700/40 font-body">
                            {format(new Date(booking.date + 'T00:00:00'), 'd MMM yyyy')} · {booking.startTime}
                          </p>
                        </div>
                        <span className="font-display text-lg">S${booking.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
