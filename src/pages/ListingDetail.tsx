import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Globe, Clock, Star, 
  ShieldCheck, Share2, MessageCircle, ExternalLink,
  ChevronLeft, ChevronRight, Camera
} from 'lucide-react';
import { Listing, Review } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const ListingDetail = () => {
  const { slug } = useParams();
  const [listing, setListing] = useState<(Listing & { reviews: Review[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`/api/listings/${slug}`)
      .then(res => res.json())
      .then(data => {
        setListing(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!listing) return <div className="min-h-screen flex items-center justify-center">Fiche non trouvée</div>;

  const images = listing.images ? JSON.parse(listing.images) : [`https://picsum.photos/seed/${listing.id}/1200/800`];
  const hours = listing.hours ? JSON.parse(listing.hours) : null;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Breadcrumbs & Actions */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/annuaire" className="text-sm text-slate-500 hover:text-primary flex items-center gap-1">
            <ChevronLeft size={16} /> Retour à l'annuaire
          </Link>
          <div className="flex gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Share2 size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Star size={20} /></button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={images[activeImage]} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <button 
                onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setActiveImage((activeImage + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeImage ? 'bg-white w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            {/* Main Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {listing.category_name}
                </span>
                {listing.is_verified === 1 && (
                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck size={14} /> Vérifié
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{listing.title}</h1>
              <div className="flex items-center text-slate-500 mb-8">
                <MapPin size={18} className="mr-2 text-primary" />
                {listing.address}, {listing.city_name}
              </div>

              <div className="prose prose-slate max-w-none mb-12">
                <h3 className="text-xl font-bold mb-4">À propos</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              <hr className="border-slate-100 mb-12" />

              {/* Reviews */}
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Avis clients ({listing.reviews.length})</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(i => <Star key={i} size={20} fill={i <= 4 ? "currentColor" : "none"} />)}
                    </div>
                    <span className="font-bold text-lg">4.0</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {listing.reviews.map(review => (
                    <div key={review.id} className="bg-slate-50 rounded-2xl p-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold">{review.user_name}</span>
                        <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex text-yellow-400 mb-3">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= review.rating ? "currentColor" : "none"} />)}
                      </div>
                      <p className="text-slate-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                  {listing.reviews.length === 0 && (
                    <p className="text-slate-400 text-center py-8 italic">Aucun avis pour le moment. Soyez le premier à en laisser un !</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Contact & Infos</h3>
              
              <div className="space-y-6 mb-8">
                {listing.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Téléphone</div>
                      <div className="font-bold">{listing.phone}</div>
                    </div>
                  </div>
                )}
                {listing.whatsapp && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">WhatsApp</div>
                      <div className="font-bold">{listing.whatsapp}</div>
                    </div>
                  </div>
                )}
                {listing.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Email</div>
                      <div className="font-bold truncate max-w-[180px]">{listing.email}</div>
                    </div>
                  </div>
                )}
                {listing.website && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                      <Globe size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Site Web</div>
                      <a href={listing.website} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline flex items-center gap-1">
                        Visiter <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button className="w-full btn-primary py-4 flex items-center justify-center gap-2">
                  <Phone size={18} /> Appeler maintenant
                </button>
                <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                  <MessageCircle size={18} /> Message WhatsApp
                </button>
              </div>

              {hours && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="font-bold flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-primary" /> Horaires d'ouverture
                  </h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(hours).map(([day, time]: any) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize text-slate-500">{day}</span>
                        <span className="font-medium">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 h-64 overflow-hidden relative">
              <img 
                src="https://picsum.photos/seed/map/400/300" 
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <button className="bg-white px-4 py-2 rounded-lg font-bold shadow-xl flex items-center gap-2">
                  <MapPin size={18} className="text-primary" /> Voir sur Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
