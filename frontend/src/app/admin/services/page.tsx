'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Service } from '@/types';
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';

const emptyForm = { name: '', description: '', duration: '', price: '', imageUrl: '' };

export default function AdminServicesPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, authLoading]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => api.get('/api/services').then(r => r.data.services as Service[]),
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      editId ? api.put(`/api/services/${editId}`, payload) : api.post('/api/services', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setShowForm(false); setEditId(null); setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-services'] }),
  });

  const handleEdit = (s: Service) => {
    setEditId(s.id); setForm({ name: s.name, description: s.description, duration: String(s.duration), price: String(s.price), imageUrl: s.imageUrl || '' });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...form, duration: Number(form.duration), price: Number(form.price) });
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="pt-16">
        <div className="bg-charcoal-900 py-12">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
            <div>
              <Link href="/admin" className="flex items-center gap-2 text-cream-200/50 text-xs uppercase tracking-widest font-body mb-4 hover:text-cream-200 transition-colors">
                <ArrowLeft size={12} /> Dashboard
              </Link>
              <h1 className="font-display text-3xl text-cream-50">Manage Services</h1>
            </div>
            <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
              className="btn-gold flex items-center gap-2">
              <Plus size={14} /> Add Service
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white border border-cream-200 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl">{editId ? 'Edit Service' : 'Add New Service'}</h2>
                <button type="button" onClick={() => setShowForm(false)}><X size={18} className="text-charcoal-700/50" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Service Name</label>
                  <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Portrait Session" />
                </div>
                <div>
                  <label className="label">Duration (minutes)</label>
                  <input type="number" className="input-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required placeholder="60" />
                </div>
                <div>
                  <label className="label">Price (SGD)</label>
                  <input type="number" className="input-field" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="280" />
                </div>
                <div>
                  <label className="label">Image URL <span className="text-charcoal-700/30">(optional)</span></label>
                  <input className="input-field" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description</label>
                  <textarea className="input-field resize-none h-24" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Describe the session..." />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
                  {saveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {editId ? 'Save Changes' : 'Create Service'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-gold-500" /></div>
          ) : (
            <div className="space-y-4">
              {data?.map(service => (
                <div key={service.id} className="bg-white border border-cream-200 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {service.imageUrl && (
                      <img src={service.imageUrl} alt={service.name} className="w-16 h-16 object-cover" />
                    )}
                    <div>
                      <h3 className="font-display text-lg mb-1">{service.name}</h3>
                      <p className="text-xs text-charcoal-700/50 font-body">{service.duration} min · S${service.price}</p>
                      <p className="text-sm text-charcoal-700/60 font-light mt-1 max-w-md line-clamp-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 font-body uppercase tracking-wider ${service.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => handleEdit(service)} className="p-2 text-charcoal-700/50 hover:text-charcoal-900 transition-colors border border-cream-200 hover:border-charcoal-900">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => { if (confirm('Deactivate this service?')) deleteMutation.mutate(service.id); }}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors border border-red-100 hover:border-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
