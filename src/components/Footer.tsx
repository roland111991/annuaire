import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-bold tracking-tight text-white">Mada<span className="text-primary">Annuaire</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Le premier annuaire professionnel de Madagascar. Trouvez les meilleurs prestataires, commerces et services dans toutes les régions de l'île.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Navigation</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/annuaire" className="hover:text-primary">Annuaire</Link></li>
              <li><Link to="/blog" className="hover:text-primary">Blog & Actualités</Link></li>
              <li><Link to="/register" className="hover:text-primary">Ajouter mon entreprise</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Catégories</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/annuaire?category=hotels-hebergement" className="hover:text-primary">Hôtels & Hébergement</Link></li>
              <li><Link to="/annuaire?category=restaurants-cafes" className="hover:text-primary">Restaurants & Cafés</Link></li>
              <li><Link to="/annuaire?category=sante-medical" className="hover:text-primary">Santé & Médical</Link></li>
              <li><Link to="/annuaire?category=services-professionnels" className="hover:text-primary">Services Pro</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" />
                <span>Antananarivo, Madagascar</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <span>+261 34 00 000 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>contact@mada-annuaire.mg</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 MadaAnnuaire. Tous droits réservés.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">Mentions Légales</a>
            <a href="#" className="hover:text-white">Politique de Confidentialité</a>
            <a href="#" className="hover:text-white">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
