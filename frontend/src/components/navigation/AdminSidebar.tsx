import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Home,
  Receipt,
  AlertTriangle,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/residences', label: 'Résidences', icon: Building2 },
  { to: '/admin/apartments', label: 'Appartements', icon: Home },
  { to: '/admin/charges', label: 'Charges', icon: Receipt },
  { to: '/admin/incidents', label: 'Incidents', icon: AlertTriangle },
  // Optionally add a user management page if it exists
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Smart Syndic</h2>
        <p className="text-xs text-slate-500">Administration</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}