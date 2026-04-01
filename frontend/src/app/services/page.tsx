'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Service } from '@/types';

export default function ServicesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/api/services').then(r => r.data.services as Service[]),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="py-24 bg-charcoal-900 text-cream-50 text-center">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 font-body">Photography Sessions</p>
          <h1 className="font-display text-5xl mb-4">Our Services</h1>
          <p className="text-cream-200/50 font-light max-w-md mx-auto">
            Choose from our carefully curated photography sessions, each designed to tell your unique story.
          </p>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-cream-50">
          <div className="max-w-6xl mx-auto px-6">
            {isLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 size={32} className="animate-spin text-gold-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data?.map((service) => (
                  <div key={service.id} className="card group overflow-hidden">
                    <div className="h-56 overflow-hidden bg-charcoal-800">
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cream-200/20">
                          <span className="font-display text-4xl">L</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="font-display text-2xl">{service.name}</h2>
                        <div className="text-right">
                          <p className="font-display text-2xl text-charcoal-900">S${service.price}</p>
                          <p className="text-xs text-charcoal-700/40 font-body">per session</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-charcoal-700/50 text-sm mb-4">
                        <Clock size={14} />
                        <span className="font-body font-light">{service.duration} minutes</span>
                      </div>
                      <p className="text-charcoal-700/70 font-light text-sm leading-relaxed mb-8">
                        {service.description}
                      </p>
                      <Link href={`/book?service=${service.id}`} className="btn-primary w-full text-center block">
                        Book This Session
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ strip */}
        <section className="py-16 bg-cream-100 border-t border-cream-200">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h3 className="font-display text-2xl mb-4">Have questions?</h3>
            <p className="text-charcoal-700/60 font-light mb-6">All sessions include a pre-shoot consultation, professional editing, and an online gallery. Contact us to discuss custom packages.</p>
            <a href="mailto:hello@lumierestudio.com" className="btn-outline inline-flex items-center gap-2">
              Get in Touch <ArrowRight size={14} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
