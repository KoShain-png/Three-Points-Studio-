import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight, Star, Clock, Image as ImageIcon } from 'lucide-react';

export default function HomePage() {
  const services = [
    { name: 'Portrait', duration: '60 min', price: 280, icon: '🎭' },
    { name: 'Couples', duration: '90 min', price: 420, icon: '💞' },
    { name: 'Family', duration: '120 min', price: 580, icon: '🏡' },
    { name: 'Newborn', duration: '180 min', price: 680, icon: '🌸' },
    { name: 'Headshot', duration: '45 min', price: 180, icon: '💼' },
    { name: 'Commercial', duration: 'Full day', price: 2400, icon: '🎬' },
  ];

  const testimonials = [
    { name: 'Sarah L.', text: 'Absolutely breathtaking photos of our newborn. The studio was warm and welcoming — we felt completely at ease.', rating: 5 },
    { name: 'Marcus T.', text: 'Our engagement shoot was a dream. The lighting, the direction, everything was perfect. Highly recommended.', rating: 5 },
    { name: 'Priya K.', text: 'Professional headshots that actually look like me. The turnaround was quick and the quality outstanding.', rating: 5 },
  ];

  return (
    <div className="min-h-screen flex flex-col grain">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden bg-charcoal-900">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1606046604972-77cc76aee944?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/80 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-6 font-body animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Premium Photography Studio · Myanmar
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-cream-50 leading-tight mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Every Frame<br />
            <em className="text-gold-400 not-italic">Tells Your Story</em>
          </h1>
          <p className="text-cream-200/60 font-light text-lg max-w-md mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
            A boutique studio dedicated to capturing life's most precious moments. From newborns to boardrooms, every session is crafted with intention.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/book" className="btn-gold inline-flex items-center gap-2">
              Book Your Session <ArrowRight size={14} />
            </Link>
            <Link href="/services" className="btn-outline border-cream-200 text-cream-50 hover:bg-cream-50 hover:text-charcoal-900 inline-flex items-center gap-2">
              View Services
            </Link>
          </div>

          <div className="flex items-center gap-8 mt-16 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            {[['500+', 'Sessions Completed'], ['12+', 'Years Experience'], ['4.9★', 'Average Rating']].map(([stat, label]) => (
              <div key={label}>
                <p className="font-display text-2xl text-cream-50">{stat}</p>
                <p className="text-cream-200/40 text-xs tracking-wider uppercase font-body mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4 font-body">What We Offer</p>
            <h2 className="section-title">Studio Sessions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s.name} className="card p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display text-xl mb-2">{s.name} Session</h3>
                <div className="flex items-center gap-4 text-charcoal-700/50 text-sm mb-4">
                  <span className="flex items-center gap-1"><Clock size={12} /> {s.duration}</span>
                </div>
                <p className="font-display text-2xl text-charcoal-900 mb-6">
                  S${s.price}
                  <span className="text-sm font-body font-light text-charcoal-700/50 ml-1">/ session</span>
                </p>
                <Link href={`/book`} className="btn-outline w-full text-center block">
                  Book Now
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary inline-flex items-center gap-2">
              View All Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-charcoal-900 text-cream-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ImageIcon size={28} className="text-gold-400" />, title: 'Professional Equipment', desc: 'State-of-the-art cameras, lenses, and studio lighting for perfect results every time.' },
              { icon: <Star size={28} className="text-gold-400" />, title: 'Expert Editing', desc: 'Every image is carefully retouched and colour-graded to achieve a timeless, refined aesthetic.' },
              { icon: <Clock size={28} className="text-gold-400" />, title: 'Fast Delivery', desc: 'Receive your edited gallery within 7 business days. Rush delivery available on request.' },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="flex justify-center mb-6">{f.icon}</div>
                <h3 className="font-display text-xl mb-3">{f.title}</h3>
                <p className="text-cream-200/50 font-light text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4 font-body">Kind Words</p>
            <h2 className="section-title">Client Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8 border border-cream-200">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-charcoal-700 font-light text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <p className="text-xs tracking-widest uppercase font-body text-charcoal-700/50">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gold-500">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl text-white mb-4">Ready to Create Something Beautiful?</h2>
          <p className="text-white/80 font-light mb-8">Book your session today and receive a complimentary style consultation.</p>
          <Link href="/book" className="bg-white text-charcoal-900 px-8 py-4 font-body text-xs tracking-widest uppercase hover:bg-cream-100 transition-colors inline-flex items-center gap-2">
            Book Your Session <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
