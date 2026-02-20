import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { Category, Listing } from '../types';
import { motion } from 'motion/react';

export const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/listings?featured=true').then(res => res.json()).then(setFeatured);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/annuaire?search=${search}&city=${city}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/madagascar/1920/1080?blur=5" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Découvrez le meilleur de <span className="text-primary">Madagascar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
          >
            Trouvez des entreprises, des services et des commerces locaux en un clic.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-100 py-3 md:py-0">
              <Search className="text-slate-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Que recherchez-vous ?" 
                className="w-full outline-none text-slate-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 md:py-0">
              <MapPin className="text-slate-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Ville ou région" 
                className="w-full outline-none text-slate-700"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary px-8 py-4 text-lg">
              Rechercher
            </button>
          </motion.form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Parcourir par catégorie</h2>
              <p className="text-slate-500">Explorez les services les plus demandés à Madagascar.</p>
            </div>
            <Link to="/annuaire" className="text-primary font-bold flex items-center gap-2 hover:underline">
              Voir tout <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/annuaire?category=${cat.slug}`}
                className="group p-8 rounded-2xl border border-slate-100 bg-slate-50 text-center transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {/* Fallback icon if Lucide icon mapping is complex */}
                  <TrendingUp size={32} />
                </div>
                <h3 className="font-bold text-slate-800">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Prestataires à la une</h2>
            <p className="text-slate-500">Des professionnels vérifiés et recommandés par la communauté.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((listing) => (
              <Link key={listing.id} to={`/listing/${listing.slug}`} className="card group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={listing.images ? JSON.parse(listing.images)[0] : `https://picsum.photos/seed/${listing.id}/600/400`} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span>4.8</span>
                  </div>
                  {listing.is_verified === 1 && (
                    <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>Vérifié</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{listing.category_name}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{listing.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    {listing.city_name}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-400">{listing.views} vues</div>
                    <div className="text-primary font-bold text-sm">Voir détails</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Vous êtes un professionnel ?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">
            Boostez votre visibilité et attirez de nouveaux clients en inscrivant votre entreprise sur MadaAnnuaire.
          </p>
          <Link to="/register?role=pro" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors inline-block">
            Inscrire mon entreprise
          </Link>
        </div>
      </section>
    </div>
  );
};
