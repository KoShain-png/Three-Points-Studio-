'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Booking } from '@/types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  CONFIRMED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-500',
  COMPLETED: 'bg-blue-50 text-blue-700',
};

export default function AdminBookingsPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, authLoading]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter],
    queryFn: () => api.get(`/api/admin/bookings${statusFilter ? `?status=${statusFilter}` : ''}`).then(r => r.data.bookings as Booking[]),
    enabled: !!user && user.role === 'ADMIN',
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/admin/bookings/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="pt-16">
        <div className="bg-charcoal-900 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <Link href="/admin" className="flex items-center gap-2 text-cream-200/50 text-xs uppercase tracking-widest font-body mb-4 hover:text-cream-200 transition-colors">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <h1 className="font-display text-3xl text-cream-50">All Bookings</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={clsx('px-3 py-1.5 text-xs tracking-widest uppercase font-body border transition-colors', {
                  'bg-charcoal-900 text-cream-50 border-charcoal-900': statusFilter === s,
                  'bg-white text-charcoal-700 border-cream-200 hover:border-charcoal-900': statusFilter !== s,
                })}>
                {s || 'All'}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-gold-500" /></div>
          ) : (
            <div className="bg-white border border-cream-200 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-100">
                  <tr>
                    {['Client', 'Email', 'Service', 'Date', 'Time', 'Total', 'Status', 'Update'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs tracking-widest uppercase font-body text-charcoal-700/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {data?.map((b: any) => (
                    <tr key={b.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-body">{b.user?.name}</td>
                      <td className="px-4 py-3 text-xs text-charcoal-700/50 font-body">{b.user?.email}</td>
                      <td className="px-4 py-3 text-sm font-body">{b.service?.name}</td>
                      <td className="px-4 py-3 text-sm font-body">{format(new Date(b.date + 'T00:00:00'), 'd MMM yyyy')}</td>
                      <td className="px-4 py-3 text-sm font-body">{b.startTime}–{b.endTime}</td>
                      <td className="px-4 py-3 text-sm font-display">S${b.totalPrice}</td>
                      <td className="px-4 py-3">
                        <span className={clsx('text-xs px-2 py-0.5 font-body uppercase tracking-wider', statusColors[b.status])}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select className="text-xs border border-cream-200 px-2 py-1 font-body bg-white"
                          value={b.status}
                          onChange={e => statusMutation.mutate({ id: b.id, status: e.target.value })}>
                          {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data?.length === 0 && (
                <div className="py-16 text-center text-charcoal-700/40 font-body text-sm">No bookings found</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
