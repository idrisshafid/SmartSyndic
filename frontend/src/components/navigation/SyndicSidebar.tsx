import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  Receipt,
  AlertTriangle,
  CalendarCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,BadgeDollarSign,
  Building , Megaphone 
} from 'lucide-react';
import logo from "@/assets/Logo.png"

const navItems = [
  { to: '/syndic/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/syndic/residences', label: 'Résidences', icon: Building2 },
  { to: '/syndic/my-residences', label: 'Mes Résidences', icon: Building },
  { to: '/syndic/apartments', label: 'Appartements', icon: Home },
  { to: '/syndic/owners', label: 'Propriétaires', icon: Users },
  { to: '/syndic/charges', label: 'Charges', icon: Receipt },
  { to: '/syndic/incidents', label: 'Incidents', icon: AlertTriangle },
  { to: '/syndic/reservations', label: 'Réservations', icon: CalendarCheck },
  { to: '/syndic/create-payment', label: 'Valider paiment', icon: BadgeDollarSign },
  { to: '/syndic/announcements', label: 'Annonces', icon: Megaphone },
];

export default function SyndicSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`flex min-h-screen sticky top-0 z-50 border-b
    border-slate-200 
    transition-colors duration-300
    border-r flex flex-col
         flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-41'
      }`}
    >
      {/* En‑tête avec logo + bouton toggle */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-slate-200">
                   <img
          src={logo}
           alt="SGC Logo"
           className="h-13 w-auto flex items-center"/>
           
        {!isCollapsed && (
          
          <h2 className="text-sm font-bold px-2 py-1">Smart Syndic</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md  hover:bg-slate-100 transition"
          aria-label={isCollapsed ? 'Ouvrir la barre latérale' : 'Fermer la barre latérale'}
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
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
                  ? 'bg-orange-500 text-white'
                  : ' hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="px-2 py-3 border-t border-slate-200 m-2">
        <button className="flex items-center gap-2 px-2  rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors w-full">
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}