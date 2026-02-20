import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Filter, ChevronDown, Star, ShieldCheck } from 'lucide-react';
import { Listing, Category, City } from '../types';

export const Directory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const currentCity = searchParams.get('city') || '';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/cities').then(res => res.json()).then(setCities);
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(searchParams).toString();
    fetch(`/api/listings?${query}`)
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      });
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Annuaire des professionnels</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher par nom ou mot-clé..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                value={currentSearch}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
            <div className="md:w-64 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select 
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 outline-none appearance-none focus:border-primary bg-white"
                value={currentCity}
                onChange={(e) => updateFilter('city', e.target.value)}
              >
                <option value="">Toutes les villes</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-8">
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Filter size={18} className="text-primary" />
                Catégories
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!currentCategory ? 'bg-primary text-white font-bold' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  Toutes
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentCategory === cat.slug ? 'bg-primary text-white font-bold' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-500 text-sm">
                {loading ? 'Chargement...' : `${listings.length} résultats trouvés`}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Trier par:</span>
                <select className="bg-transparent font-bold outline-none">
                  <option>Plus récents</option>
                  <option>Popularité</option>
                  <option>Mieux notés</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map(listing => (
                  <Link key={listing.id} to={`/listing/${listing.slug}`} className="card group flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 sm:h-auto overflow-hidden">
                      <img 
                        src={listing.images ? JSON.parse(listing.images)[0] : `https://picsum.photos/seed/${listing.id}/600/400`} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-primary font-bold uppercase">{listing.category_name}</span>
                        <div className="flex items-center gap-1 text-xs font-bold">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <span>4.5</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{listing.title}</h3>
                      <div className="flex items-center text-slate-500 text-sm mb-4">
                        <MapPin size={14} className="mr-1" />
                        {listing.city_name}
                      </div>
                      <div className="flex items-center gap-2">
                        {listing.is_verified === 1 && (
                          <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck size={10} /> Vérifié
                          </span>
                        )}
                        {listing.is_featured === 1 && (
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">Sponsorisé</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
                <Search size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-bold mb-2">Aucun résultat trouvé</h3>
                <p className="text-slate-500">Essayez de modifier vos filtres ou votre recherche.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
