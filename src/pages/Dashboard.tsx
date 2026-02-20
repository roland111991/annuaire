import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Listing } from '../types';
import { 
  LayoutDashboard, List, MessageSquare, 
  TrendingUp, PlusCircle, Settings, 
  Eye, MessageCircle, MousePointerClick,
  CheckCircle, Clock, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/my-listings')
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: 'Vues totales', value: listings.reduce((acc, l) => acc + l.views, 0), icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Clics contacts', value: '124', icon: MousePointerClick, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avis reçus', value: '12', icon: MessageCircle, icon2: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Fiches actives', value: listings.filter(l => l.status === 'published').length, icon: List, color: 'text-primary', bg: 'bg-red-50' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.name} 👋</h1>
            <p className="text-slate-500">Gérez vos fiches et suivez vos performances en temps réel.</p>
          </div>
          <Link to="/dashboard/new-listing" className="btn-primary flex items-center gap-2">
            <PlusCircle size={20} />
            Ajouter une fiche
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold">Mes fiches annuaire</h3>
                <Link to="/annuaire" className="text-xs text-primary font-bold hover:underline">Voir tout</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Fiche</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Vues</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Chargement...</td></tr>
                    ) : listings.length > 0 ? (
                      listings.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                                <img src={`https://picsum.photos/seed/${l.id}/100/100`} className="w-full h-full object-cover" />
                              </div>
                              <div className="font-bold text-sm">{l.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {l.status === 'published' ? (
                              <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                                <CheckCircle size={10} /> Publié
                              </span>
                            ) : l.status === 'pending' ? (
                              <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                                <Clock size={10} /> En attente
                              </span>
                            ) : (
                              <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 w-fit">
                                <XCircle size={10} /> Rejeté
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{l.views}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary"><Settings size={16} /></button>
                              <Link to={`/listing/${l.slug}`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary"><Eye size={16} /></Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Vous n'avez pas encore de fiche.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold mb-4">Conseils visibilité</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                  <p className="text-xs text-slate-600">Ajoutez au moins 5 photos de haute qualité pour attirer 3x plus de clients.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                  <p className="text-xs text-slate-600">Répondez aux avis clients pour améliorer votre référencement local.</p>
                </div>
              </div>
              <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                En savoir plus
              </button>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white">
              <h3 className="font-bold mb-2">Passer au Premium</h3>
              <p className="text-xs text-slate-400 mb-6">Mettez votre fiche en avant et débloquez des fonctionnalités exclusives.</p>
              <button className="w-full py-3 bg-primary rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">
                Voir les offres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
