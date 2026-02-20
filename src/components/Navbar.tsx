import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Search, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-bold tracking-tight">Mada<span className="text-primary">Annuaire</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/annuaire" className="text-slate-600 hover:text-primary font-medium">Annuaire</Link>
            <Link to="/blog" className="text-slate-600 hover:text-primary font-medium">Blog</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium">
                  <User size={18} />
                  <span>Mon Compte</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-secondary font-medium">Admin</Link>
                )}
                <button onClick={handleLogout} className="text-slate-400 hover:text-primary">
                  <LogOut size={18} />
                </button>
                <Link to="/dashboard/new-listing" className="btn-primary flex items-center gap-2">
                  <PlusCircle size={18} />
                  <span>Ajouter une fiche</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-primary font-medium">Connexion</Link>
                <Link to="/register" className="btn-primary">Inscription</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2">
          <Link to="/annuaire" className="block py-2 text-slate-600">Annuaire</Link>
          <Link to="/blog" className="block py-2 text-slate-600">Blog</Link>
          <hr className="border-slate-100" />
          {user ? (
            <>
              <Link to="/dashboard" className="block py-2 text-slate-600">Mon Compte</Link>
              {user.role === 'admin' && <Link to="/admin" className="block py-2 text-secondary">Admin</Link>}
              <button onClick={handleLogout} className="block w-full text-left py-2 text-primary">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-slate-600">Connexion</Link>
              <Link to="/register" className="block py-2 text-primary font-bold">Inscription</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
