import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  Home,Megaphone,
  Receipt,
  AlertTriangle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import logo from "@/assets/Logo.png"
const navItems = [
  { to: '/owner', label: 'Accueil', icon: Home },
  { to: '/owner/residences', label: 'Résidences', icon: Building2 },
  { to: '/owner/apartments', label: 'Appartements', icon: Home },
  { to: '/owner/my-charges', label: 'Mes Charges', icon: Receipt },
  { to: '/owner/incidents', label: 'Incidents', icon: AlertTriangle },
 { to: '/owner/announcements', label: 'announcements', icon: Megaphone },

];

export default function OwnerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`sticky top-0 h-screen border-r border-slate-200 flex 
        flex-col flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-48'
      }`}
    >
      {/* En‑tête avec logo + bouton toggle */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-slate-200">
          <img
          src={logo}
           alt="SGC Logo"
           className="h-9 w-9 flex items-center"/>

        {!isCollapsed && (
          <h2 className="text-sm font-bold ">Smart Syndic</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md  hover:bg-slate-100 transition"
          aria-label={isCollapsed ? 'Ouvrir la barre latérale' : 'Fermer la barre latérale'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="px-2 py-3 border-t border-slate-200">
        <button className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium 
        hover:bg-slate-100 hover:text-slate-900 transition-colors w-full">
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}