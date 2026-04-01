'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Service } from '@/types';
import { Clock, Check, ArrowRight, ArrowLeft, Loader2, CalendarDays } from 'lucide-react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { selectedService, selectedDate, selectedTime, notes, step,
    setService, setDate, setTime, setNotes, setStep, reset } = useBookingStore();

  const preselectedServiceId = searchParams.get('service');

  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/api/services').then(r => r.data.services as Service[]),
  });

  const { data: availData, isLoading: availLoading } = useQuery({
    queryKey: ['availability', selectedService?.id, selectedDate],
    queryFn: () => api.get(`/api/availability?serviceId=${selectedService?.id}&date=${selectedDate}`).then(r => r.data),
    enabled: !!selectedService && !!selectedDate,
  });

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post('/api/bookings', payload),
    onSuccess: (res) => {
      reset();
      router.push(`/book/success?id=${res.data.booking.id}`);
    },
  });

  useEffect(() => {
    if (preselectedServiceId && servicesData) {
      const svc = servicesData.find(s => s.id === preselectedServiceId);
      if (svc) { setService(svc); setStep(2); }
    }
  }, [preselectedServiceId, servicesData]);

  const handleBook = () => {
    if (!user) { router.push('/login'); return; }
    if (!selectedService || !selectedDate || !selectedTime) return;
    mutation.mutate({ serviceId: selectedService.id, date: selectedDate, startTime: selectedTime, notes });
  };

  const today = startOfDay(new Date());
  const next60 = Array.from({ length: 60 }, (_, i) => addDays(today, i + 1));

  const steps = ['Choose Service', 'Pick Date & Time', 'Confirm'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 bg-cream-50">
        {/* Progress header */}
        <div className="bg-charcoal-900 py-10">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-3xl text-cream-50 mb-8 text-center">Book Your Session</h1>
            <div className="flex items-center justify-center gap-0">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-body transition-colors ${
                    step === i + 1 ? 'text-gold-400' : step > i + 1 ? 'text-green-400' : 'text-cream-200/30'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                      step > i + 1 ? 'bg-green-400 border-green-400 text-charcoal-900' :
                      step === i + 1 ? 'border-gold-400 text-gold-400' : 'border-cream-200/20 text-cream-200/20'
                    }`}>
                      {step > i + 1 ? <Check size={12} /> : i + 1}
                    </div>
                    <span className="hidden sm:block">{s}</span>
                  </div>
                  {i < 2 && <div className="w-8 h-px bg-cream-200/20" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12">

          {/* Step 1: Choose Service */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl mb-8">Select a Service</h2>
              <div className="grid grid-cols-1 gap-4">
                {servicesData?.map(service => (
                  <button key={service.id} onClick={() => { setService(service); setStep(2); }}
                    className={`card p-6 text-left hover:shadow-md hover:border-gold-400 transition-all duration-200 flex items-center justify-between ${
                      selectedService?.id === service.id ? 'border-gold-400 bg-gold-400/5' : ''
                    }`}>
                    <div>
                      <h3 className="font-display text-xl mb-1">{service.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-charcoal-700/50">
                        <span className="flex items-center gap-1"><Clock size={12} /> {service.duration} min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl">S${service.price}</p>
                      <ArrowRight size={16} className="ml-auto mt-2 text-gold-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && selectedService && (
            <div>
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-charcoal-700/50 hover:text-charcoal-900 transition-colors mb-6">
                <ArrowLeft size={14} /> Back
              </button>
              <h2 className="font-display text-2xl mb-2">Choose Date & Time</h2>
              <p className="text-charcoal-700/50 text-sm mb-8">
                {selectedService.name} — {selectedService.duration} min — S${selectedService.price}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date picker */}
                <div>
                  <label className="label mb-4 flex items-center gap-2"><CalendarDays size={14} /> Select Date</label>
                  <div className="bg-white border border-cream-200 p-4 max-h-64 overflow-y-auto space-y-1">
                    {next60.map(day => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const dayOfWeek = day.getDay();
                      const isSunday = dayOfWeek === 0;
                      return (
                        <button key={dateStr} disabled={isSunday}
                          onClick={() => setDate(dateStr)}
                          className={`w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                            isSunday ? 'text-charcoal-700/20 cursor-not-allowed' :
                            selectedDate === dateStr ? 'bg-charcoal-900 text-cream-50' :
                            'hover:bg-cream-100 text-charcoal-700'
                          }`}>
                          <span className="font-medium">{format(day, 'EEE, dd MMM yyyy')}</span>
                          {isSunday && <span className="ml-2 text-xs opacity-50">Closed</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <label className="label mb-4">Select Time</label>
                  {!selectedDate ? (
                    <div className="bg-white border border-cream-200 p-8 text-center text-charcoal-700/40 text-sm font-body">
                      Please select a date first
                    </div>
                  ) : availLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 size={24} className="animate-spin text-gold-500" />
                    </div>
                  ) : availData?.slots?.length === 0 ? (
                    <div className="bg-white border border-cream-200 p-8 text-center text-charcoal-700/40 text-sm font-body">
                      No slots available on this date
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availData?.slots?.map((slot: string) => (
                        <button key={slot} onClick={() => setTime(slot)}
                          className={`py-2 text-sm font-body border transition-colors ${
                            selectedTime === slot
                              ? 'bg-charcoal-900 text-cream-50 border-charcoal-900'
                              : 'bg-white border-cream-200 text-charcoal-700 hover:border-gold-400'
                          }`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedDate && selectedTime && (
                <div className="mt-8">
                  <label className="label">Special Requests <span className="text-charcoal-700/30">(optional)</span></label>
                  <textarea className="input-field resize-none h-24" placeholder="Any notes or requests for your session…"
                    value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}
                  className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue to Confirm <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && selectedService && selectedDate && selectedTime && (
            <div>
              <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-charcoal-700/50 hover:text-charcoal-900 transition-colors mb-6">
                <ArrowLeft size={14} /> Back
              </button>
              <h2 className="font-display text-2xl mb-8">Confirm Your Booking</h2>

              <div className="bg-white border border-cream-200 p-8 mb-8">
                <h3 className="text-xs tracking-widest uppercase font-body text-charcoal-700/50 mb-6">Booking Summary</h3>
                <div className="space-y-4">
                  {[
                    ['Service', selectedService.name],
                    ['Date', format(new Date(selectedDate + 'T00:00:00'), 'EEEE, d MMMM yyyy')],
                    ['Time', `${selectedTime} — ${(() => { const [h,m] = selectedTime.split(':').map(Number); const e = h*60+m+selectedService.duration; return `${String(Math.floor(e/60)).padStart(2,'0')}:${String(e%60).padStart(2,'0')}`; })()} (${selectedService.duration} min)`],
                    ...(notes ? [['Notes', notes]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm border-b border-cream-100 pb-4 last:border-0 last:pb-0">
                      <span className="text-charcoal-700/50 font-body font-light">{label}</span>
                      <span className="text-charcoal-900 font-body text-right max-w-xs">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4">
                    <span className="font-body font-light">Total</span>
                    <span className="font-display text-2xl text-charcoal-900">S${selectedService.price}</span>
                  </div>
                </div>
              </div>

              {!user && (
                <div className="bg-gold-400/10 border border-gold-400/30 p-4 mb-6 text-sm font-body text-charcoal-700">
                  You need to <a href="/login" className="text-gold-600 underline">sign in</a> or <a href="/register" className="text-gold-600 underline">create an account</a> to complete your booking.
                </div>
              )}

              {mutation.isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">
                  {(mutation.error as any)?.response?.data?.error || 'Booking failed. Please try again.'}
                </div>
              )}

              <button onClick={handleBook} disabled={mutation.isPending || !user}
                className="btn-gold w-full flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {mutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Confirming…</> : <>Confirm Booking — S${selectedService.price} <Check size={16} /></>}
              </button>

              <p className="text-center text-charcoal-700/40 text-xs mt-4 font-body">
                Payment is collected at the studio. Free cancellation up to 48h before your session.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookContent />
    </Suspense>
  );
}
