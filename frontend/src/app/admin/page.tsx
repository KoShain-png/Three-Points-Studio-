'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Stats, Booking } from '@/types';
import { Users, CalendarCheck, DollarSign, TrendingUp, List, Settings, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  CONFIRMED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-500',
  COMPLETED: 'bg-blue-50 text-blue-700',
};

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, authLoading]);

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/api/admin/stats').then(r => r.data),
    enabled: !!user && user.role === 'ADMIN',
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/admin/bookings/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-stats'] }),
  });

  if (authLoading || !user || user.role !== 'ADMIN') return null;

  const stats: Stats = statsData?.stats;
  const recentBookings: Booking[] = statsData?.recentBookings || [];

  const statCards = [
    { label: 'Total Bookings', value: stats?.totalBookings ?? '—', icon: <CalendarCheck size={20} className="text-gold-500" /> },
    { label: 'Confirmed', value: stats?.confirmedBookings ?? '—', icon: <TrendingUp size={20} className="text-green-500" /> },
    { label: 'Total Revenue', value: stats ? `S$${Number(stats.totalRevenue).toLocaleString()}` : '—', icon: <DollarSign size={20} className="text-blue-500" /> },
    { label: 'Total Clients', value: stats?.totalClients ?? '—', icon: <Users size={20} className="text-purple-500" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="bg-charcoal-900 py-12">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <div>
              <p className="text-gold-400 text-xs tracking-[0.3em] uppercase font-body mb-2">Admin Panel</p>
              <h1 className="font-display text-3xl text-cream-50">Studio Dashboard</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/bookings" className="btn-outline border-cream-200 text-cream-50 hover:bg-cream-50 hover:text-charcoal-900 flex items-center gap-2 text-xs">
                <List size={14} /> All Bookings
              </Link>
              <Link href="/admin/services" className="btn-gold flex items-center gap-2 text-xs">
                <Settings size={14} /> Manage Services
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-gold-500" /></div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map(card => (
                  <div key={card.label} className="bg-white border border-cream-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      {card.icon}
                    </div>
                    <p className="font-display text-3xl text-charcoal-900 mb-1">{card.value}</p>
                    <p className="text-xs tracking-wider uppercase font-body text-charcoal-700/50">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="bg-white border border-cream-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
                  <h2 className="font-display text-xl">Recent Bookings</h2>
                  <Link href="/admin/bookings" className="text-xs tracking-widest uppercase font-body text-gold-500 hover:text-gold-600">
                    View All
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-cream-100">
                      <tr>
                        {['Client', 'Service', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs tracking-widest uppercase font-body text-charcoal-700/50">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {recentBookings.map((b: any) => (
                        <tr key={b.id} className="hover:bg-cream-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-body">{b.user?.name}</td>
                          <td className="px-6 py-4 text-sm font-body">{b.service?.name}</td>
                          <td className="px-6 py-4 text-sm font-body">
                            {format(new Date(b.date + 'T00:00:00'), 'd MMM yyyy')}
                          </td>
                          <td className="px-6 py-4 text-sm font-body">{b.startTime}</td>
                          <td className="px-6 py-4">
                            <span className={clsx('text-xs px-2 py-1 font-body uppercase tracking-wider', statusColors[b.status])}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              className="text-xs border border-cream-200 px-2 py-1 font-body bg-white"
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
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { href: '/admin/bookings', label: 'Manage Bookings', desc: 'View and update all bookings' },
                  { href: '/admin/services', label: 'Manage Services', desc: 'Add, edit, or deactivate services' },
                  { href: '/admin/clients', label: 'Client List', desc: 'View all registered clients' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className="bg-white border border-cream-200 p-6 hover:border-gold-400 hover:shadow-md transition-all duration-200">
                    <h3 className="font-display text-lg mb-1">{item.label}</h3>
                    <p className="text-sm text-charcoal-700/50 font-body font-light">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
