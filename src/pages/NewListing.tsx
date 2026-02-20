import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, ArrowLeft, Camera, 
  MapPin, Phone, Globe, Mail, 
  MessageCircle, Info, Tag, X
} from 'lucide-react';
import { Category, City } from '../types';

export const NewListing = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    city_id: '',
    description: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/cities').then(res => res.json()).then(setCities);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: JSON.stringify(images)
        })
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/listing/${data.slug}`);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Retour
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-primary p-8 text-white">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <PlusCircle size={32} /> Ajouter une nouvelle fiche
            </h1>
            <p className="text-white/80">Remplissez les informations ci-dessous pour publier votre activité sur l'annuaire.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3">
                <Info size={18} /> {error}
              </div>
            )}

            {/* Section: Informations de base */}
            <section>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Info size={20} className="text-primary" /> Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'établissement *</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                    placeholder="Ex: Restaurant Le Gourmet"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie *</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="category_id"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary appearance-none bg-white"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ville *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="city_id"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary appearance-none bg-white"
                      value={formData.city_id}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description détaillée *</label>
                  <textarea 
                    name="description"
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                    placeholder="Décrivez votre activité, vos services..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* Section: Contact */}
            <section>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Phone size={20} className="text-primary" /> Coordonnées & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse physique</label>
                  <input 
                    type="text" 
                    name="address"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                    placeholder="Ex: Rue 12, Antanimena"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="phone"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                      placeholder="+261 34 00 000 00"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="whatsapp"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                      placeholder="+261 32 00 000 00"
                      value={formData.whatsapp}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      name="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                      placeholder="contact@etablissement.mg"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Site Web</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="url" 
                      name="website"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                      placeholder="https://www.exemple.mg"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Photos */}
            <section>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Camera size={20} className="text-primary" /> Photos & Logo
              </h3>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all"
                >
                  <PlusCircle size={24} className="mb-2" />
                  <span className="text-xs font-bold">Ajouter</span>
                </button>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <Camera size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">Glissez-déposez vos photos ici ou cliquez pour parcourir</p>
                <button type="button" className="px-6 py-2 bg-slate-100 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                  Sélectionner des fichiers
                </button>
              </div>
            </section>

            <div className="pt-8 flex gap-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 btn-primary py-4 text-lg font-bold disabled:opacity-50"
              >
                {loading ? 'Publication en cours...' : 'Publier ma fiche'}
              </button>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-slate-100 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
