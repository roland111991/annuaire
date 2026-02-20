import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Clock, Eye, 
  CheckCircle, XCircle, Shield, 
  Search, Filter, MoreVertical,
  TrendingUp, TrendingDown
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  const statCards = [
    { label: 'Utilisateurs', value: stats?.users?.count || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', up: true },
    { label: 'Fiches totales', value: stats?.listings?.count || 0, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+5%', up: true },
    { label: 'En attente', value: stats?.pending?.count || 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', trend: '-2%', up: false },
    { label: 'Vues globales', value: stats?.views?.count || 0, icon: Eye, color: 'text-green-600', bg: 'bg-green-50', trend: '+24%', up: true },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Shield className="text-primary" /> Administration
            </h1>
            <p className="text-slate-500">Supervisez l'activité de la plateforme et modérez les contenus.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50">Exporter CSV</button>
            <button className="btn-primary">Nouveau CMS</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{loading ? '...' : stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity / Moderation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold">Modération des fiches</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs outline-none focus:ring-1 ring-primary" />
                  </div>
                  <button className="p-1.5 bg-slate-50 rounded-lg text-slate-400"><Filter size={16} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Prestataire</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'Garage du Sud', date: 'Il y a 2h', status: 'pending' },
                      { name: 'Restaurant Le Phare', date: 'Il y a 5h', status: 'pending' },
                      { name: 'Hôtel Baobab', date: 'Hier', status: 'published' },
                      { name: 'Mada Tech', date: 'Hier', status: 'rejected' },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm">{item.name}</div>
                          <div className="text-[10px] text-slate-400">Par: Jean Pro</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">{item.date}</td>
                        <td className="px-6 py-4">
                          {item.status === 'published' ? (
                            <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold">Publié</span>
                          ) : item.status === 'pending' ? (
                            <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded text-[10px] font-bold">En attente</span>
                          ) : (
                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold">Rejeté</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle size={16} /></button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><XCircle size={16} /></button>
                            <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"><MoreVertical size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 text-center">
                <button className="text-xs text-primary font-bold hover:underline">Voir toutes les demandes</button>
              </div>
            </div>
          </div>

          {/* User Management Quick View */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold mb-6">Derniers inscrits</h3>
              <div className="space-y-4">
                {[
                  { name: 'Alice R.', role: 'Particulier', img: '1' },
                  { name: 'Bob M.', role: 'Professionnel', img: '2' },
                  { name: 'Charlie T.', role: 'Professionnel', img: '3' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.role}</div>
                      </div>
                    </div>
                    <button className="text-xs text-slate-400 hover:text-primary">Gérer</button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-slate-50 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                Gérer les utilisateurs
              </button>
            </div>

            <div className="bg-secondary p-6 rounded-2xl shadow-sm text-white">
              <h3 className="font-bold mb-2">Santé du système</h3>
              <div className="flex items-center gap-2 text-xs text-white/80 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Tous les services sont opérationnels
              </div>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between">
                  <span>Base de données</span>
                  <span className="font-bold">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>Serveur API</span>
                  <span className="font-bold">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>Stockage images</span>
                  <span className="font-bold">OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
