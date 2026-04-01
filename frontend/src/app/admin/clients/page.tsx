'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { ArrowLeft, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminClientsPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, authLoading]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: () => api.get('/api/admin/clients').then(r => r.data.clients),
    enabled: !!user && user.role === 'ADMIN',
  });

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="pt-16">
        <div className="bg-charcoal-900 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <Link href="/admin" className="flex items-center gap-2 text-cream-200/50 text-xs uppercase tracking-widest font-body mb-4 hover:text-cream-200">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <h1 className="font-display text-3xl text-cream-50">Client List</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-gold-500" /></div>
          ) : (
            <div className="bg-white border border-cream-200 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-100">
                  <tr>
                    {['Client', 'Email', 'Phone', 'Total Bookings', 'Joined'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs tracking-widest uppercase font-body text-charcoal-700/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {data?.map((client: any) => (
                    <tr key={client.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cream-200 flex items-center justify-center">
                            <User size={14} className="text-charcoal-700/50" />
                          </div>
                          <span className="text-sm font-body">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal-700/60 font-body">{client.email}</td>
                      <td className="px-6 py-4 text-sm text-charcoal-700/60 font-body">{client.phone || '—'}</td>
                      <td className="px-6 py-4 text-sm font-display">{client._count.bookings}</td>
                      <td className="px-6 py-4 text-sm text-charcoal-700/50 font-body">{format(new Date(client.createdAt), 'd MMM yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data?.length === 0 && (
                <div className="py-16 text-center text-charcoal-700/40 font-body text-sm">No clients yet</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
