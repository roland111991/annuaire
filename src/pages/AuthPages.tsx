import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export const AuthPages = ({ mode }: { mode: 'login' | 'register' }) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || 'user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' ? { email, password } : { name, email, password, role };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/dashboard');
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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
              <span className="text-2xl font-bold tracking-tight">Mada<span className="text-primary">Annuaire</span></span>
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {mode === 'login' ? 'Bon retour parmi nous !' : 'Rejoignez la communauté'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === 'login' 
                ? "Connectez-vous pour gérer vos fiches et avis." 
                : "Créez votre compte en quelques secondes."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                      placeholder="Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                    placeholder="jean@exemple.mg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type de compte</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${role === 'user' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      Particulier
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('pro')}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${role === 'pro' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      Professionnel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Traitement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              {!loading && <ArrowRight size={20} />}
            </button>

            <div className="text-center text-sm">
              <span className="text-slate-500">
                {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
              </span>{' '}
              <Link 
                to={mode === 'login' ? '/register' : '/login'} 
                className="text-primary font-bold hover:underline"
              >
                {mode === 'login' ? "S'inscrire" : "Se connecter"}
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/mada-auth/1000/1200" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-bold mb-6">
            {mode === 'login' 
              ? "Accédez aux meilleurs services de l'île." 
              : "Boostez votre activité locale dès aujourd'hui."}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">1</div>
              <p className="text-lg text-slate-300">Visibilité accrue pour votre entreprise dans toutes les régions.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">2</div>
              <p className="text-lg text-slate-300">Gestion simplifiée de votre profil et de vos avis clients.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">3</div>
              <p className="text-lg text-slate-300">Statistiques détaillées sur vos performances et contacts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
